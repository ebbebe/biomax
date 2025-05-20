import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI 환경 변수가 설정되지 않았습니다.');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // 개발 환경에서는 전역 변수를 사용하여 연결 재사용
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // 프로덕션 환경에서는 새 연결 생성
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// 데이터베이스 이름
export const dbName = 'biomax';

// 컬렉션 이름
export const collections = {
  users: 'users',
  products: 'products',
  orders: 'orders',
  sessions: 'sessions',
  cartItems: 'cartItems'
};

// 유틸리티 함수: DB와 컬렉션 가져오기
export async function getCollection(collectionName: string) {
  const client = await clientPromise;
  const db = client.db(dbName);
  return db.collection(collectionName);
}
