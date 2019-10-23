import React, { Component } from "react";
import { Spin,Icon} from "antd";
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
  getData = async () => {
    let { data, page, size } = this.state;
    let { user,api } = this.props;

    this.setState({
      loading: true
    });

    let { data: newData } = await Api.get(api.url, { ...api.params, page, size });

    this.setState({
      page: page + 1,
      data: data.concat(newData.result),
      hasMore: (data.length + newData.result.length) < newData.total,
      loading: false
    });
  };
  render() {
    let { title, gotoList, gotoDetail,date } = this.props;
    let {data,page,hasMore,loading} = this.state;
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.getData}
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
        <DataList
          {...this.props}
          data={data}
        />
      </InfiniteScroll>
    );
  }
}
export default InfiniteList;
