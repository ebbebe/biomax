"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OrderCreateModal from "../components/OrderCreateModal";
import OrderManagement from "../components/OrderManagement";
import ProductManagement from "../components/ProductManagement";
import AccountManagement from "../components/AccountManagement";
import OrderConfirmation from "../components/OrderConfirmation";
import { OrderData, AccountData, ProductData } from "../../types";

// Menu types for navigation
type TabType = "주문등록" | "계정관리" | "품목관리" | "주문확인";

// 통합된 주문 데이터 형식
const ORDER_ROWS: OrderData[] = [
  {
    id: "1",
    date: "2025-04-28",
    productName: "AQUBAC 종균제 (kg)",
    quantity: "2,000",
    memo: "빠른납기바랍니다.",
    userId: "1111",
    companyName: "주식회사 알에이디",
    address: "서울시 강남구",
    status: "진행",
  },
  {
    id: "2",
    date: "2025-05-01",
    productName: "바이오맥스 (L)",
    quantity: "1,500",
    memo: "오후 배송 부탁드립니다.",
    userId: "0811",
    companyName: "칼릭스브릴리언",
    address: "경기도 성남시",
    status: "대기중",
  },
  {
    id: "3",
    date: "2025-05-03",
    productName: "바이오스타 (kg)",
    quantity: "800",
    memo: "기존 주문과 함께 배송 부탁드립니다.",
    userId: "9999",
    companyName: "주식회사제뉴윈",
    address: "서울시 마포구",
    status: "완료",
  },
  {
    id: "4",
    date: "2025-05-05",
    productName: "AQUBAC 종균제 (kg)",
    quantity: "3,000",
    memo: "안전포장 부탁드립니다.",
    userId: "bbb",
    companyName: "개발",
    address: "서울시 서초구",
    status: "진행",
  },
];

// 품목 데이터
// 품목관리에서 사용할 데이터 구조
// 연결된 거래처 정보 포함
const PRODUCT_ROWS = [
  {
    id: "1",
    code: "P001",
    name: "AQUBAC 종균제 (kg)",
    stock: "5,000",
    registrationDate: "2025-04-01",
    linkedCompanies: ["주식회사 알에이디"],
  },
  {
    id: "2",
    code: "P002",
    name: "바이오맥스 (L)",
    stock: "3,000",
    registrationDate: "2025-04-15",
    linkedCompanies: ["칼릭스브릴리언"],
  },
  {
    id: "3",
    code: "P003",
    name: "바이오스타 (kg)",
    stock: "2,500",
    registrationDate: "2025-04-28",
    linkedCompanies: ["칼릭스브릴리언", "주식회사제뉴윈"],
  },
];

