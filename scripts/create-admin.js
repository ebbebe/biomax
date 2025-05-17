// MongoDB 관리자 계정 생성 스크립트
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// 기본 관리자 계정 정보
const defaultAdmin = {
  username: 'admin',
  password: '1234', // 해싱 전 비밀번호
  name: '관리자',
  role: 'admin',
  status: 'allowed',
  companyName: '바이오맥스',
  businessNumber: '123-45-67890',
  phone: '02-1234-5678',
  address: '서울특별시',
  email: null,
  productIds: [],
  lastLogin: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// 기본 사용자 계정 정보
const defaultUser = {
  username: 'user1',
  password: '1234', // 해싱 전 비밀번호
  name: '사용자',
  role: 'user',
  status: 'allowed',
  companyName: '고객사',
  businessNumber: '123-45-67890',
  phone: '010-1234-5678',
  address: '서울특별시',
  email: null,
  productIds: [],
  lastLogin: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

async function createAccount() {
  // MongoDB 연결
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('MongoDB에 연결되었습니다.');
    
    // 데이터베이스 및 컬렉션 설정
    const db = client.db(process.env.MONGODB_DB || 'biomax');
    const usersCollection = db.collection('users');
    
    // 이미 존재하는지 확인
    const existingAdmin = await usersCollection.findOne({ username: defaultAdmin.username });
    const existingUser = await usersCollection.findOne({ username: defaultUser.username });
    
    // 관리자 계정 생성
    if (!existingAdmin) {
      // 비밀번호 해싱
      const hashedAdminPassword = await bcrypt.hash(defaultAdmin.password, 10);
      const adminToInsert = { ...defaultAdmin, password: hashedAdminPassword };
      
      const adminResult = await usersCollection.insertOne(adminToInsert);
      console.log(`관리자 계정이 생성되었습니다. ID: ${adminResult.insertedId}`);
    } else {
      console.log('관리자 계정이 이미 존재합니다.');
    }
    
    // 사용자 계정 생성
    if (!existingUser) {
      // 비밀번호 해싱
      const hashedUserPassword = await bcrypt.hash(defaultUser.password, 10);
      const userToInsert = { ...defaultUser, password: hashedUserPassword };
      
      const userResult = await usersCollection.insertOne(userToInsert);
      console.log(`일반 사용자 계정이 생성되었습니다. ID: ${userResult.insertedId}`);
    } else {
      console.log('사용자 계정이 이미 존재합니다.');
    }
    
    console.log('------------------------------------------------------');
    console.log('계정 정보:');
    console.log('1. 관리자 계정');
    console.log(`   사용자명: ${defaultAdmin.username}`);
    console.log(`   비밀번호: ${defaultAdmin.password}`);
    console.log('2. 일반 사용자 계정');
    console.log(`   사용자명: ${defaultUser.username}`);
    console.log(`   비밀번호: ${defaultUser.password}`);
    console.log('------------------------------------------------------');
    
  } catch (error) {
    console.error('계정 생성 중 오류 발생:', error);
  } finally {
    await client.close();
    console.log('MongoDB 연결이 종료되었습니다.');
  }
}

// 스크립트 실행
createAccount().catch(console.error); 