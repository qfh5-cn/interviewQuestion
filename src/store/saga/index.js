import { takeLatest,call,put} from 'redux-saga/effects';

import Api from '@/api'
import {logout,updateUser} from '../action/common'

function* CheckAuthorization({Authorization}){console.log('saga.Authorization:',Authorization)
    // let user = localStorage.getItem('user');console.log('sage.a,b,c',a,b,c)
    // if(!user) {
    //     return put(logout());
    // }
    // user = JSON.parse(user);

    // // 解决刷新后redux数据丢失的问题
    // yield put(login(user))

    // let {Authorization} = user;

    let result = yield call(Api.get,'/user/verify',{},{headers:{Authorization}})
    if(result.status === 401){
        // token校验失败
        yield put(logout())
    }
}

function* UpdateUser({userid}){
    let result = yield call(Api.get,`/user/${userid}`)
    if(result.status === 200){
        // token校验失败
        yield put(updateUser(result.data[0]))
    }
}

function * rootSaga(){
    yield takeLatest('CHECK_ACCESS_ASYNC',CheckAuthorization)
    yield takeLatest('UPDATE_USER_INFO_ASYNC',UpdateUser)
}

export default rootSaga;