"use client";

import { useState } from "react";
import { OrderData } from "./OrderCreateModal";
import CompanyDetailModal from "./CompanyDetailModal";

interface OrderConfirmationProps {
  orders: Array<OrderData>;
  setOrders?: React.Dispatch<React.SetStateAction<Array<OrderData>>>;
  companies: Array<{
    id: string;
    name: string;
    businessNumber: string;
    address: string;
    phone: string;
  }>;
}

export default function OrderConfirmation({ orders, setOrders, companies }: OrderConfirmationProps) {
  // 주문상태 변경 함수
  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (!setOrders) return;
    
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const [selectedCompany, setSelectedCompany] = useState<{
    id: string;
    name: string;
    businessNumber: string;
    address: string;
    phone: string;
  } | null>(null);

  // 사업자명 클릭 시 상세 정보 모달 표시
  const handleCompanyClick = (companyName: string) => {
    const company = companies.find(c => c.name === companyName);
    if (company) {
      setSelectedCompany(company);
    }
  };
  return (
    <>
      <div style={{ background: '#1a5595', height: 40, display: 'flex', alignItems: 'center', padding: '0 13px', color: '#fff', fontSize: 17 }}>
        <span style={{fontWeight:500,marginRight:20}}>주문확인 [{orders.length}]</span>
        <span style={{flex:1}} />
        <span title="새로고침" style={{marginLeft:12,marginRight:11,cursor:'pointer',fontSize:19}}>↻</span>
        <span title="주문승인" style={{marginRight:13,cursor:'pointer',fontSize:19}}>✅</span>
        <span title="주문반려" style={{marginRight:13,cursor:'pointer',fontSize:19}}>❌</span>
        <span title="엑셀" style={{marginRight:13,cursor:'pointer',fontSize:19}}>📄</span>
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
          <option value="대기">대기</option>
          <option value="진행">진행</option>
          <option value="완료">완료</option>
        </select>
        <button style={{background:'#1976d2',color:'#fff',fontWeight:500,border:'none',borderRadius:4,fontSize:16,padding:'6px 19px',marginLeft:7,boxShadow:'0 0.7px 2.2px #7c747c30',cursor:'pointer'}}>조회</button>
      </div>
      <div style={{flex:1,background:'#fff',padding:'0 0 0 0',display:'flex',flexDirection:'column',overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:17,marginTop:1,border:'1px solid #bcbcbc'}}>
          <thead>
            <tr style={{background:'#f4f5f5',borderBottom:'2.5px solid #1976d2',color:'#1a5595'}}>
              <th style={{width:50,padding:'9px 0',border:'1px solid #bcbcbc'}}><input type="checkbox" checked={false} readOnly /></th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>등록일</th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>제품명</th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>수량</th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>메모</th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>등록아이디</th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>사업자명</th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>주소</th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>주문상태</th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>승인/반려</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={o.id} style={{textAlign:'center',color:'#333'}}>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}><input type="checkbox" checked={false} readOnly /></td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{o.date}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{o.productName}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{o.quantity}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{o.memo}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{o.userId}</td>
                <td 
                  style={{
                    border:'1px solid #bcbcbc',
                    padding:'6px 0',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    color: '#1976d2'
                  }}
                  onClick={() => handleCompanyClick(o.companyName)}
                  title="거래처 상세 정보 보기"
                >
                  {o.companyName}
                </td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{o.address}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: 
                      o.status === '대기중' ? '#ffe0b2' : 
                      o.status === '진행' ? '#bbdefb' : 
                      o.status === '완료' ? '#c8e6c9' : '#e0e0e0',
                    color: 
                      o.status === '대기중' ? '#e65100' : 
                      o.status === '진행' ? '#0d47a1' : 
                      o.status === '완료' ? '#1b5e20' : '#333',
                  }}>
                    {o.status}
                  </span>
                </td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>
                  <div style={{display:'flex',justifyContent:'center',gap:5}}>
                    {o.status === '대기중' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(o.id!, '진행')}
                          style={{background:'#4caf50',color:'white',border:'none',borderRadius:4,padding:'3px 8px',fontSize:13,cursor:'pointer'}}
                        >
                          승인
                        </button>
                        <button 
                          onClick={() => handleStatusChange(o.id!, '반려')}
                          style={{background:'#f44336',color:'white',border:'none',borderRadius:4,padding:'3px 8px',fontSize:13,cursor:'pointer'}}
                        >
                          반려
                        </button>
                      </>
                    )}
                    {o.status === '진행' && (
                      <button 
                        onClick={() => handleStatusChange(o.id!, '완료')}
                        style={{background:'#2196f3',color:'white',border:'none',borderRadius:4,padding:'3px 8px',fontSize:13,cursor:'pointer'}}
                      >
                        완료처리
                      </button>
                    )}
                    {(o.status === '완료' || o.status === '반려') && (
                      <span style={{color:'#888',fontSize:13}}>처리완료</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{height:41,background:'#f4f5f5',display:'flex',alignItems:'center',borderTop:'1px solid #bcbcbc',padding:'0 20px',justifyContent:'space-between',fontSize:15}}>
        <span>주문확인 [{orders.length}] 건 - 완료</span>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{background:'#1976d2',color:'#fff',borderRadius:4,padding:'3px 11px',marginRight:8,marginLeft:6,fontWeight:500}}>1 / 1</span>
          <select style={{border:'1px solid #bcbcbc',borderRadius:6,padding:'3px 19px',fontSize:15}} defaultValue="90 개 페이지별">
            <option value="90 개 페이지별">90 개 페이지별</option>
            <option value="30 개 페이지별">30 개 페이지별</option>
            <option value="10 개 페이지별">10 개 페이지별</option>
          </select>
        </div>
      </div>

      {/* 거래처 상세 정보 모달 */}
      {selectedCompany && (
        <CompanyDetailModal 
          company={selectedCompany} 
          onClose={() => setSelectedCompany(null)} 
        />
      )}
    </>
  );
}
