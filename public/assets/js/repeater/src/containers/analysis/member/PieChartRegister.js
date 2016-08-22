import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Pie as PieChart } from 'react-chartjs'

import { PREFECTURE_ARRAY } from '../../../constants/Constants'

class PieChartRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { selectedTabIndex, menWomenDatasets, ageDatasets, prefectureDatasets, jobDatasets, totalPrefecture, ageCount } = this.props;
        if (!menWomenDatasets) return null;
        return (
            <div className="widget widget__wrapper memberanalysis-piechart">
                <div className="inline-block twenty-five-perc" >
                    <div className="memberanalysis-piechart-title">男女</div>
                    {menWomenDatasets[0].value + menWomenDatasets[1].value > 0 ? <div className="center-align">
                        <PieChart data={menWomenDatasets} options={pieOptionsMenWomen} height="190" redraw/>
                    </div>: <div className="memberanalysis-text-center">男女の予報が取得されていません。</div>}
                </div>
                <div className="inline-block twenty-five-perc" >
                    <div className="memberanalysis-piechart-title">年代別</div>
                    {ageCount > 0 ? <div className="center-align">
                        <PieChart data={ageDatasets} options={pieOptionsAges} height="190" redraw/>
                    </div>: <div className="memberanalysis-text-center">年代別の予報が取得されていません。</div>}
                </div>
                <div className="inline-block twenty-five-perc" >
                    <div className="memberanalysis-piechart-title">都道府県</div>
                    {(totalPrefecture != 0) ?
                    <div className="center-align">
                        <PieChart data={prefectureDatasets} options={pieOptionsPrefecture} height="190" redraw/>
                    </div>
                    : <div className="memberanalysis-text-center" >都道府県の予報が取得されていません。</div>
                    }
                </div>
                <div className="inline-block twenty-five-perc">
                    <div className="memberanalysis-piechart-title">よく行く店舗</div>
                    <div className="memberanalysis-text-center" >取得されていません。<a>会員登録アンケット</a>で取得設定をおこなってください。</div>
                </div>
            </div>
        );
    }
};

// オプション
let pieOptionsMenWomen = {
    // 凡例表示用の HTML テンプレート
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\">&nbsp;&nbsp;&nbsp;</span> <%if(datasets[i].legendName){%><%=datasets[i].legendName%><%}%></li><%}%></ul>",
    animationEasing : "easeOutQuad",
    tooltipTemplate: "<%if (label){%><%=label%><%} %>",
    onAnimationComplete: function(){
        this.showTooltip(this.segments, true);
    },
    tooltipEvents: [],
    showTooltips: true,
    tooltipFillColor : "#fff",
    tooltipFontColor: "#000",
    segmentShowStroke: false,
    responsive : true,
};

let pieOptionsAges = {
    // 凡例表示用の HTML テンプレート
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\">&nbsp;&nbsp;&nbsp;</span> <%if(datasets[i].legendName){%><%=datasets[i].legendName%><%}%></li><%}%></ul>",
    //animation : false,
    animationEasing : "easeOutQuad",
    tooltipTemplate: "<%if (label){%><%=label%><%} %>",
    tooltipEvents: ["mousemove"],
    showTooltips: true,
    tooltipFillColor : "#fff",
    tooltipFontColor: "#000",
    segmentShowStroke: false,
    responsive : true,
};

let pieOptionsPrefecture = {
    // 凡例表示用の HTML テンプレート
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\">&nbsp;&nbsp;&nbsp;</span> <%if(datasets[i].legendName){%><%=datasets[i].legendName%><%}%></li><%}%></ul>",
    //animation : false,
    animationEasing : "easeOutQuad",
    tooltipTemplate: "<%if (label){%><%=label%><%} %>",
    tooltipEvents: ["mousemove"],
    showTooltips: true,
    tooltipFillColor : "#fff",
    tooltipFontColor: "#000",
    segmentShowStroke: false,
    responsive : true,
};

let pieOptionsJobs = {
    // 凡例表示用の HTML テンプレート
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\">&nbsp;&nbsp;&nbsp;</span> <%if(datasets[i].legendName){%><%=datasets[i].legendName%><%}%></li><%}%></ul>",
    //animation : false,
    animationEasing : "easeOutQuad",
    tooltipTemplate: "<%if (label){%><%=label%><%} %>",
    tooltipEvents: ["mousemove"],
    showTooltips: true,
    tooltipFillColor : "#fff",
    tooltipFontColor: "#000",
    segmentShowStroke: false,
    responsive : true,
};

