import React, { Component } from "react";
import { Button } from "antd";
import Api from "@/api";
import Datalist from "@@/Datalist";

class Random extends Component {
  state = {
    data: [],
    loading: false
  };
  getData = async () => {
    this.setState({
      loading:true
    })
    let { data } = await Api.get("/iq", { size: 5 ,random:1});

    this.setState({
      data,
      loading:false
    });
  };
  componentDidMount() {
    this.getData();
  }
  render() {
    let { data, loading } = this.state;
    return (
      <div>
        <h1>随机测试</h1>
        <p>随机获取一、二、三阶段技术或人事任意5道面试题进行测试</p>
        <Datalist data={data.result} pagination={false} />
        <Button
          type="primary"
          size="large"
          block
          onClick={this.getData}
          icon="redo"
          loading={loading}
          style={{marginTop:30}}
        >
          换一批
        </Button>
      </div>
    );
  }
}

export default Random;
