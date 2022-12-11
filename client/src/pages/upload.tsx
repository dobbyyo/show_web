import React from 'react';
import axios from 'axios';

import { END } from 'redux-saga';
import { loadMyInfoRequest } from '../reducers/user/user';
import wrapper, { SagaStore } from '../store/configureStore';
import UploadForm from '../layout/UploadForm';

const Upload = () => {
  return <UploadForm />;
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const cookie = req ? req.headers.cookie : '';
  axios.defaults.headers.common.cookie = '';
  if (req && cookie) {
    axios.defaults.headers.common.cookie = cookie;
  }
  store.dispatch(loadMyInfoRequest());
  store.dispatch(END);

  await (store as SagaStore).sagaTask?.toPromise();

  return {
    props: {},
  };
});

export default Upload;
