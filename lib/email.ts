'use server';

import nodemailer from 'nodemailer';
import { Order } from '@/lib/types';

// 이메일 발송을 위한 트랜스포터 구성
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// 주문 내역 이메일 발송 함수
export async function sendOrderCompletionEmail(orders: Order[], recipientEmail?: string) {
  try {
    // 수신자 이메일이 없는 경우 환경 변수의 기본 이메일 사용
    const recipient = recipientEmail || process.env.DEFAULT_ORDER_EMAIL;
    
    if (!recipient) {
      return { error: '수신자 이메일 주소가 설정되지 않았습니다.' };
    }
    
    // 이메일에 표시할 주문 데이터 HTML 형식으로 생성
    const ordersHtml = orders.map(order => {
      const itemsHtml = order.items.map(item => 
        `<tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.registDate ? new Date(item.registDate).toLocaleDateString('ko-KR') : '-'}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.note || '-'}</td>
        </tr>`
      ).join('');
      
      return `
        <div style="margin-bottom: 30px; border: 1px solid #eee; padding: 15px; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #333;">주문 ID: ${order.id}</h3>
          <p><strong>주문자:</strong> ${order.customerName} (${order.companyName || ''})</p>
          <p><strong>주문일:</strong> ${new Date(order.date).toLocaleString('ko-KR')}</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">제품명</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">수량</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">등록일</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">제품 메모</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>
      `;
    }).join('');
    
    // 현재 날짜 포맷팅
    const today = new Date().toLocaleDateString('ko-KR');
    
    // 이메일 전송
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_SENDER_NAME || '바이오맥스 주문시스템'}" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: `[바이오맥스] 완료 처리된 주문 내역 (${today})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a5568; border-bottom: 2px solid #edf2f7; padding-bottom: 10px;">완료 처리된 주문 내역</h2>
          <p>다음 주문이 완료 처리되었습니다:</p>
          
          ${ordersHtml}
          
          <p style="color: #718096; font-size: 0.9em; margin-top: 30px; padding-top: 10px; border-top: 1px solid #edf2f7;">
            이 이메일은 바이오맥스 주문시스템에서 자동 발송되었습니다.
          </p>
        </div>
      `,
    });
    
    console.log('이메일 발송 성공:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('이메일 발송 오류:', error);
    return { error: `이메일 발송 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` };
  }
} 