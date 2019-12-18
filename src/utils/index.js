import hoc from './hoc';
import { UPDATE_USER_INFO } from "@/store/action/common";
import store from '../store'
import CryptoJS from "crypto-js";

// 全局获取用户方法
export const getUserInfo = (userid)=>{
    store.dispatch({ type: UPDATE_USER_INFO + "_ASYNC", userid});
}
export const encryptPassword = (password)=>{
    // 加密密码
    let encrypt = CryptoJS.SHA256(password);
    return encrypt.toString();
}
export * from './hoc';
export default {
    ...hoc
}