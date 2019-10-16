import React, { Component } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Tooltip,
  Icon,
  Avatar,
  Select,
  Checkbox,
  Button,
  AutoComplete
} from "antd";
import { withUser } from "@/utils/hoc";
import Api from '@/api';
import {UPDATE_USER_INFO} from '../../store/action/common'

@withUser
@Form.create({ name: 'register' })
class Info extends Component{
  state = {
    autoCompleteResult:[]
  }
  handleWebsiteChange = value => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net','.cn'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }
  handleSubmit = e => {
    let {form,user,dispatch} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let {data} = await Api.patch(`/user/${user._id}`,{...values});
        
        // 重新更新用户信息
        dispatch({type:UPDATE_USER_INFO+'_ASYNC',userid:user._id})
      }
    });
  }
  render() {
    const { user,form:{getFieldDecorator} } = this.props;
    const { autoCompleteResult } = this.state;
  
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 18,
          offset: 6
        }
      }
    };
    const prefixSelector = getFieldDecorator("prefix", {
      initialValue: "86"
    })(
      <Select style={{ width: 70 }}>
        <Select.Option value="86">+86</Select.Option>
        <Select.Option value="87">+87</Select.Option>
      </Select>
    );
  
    
  
    const websiteOptions = autoCompleteResult.map(website => (
      <AutoComplete.Option key={website}>{website}</AutoComplete.Option>
    ));

    const checkPhone = (rule,value,callback)=>{
      console.log(1234567,value)
      if(value && !/^1[3-9]\d{9}$/.test(value)){
        callback(new Error('手机号码格式不正确'))
      }else{
        callback();
      }
    }
    return (
      <div>
        <Row gutter={50}>
          <Col sm={18} xs={24}>
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Form.Item label="E-mail">
                {getFieldDecorator("email", {
                  initialValue:user.email,
                  rules: [
                    {
                      type: "email",
                      message: "邮箱格式不正确"
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              
              <Form.Item
                label={
                  <span>
                    昵称&nbsp;
                    <Tooltip title="设置昵称后其他人将看到昵称而不是用户名">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator("nickname", {
                  initialValue:user.nickname,
                  rules: [
                    
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="手机号码">
                {getFieldDecorator("phone", {
                  initialValue:user.phone,
                  rules: [
                    {
                      validator:checkPhone
                    }
                  ]
                })(
                  <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
                )}
              </Form.Item>
              <Form.Item label="个人主页">
                {getFieldDecorator("website", {
                  initialValue:user.website,
                })(
                  <AutoComplete
                    dataSource={websiteOptions}
                    onChange={this.handleWebsiteChange}
                    placeholder="网址URL"
                  >
                    <Input />
                  </AutoComplete>
                )}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  更新资料
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col sm={6} xs={24}>
            {
              user.avatar
              ?
              <img src={user.avatar} style={{width:'100%'}} />
              :
              <Avatar shape="square" size={128} icon="user" />
            }
            <h4>{user.username}</h4>
          </Col>
        </Row>
      </div>
    );
  }

}
export default Info;
