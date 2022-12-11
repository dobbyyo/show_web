import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import AuthLayout from '../../components/auth/AuthLayout';
import RowCards from '../../components/auth/RowCards';

import { RootState } from '../../reducers';
import { loadHashtagPostsRequest } from '../../reducers/post/post';
import { PostsProps } from '../../reducers/post/postType';
import { loadMyInfoRequest } from '../../reducers/user/user';
import wrapper, { SagaStore } from '../../store/configureStore';

const Hashtag = () => {
  const { mainPosts, morePosts, loadHashtagPostsLoading } = useSelector((state: RootState) => state.post);
  const dispatch = useDispatch();
  const [ref, inView] = useInView();

  const router = useRouter();
  const { tag } = router.query;

  useEffect(() => {
    if (inView && morePosts && !loadHashtagPostsLoading) {
      const lastId = mainPosts[mainPosts.length - 1]?.id;
      const data = { tag, lastId };
      dispatch(loadHashtagPostsRequest(data));
    }
  }, [inView, morePosts, loadHashtagPostsLoading]);

  return (
    <AuthLayout>
      {mainPosts[0] && mainPosts.map((v: PostsProps) => <RowCards posts={v} key={v.id} />)}
      <div ref={morePosts && !loadHashtagPostsLoading ? ref : undefined} style={{ margin: '30px' }} />
    </AuthLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, params }: any) => {
  const cookie = req ? req.headers.cookie : '';
  axios.defaults.headers.common.cookie = '';
  if (req && cookie) {
    axios.defaults.headers.common.cookie = cookie;
  }
  store.dispatch(loadHashtagPostsRequest({ tag: params.tag }));
  store.dispatch(loadMyInfoRequest());

  store.dispatch(END);

  await (store as SagaStore).sagaTask?.toPromise();

  return {
    props: {},
  };
});

export default Hashtag;
