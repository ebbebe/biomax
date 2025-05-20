'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getOrders } from '@/lib/actions/order';
import { toast, Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { Order, OrderStatus } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function OrderHistoryPage() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get('customerId');
  const customerName = searchParams.get('customerName');
  const { data: session } = useSession();
  
  // 주문 내역 데이터 상태
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 주문 내역 불러오기
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const result = await getOrders();
        
        if ('error' in result) {
          setError(result.error as string);
        } else {
          setOrders(result as Order[]);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('주문 내역을 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  
  // URL 파라미터에 따라 주문 내역 필터링
  const filteredOrders = customerId 
    ? orders.filter(order => order.customerId === customerId)
    : orders;

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case '완료':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">주문내역</h1>
        {customerName && (
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md flex items-center">
            <span className="font-medium">{customerName}</span>
            <span className="mx-2">의 주문만 표시중</span>
            <a 
              href="/dashboard/order-history" 
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              모든 주문 보기
            </a>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">오류 발생</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-6 rounded-md shadow-sm text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">주문 내역이 없습니다</h3>
          <p className="mt-1 text-gray-500">
            {customerId 
              ? `${customerName || '해당 거래처'}의 등록된 주문이 없습니다.`
              : '아직 등록된 주문이 없습니다.'
            }
          </p>
          {/* 관리자가 다른 회사의 주문을 조회하는 경우(customerId가 있는 경우)에는 버튼 표시하지 않음 */}
          {!customerId && session?.user?.role !== 'admin' && (
            <div className="mt-6">
              <a
                href="/dashboard/order-new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                새 주문 등록하기
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <li key={order.id}>
                <div className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleOrderDetails(order.id)}
                        className="text-left w-full flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            주문 #{order.id}
                          </p>
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <svg 
                            className={`h-5 w-5 text-gray-400 transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </button>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                          </svg>
                          총 {order.items.length}개 품목
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <p>
                          {formatDate(order.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* 주문 상세 정보 */}
                  {expandedOrder === order.id && (
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6 bg-gray-50">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">주문 상세 정보</h3>
                      
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                제품명
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                수량
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                메모
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {order.items.map((item, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {item.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.quantity}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {item.note || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* 주문 메모가 있는 경우 표시 */}
                      {order.note && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700">주문 메모</h4>
                          <div className="mt-1 p-3 bg-white border border-gray-200 rounded-md">
                            <p className="text-sm text-gray-600">{order.note}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
