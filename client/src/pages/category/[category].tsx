import axios from 'axios';
import Router, { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import styled from 'styled-components';
import AuthLayout from '../../components/auth/AuthLayout';
import RowCards from '../../components/auth/RowCards';

import { RootState } from '../../reducers';
import { loadCategoryPostsRequest } from '../../reducers/post/post';
import { PostsProps } from '../../reducers/post/postType';
import { loadMyInfoRequest } from '../../reducers/user/user';
import wrapper, { SagaStore } from '../../store/configureStore';

const Box = styled.div`
  font-size: 30px;
  display: flex;
  width: 30%;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  margin-top: 20px;
  @media (min-width: 768px) and (max-width: 991px) {
    width: 50%;
  }
  @media (max-width: 767px) {
    width: 80%;
    font-size: 12px;
  }
`;

const CategoryName = styled.div<{ run: boolean }>`
  color: ${(props) => (props.run ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.3)')};
  border-bottom: ${(props) => (props.run ? '1px solid red' : ' 1px solid rgba(0,0,0,0.3)')};
  cursor: pointer;
`;

const Category = () => {
  const dispatch = useDispatch();
  const [ref, inView] = useInView();
  const { categoryPosts, morePosts, loadCategoryPostsLoading } = useSelector((state: RootState) => state.post);

  const router = useRouter();
  const { category } = router.query;
  console.log(category);
  const [classic, setClassic] = useState(true);
  const [opera, setOpera] = useState(false);
  const [ballet, setBallet] = useState(false);
  const [koreanFolk, setKoreanFolk] = useState(false);

  const onCLassic = useCallback(() => {
    setClassic(true);
    setOpera(false);
    setBallet(false);
    setKoreanFolk(false);
    Router.push('/category/클래식');
  }, []);

  const onOpera = useCallback(() => {
    setOpera(true);
    setClassic(false);
    setBallet(false);
    setKoreanFolk(false);
    Router.push('/category/오페라');
  }, []);
  const onBallet = useCallback(() => {
    setBallet(true);
    setOpera(false);
    setClassic(false);
    setKoreanFolk(false);
    Router.push('/category/발레');
  }, []);
  const onKoreanFolk = useCallback(() => {
    setKoreanFolk(true);
    setOpera(false);
    setClassic(false);
    setBallet(false);
    Router.push('/category/국악');
  }, []);

  useEffect(() => {
    if (inView && morePosts && !loadCategoryPostsLoading) {
      const lastId = categoryPosts[categoryPosts.length - 1]?.id;
      const data = { category, lastId };
      dispatch(loadCategoryPostsRequest(data));
    }
  }, [inView, morePosts, loadCategoryPostsLoading]);

  return (
    <AuthLayout>
      <Box>
        <CategoryName run={classic} onClick={onCLassic}>
          클래식
        </CategoryName>
        <CategoryName run={opera} onClick={onOpera}>
          오페라
        </CategoryName>
        <CategoryName run={ballet} onClick={onBallet}>
          발래
        </CategoryName>
        <CategoryName run={koreanFolk} onClick={onKoreanFolk}>
          국악
        </CategoryName>
      </Box>
      {categoryPosts[0] && categoryPosts.map((v: PostsProps) => <RowCards posts={v} key={v.id} />)}
      <div ref={morePosts && !loadCategoryPostsLoading ? ref : undefined} style={{ margin: '30px' }} />
    </AuthLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, params }: any) => {
  const cookie = req ? req.headers.cookie : '';
  axios.defaults.headers.common.cookie = '';
  if (req && cookie) {
    axios.defaults.headers.common.cookie = cookie;
  }
  store.dispatch(loadCategoryPostsRequest({ category: params.category }));
  store.dispatch(loadMyInfoRequest());

  store.dispatch(END);

  await (store as SagaStore).sagaTask?.toPromise();

  return {
    props: {},
  };
});

export default Category;
