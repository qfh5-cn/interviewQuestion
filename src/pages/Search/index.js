import React, { Component } from "react";
import { Tag, List, Input } from "antd";
import Api from "@/api";

class Search extends Component {
  state = {
    category: [],
    keyword: "vue",
    data: [],
    loading: false,
    hasMore: true
  };
  async componentDidMount() {
    this.getData(this.state.keyword)
  }
  getData = async (keyword)=>{
    let { data } = await Api.get("/search", { keyword });

    this.setState({
      keyword,
      data: data.result
    });
  }
  changeKeyword = (e)=>{
    this.setState({
        keyword:e.currentTarget.value
    })
  }
  render() {
    let { data, loading, hasMore, category, keyword } = this.state;
    console.log("keyword:", keyword);
    return (
      <div style={{ height: "100%", overflowY: "auto" }}>
        <Input.Search
          placeholder="输入关键字查找面试题"
          enterButton="查找"
          size="large"
          value={keyword}
          onChange={this.changeKeyword}
          onSearch={value => this.getData(value)}
        />
        <List
          dataSource={data}
          renderItem={(item, idx) => (
            <List.Item key={item._id}>
              <List.Item.Meta
                title={
                  <>
                    {idx + 1}. <a href={"#/iq/" + item._id}>{item.question}</a>
                  </>
                }
                description={
                  item.tags && item.tags.map(tag => <Tag>{tag}</Tag>)
                }
              />
            </List.Item>
          )}
        >
          {loading && hasMore && (
            <div className="demo-loading-container">
              <Spin />
            </div>
          )}
        </List>
      </div>
    );
  }
}

export default Search;
