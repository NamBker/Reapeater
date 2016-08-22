import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import * as Const from '../constants/Constants';
import { createMember, updateMember } from '../actions/member';

class MemberForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            member: props.member_info ? props.member_info : {
                mail_address: '',
                name: '',
                tel_no: '',
                birthday: '',
                gender: '',
                job: '',
                prefecture: '',
                favorite_store_id: '',
                member_registration_date: null,
                member_leave_date: null,
                rank_point: 0,
                visit_count: 0,
                last_visit_date: null,
                mail_reception: null,
                visit_alert_push: null,
                visit_alert_mail: null,
                other: '',
            },
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps) {
        this.setState({member: nextProps.member_info});
    }

    onTextChanged(e) {
        let member = this.state.member;
        member[e.target.id] = e.target.value;
        this.setState({member: member});
    }

    onSelectChanged(id, newValue) {
        let member = this.state.member;
        member[id] = newValue;
        this.setState({member: member});
    }

    onBoolChanged(id, newValue) {
        let member = this.state.member;
        switch (newValue) {
        case 2:
        case 1:
            member[id] = newValue - 1;
            break;
        case "":
            member[id] = newValue;
            break;
        }
        this.setState({member: member});
    }

    getBoolValueForId(id) {
        let member = this.state.member;
        switch(member[id]) {
        case 0:
        case 1:
            return member[id] + 1;
        }
        return member[id];
    }

    render() {
        const { member_info, onSubmit } = this.props;
        return (
            <form className="search" acceptCharset="utf-8" onSubmit={(e) => onSubmit(this.state.member, this.props.currentUser, e)}>
                <div class="row">
                    <div className='form-group'>
                        <label className="col-sm-5 control-label">名前</label>
                        <div className="col-sm-7">
                            <input type="text" className="form-control" id="name" name="name"
                                onChange={e => this.onTextChanged(e)}
                                value={this.state.member.name}
                                   style={{imeMode: 'inactive'}}/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="col-sm-5 control-label">電話番号</label>
                        <div className="col-sm-7">
                            <input type="text" className="form-control" id="tel_no" name="tel_no"
                                onChange={e => this.onTextChanged(e)}
                                value={this.state.member.tel_no}
                                   style={{imeMode: 'inactive'}}/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="col-sm-5 control-label">生年月日</label>
                        <div className="col-sm-7">
                            <input type="text" className="form-control" id="birthday" name="birthday"
                                onChange={e => this.onTextChanged(e)}
                                value={this.state.member.birthday}
                                   style={{imeMode: 'inactive'}}/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="col-sm-5 control-label">性別</label>
                        <div className="col-sm-7">
                            <Select
                                options={Const.GENDER_ARRAY.map((gender, index) => ({value:index + 1, label:gender}))}
                                placeholder={"性別を選択してください"}
                                searchable={false}
                                onChange={newValue => this.onSelectChanged('gender', newValue)}
                                value={this.state.member.gender}
                            />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="col-sm-5 control-label">職業</label>
                        <div className="col-sm-7">
                            <Select
                                options={Const.JOB_ARRAY.map((job, index) => ({value:index + 1, label:job}))}
                                placeholder="職業を選択してください"
                                searchable={false}
                                onChange={newValue => this.onSelectChanged('job', newValue)}
                                value={this.state.member.job}
                            />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="col-sm-5 control-label">都道府県</label>
                        <div className="col-sm-7">
                            <Select
                                options={Const.PREFECTURE_ARRAY.map((prefecture, index) => ({value:index + 1, label:prefecture}))}
                                placeholder={"都道府県を選択してください"}
                                searchable={false}
                                onChange={newValue => this.onSelectChanged('prefecture', newValue)}
                                value={this.state.member.prefecture}
                            />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="col-sm-5 control-label">会員登録日</label>
                        <div className="col-sm-7">
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="col-sm-5 control-label">ランクポイント</label>
                        <div className="col-sm-7">
                            <input type="number" className="form-control" id="rank_point" name="rank_point"
                                onChange={e => this.onTextChanged(e)}
                                value={this.state.member.rank_point}
                                   style={{imeMode: 'inactive'}}/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="col-sm-5 control-label">来店回数</label>
                        <div className="col-sm-7">
                            <input type="number" className="form-control" id="visit_count" name="visit_count"
                                onChange={e => this.onTextChanged(e)}
                                value={this.state.member.visit_count}
                                   style={{imeMode: 'inactive'}}/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="col-sm-5 control-label">最終来店日</label>
                        <div className="col-sm-7">
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="col-sm-5 control-label">メルマガ受信可否</label>
                        <div className="col-sm-7">
                            <Select
                                options={["受信不可", "受信可"].map((yesno, index) => ({value:index + 1, label:yesno}))}
                                placeholder={"受信可否を選択してください"}
                                searchable={false}
                                onChange={newValue => this.onBoolChanged('mail_reception', newValue)}
                                value={this.getBoolValueForId("mail_reception")}
                            />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="col-sm-5 control-label">来店アラート(PUSH通知)</label>
                        <div className="col-sm-7">
                            <Select
                                options={["受信不可", "受信可"].map((yesno, index) => ({value:index + 1, label:yesno}))}
                                placeholder={"受信可否を選択してください"}
                                searchable={false}
                                onChange={newValue => this.onBoolChanged('visit_alert_push', newValue)}
                                value={this.getBoolValueForId("visit_alert_push")}
                            />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="col-sm-5 control-label">来店アラート(メール)</label>
                        <div className="col-sm-7">
                            <Select
                                options={["受信不可", "受信可"].map((yesno, index) => ({value:index + 1, label:yesno}))}
                                placeholder={"受信可否を選択してください"}
                                searchable={false}
                                onChange={newValue => this.onBoolChanged('visit_alert_mail', newValue)}
                                value={this.getBoolValueForId("visit_alert_mail")}
                            />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="col-sm-5 control-label">その他</label>
                        <div className="col-sm-7">
                            <input type="text" className="form-control" id="other" name="other"
                                onChange={e => this.onTextChanged(e)}
                                value={this.state.member.other}
                                   style={{imeMode: 'inactive'}}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-9 col-sm-offset-3">
                            <input
                                type="submit"
                                className="btn btn-primary"
                                value={this.state.member.member_id ? "編集" : "登録"}
                            />
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        member_info: state.member_info,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onSubmit: (member, currentUser, e) => {
            e.preventDefault();
            console.log(member);
            if (member.member_id) {
                // 編集
                member.update_type = currentUser.authority <= 2 ? 1: 0;
                dispatch(updateMember(member, ownProps.history));
            } else {
                // 登録
                dispatch(createMember(member, ownProps.history));
            }
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberForm);
