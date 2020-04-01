import React, { Component } from "react";
import { PageHeader, Badge, Row, Col } from "antd";
import Api from "@/api";
// import ReactWordcloud from "react-wordcloud";

class Tags extends Component {
  state = {
    taglist: []
  };
  async componentDidMount() {
    let { data } = await Api.get("/iq/tags");

    this.setState({ taglist: data });
  }
  getCallback = type => {
    let { history } = this.props;
    return function(word, event) {
      const isActive = type !== "onWordMouseOut";
      const element = event.target;
      element.onclick = () => {
        if (isActive) {
          history.push(`/iq?tag=${word.text}`);
        }
      };
      //   element.style.cssText = `
      //  background-color:#fff;
      //  font-size=${isActive ? "300%" : "100%"};
      //  text-decoration=${isActive ? "underline" : "none"};
      //  `;
      // element.setAttribute('transition',"all 0.5s")
      // element.setAttribute('background-color',"white");
      // element.setAttribute('font-size',isActive ? "300%" : "100%");
      element.setAttribute("text-decoration", isActive ? "underline" : "none");
    };
  };

  render() {
    let { taglist } = this.state;
    let { history } = this.props;
    // const callbacks = {
    //   onWordClick: this.getCallback("onWordClick"),
    //   onWordMouseOut: this.getCallback("onWordMouseOut"),
    //   onWordMouseOver: this.getCallback("onWordMouseOver")
    // };
    return (
      <div class="taglist">
        <PageHeader
          style={{ paddingLeft: 0 }}
          onBack={() => {
            history.goBack();
          }}
          title="Tag标签"
          subTitle={<>热门tag标签</>}
        />
        {/* <ReactWordcloud
          options={{
            rotations: 3,
            rotationAngles: [],
            fontSizes: [10, 40]
          }}
          words={taglist}
          callbacks={callbacks}
        /> */}
        <Row gutter={[10, 10]}>
          {taglist.map(item => (
            <Col xs={12} sm={8} md={6} lg={4} key={item.text} onClick={()=>{
              history.push(`/iq?tag=${item.text}`);
            }}>
              <a>{item.text}（{item.value}）</a>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

export default Tags;
