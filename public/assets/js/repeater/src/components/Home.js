import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import MailmagagineChart from '../containers/home/MailmagagineChart'
import MemberChart from '../containers/home/MemberChart'

class Home extends Component {
    render() {
        return (
            <div>
                {/*
                <dl className="widget widget__news mb20">
                    <dt><h3>お知らせ</h3></dt>
                    <dd>
                        <ul>
                            <li className="widget__news__date">2016年6月20日</li>
                            <li className="news-new">NEW</li>
                            <li className="widget__news__title"><a href="">「katy byGMO」のサーバーメンテナンスについて</a></li>
                            <li className="widget__news__archive"><a href="">一覧</a></li>
                        </ul>
                    </dd>
                </dl>
                */}
                <dl className="widget widget__welcome mb20">
                    <dt>
                        <h2>GMOリピーター（旧katy）はここが変わりました</h2>
                        <p>全体の使い勝手を見直して、操作を分かりやすく・シンプルにしました。</p>
                    </dt>
                    <dd className="widget__welcome__flow mb20">
                        <ul>
                            <li className="widget__welcome__flow--one">1</li>
                            <li className="widget__welcome__flow--line"></li>
                            <li className="widget__welcome__flow--two">2</li>
                            <li className="widget__welcome__flow--line"></li>
                            <li className="widget__welcome__flow--three">3</li>
                        </ul>
                    </dd>
                    <dd className="widget__welcome__contents">
                        <div className="widget__welcome__contents--first">
                            <div className="widget__welcome__contents__top welcom-mailmagazine">
                                <div className="widget__welcome__contents__top--left">
                                    <h4>メールマガジン機能の改善</h4>
                                    <p>メールマガジン機能が使いやすくなり、マルチ配信ができるようになりました。</p>
                                </div>
                                <div className="widget__welcome__contents__top--right"></div>
                            </div>
                            <div className="widget__welcome__contents__bottom"><Link to="/delivery/create" className="btn-base">メールマガジンを使ってみる</Link></div>
                        </div>
                        <div className="widget__welcome__contents--second">
                            <div className="widget__welcome__contents__top welcom-smartphone">
                                <div className="widget__welcome__contents__top--left">
                                    <h4>スマートフォンに最適化</h4>
                                    <p>モバイルサイトがスマートフォンに最適化されました。新デザインをご覧ください。</p>
                                </div>
                                <div className="widget__welcome__contents__top--right"></div>
                            </div>
                            <div className="widget__welcome__contents__bottom"><Link to="" className="btn-base">スマホサイトを確認する</Link></div>
                        </div>
                        <div className="widget__welcome__contents--third">
                            <div className="widget__welcome__contents__top welcom-dashboard">
                                <div className="widget__welcome__contents__top--left">
                                    <h4>ダッシュボードの見直し</h4>
                                    <p>一目で会員増加数やメールマガジン配信状況が分かるようになりました。今後、機能が追加され、カスタマイズが可能になります。</p>
                                </div>
                                <div className="widget__welcome__contents__top--right"></div>
                            </div>
                        </div>
                    </dd>
                </dl>
                <div className="widget__wrapper">
                    <MemberChart/>
                    <MailmagagineChart/>
                </div>
                <footer>© 2016 GMOリピーター</footer>
            </div>
        );
    }
};


export default Home
