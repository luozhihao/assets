import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { Sider, MyTable, MainChart, Import } from './containers'

export default (
    <Route path="/" component={Sider}>
        <IndexRoute component={MyTable} />
        <Route path="MyTable" component={MyTable} />
        <Route path="MainChart" component={MainChart} />
        <Route path="Import" component={Import} />
    </Route>
)