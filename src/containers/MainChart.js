// 图表父组件
import React, { Component } from 'react'
import { Tabs } from 'antd'
import RoomChart from '../components/RoomChart'
import ProductChart from '../components/ProductChart'

const TabPane = Tabs.TabPane

class MainChart extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return(
            <Tabs defaultActiveKey="1">
                <TabPane tab="产品维度" key="1">
                    <ProductChart></ProductChart>
                </TabPane>
                <TabPane tab="发行部维度" key="2">
                    <RoomChart></RoomChart>
                </TabPane>
            </Tabs>
        )
    }
}

export default MainChart