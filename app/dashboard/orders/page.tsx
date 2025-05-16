'use client';

import { useState, useEffect } from 'react';
import { getOrders } from '@/lib/actions/order';
import { toast, Toaster } from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

import { Order, OrderStatus } from '@/lib/types';

export default function OrdersPage() {
  // 주문 데이터 상태
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // 주문 목록 가져오기
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const result = await getOrders();
        
        if ('error' in result) {
          setError(result.error);
        } else {
          setOrders(result as Order[]);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('주문 목록을 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = 
      order.id.includes(searchTerm) || 
      (order.companyName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <Toaster position="top-center" />
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
              placeholder="주문번호 또는 사업자명 검색"
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
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <li key={order.id} className="px-4 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        주문 #{order.id.substring(order.id.length - 4)}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-2">{order.companyName || "사업자명 없음"}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <svg className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {formatDate(order.date)}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleOrderDetails(order.id)}
                        className="text-sm text-blue-600 hover:text-blue-900"
                      >
                        {expandedOrder === order.id ? '접기' : '상세보기'}
                      </button>
                    </div>
                  </div>
                  
                  {/* 주문 상세 정보 */}
                  {expandedOrder === order.id && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="mb-2">
                        <h4 className="text-sm font-medium text-gray-700">주문 품목</h4>
                        <table className="min-w-full">
                          <thead>
                            <tr>
                              <th scope="col" className="px-2 py-1 text-left text-xs font-medium text-gray-500">
                                제품명
                              </th>
                              <th scope="col" className="px-2 py-1 text-left text-xs font-medium text-gray-500">
                                수량
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, index) => (
                              <tr key={index}>
                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                  {item.name}
                                </td>
                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
                                  {item.quantity}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* 고객 정보 */}
                      <div className="mb-2">
                        <p className="text-sm text-gray-900">사업자명: {order.companyName || "사업자명 없음"}</p>
                        <p className="text-sm text-gray-900">고객명: {order.customerName}</p>
                        <p className="text-sm text-gray-900">주문일자: {formatDate(order.date)}</p>
                      </div>
                      
                      {/* 주문 메모 */}
                      {order.note && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-900">메모: {order.note}</p>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li className="py-4 px-6 text-center text-gray-500">
                검색 결과가 없습니다.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
