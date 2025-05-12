'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
};

export default function OrderNewPage() {
  const router = useRouter();
  // 샘플 제품 데이터
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: '제품 A', unit: 'EA', price: 10000, quantity: 0 },
    { id: '2', name: '제품 B', unit: 'BOX', price: 25000, quantity: 0 },
    { id: '3', name: '제품 C', unit: 'KG', price: 8000, quantity: 0 },
    { id: '4', name: '제품 D', unit: 'EA', price: 15000, quantity: 0 },
    { id: '5', name: '제품 E', unit: 'BOX', price: 30000, quantity: 0 },
  ]);
  
  const [orderNote, setOrderNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 0) return;
    
    setProducts(products.map(product => 
      product.id === id ? { ...product, quantity } : product
    ));
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 주문할 제품이 있는지 확인
    const hasProducts = products.some(product => product.quantity > 0);
    if (!hasProducts) {
      alert('최소 하나 이상의 제품을 선택해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    // 실제 구현에서는 여기서 API 호출을 통해 주문을 서버에 전송합니다.
    // 지금은 프론트엔드만 구현하므로 시뮬레이션합니다.
    setTimeout(() => {
      alert('주문이 성공적으로 등록되었습니다.');
      setIsSubmitting(false);
      router.push('/dashboard/order-history');
    }, 1000);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">주문등록</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">제품 선택</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">주문할 제품과 수량을 선택해주세요.</p>
        </div>
        
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제품명
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  단위
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  단가
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수량
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  금액
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.price.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(product.price * product.quantity).toLocaleString()}원
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                  총 금액:
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {calculateTotal().toLocaleString()}원
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
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
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || calculateTotal() === 0}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isSubmitting ? '주문 처리 중...' : '주문하기'}
        </button>
      </div>
    </div>
  );
}
