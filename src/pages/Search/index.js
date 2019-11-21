import React, { Component } from "react";
import { Tag, List, Input } from "antd";
import Api from "@/api";
import DataList from '@@/DataList'

class Search extends Component {
  state = {
    category: [],
    keyword: "vue",
    datalist: [],
    loading: false,
    hasMore: true
  };
  componentDidMount() {
    this.getData()
  }
  componentDidUpdate(prevProps){
    if(this.props.location.search != prevProps.location.search){
      this.getData()
    }
  }
  getData = async (keyword,page=1,size=10)=>{
    if(!keyword){
      let {location} = this.props;
      keyword = location.search.match(/(?<=keyword\=)\w+/);
      keyword = keyword ? keyword[0] : ''
    }
    let { data } = await Api.get("/search", { keyword,page, size});
    let {total,size:pageSize,result:datalist} = data;
    this.setState({
      keyword,
      datalist,
      total,
      pageSize
    });
  }
  changeKeyword = (e)=>{
    this.setState({
        keyword:e.currentTarget.value
    })
  }
  render() {
    let { datalist, pageSize, total, category, keyword } = this.state;
    return (
      <div>
        {/* <Input.Search
          placeholder="输入关键字查找面试题"
          enterButton="查找"
          size="large"
          value={keyword}
          onChange={this.changeKeyword}
          onSearch={value => this.getData(value)}
        /> */}
        <DataList
        data={datalist}
        pagination={{
          total,
          onChange:(page,pageSize)=>{
            this.getData(keyword,page,pageSize);
          },
          onShowSizeChange:(page, pageSize)=>{
            this.getData(keyword,page,pageSize);
          }
        }}
        />
        {/* <List
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
        </List> */}
      </div>
    );
  }
}

export default Search;
