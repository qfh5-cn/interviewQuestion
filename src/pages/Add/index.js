import React, { Component } from "react";
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
import MyTags from '@@/MyTags';

import Api from "@/api";
import { withAuth } from "@/utils";
import MyEditor from "@@/MyEditor";
import {stateToHTML} from 'draft-js-export-html';
import ReEditor from 're-editor';
import 're-editor/lib/styles/index.css';

@withAuth
@Form.create({ name: "addIQ" })
class Add extends Component {
  state = {
    interviewQuestions: "",
    result: [],
    category: [],
    addType: "single",
    tags:[],
    // detail:{},
  };
  onChange = e => {
    let interviewQuestions = e.currentTarget.value;
    this.setState({
      interviewQuestions
      //   result: this.formatData(interviewQuestions)
    });
  };
  changeCategory = (idx, { key, item }) => {
    let result = this.state.result.map((iq, i) => {
      if (i === idx) {
        iq.category = key;
      }
      return iq;
    });
    this.setState({
      result
    });
  };
  changeAddType = e => {
    console.log(e);
    this.setState({
      addType: e.target.value
    });
  };
  formatData(data) {
    // string -> array
    if (!data) return [];
    data = data.trim().replace(/^[\*\d\s]+[、\\，\,\.]?|[？\?。\.；\;]$/gm, "");
    return data.split("\n").map(item => ({
      question: item,
      category: "",
      hot: 1
    }));
  }
  // data:Array
  addIQ = async (data) => {
    let { user } = this.props;
    let result = await Api.post("/iq", {
      userid: user._id,
      iq: data
    });
    if(result.status===200){
      message.success("添加面试题成功",()=>{
        this.forceUpdate()
      });
    }else{
      message.error("添加失败");
    }

    
  };
  // 批量添加
  add_multiple = ()=>{
    let {result} = this.state;
    if(result.length===0){
      message.error('请输入面试题');
      this.refs.iq.focus();
      return 
    }
    this.addIQ(result);
    this.setState({
      interviewQuestions: ""
    });
    this.refs.iq.focus();
  }
  // 单条添加
  add_single = (data)=>{
    let {form,dispatch,history,location} = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let { question,detail,difficulty } = values;
        let {tags} = this.state;
        detail = detail.toJSON();
        console.log(question,difficulty,tags);
        this.addIQ([{question,detail,difficulty,tags}]);
      }
    });
  }
  getCategoryName = code => {
    if (!code) return "设置分类";
    let current = this.state.category.filter(item => item.code == code)[0];
    return current.name;
  };

  changeTags = tags =>{
    this.setState({
      tags
    })
  }

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
    // 输入框与列表数据映射处理
    if (nextState.interviewQuestions != this.state.interviewQuestions) {
      // 如何实现保留result原有数据（如category）
      let newData = this.formatData(nextState.interviewQuestions);
      this.setState({
        result: newData
      });
    }

    if (nextState.result.length != this.state.result.length) {
      this.setState({
        interviewQuestions: nextState.result
          .map(item => item.question)
          .join("\n")
      });
    }
  }
  componentDidUpdate(nextProps, nextState) {
    // console.log("componentDidUpdate:", nextState);
  }
  render() {
    let { interviewQuestions, result, category, addType,detail } = this.state;

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
        {addType === "multiple" ? (
          <div className="multiple">
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
            <Input.TextArea
              placeholder="输入面试题，每行一道"
              value={interviewQuestions}
              onChange={this.onChange}
              autosize={{ minRows: 5 }}
              ref="iq"
            ></Input.TextArea>
            {/* 自动识别数据（分阶段） */}
            <List
              style={{ marginTop: 15 }}
              itemLayout="vertical"
              size="small"
              dataSource={result}
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
                      <Button size="small">
                        {this.getCategoryName(item.category)}
                        <Icon type="down" />
                      </Button>
                    </Dropdown>,
                    <Button
                      key="btn"
                      type="link"
                      icon="close"
                      size="small"
                      shape="circle"
                      style={{ marginLeft: 20 }}
                      onClick={() => {
                        result = result.filter((item, i) => i != idx);
                        console.log("result:", result);
                        //   interviewQuestions = result.join('\n');
                        this.setState({
                          result
                          //   interviewQuestions
                        });
                      }}
                    ></Button>
                  ]}
                >
                  {idx + 1} - {item.question}
                </List.Item>
              )}
            />
          </div>
        ) : (
          <div className="single">
            <Form layout="vertical">
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
                  initialValue:1,
                })(
                  <Rate/>
                )}
              </Form.Item>
              <Form.Item label="标签">
                {getFieldDecorator("tags", {
                  initialValue:1,
                })(
                  <MyTags onChange={this.changeTags}/>
                )}
              </Form.Item>
              <Form.Item label="问题补充（选填）">
                {getFieldDecorator("detail", {
                  initialValue:detail,
                  rules: []
                })(<ReEditor onChange={(detail)=>{
                  this.setState({
                    detail
                  })
                }} />)}
              </Form.Item>
            </Form>
          </div>
        )}
        <Button
          size="large"
          type="primary"
          style={{ marginTop: 15 }}
          onClick={this['add_'+addType]}
        >
          添加
        </Button>
      </div>
    );
  }
}

export default Add;