const mapStateToProps = (state,ownProps) => {

    let menWomenDatasets = [
        {
            color:     "#0076de",
            lineColor: "#0076de", // 凡例の色
            highlight: "seagreen",
            legendName:"未開封",
        },
        {
            color:     "#e5f3ff",
            lineColor: "#e5f3ff", // 凡例の色
            highlight: "yellow",
            legendName:"開封",
        }
    ];

    let ageDatasets = [
        {
            color:     "#0076de",
            lineColor: "#0076de", // 凡例の色
            legendName:"未開封",
        },
        {
            color:     "#2f93eb",
            lineColor: "#2f93eb", // 凡例の色
            legendName:"開封"
        },
        {
            color:     "#61b0f5",
            lineColor: "#61b0f5", // 凡例の色
            legendName:"未開封"
        },
        {
            value:     10,
            color:     "#99cffe",
            lineColor: "#99cffe", // 凡例の色
            label:     "17.4%", // 凡例のラベル
            legendName:"開封"
        },
        {
            color:     "#cce8ff",
            lineColor: "#cce8ff", // 凡例の色
            legendName:"未開封"
        },
        {
            color:     "#e5f3ff",
            lineColor: "#e5f3ff", // 凡例の色
            legendName:"開封"
        }
    ];

    let prefectureDatasets = [
        {
            color:     "#0076de",
            lineColor: "#0076de", // 凡例の色
            label:     "82.6%", // 凡例のラベル
            legendName:"未開封",
        },
        {
            color:     "#2f93eb",
            lineColor: "#2f93eb", // 凡例の色
            legendName:"開封"
        },
        {
            value:     10,
            color:     "#61b0f5",
            lineColor: "#61b0f5", // 凡例の色
            label:     "82.6%", // 凡例のラベル
            legendName:"未開封"
        },
        {
            color:     "#99cffe",
            lineColor: "#99cffe", // 凡例の色
            legendName:"開封"
        },
        {
            value:     10,
            color:     "#cce8ff",
            lineColor: "#cce8ff", // 凡例の色
            label:     "82.6%", // 凡例のラベル
            legendName:"未開封"
        },
        {
            color:     "#e5f3ff",
            lineColor: "#e5f3ff", // 凡例の色
            legendName:"開封"
        }
    ];


    let jobDatasets = [
        {
            color:     "#0076de",
            lineColor: "#0076de", // 凡例の色
            legendName:"未開封",
        },
        {
            color:     "#2f93eb",
            lineColor: "#2f93eb", // 凡例の色
            legendName:"開封"
        },
        {
            color:     "#61b0f5",
            lineColor: "#61b0f5", // 凡例の色
            legendName:"未開封"
        },
        {
            color:     "#99cffe",
            lineColor: "#99cffe", // 凡例の色
            legendName:"開封"
        },
        {
            color:     "#cce8ff",
            lineColor: "#cce8ff", // 凡例の色
            legendName:"未開封"
        },
        {
            color:     "#e5f3ff",
            lineColor: "#e5f3ff", // 凡例の色
            legendName:"開封"
        }
    ];
    let menPer = 0, womenPer = 0,
        ageNum = [{value: 0, name: '10代'},
            {value: 0, name: '20代'},
            {value: 0, name: '30代'},
            {value: 0, name: '40代'},
            {value: 0, name: '50代'},
            {value: 0, name: '60代'},
            {value: 0, name: '70代'},
            {value: 0, name: '80代'},
            {value: 0, name: '90代'}

        ], prefecture = new Array(47).fill(0);
    state.memberAnalysis.analysisData.forEach((daily) => {
        daily.map(item => {
            menPer += item.men_count;
            womenPer += item.women_count;
            ageNum[0].value += item['10s_count'];
            ageNum[1].value += item['20s_count'];
            ageNum[2].value += item['30s_count'];
            ageNum[3].value += item['40s_count'];
            ageNum[4].value += item['50s_count'];
            ageNum[5].value += item['60s_count'];
            ageNum[6].value += item['70s_count'];
            ageNum[7].value += item['80s_count'];
            ageNum[8].value += item['90s_count'];
            for(let i=1;i<=47;i++) {
                let name = i < 10 ? "prefecture0" + i : "prefecture" + i;
                prefecture[i-1] += item[name];
            }
        })
    });
    let arrPrefecture = [], totalPrefecture = 0;
    prefecture.map((pre, index) => {
        arrPrefecture.push({name : PREFECTURE_ARRAY[index], value : pre});
        totalPrefecture += pre;
    });
    if (arrPrefecture.length == 0) return {};
    arrPrefecture.sort((a, b) => b.value - a.value);
    for (let i = 5; i < arrPrefecture.length; i++) {
        arrPrefecture[5].value += arrPrefecture[i].value;
    }
    arrPrefecture[5].name = 'その他';

    ageNum.sort((a, b) => b.value - a.value);
    ageNum[5].value = ageNum[5].value + ageNum[6].value +ageNum[7].value +ageNum[8].value;
    ageNum[5].name = 'その他';
    let ageCount = ageNum[0].value + ageNum[1].value +ageNum[2].value +ageNum[3].value+ageNum[4].value +ageNum[5].value;

    menWomenDatasets[0].value = menPer;
    menWomenDatasets[0].label = "男:" + menPer + "人("+ Math.floor(menPer*100/(menPer + womenPer)) + "%)";
    menWomenDatasets[1].value = womenPer;
    menWomenDatasets[1].label = "女:"+womenPer + "人("+ Math.floor(womenPer*100/(menPer + womenPer)) +"%)";

    for(let i=0;i<6;i++) {
        ageDatasets[i].value = ageNum[i].value;
        ageDatasets[i].label = ageNum[i].name+"("+Math.floor(ageNum[i].value*100/ageCount)+"%)";
        prefectureDatasets[i].value = arrPrefecture[i].value;
        prefectureDatasets[i].label = arrPrefecture[i].name+"("+Math.floor(arrPrefecture[i].value*100/totalPrefecture)+"%)";
    }
    return {
        menWomenDatasets, ageDatasets, prefectureDatasets, jobDatasets, totalPrefecture, ageCount
    }
};


export default connect(mapStateToProps)(PieChartRegister)
