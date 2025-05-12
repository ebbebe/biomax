// 스타일 관련 상수 정의
import { COLORS } from './theme';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};

export const FONT_SIZES = {
  small: 13,
  normal: 15,
  medium: 16,
  large: 17,
  xlarge: 19
};

export const BORDER_RADIUS = {
  small: 4,
  medium: 8
};

export const COMMON_STYLES = {
  headerBar: {
    height: 40,
    padding: '0 13px',
    background: COLORS.primary,
    color: COLORS.text.light,
    fontSize: FONT_SIZES.large,
    display: 'flex',
    alignItems: 'center'
  },
  tableHeader: {
    background: COLORS.secondary,
    borderBottom: `2.5px solid ${COLORS.accent}`,
    color: COLORS.primary
  },
  modal: {
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    backgroundColor: COLORS.background.light
  },
  button: {
    primary: {
      backgroundColor: COLORS.primary,
      color: COLORS.text.light,
      border: 'none',
      borderRadius: BORDER_RADIUS.small,
      padding: '8px 16px',
      cursor: 'pointer',
      fontSize: FONT_SIZES.normal,
      fontWeight: 500
    },
    secondary: {
      backgroundColor: COLORS.background.light,
      color: COLORS.text.primary,
      border: `1px solid ${COLORS.border}`,
      borderRadius: BORDER_RADIUS.small,
      padding: '8px 16px',
      cursor: 'pointer',
      fontSize: FONT_SIZES.normal
    },
    search: {
      backgroundColor: COLORS.accent,
      color: COLORS.text.light,
      border: 'none',
      borderRadius: BORDER_RADIUS.small,
      padding: '6px 19px',
      cursor: 'pointer',
      fontSize: FONT_SIZES.medium,
      fontWeight: 500,
      boxShadow: '0 0.7px 2.2px #7c747c30',
      marginLeft: 7
    }
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.small,
    fontSize: FONT_SIZES.normal
  }
};
