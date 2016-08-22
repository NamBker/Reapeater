import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'
import { connect } from 'react-redux';
import Routes from '../../constants/Routes'

class Header extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        // ユーザ情報取得
        var userAuthority = this.props.currentUser;
        return (
            <header>
                <div className="header__inner sitewidth">
                    <h1 className="logo"><a href="">GMOリピーター</a></h1>
                    <div className="header__right">
                        <ul className="acount-name">
                            <li className="acount-name__shop">{userAuthority.store_name}</li>
                            <li className="acount-name__brand">{userAuthority.brand_name}</li>
                        </ul>
                        <ul className="sub-nav">
                            <li className="sub-nav__others"><a className="sub-nav__a sub-nav__dropmenu" href="">設定</a>
                                <ul className="dropmenu">
                                    <li><a href="user/logout">ログアウト</a></li>
                                    { /* <li><?php echo \Html::anchor('web/user/logout', 'ログアウト', array(), \Util::isSecure()) ?></li> */ }
                                </ul>
                            </li>
                            <li className="sub-nav__site" data-balloon="サイト確認" data-balloon-pos="down" data-balloon-position="down" data-balloon-fukidashi="down"><a className="sub-nav__a" href="">サイト確認</a></li>
                            <li className="sub-nav__manual"><div className="sub-nav__disabled"/></li>
                            <li className="sub-nav__news"><div className="sub-nav__disabled"/></li>
                        </ul>
                    </div>
                </div>
            </header>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
    }
};

export default connect(mapStateToProps)(Header);
