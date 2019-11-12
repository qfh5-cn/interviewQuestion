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
  process.env.NODE_ENV === "production"
    ? process.env.NODE_ENV === "test"
      ? "http://52.198.113.252:3000" //测试环境
      : "http://120.76.247.5" //生产环境
    : "http://localhost:3000"; // 开发环境

export const apiurl = baseurl + "/api"; // 开发环境
