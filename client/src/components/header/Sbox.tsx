import React, { FC, useCallback } from 'react';
import Router from 'next/router';
import styled from 'styled-components';

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: #e5e5e5;
  margin-top: 20px;
  @media (min-width: 1200px) {
    position: fixed;
    height: 400px;
    width: 100%;
    z-index: 999;
    background-color: #fff;
    font-size: 22px;
    margin-top: 0;
  }
`;
const H1 = styled.h1`
  margin: 30px 20px;
  cursor: pointer;
`;

interface Props {
  onCloseBar: () => void;
}

const Sbox: FC<Props> = ({ onCloseBar }) => {
  const onJapan = useCallback(() => {
    Router.push('/category/일식');
    onCloseBar();
  }, []);
  const onChina = useCallback(() => {
    Router.push('/category/중식');
    onCloseBar();
  }, []);
  const onEurope = useCallback(() => {
    Router.push('/category/양식');
    onCloseBar();
  }, []);
  const onKorea = useCallback(() => {
    Router.push('/category/한식');
    onCloseBar();
  }, []);
  return (
    <Box>
      <H1 onClick={onJapan}>양식</H1>
      <H1 onClick={onChina}>중식</H1>
      <H1 onClick={onEurope}>일신</H1>
      <H1 onClick={onKorea}>한식</H1>
    </Box>
  );
};

export default Sbox;
