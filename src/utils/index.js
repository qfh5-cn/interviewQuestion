import hoc from './hoc';
import { UPDATE_USER_INFO } from "@/store/action/common";
import store from '../store'

// 全局方法
export const getUserInfo = (userid)=>{
    store.dispatch({ type: UPDATE_USER_INFO + "_ASYNC", userid});
}
export * from './hoc';
export default {
    ...hoc
}