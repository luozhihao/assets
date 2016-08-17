import React, { Component } from 'react'
import Highcharts from 'highcharts'
import { Form, Button, Select, Tabs } from 'antd'
import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

// 创建对象时设置初始化信息
const headers = new Headers()

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option
const ButtonGroup = Button.Group

class RoomChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            view1: true,
            view2: false,
            view3: false,
            years: [],
            yearView2: '',
            monthView2: [],
            releases: [],
            releases2: '',
            typeView2: '',
            areaView2: [],
            releases3: '',
            monthView3: [],
            products: [],
            productView3: '',
            areaView3: []
        }
    }

    componentDidMount = () => {
        this.getView2()
        this.showView1()
    }

    // 获取查询条件
    getView2 = () => {
        let request = new Request('/chart/release_index/', {
            headers,
            method: 'GET',
            credentials: 'include'
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                this.setState({years: data.years, releases: data.releases})
            })
    }

    // 渲染view1
    showView1 = () => {
        let request = new Request('/chart/release_index/', {
            headers,
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({yearMonth: this.props.form.getFieldValue('year')})
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                this.randerChart('roomTotal', '发行部成本率', '成本率', 10, '%', data.overview, 1, '可点击', 'overview')
            })
    }

    // 渲染view2
    showView2 = (event, type) => {
        if (event) {
            this.setState({
                monthView2: this.props.form.getFieldValue('year'), 
                releases2: event.category,
                typeView2: type,
                view1: false, 
                view2: true
            })

            this.props.form.setFieldsValue({month2: []})
        }

        let request = new Request('/chart/release_detail/', {
            headers,
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                yearMonth: this.state.monthView2, 
                release: this.state.releases2,
                area: this.props.form.getFieldValue('area2'), 
                type: this.state.typeView2
            })
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                this.randerChart('roomProduct', '发行部成本率', '成本率', 10, '%', data.overview, 2, '不可点击')
                this.randerChart('roomIncome', '发行部收入', '金额', null, '元', data.income, 2, '不可点击')
                this.randerChart('roomPay', '发行部支出', '金额', null, '元', data.expenditure, 2, '可点击')
            })
    }

    // 渲染view3
    showView3 = (event) => {
        if (event) {
            this.setState({
                releases3: this.state.releases2,
                productView3: event.category,
                monthView3: this.state.monthView2,
                areaView3: this.props.form.getFieldValue('area2'),
                view1: false, 
                view2: false,
                view3: true
            })

            this.getProducts(this.state.releases2, 'first')
        }

        let request = new Request('/chart/release_expenditure/', {
            headers,
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                release: this.state.releases3,
                yearMonth: this.state.monthView3, 
                product: this.state.productView3,
                area: this.state.areaView3,
                type: this.state.typeView2
            })
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                this.randerChart('roomPayDetails', '支出明细', '金额', null, '元', data.expenditure, 3, '不可点击')
            })
    }

    // 选择change
    releaseChange = (value) => {
        this.setState({releases2: value})
    }

    monthChange = (value) => {
        this.setState({monthView2: value})
    }

    monthChange3 = (value) => {
        this.setState({monthView3: value})
    }

    releaseChange3 = (value) => {
        this.setState({releases3: value})

        this.getProducts(value)
    }

    productChange3 = (value) => {
        this.setState({productView3: value})
    }

    areaChange3 = (value) => {
        this.setState({areaView3: value})
    }

    // 动态获取产品
    getProducts = (value, type) => {
        let request = new Request('/get_products_by_release/', {
            headers,
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                release: value
            })
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                type === 'first' ? this.setState({products: data}) : this.setState({products: data, productView3: data[0]})
            })
    } 

    // 返回view
    backView1 = () => {
        this.setState({view1: true, view2: false})
    }

    backView2 = () => {
        this.setState({view1: false, view2: true, view3: false})
    }

    // 绘图方法
    randerChart = (chartId, title, yName, yMax, unit, data, level, clickable, type) => {
        var _this = this

        var chart = new Highcharts.Chart({
            chart: {
                zoomType: 'y',
                renderTo: chartId,
                type: 'column'
            },
            title: {
                text: title
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: data.categories
            },
            yAxis: {
                min: 0,
                max: yMax,
                title: {
                    text: yName
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.2f} ' + unit + '（' + clickable +'）</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function(event) {
                                if (clickable === '可点击') {
                                    switch (level) {
                                        case 1:
                                            _this.showView2(event.point, type)
                                            break
                                        case 2:
                                            _this.showView3(event.point)
                                            break
                                    }
                                }
                            }
                        }
                    },
                    dataLabels: {
                        rotation: -90,
                        inside: true,
                        enabled: true,
                        color: '#fff',
                        style: {
                            fontFamily: 'Verdana, sans-serif',
                            textShadow: '0 0 3px black'
                        },
                        formatter: function() {
                            return this.y > 10000 ? (this.y / 10000).toFixed(2) + ' 万元' : this.y.toFixed(2) + ' ' + unit
                        }
                    }
                }
            },
            series: data.data
        })
    }

    render() {
        const { getFieldProps } = this.props.form

        return(
            <div>
                <Form inline>
                    <div className={`${this.state.view1 ? 'show' : 'hide'}`}>
                        <FormItem
                            label="年月"
                        >
                            <Select
                                {...getFieldProps('year')}
                                multiple
                                allowClear
                                style={{ width: 150 }}
                                placeholder="请选择"
                            >
                                { this.state.years.map((e, i) =>
                                    <Option value={e} key={i}>{e}</Option>
                                )}
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" onClick={this.showView1.bind(this)}>查询</Button>
                        </FormItem>
                    </div>
                    <div className={`${this.state.view2 ? 'show' : 'hide'}`}>
                        <FormItem
                            label="发行部"
                        >
                            <Select 
                                {...getFieldProps('releases2')}
                                style={{ width: 150 }}
                                value={this.state.releases2}
                                onChange={this.releaseChange}
                            >
                                {
                                    this.state.releases.map((e, i) => 
                                        <Option value={e} key={i}>{e}</Option>
                                    )
                                }
                            </Select>
                        </FormItem>
                        <FormItem
                            label="年月"
                        >
                            <Select 
                                {...getFieldProps('month2')}
                                multiple
                                allowClear 
                                style={{ width: 150 }}
                                value={this.state.monthView2}
                                onChange={this.monthChange}
                            >   
                                {
                                    this.state.years.map((e, i) =>
                                        <Option value={e} key={i}>{e}</Option>
                                    )
                                }
                            </Select>
                        </FormItem>
                        <FormItem
                            label="区域"
                        >
                            <Select 
                                {...getFieldProps('area2')}
                                multiple 
                                allowClear
                                style={{ width: 150 }}
                            >
                                <Option value="国内">国内</Option>
                                <Option value="海外">海外</Option>
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" onClick={this.showView2.bind(this, false)}>查询</Button>
                            &nbsp;&nbsp;
                            <Button onClick={this.backView1}>返回</Button>
                        </FormItem>
                    </div>
                    <div className={`${this.state.view3 ? 'show' : 'hide'}`}>
                        <FormItem
                            label="发行部"
                        >
                            <Select 
                                {...getFieldProps('releases3')}
                                style={{ width: 150 }}
                                value={this.state.releases3}
                                onChange={this.releaseChange3}
                            >
                                {
                                    this.state.releases.map((e, i) => 
                                        <Option value={e} key={i}>{e}</Option>
                                    )
                                }
                            </Select>
                        </FormItem>
                        <FormItem
                            label="产品"
                        >
                            <Select 
                                {...getFieldProps('product3')}
                                style={{ width: 150 }} 
                                value={this.state.productView3}
                                onChange={this.productChange3}
                            >
                                {
                                    this.state.products.map((e, i) => 
                                        <Option value={e} key={i}>{e}</Option>
                                    )
                                }
                            </Select>
                        </FormItem>
                        <FormItem
                            label="年月"
                        >
                            <Select 
                                {...getFieldProps('month3')}
                                multiple
                                allowClear 
                                style={{ width: 150 }}
                                value={this.state.monthView3}
                                onChange={this.monthChange3}
                            >   
                                {
                                    this.state.years.map((e, i) =>
                                        <Option value={e} key={i}>{e}</Option>
                                    )
                                }
                            </Select>
                        </FormItem>
                        <FormItem
                            label="区域"
                        >
                            <Select 
                                {...getFieldProps('area3')}
                                multiple 
                                allowClear
                                style={{ width: 150 }}
                                value={this.state.areaView3}
                                onChange={this.areaChange3}
                            >
                                <Option value="国内">国内</Option>
                                <Option value="海外">海外</Option>
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" onClick={this.showView3.bind(this, false)}>查询</Button>
                            &nbsp;&nbsp;
                            <Button onClick={this.backView2}>返回</Button>
                        </FormItem>
                    </div>
                </Form>
                <div className={`${this.state.view1 ? 'show' : 'hide'}`}>
                    <div id="roomTotal" className="chart-box"></div>
                </div>
                <div className={`${this.state.view2 ? 'show' : 'hide'}`}>
                    <div id="roomProduct" className="chart-box"></div>
                    <div id="roomIncome" className="chart-box"></div>
                    <div id="roomPay" className="chart-box"></div>
                </div>
                <div className={`${this.state.view3 ? 'show' : 'hide'}`}>
                    <div id="roomPayDetails" className="chart-box"></div>
                </div>
            </div>
        )
    }
}

RoomChart = Form.create()(RoomChart)

export default RoomChart