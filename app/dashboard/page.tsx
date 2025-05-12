'use client';

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user?.role === 'admin' ? (
          // 관리자용 대시보드 카드
          <>
            <DashboardCard 
              title="품목관리" 
              description="제품 및 품목을 관리합니다." 
              icon={
                <svg className="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              linkHref="/dashboard/products"
            />
            
            <DashboardCard 
              title="주문확인" 
              description="고객 주문을 확인하고 처리합니다." 
              icon={
                <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              linkHref="/dashboard/orders"
            />
            
            <DashboardCard 
              title="계정관리" 
              description="사용자 계정을 관리합니다." 
              icon={
                <svg className="h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              linkHref="/dashboard/users"
            />
          </>
        ) : (
          // 일반 사용자용 대시보드 카드
          <>
            <DashboardCard 
              title="주문등록" 
              description="새로운 주문을 등록합니다." 
              icon={
                <svg className="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              linkHref="/dashboard/order-new"
            />
            
            <DashboardCard 
              title="주문내역" 
              description="이전 주문 내역을 확인합니다." 
              icon={
                <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              linkHref="/dashboard/order-history"
            />
          </>
        )}
      </div>
      
      {/* 최근 활동 섹션 */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">최근 활동</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <li key={index}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {user?.role === 'admin' 
                        ? `주문 #${1000 + index} 확인됨` 
                        : `주문 #${1000 + index} 등록됨`}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {user?.role === 'admin' ? '처리완료' : '승인대기'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {user?.role === 'admin' ? '사용자 계정' : '품목 수량'}: {index + 1}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <p>
                        {new Date().toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// 대시보드 카드 컴포넌트
function DashboardCard({ 
  title, 
  description, 
  icon, 
  linkHref 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  linkHref: string;
}) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-lg font-medium text-gray-900">
              {title}
            </dt>
            <dd className="mt-1 text-sm text-gray-500">
              {description}
            </dd>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link href={linkHref} className="font-medium text-blue-600 hover:text-blue-500">
            바로가기 <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
