import {createStore,applyMiddleware} from 'redux';
import {composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './reducer';
import rootSaga from './saga';

// 1.创建saga中间件
const sagaMiddleware = createSagaMiddleware();

// 2.将 sagaMiddleware 连接至 Store
let enhancer = applyMiddleware(sagaMiddleware)
const store = createStore(rootReducer,composeWithDevTools(enhancer))

// 3.运行 Saga配置
sagaMiddleware.run(rootSaga);

export default store;