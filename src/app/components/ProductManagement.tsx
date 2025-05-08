"use client";
import React, { useState } from "react";

interface ProductData {
  id: string;
  name: string;
  price: string;
  stock: string;
  category: string;
  linkedCompanies: string[];
}

interface CompanyData {
  id: string;
  name: string;
}

interface ProductManagementProps {
  products: ProductData[];
  setProducts: React.Dispatch<React.SetStateAction<ProductData[]>>;
  companies: CompanyData[];
}

export default function ProductManagement({ products, setProducts, companies }: ProductManagementProps) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>("");

  return (
    <>
      <div style={{ background: '#1a5595', height: 40, display: 'flex', alignItems: 'center', padding: '0 13px', color: '#fff', fontSize: 17 }}>
        <span style={{fontWeight:500,marginRight:20}}>품목관리 [{products.length}]</span>
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
        <input style={{border:'1px solid #bcbcbc',borderRadius:4,padding:'5px 8px',fontSize:15,width:130}} placeholder="제품명" />
        <input style={{border:'1px solid #bcbcbc',borderRadius:4,padding:'5px 8px',fontSize:15,width:113}} placeholder="카테고리" />
        <select 
          style={{border:'1px solid #bcbcbc',borderRadius:4,padding:'5px 11px',fontSize:15,minWidth:150}} 
          value={selectedCompanyFilter}
          onChange={(e) => setSelectedCompanyFilter(e.target.value)}
        >
          <option value="">거래처 전체</option>
          {companies.map(company => (
            <option key={company.id} value={company.name}>{company.name}</option>
          ))}
        </select>
        <button style={{background:'#1976d2',color:'#fff',fontWeight:500,border:'none',borderRadius:4,fontSize:16,padding:'6px 19px',marginLeft:4,boxShadow:'0 0.7px 2.2px #7c747c30',cursor:'pointer'}}>조회</button>
      </div>
      <div style={{flex:1,background:'#fff',padding:'0 0 0 0',display:'flex',flexDirection:'column',overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:16.7,marginTop:1,border:'1px solid #bcbcbc'}}>
          <thead>
            <tr style={{background:'#f4f5f5',borderBottom:'2.5px solid #1976d2',color:'#1a5595'}}>
              <th style={{width:51,padding:'8px 0',border:'1px solid #bcbcbc'}}><input type="checkbox" readOnly /></th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>제품명</th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>가격</th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>재고</th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>카테고리</th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>연결된 거래처</th>
              <th style={{padding:'8px 0',width:120,border:'1px solid #bcbcbc'}}>거래처 연결</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter(product => !selectedCompanyFilter || product.linkedCompanies.includes(selectedCompanyFilter))
              .map((product, i) => (
              <tr key={product.id} style={{textAlign:'center',color:'#333'}}>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>
                  <input 
                    type="checkbox" 
                    checked={selectedProduct === product.id} 
                    onChange={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)} 
                  />
                </td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{product.name}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{product.price}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{product.stock}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{product.category}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>
                  {product.linkedCompanies.length > 0 ? (
                    <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:5}}>
                      {product.linkedCompanies.map(company => (
                        <span 
                          key={company} 
                          style={{
                            background:'#e3f2fd',
                            color:'#1976d2',
                            padding:'2px 8px',
                            borderRadius:4,
                            fontSize:14,
                            display:'inline-block'
                          }}
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{color:'#888'}}>연결된 거래처 없음</span>
                  )}
                </td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>
                  <button 
                    onClick={() => {
                      setSelectedProduct(product.id);
                      setIsCompanyModalOpen(true);
                    }}
                    style={{
                      background:'#1a5595',
                      color:'white',
                      border:'none',
                      borderRadius:4,
                      padding:'4px 10px',
                      fontSize:14,
                      cursor:'pointer'
                    }}
                  >
                    거래처 연결
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{height:41,background:'#f4f5f5',display:'flex',alignItems:'center',borderTop:'1px solid #bcbcbc',padding:'0 20px',justifyContent:'space-between',fontSize:15}}>
        <span>품목관리 [{products.length}] 건 - 완료</span>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{background:'#1976d2',color:'#fff',borderRadius:4,padding:'3px 11px',marginRight:8,marginLeft:6,fontWeight:500}}>1 / 1</span>
          <select style={{border:'1px solid #bcbcbc',borderRadius:6,padding:'3px 19px',fontSize:15}} defaultValue="90 개 페이지별">
            <option value="90 개 페이지별">90 개 페이지별</option>
            <option value="30 개 페이지별">30 개 페이지별</option>
            <option value="10 개 페이지별">10 개 페이지별</option>
          </select>
        </div>
      </div>
      
      {/* 거래처 연결 모달 */}
      {isCompanyModalOpen && selectedProduct && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            width: "400px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}>
            {/* 헤더 */}
            <div style={{ 
              background: '#1a5595', 
              height: 50, 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0 20px', 
              color: '#fff', 
              fontSize: 17,
              fontWeight: 500
            }}>
              <span>거래처 연결 관리</span>
              <span style={{ flex: 1 }} />
              <span 
                onClick={() => setIsCompanyModalOpen(false)} 
                style={{ 
                  cursor: 'pointer', 
                  fontSize: 20 
                }}
              >
                ✖
              </span>
            </div>
            
            {/* 내용 */}
            <div style={{ padding: "20px" }}>
              <div style={{ marginBottom: "15px" }}>
                <div style={{ fontWeight: 500, marginBottom: 10 }}>
                  제품: {products.find(p => p.id === selectedProduct)?.name}
                </div>
                
                <div style={{ marginTop: 15, marginBottom: 10, fontWeight: 500 }}>
                  연결할 거래처 선택:
                </div>
                
                <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ddd", borderRadius: 4, padding: 10 }}>
                  {companies.map(company => {
                    const selectedProductObj = products.find(p => p.id === selectedProduct);
                    const isLinked = selectedProductObj?.linkedCompanies.includes(company.name);
                    
                    return (
                      <div key={company.id} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                        <input 
                          type="checkbox" 
                          id={`company-${company.id}`}
                          checked={isLinked}
                          onChange={() => {
                            const updatedProducts = products.map(p => {
                              if (p.id === selectedProduct) {
                                if (isLinked) {
                                  // 연결 해제
                                  return {
                                    ...p,
                                    linkedCompanies: p.linkedCompanies.filter(c => c !== company.name)
                                  };
                                } else {
                                  // 연결 추가
                                  return {
                                    ...p,
                                    linkedCompanies: [...p.linkedCompanies, company.name]
                                  };
                                }
                              }
                              return p;
                            });
                            setProducts(updatedProducts);
                          }}
                          style={{ marginRight: 10 }}
                        />
                        <label htmlFor={`company-${company.id}`}>{company.name}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* 버튼 영역 */}
            <div 
              style={{ 
                padding: "15px 20px", 
                borderTop: "1px solid #c6dee9",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                background: "#f4f5f5"
              }}
            >
              <button
                onClick={() => setIsCompanyModalOpen(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#1a5595",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
