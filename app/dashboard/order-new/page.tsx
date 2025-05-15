'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/lib/actions/product';
import { createOrder } from '@/lib/actions/order';
import { toast, Toaster } from 'react-hot-toast';

type Product = {
  id: string;
  name: string;
  code: string;
  quantity: number;
};

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
};

export default function OrderNewPage() {
  const router = useRouter();
  
  // 제품 데이터 상태
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 주문 아이템 목록
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  
  // 메모 입력값
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 제품 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await getProducts();
        
        if ('error' in result) {
          setError(result.error as string);
        } else {
          // 수량 필드 추가
          const productsWithQuantity = result.map(product => ({
            ...product,
            quantity: 0
          }));
          setProducts(productsWithQuantity);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('제품 목록을 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 수량 변경 처리
  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 0) return;
    
    setProducts(products.map(product => 
      product.id === id ? { ...product, quantity } : product
    ));
  };

  // 제품 추가 처리
  const handleAddProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    
    if (!product || product.quantity <= 0) {
      toast.error('수량을 입력해주세요.');
      return;
    }
    
    // 새로운 주문 아이템 생성
    const newOrderItem = {
      id: product.id,
      name: product.name,
      quantity: product.quantity
    };
    
    // 이미 같은 제품이 있는지 확인
    const existingItemIndex = orderItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // 기존 아이템 수량 업데이트
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += product.quantity;
      setOrderItems(updatedItems);
    } else {
      // 새 아이템 추가
      setOrderItems(prev => [...prev, newOrderItem]);
    }
    
    // 해당 제품만 초기화
    setProducts(products.map(p => 
      p.id === productId ? { ...p, quantity: 0 } : p
    ));
    
    toast.success('제품이 주문 목록에 추가되었습니다.');
  };
  
  // 주문 제출 처리
  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      toast.error('주문할 제품을 추가해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createOrder({
        items: orderItems,
        note: note || undefined
      });
      
      if ('error' in result) {
        toast.error(result.error as string);
      } else {
        toast.success('주문이 성공적으로 등록되었습니다.');
        // 주문 성공 후 초기화
        setOrderItems([]);
        setNote('');
        
        // 주문 목록 페이지로 이동
        router.push('/dashboard/orders');
      }
    } catch (err) {
      console.error('Error submitting order:', err);
      toast.error('주문 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 주문 아이템 삭제 처리
  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
    toast.success('제품이 주문 목록에서 제거되었습니다.');
  };
  
  // 주문 아이템 수량 변경 처리
  const handleItemQuantityChange = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    
    setOrderItems(orderItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  return (
    <div>
      <Toaster position="top-center" />
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">주문등록</h1>
      
      {/* 주문 정보 */}
      <div className="bg-white shadow overflow-hidden rounded-md mb-6">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            주문 정보
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            주문 내용을 확인하고 제출해주세요.
          </p>
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
        <div>
          {/* 제품 선택 영역 */}
          <div className="bg-white shadow overflow-hidden rounded-md mb-6">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                제품 선택
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                주문할 제품을 선택하고 수량을 입력해주세요.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="max-h-[300px] overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        제품명
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        제품코드
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        수량
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product.code}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(product.id, Math.max(0, product.quantity - 1))}
                              className="p-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
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
                              className="mx-2 w-16 text-center border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                              className="p-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleAddProduct(product.id)}
                            disabled={product.quantity <= 0}
                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${product.quantity > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
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
          
          {/* 주문 목록 */}
          {orderItems.length > 0 && (
            <div className="bg-white shadow overflow-hidden rounded-md mb-6">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">주문 목록</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">주문할 제품 목록입니다.</p>
                </div>
                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting || orderItems.length === 0}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
                >
                  주문제출
                </button>
              </div>
              
              <div className="border-t border-gray-200">
                <div className="max-h-[300px] overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          제품명
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          수량
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          작업
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orderItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={() => handleItemQuantityChange(item.id, Math.max(0, item.quantity - 1))}
                                className="p-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                              >
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleItemQuantityChange(item.id, parseInt(e.target.value) || 0)}
                                className="mx-2 w-16 text-center border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => handleItemQuantityChange(item.id, item.quantity + 1)}
                                className="p-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                              >
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
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
              
              <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="flex-grow mb-3 sm:mb-0">
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                      주문 메모
                    </label>
                    <div className="mt-1">
                      <textarea
                        name="note"
                        id="note"
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="배송 시 요청사항이나 기타 메모를 입력하세요."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
