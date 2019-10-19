import React from 'react';
import {Row,Col,Icon,List,Button} from 'antd';
import moment from "moment";
moment.locale('zh-cn')
function DataList({title,data,gotoList,gotoDetail}){
  
    return <div style={{ marginTop: 15 }}>
        {
            title ? 
            <Row>
                <Col span={16}>
                    <h3>{title}</h3>
                </Col>
                <Col span={8} style={{ textAlign: "right" }}>
                    <Button type="link" onClick={gotoList}>更多<Icon type="right" /></Button>
                </Col>
            </Row>
            :
            null
        }
    
    <List
      dataSource={data}
      renderItem={(item, idx) => (
        <List.Item
          key={item._id}
          actions={[<Icon type="right" />]}
          onClick={gotoDetail.bind(this,item._id)}
        >
          <List.Item.Meta
            title={`${idx + 1}. ${item.question}`}
            description={moment(item.addtime).fromNow()}
            />
            
        </List.Item>
      )}
    />
  </div>
}
export default DataList;