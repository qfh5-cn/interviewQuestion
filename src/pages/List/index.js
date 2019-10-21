import React, { Component } from "react";
// import { Spin, Tag, Icon, List } from "antd";
import Api from "@/api";
import qs from "querystring";
import { withUser } from "@/utils/hoc";
import InfiniteScroll from "react-infinite-scroller";
import InfiniteList from "@@/InfiniteList";

function List(props) {
  let {
    history,
    location: { search, pathname }
  } = props;
  let paths = pathname.split(/\b(?=\/)/);
  pathname = paths[paths.length > 1 ? 1 : 0];
  let params = qs.parse(search.slice(1));

  return (
    <InfiniteList
      api={{ url: pathname, params }}
      gotoDetail={id => {
        history.push(`/iq/${id}`);
      }}
      date="YYYY/MM/DD"
    />
  );
}

export default List;
