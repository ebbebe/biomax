'use server';

import { getCollection, collections } from '@/lib/mongodb';
import { Order, OrderStatus } from '@/lib/types';
import { ObjectId } from 'mongodb';

// 모든 주문 목록 조회
export async function getAllOrders() {
  try {
    const ordersCollection = await getCollection(collections.orders);
    const orders = await ordersCollection.find({}).toArray();
    
    // _id를 id로 변환
    return orders.map(order => {
      const { _id, ...rest } = order;
      return { id: _id.toString(), ...rest } as Order;
    });
  } catch (error) {
    console.error('주문 목록 조회 오류:', error);
    throw new Error('주문 목록을 가져오는 중 오류가 발생했습니다.');
  }
}

// 특정 고객의 주문 목록 조회
export async function getOrdersByCustomerId(customerId: string) {
  try {
    const ordersCollection = await getCollection(collections.orders);
    const orders = await ordersCollection.find({ user_id: customerId }).toArray();
    
    // _id를 id로 변환하고 필드명 변환
    return orders.map(order => {
      const { _id, user_id, customer_name, order_date, ...rest } = order;
      return { 
        id: _id.toString(), 
        customerId: user_id,
        customerName: customer_name,
        date: order_date,
        ...rest 
      } as Order;
    });
  } catch (error) {
    console.error('고객 주문 목록 조회 오류:', error);
    throw new Error('고객 주문 목록을 가져오는 중 오류가 발생했습니다.');
  }
}

// 주문 상세 정보 조회
export async function getOrderById(orderId: string) {
  try {
    const ordersCollection = await getCollection(collections.orders);
    const order = await ordersCollection.findOne({ _id: orderId });
    
    if (!order) {
      return null;
    }
    
    // _id를 id로 변환하고 필드명 변환
    const { _id, user_id, customer_name, order_date, ...rest } = order;
    return { 
      id: _id.toString(), 
      customerId: user_id,
      customerName: customer_name,
      date: order_date,
      ...rest 
    } as Order;
  } catch (error) {
    console.error('주문 조회 오류:', error);
    throw new Error('주문 정보를 가져오는 중 오류가 발생했습니다.');
  }
}

// 주문 상태 변경
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const ordersCollection = await getCollection(collections.orders);
    
    const result = await ordersCollection.updateOne(
      { _id: orderId },
      { 
        $set: { 
          status,
          updatedAt: new Date().toISOString()
        } 
      }
    );
    
    if (!result.matchedCount) {
      return { error: '주문을 찾을 수 없습니다.' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('주문 상태 변경 오류:', error);
    return { error: '서버 오류가 발생했습니다.' };
  }
}

// 새 주문 생성
export async function createOrder(formData: FormData) {
  try {
    const userId = formData.get('userId') as string;
    const customerName = formData.get('customerName') as string;
    const orderDate = formData.get('orderDate') as string;
    const status = (formData.get('status') as OrderStatus) || '대기';
    
    // 주문 항목 처리 (JSON 문자열로 전달된다고 가정)
    const itemsJson = formData.get('items') as string;
    const items = JSON.parse(itemsJson);
    
    if (!userId || !customerName || !orderDate || !items || !items.length) {
      return { error: '모든 필수 필드를 입력해주세요.' };
    }
    
    const ordersCollection = await getCollection(collections.orders);
    
    const now = new Date().toISOString();
    
    // MongoDB 문서 구조에 맞게 변환
    const newOrder = {
      user_id: userId,
      customer_name: customerName,
      order_date: orderDate,
      status,
      items,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await ordersCollection.insertOne(newOrder);
    
    if (!result.acknowledged) {
      return { error: '주문 생성에 실패했습니다.' };
    }
    
    return { success: true, orderId: result.insertedId.toString() };
  } catch (error) {
    console.error('주문 생성 오류:', error);
    return { error: '서버 오류가 발생했습니다.' };
  }
}
