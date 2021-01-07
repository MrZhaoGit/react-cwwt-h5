import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Routes from './routers/index'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom';
import './server/index'
import "lib-flexible";
import reportWebVitals from './reportWebVitals';
import store from './redux/index'
import './common/base.scss';
import './index.scss';

ReactDOM.render(
  <Provider store={store}>
    <Router>
        <Routes></Routes>
      </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
