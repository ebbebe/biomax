'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/lib/actions/product';
import { createOrder, updateOrderStatus, getOrders, deleteOrder } from '@/lib/actions/order';
import { toast, Toaster } from 'react-hot-toast';
import { Order, OrderStatus } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { getUserProductIds } from '@/lib/actions/users';
import { sendOrderCompletionEmail } from '@/lib/email';

// 날짜를 yyyy-MM-dd 형식으로 변환하는 함수
const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  
  // ISO 문자열인 경우 (yyyy-MM-ddTHH:mm:ss.sssZ)
  if (dateString.includes('T')) {
    return dateString.split('T')[0];
  }
  
  return dateString;
};

type Product = {
  id: string;
  name: string;
  code: string;
  quantity: number;
  registDate?: string;
};

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  registDate?: string;
};

type ProcessingOrder = Order & {
  checked: boolean;
};

export default function OrderNewPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  // 제품 데이터 상태
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 주문 아이템 목록
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  
  // 대기중인 주문 목록
  const [pendingOrders, setPendingOrders] = useState<ProcessingOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // 메모 입력값
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 메모 수정 상태
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState('');
  
  // 제품 검색어
  const [searchTerm, setSearchTerm] = useState('');
  
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
          let productsWithQuantity = result.map(product => ({
            ...product,
            quantity: 0
          }));
          
          // 일반 사용자는 계정에 연결된 제품만 표시 (DB에서 직접 조회)
          if (session?.user && session.user.role !== 'admin') {
            try {
              const userProductsResult = await getUserProductIds(session.user.id);
              
              if ('error' in userProductsResult) {
                setError(userProductsResult.error as string || '사용자별 제품 목록을 가져오는 중 오류가 발생했습니다.');
              } else {
                const userProductIds = userProductsResult.productIds;
                
                productsWithQuantity = productsWithQuantity.filter(product => 
                  userProductIds.includes(product.id)
                );
                
                // 연결된 제품이 없는 경우
                if (productsWithQuantity.length === 0) {
                  setError('주문 가능한 제품이 없습니다. 관리자에게 문의하세요.');
                }
              }
            } catch (err) {
              console.error('Error fetching user products:', err);
              setError('사용자별 제품 목록을 가져오는 중 오류가 발생했습니다.');
            }
          }
          
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
    fetchPendingOrders();
  }, [session]);

  // 대기 상태 주문 목록 가져오기
  const fetchPendingOrders = async () => {
    try {
      setLoadingOrders(true);
      const result = await getOrders();
      
      if ('error' in result) {
        toast.error(result.error as string);
      } else {
        // 대기 상태 주문만 필터링 및 체크박스 필드 추가
        const pendingOrdersWithChecked = result
          .filter(order => order.status === '대기')
          .map(order => ({
            ...order,
            checked: false
          }));
        setPendingOrders(pendingOrdersWithChecked);
      }
    } catch (err) {
      console.error('Error fetching pending orders:', err);
      toast.error('대기중인 주문 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoadingOrders(false);
    }
  };

  // 수량 변경 처리
  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 0) return;
    
    setProducts(products.map(product => 
      product.id === id ? { ...product, quantity } : product
    ));
  };

  // 제품 추가 처리 - 자동으로 대기상태로 주문 생성
  const handleAddProduct = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    
    if (!product || product.quantity <= 0) {
      toast.error('수량을 입력해주세요.');
      return;
    }
    
    // 새로운 주문 아이템 생성
    const newOrderItem = {
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      registDate: product.registDate
    };
    
    // 새 주문 아이템을 목록에 추가
    setOrderItems(prev => [...prev, newOrderItem]);
    
    setIsSubmitting(true);
    
    try {
      // 대기 상태로 주문 바로 생성
      const result = await createOrder({
        items: [newOrderItem],
        note: note || undefined
      });
      
      if ('error' in result) {
        toast.error(result.error as string);
      } else {
        toast.success('제품이 주문 목록에 추가되었습니다.');
        
        // 해당 제품만 초기화
        setProducts(products.map(p => 
          p.id === productId ? { ...p, quantity: 0 } : p
        ));
        
        // 메모 초기화
        setNote('');
        
        // 주문 목록 새로고침
        fetchPendingOrders();
      }
    } catch (err) {
      console.error('Error adding order:', err);
      toast.error('주문 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 체크박스 변경 처리
  const handleCheckOrder = (id: string, checked: boolean) => {
    setPendingOrders(pendingOrders.map(order => 
      order.id === id ? { ...order, checked } : order
    ));
  };
  
  // 모든 주문 체크/체크해제
  const handleCheckAllOrders = (checked: boolean) => {
    setPendingOrders(pendingOrders.map(order => ({ ...order, checked })));
  };
  
  // 선택된 주문의 상태를 완료로 변경
  const handleCompleteOrders = async () => {
    const selectedOrders = pendingOrders.filter(order => order.checked);
    
    if (selectedOrders.length === 0) {
      toast.error('완료할 주문을 선택해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 완료된 주문 목록 (이메일 발송용)
      const completedOrders = [];
      
      // 각 주문의 상태를 완료로 변경
      for (const order of selectedOrders) {
        const result = await updateOrderStatus(order.id, '완료');
        
        if ('error' in result) {
          toast.error(`주문 ${order.id} 처리 중 오류: ${result.error}`);
        } else {
          completedOrders.push(order);
        }
      }
      
      // 성공적으로 완료 처리된 주문이 있는 경우
      if (completedOrders.length > 0) {
        toast.success('선택한 주문이 완료 처리되었습니다.');
        
        // 이메일 발송
        const emailResult = await sendOrderCompletionEmail(completedOrders);
        
        if ('error' in emailResult) {
          toast.error(`주문 이메일 발송 실패: ${emailResult.error}`);
        } else {
          toast.success('주문이 접수되었습니다.');
        }
      }
      
      // 주문 목록 새로고침
      fetchPendingOrders();
    } catch (err) {
      console.error('Error completing orders:', err);
      toast.error('주문 완료 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 메모 수정 시작
  const handleStartEditNote = (orderId: string, note: string) => {
    setEditingOrderId(orderId);
    setEditingNote(note || '');
  };
  
  // 메모 수정 취소
  const handleCancelEditNote = () => {
    setEditingOrderId(null);
    setEditingNote('');
  };
  
  // 메모 수정 저장
  const handleSaveNote = async (orderId: string) => {
    setIsSubmitting(true);
    
    try {
      // 현재 주문 찾기
      const orderToUpdate = pendingOrders.find(order => order.id === orderId);
      
      if (!orderToUpdate) {
        toast.error('주문을 찾을 수 없습니다.');
        return;
      }
      
      // 주문 객체 업데이트 (메모만 수정)
      const updatedOrder = {
        ...orderToUpdate,
        note: editingNote
      };
      
      // 주문 업데이트 API 호출 (상태는 그대로 '대기' 유지)
      const result = await updateOrderStatus(orderId, '대기', editingNote);
      
      if ('error' in result) {
        toast.error(`메모 업데이트 실패: ${result.error}`);
      } else {
        toast.success('메모가 업데이트되었습니다.');
        
        // 주문 목록 새로고침
        fetchPendingOrders();
        
        // 편집 모드 종료
        setEditingOrderId(null);
        setEditingNote('');
      }
    } catch (err) {
      console.error('Error updating note:', err);
      toast.error('메모 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 선택된 주문을 삭제
  const handleDeleteOrders = async () => {
    const selectedOrders = pendingOrders.filter(order => order.checked);
    
    if (selectedOrders.length === 0) {
      toast.error('삭제할 주문을 선택해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 각 주문 삭제
      let successCount = 0;
      let errorCount = 0;
      
      for (const order of selectedOrders) {
        const result = await deleteOrder(order.id);
        
        if ('error' in result) {
          errorCount++;
          toast.error(`주문 삭제 오류: ${result.error}`, {
            duration: 3000,
          });
        } else {
          successCount++;
        }
      }
      
      if (successCount > 0) {
        toast.success(`${successCount}개의 주문이 삭제되었습니다.`, {
          duration: 3000,
        });
      }
      
      if (errorCount > 0) {
        toast.error(`${errorCount}개의 주문 삭제에 실패했습니다.`, {
          duration: 3000,
        });
      }
      
      // 주문 목록 새로고침
      fetchPendingOrders();
    } catch (err) {
      console.error('Error deleting orders:', err);
      toast.error('주문 삭제 중 오류가 발생했습니다.', {
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 검색된 제품 목록
  const filteredProducts = searchTerm
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      {/* 페이지 제목 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">주문 등록</h1>
        <p className="mt-1 text-sm text-gray-500">
          제품을 선택하고 수량을 입력한 후 주문 추가 버튼을 클릭하세요.
        </p>
      </div>
      
      {/* 주문 등록 폼 */}
      <div>
        {/* 제품 목록 */}
        <div className="bg-white shadow overflow-hidden rounded-md mb-6">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              제품 목록
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              주문할 제품을 선택하고 수량을 입력하세요.
            </p>
          </div>
          
          <div className="px-4 py-4 border-t border-gray-200">
            {/* 검색 영역 추가 */}
            <div className="mb-4">
              <div className="relative rounded-md shadow-sm max-w-md">
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="제품명 또는 코드로 검색"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 py-4">{error}</div>
            ) : products.length === 0 ? (
              <div className="text-gray-500 py-4">등록된 제품이 없습니다.</div>
            ) : (
              <div className="max-h-[500px] overflow-auto">
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
                        등록일
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
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product.code}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(product.registDate)}</div>
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
                            disabled={product.quantity <= 0 || isSubmitting}
                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${product.quantity > 0 && !isSubmitting ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                          >
                            {isSubmitting ? '처리중...' : '주문추가'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* 메모 입력 영역 */}
        <div className="bg-white shadow overflow-hidden rounded-md mb-6">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              주문 메모
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              주문에 대한 메모를 입력해주세요. 제품 추가 시 함께 저장됩니다.
            </p>
          </div>
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex flex-col">
              <div className="flex-grow">
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
        
        {/* 주문 목록 */}
        <div className="bg-white shadow overflow-hidden rounded-md mb-6">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">주문 목록</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">대기중인 주문 목록입니다. 체크박스로 선택한 주문을 완료 처리할 수 있습니다.</p>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleDeleteOrders}
                disabled={isSubmitting || pendingOrders.filter(o => o.checked).length === 0}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
              >
                {isSubmitting ? '처리중...' : '선택 주문 삭제'}
              </button>
              <button
                type="button"
                onClick={handleCompleteOrders}
                disabled={isSubmitting || pendingOrders.filter(o => o.checked).length === 0}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
              >
                {isSubmitting ? '처리중...' : '선택 주문 완료처리'}
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200">
            {loadingOrders ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            ) : pendingOrders.length > 0 ? (
              <div className="max-h-[300px] overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <input
                            id="select-all"
                            name="select-all"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={pendingOrders.length > 0 && pendingOrders.every(order => order.checked)}
                            onChange={(e) => handleCheckAllOrders(e.target.checked)}
                          />
                         
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        제품명
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        수량
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        등록일
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
                    {pendingOrders.map((order) => (
                      order.items.map((item, index) => (
                        <tr key={`${order.id}-${index}`} className={order.checked ? 'bg-blue-50' : ''}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              id={`select-order-${order.id}`}
                              name={`select-order-${order.id}`}
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              checked={order.checked}
                              onChange={(e) => handleCheckOrder(order.id, e.target.checked)}
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.registDate ? formatDate(item.registDate) : '-'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {editingOrderId === order.id ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={editingNote}
                                  onChange={(e) => setEditingNote(e.target.value)}
                                  className="block w-full sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="메모 입력"
                                />
                              </div>
                            ) : (
                              order.note || '-'
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              대기
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {editingOrderId === order.id ? (
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleSaveNote(order.id)}
                                  disabled={isSubmitting}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  저장
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelEditNote}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  취소
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStartEditNote(order.id, order.note || '')}
                                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                메모 수정
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                대기중인 주문이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

