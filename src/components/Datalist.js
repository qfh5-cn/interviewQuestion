import React from "react";
import {withRouter} from 'react-router-dom';
import { Button, Table,Rate,Icon } from "antd";

import './Datalist.scss'

let defaultData = [
];

function Datalist({ data = defaultData,history,pagination=false }) {
  const columns = [
    {
      title: "#",
      dataIndex:"rowNumber",
      render(text, row, idx) {
        return idx + 1;
      }
    },
    {
      title: "面试题",
      dataIndex: "question",
      width:400,
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
    {
      title: "难度",
      dataIndex: "difficulty",
      render(text){
        return <Rate value={text} style={{margin:0,fontSize:16}} disabled character={<Icon type="star" />} />
      },
      sorter: (a, b) => b.difficulty - a.difficulty,
    },
    {
      title: "热度",
      dataIndex: "hot",
      sorter: (a, b) => b.hot - a.hot,
    },
    {
      title: "操作",
      dataIndex: "actions",
      render(text,row,idx) {
        return (
          <Button.Group size="small">
            <Button type="primary" ghost onClick={()=>{
              history.push(`/iq/${row._id}`)
            }}>
              查看
            </Button>
            {/* <Button ghost type="danger" icon="heart">
            </Button> */}
          </Button.Group>
        );
      }
    }
  ];
  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={pagination}
      rowKey="_id"
      size="middle"
      className="iq-list"
    />
  );
}

export default withRouter(Datalist);
