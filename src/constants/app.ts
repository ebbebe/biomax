// 애플리케이션 관련 상수 정의

export const APP_CONSTANTS = {
  defaultStatus: "대기중",
  permissions: {
    allow: "허용",
    deny: "거부"
  },
  userLevels: {
    admin: "관리",
    normal: "일반"
  },
  orderStatus: {
    pending: "대기중",
    inProgress: "진행",
    completed: "완료"
  }
};

export const VALIDATION_MESSAGES = {
  required: "필수 입력 항목입니다",
  invalidFormat: "올바른 형식이 아닙니다",
  loginRequired: "로그인 아이디를 입력해주세요",
  passwordRequired: "비밀번호를 입력해주세요",
  nameRequired: "이름을 입력해주세요",
  companyRequired: "회사명을 입력해주세요",
  addressRequired: "주소를 입력해주세요",
  productRequired: "제품을 선택해주세요",
  quantityRequired: "수량을 입력해주세요",
  invalidQuantity: "수량은 숫자만 입력 가능합니다"
};
