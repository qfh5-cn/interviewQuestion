import React, { Component } from "react";
import { Tag, List, Input, Divider } from "antd";
import Api from "@/api";
import DataList from "@@/DataList";

import './style.scss';

class Search extends Component {
  state = {
    category: [],
    keyword: "",
    datalist: [],
    loading: false,
    hasMore: true,
    tagList: []
  };
  async componentDidMount() {
    this.getData();

    let { data: tagList } = await Api.get("/iq/tags", { size: 5 });
    tagList.sort((a, b) => b.value - a.value);
    this.setState({
      tagList
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props.location.search != prevProps.location.search) {
      this.getData();
    }
  }
  getData = async (keyword, page = 1, size = 10) => {
    if (!keyword) {
      let { location } = this.props;
      keyword = location.search.match(/(?<=keyword\=).+/);
      keyword = keyword ? decodeURI(keyword[0]) : "";
    }
    let { data } = await Api.get("/search", { keyword, page, size });
    let { total, size: pageSize, result: datalist } = data;
    this.setState({
      keyword,
      datalist,
      total,
      pageSize
    });
  };

  render() {
    let { history } = this.props;
    let { datalist, pageSize, total, category, keyword, tagList } = this.state;
    return (
      <div>
        {/* 热门搜索 */}
        <div className="hot-keyword">
          热门搜索：
          {tagList.map(tag => {
            return (
              <Tag.CheckableTag
                key={tag.text}
                checked={tag.text===keyword}
                onChange={checked => {
                  if (checked) {
                    history.push("/search?keyword=" + tag.text);
                  }

                  // this.setState({ tags });
                }}
              >
                {tag.text}
                {/* {checked ? <Icon type="close" style={{ color: "#fff" }} /> : null} */}
              </Tag.CheckableTag>
            );
          })}
        </div>
        <Divider />
        <DataList
          data={datalist}
          pagination={{
            total,
            onChange: (page, pageSize) => {
              this.getData(keyword, page, pageSize);
            },
            onShowSizeChange: (page, pageSize) => {
              this.getData(keyword, page, pageSize);
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
