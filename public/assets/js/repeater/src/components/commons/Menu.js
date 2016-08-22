import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'
import Routes from '../../constants/Routes'

class Menu extends Component {

    constructor(props) {
        super(props);
        this.checkCurrentPage = this.checkCurrentPage.bind(this);
    }

    checkCurrentPage(path) {
        if ((!this.props.path && path == '/') || (this.props.path && (this.props.path == path || (Routes[this.props.path] && Routes[this.props.path].parent == path)))) {
            return 'sidemenu--current';
        }
        return '';
    };
    render() {
        // ユーザ情報取得
        var userAuthority = this.props.currentUser.authority;
        return (
            <nav className="sidemenu">
                <ul>
                    <li className={"sidemenu__dashboard " + this.checkCurrentPage('/')}>
                        <Link to="/">{Globalize.localize('menu_top', Globalize.culture())}</Link>
                    </li>
                </ul>
                <ul>
                    { /* メールマガジン */ }
                    {(userAuthority <= Routes['/delivery'].authority) ?
                        <li className={"sidemenu__mail " + this.checkCurrentPage('/delivery')}>
                            <Link to="delivery">{Globalize.localize('menu_mail', Globalize.culture())}</Link>
                            <ul className="dropmenu dropmenu-side">
                                <li><Link to="/delivery">{Globalize.localize('menu_mail_list', Globalize.culture())}</Link></li>
                                <li><Link to="/delivery/create">{Globalize.localize('menu_mail_create', Globalize.culture())}</Link></li>
                            </ul>
                        </li>
                        :
                        ""
                    }
                    { /* お知らせ */ }
                    {(userAuthority <= Routes['/information'].authority) ?
                        <li className={"sidemenu__news " + this.checkCurrentPage('/information')}>
                            <Link to="/information">{Globalize.localize('menu_information', Globalize.culture())}</Link>
                            <ul className="dropmenu dropmenu-side">
                                <li><Link to="/information">{Globalize.localize('menu_information_list', Globalize.culture())}</Link></li>
                                <li><Link to="/information/create">{Globalize.localize('menu_information_create', Globalize.culture())}</Link></li>
                            </ul>
                        </li>
                        :
                        ""
                    }
                    { /* クーポン */ }
                    {(userAuthority <= Routes['/coupon'].authority) ?
                        <li className={"sidemenu__coupon " + this.checkCurrentPage('/coupon')}>
                            <Link to="/coupon">{Globalize.localize('menu_coupon', Globalize.culture())}</Link>
                            <ul className="dropmenu dropmenu-side">
                                <li><Link to="/coupon">{Globalize.localize('menu_coupon_list', Globalize.culture())}</Link></li>
                                <li><Link to="/coupon/create">{Globalize.localize('menu_coupon_create', Globalize.culture())}</Link></li>
                                <li><Link to="/randomCoupon">{Globalize.localize('menu_random_coupon_list', Globalize.culture())}</Link></li>
                                <li><Link to="/randomCoupon/create">{Globalize.localize('menu_random_coupon_create', Globalize.culture())}</Link></li>
                            </ul>
                        </li>
                        :
                        ""
                    }
                    { /* アンケート */ }
                    {(userAuthority <= Routes['/questionnaire'].authority) ?
                        <li className={"sidemenu__questionnaire " + this.checkCurrentPage('/questionnaire')}>
                            <Link to="/questionnaire">{Globalize.localize('menu_questionnaires', Globalize.culture())}</Link>
                            <ul className="dropmenu dropmenu-side">
                                <li><Link to="/questionnaire">{Globalize.localize('menu_questionnaires_list', Globalize.culture())}</Link></li>
                                <li><Link to="/questionnaire/create">{Globalize.localize('menu_questionnaires_create', Globalize.culture())}</Link></li>
                            </ul>
                        </li>
                        :
                        ""
                    }
                </ul>
                <ul>
                    { /* 分析 */ }
                    <li className="sidemenu__analysis">
                        <Link to="/memberanalysis">{Globalize.localize('menu_analyze', Globalize.culture())}</Link>
                        <ul className="dropmenu dropmenu-side">
                            <li><Link to="/memberanalysis">{Globalize.localize('menu_analyze_member_register', Globalize.culture())}</Link></li>
                            <li><Link to="/attributeanalysis">{Globalize.localize('menu_analyze_member_attribute', Globalize.culture())}</Link></li>
                            <li><Link to="/analysis/delivery">{Globalize.localize('menu_analyze_delivery', Globalize.culture())}</Link></li>
                        </ul>
                    </li>
                    { /* 会員 */ }
                    {(userAuthority <= Routes['/member'].authority) ?
                        <li className={"sidemenu__member " + this.checkCurrentPage('/member')}>
                            <Link to="/member">{Globalize.localize('menu_member', Globalize.culture())}</Link>
                            <ul className="dropmenu dropmenu-side">
                                <li><Link to="/member">{Globalize.localize('menu_member_list', Globalize.culture())}</Link></li>
                                <li><Link to="/member/create">{Globalize.localize('menu_member_create', Globalize.culture())}</Link></li>
                            </ul>
                        </li>
                        :
                        ""
                    }
                </ul>
                <ul>
                    { /* サイト管理 */ }
                    <li className="sidemenu__site">
                        <Link to="/site/map">{Globalize.localize('menu_site', Globalize.culture())}</Link>
                        <ul className="dropmenu dropmenu-side">
                            <li><Link to="/site/map">{Globalize.localize('menu_site_map', Globalize.culture())}</Link></li>
                            <li><Link to="/site/common">{Globalize.localize('menu_site_common', Globalize.culture())}</Link></li>
                            <li><Link to="/picture">{Globalize.localize('menu_picture', Globalize.culture())}</Link></li>
                        </ul>
                    </li>
                    { /* ブランド */ }
                    {(userAuthority <= Routes['/brand'].authority) ?
                        <li className={"sidemenu__brand " + this.checkCurrentPage('/brand')}>
                            <Link to="/brand">{Globalize.localize('menu_brand', Globalize.culture())}</Link>
                            <ul className="dropmenu dropmenu-side">
                                <li><Link to="/brand">{Globalize.localize('menu_brand_list', Globalize.culture())}</Link></li>
                                <li><Link to="/brand/create">{Globalize.localize('menu_brand_create', Globalize.culture())}</Link></li>
                            </ul>
                        </li>
                        :
                        ""
                    }
                    { /* 事業部 */ }
                    {(userAuthority <= Routes['/section'].authority) ?
                        <li className={"sidemenu__section " + this.checkCurrentPage('/section')}>
                            <Link to="/section">{Globalize.localize('menu_section', Globalize.culture())}</Link>
                            <ul className="dropmenu dropmenu-side">
                                <li><Link to="/section">{Globalize.localize('menu_section_list', Globalize.culture())}</Link></li>
                                <li><Link to="/section/create">{Globalize.localize('menu_section_create', Globalize.culture())}</Link></li>
                            </ul>
                        </li>
                        :
                        ""
                    }
                    { /* 店舗 */ }
                    {(userAuthority <= Routes['/store'].authority) ?
                        <li className={"sidemenu__shop " + this.checkCurrentPage('/store')}>
                            <Link to="/store">{Globalize.localize('menu_store', Globalize.culture())}</Link>
                            <ul className="dropmenu dropmenu-side">
                                <li><Link to="/store">{Globalize.localize('menu_store_list', Globalize.culture())}</Link></li>
                                <li><Link to="/store/create">{Globalize.localize('menu_store_create', Globalize.culture())}</Link></li>
                                <li><Link to="/areasort">{Globalize.localize('menu_area_sort', Globalize.culture())}</Link></li>
                                <li><Link to="/area">{Globalize.localize('menu_area_list', Globalize.culture())}</Link></li>
                            </ul>
                        </li>
                        :
                        ""
                    }
                    { /* アカウント */ }
                    {(userAuthority <= Routes['/user'].authority) ?
                        <li className={"sidemenu__acount " + this.checkCurrentPage('/user')}>
                            <Link to="/user">{Globalize.localize('menu_user', Globalize.culture())}</Link>
                            <ul className="dropmenu dropmenu-side">
                                <li><Link to="/user">{Globalize.localize('menu_user_list', Globalize.culture())}</Link></li>
                                <li><Link to="/user/create">{Globalize.localize('menu_user_create', Globalize.culture())}</Link></li>
                            </ul>
                        </li>
                        :
                        ""
                    }
                </ul>
            </nav>
        )
    }
}

export default Menu;
