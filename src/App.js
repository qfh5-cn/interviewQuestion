import React, { Component, Suspense, lazy } from "react";
import { connect } from "react-redux";
import action, { changeBreadcrumb } from "./store/action/common";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import MyContext from "./utils/context";
import {
  Layout,
  Button,
  Menu,
  Dropdown,
  Icon,
  Row,
  Col,
  Avatar,
  Tooltip,
  Spin,
  Input,
  Badge,

} from "antd";
const { Header, Footer, Content } = Layout;

// import Home from "~/Home";
// import Random from "~/Random";
// import Section from "~/Section";
// import Add from "~/Add";
// import Mine from "~/Mine";
// import Details from "~/Details";
// import Reg from "~/Reg";
// import Login from "~/Login";
// import List from "~/List";
// import Search from "~/Search";
// import Company from "~/Company";
// import Tags from "~/Tags";

const Home = lazy(() => import("~/Home"));
const Random = lazy(() => import("~/Random"));
const Section = lazy(() => import("~/Section"));
const Add = lazy(() => import("~/Add"));
const Mine = lazy(() => import("~/Mine"));
const Details = lazy(() => import("~/Details"));
const Reg = lazy(() => import("~/Reg"));
const Login = lazy(() => import("~/Login"));
const List = lazy(() => import("~/List"));
const Search = lazy(() => import("~/Search"));
const Company = lazy(() => import("~/Company"));
const Tags = lazy(() => import("~/Tags"));
const ForgotPassword = lazy(() => import("~/ForgotPassword"));
const ResetPassword = lazy(() => import("~/ResetPassword"));

import MyBreadcrumb from "@@/MyBreadcrumb";
import { withUser } from "./utils";
import { baseurl, Styles } from "./global.config";

import "./App.scss";

@withRouter
@withUser
@connect(
  ({ common }) => {
    return { 
      breadcrumb: common.get("breadcrumb").toJS(),
      showFooter:common.get('showFooter')
    };
  },
  dispatch => {
    return {
      logout() {
        dispatch(action.logout());
      },
      changeBreadcrumb(pages) {
        dispatch(changeBreadcrumb(pages));
      },
      dispatch
    };
  }
)
class App extends Component {
  state = {
    current: ["/home"],
    menu: [
      {
        name: "Home",
        path: "/home",
        text: "首页"
      },
      {
        name: "Random",
        path: "/random",
        text: "随机面试"
      },
      {
        name: "Section",
        path: "/section",
        text: "阶段面试"
      },
      {
        name: "Add",
        path: "/add",
        text: "添加面试题"
      },
      {
        name: "Mine",
        path: "/mine",
        text: "我的"
      }
    ]
  };

  changeMenu = ({ key }) => {
    this.goto(key);
  };

  goto = path => {
    let { history, changeBreadcrumb } = this.props;

    this.setState({
      current: [path]
    });

    history.push(path);
  };

  getBreadcrumbList = ()=>{
    let {
      location: { pathname },
      changeBreadcrumb
    } = this.props;console.log('pathname:',pathname)
    let homePage = {path:'/home',text:'首页'}
    let elsePages = [{path:'/search',text:'搜索'},{path:'/iq/',text:'面试题'},{path:'/iq',text:'面试题列表'}]
    let allPages = [...this.state.menu,...elsePages]
    let currentPage = allPages.filter(item => pathname.startsWith(item.path))[0];

    let breadcrumbList = [];
    // if(pathname.)
    if(currentPage){
      // 不显示面包屑导航
      if(/^\/(?:home|iq\/)/.test(currentPage.path)){
        breadcrumbList = [currentPage];
      }else{
        breadcrumbList = [homePage,currentPage];
      }
    }
    changeBreadcrumb(breadcrumbList);

    this.setState({
      current: [pathname]
    });
  }

  changeKeyword = (e) => {
    let keyword = typeof e==='string' ? e : e.currentTarget.value
    this.setState({
      keyword
    });
  };

  componentDidMount() {    

    // if (pathname != "/home") {
    //   let currentMenu = this.state.menu.filter(
    //     item => item.path === pathname
    //   )[0];
    //   currentMenu && changeBreadcrumb(["首页", currentMenu.text]);
    // }
    this.getBreadcrumbList();
  }
  componentDidUpdate(prevProps){
    if(this.props.location.pathname != prevProps.location.pathname){
      this.getBreadcrumbList()
    }
  }

