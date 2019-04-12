import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import App from './Components/App/App'
import Story from './Components/Story/Story'
import Page from './Components/Page/Page'

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