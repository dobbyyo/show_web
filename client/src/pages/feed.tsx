import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';

import { END } from 'redux-saga';
import { RootState } from '../reducers';
import { loadPostsRequest } from '../reducers/post/post';
import { loadMyInfoRequest } from '../reducers/user/user';
import wrapper, { SagaStore } from '../store/configureStore';
import AuthLayout from '../components/auth/AuthLayout';
import RowCards from '../components/auth/RowCards';
import { PostsProps } from '../reducers/post/postType';

const feed = () => {
  const { mainPosts, morePosts, loadPostsLoading } = useSelector((state: RootState) => state.post);
  const dispatch = useDispatch();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && morePosts && !loadPostsLoading) {
      const lastId = mainPosts[mainPosts.length - 1]?.id;
      dispatch(loadPostsRequest(lastId));
    }
  }, [inView, morePosts, loadPostsLoading]);

  return (
    <AuthLayout>
      {mainPosts[0] && mainPosts.map((v: PostsProps) => <RowCards posts={v} key={v.id} />)}
      <div ref={morePosts && !loadPostsLoading ? ref : undefined} style={{ marginBottom: '20px' }} />
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

export default feed;
