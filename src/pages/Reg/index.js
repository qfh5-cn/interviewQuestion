import React, { Component } from "react";
import { Button, Form, Input, Checkbox,Modal } from "antd";
import Api from "@/api";
import clauseContent from './clauseContent';
import { encryptPassword } from "@/utils";
import { formItemLayout, tailFormItemLayout } from "@/global.config";

@Form.create({ name: "register" })
class Reg extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    clauseContent,
    clauseVisible:false
  };

  handleOk = ()=>{
    this.setState({
      clauseVisible:false
    })
  }
  handleCancel = ()=>{
    this.setState({
      clauseVisible:false
    })
  }
  showClause = (e)=>{console.log(e)
    this.setState({
      clauseVisible:true,
    })
  }


  handleSubmit = e => {
    let {history,form} = this.props
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        let {username,password} = values;
        
        // let encrypt = CryptoJS.SHA256(password);
        // password = encrypt.toString();
        password = encryptPassword(password);
        
        let data = await Api.post('/user/reg',{username,password});
        if(data.status === 200){
          history.replace('/login');
        }
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("两次输入密码不一致");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };
  checkUsernameExist = async (rule, value, callback)=>{
    let data = await Api.get('/user/check',{username:value});
    if(data.status === 400){
        callback('用户名已存在');
    }else{
        callback();
    }
  }

  
  render() {
    let { clauseContent,clauseVisible } = this.state;
    let { getFieldDecorator,getFieldValue } = this.props.form;

    

    return (
      <div>
        <h1>免费注册</h1>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="用户名" hasFeedback>
            {getFieldDecorator("username", {
                validateTrigger:'onBlur',
                validateFirst:true,
              rules: [
                {
                    validator:this.checkUsernameExist
                },
                {
                  required: true,
                  message: "请输入用户名"
                },
                // {
                //   pattern:/^[\d\w\-]{3,20}$/,message:'用户名必须由 数字、字母、_、-，且至少3~20位字符'
                // },
                {
                  min:3,max:16,message:'用户名必须为3~16个字符'
                },
                // {
                //   max:16,message:'用户名不能超过16个字符'
                // }
              ]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="密码" hasFeedback>
            {getFieldDecorator("password", {
              rules: [
                {
                  required: true,
                  message: "请输入密码"
                },
                {min:6,message:'为了账号安全，密码至少为6位'},
                {
                  validator: this.validateToNextPassword
                }
              ]
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item label="确认密码" hasFeedback>
            {getFieldDecorator("confirm", {
              rules: [
                {
                  required: true,
                  message: "请再次确认密码"
                },
                {
                  validator: this.compareToFirstPassword
                }
              ]
            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            {getFieldDecorator("agreement", {
              valuePropName: "checked",
              initialValue:true
            })(
              <Checkbox>
                同意 
              </Checkbox>
            )}
            <a onClick={this.showClause}>《XXX条款》</a>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={getFieldValue('agreement')?false:true}>
              注册
            </Button>
          </Form.Item>
        </Form>
        <Modal
          title="XXX条款"
          visible={clauseVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{height:'600px',overflowY:'auto'}}
        >
          <pre>
            {clauseContent}
          </pre>
        </Modal>
      </div>
    );
  }
}


export default Reg;
