/* eslint-disable max-len */
import React, { useCallback } from 'react';
import type { NextPage } from 'next';
import axios from 'axios';
import { END } from 'redux-saga';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Router from 'next/router';

import wrapper, { SagaStore } from '../store/configureStore';
import { loadMyInfoRequest } from '../reducers/user/user';
import { loadPostsRequest } from '../reducers/post/post';
import { RootState } from '../reducers';
import AuthLayout from '../components/auth/AuthLayout';
import { PostsProps } from '../reducers/post/postType';
import RowCards from '../components/auth/RowCards';

const Btn = styled.button`
  /* margin: 0 20px; */
  background-color: #fff;
  border: 1px solid gray;
  width: 90%;
  height: 30px;
  cursor: pointer;
  position: absolute;
  bottom: -20px;

  @media (min-width: 768px) and (max-width: 991px) {
    width: 50%;
  }
  @media (max-width: 767px) {
    width: 80%;
  }
`;
const HeaderBtn = styled.button`
  margin: 0 20px;
  background-color: #fff;
  border: 1px solid gray;
  width: 80px;
  height: 30px;
  cursor: pointer;
  margin: 20px 0;
`;
const CBoxContainer = styled.div`
  width: 100%;
  display: flex;
  @media (min-width: 768px) and (max-width: 991px) {
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
  }
`;

const CBox = styled.div`
  width: 100%;
  margin-top: 60px;
  margin-bottom: 100px;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  align-items: center;
  position: relative;
  @media (min-width: 768px) and (max-width: 991px) {
    margin-bottom: 0;
  }
  @media (max-width: 767px) {
    margin-bottom: 0;
  }
`;
const SHeader = styled.div`
  width: 100%;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  margin-top: 30px;
  font-size: 30px;
`;

const Img = styled.img`
  width: 100%;
  height: 400px;
`;
const Info = styled.div`
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  span {
    font-size: 15px;
    word-spacing: 2px;
    letter-spacing: 2px;
  }
`;

const Home: NextPage = () => {
  const { mainPosts } = useSelector((state: RootState) => state.post);

  const onFeedClick = useCallback(() => {
    Router.push('/feed');
  }, []);

  const onClassic = useCallback(() => {
    Router.push('/category/클래식');
  }, []);
  const onOpera = useCallback(() => {
    Router.push('/category/오페라');
  }, []);
  const onBallet = useCallback(() => {
    Router.push('/category/발레');
  }, []);
  const onKoreanFolk = useCallback(() => {
    Router.push('/category/국악');
  }, []);
  return (
    <AuthLayout>
      <CBoxContainer>
        <CBox>
          <SHeader>클래식</SHeader>
          <Img src="bibimbap.jpg" alt="img" />
          <Info>
            <h1>가치! 같이! 〈온기〉 시즌 5</h1>
            <span>
              추운 겨울, 우리의 이웃에게 따뜻한 〈온기〉를 선물해주세요. 한 사람의 작은 사랑이 모여 우리의 큰 사랑을
              만듭니다. 수익금은 『경제적 상황이 어렵고 홀로 긴 추운 겨울을 지내야 하는 독거노인세대 및 조손가정, 다문화
              가정』에 연탄을 선물합니다. (기부금 전달 결과는 1월 초에 공개됩니다. )
            </span>
          </Info>
          <Btn type="button" onClick={onClassic}>
            더보기
          </Btn>
        </CBox>
        <CBox>
          <SHeader>오페라</SHeader>
          <Img src="ramen.jpg" alt="img" />
          <Info>
            <h1>가족오페라 모차르트 마술피리</h1>
            <span>모차르트 최후의 걸작 모험과 신비의 오페라 동화같은 마술피리</span>
          </Info>
          <Btn type="button" onClick={onOpera}>
            더보기
          </Btn>
        </CBox>
        <CBox>
          <SHeader>발레</SHeader>
          <Img src="jajangmyeon.jpg" alt="img" />
          <Info>
            <h1>고블린파티 〈공주전〉</h1>
            <span>공주전은 ‘공주가 되지 전’을 의미합니다. 작품에서의 공주는 하나의 직업, 하나의 역할을 말합니다…</span>
          </Info>
          <Btn type="button" onClick={onBallet}>
            더보기
          </Btn>
        </CBox>
        <CBox>
          <SHeader>국악</SHeader>
          <Img src="pasta.jpg" alt="img" />
          <Info>
            <h1>파스타</h1>
            <span>
              파스타(이탈리아어: pasta)는 팽창시킨 밀가루 반죽에 물이나 계란을 섞어서 판 형태를 비롯한 다양한 모양으로
              만든 뒤 끓이거나 구워서 먹는 음식이다.
            </span>
          </Info>
          <Btn type="button" onClick={onKoreanFolk}>
            더보기
          </Btn>
        </CBox>
      </CBoxContainer>
      {mainPosts[0] && mainPosts.map((v: PostsProps) => <RowCards posts={v} key={v.id} />)}
      <HeaderBtn type="button" onClick={onFeedClick}>
        피드 더보기
      </HeaderBtn>
    </AuthLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const cookie = req ? req.headers.cookie : '';
  axios.defaults.headers.common.cookie = '';
  if (req && cookie) {
    axios.defaults.headers.common.cookie = cookie;
  }
  store.dispatch(loadPostsRequest(null));
  store.dispatch(loadMyInfoRequest());

  store.dispatch(END);

  await (store as SagaStore).sagaTask?.toPromise();

  return {
    props: {},
  };
});

export default Home;
