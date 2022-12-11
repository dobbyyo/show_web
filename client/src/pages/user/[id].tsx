/* eslint-disable no-nested-ternary */
import axios from 'axios';
import Router, { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBarsStaggered } from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../../reducers';
import {
  loadMyInfoRequest,
  loadOtherUserInfoRequest,
  loadUserFollowingsRequest,
  loadUserUnFollowersRequest,
} from '../../reducers/user/user';
import wrapper, { SagaStore } from '../../store/configureStore';
import EditUser from '../../layout/EditUserMail';
import MyInfo from '../../layout/MyInfo';
import EditPassword from '../../layout/EditPassword';
import DeleteUser from '../../layout/DeleteUser';
import { loadOtherUserPostsRequest, loadSavePostsRequest } from '../../reducers/post/post';
import Menu from '../../layout/Menu';
import Slider from '../../components/auth/Slider';

const Main = styled.div`
  width: 100%;
  font-size: 20px;
  padding: 0 90px;
  margin-top: 50px;
  display: flex;
  @media (min-width: 768px) and (max-width: 991px) {
  }
  @media (max-width: 767px) {
    padding: 0 10px;
  }
`;

const Middle = styled.div`
  width: 70%;
  position: relative;
  margin: 0 auto;
  .line {
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    padding: 20px 0;
  }
  h1 {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 10px;
  }
  .barIcon {
    display: none;
  }
  @media (min-width: 768px) and (max-width: 991px) {
    width: 100%;
    .line {
      padding: 29px 40px;
    }
    .barIcon {
      display: block;
      position: absolute;
      left: 0;
      top: 30px;
    }
  }
  @media (max-width: 767px) {
    width: 100%;
    font-size: 13px;
    .line {
      padding: 23px 40px;
      h1 {
        font-size: 13px;
      }
    }
    .barIcon {
      display: block;
      position: absolute;
      left: 0;
      top: 23px;
    }
  }
`;

const User = () => {
  const { userInfo, userChangeDone } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      Router.push('/');
    }
  }, []);

  useEffect(() => {
    if (userChangeDone) {
      dispatch(loadMyInfoRequest());
    }
  }, [userChangeDone]);

  const [myInfo, setMyInfo] = useState(true);
  const [editUser, setEditUser] = useState(false);
  const [Password, setPassword] = useState(false);
  const [Delete, setDelete] = useState(false);

  const onEditUser = useCallback(() => {
    setEditUser(true);
    setMyInfo(false);
    setPassword(false);
    setDelete(false);
  }, []);
  const onMyInfo = useCallback(() => {
    setMyInfo(true);
    setEditUser(false);
    setPassword(false);
    setDelete(false);
  }, []);
  const onPassword = useCallback(() => {
    setPassword(true);
    setMyInfo(false);
    setEditUser(false);
    setDelete(false);
  }, []);
  const onDelete = useCallback(() => {
    setPassword(false);
    setMyInfo(false);
    setEditUser(false);
    setDelete(true);
  }, []);

  const onCloseEditUser = useCallback(() => {
    setMyInfo(true);
    setEditUser(false);
    setPassword(false);
    setDelete(false);
  }, []);

  useEffect(() => {
    dispatch(loadOtherUserPostsRequest({ id: userInfo.id }));
  }, []);

  const [slider, setSlider] = useState(false);
  const onClick = useCallback(() => {
    setSlider((cur) => !cur);
  }, []);

  return (
    <Main>
      {slider ? (
        <Slider onEditUser={onEditUser} onMyInfo={onMyInfo} onPassword={onPassword} onDelete={onDelete} />
      ) : null}
      <Menu
        userInfo={userInfo}
        onEditUser={onEditUser}
        onMyInfo={onMyInfo}
        onPassword={onPassword}
        onDelete={onDelete}
      />
      <Middle>
        {slider ? (
          <FontAwesomeIcon icon={faBarsStaggered} className="barIcon" onClick={onClick} />
        ) : (
          <FontAwesomeIcon icon={faBars} className="barIcon" onClick={onClick} />
        )}
        {editUser && <EditUser onCloseEditUser={onCloseEditUser} />}
        {Password && <EditPassword onCloseEditUser={onCloseEditUser} />}
        {Delete && <DeleteUser />}
        {myInfo && <MyInfo UserInfo={userInfo} />}
      </Middle>
    </Main>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, params }: any) => {
  const cookie = req ? req.headers.cookie : '';
  axios.defaults.headers.common.cookie = '';
  if (req && cookie) {
    axios.defaults.headers.common.cookie = cookie;
  }
  store.dispatch(loadMyInfoRequest());
  store.dispatch(loadOtherUserInfoRequest(params.id));
  store.dispatch(loadSavePostsRequest(params.id));
  store.dispatch(loadUserFollowingsRequest(params.id));
  store.dispatch(loadUserUnFollowersRequest(params.id));
  store.dispatch(END);

  await (store as SagaStore).sagaTask?.toPromise();

  return {
    props: {},
  };
});

export default User;
