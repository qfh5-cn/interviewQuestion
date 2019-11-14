import React, { Component } from "react";
import { Row, Col, Icon, Divider } from "antd";
import Api from "@/api";
import { withAuth } from "@/utils";
import DataList from '@@/DataList'

@withAuth
class Mine extends Component {
  state = {
    menu: [
      {
        name: "info",
        icon: "profile",
        text: "个人资料"
      },
      {
        name: "password",
        icon: "schedule",
        text: "修改密码"
      },
      // {
      //   name:'myIQ',
      //   icon:'sliders',
      //   text:'我的面试题'
      // },{
      //   name:'commented',
      //   icon:'message',
      //   text:'我的回答'
      // },
      {
        name: "focus",
        icon: "heart",
        text: "我的收藏"
      }
    ],
    myIQ: {
      result: []
    },
    myAnswer: {
      result: []
    }
    // typeList: [
    //   {
    //     name: "myIQ",
    //     title: "我的面试题",
    //     icon: "sliders",
    //     data: []
    //   },
    //   {
    //     name: "myAnswer",
    //     title: "我的回答",
    //     icon: "message",
    //     data: []
    //   }
    // ]
  };
  gotoIQ = id => {
    this.goto(`/iq/${id}`);
  };
  goto = path => {
    let { history } = this.props;
    history.push(path);
  };
  async componentDidMount() {
    let { user } = this.props;
    // 获取我添加的面试题
    // let myIQ = await Api.get('/iq',{
    //   username:user.username
    // })
    // }
    // async componentWillUpdate(nextProps){
    //   let {user} = this.props;
    // let { typeList } = this.state;
    // if(user.username != nextProps.user.username){
    let myIQ, myAnswer;
    try {
      let { data } = await Api.get("/iq", {
        userid: user._id,
        sort: "addtime",
        size: 5
      });
      myIQ = data;
    } catch (err) {
      console.log("request /iq fail: ", err);
    }

    try {
      let { data } = await Api.get("/answer", {
        userid: user._id,
        getiqname: 1,
        size: 5
      });
      myAnswer = data;
    } catch (err) {
      console.log("request /answer fail: ", err);
    }

    // typeList[0].data = myIQ.result;
    // typeList[1].data = myAnswer.result;

    this.setState({
      myIQ,
      myAnswer
    });
    // }
  }
  componentWillUnmount() {
    console.log("Main.unmount");
    Api.cancel("get_/iq");
    Api.cancel("get_/answer");
  }
  render() {
    let { menu, myIQ, myAnswer } = this.state;
    let { match,user } = this.props;
    return (
      <div>
        <Row gutter={16}>
          {menu.map(item => {
            return (
              <Col key={item.name} span={6}>
                <div
                  style={{ textAlign: "center", height: 100 }}
                  onClick={this.goto.bind(this, `${match.url}/${item.name}`)}
                >
                  <Icon
                    type={item.icon}
                    theme="twoTone"
                    style={{ fontSize: "36px", margin: 5, color: "#08c" }}
                  />
                  <h4>{item.text}</h4>
                </div>
              </Col>
            );
          })}
        </Row>
        <Divider />
        {/* <div style={{ marginTop: 15 }}>
          <Row>
            <Col span={16}>
              <h3>我的面试题</h3>
            </Col>
            <Col span={8} style={{ textAlign: "right" }}>
              <Button type="link">更多&gt;</Button>
            </Col>
          </Row>
          <List
            dataSource={myIQ.result}
            renderItem={(item, idx) => (
              <List.Item
                key={item._id}
                actions={[<Icon type="right" />]}
                onClick={this.gotoIQ.bind(this, item._id)}
              >
                <List.Item.Meta
                  title={
                    <>
                      {idx + 1}. {item.question}
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </div> */}
        {/* <MyList title="我的面试题" type="iq" data={myIQ.result} />
        <MyList title="我的回答" type="answer" data={myAnswer.result} /> */}
        <DataList 
          title="我的面试题" 
          data={myIQ.result} 
          gotoList={this.goto.bind(this,'/mine/iq')} 
          onClick={this.gotoIQ}
        />
        <DataList 
          title="我的回答" 
          data={myAnswer.result} 
          gotoList={this.goto.bind(this,'/mine/answer')} 
          onClick={this.gotoIQ}
          date
        />
      </div>
    );
  }
}

export default Mine;