  render() {
    let { current, menu,keyword='' } = this.state;
    let { user, logout, breadcrumb,location,showFooter } = this.props;
    // 添加提示信息Badge
    let newMessage = [];
    // 是否设置安全邮箱
    if(!user.email){
      newMessage.push('noEmail')
    }
    const usermenu = (
      <div style={{ padding: 10, borderRadius: 5, backgroundColor: "#fff" }}>
        <h4 style={{ paddingLeft: 16 }}>{user.nickname || user.username}</h4>
        <Menu
          style={{ border: "none" }}
          onClick={({ key }) => {
            let path = key;
            if (["/iq", "/answer"].includes(key)) {
              path += `?userid=${user._id}`;
            }
            this.goto(path);
          }}
        >
          <Menu.Item key="/mine">
            <Badge count={newMessage.length}>
              <Icon type="profile" />
              个人中心
            </Badge>
          </Menu.Item>
          <Menu.Item key="/mine/iq">
            <Icon type="unordered-list" />
            我的面试题
          </Menu.Item>
          <Menu.Item key="/mine/answer">
            <Icon type="pushpin" />
            我的回答
          </Menu.Item>
          <Menu.Item key="/mine/focus">
            <Icon type="heart" />
            我的收藏
          </Menu.Item>
        </Menu>
        <Button type="primary" size="small" ghost block onClick={logout}>
          退出
        </Button>
      </div>
    );
    const searchPage = location.pathname === '/search';
    if(searchPage&&!keyword){
      keyword = location.search.match(/(?<=keyword\=).+/);
      keyword = keyword ? decodeURI(keyword[0]):'';
    }
    return (
      <Layout style={Styles.container}>
        <Header style={{ padding: "0 10px" }}>
          <Row>
            <Col span={searchPage?2:4}>
              <div
                className="logo"
                title="面试宝典，助你拿下offer！"
                onClick={this.goto.bind(this, "/home")}
              >
                <Icon
                  type="crown"
                  style={{
                    fontSize: 36,
                    margin: "0 8px 10px 0",
                    verticalAlign: "middle"
                  }}
                />
                <h1>面试宝典</h1>
              </div>
            </Col>
            <Col span={searchPage?2:14}>
              <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={current}
                style={{ lineHeight: "64px" }}
                onClick={this.changeMenu}
              >
                {menu.map(item => {
                  return (
                    <Menu.Item title={item.name} key={item.path}>
                      {item.text}
                    </Menu.Item>
                  );
                })}
              </Menu>
            </Col>
            <Col span={searchPage?17:3}>
              {
                searchPage ? 
                <Input.Search
                  placeholder="输入关键字查找面试题"
                  // enterButton="查找"
                  size="small"
                  value={keyword}
                  onChange={this.changeKeyword}
                  onSearch={keyword => {
                    this.goto(`/search?keyword=${keyword}`)
                  }}
                  style={{verticalAlign:'middle'}}
                />
                :
                <Tooltip placement="topLeft" title="搜索面试题">
                  <Button
                    type="link"
                    size="large"
                    shape="circle"
                    icon="search"
                    style={{ color: "#fff" }}
                    onClick={this.goto.bind(this, "/search")}
                  />
                </Tooltip>
              }
            </Col>
            <Col span={3} style={{ textAlign: "right",color:'#1890ff',height:64 }}>
              {user.username ? (
                <Dropdown overlay={usermenu} placement="bottomRight" onClick={this.goto.bind(this,'/mine')}>
                 <Badge dot={newMessage.length>0}>
                  <Avatar
                    icon="user"
                    src={baseurl + user.avatar}
                    style={{
                      border: "2px solid #fff",
                      padding: 1,
                      backgroundColor: "#f90"
                    }}
                  />
                  </Badge>
                </Dropdown>
              ) : (
                <Button.Group size="small">
                  <Button type="link" onClick={this.goto.bind(this, "/login")}>
                    登录
                  </Button>
                  <Button type="link" onClick={this.goto.bind(this, "/reg")}>
                    注册
                  </Button>
                </Button.Group>
              )}
            </Col>
          </Row>
        </Header>
        <Content
          style={Styles.content}
          id="content"
          ref={el => (this.Content = el)}
        >
          {/* 传递节点到InfiniteList */}
          <MyContext.Provider value={{ Content: this.Content }}>
            {breadcrumb.length>1 ? <MyBreadcrumb data={breadcrumb} /> : null}
            <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
              <Suspense
                fallback={
                  <Spin
                    indicator={
                      <Icon type="loading" style={{ fontSize: 24 }} spin />
                    }
                  />
                }
              >
                <Switch>
                  <Route path="/home" component={Home} />
                  <Redirect from="/" to="/home" exact />
                  <Route path="/random" component={Random} />
                  <Route path="/section" component={Section} />
                  <Route path="/add" component={Add} />
                  <Route path="/mine" component={Mine} />
                  <Route path="/search" component={Search} />
                  <Route path="/iq" component={List} exact />
                  <Route path="/iq/:id" component={Details} />
                  <Route path="/reg" component={Reg} />
                  <Route path="/login" component={Login} />
                  <Route path="/company" component={Company} />
                  <Route path="/tags" component={Tags} />
                  <Route
                    path="/forgotpassword"
                    component={ForgotPassword}
                  />
                  <Route
                    path="/resetpassword"
                    component={ResetPassword}
                  />
                  <Route render={() => <div>404</div>} />
                </Switch>
              </Suspense>
            </div>
          </MyContext.Provider>
        </Content>
        {
          showFooter?
          <Footer style={{ textAlign: "center",fontSize:12 }}>
            &copy; 千锋 &bull; 广州H5 &nbsp; 
            <a style={{color:'#999'}} href="http://www.beian.gov.cn/portal/registerSystemInfo" target="_blank">粤ICP备19149048号</a>
          </Footer>
          :
          null
        }
      </Layout>
    );
  }
}

// App = withRouter(App);

export default App;
