import React, { Component } from "react";
import { Button, Form, Input, Icon,Checkbox } from "antd";
import Api from "@/api";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import cartActionCreator,{login} from '@/store/action/common'
import qs from 'querystring';
import CryptoJS from 'crypto-js';
import { formItemLayout, tailFormItemLayout } from "@/global";

// const mapStateToProps = (state)=>({})
// const mapDispatchToProps = (dispatch)=>bindActionCreators(cartActionCreator,dispatch)
@connect()
@Form.create({ name: "login" })
class Random extends Component {
  handleSubmit = e => {
      let {form,dispatch,history,location} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let { username, password,rememberme } = values;

        // 加密密码
        // let encrypt = CryptoJS.AES.encrypt(password,'laoxie');console.log('encrypt:',encrypt.toString())
        // let decrypt = CryptoJS.AES.decrypt(encrypt.toString(), 'laoxie');
        // console.log('decrypt:',decrypt.toString(CryptoJS.enc.Utf8))

        let encrypt = CryptoJS.SHA256(password);

        let result = await Api.get("/user/login", { username, password:encrypt.toString()});

        if(result.status === 400){
            form.setFields({
                username:{
                    value:username,
                    errors:[{
                        "message": '用户名或密码不正确'
                    }]
                },
                password:{
                    value:password,
                    errors:[{
                        "message": '用户名或密码不正确'
                    }]
                }
            })
        }else if(result.status === 200){
            if(!rememberme){
              result.data.session = true;
            }
            dispatch(login(result.data));
            let params = qs.parse(location.search.slice(1));
            let path = params.targetUrl || '/mine'
            history.replace(path);
        }
      }
    });
  };
  render() {
    // let { data, loading } = this.state;
    let { getFieldDecorator, getFieldValue } = this.props.form;

    return (
      <div>
        <h1>用户登录</h1>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="用户名">
            {getFieldDecorator("username", {
              validateTrigger: "onBlur",
              validateFirst: true,
              rules: [
                {
                  required: true,
                  message: "请输入用户名"
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
              />
            )}
          </Form.Item>
          <Form.Item label="密码">
            {getFieldDecorator("password", {
              rules: [
                {
                  required: true,
                  message: "请输入密码"
                }
              ]
            })(
              <Input.Password
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
              />
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            {getFieldDecorator("rememberme", {
              valuePropName: "checked",
              initialValue: true
            })(<Checkbox>下次免登录</Checkbox>)}
            
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
            <a style={{marginLeft:15}} href="#/forgotpwd">
              忘记密码?
            </a>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
// Random = Form.create({ name: "login" })(Random);
// const mapStateToProps = (state)=>({})
// const mapDispatchToProps = (dispatch)=>bindActionCreators(cartActionCreator,dispatch)
// Random = connect(mapStateToProps,mapDispatchToProps)(Random);

export default Random;
