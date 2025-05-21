'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Order } from '@/lib/types';

/**
 * HTML 요소를 이용하여 주문 데이터를 PDF로 생성하는 함수
 * html2canvas를 사용하여 한글 폰트 문제 해결
 * @param orders 변환할 주문 데이터 배열
 * @param title PDF 제목 (기본값: 주문 내역)
 */
async function createOrderElement(orders: Order[], title: string = '주문 내역') {
  // DOM에 추가할 임시 요소 생성
  const tempElement = document.createElement('div');
  tempElement.style.position = 'absolute';
  tempElement.style.left = '-9999px';
  tempElement.style.top = '-9999px';
  tempElement.style.width = '800px';
  tempElement.style.backgroundColor = 'white';
  tempElement.style.padding = '20px';
  tempElement.style.fontFamily = 'Arial, sans-serif';
  
  // 현재 날짜
  const today = new Date().toLocaleDateString('ko-KR');
  
  // HTML 내용 생성
  let htmlContent = `
    <div style="padding: 20px; font-family: 'Noto Sans KR', sans-serif;">
      <h1 style="font-size: 24px; margin-bottom: 10px;">${title}</h1>
      <p style="font-size: 12px; color: #666;">생성일: ${today}</p>
      <div style="margin-top: 30px;">
  `;
  
  // 각 주문 정보 추가
  orders.forEach((order, index) => {
    htmlContent += `
      <div style="margin-bottom: ${index < orders.length - 1 ? '40px' : '20px'}; ${index > 0 ? 'border-top: 1px solid #eee; padding-top: 20px;' : ''}">
        <h2 style="font-size: 16px; margin-bottom: 10px;">주문 ID: ${order.id}</h2>
        <p style="font-size: 13px; margin: 5px 0;">주문자: ${order.customerName} ${order.companyName ? `(${order.companyName})` : ''}</p>
        <p style="font-size: 13px; margin: 5px 0;">주문일: ${new Date(order.date).toLocaleString('ko-KR')}</p>
        <p style="font-size: 13px; margin: 5px 0;">상태: ${order.status}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">제품명</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">수량</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">제품 메모</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    // 주문 항목 추가
    order.items.forEach(item => {
      htmlContent += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.note || '-'}</td>
        </tr>
      `;
    });
    
    htmlContent += `
          </tbody>
        </table>
    `;
    
    // 주문 메모 추가
    if (order.note) {
      htmlContent += `
        <div style="margin-top: 15px;">
          <h4 style="font-size: 13px; margin-bottom: 5px;">주문 메모:</h4>
          <div style="padding: 10px; border: 1px solid #eee; background-color: #f9f9f9;">
            <p style="font-size: 12px; margin: 0;">${order.note}</p>
          </div>
        </div>
      `;
    }
    
    htmlContent += '</div>';
  });
  
  // 바닥글 추가
  htmlContent += `
      </div>
      <div style="margin-top: 30px; font-size: 10px; color: #999; text-align: center;">
        바이오맥스 주문시스템에서 생성된 문서입니다.
      </div>
    </div>
  `;
  
  tempElement.innerHTML = htmlContent;
  document.body.appendChild(tempElement);
  
  return tempElement;
}

/**
 * 주문 데이터를 PDF로 변환하는 함수
 * @param orders 변환할 주문 데이터 배열
 * @param title PDF 제목 (기본값: 주문 내역)
 */
export async function generateOrderPDF(orders: Order[], title: string = '주문 내역') {
  try {
    // 임시 HTML 요소 생성
    const element = await createOrderElement(orders, title);
    
    // html2canvas로 HTML 요소를 이미지로 변환
    const canvas = await html2canvas(element, {
      scale: 1.5, // 더 높은 해상도를 위해
      useCORS: true,
      logging: false,
      backgroundColor: 'white',
    });
    
    // 생성된 이미지를 jsPDF에 추가
    const imgData = canvas.toDataURL('image/png');
    
    // A4 사이즈에 맞게 PDF 생성
    const pdfWidth = 210; // A4 너비(mm)
    const pdfHeight = 297; // A4 높이(mm)
    
    const imgWidth = pdfWidth - 20; // 여백 고려
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // 이미지가 A4 페이지 높이보다 크면 여러 페이지로 나눔
    let heightLeft = imgHeight;
    let position = 10; // 상단 여백
    let pageHeight = pdfHeight - 20; // 여백 고려
    
    doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // 여러 페이지에 나눠 그리기
    while (heightLeft > 0) {
      position = 10 - pdfHeight; // 다음 페이지의 상단 시작 위치
      doc.addPage();
      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // 임시 요소 제거
    document.body.removeChild(element);
    
    return doc;
  } catch (error) {
    console.error('PDF 생성 중 오류 발생:', error);
    // 오류 발생 시 기본 jsPDF 문서 반환
    return new jsPDF();
  }
}

/**
 * 단일 주문을 PDF로 생성하고 다운로드하는 함수
 * @param order 주문 데이터
 */
export async function downloadOrderPDF(order: Order) {
  const doc = await generateOrderPDF([order], `주문서 (${order.customerName})`);
  doc.save(`주문서_${order.id}.pdf`);
}

/**
 * 여러 주문을 PDF로 생성하고 다운로드하는 함수
 * @param orders 주문 데이터 배열
 */
export async function downloadOrdersPDF(orders: Order[]) {
  const doc = await generateOrderPDF(orders);
  doc.save(`주문내역_${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * 단일 주문을 PDF로 생성하고 새 탭에서 열어주는 함수
 * @param order 주문 데이터
 */
export async function openOrderPDF(order: Order) {
  const doc = await generateOrderPDF([order], `주문서 (${order.customerName})`);
  const pdfUrl = doc.output('bloburl');
  window.open(pdfUrl as string, '_blank');
}
