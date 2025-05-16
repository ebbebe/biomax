'use server';

import { getCollection, collections } from '@/lib/mongodb';
import { User, UserRole, UserStatus } from '@/lib/types';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

// 모든 사용자 목록 조회
export async function getAllUsers() {
  try {
    const usersCollection = await getCollection(collections.users);
    const users = await usersCollection.find({}).toArray();
    
    // _id를 id로 변환하고 비밀번호 제외
    return users.map(user => {
      const { _id, password, ...rest } = user;
      return { id: _id.toString(), ...rest } as Omit<User, 'password'>;
    });
  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    throw new Error('사용자 목록을 가져오는 중 오류가 발생했습니다.');
  }
}

// 사용자 상세 정보 조회
export async function getUserById(userId: string) {
  try {
    const usersCollection = await getCollection(collections.users);
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return null;
    }
    
    // _id를 id로 변환하고 비밀번호 제외
    const { _id, password, ...rest } = user;
    return { id: _id.toString(), ...rest } as Omit<User, 'password'>;
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    throw new Error('사용자 정보를 가져오는 중 오류가 발생했습니다.');
  }
}

// 비밀번호 해싱 함수
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// 새 사용자 추가
export async function createUser(userData: {
  username: string;
  password: string;
  name: string;
  companyName: string;
  businessNumber: string;
  phone: string;
  address: string;
  productIds: string[];
  status?: UserStatus;
  role?: UserRole;
}) {
  try {
    const { 
      username, password, name, companyName, 
      businessNumber, phone, address, productIds,
      status = 'allowed', role = 'user'
    } = userData;
    
    if (!username || !password || !name || !companyName || !businessNumber || !phone || !address) {
      return { error: '모든 필수 필드를 입력해주세요.' };
    }
    
    const usersCollection = await getCollection(collections.users);
    
    // 사용자명 중복 확인
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return { error: '이미 사용 중인 계정 아이디입니다.' };
    }
    
    const now = new Date().toISOString();
    
    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);
    
    const newUser = {
      username,
      password: hashedPassword,
      name,
      companyName,
      businessNumber,
      phone,
      address,
      productIds: productIds || [],
      status,
      role,
      lastLogin: null,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await usersCollection.insertOne(newUser);
    
    if (!result.acknowledged) {
      return { error: '사용자 추가에 실패했습니다.' };
    }
    
    return { success: true, userId: result.insertedId.toString() };
  } catch (error) {
    console.error('사용자 추가 오류:', error);
    return { error: '서버 오류가 발생했습니다.' };
  }
}

// 사용자 정보 수정
export async function updateUser(userId: string, userData: {
  username: string;
  password?: string;
  name: string;
  companyName: string;
  businessNumber: string;
  phone: string;
  address: string;
  productIds: string[];
  status: UserStatus;
  role: UserRole;
}) {
  try {
    const { 
      username, password, name, companyName, 
      businessNumber, phone, address, productIds,
      status, role
    } = userData;
    
    if (!username || !name || !companyName || !businessNumber || !phone || !address) {
      return { error: '모든 필수 필드를 입력해주세요.' };
    }
    
    const usersCollection = await getCollection(collections.users);
    
    // 사용자명 중복 확인 (자기 자신 제외)
    const existingUser = await usersCollection.findOne({ 
      username, 
      _id: { $ne: new ObjectId(userId) } 
    });
    
    if (existingUser) {
      return { error: '이미 사용 중인 계정 아이디입니다.' };
    }
    
    const updateData: any = {
      username,
      name,
      companyName,
      businessNumber,
      phone,
      address,
      productIds: productIds || [],
      status,
      role,
      updatedAt: new Date().toISOString()
    };
    
    // 비밀번호가 제공된 경우에만 해싱하여 업데이트
    if (password && password.trim() !== '') {
      updateData.password = await hashPassword(password);
    }
    
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );
    
    if (!result.matchedCount) {
      return { error: '사용자를 찾을 수 없습니다.' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('사용자 수정 오류:', error);
    return { error: '서버 오류가 발생했습니다.' };
  }
}

// 사용자 삭제
export async function deleteUser(userId: string) {
  try {
    const usersCollection = await getCollection(collections.users);
    
    // 삭제 전 관리자 수 확인
    const adminCount = await usersCollection.countDocuments({ role: 'admin' });
    const userToDelete = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!userToDelete) {
      return { error: '사용자를 찾을 수 없습니다.' };
    }
    
    // 마지막 관리자는 삭제할 수 없음
    if (userToDelete.role === 'admin' && adminCount <= 1) {
      return { error: '마지막 관리자는 삭제할 수 없습니다.' };
    }
    
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
    
    if (!result.deletedCount) {
      return { error: '사용자를 찾을 수 없습니다.' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('사용자 삭제 오류:', error);
    return { error: '서버 오류가 발생했습니다.' };
  }
}
