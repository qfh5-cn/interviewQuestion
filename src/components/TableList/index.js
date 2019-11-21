import React from "react";
import {withRouter} from 'react-router-dom';
import { Button, Table,Rate,Icon,PageHeader } from "antd";

import './TableList.scss'

let defaultData = [
];
let defaultPagination = {
  size: "small",
  // pageSize:5,
  pageSizeOptions: ["5", "10", "20"],
  showSizeChanger:true,
  showTotal:total=>`共${total}条`,
}
function TableList({ data = defaultData,history,pagination,onClick,title,gotoList }) {
  // 合并pagination选项
  pagination = pagination===false ? false :{
    ...defaultPagination,
    ...pagination
  }
  if(!onClick){
    onClick = (row,idx)=>{
      history.push(`/iq/${row._id}`)
    }
  }
  const columns = [
    // {
    //   title: "#",
    //   dataIndex:"rowNumber",
    //   width:20,
    //   render(text, row, idx) {
    //     return idx + 1;
    //   }
    // },
    {
      title: "面试题",
      dataIndex: "question",
      
      render(text, row, idx){
        return <>
          <h4>{text}</h4>
          <div style={{fontSize:12,color:'#999'}}>
           <span>{row.hot}浏览</span> &bull; <span>{row.answer}回答</span> &bull; 
            <span style={{marginLeft:5}}>
            难度：<Rate value={row.difficulty} style={{fontSize:16}} disabled character={<Icon type="star" />} />
            </span>
          </div>
        </>
      },
    },
    // {
    //   title: "阶段",
    //   dataIndex: "category",
    //   render(text,row,idx){console.log('row:',row)
    //     return <Button size="small" shape="round">
    //     {isNaN(text) ? text : text+'阶段'}
    //     </Button>;
    //   }
    // },
    // {
    //   title: "难度",
    //   dataIndex: "difficulty",
    //   render(text){
    //     return <Rate value={text} style={{margin:0,fontSize:16}} disabled character={<Icon type="star" />} />
    //   },
    //   sorter: (a, b) => b.difficulty - a.difficulty,
    // },
    // {
    //   title: "热度",
    //   dataIndex: "hot",
    //   sorter: (a, b) => b.hot - a.hot,
    // },
    // {
    //   title: "操作",
    //   dataIndex: "actions",
    //   width:100,
    //   render(text,row,idx) {
    //     return (
    //       <Button.Group size="small">
    //         <Button type="primary" ghost onClick={()=>{
    //           history.push(`/iq/${row._id}`)
    //         }}>
    //           查看
    //         </Button>
    //         <Button ghost type="danger" icon="heart">
    //         </Button>
    //       </Button.Group>
    //     );
    //   }
    // }
  ];
  return (
    <>
    {title ? (
      <PageHeader
          style={{ paddingLeft: 0, paddingRight: 0 }}
          title={title}
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
      <Table
        dataSource={data}
        columns={columns}
        pagination={pagination}
        rowKey="_id"
        size="middle"
        className="iq-list"
        onRow={(record,index) => {
          return {
            onClick:onClick.bind(this,record,index), // 点击行
          };
        }}
      />
    </>
  );
}

export default withRouter(TableList);
