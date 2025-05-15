import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SidebarClient from './SidebarClient';

export default async function Sidebar() {
  // NextAuth를 사용하여 서버 세션 가져오기
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return null;
  }

  // 클라이언트 컴포넌트로 사용자 정보 전달
  return <SidebarClient user={session.user} />;
}
