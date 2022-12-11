import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    blue?: string;
    green?: string;
    fontColor: string;
    borderColor?: string;
    bgColor: string;
    borderDarkColor?: string;
  }
}
