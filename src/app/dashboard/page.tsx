"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Demo data for each tab
type TabType = "주문관리" | "계정관리" | "품목관리" | "화면관리";

const TAB_LIST = [
  { label: "주문관리", icon: "📦" },
  { label: "품목관리", icon: "📋" },
  { label: "화면관리", icon: "🖥️" },
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

  // sidebar structure
  const menu = [
    { name: "주문관리", icon: "📦" },
    {
      name: "관리",
      icon: "▶", // mimic
      children: [
        { name: "품목관리", icon: "📋" },
        { name: "화면관리", icon: "🖥️" },
      ],
    },
    { name: "계정관리", icon: "🔑" },
  ];

  // table and UI depending on activeTab
  function renderContent() {
    if (activeTab === "주문관리") {
      return (
        <>
          {/* Toolbar, Filters, Table */}
          <div style={{ background: '#1a5595', height: 40, display: 'flex', alignItems: 'center', padding: '0 13px', color: '#fff', fontSize: 17 }}>
            <span style={{fontWeight:500,marginRight:20}}>주문관리 [1011]</span>
            <span style={{flex:1}} />
            <span title="주문등록" style={{marginLeft:18,marginRight:12,cursor:'pointer',fontSize:20}}>📝</span>
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
    return (
      <>
        <div style={{ background: "#1a5595", color: "#fff", padding: "14px 22px", fontWeight: 500, letterSpacing: 0.5, fontSize: 17, borderTopLeftRadius: 7 }}>
          <span style={{ fontSize: 19, marginRight: 9 }}>≡</span> 메인메뉴
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li
            style={{
              background: activeTab === "주문관리" ? "#c6dee9" : "transparent",
              color: activeTab === "주문관리" ? "#1a5595" : "#222",
              fontWeight: 500,
              padding: "18px 22px 12px 22px",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              cursor:'pointer',
            }}
            onClick={()=>setActiveTab("주문관리")}
          >
            <span style={{ fontSize: 21, marginRight: 10 }}>📦</span> 주문관리
          </li>
          <li style={{ paddingLeft: 34, fontSize: 15.5, color: '#7c7c7c', paddingBottom: 1, paddingTop: 11, fontWeight: 500, letterSpacing:'-1px', display: 'flex', alignItems: 'center'}}>
            <span style={{fontSize:16,marginRight:7,marginTop:2}}>▶</span> 관리
          </li>
          <li style={{paddingLeft:52,marginTop:7,cursor:'pointer',color:activeTab==="품목관리"?"#1976d2":"#222",fontWeight:activeTab==="품목관리"?600:400,marginBottom:3}} onClick={()=>setActiveTab("품목관리")}>📋 품목관리</li>
          <li style={{paddingLeft:52,marginBottom:3,cursor:'pointer',color:activeTab==="화면관리"?"#1976d2":"#222",fontWeight:activeTab==="화면관리"?600:400}} onClick={()=>setActiveTab("화면관리")}>🖥️ 화면관리</li>
          <li
            style={{
              background: activeTab === "계정관리" ? "#3396ff" : "transparent",
              color: activeTab === "계정관리" ? "#fff" : "#222",
              fontWeight: activeTab === "계정관리" ? 600 : 500,
              padding: "13px 22px 13px 22px",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              marginTop: 9,
              borderRadius: 6,
              cursor:'pointer',
              border: activeTab === "계정관리" ? '1.5px solid #3396ff':'none',
            }}
            onClick={()=>setActiveTab("계정관리")}
          >
            <span style={{ fontSize: 21, marginRight: 10, color:'#ff2b2b' }}>🔑</span> 계정관리
          </li>
        </ul>
      </>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f5", display: "flex", flexDirection: "column" }}>
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
