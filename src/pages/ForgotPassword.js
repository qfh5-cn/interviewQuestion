import React, { Component } from "react";
import { Button, Form, Input, Icon,Steps,Divider } from "antd";
import Api from "@/api";
import { formItemLayout, tailFormItemLayout } from "@/global.config";


@Form.create({ name: "forgot" })
class ForgotPassword extends Component {
    state = {
        currentStep:0,
        email:''
    }
  handleSubmit = e => {
      let {form,dispatch,history,location} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let { username} = values;

        // 加密密码
        // let encrypt = CryptoJS.AES.encrypt(password,'laoxie');console.log('encrypt:',encrypt.toString())
        // let decrypt = CryptoJS.AES.decrypt(encrypt.toString(), 'laoxie');
        // console.log('decrypt:',decrypt.toString(CryptoJS.enc.Utf8))


        let result = await Api.get("/user/forgotpassword", { username});

        if(result.status === 400 || result.status === 401){
            form.setFields({
                username:{
                    value:username,
                    errors:[{
                        "message": '用户名不存在或没设置安全邮箱'
                    }]
                }
            })
        }else if(result.status === 200){
            // message.success(`重置密码邮件已发送到您的安全邮箱（${result.data}），请注意查收`)
            this.setState({
                email:result.data,
                currentStep:1
            })
        }
      }
    });
  };
  render() {
    let { email,currentStep } = this.state;
    let { getFieldDecorator, getFieldValue } = this.props.form;

    return (
      <div>
        <h1>找回密码</h1>
        <Steps size="small" style={{margin:'25px 0'}} current={currentStep}>
            <Steps.Step title="填写用户名"></Steps.Step>
            <Steps.Step title="登录安全邮箱"></Steps.Step>
            <Steps.Step title="重置密码"></Steps.Step>
        </Steps>
        {
            email ? 
            <div>重置密码邮件已发送到您的安全邮箱（<strong>{email}</strong>），有效期10分钟，请<a target="_blank" href={`https://mail.`+email.replace(/.+@(.+)/,'$1')}>登录邮箱</a>查收</div>
            :
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
                
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                    下一步
                    </Button>
                </Form.Item>
                </Form>
        }
        
      </div>
    );
  }
}

export default ForgotPassword;
