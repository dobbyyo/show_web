import React, { FC } from 'react';
import styled from 'styled-components';

const Box = styled.div`
  width: 20%;
  z-index: 999;
  position: absolute;
  left: 0;
  top: 17%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 200px;
  @media (min-width: 768px) and (max-width: 991px) {
  }
  @media (max-width: 767px) {
    top: 10%;
    display: flex;
    width: 100%;
    flex-direction: row;
    height: 30px;
  }
`;

const H1 = styled.h1`
  color: #000;
  cursor: pointer;
  @media (min-width: 768px) and (max-width: 991px) {
  }
  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

interface Props {
  onEditUser: () => void;
  onMyInfo: () => void;
  onPassword: () => void;
  onDelete: () => void;
}

const Slider: FC<Props> = ({ onEditUser, onMyInfo, onPassword, onDelete }) => {
  return (
    <Box>
      <H1 onClick={onMyInfo}>포스터</H1>
      <H1 onClick={onEditUser}>이메일 변경</H1>
      <H1 onClick={onPassword}>비밀번호 변경</H1>
      <H1 onClick={onDelete}>회원탈퇴</H1>
    </Box>
  );
};

export default Slider;
