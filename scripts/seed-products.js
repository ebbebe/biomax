// MongoDB 품목(제품) 샘플 데이터 시드 스크립트
require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');

const sampleProducts = [
  { name: '제품1', code: 'P001', registDate: '2024-06-01' },
  { name: '제품2', code: 'P002', registDate: '2024-06-02' },
  { name: '제품3', code: 'P003', registDate: '2024-06-03' },
  { name: '제품4', code: 'P004', registDate: '2024-06-04' },
  { name: '제품5', code: 'P005', registDate: '2024-06-05' },
  { name: '제품6', code: 'P006', registDate: '2024-06-06' },
  { name: '제품7', code: 'P007', registDate: '2024-06-07' },
  { name: '제품8', code: 'P008', registDate: '2024-06-08' },
  { name: '제품9', code: 'P009', registDate: '2024-06-09' },
  { name: '제품10', code: 'P010', registDate: '2024-06-10' },
];

async function seedProducts() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('MongoDB에 연결되었습니다.');

    const db = client.db(process.env.MONGODB_DB || 'biomax');
    const productsCollection = db.collection('products');
    const usersCollection = db.collection('users');

    // 기존 데이터 중복 방지: 동일 코드가 있으면 건너뜀
    const insertedProductIds = [];
    for (const product of sampleProducts) {
      const exists = await productsCollection.findOne({ code: product.code });
      if (!exists) {
        const now = new Date().toISOString();
        const result = await productsCollection.insertOne({
          ...product,
          createdAt: now,
          updatedAt: now
        });
        insertedProductIds.push(result.insertedId);
        console.log(`${product.name} 추가됨 (ID: ${result.insertedId})`);
      } else {
        insertedProductIds.push(exists._id);
        console.log(`${product.name} 이미 존재 (ID: ${exists._id})`);
      }
    }

    // admin 계정의 productIds에 추가
    const admin = await usersCollection.findOne({ username: 'admin' });
    if (admin) {
      const uniqueProductIds = Array.from(new Set([...(admin.productIds || []), ...insertedProductIds.map(id => id.toString())]));
      await usersCollection.updateOne(
        { _id: admin._id },
        { $set: { productIds: uniqueProductIds, updatedAt: new Date().toISOString() } }
      );
      console.log('admin 계정의 productIds가 갱신되었습니다.');
    } else {
      console.log('admin 계정을 찾을 수 없습니다.');
    }

    console.log('샘플 품목 데이터 시드 완료!');
  } catch (error) {
    console.error('시드 중 오류 발생:', error);
  } finally {
    await client.close();
    console.log('MongoDB 연결이 종료되었습니다.');
  }
}

seedProducts().catch(console.error); 