import { Order, OrderItem, OrderStatus } from './types';

/**
 * MongoDB 문서에서 클라이언트 Order 타입으로 변환하는 유틸리티 함수
 * @param doc MongoDB 문서
 * @returns 클라이언트에서 사용할 Order 객체
 */
export function documentToOrder(doc: any): Order {
  return {
    id: doc._id.toString(),
    date: doc.date || new Date().toISOString(),
    status: doc.status || '대기',
    customerId: doc.customerId || '',
    customerName: doc.customerName || '',
    items: doc.items || [],
    note: doc.note
  };
}

/**
 * ISO 문자열 날짜를 한국 로컬 형식으로 변환
 * @param isoDate ISO 문자열 형식의 날짜
 * @returns 한국 로컬 형식의 날짜 문자열 (예: 2023년 5월 15일)
 */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
} 