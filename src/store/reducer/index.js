import {combineReducers} from 'redux'
import commonReducer from './common'

const allReducer = {
    common:commonReducer
}

export default combineReducers(allReducer);