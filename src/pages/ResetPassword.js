import React, { Component } from "react";
import { Button, Form, Input, message } from "antd";
import Api from "@/api";
import { formItemLayout, tailFormItemLayout } from "@/global.config";
import qs from 'querystring'
import CryptoJS from "crypto-js";

@Form.create({ name: "reset" })
class ResetPassword extends Component {
  state = {
    sessionid: ''
  };
  handleSubmit = e => {
      let {sessionid} = this.state;
    let { form, dispatch, history, location } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let { password } = values;

        // 加密密码
        let encrypt = CryptoJS.SHA256(password);
        password = encrypt.toString();

        let data = await Api.patch(`/user/resetpassword`, { password,sessionid });
        if (data.status === 200) {
            message.success('重置密码成功，请重新登录',()=>{
                history.replace("/login");
            });
        }else if(data.status === 401){
            this.setState({
                sessionid:''
            })
        }
      }
    });
  };
  componentDidMount(){
    //   获取传入的token，如无token则禁止访问
    let {sessionid} = qs.parse(this.props.location.search.slice(1));
    this.setState({
        sessionid
    });

  }
  render() {
      let {sessionid} = this.state;
      let {history,form} = this.props;
    let { getFieldDecorator } = form;

    return (
      <div>
        <h1>重置密码</h1>
        {
            sessionid ? 
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="设置新密码" hasFeedback>
                {getFieldDecorator("password", {
                rules: [
                    {
                    required: true,
                    message: "请输入密码"
                    }
                ]
                })(<Input.Password />)}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                确认修改
                </Button>
            </Form.Item>
            </Form>
            :
            <div>你访问的链接已过期，请从新<Button type="link" onClick={()=>{
                history.replace('/forgotpassword')
            }}>找回密码</Button></div>
        }
      </div>
    );
  }
}

export default ResetPassword;
