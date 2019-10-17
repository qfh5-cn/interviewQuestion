import React, { Component,createRef } from "react";
import { connect } from "react-redux";
import {
  Button,
  Input,
  List,
  Menu,
  Dropdown,
  Icon,
  Radio,
  Tooltip,
  message,
  Form,
  Rate
} from "antd";
import MyTags from "@@/MyTags";

import Api from "@/api";
import { withAuth } from "@/utils";
import MyEditor from "@@/MyEditor";
import { stateToHTML } from "draft-js-export-html";
import ReEditor from "re-editor";
import "re-editor/lib/styles/index.css";

@withAuth
@Form.create({ name: "addIQ" })
class Add extends Component {
  state = {
    category: [],
    addType: "multiple",
    iqs:[]
    // tags: []
    // detail:{},
  };

  // 获取元素节点
  // iqs = createRef();
  onChange = e => {
    let iqs = e.currentTarget.value;

    // 监听输入框修改，同步面试题结果
    iqs = this.formatData(iqs);
    this.setState({
      iqs
    });
  };
  changeCategory = (idx, { key, item }) => {
    let {iqs} = this.state;
    iqs = iqs.map((iq, i) => {
      if (i === idx) {
        iq.category = key;
      }
      return iq;
    });
    this.setState({
      iqs
    });
  };
  changeAddType = e => {
    this.setState({
      addType: e.target.value
    });
  };
  formatData(data) {
    // 格式化数据：string -> array
    if (!data) return [];
    data = data.trim().replace(/^[\*\d\s]+[、\\，\,\.]?|[？\?。\.；\;]$/gm, "");
    return data.split("\n").map(item => ({
      question: item,
    }));
  }
  removeIQ = idx=>{console.log(idx)
    let {iqs} = this.state;
    let {form} = this.props;
    iqs = iqs.filter((item, i) => i != idx);
    this.setState({
      iqs
    });

    // 同步输入框内容
    form.setFieldsValue({iqs:iqs.map(item=>item.question).join('\n')})

  }
  // data:Array
  addIQ = async iqs => {
    let { user } = this.props;

    let result = await Api.post("/iq", {
      userid: user._id,
      iqs
    });
    if (result.status === 200) {
      message.success("添加面试题成功", () => {
        this.forceUpdate();
      });
    } else {
      message.error("添加失败");
    }
  };
  // 批量添加
  add_multiple = () => {
    let { form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let { iqs } = this.state;
        let {company} = values;
        if(company){
          iqs = iqs.map(item=>{
            item.company = company;
            return item;
          })
        }
        this.addIQ(iqs);
      }else{

        // 设置后无法报错
        // form.setFieldsValue({iqs:''})
        this.iqs.focus();
      }
    });

  };
  // 单条添加
  add_single = () => {
    let { form} = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        values.detail = values.detail.toJSON();
        console.log("single:", values);
        this.addIQ([{ ...values }]);
      }else{
        
      }
    });
  };
  getCategoryName = code => {
    if (!code) return "设置分类";
    let current = this.state.category.filter(item => item.code == code)[0];
    return current.name;
  };

  changeTags = tags => {
    this.setState({
      tags
    });
  };

  async componentDidMount() {
    //获取分类
    let category;
    try {
      let { data } = await Api.get("/category");
      category = data;
    } catch (err) {
      console.log("request /category error", err);
    }
    this.setState({
      category
    });
  }
  componentWillUnmount() {
    Api.cancel("get_/category");
  }
  componentWillUpdate(nextProps, nextState) {
    // console.log("componentWillUpdate:", nextState);
    // 输入框与结果列表数据映射处理
    // let {form} = this.props;
    // let {result} = this.state;
    // let {form:nextForm} = nextProps
    // let {result:nextResult} = nextState;

    // let nextIQs = nextForm.getFieldValue('iqs');
    // let iqs = form.getFieldValue('iqs');console.log('nextIQs:iqs',nextIQs,iqs)
    // if (nextIQs != iqs) {
    //   // 如何实现保留result原有数据（如category）
    //   let result = this.formatData(nextIQs);
    //   this.setState({
    //     result
    //   });
    // }
    

    // if (nextResult.length != result.length) {
    //   let iqs = result.map(item=>item.question).join('\n')
    //   form.setFieldsValue({iqs})
    // }
  }
  componentDidUpdate(nextProps, nextState) {
    // console.log("componentDidUpdate:", nextState);
  }
  render() {
    let {
      iqs,
      category,
      addType,
      detail,
      showCompany,
    } = this.state;

    let { getFieldDecorator, getFieldValue } = this.props.form;

    return (
      <div>
        <Radio.Group
          name="addType"
          value={addType}
          onChange={this.changeAddType}
          style={{ marginBottom: 20 }}
        >
          <Radio value="multiple">批量添加</Radio>
          <Radio value="single">普通添加</Radio>
        </Radio.Group>
        <Form layout="vertical">
          {showCompany ? (
            <Form.Item label="公司名称">
              {getFieldDecorator("company", {})(
                <Input
                  prefix={<span style={{ color: "rgba(0,0,0,.25)" }}>@</span>}
                  suffix={
                    <Tooltip title="在哪家公司被问到该面试题，请尽量填写，可以帮助到更多的人">
                      <Icon
                        type="info-circle"
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
                    </Tooltip>
                  }
                  addonAfter={
                    <Tooltip title="不填写公司">
                      <Icon
                        type="close"
                        style={{color:'#f00'}}
                        onClick={() => {
                          this.setState({ showCompany: false });
                        }}
                      />
                    </Tooltip>
                  }
                />
              )}
            </Form.Item>
          ) : (
            <div className="ant-form-item">
              <Button
                type="dashed"
                icon="plus"
                onClick={() => {
                  this.setState({ showCompany: true });
                }}
              >
                添加公司
              </Button>
            </div>
          )}

          {addType === "multiple" ? (
            <>
              <Form.Item label="面试题（每行一道）">
                {getFieldDecorator("iqs", {
                  initialValue:iqs.map(item=>item.question).join('\n'),
                  rules:[
                    {required:true,message:'请输入面试题'}
                  ]
                })(
                  <Input.TextArea
                    placeholder="输入面试题，每行一道"
                    onChange={this.onChange}
                    autosize={{ minRows: 5 }}
                    ref={el=>this.iqs=el}
                    // ref={this.iqs}
                  />
                )}
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item label="面试题目">
                {getFieldDecorator("question", {
                  rules: [
                    {
                      required: true,
                      message: "请输入面试题目"
                    }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="link" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    suffix={
                      <Tooltip title="面试题目用于显示，请尽量精简">
                        <Icon
                          type="info-circle"
                          style={{ color: "rgba(0,0,0,.45)" }}
                        />
                      </Tooltip>
                    }
                  />
                )}
              </Form.Item>
              <Form.Item label="难度">
                {getFieldDecorator("difficulty", {
                  initialValue: 1
                })(<Rate />)}
              </Form.Item>
              <Form.Item label="标签">
                {getFieldDecorator("tags", {
                  initialValue: 1
                })(<MyTags onChange={this.changeTags} />)}
              </Form.Item>
              <Form.Item label="问题补充（选填）">
                {getFieldDecorator("detail", {
                  initialValue: detail
                })(
                  <ReEditor
                    onChange={detail => {
                      this.setState({
                        detail
                      });
                    }}
                  />
                )}
              </Form.Item>
            </>
          )}
        </Form>
        {/* 自动识别数据（分阶段） */}
        {addType === "multiple" ? (
          <List
            style={{ margin: '15px 0' }}
            itemLayout="vertical"
            size="small"
            dataSource={iqs}
            renderItem={(item, idx) => (
              <List.Item
                key={item.question}
                extra={[
                  <Dropdown
                    overlay={
                      <Menu onClick={this.changeCategory.bind(this, idx)}>
                        {category.map(item => (
                          <Menu.Item key={item.code}>{item.name}</Menu.Item>
                        ))}
                      </Menu>
                    }
                    key="menu"
                  >
                    <Button size="small" type="link">
                      {this.getCategoryName(item.category)}
                      <Icon type="down" />
                    </Button>
                  </Dropdown>,
                  <Tooltip title="删除" key="btn">
                    <Icon
                      
                      type="close-circle"
                      style={{ marginLeft: 20,color:'#f00' }}
                      onClick={this.removeIQ.bind(this,idx)}
                    />
                  </Tooltip>
                ]}
              >
                {idx + 1} - {item.question}
              </List.Item>
            )}
          />
        ) : null}
        <Button
          size="large"
          type="primary"
          onClick={this["add_" + addType]}
        >
          添加
        </Button>
      </div>
    );
  }
}

export default Add;
