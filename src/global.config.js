export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
export const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 18,
      offset: 6
    }
  }
};

export const baseurl =
  process.env.NODE_ENV === "development" ? 
    "http://localhost:3000" // 开发环境(api服务器与web服务器分开)
    : 
    (
      process.env.NODE_ENV === "test" ? 
      "http://52.198.113.252:3000" //UAT
      : 
      "" //"http://120.76.247.5:21212" //生产环境(apiServer与webServer放一起，不需要写域名 
    ); 

export const apiurl = baseurl + "/api"; // 开发环境
