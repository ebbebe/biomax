"use client";
import React, { useState, useMemo } from "react";
import ProductCreateModal from "./ProductCreateModal";

interface ProductData {
  id: string;
  code: string;
  name: string;
  stock: string;
  registrationDate: string;
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
  const [showLinkedCompaniesModal, setShowLinkedCompaniesModal] = useState(false);
  const [viewingLinkedCompanies, setViewingLinkedCompanies] = useState<string[]>([]);
  const [viewingProductName, setViewingProductName] = useState<string>("");
  const [companySearchTerm, setCompanySearchTerm] = useState<string>("");
  const [showProductCreateModal, setShowProductCreateModal] = useState(false);
  
  // 검색어에 따라 필터링된 거래처 목록
  const filteredLinkedCompanies = viewingLinkedCompanies.filter(company => 
    company.toLowerCase().includes(companySearchTerm.toLowerCase())
  );
  
  // 카테고리 필드는 삭제되었으니 이 코드도 삭제
  
  // 품목 등록 처리
  const handleProductCreate = (newProduct: Omit<ProductData, "id" | "linkedCompanies">) => {
    // 새 ID 생성 (실제로는 서버에서 처리해야 함)
    const newId = (Math.max(...products.map(p => parseInt(p.id)), 0) + 1).toString();
    
    const newProductWithId: ProductData = {
      ...newProduct,
      id: newId,
      linkedCompanies: [],
    };
    
    setProducts([...products, newProductWithId]);
    setShowProductCreateModal(false);
  };

