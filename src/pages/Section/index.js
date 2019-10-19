import React, { Component } from "react";
import { Button, Tabs,List,Select } from "antd";
const { TabPane } = Tabs;
const {Option} = Select;

import Api from "@/api";
import TableList from "@@/TableList";

class Section extends Component {
  state = {
    sections:[],
    pageSize:5,
  }
  changeTab = (code) => {
    
    let currentTabData = this.state.sections.filter(item=>item.code==code)[0];
    if(currentTabData && currentTabData.data) return;

    this.getTabData(code);
  }

  getTabData = async (code,page=1,pageSize=this.state.pageSize)=>{
    let sections = [...this.state.sections];
    let {data} = await Api.get('/iq',{
      category:code,
      page,
      size:pageSize
    });

    // 把数据写入相应tab
    sections.map(item=>{
      if(item.code == code){
        item.data = data;
      }
    })

    this.setState({
      sections,
      pageSize
    })
  }
  async componentDidMount(){
    let {data} = await Api.get('/category');

    this.setState({
      sections:data
    });

    //获取第一个tab的数据
    this.getTabData(data[0].code);
  }
  render() {
    let {sections,data,pageSize} = this.state;
    return (
      <div>
        <h1>阶段面试题</h1>
        <p>点击不同的阶段，随机出现相应阶段的面试题</p>
        <Tabs defaultActiveKey="1" onChange={this.changeTab}>
          {
            sections.map(item=>{
              return <TabPane tab={item.name} key={item.code}>
                {
                  item.data 
                  ? 
                  <TableList data={item.data.result} pagination={{
                    size:'small',
                    pageSize,
                    pageSizeOptions:['5','10','20'],
                    showSizeChanger:true,
                    total:item.data.total,
                    onChange:(page,pageSize)=>{
                      this.getTabData(item.code,page,pageSize);
                    },
                    onShowSizeChange:(page, pageSize)=>{
                      this.getTabData(item.code,page,pageSize);
                    }
                  }} />
                  :
                  <TableList />
                }
                
              </TabPane>
            })
          }
          
        </Tabs>
      </div>
    );
  }
}

export default Section;
