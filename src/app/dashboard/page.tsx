"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OrderCreateModal, { OrderData } from "../components/OrderCreateModal";
import OrderManagement from "../components/OrderManagement";
import ProductManagement from "../components/ProductManagement";
import AccountManagement from "../components/AccountManagement";
import OrderConfirmation from "../components/OrderConfirmation";

// Demo data for each tab
type TabType = "주문등록" | "계정관리" | "품목관리" | "주문확인";

const TAB_LIST = [
  { label: "주문등록", icon: "📦" },
  { label: "품목관리", icon: "📋" },
  { label: "주문확인", icon: "📃" },
  { label: "계정관리", icon: "🔑" },
];

const ORDER_ROWS = [
  {
    date: "2025-04-28",
    product: "AQUBAC 종균제 (kg)",
    qty: "2,000",
    memo: "빠른납기바랍니다.",
    regid: "1111",
    company: "주식회사 알에이디",
    address: "서울시 강남구",
    orderStatus: "진행",
  },
];

// 품목 데이터
// 품목관리에서 사용할 데이터 구조
// 연결된 거래처 정보 포함
const PRODUCT_ROWS = [
  {
    id: "1",
    name: "AQUBAC 종균제 (kg)",
    price: "10,000",
    stock: "5,000",
    category: "백신",
    linkedCompanies: ["주식회사 알에이디"],
  },
  {
    id: "2",
    name: "바이오맥스 (L)",
    price: "15,000",
    stock: "3,000",
    category: "산소공급제",
    linkedCompanies: ["칼릭스브릴리언"],
  },
  {
    id: "3",
    name: "바이오스타 (kg)",
    price: "12,000",
    stock: "2,500",
    category: "백신",
    linkedCompanies: ["칼릭스브릴리언", "주식회사제뉴윈"],
  },
];

// 거래처 데이터 - 품목 연결을 위해 사용
// 실제로는 ACCOUNT_ROWS에서 가져와야 하지만 예시로 분리
// 추후 계정관리와 통합하여 관리해야 함
const COMPANY_ROWS = [
  { 
    id: "1", 
    name: "주식회사 알에이디",
    businessNumber: "123-45-67890",
    address: "서울특별시 강남구 테헤란로 123 알에이디빌딩 8층",
    phone: "02-1234-5678"
  },
  { 
    id: "2", 
    name: "칼릭스브릴리언",
    businessNumber: "234-56-78901",
    address: "경기도 성남시 분당구 판교로 256 판교테크노밸리",
    phone: "031-789-1234"
  },
  { 
    id: "3", 
    name: "주식회사제뉴윈",
    businessNumber: "345-67-89012",
    address: "서울특별시 마포구 월드컵북로 396 누리꿈스퀘어",
    phone: "02-2345-6789"
  },
  { 
    id: "4", 
    name: "개발",
    businessNumber: "456-78-90123",
    address: "서울특별시 서초구 강남대로 373 홍우빌딩",
    phone: "02-3456-7890"
  },
];

const ACCOUNT_ROWS = [
  { login: "333", name: "3(권한)", company: "3(권한)", brn: "3(권한)", phone: "", contact: "", addr: "", perm: "허용", level: "일반" },
  { login: "1111", name: "주식회사 알에이디", company: "주식회사 알에이디", brn: "29026561616", phone: "01056541621", contact: "", addr: "", perm: "허용", level: "일반" },
  { login: "0811", name: "김민준", company: "칼릭스브릴리언", brn: "8630702067", phone: "01051067672", contact: "", addr: "서울특별시 영등포구", perm: "허용", level: "관리" },
  { login: "9999", name: "김완주", company: "주식회사제뉴윈", brn: "2224412312", phone: "", contact: "", addr: "", perm: "허용", level: "일반" },
  { login: "bbb", name: "개발자", company: "개발", brn: "0000000", phone: "010-00000000", contact: "", addr: "아메리카 뉴욕", perm: "허용", level: "관리" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("주문등록");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  // 주문 데이터 상태 관리
  const [orders, setOrders] = useState<Array<OrderData & { regid: string }>>(ORDER_ROWS);
  // 사용자 권한 상태 (실제 구현에서는 로그인 시 서버에서 받아온 권한 정보를 사용)
  const [isAdmin, setIsAdmin] = useState(true); // 기본값을 true로 설정하여 관리자 메뉴 표시
  
  // 품목관리 관련 상태
  const [products, setProducts] = useState(PRODUCT_ROWS);
  const [companies, setCompanies] = useState(COMPANY_ROWS);

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
      return <AccountManagement accounts={ACCOUNT_ROWS} />;
    }

    return null;
  }

  // Tabs bar content for upper tab navigation
  function renderTabs() {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', background: '#f4f5f5', minHeight: 47, paddingLeft: 9, gap:1 }}>
        {TAB_LIST.map(tab => (
          <div
            key={tab.label}
            style={{
              background: activeTab === tab.label ? '#fff' : '#e7eef2',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              padding: '8px 26px 9px 22px',
              fontSize: 18,
              color: activeTab === tab.label ? '#1a5595' : '#7c7c7c',
              boxShadow: activeTab === tab.label ? '0 0 4px #d4cccc' : undefined,
              fontWeight: 500,
              cursor: 'pointer',
              border: activeTab === tab.label ? '1.7px solid #1a5595' : '1.7px solid #e7eef2',
              borderBottom: activeTab === tab.label ? 'none' : '1.7px solid #e7eef2',
              display: 'flex',
              alignItems: 'center',
              marginRight: 2,
            }}
            onClick={() => setActiveTab(tab.label as TabType)}
          >
            <span style={{fontSize:21,marginRight:10}}>{tab.icon}</span>{tab.label}
            {activeTab === tab.label && (
              <span style={{marginLeft:15,fontWeight:'normal',color:'#aaa',fontSize:21,cursor:'pointer'}}>×</span>
            )}
          </div>
        ))}
      </div>
    );
  }
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
    const newOrder = {
      ...orderData,
      regid: "개발", // 현재 로그인한 사용자 ID
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
          {/* Tabs */}
          {renderTabs()}
          {/* Main Panel */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
