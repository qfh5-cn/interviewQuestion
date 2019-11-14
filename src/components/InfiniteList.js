import React, { Component } from "react";
import { Spin, Icon } from "antd";
import moment from "moment";
moment.locale("zh-cn");
import Api from "@/api";
import InfiniteScroll from "react-infinite-scroller";
import DataList from "./DataList";
class InfiniteList extends Component {
  state = {
    data: this.props.data || [],
    page: 1,
    size: 15,
    loading: false,
    hasMore: true
  };
  loadMore = async () => {
    let { data, page } = this.state;
    this.setState({
      loading: true
    });

    let newData = await this.getData();

    this.setState({
      page: page + 1,
      hasMore: data.length + newData.result.length < newData.total,
      loading: false
    });
  };
  getData = async () => {
    let { data, page, size } = this.state;
    let { api } = this.props;

    let { data: newData } = await Api.get(api.url, {
      ...api.params,
      page,
      size
    });

    this.setState({
      data: data.concat(newData.result),
      hasMore: page * size < newData.total
    });
    return newData;
  };
  componentDidUpdate(nextProps) {
    let { api } = this.props;
    if (nextProps.api.url != api.url || JSON.stringify(nextProps.api.params)!=JSON.stringify(api.params)) {
      this.setState({ data: [], page: 1 }, () => {
        this.getData();
        // 解决与InfiniteScroll同时发起page=1请求的问题
        this.setState({page:2})
      });
    }
  }
  render() {
    let { data, page, hasMore,loading } = this.state;console.log('data:',data,this.props.data)
    return (
      <InfiniteScroll
        pageStart={page}
        loadMore={this.loadMore}
        hasMore={!loading && hasMore}
        loader={
          <Spin
            key={page}
            tip="loading"
            size="large"
            indicator={<Icon type="loading" style={{ fontSize: 30 }} spin />}
          />
        }
      >
        <DataList {...this.props} data={data} />
      </InfiniteScroll>
    );
  }
}
export default InfiniteList;
