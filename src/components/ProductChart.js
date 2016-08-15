import React, { Component } from 'react'
import Highcharts from 'highcharts'
import 'whatwg-fetch'
import { Form, Button, Select, Tabs } from 'antd'

// 创建对象时设置初始化信息
const headers = new Headers()

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option
const ButtonGroup = Button.Group

class ProductChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            years: [],
            rooms: [],
            products: [],
            yearView2: '',
            monthView2: [],
            typeView2: '',
            areaView2: [],
            monthView3: [],
            productView3: '',
            areaView3: [],
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
            body: JSON.stringify({year: this.props.form.getFieldValue('year'), area: this.props.form.getFieldValue('area1')})
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                this.randerChart('costTotal', '总成本率', '成本率', 10, '%', data.overview, 1, '可点击', 'overview')
                this.randerChart('costGame', '游戏成本率', '成本率', 10, '%', data.game, 1, '可点击', 'game')
                this.randerChart('costMoblie', '移动成本率', '成本率', 10, '%', data.mobile, 1, '可点击', 'mobile')
                this.randerChart('costVR', 'VR成本率', '成本率', 10, '%', data.vr, 1, '可点击', 'vr')
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
                this.setState({years: data.years, products: data.products})
            })
    }

    // 渲染view2
    showView2 = (event, type) => {
        if (event) {
            this.setState({
                yearView2: event.series.name,
                monthView2: [event.category],
                typeView2: type,
                areaView2: this.props.form.getFieldValue('area1'),
                view1: false, 
                view2: true
            })

            this.props.form.setFieldsValue({product2: []})
        }

        let request = new Request('/chart/product_detail/', {
            headers,
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                year: this.state.yearView2, 
                month: this.state.monthView2, 
                area: this.state.areaView2, 
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
            })
    }

    // 渲染view3
    showView3 = (event) => {
        if (event) {
            this.setState({
                productView3: event.category,
                monthView3: this.state.monthView2,
                areaView3: this.state.areaView2,
                view1: false, 
                view2: false,
                view3: true
            })
        }

        let request = new Request('/chart/product_expenditure/', {
            headers,
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                year: this.state.yearView2, 
                month: this.state.monthView3, 
                area: this.state.areaView3, 
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

    // 选择change
    monthChange = (value) => {
        this.setState({monthView2: value})
    }

    areaChange = (value) => {
        this.setState({areaView2: value})
    }

    monthChange3 = (value) => {
        this.setState({monthView3: value})
    }

    areaChange3 = (value) => {
        this.setState({areaView3: value})
    }

    productChange3 = (value) => {
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
                    '<td style="padding:0"><b>{point.y:.1f} ' + unit + '（' + clickable +'）</b></td></tr>',
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
                            label="年份"
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
                        <FormItem
                            label="区域"
                        >
                            <Select 
                                {...getFieldProps('area1')}
                                multiple 
                                allowClear
                                style={{ width: 150 }} 
                            >
                                <Option value="国内">国内</Option>
                                <Option value="海外">海外</Option>
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
                                onChange={this.monthChange}
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
                            label="区域"
                        >
                            <Select 
                                {...getFieldProps('area2')}
                                multiple 
                                allowClear
                                style={{ width: 150 }}
                                value={this.state.areaView2}
                                onChange={this.areaChange}
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
                <div className={`'chartGroup' ${this.state.view1 ? 'show' : 'hide'}`}>
                    <div id="costTotal" className="chart-box"></div>
                    <div id="costGame" className="chart-box"></div>
                    <div id="costMoblie" className="chart-box"></div>
                    <div id="costVR" className="chart-box"></div>
                </div>
                <div className={`'chartGroup' ${this.state.view2 ? 'show' : 'hide'}`}>
                    <div id="costProduct" className="chart-box"></div>
                    <div id="income" className="chart-box"></div>
                    <div id="pay" className="chart-box"></div>
                </div>
                <div className={`'chartGroup' ${this.state.view3 ? 'show' : 'hide'}`}>
                    <div id="payDetails" className="chart-box"></div>
                </div>
            </div>
        )
    }
}

ProductChart = Form.create()(ProductChart)

export default ProductChart

