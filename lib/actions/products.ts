'use server';

import { getCollection, collections } from '@/lib/mongodb';
import { Product } from '@/lib/types';
import { ObjectId } from 'mongodb';

// 모든 상품 목록 조회
export async function getAllProducts() {
  try {
    const productsCollection = await getCollection(collections.products);
    const products = await productsCollection.find({}).toArray();
    
    // _id를 id로 변환
    return products.map(product => {
      const { _id, ...rest } = product;
      return { id: _id.toString(), ...rest } as Product;
    });
  } catch (error) {
    console.error('상품 목록 조회 오류:', error);
    throw new Error('상품 목록을 가져오는 중 오류가 발생했습니다.');
  }
}

// 상품 상세 정보 조회
export async function getProductById(productId: string) {
  try {
    const productsCollection = await getCollection(collections.products);
    const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
    
    if (!product) {
      return null;
    }
    
    // _id를 id로 변환
    const { _id, ...rest } = product;
    return { id: _id.toString(), ...rest } as Product;
  } catch (error) {
    console.error('상품 조회 오류:', error);
    throw new Error('상품 정보를 가져오는 중 오류가 발생했습니다.');
  }
}

// 새 상품 추가
export async function createProduct(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const code = formData.get('code') as string;
    const registDate = formData.get('registDate') as string;
    
    if (!name || !code || !registDate) {
      return { error: '모든 필수 필드를 입력해주세요.' };
    }
    
    const productsCollection = await getCollection(collections.products);
    
    // 상품 코드 중복 확인
    const existingProduct = await productsCollection.findOne({ code });
    if (existingProduct) {
      return { error: '이미 사용 중인 상품 코드입니다.' };
    }
    
    const now = new Date().toISOString();
    
    const newProduct = {
      name,
      code,
      registDate,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await productsCollection.insertOne(newProduct);
    
    if (!result.acknowledged) {
      return { error: '상품 추가에 실패했습니다.' };
    }
    
    return { success: true, productId: result.insertedId.toString() };
  } catch (error) {
    console.error('상품 추가 오류:', error);
    return { error: '서버 오류가 발생했습니다.' };
  }
}

// 상품 정보 수정
export async function updateProduct(productId: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const code = formData.get('code') as string;
    const registDate = formData.get('registDate') as string;
    
    if (!name || !code || !registDate) {
      return { error: '모든 필수 필드를 입력해주세요.' };
    }
    
    const productsCollection = await getCollection(collections.products);
    
    // 상품 코드 중복 확인 (자기 자신 제외)
    const existingProduct = await productsCollection.findOne({ 
      code, 
      _id: { $ne: new ObjectId(productId) } 
    });
    
    if (existingProduct) {
      return { error: '이미 사용 중인 상품 코드입니다.' };
    }
    
    const updateData = {
      name,
      code,
      registDate,
      updatedAt: new Date().toISOString()
    };
    
    const result = await productsCollection.updateOne(
      { _id: new ObjectId(productId) },
      { $set: updateData }
    );
    
    if (!result.matchedCount) {
      return { error: '상품을 찾을 수 없습니다.' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('상품 수정 오류:', error);
    return { error: '서버 오류가 발생했습니다.' };
  }
}

// 상품 삭제
export async function deleteProduct(productId: string) {
  try {
    const productsCollection = await getCollection(collections.products);
    
    const result = await productsCollection.deleteOne({ _id: new ObjectId(productId) });
    
    if (!result.deletedCount) {
      return { error: '상품을 찾을 수 없습니다.' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('상품 삭제 오류:', error);
    return { error: '서버 오류가 발생했습니다.' };
  }
}
