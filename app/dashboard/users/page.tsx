'use client';

import { useState } from 'react';
import Link from 'next/link';

type UserRole = 'user' | 'admin';
type UserStatus = 'allowed' | 'blocked';

type User = {
  id: string;
  username: string; // 계정 아이디
  password: string; // 비밀번호
  name: string; // 이름
  companyName: string; // 사업자명
  businessNumber: string; // 사업자번호
  phone: string; // 연락처
  address: string; // 주소
  productIds: string[]; // 품목 ID 배열
  status: UserStatus; // 허용여부(허용,차단)
  role: UserRole; // 접속권한(일반,관리)
  lastLogin: string;
};

// 제품 타입 정의 (품목관리 페이지와 동일한 구조)
type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
  stock: number;
  category: string;
};

export default function UsersPage() {
  // 샘플 제품 데이터 - 많은 품목을 시뮬레이션하기 위해 더 추가
  const [products, setProducts] = useState<Product[]>((() => {
    // 기본 제품 5개
    const baseProducts = [
      { id: '1', name: '제품 A', unit: 'EA', price: 10000, stock: 50, category: '카테고리 1' },
      { id: '2', name: '제품 B', unit: 'BOX', price: 25000, stock: 30, category: '카테고리 2' },
      { id: '3', name: '제품 C', unit: 'KG', price: 8000, stock: 100, category: '카테고리 1' },
      { id: '4', name: '제품 D', unit: 'EA', price: 15000, stock: 45, category: '카테고리 3' },
      { id: '5', name: '제품 E', unit: 'BOX', price: 30000, stock: 25, category: '카테고리 2' },
    ];
    
    // 추가 제품 생성 (100개 정도)
    const categories = ['카테고리 1', '카테고리 2', '카테고리 3', '카테고리 4', '카테고리 5'];
    const units = ['EA', 'BOX', 'KG', 'SET', 'PACK'];
    
    const additionalProducts = [];
    for (let i = 6; i <= 100; i++) {
      const categoryIndex = (i % 5);
      const unitIndex = (i % 5);
      additionalProducts.push({
        id: i.toString(),
        name: `제품 ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26)}`,
        unit: units[unitIndex],
        price: 5000 + (i * 1000),
        stock: 10 + (i % 90),
        category: categories[categoryIndex]
      });
    }
    
    return [...baseProducts, ...additionalProducts];
  })());

  // 샘플 사용자 데이터
  const [users, setUsers] = useState<User[]>([
    { 
      id: '1', 
      username: 'admin',
      password: 'admin123',
      name: '관리자', 
      companyName: '바이오맥스',
      businessNumber: '123-45-67890',
      phone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      productIds: ['1', '2', '3', '4', '5'],
      status: 'allowed',
      role: 'admin', 
      lastLogin: '2025-05-12' 
    },
    { 
      id: '2', 
      username: 'user1',
      password: 'user123',
      name: '사용자 1', 
      companyName: '약국A',
      businessNumber: '111-22-33333',
      phone: '010-1111-2222',
      address: '서울시 서초구 서초대로 456',
      productIds: ['1', '3'],
      status: 'allowed',
      role: 'user', 
      lastLogin: '2025-05-11' 
    },
    { 
      id: '3', 
      username: 'user2',
      password: 'user123',
      name: '사용자 2', 
      companyName: '약국B',
      businessNumber: '222-33-44444',
      phone: '010-2222-3333',
      address: '경기도 성남시 분당구 판교로 789',
      productIds: ['2', '4'],
      status: 'allowed',
      role: 'user', 
      lastLogin: '2025-05-10' 
    },
    { 
      id: '4', 
      username: 'user3',
      password: 'user123',
      name: '사용자 3', 
      companyName: '약국C',
      businessNumber: '333-44-55555',
      phone: '010-3333-4444',
      address: '인천시 연수구 센트럴로 101',
      productIds: ['1', '5'],
      status: 'blocked',
      role: 'user', 
      lastLogin: '2025-05-09' 
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 품목 관리를 위한 추가 상태
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // 카테고리 목록 추출
  const categories = ['all', ...Array.from(new Set(products.map(product => product.category)))];
  
  // 필터링된 제품 목록 계산
  const filteredProducts = products.filter(product => {
    // 카테고리 필터링
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    
    // 검색어 필터링
    const searchMatch = productSearchTerm === '' || 
      product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(productSearchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });
  

  const handleAddNew = () => {
    setCurrentUser({
      id: '',
      username: '',
      password: '',
      name: '',
      companyName: '',
      businessNumber: '',
      phone: '',
      address: '',
      productIds: [],
      status: 'allowed',
      role: 'user',
      lastLogin: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setCurrentUser({ ...user });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    if (currentUser.id) {
      // 기존 사용자 수정
      setUsers(users.map(user => 
        user.id === currentUser.id ? currentUser : user
      ));
    } else {
      // 새 사용자 추가
      const newId = (parseInt(users[users.length - 1]?.id || '0') + 1).toString();
      setUsers([...users, { ...currentUser, id: newId }]);
    }
    
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.businessNumber.includes(searchTerm) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">계정관리</h1>
      
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
              placeholder="이름, 이메일 또는 부서 검색"
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
          새 계정 추가
        </button>
      </div>
      
      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름/사업자명
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                계정 아이디
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                사업자번호
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                연락처
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                권한
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                마지막 로그인
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">{user.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        <Link 
                          href={`/dashboard/order-history?customerId=${user.id}&customerName=${encodeURIComponent(user.companyName)}`}
                          className="hover:text-blue-600 hover:underline cursor-pointer"
                        >
                          {user.companyName}
                        </Link>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.businessNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'allowed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'allowed' ? '허용' : '차단'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? '관리자' : '사용자'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
      
      {/* 사용자 추가/수정 모달 */}
      {isModalOpen && currentUser && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* 배경 오버레이 */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => {
              setIsModalOpen(false);
              setCurrentUser(null);
            }}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {/* 모달 컨텐츠 */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleSave}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {currentUser.id ? '계정 수정' : '새 계정 추가'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="user-username" className="block text-sm font-medium text-gray-700">
                              계정 아이디
                            </label>
                            <input
                              type="text"
                              name="user-username"
                              id="user-username"
                              required
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              value={currentUser.username}
                              onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="user-password" className="block text-sm font-medium text-gray-700">
                              비밀번호
                            </label>
                            <input
                              type="password"
                              name="user-password"
                              id="user-password"
                              required={!currentUser.id} // 새 계정일 때만 필수
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              value={currentUser.password}
                              onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="user-name" className="block text-sm font-medium text-gray-700">
                              이름
                            </label>
                            <input
                              type="text"
                              name="user-name"
                              id="user-name"
                              required
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              value={currentUser.name}
                              onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="user-company" className="block text-sm font-medium text-gray-700">
                              사업자명
                            </label>
                            <input
                              type="text"
                              name="user-company"
                              id="user-company"
                              required
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              value={currentUser.companyName}
                              onChange={(e) => setCurrentUser({ ...currentUser, companyName: e.target.value })}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="user-business-number" className="block text-sm font-medium text-gray-700">
                              사업자번호
                            </label>
                            <input
                              type="text"
                              name="user-business-number"
                              id="user-business-number"
                              required
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              value={currentUser.businessNumber}
                              onChange={(e) => setCurrentUser({ ...currentUser, businessNumber: e.target.value })}
                              placeholder="000-00-00000"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="user-phone" className="block text-sm font-medium text-gray-700">
                              연락처
                            </label>
                            <input
                              type="text"
                              name="user-phone"
                              id="user-phone"
                              required
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              value={currentUser.phone}
                              onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                              placeholder="010-0000-0000"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="user-address" className="block text-sm font-medium text-gray-700">
                            주소
                          </label>
                          <input
                            type="text"
                            name="user-address"
                            id="user-address"
                            required
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={currentUser.address}
                            onChange={(e) => setCurrentUser({ ...currentUser, address: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="user-products" className="block text-sm font-medium text-gray-700">
                            품목
                          </label>
                          
                          <div className="mt-2 mb-4 flex flex-col sm:flex-row gap-2">
                            <div className="w-full sm:w-1/2">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <input
                                  type="text"
                                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  placeholder="품목명 검색"
                                  value={productSearchTerm}
                                  onChange={(e) => setProductSearchTerm(e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <div className="w-full sm:w-1/2">
                              <select
                                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                              >
                                <option value="all">모든 카테고리</option>
                                {categories.filter(cat => cat !== 'all').map(category => (
                                  <option key={category} value={category}>{category}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          <div className="border border-gray-300 rounded-md">
                            <div className="p-2 bg-gray-50 border-b border-gray-300 flex justify-between items-center">
                              <div className="text-sm font-medium text-gray-700">
                                선택된 품목: {currentUser.productIds.length}개
                              </div>
                              <div>
                                <button
                                  type="button"
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                  onClick={() => {
                                    // 필터링된 품목만 모두 선택
                                    const filteredProductIds = filteredProducts.map(p => p.id);
                                    const newProductIds = [...new Set([...currentUser.productIds, ...filteredProductIds])];
                                    setCurrentUser({ ...currentUser, productIds: newProductIds });
                                  }}
                                >
                                  현재 목록 모두 선택
                                </button>
                                <span className="mx-2 text-gray-300">|</span>
                                <button
                                  type="button"
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                  onClick={() => {
                                    // 필터링된 품목만 선택 해제
                                    const filteredProductIds = filteredProducts.map(p => p.id);
                                    const newProductIds = currentUser.productIds.filter(id => !filteredProductIds.includes(id));
                                    setCurrentUser({ ...currentUser, productIds: newProductIds });
                                  }}
                                >
                                  현재 목록 선택 해제
                                </button>
                              </div>
                            </div>
                            
                            <div className="max-h-60 overflow-y-auto">
                              {/* 필터링된 품목 목록 */}
                              {filteredProducts.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                        선택
                                      </th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                        품목명
                                      </th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                        단위
                                      </th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                        가격
                                      </th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                        카테고리
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProducts.map(product => (
                                      <tr key={product.id} className={currentUser.productIds.includes(product.id) ? 'bg-blue-50' : ''}>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                          <input
                                            id={`product-${product.id}`}
                                            name={`product-${product.id}`}
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            checked={currentUser.productIds.includes(product.id)}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                setCurrentUser({
                                                  ...currentUser,
                                                  productIds: [...currentUser.productIds, product.id]
                                                });
                                              } else {
                                                setCurrentUser({
                                                  ...currentUser,
                                                  productIds: currentUser.productIds.filter(id => id !== product.id)
                                                });
                                              }
                                            }}
                                          />
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                                          <label htmlFor={`product-${product.id}`} className="cursor-pointer">
                                            {product.name}
                                          </label>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                          {product.unit}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                          {product.price.toLocaleString()}원
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                          {product.category}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <div className="py-4 text-center text-sm text-gray-500">
                                  검색 결과가 없습니다.
                                </div>
                              )}
                            </div>
                            
                            {/* 선택된 품목 목록 */}
                            {currentUser.productIds.length > 0 && (
                              <div className="p-2 border-t border-gray-300 bg-gray-50">
                                <div className="text-sm font-medium text-gray-700 mb-2">
                                  선택된 품목 목록
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {currentUser.productIds.map(id => {
                                    const product = products.find(p => p.id === id);
                                    if (!product) return null;
                                    
                                    return (
                                      <div key={id} className="inline-flex items-center bg-blue-100 rounded-full px-3 py-1 text-xs text-blue-800">
                                        {product.name}
                                        <button
                                          type="button"
                                          className="ml-1 text-blue-500 hover:text-blue-700"
                                          onClick={() => {
                                            setCurrentUser({
                                              ...currentUser,
                                              productIds: currentUser.productIds.filter(pid => pid !== id)
                                            });
                                          }}
                                        >
                                          <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                          </svg>
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="user-status" className="block text-sm font-medium text-gray-700">
                              허용여부
                            </label>
                            <select
                              id="user-status"
                              name="user-status"
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={currentUser.status}
                              onChange={(e) => setCurrentUser({ ...currentUser, status: e.target.value as UserStatus })}
                            >
                              <option value="allowed">허용</option>
                              <option value="blocked">차단</option>
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="user-role" className="block text-sm font-medium text-gray-700">
                              접속권한
                            </label>
                            <select
                              id="user-role"
                              name="user-role"
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={currentUser.role}
                              onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value as UserRole })}
                            >
                              <option value="user">일반</option>
                              <option value="admin">관리</option>
                            </select>
                          </div>
                        </div>
                        
                        {currentUser.id && (
                          <div className="bg-yellow-50 p-4 rounded-md">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                  비밀번호 재설정
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                  <p>
                                    이 기능은 프론트엔드 데모에서는 구현되지 않았습니다. 실제 구현 시에는 비밀번호 재설정 기능이 필요합니다.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
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
                      setCurrentUser(null);
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
