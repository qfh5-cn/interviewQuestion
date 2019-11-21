import React from "react";
import { withRouter } from "react-router-dom";
import { withUser,getUserInfo } from "@/utils";
import qs from 'querystring';
import InfiniteList from "@@/InfiniteList";
import {Button,Tooltip} from "antd";
import Api from "@/api";


function MyList({ user, history, location: { search, pathname } }) {
  let paths = pathname.split(/\b(?=\/)/);
  let url = paths[paths.length > 1 ? 1 : 0];
  let params = qs.parse(search.slice(1));
  params.userid = user._id;
  let title = "我的面试题";
  let actions;
  let description
  if (url === "/answer") {
    params.getiqname = 1;
    title = "我的回答";
    description = {hot:false,answer:false,question:item=>`@${item.iq.question}`}
  } else if (url === "/focus") {
    url = '/iq/byid';
    params.ids = user.focus;
    title = "我的收藏";
    description={answer:false}
    actions = [<Tooltip title="取消收藏"><Button data-id="delete" shape="circle" icon="delete" size="small"></Button></Tooltip>]
  }


  return (
    <InfiniteList
      title={title}
      api={{ url, params }}
      // gotoDetail={id => {
      //   history.push(`/iq/${id}`);
      // }}
      onClick={async (id,e)=>{
        // console.log(id,e.target,e)
        if(e.target.dataset.id === 'delete'){
          url = `/user/${user._id}/unfollow`;
          await Api.patch(url, {
            iqid: id
          });
          getUserInfo(user._id);
        }else{
          history.push(`/iq/${id}`);
        }
      }}
      description={description}
      actions={actions}
    />
  );
}
MyList = withRouter(MyList);
MyList = withUser(MyList);
export default MyList;
