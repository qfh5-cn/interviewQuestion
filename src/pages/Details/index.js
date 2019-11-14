import React, { Component } from "react";
import {
  Comment,
  Avatar,
  Tooltip,
  Button,
  Form,
  Input,
  Icon,
  Rate,
  Empty,
  message,
  Row,
  Col,
  Typography
} from "antd";
import moment from "moment";
import MyTags from "@@/MyTags";

import Api from "@/api";
import { withUser,getUserInfo } from "@/utils";
import {baseurl} from '@/global.config';
import ReEditor from "re-editor";
import "re-editor/lib/styles/index.css";
import "./Details.scss";

// 自定义评论框
const Editor = ({ onChange, onSubmit, submitting, value, disabled }) => (
  <div>
    <Form.Item>
      <Input.TextArea
        rows={4}
        onChange={onChange}
        value={value}
        placeholder={disabled ? "登录后才可添加答案" : "添加我的答案"}
        disabled={disabled}
      />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        {disabled ? "登录后才可添加答案，去登录" : "添加答案"}
      </Button>
    </Form.Item>
  </div>
);

@withUser
class Details extends Component {
  state = {
    data: {},
    action: null,
    submitting: false,
    value: "",
    answer: {
      result: []
    }
  };
  addAnswer = async () => {
    let { user, history, location } = this.props;
    let { value, data, answer } = this.state;
    // // 未登录不允许添加答案
    if (!user.username) {
      // return Modal.warning({
      //   title: "登录提示",
      //   content:
      //     "必须登录后才能添加答案",
      //   onOk() {
      //     history.replace('/login?targetUrl='+location.pathname)
      //   },
      //   onCancel() {}
      // });
      return history.push("/login?targetUrl=" + location.pathname);
    }

    this.setState({
      submitting: true
    });
    let { data: newData } = await Api.post("/answer", {
      content: value,
      iqid: data._id,
      userid: user._id
    });
    newData = newData[0];
    newData.user = user;
    this.setState({
      submitting: false,
      value: "",
      answer: { ...answer, result: [...answer.result, newData] }
    });
  };
  changeAnswer = e => {
    // Vue是一个渐进式框架，采用MVVM模式来实现视图层与数据层的数据更新、监听与修改
    this.setState({
      value: e.currentTarget.value
    });
  };
  like = async (type, item) => {
    let { user } = this.props;
    let { answer } = this.state;
    if (!user.username) {
      return message.error(`登录后才可${type == "like" ? "点赞" : "踩"}`);
    }
    //不允许多次点赞或踩
    if (item[type].includes(user._id)) {
      message.warning(`不能重复${type == "like" ? "点赞" : "踩"}`);
      return;
    }

    let { data } = await Api.patch(`/answer/${item._id}/${type}`, {
      userid: user._id
    });

    answer.result = answer.result.map(it => {
      if (it._id === item._id) {
        let atype = type === "like" ? "dislike" : "like";
        //添加当前用户的赞/踩
        it[type] = [...it[type], user._id];
        //一处当前用户的踩/赞
        it[atype] = it[atype].filter(id => id != user._id);
      }
      return it;
    });
    this.setState({
      answer
    });
  };

  async componentDidMount() {
    let { match, user } = this.props; //解构user后得不到更新的值？
    let { id } = match.params;

    // 获取当前面试题信息
    let url = `/iq/${id}`;
    let { data } = await Api.get(url);
    data = data[0];
    this.setState({
      data,
      id
    });

    // 增加热度
    // 刷新或点击进入都增加一次热度
    await Api.get(url + "/hot");
    this.setState({
      data: {
        ...this.state.data,
        hot: this.state.data.hot + 1
      }
    });

    // 获取面试题对应答案
    let { data: answer } = await Api.get(`/answer`, {
      iqid: id,
      getusername: 1
      // userid: this.props.user._id,//必须这种写法，解构user后user._id 不生效（why?）
    });

    this.setState({
      answer
    });
  }

