import React, {Component, PropTypes} from 'react';
import { Line as LineChart } from 'react-chartjs'

import moment from 'moment'
import {fetchDailyStoreInfo, clearDailyStore} from '../../actions/memberanalysis'

class MemberChart extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        const { dispatch } = this.props;
        let today = moment();
        let from = today.format('YYYY-MM-DD');
        let to = today.subtract(14, 'days').format('YYYY-MM-DD');
        dispatch(fetchDailyStoreInfo({from, to}));
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(clearDailyStore());
    }

    render() {
        const { lineChartData, totalCount, scaleStepWidth} = this.props;
        return (
            <dl className="widget widget--half widget__member mr20">
                <dt className="widget__title">{Globalize.localize('home_member_chart', Globalize.culture())}<div className="widget__info">
                    <a href="" data-balloon-length="medium" data-balloon={Globalize.localize('home_member_chart_balloon', Globalize.culture())} data-balloon-pos="up" data-balloon-fukidashi="top"></a></div>
                </dt>
                <dd className="widget__contents">
                    <p className="widget__contents__txt">{Globalize.localize('home_member_chart_total', Globalize.culture())}<span>{totalCount}</span>{Globalize.localize('people', Globalize.culture())}</p>
                    <LineChart data={lineChartData} options={{...options, scaleStepWidth}} height="190" width="345" style={{width: '345px', height: '190px'}} redraw/>
                </dd>
            </dl>
        );
    }
}

// オプション
var options = {
    // X, Y 軸ラインが棒グラフの値の上にかぶさるようにするか
    scaleOverlay : true,
    // 値の開始値などを自分で設定するか
    scaleOverride : true,

    // 以下の 3 オプションは scaleOverride: true の時に使用
    // Y 軸の値のステップ数
    // e.g. 10 なら Y 軸の値は 10 個表示される
    scaleSteps : 2,
    // Y 軸の値のステップする大きさ
    // e.g. 10 なら 0, 10, 20, 30 のように増えていく
    //scaleStepWidth : 100,
    // Y 軸の値の始まりの値
    scaleStartValue : 0,
    // X, Y 軸ラインの色
    scaleLineColor : "#cccccc",
    // X, Y 軸ラインの幅
    scaleLineWidth : 1,
    // ラベルの表示 ( Y 軸の値 )
    scaleShowLabels : true,
    // ラベルの表示フォーマット ( Y 軸の値 )
    scaleLabel : "<%=value%>",
    // X, Y 軸値のフォント
    scaleFontFamily : "'Arial'",
    // X, Y 軸値のフォントサイズ
    scaleFontSize : 10,
    // X, Y 軸値のフォントスタイル, normal, italic など
    scaleFontStyle : "normal",
    // X, Y 軸値の文字色
    scaleFontColor : "#999999",
    // グリッドライン ( Y 軸の横ライン ) の表示
    scaleShowGridLines : false,
    // グリッドラインの色
    scaleGridLineColor : "rgba(0, 0, 0, .05)",
    // グリッドラインの幅
    scaleGridLineWidth : 1,
    // ラインが曲線 ( true ) か直線 ( false )か
    bezierCurve : false,
    // ポイントの点を表示するか
    pointDot : true,
    // ポイントの点の大きさ
    pointDotRadius : 4,
    // ポイントの点の枠線の幅
    pointDotStrokeWidth : 1,
    // データセットのストロークを表示するか
    // みたいですが、ちょっと変化が分からなかったです
    datasetStroke : true,
    // ラインの幅
    datasetStrokeWidth : 5,
    // ラインの内側を塗りつぶすか
    datasetFill : true,
    // 表示の時のアニメーション
    animation : true,
    // アニメーションの速度 ( ステップ数 )
    animationSteps : 60,
    // アニメーションの種類, 以下が用意されている
    // linear, easeInQuad, easeOutQuad, easeInOutQuad, easeInCubic, easeOutCubic,
    // easeInOutCubic, easeInQuart, easeOutQuart, easeInOutQuart, easeInQuint,
    // easeOutQuint, easeInOutQuint, easeInSine, easeOutSine, easeInOutSine,
    // easeInExpo, easeOutExpo, easeInOutExpo, easeInCirc, easeOutCirc, easeInOutCirc,
    // easeInElastic, easeOutElastic, easeInOutElastic, easeInBack, easeOutBack,
    // easeInOutBack, easeInBounce, easeOutBounce, easeInOutBounce
    animationEasing : "easeOutQuad",
    // アニメーション終了後に実行する処理
    // animation: false の時にも実行されるようです
    // e.g. onAnimationComplete : function() {alert('complete');}
    onAnimationComplete : () =>{},
    tooltipTemplate: "<%if (value){%><%=value%><%}%>"
};

export default MemberChart