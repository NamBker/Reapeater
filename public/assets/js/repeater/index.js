import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/lib/createHashHistory';
import { Router, hashHistory, Redirect, browserHistory  } from 'react-router';
import { fetchData } from './src/actions/index'
import { configureStore } from './src/store/configureStore';
import { syncReduxAndRouter, syncHistoryWithStore  } from 'react-router-redux';
import routes from './src/routes';
require('./locale/ja');
require('./locale/ja/ja');

window.React = React; // export for http://fb.me/react-devtools

const store = configureStore();
store.dispatch(fetchData());
const history = syncHistoryWithStore(hashHistory, store)

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match ;
        });
    };
}

// ここでja,enを指定します。
// 本来であれば、Cookie等からロケールを取得して設定します。
Globalize.culture("ja");

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            {routes}
        </Router>
    </Provider>,
    document.getElementById('main')
);
