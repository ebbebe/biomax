'use client';

import { useState } from 'react';

type OrderStatus = '대기' | '완료';

type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  customer: string;
  vendor: {
    name: string;
    businessNumber: string;
    address: string;
    phoneNumber: string;
  };
  items: {
    name: string;
    quantity: number;
  }[];
  note?: string;
};

export default function OrdersPage() {
  // 샘플 주문 데이터
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1001',
      date: '2025-05-10',
      status: '완료',
      customer: '사용자 1',
      vendor: {
        name: '주식회사 바이오맥스',
        businessNumber: '123-45-67890',
        address: '서울특별시 강남구 테헤란로 123',
        phoneNumber: '02-1234-5678'
      },
      items: [
        { name: '제품 A', quantity: 2 },
        { name: '제품 B', quantity: 1 },
      ]
    },
    {
      id: '1002',
      date: '2025-05-11',
      status: '대기',
      customer: '사용자 2',
      vendor: {
        name: '주식회사 메디플러스',
        businessNumber: '234-56-78901',
        address: '경기도 성남시 분당구 분당로 456',
        phoneNumber: '031-234-5678'
      },
      items: [
        { name: '제품 C', quantity: 3 },
        { name: '제품 D', quantity: 1 },
      ],
      note: '빠른 배송 부탁드립니다.'
    },
    {
      id: '1003',
      date: '2025-05-12',
      status: '대기',
      customer: '사용자 3',
      vendor: {
        name: '주식회사 헤일스케어',
        businessNumber: '345-67-89012',
        address: '부산광역시 해운대구 운동장로 789',
        phoneNumber: '051-345-6789'
      },
      items: [
        { name: '제품 E', quantity: 1 },
      ]
    },
  ]);

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // 주문상태변경 기능 삭제

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

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = 
      order.id.includes(searchTerm) || 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">주문확인</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="w-full sm:w-64">
          <label htmlFor="search" className="sr-only">검색</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              id="search"
              name="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="주문번호 또는 고객명 검색"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="status-filter" className="sr-only">상태 필터</label>
          <select
            id="status-filter"
            name="status-filter"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          >
            <option value="all">모든 상태</option>
            <option value="대기">대기</option>
            <option value="완료">완료</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <li key={order.id}>
                <div className="block hover:bg-gray-50">
                  <button
                    onClick={() => toggleOrderDetails(order.id)}
                    className="w-full px-4 py-4 text-left focus:outline-none"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          주문 #{order.id}
                        </h3>
                        <div className="mt-1 flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{order.date}</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-sm text-gray-500">{order.customer}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <svg className="ml-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  
                  {/* 주문 상세 정보 */}
                  {expandedOrder === order.id && (
                    <div className="px-4 py-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 거래처 정보 */}
                        <div className="bg-white border rounded-md p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">거래처 정보</h4>
                          <dl className="space-y-2">
                            <div>
                              <dt className="text-xs font-medium text-gray-500">거래처명</dt>
                              <dd className="mt-1 text-sm text-gray-900">{order.vendor.name}</dd>
                            </div>
                            <div>
                              <dt className="text-xs font-medium text-gray-500">사업자등록번호</dt>
                              <dd className="mt-1 text-sm text-gray-900">{order.vendor.businessNumber}</dd>
                            </div>
                            <div>
                              <dt className="text-xs font-medium text-gray-500">주소</dt>
                              <dd className="mt-1 text-sm text-gray-900">{order.vendor.address}</dd>
                            </div>
                            <div>
                              <dt className="text-xs font-medium text-gray-500">전화번호</dt>
                              <dd className="mt-1 text-sm text-gray-900">{order.vendor.phoneNumber}</dd>
                            </div>
                          </dl>
                        </div>
                        
                        {/* 주문 품목 */}
                        <div className="bg-white border rounded-md p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">주문 품목</h4>
                          <div className="overflow-hidden">
                            <table className="min-w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                    제품명
                                  </th>
                                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                    수량
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {order.items.map((item, index) => (
                                  <tr key={index}>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {item.name}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                      {item.quantity}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      
                      {/* 주문 메모 */}
                      {order.note && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-md">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">주문 메모</h4>
                          <p className="text-sm text-gray-900">{order.note}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-gray-500">
              검색 결과가 없습니다.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
