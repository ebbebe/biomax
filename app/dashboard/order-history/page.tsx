'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

type OrderStatus = '대기' | '완료';

type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  customerId: string; // 거래처 ID
  customerName: string; // 거래처명
  items: {
    name: string;
    quantity: number;
  }[];
};

export default function OrderHistoryPage() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get('customerId');
  const customerName = searchParams.get('customerName');
  
  // 샘플 주문 내역 데이터
  const [allOrders] = useState<Order[]>([
    {
      id: '1001',
      date: '2025-05-10',
      status: '완료',
      customerId: '2', // 약국A
      customerName: '약국A',
      items: [
        { name: '제품 A', quantity: 2 },
        { name: '제품 B', quantity: 1 },
      ]
    },
    {
      id: '1002',
      date: '2025-05-11',
      status: '대기',
      customerId: '3', // 약국B
      customerName: '약국B',
      items: [
        { name: '제품 C', quantity: 3 },
        { name: '제품 D', quantity: 1 },
      ]
    },
    {
      id: '1003',
      date: '2025-05-12',
      status: '대기',
      customerId: '2', // 약국A
      customerName: '약국A',
      items: [
        { name: '제품 E', quantity: 1 },
      ]
    },
    {
      id: '1004',
      date: '2025-05-13',
      status: '대기',
      customerId: '4', // 약국C
      customerName: '약국C',
      items: [
        { name: '제품 A', quantity: 3 },
        { name: '제품 D', quantity: 1 },
        { name: '제품 B', quantity: 1 },
      ]
    },
  ]);
  
  // 필터링된 주문 내역
  const [orders, setOrders] = useState<Order[]>([]);
  
  // URL 파라미터에 따라 주문 내역 필터링
  useEffect(() => {
    if (customerId) {
      setOrders(allOrders.filter(order => order.customerId === customerId));
    } else {
      setOrders(allOrders);
    }
  }, [customerId, allOrders]);

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
      case '대기':
        return 'bg-yellow-100 text-yellow-800';
      case '완료':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
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
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
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
                        {order.date}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* 주문 상세 정보 */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6 bg-gray-50">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">주문 상세 정보</h3>
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
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    

                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
