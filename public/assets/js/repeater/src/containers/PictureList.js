import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Filter from './picture/Filter'
import Table from './picture/Table'
import { Link } from 'react-router'
import * as Const from '../constants/Constants';
import { fetchPictures } from '../actions/picture'
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../constants/Constants'

import CreateDialog from './picture/CreateDialog'
import UpdateDialog from './picture/UpdateDialog'
import Dialog from  '../components/commons/Dialog'
import { doneCustomCreate } from '../actions/routes'

class PictureList extends Component {

    constructor(props) {
        super(props);
        this.state= {
            filter: {
                picture_file_name: '',
                page: 1,
                per_page: Const.PER_PAGE,
                pattern: Const.GET_ALL_PATTERN,
            },
            doUpdate: {
                showDialog: false,
                picture: {
                    id: 0,
                    company_id: 0,
                    brand_id: 0,
                    picture_file_name: '',
                },
            }
        };
        this.handleSearchFromKeyWord = this.handleSearchFromKeyWord.bind(this);
        this.doneCustomUpdate = this.doneCustomUpdate.bind(this);
    }

    componentDidMount() {
    }

    handleSearchFromKeyWord(e) {
        let filter = this.state.filter;
        filter.picture_file_name = e.target.value;
        this.setState({ filter: filter });
    }

    onTitleSearch() {
        let filter = this.state.filter;
        filter.page = 1;

        this.setState({filter: filter}, () => {
            this.props.dispatch(fetchPictures(filter));
        });
    }

    doneCustomUpdate(){
        let doUpdate = this.state.doUpdate;
        doUpdate.showDialog = false;
        this.setState({doUpdate: doUpdate});
    }

    handleSelectUpdate(picture){
        let doUpdate = this.state.doUpdate;
        doUpdate.showDialog = true;
        doUpdate.picture = picture;
        this.setState({doUpdate: doUpdate});
    }

    render() {
        return (
            <div>
                <CreateDialog isOpen={this.props.doCreate}
                        title="画像の登録"
                        content=""
                        closeDialog={() => {this.props.dispatch(doneCustomCreate())}}
                        filter={this.state.filter}
                    />
                <UpdateDialog isOpen={this.state.doUpdate.showDialog}
                        title="画像の詳細"
                        content=""
                        closeDialog={() => {this.doneCustomUpdate()}}
                        doUpdate={this.state.doUpdate}
                        data={this.state.doUpdate.picture}
                        filter={this.state.filter}
                    />
                <Filter filter={this.state.filter}
                        handleSearchFromKeyWord={this.handleSearchFromKeyWord}
                        onTitleSearch={() => this.onTitleSearch()}
                    />
                <Table filter={this.state.filter}
                       handleSelectUpdate={(picture) => this.handleSelectUpdate(picture)}
                    />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        doCreate: state.doCreate,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    }
};

export default connect(mapStateToProps)(PictureList);