  // 添加/取消关注
  add2Focus = async () => {
    let { data } = this.state;
    let { user} = this.props;
    let url = `/user/${user._id}/follow`;
    if (user.focus && user.focus.includes(data._id)) {
      url = `/user/${user._id}/unfollow`;
    }
    let res = await Api.patch(url, {
      iqid: data._id
    });

    // user.focus.push(data._id);
    getUserInfo(user._id);
  };

  render() {
    let { data, action, submitting, value, answer } = this.state;
    let { user, history } = this.props;
    const IS_LOGIN = !!user.Authorization;console.log('islogin',IS_LOGIN)

    const Like = ({ type = "like", title = "赞", item }) => (
      <Tooltip title={title}>
        <Icon
          type={type}
          theme={item[type].includes(user._id) ? "filled" : "outlined"}
          onClick={this.like.bind(this, type, item)}
        />
        <span style={{ paddingLeft: 8, cursor: "auto" }}>
          {item[type].length}
        </span>
      </Tooltip>
    );
    const Dislike = ({ item }) => (
      <Like item={item} type="dislike" title="踩" />
    );
    const focused = user.focus && user.focus.includes(data._id);
    return (
      <div>
        <Row>
          <Col span={18}>
            <h1>{data.question}</h1>
            <p className="belong">
              {data.company ? (
                <Tooltip title="查看该公司所有面试题">
                  <Typography.Text
                    type="secondary"
                    onClick={() => {
                      history.push("/iq?companyid=" + data.company._id);
                    }}
                  >
                    @{data.company.name}
                  </Typography.Text>
                </Tooltip>
              ) : null}
              <Tooltip title="查看该用户所有面试题">
                <Typography.Text
                  type="secondary"
                  onClick={() => {
                    history.push("/iq?userid=" + data.user._id);
                  }}
                >
                  @{data.user && (data.user.nickname || data.user.username)}
                </Typography.Text>
              </Tooltip>
            </p>
          </Col>
          <Col span={6} style={{ textAlign: "right" }}>
            <Tooltip title={focused ? "取消收藏" : "+添加到收藏夹"}>
              <Button
                disabled={IS_LOGIN ? false : true}
                icon={focused ? "minus" : "plus"}
                type="dashed"
                style={{fontSize:12}}
                onClick={this.add2Focus}
                size="small"
              >{focused ? "取消" : "收藏"}</Button>
            </Tooltip>
          </Col>
        </Row>
        {data.detail ? (
          <div className="iqmore">
            <ReEditor value={data.detail} readOnly tools={[]} />
          </div>
        ) : null}
        <ul className="list-attr">
          <li>热度：{data.hot}</li>
          <li>
            难度：
            <Rate value={data.difficulty} disabled />
          </li>
          {data.tags ? (
            <li>
              Tags：
              <MyTags value={data.tags} disabled onClick={(tag)=>{
                history.push(`/iq?tag=${tag}`)
              }} />
            </li>
          ) : null}
        </ul>

        {answer.result.length === 0 ? (
          <Empty
            description="面试题暂无答案，期待你的完善"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          answer.result.map(item => (
            <Comment
              key={item._id}
              actions={[
                <Like item={item} key="like" />,
                <Dislike item={item} key="dislike" />
              ]}
              author={<a>{item.user.nickname || item.user.username}</a>}
              avatar={
                <Avatar
                  src={baseurl + item.user.avatar}
                  alt={item.user.username}
                />
              }
              content={item.content}
              datetime={
                <Tooltip
                  title={moment(item.addtime).format("YYYY-MM-DD HH:mm:ss")}
                >
                  <span>{moment(item.addtime).fromNow()}</span>
                </Tooltip>
              }
            />
          ))
        )}

        <Editor
          onSubmit={this.addAnswer}
          onChange={this.changeAnswer}
          value={value}
          submitting={submitting}
          disabled={!user.username}
        />
      </div>
    );
  }
}

export default Details;
