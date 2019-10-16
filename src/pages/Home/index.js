import React, { Component } from "react";
import { Carousel, Row, Col } from "antd";
import Datalist from "@@/Datalist";
import Api from "@/api";
import {connect} from 'react-redux';
import {showBreadcrumb} from '@/store/action/common';

import './home.scss';

@connect()
class Home extends Component {
  state = {
    hotlist: [],
    recommend: [],
    difficulty:[]
  };
  onChange() {
  }
  goto = (id)=>{
    this.props.history.push(`/iq/${id}`);
  }
  async componentDidMount() {
    // 获取热门面试题
    let { data:hotlist } = await Api.get("/iq", {
      sort: "hot"
    });

    let { data:difficulty } = await Api.get("/iq", {
      sort: "difficulty"
    });

    difficulty = difficulty.result;
    hotlist = hotlist.result;

    this.setState({
      hotlist,
      difficulty,
      recommend:[...hotlist.slice(3,6),...difficulty.slice(3,5)]
    });

  }
  componentWillUnmount(){
  }
  render() {
    let { hotlist, recommend,difficulty } = this.state;
    return (
      <div className="home">
        <Carousel afterChange={this.onChange} autoplay>
          {recommend.map(item => {
            return (
              <div key={item._id} onClick={this.goto.bind(null,item._id)}>
                <h3>{item.question}</h3>
              </div>
            );
          })}
        </Carousel>
        <h3>热门面试题</h3>
        <Datalist data={hotlist} />
        <h3>重点难点面试题</h3>
        <Datalist data={difficulty} />
      </div>
    );
  }
}

export default Home;
