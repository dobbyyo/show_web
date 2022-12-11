import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Router from 'next/router';
import React, { FC, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../reducers';
import { logoutRequest } from '../../reducers/user/user';
import Sbox from './Sbox';

const Slider = styled.div`
  z-index: 9999;
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: hidden;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.fontColor};
  font-size: 20px;
  font-weight: 800;
  /* padding: 0 20px; */
`;

const Rows = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px 0;
`;
const Row = styled.div`
  margin: 30px 20px;
  padding: 10px 0;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
`;
const Category = styled.div`
  display: flex;
  flex-direction: column;
  .able {
    display: flex;
    justify-content: space-between;
    margin: 0 20px;
    margin-top: 20px;
    align-items: center;
    cursor: pointer;
  }
  .disable {
  }
`;
interface Props {
  onCloseBar: () => void;
}

const SlideBox: FC<Props> = ({ onCloseBar }) => {
  const dispatch = useDispatch();
  const { me } = useSelector((state: RootState) => state.user);
  const [onOpen, setOnOpen] = useState(false);

  const Sclcik = useCallback(() => {
    setOnOpen((cur) => !cur);
  }, []);

  const onLogin = useCallback(() => {
    Router.push('/login');
    onCloseBar();
  }, []);
  const onJoin = useCallback(() => {
    Router.push('/join');
    onCloseBar();
  }, []);
  const onPost = useCallback(() => {
    Router.push('/upload');
    onCloseBar();
  }, []);
  const onLogout = useCallback(() => {
    dispatch(logoutRequest());
    onCloseBar();
    Router.push('/');
  }, []);
  const onUser = useCallback(() => {
    Router.push(`/user/${me.id}`);
    onCloseBar();
  }, []);

  return (
    <Slider>
      <Rows>
        <Category>
          <div className="able" onClick={Sclcik} aria-hidden="true">
            <span>카테고리</span>
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
          {onOpen && (
            <div className="disable">
              <Sbox onCloseBar={onCloseBar} />
            </div>
          )}
        </Category>
        {me ? (
          <>
            <Row onClick={onLogout}>로그아웃</Row>
            <Row onClick={onUser}>프로필</Row>
            <Row onClick={onPost}>업로드</Row>
          </>
        ) : (
          <>
            <Row onClick={onLogin}>로그인</Row>
            <Row onClick={onJoin}>회원가입</Row>
          </>
        )}
      </Rows>
    </Slider>
  );
};

export default SlideBox;
