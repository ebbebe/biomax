"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OrderCreateModal, { OrderData } from "../components/OrderCreateModal";

// Demo data for each tab
type TabType = "주문관리" | "계정관리" | "품목관리" | "주문확인";

const TAB_LIST = [
  { label: "주문관리", icon: "📦" },
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

const ACCOUNT_ROWS = [
  { login: "333", name: "3(권한)", company: "3(권한)", brn: "3(권한)", phone: "", contact: "", addr: "", perm: "허용", level: "일반" },
  { login: "1111", name: "주식회사 알에이디", company: "주식회사 알에이디", brn: "29026561616", phone: "01056541621", contact: "", addr: "", perm: "허용", level: "일반" },
  { login: "0811", name: "김민준", company: "칼릭스브릴리언", brn: "8630702067", phone: "01051067672", contact: "", addr: "서울특별시 영등포구", perm: "허용", level: "관리" },
  { login: "9999", name: "김완주", company: "주식회사제뉴윈", brn: "2224412312", phone: "", contact: "", addr: "", perm: "허용", level: "일반" },
  { login: "bbb", name: "개발자", company: "개발", brn: "0000000", phone: "010-00000000", contact: "", addr: "아메리카 뉴욕", perm: "허용", level: "관리" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("주문관리");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orders, setOrders] = useState(ORDER_ROWS);
  // 사용자 권한 상태 (실제 구현에서는 로그인 시 서버에서 받아온 권한 정보를 사용)
  const [isAdmin, setIsAdmin] = useState(true); // 기본값을 true로 설정하여 관리자 메뉴 표시

  // sidebar structure with role-based access
  const menu = [
    // 일반 사용자 메뉴
    { name: "주문관리", icon: "📦", isAdminOnly: false },
    { name: "품목관리", icon: "📋", isAdminOnly: false },
    // 관리자 전용 메뉴
    { name: "주문확인", icon: "📃", isAdminOnly: true },
    { name: "계정관리", icon: "🔑", isAdminOnly: true },
  ];

  // table and UI depending on activeTab
  function renderContent() {
    if (activeTab === "주문관리") {
      return (
        <>
          {/* Toolbar, Filters, Table */}
          <div style={{ background: '#1a5595', height: 40, display: 'flex', alignItems: 'center', padding: '0 13px', color: '#fff', fontSize: 17 }}>
            <span style={{fontWeight:500,marginRight:20}}>주문관리 [{orders.length}]</span>
            <span style={{flex:1}} />
            <span 
              title="주문등록" 
              style={{marginLeft:18,marginRight:12,cursor:'pointer',fontSize:20}}
              onClick={() => setIsOrderModalOpen(true)}
            >📝</span>
            <span title="수정" style={{marginRight:12,cursor:'pointer',fontSize:20}}>✏️</span>
            <span title="삭제" style={{marginRight:12,cursor:'pointer',fontSize:20}}>🗑️</span>
            <span title="엑셀" style={{marginRight:12,cursor:'pointer',fontSize:20}}>📄</span>
            <span title="주문완료" style={{marginRight:18,cursor:'pointer',fontSize:20}}>🚚</span>
          </div>
          <div style={{display:'flex',alignItems:'center',padding:'18px 12px 7px 14px',background:'#fff',borderBottom:'1px solid #c6dee9',gap:12}}>
            <input style={{border:'1px solid #bcbcbc',borderRadius:4,padding:'5px 9px',fontSize:15,width:122}} placeholder="등록일" />
            <span style={{color:'#7c7c7c',fontWeight:400}}>&nbsp;~&nbsp;</span>
            <input style={{border:'1px solid #bcbcbc',borderRadius:4,padding:'5px 9px',fontSize:15,width:122}} placeholder="" />
            <input style={{border:'1px solid #bcbcbc',borderRadius:4,padding:'5px 9px',fontSize:15,width:148,marginLeft:7}} placeholder="제품명" />
            <input style={{border:'1px solid #bcbcbc',borderRadius:4,padding:'5px 9px',fontSize:15,width:120}} placeholder="메모" />
            <input style={{border:'1px solid #bcbcbc',borderRadius:4,padding:'5px 9px',fontSize:15,width:112}} placeholder="등록아이디" />
            <select style={{border:'1px solid #bcbcbc',borderRadius:4,padding:'5px 11px',fontSize:15,minWidth:70,marginLeft:7}} defaultValue="전체">
              <option value="전체">전체</option>
              <option value="진행">진행</option>
              <option value="완료">완료</option>
            </select>
            <button style={{background:'#1976d2',color:'#fff',fontWeight:500,border:'none',borderRadius:4,fontSize:16,padding:'6px 19px',marginLeft:7,boxShadow:'0 0.7px 2.2px #7c747c30',cursor:'pointer'}}>조회</button>
          </div>
          <div style={{flex:1,background:'#fff',padding:'0 0 0 0',display:'flex',flexDirection:'column',overflow:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:17,marginTop:1}}>
              <thead>
                <tr style={{background:'#f4f5f5',borderBottom:'2.5px solid #1976d2',color:'#1a5595'}}>
                  <th style={{width:50,padding:'9px 0'}}><input type="checkbox" checked={true} readOnly /></th>
                  <th style={{padding:'9px 0'}}>등록일</th>
                  <th style={{padding:'9px 0'}}>제품명</th>
                  <th style={{padding:'9px 0'}}>수량</th>
                  <th style={{padding:'9px 0'}}>메모</th>
                  <th style={{padding:'9px 0'}}>등록아이디</th>
                  <th style={{padding:'9px 0'}}>사업자명</th>
                  <th style={{padding:'9px 0'}}>주소</th>
                  <th style={{padding:'9px 0'}}>주문상태</th>
                </tr>
              </thead>
              <tbody>
                {ORDER_ROWS.map((o, i) => (
                  <tr key={o.regid} style={{borderTop:'1.3px solid #bcbcbc',textAlign:'center',color:'#333'}}>
                    <td><input type="checkbox" checked={i===0} readOnly /></td>
                    <td>{o.date}</td>
                    <td>{o.product}</td>
                    <td>{o.qty}</td>
                    <td>{o.memo}</td>
                    <td>{o.regid}</td>
                    <td>{o.company}</td>
                    <td>{o.address}</td>
                    <td>{o.orderStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{height:41,background:'#f4f5f5',display:'flex',alignItems:'center',borderTop:'1px solid #bcbcbc',padding:'0 20px',justifyContent:'space-between',fontSize:15}}>
            <span>주문관리 [1] 건 - 완료</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{background:'#1976d2',color:'#fff',borderRadius:4,padding:'3px 11px',marginRight:8,marginLeft:6,fontWeight:500}}>1 / 1</span>
              <select style={{border:'1px solid #bcbcbc',borderRadius:6,padding:'3px 19px',fontSize:15}} defaultValue="90 개 페이지별">
                <option value="90 개 페이지별">90 개 페이지별</option>
                <option value="30 개 페이지별">30 개 페이지별</option>
                <option value="10 개 페이지별">10 개 페이지별</option>
              </select>
            </div>
          </div>
        </>
      );
    }
    if (activeTab === "계정관리") {
      return (
        <>
          <div style={{ background: '#1a5595', height: 40, display: 'flex', alignItems: 'center', padding: '0 13px', color: '#fff', fontSize: 17 }}>
            <span style={{fontWeight:500,marginRight:20}}>계정관리 [2011]</span>
            <span style={{flex:1}} />
            {/* toolbar icons */}
            <span title="새로고침" style={{marginLeft:12,marginRight:11,cursor:'pointer',fontSize:19}}>↻</span>
            <span title="등록" style={{marginRight:13,cursor:'pointer',fontSize:19}}>💾</span>
            <span title="수정" style={{marginRight:13,cursor:'pointer',fontSize:19}}>✏️</span>
            <span title="삭제" style={{marginRight:13,cursor:'pointer',fontSize:19}}>🗑️</span>
            <span title="엑셀" style={{marginRight:13,cursor:'pointer',fontSize:19}}>📄</span>
          </div>
          {/* Filters */}
          <div style={{display:'flex',alignItems:'center',padding:'17px 12px 8px 14px',background:'#fff',borderBottom:'1px solid #c6dee9',gap:8}}>
            <input style={{border:'1px solid #bcbcbc',borderRadius:4,padding:'5px 8px',fontSize:15,width:113}} placeholder="계정" />
            <input style={{border:'1px solid #bcbcbc',borderRadius:4,padding:'5px 8px',fontSize:15,width:113}} placeholder="이름" />
            <input style={{border:'1px solid #bcbcbc',borderRadius:4,padding:'5px 8px',fontSize:15,width:130}} placeholder="사업자명" />
            <input style={{border:'1px solid #bcbcbc',borderRadius:4,padding:'5px 8px',fontSize:15,width:130}} placeholder="사업자번호" />
            <select style={{border:'1px solid #bcbcbc',borderRadius:4,padding:'5px 11px',fontSize:15,minWidth:70}} defaultValue="전체">
              <option value="전체">전체</option>
              <option value="허용">허용</option>
              <option value="비허용">비허용</option>
            </select>
            <select style={{border:'1px solid #bcbcbc',borderRadius:4,padding:'5px 11px',fontSize:15,minWidth:70}} defaultValue="전체">
              <option value="전체">전체</option>
              <option value="일반">일반</option>
              <option value="관리">관리</option>
            </select>
            <button style={{background:'#1976d2',color:'#fff',fontWeight:500,border:'none',borderRadius:4,fontSize:16,padding:'6px 19px',marginLeft:4,boxShadow:'0 0.7px 2.2px #7c747c30',cursor:'pointer'}}>조회</button>
          </div>
          <div style={{flex:1,background:'#fff',padding:'0 0 0 0',display:'flex',flexDirection:'column',overflow:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:16.7,marginTop:1}}>
              <thead>
                <tr style={{background:'#f4f5f5',borderBottom:'2.5px solid #1976d2',color:'#1a5595'}}>
                  <th style={{width:51,padding:'8px 0'}}><input type="checkbox" checked={true} readOnly /></th>
                  <th style={{padding:'8px 0'}}>계정</th>
                  <th style={{padding:'8px 0'}}>이름</th>
                  <th style={{padding:'8px 0'}}>사업자명</th>
                  <th style={{padding:'8px 0'}}>사업자번호</th>
                  <th style={{padding:'8px 0'}}>연락처</th>
                  <th style={{padding:'8px 0'}}>주소</th>
                  <th style={{padding:'8px 0'}}>허용여부</th>
                  <th style={{padding:'8px 0'}}>접속권한</th>
                </tr>
              </thead>
              <tbody>
                {ACCOUNT_ROWS.map((row, i) => (
                  <tr key={row.login} style={{borderTop:'1.2px solid #bcbcbc',textAlign:'center',color:'#333'}}>
                    <td><input type="checkbox" checked={i===0} readOnly /></td>
                    <td>{row.login}</td>
                    <td>{row.name}</td>
                    <td>{row.company}</td>
                    <td>{row.brn}</td>
                    <td>{row.phone}</td>
                    <td>{row.addr}</td>
                    <td>{row.perm}</td>
                    <td>{row.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{height:41,background:'#f4f5f5',display:'flex',alignItems:'center',borderTop:'1px solid #bcbcbc',padding:'0 20px',justifyContent:'space-between',fontSize:15}}>
            <span>계정관리 [5] 건 - 완료</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{background:'#1976d2',color:'#fff',borderRadius:4,padding:'3px 11px',marginRight:8,marginLeft:6,fontWeight:500}}>1 / 5</span>
              <select style={{border:'1px solid #bcbcbc',borderRadius:6,padding:'3px 19px',fontSize:15}} defaultValue="90 개 페이지별">
                <option value="90 개 페이지별">90 개 페이지별</option>
                <option value="30 개 페이지별">30 개 페이지별</option>
                <option value="10 개 페이지별">10 개 페이지별</option>
              </select>
            </div>
          </div>
        </>
      );
    }
    // Placeholder for other tabs
    return (
      <div style={{ flex: 1, background: '#fff', padding: 40, display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',color:'#444',fontSize:20, minHeight:400 }}>
        <span style={{fontWeight:500,fontSize:19,marginBottom:10}}>{activeTab}</span>
        <span>준비중 또는 데모 화면입니다.</span>
      </div>
    );
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
