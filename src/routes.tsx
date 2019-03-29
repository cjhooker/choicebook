import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import App from './App/App'
import Story from './Story/Story'
import Page from './Page/Page'

const Routes = () => (
  <App>
    <Switch>
      <Route exact path="/story/:storyId" component={Story} />
      <Route exact path="/page/:pageId" component={Page} />
      <Redirect from="/" to="/story/RngRW0Tq03vIkUk4rUiR" />
    </Switch>
  </App>
)

export default Routes