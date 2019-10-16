import React from 'react'
import {Breadcrumb} from 'antd'
export default function({ data = ["首页"] }) {
  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
        {
            data.map(item=><Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>)
        }
    </Breadcrumb>
  );
}
