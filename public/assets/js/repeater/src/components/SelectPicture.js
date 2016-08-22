import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ModalPictureDialog from './commons/ModalPictureDialog'
import Filter from './selectpicture/Filter'
import Table from './selectpicture/Table'
import { Link } from 'react-router'
import * as Const from '../constants/Constants';
import { fetchPictures } from '../actions/picture'
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../constants/Constants'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import CreateDialog from './selectpicture/CreateDialog'
import Dialog from  './commons/Dialog'
import { doneCustomCreate } from '../actions/routes'
import Preview from  './selectpicture/Preview'

class SelectPicture extends Component {

    constructor(props) {
        super(props);
        this.state= {
            filter: {
                company_id: props.currentUser.company_id,
                brand_id: props.currentUser.brand_id,
                picture_file_name: '',
                page: 1,
                per_page: Const.PER_PAGE,
                pattern: Const.GET_ALL_PATTERN,
            },
            submit_filter: {
                picture_file_name: '',
            },
            doUpdate: {
                showDialog: false,
                picture: {
                    id: 0,
                    company_id: 0,
                    brand_id: 0,
                    picture_file_name: '',
                    mimetype: '',
                },
            },
            doSelect: {
                picture: {
                    id: 0,
                    picture_url: '',
                    picture_file_name: '',
                    vertically_horizontally: '',
                },
            },
            selectedTabIndex: 0,
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

        this.setState({filter: filter, submit_filter: filter}, () => {
            this.props.dispatch(fetchPictures(filter));
        });
    }

    doneCustomUpdate(){
        let doUpdate = this.state.doUpdate;
        doUpdate.showDialog = false;
        this.setState({doUpdate: doUpdate});
    }

    handleSelectPicture(picture){
        let doSelect = this.state.doSelect;
        doSelect.picture = picture;
        this.setState({doSelect: doSelect});
    }

    handleInsertPicture(){
        const { picture } = this.state.doSelect;
        this.props.onSelectedPicture({id: picture.id, url:picture.picture_url, thumbnail:picture.picture_thumb_url, filename:picture.picture_file_name});
        alert("画像が選択されました");
        this.props.closeDialog();
    }

    onSelectTab(index, last) {
        this.setState({selectedTabIndex: index});
    }

    render() {
        const {isOpen, title, closeDialog} = this.props;
        return (
            <ModalPictureDialog isOpen={isOpen}>
                <div className="widget">
                    <div className="widget__selectpicture__title modal_title">
                        <span>{this.props.title}</span>
                        <span className="cross" onClick={this.props.closeDialog}></span>
                    </div>
                    <Tabs
                        className="widget__page__selectpicture__select__tabs"
                        onSelect={(index, last) => this.onSelectTab(index, last)}
                        selectedIndex={this.state.selectedTabIndex}
                    >
                        <TabList>
                            <Tab>ファイルをアップロード</Tab>
                            <Tab>画像一覧から選択</Tab>
                        </TabList>
                        <TabPanel>
                            <CreateDialog isOpen={this.props.doCreate}
                                    title="画像の挿入"
                                    content=""
                                    closeDialog={() => {this.props.dispatch(doneCustomCreate())}}
                                    filter={this.state.filter}
                            />
                        </TabPanel>
                        <TabPanel>
                            <div className="widget__picturedialog__left__contents">
                                <div>
                                    <Filter filter={this.state.filter}
                                             handleSearchFromKeyWord={this.handleSearchFromKeyWord}
                                             onTitleSearch={() => this.onTitleSearch()}
                                    />
                                    <Table filter={this.state.filter}
                                            handleSelectPicture={(picture) => this.handleSelectPicture(picture)}
                                    />
                                </div>
                            </div>
                            <div className="widget__picturedialog__right__contents">
                                <div>
                                    <Preview title="画像の詳細"
                                             fileUrl={this.state.doSelect.picture.picture_url}
                                             fileName={this.state.doSelect.picture.picture_file_name}
                                             fileSize={this.state.doSelect.picture.vertically_horizontally}
                                             handleInsertPicture={() => this.handleInsertPicture()}
                                    />
                                </div>
                            </div>
                        </TabPanel>
                    </Tabs>
                    <div className="picture__selectpicture__clearfix">
                    </div>
                </div>
            </ModalPictureDialog>
        )
    }
}

SelectPicture.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    closeDialog: PropTypes.func.isRequired,
    onSelectedPicture: PropTypes.func.isRequired,
};

SelectPicture.defaultProps = {
    title: "",
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        companies: state.currentCompanies,
        brands: state.currentBrands,
        doCreate: state.doCreate,
    }
};

export default connect(mapStateToProps)(SelectPicture);
