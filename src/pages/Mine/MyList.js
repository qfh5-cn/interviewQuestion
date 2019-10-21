import React from "react";
import { withRouter } from "react-router-dom";
import { withUser } from "@/utils/hoc";
import qs from 'querystring';
import InfiniteList from "@@/InfiniteList";

function MyList({ data, user, history, location: { search, pathname } }) {
  let paths = pathname.split(/\b(?=\/)/);
  let url = paths[paths.length > 1 ? 1 : 0];
  let params = qs.parse(search.slice(1));
  params.userid = user._id;
  let title = "我的面试题";
  if (url === "/answer") {
    params.getiqname = 1;
    title = "我的回答";
  } else if (url === "/focus") {
    url = '/iq/byid';
    params.ids = user.focus;
    title = "我的关注";
  }

  return (
    <InfiniteList
      title={title}
      api={{ url, params }}
      gotoDetail={id => {
        history.push(`/iq/${id}`);
      }}
    />
  );
}
MyList = withRouter(MyList);
MyList = withUser(MyList);
export default MyList;
