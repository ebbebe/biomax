'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getRecentOrders } from '@/lib/actions/order';
import { Order } from '@/lib/types';

export default function Dashboard() {
  const { data: session } = useSession();
  const user = session?.user;
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 최근 주문 데이터 가져오기
  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (!user) return; // 사용자 정보가 없으면 함수 종료
      
      try {
        setLoading(true);
        
        // 디버깅: 사용자 ID 출력
        console.log('사용자 ID:', user.id);
        console.log('사용자 정보:', user);
        
        // 관리자는 모든 주문을, 일반 사용자는 자신의 주문만 가져옴
        if (user.role === 'admin') {
          const data = await getRecentOrders(5);
          console.log('관리자 주문 데이터:', data);
          // 에러 확인
          if ('error' in data) {
            console.error('주문 데이터 조회 오류:', data.error);
          } else {
            setRecentOrders(data);
          }
        } else {
          // 사용자 ID를 전달하여 해당 사용자의 주문만 가져옴
          const data = await getRecentOrders(5, user.id);
          console.log('사용자 주문 데이터:', data);
          // 에러 확인
          if ('error' in data) {
            console.error('주문 데이터 조회 오류:', data.error);
          } else {
            setRecentOrders(data);
          }
        }
      } catch (error) {
        console.error('최근 주문 불러오기 오류:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentOrders();
  }, [user]);
  
  // 애니메이션 변수
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <div className="text-sm text-gray-500">
          <span className="bg-gray-100 text-gray-700 py-1 px-2 rounded-full font-medium">
            {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </motion.div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </motion.div>
      
      {/* 최근 주문내역 섹션 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            {user?.role === 'admin' ? '최근 전체 주문내역' : '내 최근 주문내역'}
          </h2>
          <Link 
            href={user?.role === 'admin' ? "/dashboard/orders" : "/dashboard/order-history"}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
          >
            모두 보기
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          {loading ? (
            <div className="py-10 text-center">
              <svg className="animate-spin h-8 w-8 mx-auto text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-600">주문 내역을 불러오는 중...</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-10 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">주문 내역이 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500">아직 등록된 주문이 없습니다.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentOrders.map((order, index) => (
                <motion.li 
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  className="transition-colors duration-150"
                >
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${user?.role === 'admin' ? 'bg-blue-50' : 'bg-indigo-50'}`}>
                          <svg className={`h-5 w-5 ${user?.role === 'admin' ? 'text-blue-500' : 'text-indigo-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            주문 #{order.id.substring(0, 8)}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            품목 수량: {order.items?.length || 0} | {order.companyName || '개인'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-xs text-gray-500 flex items-center">
                          <svg className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {formatDate(order.date)}
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === '완료' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
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
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 transition-all duration-200"
    >
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-lg font-bold text-gray-900">
              {title}
            </dt>
            <dd className="mt-1 text-sm text-gray-500">
              {description}
            </dd>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="text-sm">
          <Link 
            href={linkHref} 
            className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center"
          >
            바로가기 
            <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
