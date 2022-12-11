import { createGlobalStyle, DefaultTheme } from 'styled-components';
import reset from 'styled-reset';

export const lightTheme: DefaultTheme = {
  blue: '#0095f6',
  green: 'rgb(42, 198, 80)',
  bgColor: '#FAFAFA',
  fontColor: 'rgb(0, 0, 0)',
  borderColor: 'rgb(219, 219, 219)',
  borderDarkColor: 'rgb(0,0,5)',
};
export const darkTheme: DefaultTheme = {
  fontColor: '#fff',
  bgColor: '#000',
};

export const GlobalStyles = createGlobalStyle`
    ${reset}
    input {
      all:unset;
    }
    * {
      box-sizing:border-box;
    }
    body {
      background-color:${(props) => props.theme.bgColor};
      font-size:14px;
      color:${(props) => props.theme.fontColor};
      font-family: 'Ubuntu', sans-serif;
    }
    a {
      text-decoration: none;
      color: inherit;
    }
`;
