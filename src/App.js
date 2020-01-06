import React, {Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import {
  Icon,
  Spin,
} from "antd";

const Home = lazy(() => import("~/Home"));
const Random = lazy(() => import("~/Random"));
const Section = lazy(() => import("~/Section"));
const Add = lazy(() => import("~/Add"));
const Mine = lazy(() => import("~/Mine"));
const Details = lazy(() => import("~/Details"));
const Reg = lazy(() => import("~/Reg"));
const Login = lazy(() => import("~/Login"));
const List = lazy(() => import("~/List"));
const Search = lazy(() => import("~/Search"));
const Company = lazy(() => import("~/Company"));
const Tags = lazy(() => import("~/Tags"));
const ForgotPassword = lazy(() => import("~/ForgotPassword"));
const ResetPassword = lazy(() => import("~/ResetPassword"));
import Frame from "@@/Frame";

import "./App.scss";

const App = () => {
  return (
    <Frame>
      <Suspense
        fallback={
          <Spin
            indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
          />
        }
      >
        <Switch>
          <Route path="/home" component={Home} />
          <Redirect from="/" to="/home" exact />
          <Route path="/random" component={Random} />
          <Route path="/section" component={Section} />
          <Route path="/add" component={Add} />
          <Route path="/mine" component={Mine} />
          <Route path="/search" component={Search} />
          <Route path="/iq" component={List} exact />
          <Route path="/iq/:id" component={Details} />
          <Route path="/reg" component={Reg} />
          <Route path="/login" component={Login} />
          <Route path="/company" component={Company} />
          <Route path="/tags" component={Tags} />
          <Route path="/forgotpassword" component={ForgotPassword} />
          <Route path="/resetpassword" component={ResetPassword} />
          <Route render={() => <div>404</div>} />
        </Switch>
      </Suspense>
    </Frame>
  );
};

export default App;
