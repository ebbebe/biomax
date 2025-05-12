'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

type Product = {
  id: string;
  name: string;
  memo: string;
  quantity: number;
};

type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  memo: string;
  status: 'pending' | 'completed';
  createdAt: string;
};

type Vendor = {
  id: string;
  name: string;
  businessNumber: string;
  address: string;
};

export default function OrderNewPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // 현재 로그인한 사용자의 거래처 정보
  const currentVendor: Vendor = {
    id: '1',
    name: '바이오맥스',
    businessNumber: '123-45-67890',
    address: '서울시 강남구 테헤란로 123'
  };
  
  // 거래처별 맞춤형 품목 데이터
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: '제품 1', memo: '기본 제품', quantity: 0 },
    { id: '2', name: '제품 2', memo: '인기 제품', quantity: 0 },
    { id: '3', name: '제품 3', memo: '신상품', quantity: 0 },
    { id: '4', name: '제품 4', memo: '한정판매', quantity: 0 },
    { id: '5', name: '제품 5', memo: '특별 할인', quantity: 0 },
  ]);
  
  // 주문 아이템 목록 (대기 상태)
  const [pendingOrders, setPendingOrders] = useState<OrderItem[]>([]);
  
  // 선택된 주문 아이템 ID 목록
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  
  // 메모 입력값
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 로컬 스토리지에서 주문 데이터 불러오기
  useEffect(() => {
    const savedOrders = localStorage.getItem('pendingOrders');
    if (savedOrders) {
      setPendingOrders(JSON.parse(savedOrders));
    }
  }, []);
  
  // 주문 데이터 저장
  useEffect(() => {
    if (pendingOrders.length > 0) {
      localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
    }
  }, [pendingOrders]);

  // 수량 변경 처리
  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 0) return;
    
    setProducts(products.map(product => 
      product.id === id ? { ...product, quantity } : product
    ));
  };

  // 단일 제품 주문 등록 처리
  const handleAddOrder = (productId: string) => {
    const product = products.find(p => p.id === productId);
    
    if (!product || product.quantity <= 0) {
      alert('수량을 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    // 새로운 주문 아이템 생성
    const newOrderItem = {
      id: `order-${Date.now()}-${product.id}`,
      productId: product.id,
      productName: product.name,
      quantity: product.quantity,
      memo: product.memo + (memo ? ` - ${memo}` : ''),
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };
    
    // 주문 아이템 추가
    setPendingOrders(prev => [...prev, newOrderItem]);
    
    // 해당 제품만 초기화
    setProducts(products.map(p => 
      p.id === productId ? { ...p, quantity: 0 } : p
    ));
    setMemo('');
    setIsSubmitting(false);
    
    alert('주문이 대기 상태로 등록되었습니다.');
  };
  
  // 주문 완료 처리
  const handleCompleteOrders = () => {
    if (selectedOrderIds.length === 0) {
      alert('완료할 주문을 선택해주세요.');
      return;
    }
    
    // 선택된 주문의 상태를 완료로 변경
    setPendingOrders(pendingOrders.map(order => 
      selectedOrderIds.includes(order.id) 
        ? { ...order, status: 'completed' as const } 
        : order
    ));
    
    // 선택 초기화
    setSelectedOrderIds([]);
    
    alert('선택한 주문이 완료 처리되었습니다.');
  };
  
  // 주문 선택 처리
  const handleOrderSelection = (id: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) 
        ? prev.filter(orderId => orderId !== id) 
        : [...prev, id]
    );
  };
  
  // 주문 삭제 처리
  const handleDeleteOrder = (id: string) => {
    setPendingOrders(prev => prev.filter(order => order.id !== id));
    setSelectedOrderIds(prev => prev.filter(orderId => orderId !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">주문등록</h1>
      
      {/* 거래처 정보 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900">거래처 정보</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">현재 로그인한 계정의 거래처 정보입니다.</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">거래처명</dt>
              <dd className="mt-1 text-sm text-gray-900">{currentVendor.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">사업자번호</dt>
              <dd className="mt-1 text-sm text-gray-900">{currentVendor.businessNumber}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">주소</dt>
              <dd className="mt-1 text-sm text-gray-900">{currentVendor.address}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* 제품 선택 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">제품 선택</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">주문할 제품을 체크하고 수량을 입력해주세요.</p>
        </div>
        
        <div className="border-t border-gray-200">
          <div className="max-h-[400px] overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제품명
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    메모
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    수량
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    주문
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className={product.quantity > 0 ? 'bg-blue-50' : ''}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.memo}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(product.id, Math.max(0, product.quantity - 1))}
                          className="inline-flex items-center p-1 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={product.quantity}
                          onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                          className="mx-2 block w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-center"
                        />
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                          className="inline-flex items-center p-1 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (product.quantity > 0) {
                            handleAddOrder(product.id);
                          }
                        }}
                        disabled={isSubmitting || product.quantity <= 0}
                        className="inline-flex justify-center py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                      >
                        주문추가
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* 메모 입력 */}
      <div className="bg-white shadow sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">주문 메모</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>추가 요청사항이 있으면 입력해주세요.</p>
          </div>
          <div className="mt-3">
            <textarea
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="배송 시 요청사항이나 기타 메모를 입력하세요."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* 주문 버튼 */}
      <div className="flex justify-end mb-8">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          취소
        </button>
      </div>
      
      {/* 주문 목록 */}
      {pendingOrders.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900">주문 목록</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">대기 상태의 주문 목록입니다.</p>
            </div>
            <button
              type="button"
              onClick={handleCompleteOrders}
              disabled={selectedOrderIds.length === 0}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
            >
              주문완료
            </button>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="max-h-[300px] overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      선택
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      등록일
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      제품명
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      수량
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      메모
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingOrders
                    .filter(order => order.status === 'pending')
                    .map((order) => (
                    <tr key={order.id} className={selectedOrderIds.includes(order.id) ? 'bg-blue-50' : ''}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.includes(order.id)}
                          onChange={() => handleOrderSelection(order.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.productName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.memo}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          대기
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
