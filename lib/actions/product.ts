'use server';

import { getCollection, collections } from '@/lib/mongodb';
import { Product } from '@/lib/types';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

/**
 * 모든 제품 목록을 가져옵니다.
 */
export async function getProducts() {
  try {
    const productsCollection = await getCollection(collections.products);
    const products = await productsCollection.find({}).sort({ name: 1 }).toArray();
    
    return products.map(product => ({
      id: product._id.toString(),
      name: product.name || '',
      code: product.code || '',
      registDate: product.registDate || new Date().toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('제품 목록 조회 오류:', error);
    throw new Error('제품 목록을 가져오는 중 오류가 발생했습니다.');
  }
}

/**
 * 특정 ID의 제품을 가져옵니다.
 */
export async function getProductById(id: string) {
  try {
    const productsCollection = await getCollection(collections.products);
    const product = await productsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!product) {
      return null;
    }
    
    return {
      id: product._id.toString(),
      name: product.name || '',
      code: product.code || '',
      registDate: product.registDate || new Date().toISOString().split('T')[0]
    };
  } catch (error) {
    console.error('제품 조회 오류:', error);
    throw new Error('제품을 가져오는 중 오류가 발생했습니다.');
  }
}

/**
 * 새 제품을 추가합니다.
 */
export async function createProduct(productData: Omit<Product, 'id'>) {
  try {
    const productsCollection = await getCollection(collections.products);
    
    // 제품 코드 중복 확인
    const existingProduct = await productsCollection.findOne({ code: productData.code });
    if (existingProduct) {
      return { error: '이미 존재하는 제품 코드입니다.' };
    }
    
    const newProduct = {
      ...productData,
      registDate: new Date().toISOString().split('T')[0]
    };
    
    const result = await productsCollection.insertOne(newProduct);
    
    // 캐시 갱신
    revalidatePath('/dashboard/products');
    
    return { 
      success: true, 
      id: result.insertedId.toString() 
    };
  } catch (error) {
    console.error('제품 추가 오류:', error);
    return { error: '제품을 추가하는 중 오류가 발생했습니다.' };
  }
}

/**
 * 제품 정보를 업데이트합니다.
 */
export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id'>>) {
  try {
    const productsCollection = await getCollection(collections.products);
    
    // 제품 코드 중복 확인 (코드를 변경하는 경우)
    if (productData.code) {
      const existingProduct = await productsCollection.findOne({ 
        code: productData.code,
        _id: { $ne: new ObjectId(id) }
      });
      
      if (existingProduct) {
        return { error: '이미 존재하는 제품 코드입니다.' };
      }
    }
    
    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: productData }
    );
    
    if (result.matchedCount === 0) {
      return { error: '제품을 찾을 수 없습니다.' };
    }
    
    // 캐시 갱신
    revalidatePath('/dashboard/products');
    
    return { success: true };
  } catch (error) {
    console.error('제품 업데이트 오류:', error);
    return { error: '제품을 업데이트하는 중 오류가 발생했습니다.' };
  }
}

/**
 * 제품을 삭제합니다.
 */
export async function deleteProduct(id: string) {
  try {
    const productsCollection = await getCollection(collections.products);
    
    // 제품이 주문에 포함되어 있는지 확인
    const ordersCollection = await getCollection(collections.orders);
    const orderWithProduct = await ordersCollection.findOne({
      'items.name': { $regex: id, $options: 'i' }
    });
    
    if (orderWithProduct) {
      return { error: '이 제품이 포함된 주문이 있어 삭제할 수 없습니다.' };
    }
    
    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return { error: '제품을 찾을 수 없습니다.' };
    }
    
    // 캐시 갱신
    revalidatePath('/dashboard/products');
    
    return { success: true };
  } catch (error) {
    console.error('제품 삭제 오류:', error);
    return { error: '제품을 삭제하는 중 오류가 발생했습니다.' };
  }
}
