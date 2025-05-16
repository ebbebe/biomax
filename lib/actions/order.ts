'use server';

import { getCollection, collections } from '@/lib/mongodb';
import { Order, OrderItem, OrderStatus } from '@/lib/types';
import { documentToOrder } from '@/lib/utils';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './auth';

/**
 * 모든 주문 목록을 가져옵니다.
 * 관리자는 모든 주문을, 일반 사용자는 자신의 주문만 볼 수 있습니다.
 */
export async function getOrders() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: '인증되지 않은 사용자입니다.' };
    }

    const ordersCollection = await getCollection(collections.orders);
    
    // 관리자는 모든 주문을, 일반 사용자는 자신의 주문만 볼 수 있음
    const query = user.role === 'admin' ? {} : { customerId: user.id };
    
    let orders = await ordersCollection.find(query)
      .sort({ date: -1 }) // 최신순 정렬
      .toArray();
    
    return orders.map(order => documentToOrder(order));
  } catch (error) {
    console.error('주문 목록 조회 오류:', error);
    return { error: '주문 목록을 가져오는 중 오류가 발생했습니다.' };
  }
}

/**
 * 특정 ID의 주문을 가져옵니다.
 */
export async function getOrderById(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: '인증되지 않은 사용자입니다.' };
    }

    const ordersCollection = await getCollection(collections.orders);
    const order = await ordersCollection.findOne({ _id: new ObjectId(id) });
    
    if (!order) {
      return { error: '주문을 찾을 수 없습니다.' };
    }
    
    // 일반 사용자는 자신의 주문만 볼 수 있음
    if (user.role !== 'admin' && order.customerId !== user.id) {
      return { error: '이 주문에 접근할 권한이 없습니다.' };
    }
    
    return documentToOrder(order);
  } catch (error) {
    console.error('주문 조회 오류:', error);
    return { error: '주문을 가져오는 중 오류가 발생했습니다.' };
  }
}

/**
 * 새 주문을 추가합니다.
 */
export async function createOrder(orderData: {
  items: OrderItem[];
  customerName?: string;
  note?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: '인증되지 않은 사용자입니다.' };
    }

    const ordersCollection = await getCollection(collections.orders);
    
    const newOrder = {
      date: new Date().toISOString(),
      status: '대기' as OrderStatus,
      customerId: user.id,
      customerName: orderData.customerName || user.name,
      companyName: user.companyName,
      items: orderData.items,
      note: orderData.note
    };
    
    const result = await ordersCollection.insertOne(newOrder);
    
    // 캐시 갱신
    revalidatePath('/dashboard/orders');
    revalidatePath('/dashboard/order-history');
    
    return { 
      success: true, 
      id: result.insertedId.toString() 
    };
  } catch (error) {
    console.error('주문 추가 오류:', error);
    return { error: '주문을 추가하는 중 오류가 발생했습니다.' };
  }
}

/**
 * 주문 상태를 업데이트합니다.
 * 관리자만 주문 상태를 변경할 수 있습니다.
 */
export async function updateOrderStatus(id: string, status: OrderStatus) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: '인증되지 않은 사용자입니다.' };
    }
    
    // 관리자만 주문 상태 변경 가능
    if (user.role !== 'admin') {
      return { error: '주문 상태를 변경할 권한이 없습니다.' };
    }

    const ordersCollection = await getCollection(collections.orders);
    
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date().toISOString() } }
    );
    
    if (result.matchedCount === 0) {
      return { error: '주문을 찾을 수 없습니다.' };
    }
    
    // 캐시 갱신
    revalidatePath('/dashboard/orders');
    revalidatePath('/dashboard/order-history');
    
    return { success: true };
  } catch (error) {
    console.error('주문 상태 업데이트 오류:', error);
    return { error: '주문 상태를 업데이트하는 중 오류가 발생했습니다.' };
  }
}

/**
 * 주문을 삭제합니다.
 * 관리자만 주문을 삭제할 수 있습니다.
 */
export async function deleteOrder(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: '인증되지 않은 사용자입니다.' };
    }
    
    // 관리자만 주문 삭제 가능
    if (user.role !== 'admin') {
      return { error: '주문을 삭제할 권한이 없습니다.' };
    }

    const ordersCollection = await getCollection(collections.orders);
    
    const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return { error: '주문을 찾을 수 없습니다.' };
    }
    
    // 캐시 갱신
    revalidatePath('/dashboard/orders');
    
    return { success: true };
  } catch (error) {
    console.error('주문 삭제 오류:', error);
    return { error: '주문을 삭제하는 중 오류가 발생했습니다.' };
  }
}
