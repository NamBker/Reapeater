import React, { Component, PropTypes } from 'react';

import Menu from '../containers/commons/Menu'
import Navigator from '../containers/commons/Navigator'
import Title from '../containers/commons/Title'
import Routes from '../constants/Routes'
import Header from './commons/Header'

class App extends Component {
    render() {
        var authority = true;
        // 閲覧権限チェック
        let path = this.props.routes[1].path || "/";
        for (let i = 2; i < this.props.routes.length; i++) {
            if (this.props.routes[i].path) {
                path += "/" + this.props.routes[i].path;
            }
        }
        if (path && this.props.currentUser.authority != ''){
            //console.log(this.props.currentUser.authority + '/' + Routes[this.props.children.props.route.path].authority);
            if(Routes[path] && this.props.currentUser.authority > Routes[path].authority){
                //console.log("not enough authority. go back to home.");
                window.location.href = "/web/home";
                authority = false;
            }
        }

        return (
            <div className="main__inner sitewidth">
                <Header path={path}/>
                <Menu path={path}/>
                {
                    authority ? path == '/' ?
                        <div className="contents">
                            {this.props.children}
                        </div> :
                        <div className="contents">
                            <Navigator path={path}/>
                            <Title path={path}/>
                            {this.props.children}
                            <footer>© 2016 GMOリピーター</footer>
                        </div>
                        :""
                }
            </div>
        );
    }
};

export default App;
