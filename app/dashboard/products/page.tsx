'use client';

import { useState } from 'react';

type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
  stock: number;
  category: string;
};

export default function ProductsPage() {
  // 샘플 제품 데이터
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: '제품 A', unit: 'EA', price: 10000, stock: 50, category: '카테고리 1' },
    { id: '2', name: '제품 B', unit: 'BOX', price: 25000, stock: 30, category: '카테고리 2' },
    { id: '3', name: '제품 C', unit: 'KG', price: 8000, stock: 100, category: '카테고리 1' },
    { id: '4', name: '제품 D', unit: 'EA', price: 15000, stock: 45, category: '카테고리 3' },
    { id: '5', name: '제품 E', unit: 'BOX', price: 30000, stock: 25, category: '카테고리 2' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNew = () => {
    setCurrentProduct({
      id: '',
      name: '',
      unit: 'EA',
      price: 0,
      stock: 0,
      category: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말로 이 제품을 삭제하시겠습니까?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProduct) return;
    
    if (currentProduct.id) {
      // 기존 제품 수정
      setProducts(products.map(product => 
        product.id === currentProduct.id ? currentProduct : product
      ));
    } else {
      // 새 제품 추가
      const newId = (parseInt(products[products.length - 1]?.id || '0') + 1).toString();
      setProducts([...products, { ...currentProduct, id: newId }]);
    }
    
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">품목관리</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="w-full sm:w-64 mb-4 sm:mb-0">
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
              placeholder="제품명 또는 카테고리 검색"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          새 품목 추가
        </button>
      </div>
      
      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제품명
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                단위
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                단가
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                재고
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.price.toLocaleString()}원
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* 제품 추가/수정 모달 */}
      {isModalOpen && currentProduct && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSave}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {currentProduct.id ? '제품 수정' : '새 제품 추가'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">
                            제품명
                          </label>
                          <input
                            type="text"
                            name="product-name"
                            id="product-name"
                            required
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={currentProduct.name}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="product-category" className="block text-sm font-medium text-gray-700">
                            카테고리
                          </label>
                          <input
                            type="text"
                            name="product-category"
                            id="product-category"
                            required
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={currentProduct.category}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="product-unit" className="block text-sm font-medium text-gray-700">
                            단위
                          </label>
                          <select
                            id="product-unit"
                            name="product-unit"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={currentProduct.unit}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, unit: e.target.value })}
                          >
                            <option value="EA">EA</option>
                            <option value="BOX">BOX</option>
                            <option value="KG">KG</option>
                            <option value="SET">SET</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="product-price" className="block text-sm font-medium text-gray-700">
                            단가 (원)
                          </label>
                          <input
                            type="number"
                            name="product-price"
                            id="product-price"
                            min="0"
                            required
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={currentProduct.price}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="product-stock" className="block text-sm font-medium text-gray-700">
                            재고
                          </label>
                          <input
                            type="number"
                            name="product-stock"
                            id="product-stock"
                            min="0"
                            required
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={currentProduct.stock}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentProduct(null);
                    }}
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
