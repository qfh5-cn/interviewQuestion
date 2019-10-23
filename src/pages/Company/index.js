import React, { Component } from "react";
import { Radio, Row, Col, Icon, Divider } from "antd";
import TableList from "@@/TableList";
import DataList from "@@/DataList";
import Api from "@/api";
import { connect } from "react-redux";

@connect()
class Company extends Component {
  state = {
    companies: [],
    currentCompany: "all",
    pageSize: 5,
    iqs: []
  };
  getData = async (page = 1, pageSize = this.state.pageSize) => {
    let {currentCompany} = this.state;
    let params = {
      page,
      size: pageSize
    };
    if(currentCompany !== 'all'){
        params.companyid = currentCompany
    }
    let { data: iqs } = await Api.get("/iq", params);

    this.setState({
      pageSize,
      iqs
    });
  };

  changeCompany = e => {
    let currentCompany = e.target.value
    this.setState({
        currentCompany
    },()=>{
        this.getData();
    });
    
  };

  async componentDidMount() {
    // 获取所有公司
    let { data: companies } = await Api.get("/company");

    // 获取所有面试题
    this.getData();

    this.setState({
      companies
    });
  }

  render() {
    let { companies, iqs, currentCompany, pageSize } = this.state;
    return (
      <div>
        <Radio.Group onChange={this.changeCompany} value={currentCompany}>
          <Row>
            <Col span={24}>
              <Radio value="all">All</Radio>
            </Col>
            {companies.map(item => (
              <Col key={item._id} sm={12} md={8}>
                <Radio value={item._id}>{item.name}</Radio>
              </Col>
            ))}
          </Row>
        </Radio.Group>
        <TableList
          data={iqs.result}
          pagination={{
            size: "small",
            pageSize,
            pageSizeOptions: ["5", "10", "20"],
            showSizeChanger: true,
            total: iqs.total,
            onChange: (page, pageSize) => {
              this.getData(page, pageSize);
            },
            onShowSizeChange: (page, pageSize) => {
              this.getData(page, pageSize);
            }
          }}
        />
      </div>
    );
  }
}

export default Company;
