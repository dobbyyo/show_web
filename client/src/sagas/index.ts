import axios from 'axios';
import { all, fork } from 'redux-saga/effects';

import backUrl from '../config/config';
import userSaga from './user/user';
import postSaga from './post/post';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([fork(userSaga), fork(postSaga)]);
}
