export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const SHOW_BREADCRUMB = 'SHOW_BREADCRUMB';
export const CHANGE_BREADCRUMB_PATH = 'CHANGE_BREADCRUMB_PATH';
export const CHANGE_FOOTER_STATUS = 'CHANGE_FOOTER_STATUS';

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
export function changeBreadcrumb(pages){
    return {
        type:CHANGE_BREADCRUMB_PATH,
        pages
    }
}

/**
 * 布局显示隐藏
 */
export function changeFooterStatus(show){
    return {
        type:CHANGE_FOOTER_STATUS,
        show
    }
}

export default {
    login,
    logout,
    updateUser
}