"use client";
import React, { useState } from "react";
import { AccountData } from "./AccountCreateModal";
import AccountCreateModal from "./AccountCreateModal";
import AccountCompanyOrdersModal from "./AccountCompanyOrdersModal";
import { OrderData } from "./OrderCreateModal";

interface AccountManagementProps {
  accounts: AccountData[];
  setAccounts?: React.Dispatch<React.SetStateAction<AccountData[]>>;
  products?: Array<{
    id: string;
    name: string;
  }>;
  orders?: OrderData[];
}

export default function AccountManagement({ accounts, setAccounts, products = [], orders = [] }: AccountManagementProps) {
  const [showAccountCreateModal, setShowAccountCreateModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  // 계정 등록 처리
  const handleAccountCreate = (newAccount: AccountData) => {
    if (setAccounts) {
      setAccounts(prev => [...prev, newAccount]);
    }
    setShowAccountCreateModal(false);
  };
  return (
    <>
      <div style={{ background: '#1a5595', height: 40, display: 'flex', alignItems: 'center', padding: '0 13px', color: '#fff', fontSize: 17 }}>
        <span style={{fontWeight:500,marginRight:20}}>계정관리 [{accounts.length}]</span>
        <span style={{flex:1}} />
        {/* toolbar icons */}
        <span title="새로고침" style={{marginLeft:12,marginRight:11,cursor:'pointer',fontSize:19}}>↻</span>
        <span 
          title="등록" 
          style={{marginRight:13,cursor:'pointer',fontSize:19}}
          onClick={() => setShowAccountCreateModal(true)}
        >💾</span>
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
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:16.7,marginTop:1,border:'1px solid #bcbcbc'}}>
          <thead>
            <tr style={{background:'#f4f5f5',borderBottom:'2.5px solid #1976d2',color:'#1a5595'}}>
              <th style={{width:51,padding:'8px 0',border:'1px solid #bcbcbc'}}><input type="checkbox" checked={true} readOnly /></th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>계정</th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>비밀번호</th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>이름</th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>사업자명</th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>사업자번호</th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>연락처</th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>주소</th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>허용여부</th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>접속권한</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((row, i) => (
              <tr key={row.login} style={{textAlign:'center',color:'#333'}}>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}><input type="checkbox" checked={i===0} readOnly /></td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{row.login}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{row.password ? '••••••••' : '-'}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{row.name}</td>
                <td 
                  style={{
                    border:'1px solid #bcbcbc',
                    padding:'6px 0',
                    cursor: 'pointer',
                    color: '#1a5595',
                    textDecoration: 'underline'
                  }}
                  onClick={() => setSelectedCompany(row.company)}
                  title="클릭하여 주문내역 보기"
                >
                  {row.company}
                </td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{row.brn}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{row.phone}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{row.addr}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{row.perm}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{row.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{height:41,background:'#f4f5f5',display:'flex',alignItems:'center',borderTop:'1px solid #bcbcbc',padding:'0 20px',justifyContent:'space-between',fontSize:15}}>
        <span>계정관리 [{accounts.length}] 건 - 완료</span>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{background:'#1976d2',color:'#fff',borderRadius:4,padding:'3px 11px',marginRight:8,marginLeft:6,fontWeight:500}}>1 / 1</span>
          <select style={{border:'1px solid #bcbcbc',borderRadius:6,padding:'3px 19px',fontSize:15}} defaultValue="90 개 페이지별">
            <option value="90 개 페이지별">90 개 페이지별</option>
            <option value="30 개 페이지별">30 개 페이지별</option>
            <option value="10 개 페이지별">10 개 페이지별</option>
          </select>
        </div>
      </div>

      {/* 계정 등록 모달 */}
      {showAccountCreateModal && (
        <AccountCreateModal
          onClose={() => setShowAccountCreateModal(false)}
          onSave={handleAccountCreate}
          products={products}
        />
      )}

      {selectedCompany && (
        <AccountCompanyOrdersModal
          companyName={selectedCompany}
          orders={orders}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </>
  );
}
