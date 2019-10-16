import React, { Component } from "react";
import { Button, Tag, Icon, List } from "antd";
import Api from "@/api";
import qs from "querystring";
import {withUser} from '@/utils/hoc'

@withUser
class InfiniteList extends Component {
  state = {
    category: [],
    data: [],
    loading: false,
    hasMore: true
  };
  componentDidMount() {
    console.log('componentDidMount:',this.props.user.username)
    this.getData();
  }
  shouldComponentUpdate(nextProps){
    let {location:{pathname},user:{_id}} = this.props;
    let {location:{pathname:nextPathname},user:{_id:next_id}} = nextProps

    console.log('should.pathname',pathname,nextPathname)
    console.log('should.id',_id,next_id)
    // if(pathname != nextPathname){
      // this.getData(nextPathname);
    // }
    // if( _id === next_id){
    //   // this.getData(nextPathname,next_id);
    //   return false;
    // }
    return true;
  }
  componentDidUpdate({location:{pathname:nextPathname}}, nextState){
    let {location:{pathname}} = this.props;
    console.log('componentDidUpdate:',pathname,nextPathname);

    // 添加条件判断，避免死循环
    if(pathname != nextPathname){
      this.getData()
    }
  }
  getData = async ()=>{
    let {pathname} = this.props.location;
    let paths = pathname.split(/\b(?=\/)/)
    pathname = paths[paths.length>1?1:0];
    let { user,location:{search}} = this.props;
    let params = qs.parse(search.slice(1));

    // 如来自/mine/xxx，则自动添加userid
    if(paths[0]==='/mine'){
      // userid = userid || user._id;
      if(!user._id) return;
      params.userid = user._id;
    }

    // 如获取答案，则自动获取对应面试题
    if (pathname === "/answer") {
      params.getiqname = 1;
    }else if(pathname === '/focus'){
      pathname = '/iq/byid';
      params.ids = user.focus;
    }



    let { data } = await Api.get(pathname, { ...params });

    //获取分类
    // let { data: category } = await Api.get("/category");
    this.setState({
      // category,
      data
    });
  }
  render() {
    let { data, loading, hasMore, category } = this.state;
    let { history,location:{pathname} } = this.props;
    let paths = pathname.split(/\b(?=\/)/)
    pathname = paths[paths.length>1?1:0];
    return (
      <div style={{ height: "100%", overflowY: "auto" }}>
        <List
          dataSource={data.result}
          renderItem={(item, idx) => (
            <List.Item 
            key={item._id} 
            actions={[<Icon type="right" />]}
            onClick={()=>{
              let id = ['/iq','/focus'].includes(pathname) ? item._id : item.iqid
              history.push(`/iq/${id}`)
            }}
            >
              {['/iq','/focus'].includes(pathname) ? (
                <List.Item.Meta
                  title={`${idx + 1}.${item.question}`}
                  description={
                    item.tags && item.tags.map(tag => <Tag>{tag}</Tag>)
                  }
                />
              ) : (
                <List.Item.Meta
                  title={`${idx + 1}.${item.content}`}
                  description={item.iq&&"@" + item.iq.question}
                />
              )}

              {/* <Button size="small" type="dashed" disabled>{category.filter(cat=>cat.code==item.category)[0].name}</Button> */}
            </List.Item>
          )}
        >
          {loading && hasMore && (
            <div className="demo-loading-container">
              <Spin />
            </div>
          )}
        </List>
      </div>
    );
  }
}

export default InfiniteList;
