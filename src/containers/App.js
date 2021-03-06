import React, { Component } from 'react'
import { render } from 'react-dom'
import { Link, IndexLink} from 'react-router'
import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

import { Menu, Icon, Tooltip } from 'antd'
const SubMenu = Menu.SubMenu

// 创建对象时设置初始化信息
const headers = new Headers()

// 配置导航
export default class Sider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            current: '',
            username: ''
        }
    }

    handleClick = (e) => {
        this.setState({
            current: e.key
        })
    }

    componentDidMount() {
        this.getUser()
    }

    // 获取用户名
    getUser = () => {
        let request = new Request('/userinfo/', {
            headers,
            method: 'POST',
            credentials: 'include'
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                this.setState({
                    username: data.username
                })
            })
    }

    // 退出
    logout = () => {
        let request = new Request('/logout/', {
            headers,
            method: 'POST',
            credentials: 'include'
        })

        fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                location.href="/"
            })
    }

    render() {
        return (
            <div>
                <div id="leftMenu">
                    {/*<div id="logo">
                        IDC成本核算系统
                    </div> */}
                    <Menu theme="dark"
                        onClick={this.handleClick}
                        style={{ width: 50 }}
                        defaultOpenKeys={['sub1', 'sub2']}
                        defaultSelectedKeys={[this.state.current]}
                        mode="inline"
                    >
                        <SubMenu key="sub1">
                            {/*<Menu.Item key="1">
                                <Tooltip placement="right" title="统计表格">
                                    <Link to="/MyTable">
                                        <Icon type="bar-chart" />
                                    </Link>
                                </Tooltip>
                            </Menu.Item>*/}
                            <Menu.Item key="2">
                                <Tooltip placement="right" title="统计图表">
                                    <Link to="/MainChart">
                                        <Icon type="area-chart" />
                                    </Link>
                                </Tooltip>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Tooltip placement="right" title="数据导入">
                                    <Link to="/Import">
                                        <Icon type="upload" />
                                    </Link>
                                </Tooltip>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div id="rightWrap">
                    <Menu mode="horizontal">
                        <SubMenu title={<span><Icon type="user" />{ this.state.username }</span>}>
                            <Menu.Item key="setting:1">
                                <div className="text-center" onClick={this.logout}>退出</div>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                    <div className="right-box">
                        { this.props.children }
                    </div>
                </div>
            </div>
        )
    }
}