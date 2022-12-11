import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Router from 'next/router';
import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { RootState } from '../reducers';
import { deleteUserRequest } from '../reducers/user/user';

const MBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const Box = styled.div`
  margin-top: 80px;
  h1 {
    font-size: 16px;
    font-weight: 400;
  }
`;
const Agree = styled.div<{ agree: boolean }>`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  .icon {
    margin-right: 20px;
    color: ${(props) => (props.agree ? 'black' : 'gray')};
  }
`;
const BtnBox = styled.div`
  display: flex;
  justify-content: center;
`;

const Btn = styled.button`
  width: 40%;
  padding: 10px 0;
  margin-top: 10px;
`;

const DeleteUser = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state: RootState) => state.user);
  const [agree, setAgree] = useState(false);
  const onClick = useCallback(() => {
    setAgree((cur) => !cur);
  }, []);

  const onDeleteUser = useCallback(() => {
    if (agree) {
      dispatch(deleteUserRequest(me.id));
      return Router.push('/');
    }
    return alert('체크를 해주세요');
  }, [agree]);

  return (
    <div>
      <div className="line">
        <h1>회원탈퇴</h1>
      </div>
      <MBox>
        <Box>
          <h1>회원탈퇴 안내</h1>
          <h1>지금까지 서비스를 이용해주셔서 감사합니다.</h1>
          <h1>회원을 탈퇴하면 내 나의 계정 정보 및 기록 내역이 삭제되고 복구 할 수 없습니다.</h1>
          <Agree agree={agree}>
            <FontAwesomeIcon icon={faCircleCheck} className="icon" onClick={onClick} />
            <h1>체크를 해주세요</h1>
          </Agree>
          <BtnBox>
            <Btn type="button" onClick={onDeleteUser}>
              회원탈퇴
            </Btn>
          </BtnBox>
        </Box>
      </MBox>
    </div>
  );
};

export default DeleteUser;
