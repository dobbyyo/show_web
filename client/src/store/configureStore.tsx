import createSagaMiddleware from '@redux-saga/core';
import { applyMiddleware, compose, createStore, Middleware, Store, StoreEnhancer } from 'redux';
import { createWrapper, MakeStore } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import { Task } from 'redux-saga';

import reducer, { RootState } from '../reducers/index';
import rootSaga from '../sagas';

export interface SagaStore extends Store {
  sagaTask?: Task;
}

const configureStore: MakeStore<RootState> = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares: Middleware[] = [sagaMiddleware];
  // eslint-disable-next-line operator-linebreak
  const enhancer: StoreEnhancer =
    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares, logger));
  const store = createStore(reducer, enhancer);
  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

const wrapper = createWrapper<RootState>(configureStore, {
  debug: process.env.NODE_ENV === 'development',
});

export default wrapper;
