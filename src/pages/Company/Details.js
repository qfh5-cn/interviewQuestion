import React, { Component } from "react";
import { PageHeader, Row, Col, List, Button, Icon, Divider } from "antd";
import DataList from "@@/DataList";
import Api from "@/api";
import { connect } from "react-redux";
import moment from 'moment'

@connect()
class Company extends Component {
  state = {
    company: {},
    showQty: 20,
    pageSize: 5,
    iqs: []
  };
  getData = async (page = 1, pageSize = this.state.pageSize) => {
    let { company } = this.state;
    let params = {
        companyid:company._id,
      page,
      size: pageSize
    };

    let { data: iqs } = await Api.get("/iq", params);

    this.setState({
      pageSize,
      iqs
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

  async componentDidMount() {
    console.log(this.history);
    // 获取当前公司id
    let { match } = this.props; //解构user后得不到更新的值？
    let { id } = match.params;
    let { data } = await Api.get("/company/" + id);

    

    this.setState({
      company: data[0]
    },()=>{
        // 获取所有面试题
        this.getData();
    });
  }

  render() {
    console.log("compayDetails.render");
    let { company, iqs, pageSize, showQty } = this.state;
    let { history } = this.props;
    return (
      <div>
        <PageHeader
          style={{ paddingLeft: 0, paddingRight: 0 }}
          onBack={history.goBack}
          title={company.name}
          subTitle={"在该公司被问过的问题"}
        />
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
        {company.summary ?
          <section style={{marginTop:20}}>
            <h4>小伙伴们在该公司的面试感受</h4>
            <List
              itemLayout="horizontal"
              dataSource={company.summary}
              renderItem={item => (
                <List.Item
                  actions={[
                    <time>{moment(item.date).format("YYYY-MM-DD")}</time>
                  ]}
                >
                  <List.Item.Meta description={item.content} />
                </List.Item>
              )}
            />
          </section>
          : null
        }
      </div>
    );
  }
}

export default Company;
