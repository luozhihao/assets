import { GETPRODUCTS, GETHOSTS } from '../constants'

// 初始化state数据
const initialState = {
    products: [],
    ips: []
}

export default function update(state = initialState, action) {
    switch(action.type) {
        case GETPRODUCTS:
            return Object.assign({}, state, { products: action.products })
            break
        case GETHOSTS:
            return Object.assign({}, state, { ips: action.hosts })
            break
        default:
            return state
    }
}