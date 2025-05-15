import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Sidebar from './components/Sidebar';
import AuthHeader from './components/AuthHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // NextAuth를 사용하여 서버 세션 가져오기
  const session = await getServerSession(authOptions);
  
  // 세션이 없으면 로그인 페이지로 리다이렉트
  if (!session?.user) {
    redirect('/login');
  }
  
  // 사용자 정보 가져오기
  const user = session.user;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AuthHeader user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
