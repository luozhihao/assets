import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Select, Tabs, Row, Col} from 'antd'

const TabPane = Tabs.TabPane
const FormItem = Form.Item
const Option = Select.Option
const ButtonGroup = Button.Group

class MyTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showFilter: false,
            tableTitles: [],
            tableLists: []
        }
    }

    showAuto = () => {
        this.setState({
            showFilter: !this.state.showFilter
        })
    }

    showView1 = () => {
        this.setState({
            tableTitles: [
                {value: 'total', label: '合计'},
                {value: 'sum', label: '总计'},
                {value: 'room', label: '工作室'}, 
                {value: 'product', label: '游戏/产品'}, 
                {value: 'area', label: '区域'}, 
                {value: 'company', label: '公司/子公司'}, 
                {value: '6', label: '6月'},
                {value: '7', label: '7月'}
            ],
            tableLists: [
                {room: '航海工作室', product: '航海世纪', area: '国内', company: '苏州子公司', 6: '41751.81634624', 7: '41751.81634624', roomRow: 7, productRow: 4},
                {area: '海外', company: '海外授权', 6: '41751.81634624', 7: '41751.81634624', areaRow: 3},
                {company: '美国子公司', 6: '41751.81634624', 7: '41751.81634624'},
                {company: '俄罗斯子公司', 7: '12', 6: '41751.81634624'},
                {product: '舞街区', area: '国内', company: '苏州子公司', 6: '41751.81634624', 7: '41751.81634624', productRow: 3},
                {area: '海外', company: '海外授权', 6: '41751.81634624', 7: '41751.81634624', areaRow: 2},
                {company: '美国子公司', 6: '41751.81634624', 7: '41751.81634624'},
                {total: '合计',  6: '41751.81634624', 7: '41751.81634624', totalCol: 4},
                {room: '帝国工作室', product: '帝国文明', area: '国内', company: '苏州子公司', 6: '41751.81634624', 7: '41751.81634624', roomRow: 6, productRow: 4},
                {area: '海外', company: '海外授权', 6: '41751.81634624', 7: '41751.81634624', areaRow: 3},
                {company: '美国子公司', 6: '41751.81634624', 7: '41751.81634624'},
                {company: '俄罗斯子公司', 7: '12', 6: '41751.81634624'},
                {product: '英雄之城', area: '国内', company: '苏州子公司', 6: '41751.81634624', 7: '41751.81634624', productRow: 2},
                {area: '海外', company: '美国子公司', 6: '41751.81634624', 7: '41751.81634624'},
                {total: '合计',  6: '41751.81634624', 7: '41751.81634624', totalCol: 4},
                {sum: '总计',  6: '41751.81634624', 7: '41751.81634624', sumCol: 4}
            ]
        })
    }

    showView2 = () => {
        this.setState({
            tableTitles: [
                {value: 'total', label: '合计'},
                {value: 'sum', label: '总计'},
                {value: 'area', label: '区域'}, 
                {value: 'product', label: '游戏/产品'}, 
                {value: 'company', label: '公司/子公司'}, 
                {value: 'department', label: '发行部'}, 
                {value: '6', label: '6月'},
                {value: '7', label: '7月'}
            ],
            tableLists: [
                {area: '国内', product: '航海世纪', company: '苏州子公司', department: '莫亮发行部', 6: '41751.81634624', 7: '41751.81634624', areaRow: 3},
                {product: '舞街区', company: '苏州子公司', department: '吴忠涛发行部', 6: '41751.81634624', 7: '41751.81634624'},
                {product: '音乐侠', company: '苏州子公司', department: '吴剑发行部',  6: '41751.81634624', 7: '41751.81634624'},
                {total: '合计',  6: '41751.81634624', 7: '41751.81634624', totalCol: 4},
                {area: '海外', product: '航海世纪', company: '海外授权', department: '莫亮发行部', 6: '41751.81634624', 7: '41751.81634624', areaRow: 6, productRow: 3},
                {company: '美国子公司', department: '吴忠涛发行部', 6: '41751.81634624', 7: '41751.81634624'},
                {company: '俄罗斯子公司', department: '吴忠涛发行部', 6: '41751.81634624', 7: '41751.81634624'},
                {product: '舞街区', company: '海外授权', department: '吴剑发行部', 6: '41751.81634624', 7: '41751.81634624', productRow: 2},
                {company: '美国子公司', department: '吴剑发行部', 6: '41751.81634624', 7: '41751.81634624'},
                {product: '音乐侠', company: '海外授权', department: '薛雷发行部',  6: '41751.81634624', 7: '41751.81634624'},
                {total: '合计',  6: '41751.81634624', 7: '41751.81634624', totalCol: 4},
                {sum: '总计',  6: '41751.81634624', 7: '41751.81634624', sumCol: 4}
            ]
        })
    }

    render() {
        return(
            <div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="收入统计" key="1">
                        <Row>
                            <Col span={24} className="text-center clearfix">
                                <Select placeholder="请选择类别" style={{width: '8%'}}>
                                    <Option value="游戏">游戏</Option>
                                    <Option value="移动">移动</Option>
                                    <Option value="VR">VR</Option>
                                </Select>
                                <Select multiple placeholder="请选择月份" style={{width: '8%'}}>
                                    <Option value="1月">1月</Option>
                                    <Option value="2月">2月</Option>
                                    <Option value="3月">3月</Option>
                                    <Option value="4月">4月</Option>
                                    <Option value="5月">5月</Option>
                                    <Option value="6月">6月</Option>
                                    <Option value="7月">7月</Option>
                                    <Option value="8月">8月</Option>
                                    <Option value="9月">9月</Option>
                                    <Option value="10月">10月</Option>
                                    <Option value="11月">11月</Option>
                                    <Option value="12月">12月</Option>
                                </Select>
                            </Col>
                            <Col span={24} className="text-center" style={{marginTop: '20px'}}>
                                <ButtonGroup>
                                    <Button type="ghost">按产品</Button>
                                    <Button type="ghost">按工作室</Button>
                                    <Button type="ghost">按发行部</Button>
                                    <Button type="ghost">按区域</Button>
                                    <Button type="ghost">按子公司</Button>
                                    <Button type="primary" onClick={this.showAuto}>自定义查询</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Form horizontal className="ant-advanced-search-form" style={{marginTop: '30px', display: this.state.showFilter ? 'block' : 'none'}}>
                            <Row gutter={16}>
                                <Col sm={6}>
                                    <FormItem
                                        label="维度一"
                                        labelCol={{ span: 10 }}
                                        wrapperCol={{ span: 14 }}
                                    >
                                        <Select placeholder="请选择">
                                            <Option value="产品">产品</Option>
                                            <Option value="工作室">工作室</Option>
                                            <Option value="发行部">发行部</Option>
                                            <Option value="区域">区域</Option>
                                            <Option value="子公司">子公司</Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem
                                        label="维度五"
                                        labelCol={{ span: 10 }}
                                        wrapperCol={{ span: 14 }}
                                    >
                                        <Col sm={8}>
                                            <Select placeholder="请选择">
                                                <Option value="产品">产品</Option>
                                                <Option value="工作室">工作室</Option>
                                                <Option value="发行部">发行部</Option>
                                                <Option value="区域">区域</Option>
                                                <Option value="子公司">子公司</Option>
                                            </Select>
                                        </Col>
                                        <Col sm={16}>
                                            <Select multiple placeholder="请选择">
                                                <Option value="选项一">选项一</Option>
                                                <Option value="选项二">选项二</Option>
                                                <Option value="选项三">选项三</Option>
                                                <Option value="选项四">选项四</Option>
                                                <Option value="选项五">选项五</Option>
                                            </Select>
                                        </Col>
                                    </FormItem>
                                </Col>
                                <Col sm={6}>
                                    <FormItem
                                        label="维度二"
                                        labelCol={{ span: 10 }}
                                        wrapperCol={{ span: 14 }}
                                    >   
                                        <Col sm={8}>
                                            <Select placeholder="请选择">
                                                <Option value="产品">产品</Option>
                                                <Option value="工作室">工作室</Option>
                                                <Option value="发行部">发行部</Option>
                                                <Option value="区域">区域</Option>
                                                <Option value="子公司">子公司</Option>
                                            </Select>
                                        </Col>
                                        <Col sm={16}>
                                            <Select multiple placeholder="请选择">
                                                <Option value="选项一">选项一</Option>
                                                <Option value="选项二">选项二</Option>
                                                <Option value="选项三">选项三</Option>
                                                <Option value="选项四">选项四</Option>
                                                <Option value="选项五">选项五</Option>
                                            </Select>
                                        </Col>
                                    </FormItem>
                                </Col>
                                <Col sm={6}>
                                    <FormItem
                                        label="维度三"
                                        labelCol={{ span: 10 }}
                                        wrapperCol={{ span: 14 }}
                                    >
                                        <Col sm={8}>
                                            <Select placeholder="请选择">
                                                <Option value="产品">产品</Option>
                                                <Option value="工作室">工作室</Option>
                                                <Option value="发行部">发行部</Option>
                                                <Option value="区域">区域</Option>
                                                <Option value="子公司">子公司</Option>
                                            </Select>
                                        </Col>
                                        <Col sm={16}>
                                            <Select multiple placeholder="请选择">
                                                <Option value="选项一">选项一</Option>
                                                <Option value="选项二">选项二</Option>
                                                <Option value="选项三">选项三</Option>
                                                <Option value="选项四">选项四</Option>
                                                <Option value="选项五">选项五</Option>
                                            </Select>
                                        </Col>
                                    </FormItem>
                                </Col>
                                <Col sm={6}>
                                    <FormItem
                                        label="维度四"
                                        labelCol={{ span: 10 }}
                                        wrapperCol={{ span: 14 }}
                                    >   
                                        <Col sm={8}>
                                            <Select placeholder="请选择">
                                                <Option value="产品">产品</Option>
                                                <Option value="工作室">工作室</Option>
                                                <Option value="发行部">发行部</Option>
                                                <Option value="区域">区域</Option>
                                                <Option value="子公司">子公司</Option>
                                            </Select>
                                        </Col>
                                        <Col sm={16}>
                                            <Select multiple placeholder="请选择">
                                                <Option value="选项一">选项一</Option>
                                                <Option value="选项二">选项二</Option>
                                                <Option value="选项三">选项三</Option>
                                                <Option value="选项四">选项四</Option>
                                                <Option value="选项五">选项五</Option>
                                            </Select>
                                        </Col>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} className="text-center">
                                    <Button type="primary" htmlType="submit" onClick={this.showView1}>查询一</Button>
                                    <Button type="primary" htmlType="submit" onClick={this.showView2}>查询二</Button>
                                    <Button>清除条件</Button>
                                </Col>
                            </Row>
                          </Form>

                        <table className="table table-hover table-bordered table-center" style={{marginTop: '30px'}}>
                            <thead>
                                <tr>
                                    {
                                        this.state.tableTitles.map((e, i) => {
                                            if (e.value !== 'total' && e.value !== 'sum') {
                                                return(
                                                    <th key={i} className={e.label.endsWith('月') ? 'text-right' : ''}>{e.label}</th>
                                                )
                                            }
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.tableLists.map((list, index) =>
                                        <tr key={index} className={list.sum ? 'sum-bg' : ''}>
                                            {
                                                this.state.tableTitles.map((e, i) => {
                                                    if (list[e.value] !== undefined) {
                                                        return(
                                                            <td 
                                                                key={i} 
                                                                colSpan={list[e.value + 'Col']}
                                                                rowSpan={list[e.value + 'Row']}
                                                                className={e.label.endsWith('月') ? 'text-right' : ''}
                                                            >
                                                                {list[e.value]}
                                                            </td>
                                                        )
                                                    }
                                                })
                                            }
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </TabPane>
                    {/*<TabPane tab="工作室-子公司-产品" key="2">
                        <table className="table table-hover table-bordered table-center">
                            <thead>
                                <tr>
                                    {
                                        tableTitles2.map((e, i) => {
                                            if (e.value !== 'total' && e.value !== 'sum') {
                                                return(
                                                    <th key={i} className={e.label.endsWith('月') ? 'text-right' : ''}>{e.label}</th>
                                                )
                                            }
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tableLists2.map((list, index) =>
                                        <tr key={index} className={list.sum ? 'sum-bg' : ''}>
                                            {
                                                tableTitles2.map((e, i) => {
                                                    if (list[e.value] !== undefined) {
                                                        return(
                                                            <td 
                                                                key={i} 
                                                                colSpan={list[e.value + 'Col']}
                                                                rowSpan={list[e.value + 'Row']}
                                                                className={e.label.endsWith('月') ? 'text-right' : ''}
                                                            >
                                                                {list[e.value]}
                                                            </td>
                                                        )
                                                    }
                                                })
                                            }
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </TabPane>*/}
                </Tabs>
            </div>
        )
    }
}

export default MyTable