import React from 'react';
import {PageHeader,Row,Col,Icon,List,Button} from 'antd';
import moment from "moment";
moment.locale('zh-cn')
function DataList({title,subTitle,data,gotoList,gotoDetail,goBack,date}){
    
    return <div>
        {
            title ? 
            // <Row>
            //     <Col span={16}>
            //         <h3>{title}</h3>
            //     </Col>
            //     <Col span={8} style={{ textAlign: "right" }}>
            //         {gotoList ? <Button type="link" onClick={gotoList}>更多<Icon type="right" /></Button>:null}
            //     </Col>
            // </Row>
            <PageHeader
              style={{paddingLeft:0,paddingRight:0}}
              onBack={goBack}
              title={title}
              subTitle={subTitle}
              extra={gotoList ? <Button type="link" onClick={gotoList}>更多<Icon type="right" /></Button>:null}
            />
            :
            null
        }
    
    <List
      dataSource={data}
      renderItem={(item, idx) => {
        let discription = item.iq ? `@${item.iq.question}`:``;
        let content ;
        if(date){
          if(typeof date === 'boolean'){
            content = moment(item.addtime).fromNow()
          }else{
            content = moment(item.addtime).format(date);
          }
        }
        return (
          <List.Item
          key={item._id}
          actions={[<Icon type="right" />]}
          onClick={gotoDetail.bind(this,item.iqid||item._id)}
        >
          <List.Item.Meta
            title={`${idx + 1}. ${item.question||item.content}`}
            description={discription}
            />
            <div>{content}</div>
        </List.Item>
        )
      }
    }
    />
  </div>
}
export default DataList;