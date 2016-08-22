import { connect } from 'react-redux';
import Title from '../../components/commons/Title'
import * as Const from '../../constants/Constants'

const mapStateToProps = (state) => {
    let sitePathArr = state.routing.locationBeforeTransitions.pathname.split("/");
    let siteId = sitePathArr.pop();
    let pathTitle = "";
    state.site_map.map((site, index) => {
        if (site.id == siteId && sitePathArr[2] == 'list') {
            pathTitle = Const.SITE_MAP_PAGE_TYPE[site.page_type - 1];
        }
    });
    return {
        pathTitle: pathTitle,
        currentUser: state.currentUser,
    }
};

export default connect(mapStateToProps)(Title);