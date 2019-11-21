import React,{ Component } from "react";
import Api from '@/api';
import { connect } from "react-redux";
import {login,logout,changeFooterStatus} from '../store/action/common'

/**
 * 
 * @param {Component} InnerComponent 被包装组件
 * 让被包装的组件拥有权限控制（需要用户登录才可访问）
 */
export function withAuth(InnerComponent){
    @withUser
    class WrapComponent extends Component{
        gotoLogin(){
            let {history,match} = this.props;
            history.replace('/login?targetUrl='+match.url);
        }
        componentDidMount(){
            let {user,dispatch} = this.props;

            // 退出登录后，切换到需要权限的页面（props无更新），自动跳到登录页面
            // bug: 切换后ajax请求未返回,后续报错
            if(!user._id){
                // dispatch(logout());
                this.gotoLogin();
                return;
            }

            // 如存在user信息，则校验token有效性
            let{Authorization} = user;
            this.props.dispatch({type:'CHECK_ACCESS_ASYNC',Authorization});
        }
        componentWillUnmount(){
            Api.cancel('get_/user/verify');
        }
        shouldComponentUpdate({user},nextState){
            // 在需要登录权限的页面退出登录（props更新），自动跳到登录页面
            if(!user._id){
                this.gotoLogin();
                return false;
            }
            return true;

        }
        render(){
            return <InnerComponent {...this.props}>{this.props.children}</InnerComponent>
        }
    }

    return WrapComponent
}


/**
 * 
 * @param {Component} InnerComponent 需包装的组件
 * 让被包装的组件拥有用户信息
 */
export function withUser(InnerComponent){
    @connect(({common})=>({user:common.get('user').toJS()}))
    class WrapComponent extends Component{
        // componentDidMount(){
        //     let {user,dispatch} = this.props;

            // 刷新后，redux数据丢失，从localStorage中重新获取
            // if(!user._id){
            //     user = localStorage.getItem('user');
            //     if(user){
            //         user = JSON.parse(user);
            //         dispatch(login(user))
            //     }
            // }            
        // }
        render(){
            return <InnerComponent {...this.props}>{this.props.children}</InnerComponent>
        }
    }
    return WrapComponent;
}

/**
 * 显示隐藏底部高阶组件
 */
export function withFooter(InnerComponent){
    @connect()
    class WrapComponent extends Component{
        componentDidMount(){
            // 隐藏Footer
            this.props.dispatch(changeFooterStatus(false))
        }
        componentWillUnmount(){
            // 显示Footer
            this.props.dispatch(changeFooterStatus(true))
        }
        render(){
            return <InnerComponent {...this.props}>{this.props.children}</InnerComponent>
        }
    }
    return WrapComponent
}
export default {
    withAuth,
    withUser,
    withFooter
}