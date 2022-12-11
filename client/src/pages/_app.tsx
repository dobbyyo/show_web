import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';

import { darkTheme, GlobalStyles, lightTheme } from '../theme/styles';
import Header from '../components/header/Header';
import wrapper from '../store/configureStore';

declare global {
  interface Window {
    kakao: any;
  }
}

function DobbyFood({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={lightTheme || darkTheme}>
      <GlobalStyles />
      <Header />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default wrapper.withRedux(DobbyFood);
