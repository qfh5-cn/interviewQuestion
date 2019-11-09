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

export const apiurl= 
// process.env.BUILD_ENV==='production'?
// 'http://52.198.113.252:3000'
// :
"http://localhost:3000"

console.log('process.env',process.env)