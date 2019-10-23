import React, { Component } from "react";
import { PageHeader, Tag, Icon } from "antd";
import qs from "querystring";
import InfiniteList from "@@/InfiniteList";
import Api from "@/api";

class List extends Component {
  state = {
    title: "",
    pathname: "",
    params: {}
  };
  async componentDidMount() {
    let {
      location: { search }
    } = this.props;

    let params = qs.parse(search.slice(1));

    let title;
    // 根据传入参数定义标题
    if (params.sort === "addtime") {
      title = "最新添加";
    } else if (params.companyid) {
      // 根据id获取公司名称
      let { data } = await Api.get(`/company/${params.companyid}`);
      title = <>在 <Tag>{data[0].name}</Tag> 被问过</>;
    } else if (params.userid) {
      let {
        data: [user]
      } = await Api.get(`/user/${params.userid}`);
      title = <><Tag>{user.nickname || user.username}</Tag> 添加</>;
    } else if (params.tag) {
      title = (
        <React.Fragment>
          与 <Tag color="magenta">{params.tag}</Tag>相关
        </React.Fragment>
      );
    }

    this.setState({
      title
    });
  }
  render() {
    let { title } = this.state;
    let {
      history,
      location: { search, pathname }
    } = this.props;
    let paths = pathname.split(/\b(?=\/)/);
    pathname = paths[paths.length > 1 ? 1 : 0];

    let params = qs.parse(search.slice(1));

    if (params.tag) {
      pathname = "/search";
      params.keyword = params.tag;
    }
    return (
      <div>
        {/* <PageHeader
          style={{paddingLeft:0}}
          onBack={() => {
            history.goBack();
          }}
          title="面试题列表"
          subTitle={<>{title}的面试题</>}
        /> */}
        <InfiniteList
          title="面试题列表"
          subTitle={title}
          api={{ url: pathname, params }}
          gotoDetail={id => {
            history.push(`/iq/${id}`);
          }}
          goBack={()=>history.goBack()}
          date="YYYY/MM/DD"
        />
      </div>
    );
  }
}

export default List;
