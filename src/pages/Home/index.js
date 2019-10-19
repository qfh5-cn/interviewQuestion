import React, { Component } from "react";
import { Carousel, Row, Col } from "antd";
import TableList from "@@/TableList";
import DataList from "@@/DataList";
import Api from "@/api";
import {connect} from 'react-redux';

import './home.scss';

@connect()
class Home extends Component {
  state = {
    hotlist: [],
    recommend: [],
    difficulty:[],
    newlist:[]
  };

  goto = (path)=>{
    this.props.history.push(path);
  }
  gotoList = (query)=>{
    this.goto(`/iq?${query}`)
  }
  gotoDetail = (id)=>{
    this.goto(`/iq/${id}`)
  }

  async componentDidMount() {
    // 获取热门面试题
    let { data:hotlist } = await Api.get("/iq", {
      sort: "hot"
    });

    let { data:difficulty } = await Api.get("/iq", {
      sort: "difficulty"
    });

    let { data:newlist } = await Api.get("/iq", {
      size:6,
      sort: "addtime"
    });

    difficulty = difficulty.result;
    hotlist = hotlist.result;
    newlist = newlist.result;

    this.setState({
      hotlist,
      difficulty,
      newlist,
      recommend:[...hotlist.slice(3,6),...difficulty.slice(3,5)]
    });

  }

  render() {
    let { hotlist, recommend,difficulty,newlist } = this.state;
    return (
      <div className="home">
        <Carousel afterChange={this.onChange} autoplay>
          {recommend.map(item => {
            return (
              <div key={item._id} onClick={this.gotoDetail.bind(null,item._id)}>
                <h3>{item.question}</h3>
              </div>
            );
          })}
        </Carousel>
        <Row gutter={50}>
          <Col lg={16}>
            <h3>热门面试题</h3>
            <TableList data={hotlist} />
            <h3>重点难点面试题</h3>
            <TableList data={difficulty} />
          </Col>
          <Col lg={8}>
            {/* <h3>最新面试题</h3> */}
            <DataList 
              title="最新面试题" 
              data={newlist} 
              gotoList={this.gotoList.bind(this,'sort=addtime')} 
              gotoDetail={this.gotoDetail} 
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
