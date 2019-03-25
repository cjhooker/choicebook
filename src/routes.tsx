import React from 'react'
import { Route, Switch } from 'react-router-dom'
import App from './App/App'
import Story from './Story/Story'
import Page from './Page/Page'

const Routes = () => (
  <App>
    <Switch>
      <Route exact path="/story/:storyId" component={Story} />
      <Route exact path="/page/:pageId" component={Page} />
    </Switch>
  </App>
)

export default Routes