// 통합된 계정/거래처 데이터
const ACCOUNT_ROWS: AccountData[] = [
  { 
    id: "1",
    login: "1111", 
    password: "password456", 
    name: "주식회사 알에이디", 
    company: "주식회사 알에이디", 
    brn: "123-45-67890", 
    phone: "02-1234-5678", 
    addr: "서울특별시 강남구 테헤란로 123 알에이디빌딩 8층", 
    perm: "허용", 
    level: "일반",
    linkedProducts: []
  },
  { 
    id: "2",
    login: "0811", 
    password: "password123", 
    name: "김민준", 
    company: "칼릭스브릴리언", 
    brn: "234-56-78901", 
    phone: "010-5106-7672", 
    addr: "경기도 성남시 분당구 판교로 256 판교테크노밸리", 
    perm: "허용", 
    level: "관리",
    linkedProducts: ["2", "3"]
  },
  { 
    id: "3",
    login: "9999", 
    password: "password456", 
    name: "김완주", 
    company: "주식회사제뉴윈", 
    brn: "345-67-89012", 
    phone: "010-1234-5678", 
    addr: "서울특별시 마포구 월드컵북로 396 누리꾸스퀘어", 
    perm: "허용", 
    level: "일반",
    linkedProducts: ["3"]
  },
  { 
    id: "4",
    login: "bbb", 
    password: "admin123", 
    name: "개발자", 
    company: "개발", 
    brn: "456-78-90123", 
    phone: "010-0000-0000", 
    addr: "서울특별시 서초구 강남대로 373 홍우빌딩", 
    perm: "허용", 
    level: "관리",
    linkedProducts: []
  },
  { 
    id: "5",
    login: "333", 
    password: "password123", 
    name: "3(권한)", 
    company: "3(권한)", 
    brn: "3(권한)", 
    phone: "", 
    addr: "", 
    perm: "허용", 
    level: "일반",
    linkedProducts: []
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("주문등록");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  // 주문 데이터 상태 관리 - 통합된 형식 사용
  const [orders, setOrders] = useState<OrderData[]>(ORDER_ROWS);
  // 사용자 권한 상태 (실제 구현에서는 로그인 시 서버에서 받아온 권한 정보를 사용)
  const [isAdmin, setIsAdmin] = useState(true); // 기본값을 true로 설정하여 관리자 메뉴 표시
  
  // 계정관리 관련 상태
  const [accounts, setAccounts] = useState<AccountData[]>(ACCOUNT_ROWS);
  
  // 품목관리 관련 상태
  const [products, setProducts] = useState(PRODUCT_ROWS);
  
  // 계정 데이터에서 회사 정보 추출
  const companies = accounts.map(account => ({
    id: account.id || account.login, // id가 없으면 login을 id로 사용
    name: account.company,
    businessNumber: account.brn,
    address: account.addr,
    phone: account.phone
  }));

  // sidebar structure with role-based access
  const menu = [
    // 일반 사용자 메뉴
    { name: "주문등록", icon: "📦", isAdminOnly: false },
    // 관리자 전용 메뉴
    { name: "품목관리", icon: "📋", isAdminOnly: true },
    { name: "주문확인", icon: "📃", isAdminOnly: true },
    { name: "계정관리", icon: "🔑", isAdminOnly: true },
  ];

  // table and UI depending on activeTab
  function renderContent() {
    if (activeTab === "주문등록") {
      return <OrderManagement 
        orders={orders} 
        setOrders={setOrders} 
        setIsOrderModalOpen={setIsOrderModalOpen}
        companies={companies} 
      />;
    }
    
    if (activeTab === "품목관리") {
      return <ProductManagement products={products} setProducts={setProducts} companies={companies} />;
    }
    
    if (activeTab === "주문확인") {
      return <OrderConfirmation 
        orders={orders} 
        setOrders={setOrders} 
        companies={companies} 
      />;
    }
    
    if (activeTab === "계정관리") {
      // 계정관리 화면에 품목과 주문 데이터 전달
      return <AccountManagement 
        accounts={accounts} 
        setAccounts={setAccounts} 
        products={products.map(p => ({ id: p.id, name: p.name }))}
        orders={orders}
      />;
    }

    return null;
  }

  // Removed tabs navigation function as it's redundant with sidebar
  // Sidebar menu items
  function renderSidebar() {
    // 일반 메뉴와 관리자 메뉴 필터링
    const userMenus = menu.filter(item => !item.isAdminOnly);
    const adminMenus = menu.filter(item => item.isAdminOnly);
    
    // 메뉴 아이템 렌더링 함수
    const renderMenuItem = (item: {name: string, icon: string, isAdminOnly: boolean}) => {
      const isActive = activeTab === item.name;
      
      // 계정관리 메뉴는 특별한 스타일 적용
      const isAccountMenu = item.name === "계정관리";
      
      return (
        <li
          key={item.name}
          style={{
            background: isActive 
              ? (isAccountMenu ? "#3396ff" : "#c6dee9") 
              : "transparent",
            color: isActive 
              ? (isAccountMenu ? "#fff" : "#1a5595") 
              : "#222",
            fontWeight: isActive && isAccountMenu ? 600 : 500,
            padding: isAccountMenu ? "13px 22px 13px 22px" : "18px 22px 12px 22px",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            cursor: 'pointer',
            marginTop: item === userMenus[0] || item === adminMenus[0] ? 0 : 5,
            borderRadius: isAccountMenu ? 6 : 0,
            border: isActive && isAccountMenu ? '1.5px solid #3396ff' : 'none',
          }}
          onClick={() => setActiveTab(item.name as TabType)}
        >
          <span 
            style={{ 
              fontSize: 21, 
              marginRight: 10,
              color: isAccountMenu ? '#ff2b2b' : 'inherit'
            }}
          >
            {item.icon}
          </span> 
          {item.name}
        </li>
      );
    };

    return (
      <>
        {/* 일반 사용자 메뉴 섹션 */}
        <div style={{ background: "#1a5595", color: "#fff", padding: "14px 22px", fontWeight: 500, letterSpacing: 0.5, fontSize: 17, borderTopLeftRadius: 7 }}>
          <span style={{ fontSize: 19, marginRight: 9 }}>≡</span> 메인메뉴
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {userMenus.map(renderMenuItem)}
        </ul>
        
        {/* 관리자 메뉴 섹션 - 관리자일 때만 표시 */}
        {isAdmin && (
          <>
            <div style={{ 
              background: "#1a5595", 
              color: "#fff", 
              padding: "14px 22px", 
              fontWeight: 500, 
              letterSpacing: 0.5, 
              fontSize: 17,
              marginTop: 20,
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: 19, marginRight: 9 }}>⚙️</span> 관리자 메뉴
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {adminMenus.map(renderMenuItem)}
            </ul>
          </>
        )}
      </>
    );
  }

  // 주문 데이터 제출 처리
  const handleOrderSubmit = (orderData: OrderData) => {
    // 실제 구현에서는 API 호출 등을 통해 서버에 데이터를 저장할 수 있습니다.
    // 여기서는 로컬 상태에 추가하는 방식으로 구현합니다.
    const newOrder: OrderData = {
      id: String(Date.now()),
      date: new Date().toISOString().split('T')[0],
      productName: orderData.productName,
      quantity: orderData.quantity,
      memo: orderData.memo,
      userId: "bbb", // 현재 로그인한 사용자 ID
      companyName: orderData.companyName,
      address: orderData.address,
      status: "대기중",
    };

    setOrders([newOrder, ...orders]);
    setIsOrderModalOpen(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f5", display: "flex", flexDirection: "column" }}>
      {/* 주문 등록 모달 */}
      <OrderCreateModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        onSubmit={handleOrderSubmit}
      />
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #c6dee9", display: "flex", alignItems: "center", height: 50, paddingLeft: 32 }}>
        <Image src="https://ext.same-assets.com/1304735728/1117858943.png" alt="BIOMAX Logo" width={90} height={30} style={{ marginRight: 10 }} />
        <span style={{ fontWeight: 500, color: "#97adc0", marginRight: 15, fontSize: 17 }}> [개발] 님 - 관리 권한 접속중</span>
        <span style={{ flex: 1 }} />
        <span style={{ color: '#1976d2', cursor: 'pointer', fontWeight: 500, fontSize: 16, display: 'flex', alignItems: 'center', marginRight: 40 }} onClick={() => router.push('/')}>← 로그아웃</span>
      </div>
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{ width: 250, background: "#fff", borderRight: "1px solid #c6dee9", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>{renderSidebar()}</div>
          <div style={{ padding: "0 25px 18px 25px" }}>
            {/* 관리자 모드 토글 버튼 (개발용) */}
            <div style={{ marginBottom: 15, display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: 14, marginRight: 8, color: '#666' }}>관리자 모드:</label>
              <button 
                onClick={() => setIsAdmin(!isAdmin)}
                style={{
                  background: isAdmin ? '#1a5595' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                {isAdmin ? '활성화됨' : '비활성화됨'}
              </button>
            </div>
            <Image src="https://ext.same-assets.com/1304735728/1117858943.png" alt="BIOMAX Logo" width={80} height={32} />
          </div>
        </div>
        {/* Main Content */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Main Panel - Tabs removed for cleaner UI */}
          <div style={{ background: '#fff', flex: 1, padding: '20px', borderRadius: '4px 0 0 0' }}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
