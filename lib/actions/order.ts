'use server';

import { getCollection, collections } from '@/lib/mongodb';
import { Order, OrderItem, OrderStatus } from '@/lib/types';
import { documentToOrder } from '@/lib/utils';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './auth';

/**
 * 최근 주문 목록을 가져옵니다.
 * 관리자는 모든 주문을, 일반 사용자는 자신의 주문만 볼 수 있습니다.
 * @param limit 가져올 주문의 최대 개수 (기본값: 5)
 * @param userId 특정 사용자의 주문만 가져올 경우 사용자 ID
 */
export async function getRecentOrders(limit: number = 5, userId?: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: '인증되지 않은 사용자입니다.' };
    }
    
    const ordersCollection = await getCollection(collections.orders);
    
    // 필터 조건 설정 (userId가 있으면 해당 사용자 주문만, 관리자는 모든 주문, 일반 사용자는 자신의 주문만)
    let filter = {};
    if (userId) {
      filter = { customerId: userId };
    } else if (user.role !== 'admin') {
      filter = { customerId: user.id };
    }
    
    const orders = await ordersCollection
      .find(filter)
      .sort({ date: -1 }) // 최신 날짜 기준 정렬
      .limit(limit)
      .toArray();
    
    return orders.map(order => documentToOrder(order));
  } catch (error) {
    console.error('최근 주문 목록 조회 오류:', error);
    return { error: '최근 주문 목록을 가져오는 중 오류가 발생했습니다.' };
  }
}

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
 * 새 주문을 추가합니다.
 */
export async function createOrder(orderData: {
  items: OrderItem[];
  customerName?: string;
  status?: OrderStatus;
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
      status: orderData.status || '완료',
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
 * 주문을 삭제합니다.
 * 사용자는 자신의 주문만 삭제할 수 있습니다.
 */
export async function deleteOrder(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: '인증되지 않은 사용자입니다.' };
    }
    
    // 관리자 권한 체크 제거
    // 대신 사용자는 자신의 주문만 삭제할 수 있도록 제한
    const ordersCollection = await getCollection(collections.orders);
    
    // 삭제할 주문 조회
    const orderToDelete = await ordersCollection.findOne({ _id: new ObjectId(id) });
    if (!orderToDelete) {
      return { error: '주문을 찾을 수 없습니다.' };
    }
    
    // 자신의 주문인지 확인 (관리자는 모든 주문 삭제 가능)
    if (user.role !== 'admin' && orderToDelete.customerId !== user.id) {
      return { error: '자신의 주문만 삭제할 수 있습니다.' };
    }
    
    const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return { error: '주문을 찾을 수 없습니다.' };
    }
    
    // 캐시 갱신
    revalidatePath('/dashboard/orders');
    revalidatePath('/dashboard/order-history');
    
    return { success: true };
  } catch (error) {
    console.error('주문 삭제 오류:', error);
    return { error: '주문을 삭제하는 중 오류가 발생했습니다.' };
  }
}

/**
 * 주문 상태를 업데이트합니다.
 * 완료 상태로 변경할 수 있습니다.
 */
export async function updateOrderStatus(id: string, status: OrderStatus, note?: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: '인증되지 않은 사용자입니다.' };
    }

    const ordersCollection = await getCollection(collections.orders);
    
    // 메모가 제공된 경우 함께 업데이트
    const updateData = note !== undefined 
      ? { status, note } 
      : { status };
    
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
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

export async function checkoutCartItems(cartItemIds: string[], note?: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: '인증되지 않은 사용자입니다.' };
    }

    const cartItemsCollection = await getCollection(collections.cartItems);
    
    // 선택된 장바구니 항목 조회
    const cartItems = await cartItemsCollection.find({
      _id: { $in: cartItemIds.map(id => new ObjectId(id)) },
      userId: user.id
    }).toArray();
    
    if (cartItems.length === 0) {
      return { error: '선택된 장바구니 항목이 없습니다.' };
    }
    
    // OrderItem 형식으로 변환 (각 항목의 메모 포함)
    const orderItems: OrderItem[] = cartItems.map(item => ({
      id: item.productId,
      name: item.name,
      quantity: item.quantity,
      registDate: item.registDate,
      note: item.note
    }));
    
    // 주문 생성 (완료 상태)
    const orderResult = await createOrder({
      items: orderItems,
      status: '완료'
    });
    
    // ... existing code ...
  } catch (error) {
    console.error('장바구니 항목 결제 오류:', error);
    return { error: '장바구니 항목을 결제하는 중 오류가 발생했습니다.' };
  }
}
