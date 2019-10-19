import React, { Component } from "react";
import { Spin, Tag, Icon, List } from "antd";
import Api from "@/api";
import qs from "querystring";
import {withUser} from '@/utils/hoc'
import InfiniteScroll from 'react-infinite-scroller';

@withUser
class InfiniteList extends Component {
  state = {
    category: [],
    data: [],
    page:1,
    size:15,
    loading: false,
    hasMore: true
  };
  componentDidMount() {
    // this.getData();
  }
  shouldComponentUpdate(nextProps){
    let {location:{pathname},user:{_id}} = this.props;
    let {location:{pathname:nextPathname},user:{_id:next_id}} = nextProps

    // console.log('should.pathname',pathname,nextPathname)
    // console.log('should.id',_id,next_id)
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

    // 添加条件判断，避免死循环
    if(pathname != nextPathname){
      this.getData()
    }
  }
  getData = async ()=>{
    let {data,page,size} = this.state;
    let { user,location:{search,pathname}} = this.props;
    let paths = pathname.split(/\b(?=\/)/)
    pathname = paths[paths.length>1?1:0];
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


    this.setState({
      loading:true
    })

    let { data:newData } = await Api.get(pathname, { ...params,page,size });
    //获取分类
    // let { data: category } = await Api.get("/category");
    this.setState({
      // category,
      page:page+1,
      data:data.concat(newData.result),
      hasMore:(data.length+newData.result.length)<newData.total,
      loading:false
    });
  }
  render() {
    let { data, loading, hasMore, category,page } = this.state;
    let { history,location:{pathname} } = this.props;
    let paths = pathname.split(/\b(?=\/)/)
    pathname = paths[paths.length>1?1:0];
    return (
        <InfiniteScroll
        pageStart={0}
        loadMore={this.getData}
        hasMore={!loading && hasMore}
        loader={<Spin key={page} tip="loading" size="large" indicator={<Icon type="loading" style={{ fontSize: 30 }} spin />}/>}
        >
        <List
          dataSource={data}
          renderItem={(item, idx) => (
            <List.Item 
            key={item._id} 
            actions={[<Icon type="right" />]}
            onClick={()=>{
              let id = ['/iq','/focus'].includes(pathname) ? item._id : item.iqid
              history.push(`/iq/${id}`)
            }}
            >
              {/* {['/iq','/focus'].includes(pathname) ? ( */}
                <List.Item.Meta
                  title={<><Icon type="link" style={{color:'#ccc',marginRight:5}} /> {item.question||item.content}</>}
                  description={
                    <div style={{paddingLeft:22}}>
                    {item.tags && item.tags.map(tag => <Tag>{tag}</Tag>)}
                    <div>{item.iq&&"@" + item.iq.question}</div>
                    </div>
                  }
                />
              {/* ) : (
                <List.Item.Meta
                  title={<><Icon type="link" style={{color:'#ccc',marginRight:5}} /> {item.content}</>}
                  description={item.iq&&"@" + item.iq.question}
                />
              )} */}

              {/* <Button size="small" type="dashed" disabled>{category.filter(cat=>cat.code==item.category)[0].name}</Button> */}
            </List.Item>
          )}
        >
          {/* {loading && hasMore && (
            <div className="demo-loading-container">
              <Spin />
            </div>
          )} */}
        </List>
        </InfiniteScroll>
    );
  }
}

export default InfiniteList;
