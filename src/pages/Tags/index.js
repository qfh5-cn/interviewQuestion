import React, { Component } from "react";
import { PageHeader } from "antd";
import Api from "@/api";
import ReactWordcloud from "react-wordcloud";

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
      console.log(word, event);
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
    element.setAttribute('text-decoration',isActive ? "underline" : "none");
    };
  };

  render() {
    let { taglist } = this.state;
    let { history } = this.props;
    const callbacks = {
      onWordClick: this.getCallback("onWordClick"),
      onWordMouseOut: this.getCallback("onWordMouseOut"),
      onWordMouseOver: this.getCallback("onWordMouseOver")
    };
    return (
      <div>
        <PageHeader
          style={{ paddingLeft: 0 }}
          onBack={() => {
            history.goBack();
          }}
          title="Tag标签"
          subTitle={<>热门tag标签</>}
        />
        <ReactWordcloud
          options={{
            rotations: 3,
            rotationAngles: [],
            fontSizes: [10, 40]
          }}
          words={taglist}
          callbacks={callbacks}
        />
      </div>
    );
  }
}

export default Tags;
