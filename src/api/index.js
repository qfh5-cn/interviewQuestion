import axios,{CancelToken} from 'axios';
// const CancelToken = axios.CancelToken;
// const source = CancelToken.source();console.log('source',source)
let pending = {};

const apiserver = axios.create({
    // cancelToken: source.token,
    // baseURL:'http://localhost:3000',
    baseURL:'http://192.168.0.105:3000',
})

export async function get(url,params,config={}){
    let {data} = await apiserver.get(url,{
        ...config,
        params,
        cancelToken:new CancelToken(c=>{
            pending[`get_${url}`] = c;
        })
    });
    return data;
}

export async function post(url,params){
    let {data} = await apiserver.post(url,params);

    return data;
}

export async function patch(url,params){
    let {data} = await apiserver.patch(url,params);

    return data;
}

export async function remove(url,params){
    let {data} = await apiserver.delete(url,params);

    return data;
}

// 取消请求发送
export function cancel(key,msg='Cancel request by user!'){
    // source.cancel(msg);
    if(typeof pending[key] === 'function'){
        pending[key](msg);
        delete pending[key];
    }
    console.log('pending:',pending)
}

export default {
    post,
    remove,
    patch,
    get,
    cancel
}