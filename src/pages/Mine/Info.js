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
  Upload,
  Button,
  AutoComplete,
  message
} from "antd";
import { withUser } from "@/utils/hoc";
import Api from "@/api";
import { UPDATE_USER_INFO } from "@/store/action/common";
import { formItemLayout, tailFormItemLayout, baseurl } from "@/global.config";

@withUser
@Form.create({ name: "register" })
class Info extends Component {
  state = {
    autoCompleteResult: []
  };
  handleWebsiteChange = value => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = [".com", ".org", ".net", ".cn"].map(
        domain => `${value}${domain}`
      );
    }
    this.setState({ autoCompleteResult });
  };
  getUserInfo = ()=>{
    let { dispatch,user } = this.props;
    dispatch({ type: UPDATE_USER_INFO + "_ASYNC", userid: user._id });
  }
  handleSubmit = e => {
    let { form, user } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let { data } = await Api.patch(`/user/${user._id}`, { ...values });

        // 重新更新用户信息
        this.getUserInfo();
      }
    });
  };
  render() {
    const {
      user,
      form: { getFieldDecorator }
    } = this.props;
    const { autoCompleteResult } = this.state;

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

    const checkPhone = (rule, value, callback) => {
      console.log(1234567, value);
      if (value && !/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error("手机号码格式不正确"));
      } else {
        callback();
      }
    };
    return (
      <div>
        <Row gutter={50}>
          <Col sm={18} xs={24}>
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Form.Item label="E-mail">
                {getFieldDecorator("email", {
                  initialValue: user.email,
                  rules: [
                    {
                      type: "email",
                      message: "邮箱格式不正确"
                    }
                  ]
                })(
                  <Input
                    suffix={
                      <Tooltip title="用于找回密码">
                        <Icon type="info-circle" />
                      </Tooltip>
                    }
                  />
                )}
              </Form.Item>

              <Form.Item label={<span>昵称&nbsp;</span>}>
                {getFieldDecorator("nickname", {
                  initialValue: user.nickname,
                  rules: []
                })(
                  <Input
                    suffix={
                      <Tooltip title="设置昵称后其他人将看到昵称而不是用户名">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    }
                  />
                )}
              </Form.Item>
              <Form.Item label="手机号码">
                {getFieldDecorator("phone", {
                  initialValue: user.phone,
                  rules: [
                    {
                      validator: checkPhone
                    }
                  ]
                })(
                  <Input
                    addonBefore={prefixSelector}
                    style={{ width: "100%" }}
                    suffix={
                      <Tooltip title="用于找回密码以及与你取得联系">
                        <Icon type="info-circle" />
                      </Tooltip>
                    }
                  />
                )}
              </Form.Item>
              <Form.Item label="个人主页">
                {getFieldDecorator("website", {
                  initialValue: user.website
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
          
            <Upload
              name="avatar"
              accept=".jpg,.png,.gif"
              headers={{ Authorization: user.Authorization }}
              data={{ userid: user._id }}
              listType="picture-card"
              // className="avatar-uploader"
              showUploadList={false}
              action={baseurl + "/upload/avatar"}
              // beforeUpload={beforeUpload}
              onChange={({file})=>{
                // 上传完成后重新更新用户信息
                if(file.status === 'done'){
                  this.getUserInfo();
                  message.success('头像更新成功');
                }
              }}
            ><Tooltip title="点击上传头像">
                <Avatar shape="square" size={128} icon="user" src={user.avatar ? baseurl + user.avatar:null} />
            </Tooltip>
            </Upload>
            <h4>{user.username}</h4>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Info;
