import React, { Component } from "react";
import {findDOMNode} from 'react-dom'
import { Spin, Icon } from "antd";
import moment from "moment";
moment.locale("zh-cn");
import Api from "@/api";
import InfiniteScroll from "react-infinite-scroller";
import DataList from "./DataList";
// import MyContext from '@/utils/context';
class InfiniteList extends Component {
  // static contextType = MyContext;
  state = {
    data: [],
    page: 1,
    size: 15,
    loading: false,
    hasMore: true
  }
  loadMore = async () => {
    let { data, page } = this.state;
    this.setState({
      loading: true
    });

    let newData = await this.getData();

    this.setState({
      page: page + 1,
      data: data.concat(newData.result),
      hasMore: data.length + newData.result.length < newData.total,
      loading: false
    });
  }
  getData = async () => {
    let { page, size } = this.state;
    let { api } = this.props;

    let { data } = await Api.get(api.url, {
      ...api.params,
      page,
      size
    });
    return data;
  }

  componentWillUpdate(nextProps,nextState){
    let { api } = this.props;
    if(nextProps.api.url != api.url){
      // 防止使用上一个页面的数据进行渲染
      this.state.data = [];
      this.setState({data:[],page:1})
    }
  }
  componentDidUpdate(prevProps) {
    let { api } = this.props;
    if (prevProps.api.url != api.url || JSON.stringify(prevProps.api.params)!=JSON.stringify(api.params)) {
      this.setState({ data: [], page: 1 }, async () => {
        let data = await this.getData();
        this.setState({
          data:data.result,
          hasMore: data.result.length < data.total,
        })
        // 解决与InfiniteScroll同时发起page=1请求的问题
        // this.setState({page:2})
      });
    }
  }
  shouldComponentUpdate(nextProps,nextState){
    let { api } = this.props;
    if(nextProps.api.url != api.url){
      this.setState({ data: [], page: 1 });
    }
    return nextState.data.length>0;
  }
  render() {
    let { data, page, hasMore,loading } = this.state;
    return (
      <InfiniteScroll
        pageStart={page}
        loadMore={this.loadMore}
        hasMore={!loading && hasMore}
        useWindow={false}
        getScrollParent={()=>document.querySelector('#content')}
        // getScrollParent={()=>findDOMNode(this.context.Content)}
        loader={
          <Spin
            key={page}
            tip="loading"
            size="large"
            indicator={<Icon type="loading" style={{ fontSize: 30 }} spin />}
          />
        }
      >
        <DataList {...this.props} data={data} pagination={false} />
      </InfiniteScroll>
    );
  }
}
export default InfiniteList;
