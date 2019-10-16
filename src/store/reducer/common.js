import {LOGIN,LOGOUT,UPDATE_USER_INFO,CHANGE_BREADCRUMB_PATH,SHOW_BREADCRUMB} from '../action/common';
import Immutable,{Map,List} from 'immutable';

let initState = Map({
    breadcrumb:List([]),
    user:Map({})
})

// 刷新后，redux数据丢失，从localStorage中重新获取
if(!initState.hasIn(['user','_id'])){
    let user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if(user) user = JSON.parse(user);
    initState = initState.update('user',()=>Map(user));
    // console.log('local 2 state:',initState.toJS())
}

function commonReducer(state=initState,action){
    switch(action.type){
        case LOGIN:
            // return state.set('user',Map(action.user));
            window[action.user.session?'sessionStorage':'localStorage'].setItem('user',JSON.stringify(action.user));
            return state.update('user',()=>Map(action.user));
        case LOGOUT:
            // return state.set('user',Map({}))
            localStorage.removeItem('user');
            return state.update('user',()=>(Map({})));
        
        case UPDATE_USER_INFO:
            let Authorization = state.getIn(['user','Authorization'])
            let newData = {Authorization,...action.user}
            localStorage.setItem('user',JSON.stringify(newData));
            return state.update('user',()=>Map(newData));

        case CHANGE_BREADCRUMB_PATH:
            return state.update('breadcrumb',()=>List(action.path));
        default:
            return state;
    }
}

export default commonReducer;