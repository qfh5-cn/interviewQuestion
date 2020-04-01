import React, { Component } from "react";
import { Radio, Row, Col, Input, Button, Icon, Divider } from "antd";
import DataList from "@@/DataList";
import Api from "@/api";
import { connect } from "react-redux";

@connect()
class Company extends Component {
  state = {
    companies: [],
    currentCompany: "all",
    companyKeyword: "",
    showQty: 20,
    pageSize: 5,
    iqs: []
  };
  getData = async (page = 1, pageSize = this.state.pageSize) => {
    let { currentCompany } = this.state;
    let params = {
      page,
      size: pageSize
    };
    if (currentCompany === "all") {
      params.companyid = true;
    } else {
      params.companyid = currentCompany;
    }
    let { data: iqs } = await Api.get("/iq", params);

    this.setState({
      pageSize,
      iqs
    });
  };

  changeCompany = e => {
    let { history } = this.props;
    let currentCompany = e.target.value;
    this.setState(
      {
        currentCompany
      },
      () => {
        // this.getData();

        // 跳转到公司列表
        // history.push(`/iq?companyid=${currentCompany}`);
        history.push(`/company/${currentCompany}`);
      }
    );
  };
  changeCompanyKeyword = e => {
    this.setState({
      companyKeyword: e.target.value
    });
  };

  showMore = qty => {
    let { showQty } = this.state;
    if (typeof qty === "number") {
      showQty = qty;
    } else {
      showQty += 20;
    }
    this.setState({
      showQty
    });
  };

  filteCompany = companies => {
    let { showQty, companyKeyword } = this.state;
    return companies.filter(item =>
      new RegExp(companyKeyword, "i").test(item.name)
    );
    //.filter((item,idx)=>idx<showQty)
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

  render() {console.log('compaynyList.render')
    let {
      companies,
      iqs,
      currentCompany,
      pageSize,
      companyKeyword,
      showQty
    } = this.state;
    return (
      <div>
        <Radio.Group
          onChange={this.changeCompany}
          value={currentCompany}
          style={{ display: "block" }}
        >
          <Row style={{ paddingBottom: 15 }}>
            <Col span={24} style={{ paddingBottom: 15 }}>
              <Input.Search
                allowClear
                value={companyKeyword}
                onChange={this.changeCompanyKeyword}
                addonBefore={<Radio value="all">All</Radio>}
              />
            </Col>
            {this.filteCompany(companies).map(item => (
              <Col key={item._id} sm={12} md={8}>
                <Radio value={item._id}>{item.name}</Radio>
              </Col>
            ))}
          </Row>
        </Radio.Group>
        {/* <div style={{textAlign:'center',paddingBottom:15}}>
        {
          showQty<companies.length
          ?
          
          <Button.Group>
            <Button size="small" onClick={this.showMore}>
              更多
              <Icon type="ellipsis" />
            </Button>
            <Button size="small" icon="menu" onClick={this.showMore.bind(this,companies.length)}>全部</Button>

          </Button.Group>
          
          :
          null
        }
        </div> */}
        <DataList
          data={iqs.result}
          pagination={{
            pageSize,
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
