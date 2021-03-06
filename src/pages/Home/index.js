import React, { Component } from "react";
import { Row, Col, Icon, Divider, Badge,Rate } from "antd";
// import TableList from "@@/TableList";
import DataList from "@@/DataList";
import Api from "@/api";
import { connect } from "react-redux";

import "./style.scss";

@connect()
class Home extends Component {
  state = {
    hotlist: [],
    recommend: [],
    difficulty: [],
    newlist: [],
    todaylist: {},
    menu: [
      {
        name: "newIQ",
        icon: "alert",
        text: "最新添加",
        path: "/iq?sort=addtime"
      },
      {
        name: "companyIQ",
        icon: "bank",
        text: "企业真题",
        path: "/company"
      },
      {
        name: "userIQ",
        icon: "fire",
        text: "重点难点",
        path: "/iq?sort=difficulty"
      },
      {
        name: "hotTag",
        icon: "tags",
        text: "热门标签",
        path: "/tags"
      }
    ]
  };

  goto = path => {
    this.props.history.push(path);
  };
  gotoList = query => {
    this.goto(`/iq?${query}`);
  };

  async componentDidMount() {
    // 获取热门面试题
    let { data: hotlist } = await Api.get("/iq", {
      sort: "hot"
    });

    let { data: difficulty } = await Api.get("/iq", {
      sort: "difficulty"
    });

    let { data: newlist } = await Api.get("/iq", {
      size: 6,
      // today:1,
      sort: "addtime"
    });

    let { data: todaylist } = await Api.get("/iq", {
      today: 1
    });

    difficulty = difficulty.result;
    hotlist = hotlist.result;
    newlist = newlist.result;

    this.setState({
      todaylist,
      hotlist,
      difficulty,
      newlist,
      recommend: [...hotlist.slice(3, 6), ...difficulty.slice(3, 5)]
    });
  }

  render() {
    let {
      hotlist,
      recommend,
      difficulty,
      newlist,
      todaylist,
      menu
    } = this.state;
    return (
      <div className="home">
        {/* <Carousel afterChange={this.onChange} autoplay>
          {recommend.map(item => {
            return (
              <div
                key={item._id}
                onClick={this.gotoDetail.bind(null, item._id)}
              >
                <h3>{item.question}</h3>
              </div>
            );
          })}
        </Carousel> */}
        <Row gutter={16}>
          {menu.map(item => {
            return (
              <Col key={item.name} span={6}>
                <div
                  style={{ textAlign: "center", height: 80 }}
                  onClick={this.goto.bind(this, item.path)}
                >
                  {item.name === "newIQ" ? (
                    <Badge count={todaylist.total}>
                      <Icon
                        type={item.icon}
                        theme="twoTone"
                        style={{
                          fontSize: "36px",
                          margin: 5,
                          color: "#1890ff"
                        }}
                        twoToneColor="#1890ff"
                      />
                      <h4>{item.text}</h4>
                    </Badge>
                  ) : (
                    <>
                      <Icon
                        type={item.icon}
                        theme="twoTone"
                        style={{
                          fontSize: "36px",
                          margin: 5,
                          color: "#1890ff"
                        }}
                        twoToneColor="#1890ff"
                      />
                      <h4>{item.text}</h4>
                    </>
                  )}
                </div>
              </Col>
            );
          })}
        </Row>
        <Divider style={{marginBottom:0}} />
        <DataList
          title="最新面试题"
          data={newlist}
          gotoList={this.gotoList.bind(this, "sort=addtime")}
          date
        />
        <DataList
          title="热门面试题"
          data={hotlist}
          gotoList={this.gotoList.bind(this, "sort=hot")}
        />
        <DataList
          title="重点难点面试题"
          rowNumber={false}
          data={difficulty}
          gotoList={this.gotoList.bind(this, "sort=difficulty")}
          description={{difficulty:item=><>难度：<Rate value={item.difficulty} style={{fontSize:16}} disabled character={<Icon type="star" />} /></>}}
        />
        {/* <TableList data={hotlist} pagination={false} title="热门面试题" />
        <TableList data={difficulty} pagination={false} title="重点难点面试题" /> */}
      </div>
    );
  }
}

export default Home;
