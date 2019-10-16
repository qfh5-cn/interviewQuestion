export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const SHOW_BREADCRUMB = 'SHOW_BREADCRUMB';
export const CHANGE_BREADCRUMB_PATH = 'CHANGE_BREADCRUMB_PATH';

/**
 * ----------
 * @用户相关 
 * ----------
 */
export function login(user){
    return {
        type:LOGIN,
        user
    }
}

export function logout(){
    return {
        type:LOGOUT
    }
}

export function updateUser(user){
    return {
        type:UPDATE_USER_INFO,
        user
    }
}

/**
 * ----------
 * @面包屑导航 
 * ----------
 */
export function showBreadcrumb(show){
    return {
        type:SHOW_BREADCRUMB,
        show
    }
}
export function changeBreadcrumb(path){
    return {
        type:CHANGE_BREADCRUMB_PATH,
        path
    }
}

export default {
    login,
    logout,
    updateUser
}