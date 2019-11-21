import React from 'react'
import {Breadcrumb} from 'antd';
import {withRouter} from 'react-router-dom'
function MyBreadcrumb({ data = ["首页"],history }) {
  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
        {
            data.map((item,idx)=><Breadcrumb.Item key={item.path} onClick={idx<data.length-1 ? ()=>{
              history.push(item.path);
            }:null}>{item.text}</Breadcrumb.Item>)
        }
    </Breadcrumb>
  );
}
MyBreadcrumb = withRouter(MyBreadcrumb);
export default MyBreadcrumb;
