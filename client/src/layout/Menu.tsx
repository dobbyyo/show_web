/* eslint-disable no-nested-ternary */
import React, { FC, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import gravatar from 'gravatar';
import { useSelector, useDispatch } from 'react-redux';

import { OtherUserInfo } from '../reducers/user/userTypes';
import { RootState } from '../reducers';
import { followRequest, unFollowRequest } from '../reducers/user/user';

const MenuContainer = styled.div`
  width: 20%;
  height: 100%;
  @media (min-width: 768px) and (max-width: 991px) {
    display: none;
  }
  @media (max-width: 767px) {
    display: none;
  }
`;

const NicknameDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  .AvatarIcon {
    display: flex;
    align-items: center;
    h1 {
      margin-left: 15px;
      font-weight: 800;
      margin-right: 20px;
    }
  }
`;
const Btn = styled.button`
  background-color: initial;
  border: 1px solid #000;
  height: 30px;
  width: 80px;
  cursor: pointer;
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 19px;
`;

const Ul = styled.div`
  margin-bottom: 50px;
  margin-top: 30px;
`;
const Title = styled.div`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
`;
const Li = styled.div`
  margin: 20px 0;
  font-weight: 600;
  cursor: pointer;
`;

const Img = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`;

interface Props {
  userInfo: OtherUserInfo;
  onEditUser: () => void;
  onMyInfo: () => void;
  onPassword: () => void;
  onDelete: () => void;
}
const Menu: FC<Props> = ({ userInfo, onEditUser, onMyInfo, onPassword, onDelete }) => {
  const { me } = useSelector((state: RootState) => state.user);
  const id = useSelector((state: RootState) => state.user.me?.id);

  const [userOk, setUserOk] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (me && userInfo) {
      if (me.id !== userInfo.id) {
        setUserOk(true);
      }
    }
  }, [me]);

  let isFollowing = false;
  if (me && userInfo) {
    isFollowing = me?.Followings.find((v: any) => v.id === userInfo.id);
  }

  const onClickBtn = useCallback(() => {
    if (isFollowing) {
      dispatch(unFollowRequest(userInfo.id));
    } else {
      dispatch(followRequest(userInfo.id));
    }
  }, [isFollowing]);

  return (
    <MenuContainer>
      <NicknameDiv>
        <div className="AvatarIcon">
          {userInfo ? (
            userInfo.Image ? (
              <Img src={`${userInfo.Image.src}`} alt="img" />
            ) : (
              <Img src={gravatar.url(userInfo.email, { s: '100%', d: 'retro' })} alt="img" />
            )
          ) : null}
          <h1>{userInfo && userInfo.nickname} 님</h1>
        </div>
        {userOk && (
          <Btn type="button" onClick={onClickBtn}>
            {isFollowing ? 'UnFollow' : 'Follow'}
          </Btn>
        )}
      </NicknameDiv>
      {userInfo.id === id ? (
        <Box>
          <Ul>
            <Title>나의 활동</Title>
            <Li onClick={onMyInfo}>찜</Li>
            <Li>북마크</Li>
            <Li>팔로워</Li>
            <Li>팔로잉</Li>
          </Ul>
          <Ul>
            <Title>회원정보</Title>
            <Li onClick={onEditUser}>이메일 변경</Li>
            <Li onClick={onPassword}>비밀번호 변경</Li>
            <Li onClick={onDelete}>회원탈퇴</Li>
          </Ul>
        </Box>
      ) : null}

      {id && (
        <div style={{ marginTop: '20px' }}>
          <Btn type="button">로그아웃</Btn>
        </div>
      )}
    </MenuContainer>
  );
};

export default Menu;
