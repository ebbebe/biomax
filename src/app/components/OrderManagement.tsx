"use client";

import { OrderData } from "./OrderCreateModal";

interface OrderManagementProps {
  orders: Array<OrderData & { regid: string }>;
  setOrders: React.Dispatch<React.SetStateAction<Array<OrderData & { regid: string }>>>;
  setIsOrderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OrderManagement({ orders, setOrders, setIsOrderModalOpen }: OrderManagementProps) {
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
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:17,marginTop:1,border:'1px solid #bcbcbc'}}>
          <thead>
            <tr style={{background:'#f4f5f5',borderBottom:'2.5px solid #1976d2',color:'#1a5595'}}>
              <th style={{width:50,padding:'9px 0',border:'1px solid #bcbcbc'}}><input type="checkbox" checked={true} readOnly /></th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>등록일</th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>제품명</th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>수량</th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>메모</th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>등록아이디</th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>사업자명</th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>주소</th>
              <th style={{padding:'9px 0',border:'1px solid #bcbcbc'}}>주문상태</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={o.regid} style={{textAlign:'center',color:'#333'}}>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}><input type="checkbox" checked={i===0} readOnly /></td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{o.date}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{o.product}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{o.qty}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{o.memo}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{o.regid}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{o.company}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{o.address}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{o.orderStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{height:41,background:'#f4f5f5',display:'flex',alignItems:'center',borderTop:'1px solid #bcbcbc',padding:'0 20px',justifyContent:'space-between',fontSize:15}}>
        <span>주문관리 [{orders.length}] 건 - 완료</span>
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
