import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux' 
import update from './count'
import list from './list'

export default combineReducers({
    update,
    list,
    routing: routerReducer
})