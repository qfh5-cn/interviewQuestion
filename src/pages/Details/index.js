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
  Tag,
  Divider
} from "antd";
import moment from "moment";

import Api from "@/api";
import { withUser, getUserInfo } from "@/utils";
import { baseurl } from "@/global.config";
import ReEditor from "re-editor";
import "re-editor/lib/styles/index.css";
import "./style.scss";

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
    answer: [],
    user: {},
    company: []
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
      answer: [...answer, newData]
    });
  };
  changeAnswer = e => {
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

    answer = answer.map(it => {
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
      id,
      answer: data.answer,
      company: data.company,
      user: data.user
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
    // let { data: answer } = await Api.get(`/answer`, {
    //   iqid: id,
    //   getusername: 1
    //   // userid: this.props.user._id,//必须这种写法，解构user后user._id 不生效（why?）
    // });

    // this.setState({
    //   answer
    // });
  }

  // 添加/取消关注
  add2Focus = async () => {
    let { data } = this.state;
    let { user } = this.props;
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
    let { data, user: author, submitting, value, answer, company } = this.state;
    let { user, history } = this.props;
    const IS_LOGIN = !!user.Authorization;

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
        <Row style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Button
              type="link"
              icon="arrow-left"
              style={{ paddingLeft: 0 }}
              onClick={() => {
                history.goBack();
              }}
            >
              返回
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Tooltip title={focused ? "取消收藏" : "+添加到收藏夹"}>
              <Button
                disabled={IS_LOGIN ? false : true}
                icon={focused ? "minus" : "plus"}
                type="dashed"
                style={{ fontSize: 12 }}
                onClick={this.add2Focus}
                size="small"
              >
                {focused ? "取消" : "收藏"}
              </Button>
            </Tooltip>
          </Col>
        </Row>
        <h1>{data.question}</h1>
        {data.tags ? (
            <div>
              Tags：
              {data.tags.map(tag=><Tag key={tag} >
                {tag.length > 20 ? `${tag.slice(0, 20)}...` : tag}
              </Tag>)}
            </div>
          ) : null}

        {data.detail ? (
          <div className="iqmore">
            <ReEditor value={data.detail} readOnly tools={[]} />
          </div>
        ) : <Empty
          description="暂无问题补充"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />}

        <div className="list-attr">
          <span onClick={() => {
            history.push("/iq?userid=" + author._id);
          }}>
            <Tooltip title="点击查看该用户所有面试题">
              <Avatar size="small" src={baseurl + author.avatar} icon="user" /> {author.nickname || author.username}
            </Tooltip>
          </span> &bull; 
          <span>{data.hot} 浏览 </span> &bull; 
          <span>
            难度：
            <Rate value={data.difficulty} style={{fontSize:18}} disabled />
          </span>
          {company.map(item => (
            <span key={item._id} onClick={() => {
              history.push("/iq?companyid=" + item._id);
            }}>
            <Tooltip title="查看该公司所有面试题">
                @{item.name}
            </Tooltip>
            </span>
          ))}
        </div>
        <Divider orientation="left">回 复（{answer.length}）</Divider>
        {answer.length === 0 ? (
          <Empty
            description="问题暂无任何回复，请你帮帮TA吧！"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          answer.map(item => {
            let addtime = moment(item.addtime);
            let now = moment();
            return (
              <Comment
                key={item._id}
                actions={[
                  <Like item={item} key="like" />,
                  <Dislike item={item} key="dislike" />
                ]}
                author={
                  item.user && <a>{item.user.nickname || item.user.username}</a>
                }
                avatar={
                  item.user && (
                    <Avatar
                      src={baseurl + item.user.avatar}
                      icon="user"
                      size="small"
                    />
                  )
                }
                content={item.content}
                datetime={
                  <Tooltip
                    title={moment(item.addtime).format("YYYY-MM-DD HH:mm:ss")}
                  >
                    <span>
                    {
                      now.diff(addtime,'days')>3 ? 
                      addtime.format('YYYY/MM/DD') :
                      addtime.fromNow()
                    }
                    </span>
                  </Tooltip>
                }
              />
            );
          })
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