  return (
    <>
      <div style={{ background: '#1a5595', height: 40, display: 'flex', alignItems: 'center', padding: '0 13px', color: '#fff', fontSize: 17 }}>
        <span style={{fontWeight:500,marginRight:20}}>품목관리 [{products.length}]</span>
        <span style={{flex:1}} />
        {/* toolbar icons */}
        <span title="새로고침" style={{marginLeft:12,marginRight:11,cursor:'pointer',fontSize:19}}>↻</span>
        <span 
          title="등록" 
          style={{marginRight:13,cursor:'pointer',fontSize:19}}
          onClick={() => setShowProductCreateModal(true)}
        >💾</span>
        <span title="수정" style={{marginRight:13,cursor:'pointer',fontSize:19}}>✏️</span>
        <span title="삭제" style={{marginRight:13,cursor:'pointer',fontSize:19}}>🗑️</span>
        <span title="엑셀" style={{marginRight:13,cursor:'pointer',fontSize:19}}>📄</span>
      </div>
      {/* Filters */}
      <div style={{display:'flex',alignItems:'center',padding:'17px 12px 8px 14px',background:'#fff',borderBottom:'1px solid #c6dee9',gap:8}}>
        <input style={{border:'1px solid #bcbcbc',borderRadius:4,padding:'5px 8px',fontSize:15,width:130}} placeholder="제품명" />
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
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>등록일자</th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>상품코드</th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>제품명</th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>재고</th>
              <th style={{padding:'8px 0',border:'1px solid #bcbcbc'}}>연결된 거래처</th>
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
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{product.registrationDate || '-'}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{product.code || '-'}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{product.name}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>{product.stock}</td>
                <td style={{border:'1px solid #bcbcbc',padding:'6px 0'}}>
                  <button
                    onClick={() => {
                      setSelectedProduct(product.id);
                      setViewingLinkedCompanies(product.linkedCompanies);
                      setViewingProductName(product.name);
                      setShowLinkedCompaniesModal(true);
                      setCompanySearchTerm("");
                    }}
                    style={{
                      background: product.linkedCompanies.length > 0 ? '#e3f2fd' : '#1a5595',
                      color: product.linkedCompanies.length > 0 ? '#1976d2' : 'white',
                      padding:'4px 10px',
                      borderRadius:4,
                      fontSize:14,
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    {product.linkedCompanies.length > 0 
                      ? `${product.linkedCompanies.length}개 거래처 연결됨` 
                      : '거래처 연결하기'}
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
      
      {/* 거래처 연결 모달 - 통합되어 삭제됨 */}

      {/* 연결된 거래처 목록 모달 */}
      {showLinkedCompaniesModal && (
        <div 
          style={{
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
          }}
          onClick={() => setShowLinkedCompaniesModal(false)}
        >
          <div 
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              width: "500px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column"
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
              <span>연결된 거래처 목록</span>
              <span style={{ flex: 1 }} />
              <span 
                onClick={() => setShowLinkedCompaniesModal(false)} 
                style={{ 
                  cursor: 'pointer', 
                  fontSize: 20 
                }}
              >
                ✖
              </span>
            </div>
            
            {/* 검색 영역 */}
            <div style={{ padding: "15px 20px 10px", borderBottom: "1px solid #eee" }}>
              <div style={{ marginBottom: "10px", fontWeight: 500 }}>
                제품: {viewingProductName}
              </div>
              <div style={{ marginBottom: "5px", fontWeight: 500 }}>
                거래처 연결 관리 ({viewingLinkedCompanies.length}개 연결됨){companySearchTerm ? ` / 검색 결과: ${filteredLinkedCompanies.length}개` : ""}
              </div>
              <input 
                type="text" 
                placeholder="거래처 검색..."
                value={companySearchTerm}
                onChange={(e) => setCompanySearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
              />
            </div>
            
            {/* 거래처 목록 */}
            <div style={{ 
              padding: "0 20px", 
              overflowY: "auto", 
              flex: 1,
              maxHeight: "300px"
            }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px"
              }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #eee" }}>
                    <th style={{ 
                      width: "40px",
                      textAlign: "center", 
                      padding: "10px 5px", 
                      fontWeight: 500,
                      color: "#555",
                      position: "sticky",
                      top: 0,
                      background: "white",
                      zIndex: 1
                    }}>
                      연결
                    </th>
                    <th style={{ 
                      textAlign: "left", 
                      padding: "10px 5px", 
                      fontWeight: 500,
                      color: "#555",
                      position: "sticky",
                      top: 0,
                      background: "white",
                      zIndex: 1
                    }}>
                      거래처명
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {companySearchTerm === "" ? (
                    // 검색어가 없을 때는 모든 거래처 표시
                    companies.map(company => {
                      const isLinked = viewingLinkedCompanies.includes(company.name);
                      return (
                        <tr key={company.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                          <td style={{ padding: "10px 5px", textAlign: "center" }}>
                            <input 
                              type="checkbox" 
                              checked={isLinked}
                              onChange={() => {
                                if (selectedProduct) {
                                  const updatedProducts = products.map(p => {
                                    if (p.id === selectedProduct) {
                                      if (isLinked) {
                                        // 연결 해제
                                        const newLinkedCompanies = p.linkedCompanies.filter(c => c !== company.name);
                                        setViewingLinkedCompanies(newLinkedCompanies);
                                        return {
                                          ...p,
                                          linkedCompanies: newLinkedCompanies
                                        };
                                      } else {
                                        // 연결 추가
                                        const newLinkedCompanies = [...p.linkedCompanies, company.name];
                                        setViewingLinkedCompanies(newLinkedCompanies);
                                        return {
                                          ...p,
                                          linkedCompanies: newLinkedCompanies
                                        };
                                      }
                                    }
                                    return p;
                                  });
                                  setProducts(updatedProducts);
                                }
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px 5px" }}>{company.name}</td>
                        </tr>
                      );
                    })
                  ) : (
                    // 검색어가 있을 때는 필터링된 거래처만 표시
                    companies
                      .filter(company => company.name.toLowerCase().includes(companySearchTerm.toLowerCase()))
                      .map(company => {
                        const isLinked = viewingLinkedCompanies.includes(company.name);
                        return (
                          <tr key={company.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                            <td style={{ padding: "10px 5px", textAlign: "center" }}>
                              <input 
                                type="checkbox" 
                                checked={isLinked}
                                onChange={() => {
                                  if (selectedProduct) {
                                    const updatedProducts = products.map(p => {
                                      if (p.id === selectedProduct) {
                                        if (isLinked) {
                                          // 연결 해제
                                          const newLinkedCompanies = p.linkedCompanies.filter(c => c !== company.name);
                                          setViewingLinkedCompanies(newLinkedCompanies);
                                          return {
                                            ...p,
                                            linkedCompanies: newLinkedCompanies
                                          };
                                        } else {
                                          // 연결 추가
                                          const newLinkedCompanies = [...p.linkedCompanies, company.name];
                                          setViewingLinkedCompanies(newLinkedCompanies);
                                          return {
                                            ...p,
                                            linkedCompanies: newLinkedCompanies
                                          };
                                        }
                                      }
                                      return p;
                                    });
                                    setProducts(updatedProducts);
                                  }
                                }}
                              />
                            </td>
                            <td style={{ padding: "10px 5px" }}>{company.name}</td>
                          </tr>
                        );
                      })
                  )}
                  {companySearchTerm !== "" && companies.filter(company => 
                    company.name.toLowerCase().includes(companySearchTerm.toLowerCase())
                  ).length === 0 && (
                    <tr>
                      <td colSpan={2} style={{ padding: "20px 5px", textAlign: "center", color: "#888" }}>
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* 버튼 영역 */}
            <div style={{ 
              padding: "15px 20px", 
              borderTop: "1px solid #eee",
              display: "flex",
              justifyContent: "flex-end",
              background: "#f9f9f9"
            }}>
              <button
                onClick={() => setShowLinkedCompaniesModal(false)}
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
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 품목 등록 모달 */}
      {showProductCreateModal && (
        <ProductCreateModal
          onClose={() => setShowProductCreateModal(false)}
          onSave={handleProductCreate}
        />
      )}
    </>
  );
}
