import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchPictures } from '../../actions/picture'
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../../constants/Constants'
import { PER_PAGE } from '../../constants/Constants'

var keyWord = '';

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pictures: props.pictures
        };
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onTitleSearch();
    }

    render() {
        const { handleSearchFromKeyWord, pictures, companies ,brands, stores, currentUser } =  this.props;

        return (
                <div className="selectpicture__filter__header">
                    <div className="selectpicture__filter__headere__search">
                        <form acceptCharset="utf-8" onSubmit={(e) => this.onSubmit(e)}>
                            <input className="" type="text" placeholder="画像名で検索" onChange={handleSearchFromKeyWord} />
                            <input type="submit" value=" "/>
                        </form>
                    </div>
                </div>
        );
    }
}

Filter.propTypes = {
    pictures: PropTypes.array
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        companies : state.companies,
        brands: state.brands,
        pictures: state.pictures,
    }
};

export default connect(mapStateToProps)(Filter);
