import React, { Component, PropTypes } from 'react';
import moment from 'moment'
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { CSSGrid, makeResponsive } from 'react-stonecutter'
import Checkbox from '../commons/Checkbox'
import { deletePicture } from '../../actions/picture'
import * as Const from '../../constants/Constants';
import ReactPaginate from 'react-paginate';
import { fetchPictures } from '../../actions/picture'
import ColumnTitle from '../commons/ColumnTitle'
import { doCustomUpdate } from '../../actions/routes'

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isCheckAll: false,
            checkedItems_Arr : [],
            page : 1,
            isSelectPictureId: 0,
        };
        this.handlePageChanged = this.handlePageChanged.bind(this);
        this.handleChangeChecked = this.handleChangeChecked.bind(this);
        this.handlePictureId = this.handlePictureId.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    componentDidMount() {
        const { dispatch, filter } = this.props;
        dispatch(fetchPictures(Object.assign(filter, {per_page: Const.PER_PAGE})));
    }

    handlePageChanged(newPage) {
        this.setState({ current : newPage });
    }

    handleChangeChecked() {
        this.setState({ isCheckAll: !this.state.isCheckAll });
        let checkedItems = [];
        if (!this.state.isCheckAll) {
            let pictureList = this.props.pictures;
            for (var i = 0; i < pictureList.length; i++) {
                checkedItems.push(pictureList[i].id);
                checkedItems.push(pictureList[i].picture_thumb_url);
            }
        }
        this.setState({checkedItems_Arr : checkedItems});
    }

    handlePictureId(pictureId, pictureThumbUrl) {
        let checkedItems = this.state.checkedItems_Arr;
        let index = checkedItems.indexOf(pictureId);
        if (index >= 0) {
            checkedItems.splice(index, 1);
            this.setState({checkedItems_Arr: checkedItems, isCheckAll: false});
        } else {
            checkedItems.push(pictureId);
            this.setState({checkedItems_Arr: checkedItems});
        }
    }

    handlePageClick(data) {
        let page = data.selected + 1;
        this.setState({isCheckAll: false, checkedItems: []}, () => {
            this.props.dispatch(fetchPictures(Object.assign(this.props.filter, {page: page, per_page: Const.PER_PAGE})));
        });
    }

    handleSelectPicture(pictureId){
        let pictures = this.props.pictures;
        let target = {};
        for (let picture of pictures) {
            if (pictureId.target.value == picture.id){
                target = picture;
                this.setState({isSelectPictureId: picture.id});
                break;
            }
        }
        this.props.handleSelectPicture(target);
    }

    render() {
        const { pictures, titles, filter, picture_count } = this.props;
        const Grid = makeResponsive(CSSGrid, { maxWidth: 2000, minPadding: 450 });
        var checked = this.state.isCheckAll ? "checked" : '';
        var offset = (filter.page - 1) * Const.PER_PAGE;

        return (
            <dl className="selectpicture__widget widget__page__table">
                <div className="widget__picture__table__inner">
                    <Grid
                        component="ul"
                        columns={3}
                        columnWidth={150}
                        gutterWidth={20}
                        gutterHeight={20}
                        itemHeight={150}
                        duration={400}
                    >
                        {pictures.map((info, index) =>
                            <li className="picture__grid__img" key={info.id}>
                                {this.state.isSelectPictureId != info.id ? "" : <img className="ok__img" src="/assets/img/icon-ok.png" srcSet="/assets/img/icon-ok@2x.png" width="16" height="16"/>}
                                <div className="widget__picture__table__inner__img">
                                    <img src={info.picture_thumb_url} width="150" height="auto" value={info.id} onClick={(e) => this.handleSelectPicture(e)}/>
                                </div>
                                <p>{info.picture_file_name}</p>
                            </li>
                        )}
                    </Grid>
                </div>
                <dd className="widget__page__table__pagination">
                    <span style={{width: '130px'}}>合計：{picture_count}件</span>
                    <ReactPaginate
                        previousLabel={" "}
                        forceSelected={filter.page - 1}
                        nextLabel={" "}
                        breakLabel={<a>...</a>}
                        pageNum={Math.ceil(picture_count / Const.PER_PAGE)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        clickCallback={this.handlePageClick}
                        containerClassName={"pagination picture_paginate"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                        />
                    <span style={{width: '130px'}}></span>
                </dd>
            </dl>
        );
    }
}

Table.propTypes = {
    pictures: PropTypes.array.isRequired,
    titles: PropTypes.object,
    filter: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        pictures: state.pictures,
        picture_count: state.picture_count,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        deleteSelectedPicture: (CheckedItems) => {
            if(confirm("選択した項目を削除しますか")){
                var filters = ownProps.filter;
                var checkItems = CheckedItems;
                filters.picture_ids = checkItems;
                dispatch(deletePicture(filters));
            }
        },
        dispatch
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Table)
