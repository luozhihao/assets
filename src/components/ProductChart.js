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

const areaData1 = ['中国']
const areaData2 = ['北美', '俄罗斯', '华人', '东南亚', '日本', '台湾', '韩国', '欧州']

class ProductChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            years: [],
            yearView1: [],
            areaView1: '',
            areaView12: [],
            areaLists: [],
            products: [],
            yearView2: '',
            monthView2: [],
            typeView2: '',
            areaView2: '',
            areaView22: [],
            areaLists2: [],
            monthView3: [],
            productView3: '',
            areaView3: '',
            areaView32: [],
            areaLists3: [],
            view1: true,
            view2: false,
            view3: false
        }
    }

    componentDidMount = () => {
        this.getView()
        this.showView1()
    }

    // 渲染view1
    showView1 = () => {
        let request = new Request('/overview/', {
            headers,
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                year: this.state.yearView1, 
                region: this.state.areaView1 ? [this.state.areaView1] : [], 
                area: this.state.areaView12
            })
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                this.randerChart('costTotal', '总成本率', '成本率', 10, '%', data.overview, 1, '可点击', 'overview')
                this.randerChart('costGame', '游戏成本率', '成本率', 10, '%', data.game, 1, '可点击', 'game')
                this.randerChart('costMoblie', '移动成本率', '成本率', 10, '%', data.mobile, 1, '可点击', 'mobile')
                this.randerChart('costVR', 'VR成本率', '成本率', 10, '%', data.vr, 1, '可点击', 'vr', false)
            })
    }

    // 查询条件
    getView = () => {
        let request = new Request('/overview/', {
            headers,
            method: 'GET',
            credentials: 'include'
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                this.setState({years: data.years})
            })
    }

    // 渲染view2
    showView2 = (event, type) => {
        if (event) {
            this.setState({
                yearView2: this.state.yearView1[0],
                monthView2: [event.category],
                typeView2: type,
                areaView2: this.state.areaView1,
                areaView22: this.state.areaView12,
                view1: false, 
                view2: true
            })

            this.areaGet(this.state.areaView1, {areaLists2: areaData1}, {areaLists2: areaData2})
            this.props.form.setFieldsValue({product2: []})
        }

        let request = new Request('/chart/product_detail/', {
            headers,
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                year: this.state.yearView2, 
                month: this.state.monthView2,
                region: this.state.areaView2 ? [this.state.areaView2] : [],
                area: this.state.areaView22, 
                product: this.props.form.getFieldValue('product2'), 
                type: this.state.typeView2
            })
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                this.randerChart('costProduct', '产品成本率', '成本率', 10, '%', data.overview, 2, '不可点击')
                this.randerChart('income', '产品收入', '金额', null, '元', data.income, 2, '不可点击')
                this.randerChart('pay', '产品支出', '金额', null, '元', data.expenditure, 2, '可点击')
                this.setState({products: data.products})
            })
    }

    // 渲染view3
    showView3 = (event) => {
        if (event) {
            this.setState({
                productView3: event.category,
                monthView3: this.state.monthView2,
                areaView3: this.state.areaView2,
                areaView32: this.state.areaView22,
                view1: false, 
                view2: false,
                view3: true
            })

            this.areaGet(this.state.areaView2, {areaLists3: areaData1}, {areaLists3: areaData2})
        }

        let request = new Request('/chart/product_expenditure/', {
            headers,
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                year: this.state.yearView2, 
                month: this.state.monthView3,
                region: this.state.areaView3 ? [this.state.areaView3] : [],
                area: this.state.areaView32, 
                product: this.state.productView3, 
                type: this.state.typeView2
            })
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                this.randerChart('payDetails', '支出明细', '金额', null, '元', data.expenditure, 3, '不可点击')
            })
    }

    // 时间检测
    dataSet = (value, area, name) => {
        if (value.length > 1 && this.state[name].length) {
            this.setState(area)
        }
    }

    // 区域检测
    areaSet = (value, date, name) => {
        if (value.length && this.state[name].length > 1) {
            this.setState(date)
        }
    }

    // 区域变更
    areaGet = (value, data1, data2) => {
        value === '国内' ? this.setState(data1) : this.setState(data2)
    }

    // 选择change
    yearChange = value => {
        this.setState({yearView1: value})
        this.dataSet(value, {areaView12: []}, 'areaView12')
    }

    areaChange1 = value => {
        this.setState({areaView1: value, areaView12: []})
        this.areaGet(value, {areaLists: areaData1}, {areaLists: areaData2})
    }

    areaChange12 = value => {
        this.setState({areaView12: value})
        this.areaSet(value, {yearView1: []}, 'yearView1')
    }

    monthChange2 = value => {
        this.setState({monthView2: value})
        this.dataSet(value, {areaView22: []}, 'areaView22')
    }

    areaChange2 = value => {
        this.setState({areaView2: value, areaView22: []})
        this.areaGet(value, {areaLists2: areaData1}, {areaLists2: areaData2})
    }

    areaChange22 = value => {
        this.setState({areaView22: value})
        this.areaSet(value, {monthView2: []}, 'monthView2')
    }

    monthChange3 = value => {
        this.setState({monthView3: value})
        this.dataSet(value, {areaView32: []}, 'areaView32')
    }

    areaChange3 = value => {
        this.setState({areaView3: value, areaView32: []})
        this.areaGet(value, {areaLists3: areaData1}, {areaLists3: areaData2})
    }

    areaChange32 = value => {
        this.setState({areaView32: value})
        this.areaSet(value, {monthView3: []}, 'monthView3')
    }

    productChange3 = value => {
        this.setState({productView3: value})
    }

    // 返回view
    backView1 = () => {
        this.setState({view1: true, view2: false})
    }

    backView2 = () => {
        this.setState({view1: false, view2: true, view3: false})
    }

    // 绘图方法
    randerChart = (chartId, title, yName, yMax, unit, data, level, clickable, type, labelInside = true) => {
        var _this = this

        var chart = new Highcharts.Chart({
            chart: {
                zoomType: 'y',
                renderTo: chartId,
                type: 'column'
            },
            colors: ['#7cb5ec', '#f7a35c', '#90ed7d', '#8085e9', '#f15c80', '#e4d354', '#00BCD4', '#8d4653', '#91e8e1', '#009688'],
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
                        rotation: labelInside ? -90 : 0,
                        inside: labelInside,
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
                            label="年份"
                        >
                            <Select
                                {...getFieldProps('year')}
                                multiple
                                allowClear
                                value={this.state.yearView1}
                                style={{ width: 150 }}
                                placeholder="请选择"
                                onChange={this.yearChange}
                            >
                                { this.state.years.map((e, i) =>
                                    <Option value={e} key={i}>{e}</Option>
                                )}
                            </Select>
                        </FormItem>
                        <FormItem
                            label="区域一"
                        >
                            <Select 
                                {...getFieldProps('area1')}
                                value={this.state.areaView1}
                                onChange={this.areaChange1}
                                allowClear
                                style={{ width: 150 }} 
                            >
                                <Option value="国内">国内</Option>
                                <Option value="海外">海外</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            label="区域二"
                        >
                            <Select 
                                {...getFieldProps('area12')}
                                value={this.state.areaView12}
                                onChange={this.areaChange12}
                                allowClear
                                multiple
                                style={{ width: 150 }} 
                            >
                                { 
                                    this.state.areaLists.map((e, i) => 
                                        <Option value={e} key={i}>{e}</Option>
                                    )
                                }
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" onClick={this.showView1.bind(this)}>查询</Button>
                        </FormItem>
                    </div>
                    <div className={`${this.state.view2 ? 'show' : 'hide'}`}>
                        <FormItem
                            label="月份"
                        >
                            <Select 
                                {...getFieldProps('month2')}
                                multiple
                                allowClear 
                                style={{ width: 150 }}
                                value={this.state.monthView2}
                                onChange={this.monthChange2}
                            >   
                                {
                                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((e, i) =>
                                        <Option value={e + '月'} key={i}>{e + '月'}</Option>
                                    )
                                }
                            </Select>
                        </FormItem>
                        <FormItem
                            label="产品"
                        >
                            <Select 
                                {...getFieldProps('product2')}
                                multiple 
                                allowClear
                                style={{ width: 150 }} 
                            >
                                {
                                    this.state.products.map((e, i) => 
                                        <Option value={e} key={i}>{e}</Option>
                                    )
                                }
                            </Select>
                        </FormItem>
                        <FormItem
                            label="区域一"
                        >
                            <Select 
                                {...getFieldProps('area2')}
                                allowClear
                                style={{ width: 150 }}
                                value={this.state.areaView2}
                                onChange={this.areaChange2}
                            >
                                <Option value="国内">国内</Option>
                                <Option value="海外">海外</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            label="区域二"
                        >
                            <Select 
                                {...getFieldProps('area22')}
                                value={this.state.areaView22}
                                onChange={this.areaChange22}
                                allowClear
                                multiple
                                style={{ width: 150 }} 
                            >
                                { 
                                    this.state.areaLists2.map((e, i) => 
                                        <Option value={e} key={i}>{e}</Option>
                                    )
                                }
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
                            label="月份"
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
                                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((e, i) =>
                                        <Option value={e + '月'} key={i}>{e + '月'}</Option>
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
                            label="区域一"
                        >
                            <Select 
                                {...getFieldProps('area3')}
                                allowClear
                                style={{ width: 150 }}
                                value={this.state.areaView3}
                                onChange={this.areaChange3}
                            >
                                <Option value="国内">国内</Option>
                                <Option value="海外">海外</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            label="区域二"
                        >
                            <Select 
                                {...getFieldProps('area32')}
                                value={this.state.areaView32}
                                onChange={this.areaChange32}
                                allowClear
                                multiple
                                style={{ width: 150 }} 
                            >
                                { 
                                    this.state.areaLists3.map((e, i) => 
                                        <Option value={e} key={i}>{e}</Option>
                                    )
                                }
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
                    <div id="costTotal" className="chart-box"></div>
                    <div id="costGame" className="chart-box"></div>
                    <div id="costMoblie" className="chart-box"></div>
                    <div id="costVR" className="chart-box"></div>
                </div>
                <div className={`${this.state.view2 ? 'show' : 'hide'}`}>
                    <div id="costProduct" className="chart-box"></div>
                    <div id="income" className="chart-box"></div>
                    <div id="pay" className="chart-box"></div>
                </div>
                <div className={`${this.state.view3 ? 'show' : 'hide'}`}>
                    <div id="payDetails" className="chart-box"></div>
                </div>
            </div>
        )
    }
}

ProductChart = Form.create()(ProductChart)

export default ProductChart

