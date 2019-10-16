import React from 'react';
import {withRouter} from 'react-router-dom';
import {withUser} from '@/utils/hoc'
import {Row,Col,Icon,List,Button} from 'antd';
function MyList({title,type,data,history,user}){
    return <div style={{ marginTop: 15 }}>
    <Row>
      <Col span={16}>
        <h3>{title}</h3>
      </Col>
      <Col span={8} style={{ textAlign: "right" }}>
        <Button type="link" onClick={()=>{
            // history.push({pathname:`/mine/${type}`,search:`?userid=${user._id}`})
            history.push(`/mine/${type}`)
        }}>更多&gt;</Button>
      </Col>
    </Row>
    <List
      dataSource={data}
      renderItem={(item, idx) => (
        <List.Item
          key={item._id}
          actions={[<Icon type="right" />]}
          onClick={()=>{
            let id = type==='iq' ? item._id : item.iqid
            history.push(`/iq/${id}`)
          }}
        >
          <List.Item.Meta
            title={
              <>
                {idx + 1}. {item.content||item.question}
              </>
            }
            description={item.iq ? '@'+item.iq.question:null}
            />
            
        </List.Item>
      )}
    />
  </div>
}
MyList = withRouter(MyList);
MyList = withUser(MyList);
export default MyList;