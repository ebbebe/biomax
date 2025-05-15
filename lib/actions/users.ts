'use server';

import { getCollection, collections } from '@/lib/mongodb';
import { User, UserRole, UserStatus } from '@/lib/types';
import { ObjectId } from 'mongodb';

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

// 새 사용자 추가
export async function createUser(formData: FormData) {
  try {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const companyName = formData.get('companyName') as string;
    const businessNumber = formData.get('businessNumber') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const status = formData.get('status') as UserStatus;
    const role = formData.get('role') as UserRole;
    
    // 제품 ID 배열 처리
    const productIds = formData.getAll('productIds') as string[];
    
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
    
    const newUser = {
      username,
      password, // 실제 환경에서는 비밀번호를 해싱해야 합니다
      name,
      companyName,
      businessNumber,
      phone,
      address,
      productIds,
      status: status || 'allowed',
      role: role || 'user',
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
export async function updateUser(userId: string, formData: FormData) {
  try {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const companyName = formData.get('companyName') as string;
    const businessNumber = formData.get('businessNumber') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const status = formData.get('status') as UserStatus;
    const role = formData.get('role') as UserRole;
    
    // 제품 ID 배열 처리
    const productIds = formData.getAll('productIds') as string[];
    
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
      productIds,
      status,
      role,
      updatedAt: new Date().toISOString()
    };
    
    // 비밀번호가 제공된 경우에만 업데이트
    if (password) {
      updateData.password = password; // 실제 환경에서는 비밀번호를 해싱해야 합니다
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
