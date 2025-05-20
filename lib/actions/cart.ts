'use server';

import { getCollection, collections } from '@/lib/mongodb';
import { CartItem, OrderItem } from '@/lib/types';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './auth';
import { createOrder } from './order';

/**
 * 사용자의 장바구니 항목 목록을 가져옵니다.
 */
export async function getCartItems() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: '인증되지 않은 사용자입니다.' };
    }
    
    const cartItemsCollection = await getCollection(collections.cartItems);
    
    const cartItems = await cartItemsCollection
      .find({ userId: user.id })
      .sort({ createdAt: -1 })
      .toArray();
    
    return cartItems.map(item => {
      const { _id, ...rest } = item;
      return { id: _id.toString(), ...rest };
    });
  } catch (error) {
    console.error('장바구니 조회 오류:', error);
    return { error: '장바구니 목록을 가져오는 중 오류가 발생했습니다.' };
  }
}

/**
 * 장바구니에 제품을 추가합니다.
 */
export async function addToCart(item: {
  productId: string;
  name: string;
  quantity: number;
  registDate?: string;
  note?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: '인증되지 않은 사용자입니다.' };
    }

    const cartItemsCollection = await getCollection(collections.cartItems);
    
    // 항상 새 장바구니 항목 추가 (중복 체크 제거)
    const now = new Date().toISOString();
    const newCartItem = {
      userId: user.id,
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      registDate: item.registDate,
      note: item.note,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await cartItemsCollection.insertOne(newCartItem);
    
    if (!result.acknowledged) {
      return { error: '장바구니에 추가하는데 실패했습니다.' };
    }
    
    revalidatePath('/dashboard/order-new');
    return { success: true, id: result.insertedId.toString() };
  } catch (error) {
    console.error('장바구니 추가 오류:', error);
    return { error: '장바구니에 추가하는 중 오류가 발생했습니다.' };
  }
}

/**
 * 장바구니에서 항목을 삭제합니다.
 */
export async function removeFromCart(itemId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: '인증되지 않은 사용자입니다.' };
    }

    const cartItemsCollection = await getCollection(collections.cartItems);
    
    // 현재 사용자의 장바구니 항목인지 확인
    const cartItem = await cartItemsCollection.findOne({
      _id: new ObjectId(itemId),
      userId: user.id
    });
    
    if (!cartItem) {
      return { error: '장바구니 항목을 찾을 수 없거나 권한이 없습니다.' };
    }
    
    const result = await cartItemsCollection.deleteOne({ _id: new ObjectId(itemId) });
    
    if (!result.deletedCount) {
      return { error: '장바구니에서 삭제하는데 실패했습니다.' };
    }
    
    revalidatePath('/dashboard/order-new');
    return { success: true };
  } catch (error) {
    console.error('장바구니 삭제 오류:', error);
    return { error: '장바구니에서 삭제하는 중 오류가 발생했습니다.' };
  }
}

/**
 * 장바구니 항목의 메모를 업데이트합니다.
 */
export async function updateCartItemNote(itemId: string, note: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: '인증되지 않은 사용자입니다.' };
    }

    const cartItemsCollection = await getCollection(collections.cartItems);
    
    // 현재 사용자의 장바구니 항목인지 확인
    const cartItem = await cartItemsCollection.findOne({
      _id: new ObjectId(itemId),
      userId: user.id
    });
    
    if (!cartItem) {
      return { error: '장바구니 항목을 찾을 수 없거나 권한이 없습니다.' };
    }
    
    const result = await cartItemsCollection.updateOne(
      { _id: new ObjectId(itemId) },
      { $set: { note, updatedAt: new Date().toISOString() } }
    );
    
    if (!result.modifiedCount) {
      return { error: '메모 업데이트에 실패했습니다.' };
    }
    
    revalidatePath('/dashboard/order-new');
    return { success: true };
  } catch (error) {
    console.error('메모 업데이트 오류:', error);
    return { error: '메모 업데이트 중 오류가 발생했습니다.' };
  }
}

/**
 * 선택된 장바구니 항목들로 주문을 생성하고 완료 처리합니다.
 */
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
    
    // OrderItem 형식으로 변환
    const orderItems: OrderItem[] = cartItems.map(item => ({
      id: item.productId,
      name: item.name,
      quantity: item.quantity,
      registDate: item.registDate
    }));
    
    // 주문 생성 (완료 상태)
    const orderResult = await createOrder({
      items: orderItems,
      note,
      status: '완료'
    });
    
    if ('error' in orderResult) {
      return { error: `주문 생성 실패: ${orderResult.error}` };
    }
    
    // 주문이 생성되면 장바구니 항목 삭제
    const deleteResult = await cartItemsCollection.deleteMany({
      _id: { $in: cartItems.map(item => item._id) }
    });
    
    if (!deleteResult.acknowledged) {
      console.warn('장바구니 항목 삭제 실패. 주문 ID:', orderResult.id);
    }
    
    revalidatePath('/dashboard/order-new');
    revalidatePath('/dashboard/orders');
    revalidatePath('/dashboard/order-history');
    
    return { 
      success: true, 
      orderId: orderResult.id
    };
  } catch (error) {
    console.error('주문 완료 오류:', error);
    return { error: '주문 완료 처리 중 오류가 발생했습니다.' };
  }
} 