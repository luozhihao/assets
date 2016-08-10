import { GETPRODUCTS, GETHOSTS, GETLIST, DELETELIST, UPDATEPATH, CLEARLIST, SAVELOG, CLEARLOG} from '../constants' 
import 'whatwg-fetch'  // 引入fetch来进行Ajax

// 创建对象时设置初始化信息
const headers = new Headers()

// 设置请求头
headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

// 获取产品列表
export const setProducts = data => {
    return {
        type: GETPRODUCTS,
        products: data,
    }
}

// 获取拉取列表
export const setList = data => {
    return {
        type: GETLIST,
        arr: data
    }
}

// 获取IP列表
export const setHosts = data => {
    return {
        type: GETHOSTS,
        hosts: data
    }
}

// 删除列表
export const deleteList = i => {
    return {
        type: DELETELIST,
        index: i
    }
}

// 清空列表
export const clearList = () => {
    return {
        type: CLEARLIST
    }
}

// 更新路径
export const updatePath = (value, i) => {
    return {
        type: UPDATEPATH,
        value: value,
        index: i
    }
}

// 存储日志列表
export const saveLog = (param) => {
    return {
        type: SAVELOG,
        data: param
    }
}

// 清空日志
export const clearLog = () => {
    return {
        type: CLEARLOG
    }
}

// 获取产品下拉框数据
export function getSelects() {
    return (dispatch, getState) => {
        return dispatch(fetchProducts())
    }
}

// 获取ip下拉框数据
export function getHosts(product) {
    return (dispatch, getState) => {
        return dispatch(fetchHosts(product))
    }
}

function fetchProducts() {
    return dispatch => {
        let request = new Request('/get_user_products/', {
            headers,
            method: 'POST',
            credentials: 'include' // 添加cookies
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                dispatch(setProducts(data))
            })
    }
}

function fetchHosts(product) {
    return dispatch => {
        let request = new Request('/get_ips_by_product/', {
            headers,
            method: 'POST',
            credentials: 'include',
            body: `product=${product}`
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                dispatch(setHosts(data))
            })
    }
}
