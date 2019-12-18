import React,{useState} from "react";
import {withRouter} from 'react-router'
import { PageHeader, Row, Col, Icon, List, Button,Skeleton,Spin } from "antd";
import moment from "moment";
import './DataList.module.scss';
moment.locale("zh-cn");

let defaultPagination = {
  size: "small",
  // pageSize:5,
  pageSizeOptions: ["5", "10", "20"],
  showSizeChanger:true,
  showTotal:total=>`共${total}条`,
}
let defaultDescription = {hot:'浏览',answer:'回答'}

let start = Date.now();console.log(start)

const DataList = ({
  title,
  subTitle,
  rowNumber=true,//行号
  data=[],
  gotoList,
  onClick,
  goBack,
  date, //显示日期
  description={},
  pagination=false,
  actions = [<Icon type="right" />],
  history
})=> {
  console.log(123)
  if(!onClick){
    onClick = id=>{
      history.push(`/iq/${id}`)
    }
  }
  if(goBack===true){
    goBack = id=>{
      history.goBack()
    }
  }

  if(pagination){
    pagination = Object.assign({},defaultPagination,pagination)
  }
  description = Object.assign({},defaultDescription,description)
  return (
    <div className="datalist">
      {title ? (
        <PageHeader
          style={{ paddingLeft: 0, paddingRight: 0 }}
          onBack={goBack}
          title={title}
          subTitle={subTitle}
          extra={
            gotoList ? (
              <Button type="link" onClick={gotoList}>
                更多
                <Icon type="right" />
              </Button>
            ) : null
          }
        />
      ) : null}
      {/* <Skeleton title={false} loading={data.length===0} avatar={{size:'small',shape:'square'}} active> */}
      {
        // data.length===0 ? 
        // <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
        // :
        <List
          dataSource={data}
          pagination={pagination}
          renderItem={(item, idx) => {
            let descriptionKeys = Object.keys(description).filter(key=>description[key]!==false);
            let descriptionItem = descriptionKeys.map((key,idx)=>{
              let content = typeof description[key]=== 'function' ? 
              description[key](item) : item[key] + description[key];
              return idx<descriptionKeys.length-1?<span key={key}>{content} &bull; </span>:<span key={key}>{content}</span>
            })
            let content;
            if (date) {
              let addtime = moment(item.addtime);
              if (typeof date === "boolean") {
                let now = moment();
                if(now.diff(addtime,'days')>3){
                  content = addtime.format('YYYY/MM/DD');
                }else{
                  content = addtime.fromNow();
                }
              } else {
                content = addtime.format(date);
              }
            }

            return (
              <List.Item
                key={item._id}
                actions={actions}
                onMouseDown={(e)=>{
                  e.currentTarget.x = e.pageX;
                }}
                onClick={(e)=>{
                  // 修复不可选中文字的bug
                  if(Math.abs(e.pageX-e.currentTarget.x)<5){
                    onClick&&onClick(item.iqid || item._id);
                  }
                }}
              >
                {/* <Skeleton title={false} loading={item.loading} avatar={{size:'small',shape:'square'}} active> */}
                  <List.Item.Meta
                    avatar={rowNumber?<span>{idx + 1}</span>:null}
                    title={`${item.question || item.content}`}
                    description={descriptionItem}
                  />
                  <div>{content}</div>
                  {/* </Skeleton> */}
              </List.Item>
            );
          }}
        />
      }
      {/* </Skeleton> */}
    </div>
  );
}

export default withRouter(DataList);
