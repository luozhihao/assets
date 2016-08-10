import { GETLIST, DELETELIST, UPDATEPATH, CLEARLIST, SAVELOG, CLEARLOG } from '../constants'

// 初始化state数据
const initialState = {
    lists: [],
    update: false, // 强制render
    logs: []
}

export default function list(state = initialState, action) {
    switch(action.type) {
        case GETLIST:
            return Object.assign({}, state, { lists: state.lists.concat(action.arr)})
            break
        case DELETELIST:
            state.lists.splice(action.index, 1)

            return Object.assign({}, state, { lists: state.lists, update: !state.update })
        case UPDATEPATH:
            state.lists[action.index].path = action.value

            return Object.assign({}, state, { lists: state.lists, update: !state.update })
        case CLEARLIST: 
            return Object.assign({}, state, { lists: [] })
        case SAVELOG:
            return Object.assign({}, state, { logs: action.data })
        case CLEARLOG:
            return Object.assign({}, state, { logs: [] })
        default:
            return state
    }
}