import React, { Component } from 'react'
import { Button, Tabs, Upload, Icon, message, Card } from 'antd'

const TabPane = Tabs.TabPane

class Import extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            invalid: ['【操作说明】', '1、先下载excel模板']
        }
    }

    download = () => {
        location.href='/file/template.xlsx'
    }

    render() {
        let _this = this

        const props = {
            action: '/excel/excel_import/',
            beforeUpload(file) {
                const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

                if (!isXlsx) {
                    message.error('只能上传 .xlsx后缀 文件！')
                }

                return isXlsx;
            },
            onChange(data) {
                if (data.file.status === 'uploading') {
                    _this.setState({loading: true})
                } else {
                    if (data) {
                        let obj = data.file.response

                        if (obj.code === 200) {
                            _this.setState({invalid: ['【操作说明】', '1、先下载excel模板']})
                            message.success('导入成功！')
                        } else {
                            message.error(obj.msg)

                            if (obj.invalid) {
                                _this.setState({invalid: obj.invalid})
                            }
                        }

                        _this.setState({loading: false})
                    }
                }
            }
        }

        return(
            <div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="数据导入" key="1">
                        <div className="text-center">
                            <Upload {...props}>
                                <Button type="ghost" icon="upload" loading={this.state.loading}>
                                    点击上传
                                </Button>
                            </Upload>
                            &nbsp;
                            <Button type="ghost" icon="download" onClick={this.download}>
                                下载模板
                            </Button>
                        </div>
                        <Card className="card-box">
                            {
                                this.state.invalid.map((e, i) => 
                                    <p className="text-danger" key={i}>{e}</p>
                                )
                            }
                        </Card>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Import