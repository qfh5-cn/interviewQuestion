import React, { Component } from "react";
import { Tag,Rate,Icon } from "antd";
import qs from "querystring";
import InfiniteList from "@@/InfiniteList";
import Api from "@/api";
import {withFooter} from '@/utils';

@withFooter
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

    let title,description;
    // 时间格式展示
    let dateFormat = params.sort === 'addtime'?true:"YYYY/MM/DD"
    // 根据传入参数定义标题
    if (params.sort === "addtime") {
      title = "最新添加";
    } else if (params.sort === "difficulty") {
      title = "重点难点";
      dateFormat=false;
      description={difficulty:item=><>难度：<Rate value={item.difficulty} style={{fontSize:16}} disabled character={<Icon type="star" />} /></>}
    }else if (params.companyid) {
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
      title,
      description,
      dateFormat
    });
  }
  render() {
    let { title,description,dateFormat } = this.state;
    let {
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
        <InfiniteList
          title="面试题"
          subTitle={title}
          api={{ url: pathname, params }}
          date={dateFormat}
          description={description}
          goBack
        />
    );
  }
}

export default List;
