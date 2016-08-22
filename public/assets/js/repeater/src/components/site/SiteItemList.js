import React, { Component, PropTypes } from 'react';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import Toggle from 'react-toggle'
import { Link } from 'react-router'
import Checkbox from '../../components/commons/Checkbox'
import * as Const from '../../constants/Constants'

const DragHandle = SortableHandle(() => <span className="drap_handle"></span>);
const SortableItem = SortableElement(({site, index, checkSiteMap, checkedItemsSite, getUrl}) => {
    return (
        <div className="contents__container__tr">
            <div className="contents__container__td contents__container__td__chk">
                <Checkbox id={'coupon' + site.id}
                          label={(index + 1).toString()}
                          key={index}
                          check={checkSiteMap}
                          className="check_box_information information_table"
                          isChecked={checkedItemsSite.indexOf(site.id) >=0}/>
            </div>
            <div className="contents__container__td contents__container__td__toggle2">
                <div className="onoffswitch">
                    <Toggle defaultChecked={site.display_flg == 0 ? false : true} />
                </div>
            </div>
            <div className="contents__container__td tree123">{site.site_hierarchy == 1 ? Const.SITE_MAP_PAGE_TYPE[site.page_type - 1] : ""}{site.site_hierarchy == 1 && site.linkage_site_id != 0 ? "（企業連動）" : ""}<br />{site.site_hierarchy == 1 ? site.sitemap_url : " "}</div>
            <div className="contents__container__td tree123">{site.site_hierarchy == 2 ? Const.SITE_MAP_PAGE_TYPE[site.page_type - 1] : ""}{site.site_hierarchy == 2 && site.linkage_site_id != 0 ? "（企業連動）" : ""}<br />{site.site_hierarchy == 2 ? site.sitemap_url : " "}</div>
            <div className="contents__container__td tree123">{site.site_hierarchy == 3 ? Const.SITE_MAP_PAGE_TYPE[site.page_type - 1] : ""}{site.site_hierarchy == 3 && site.linkage_site_id != 0 ? "（企業連動）" : ""}<br />{site.site_hierarchy == 3 ? site.sitemap_url : " "}</div>
            <div className="contents__container__td contents__container__td__btn_edit">
                <span className="btn_edit">
                    {
                        site.linkage_site_id != 0 ? <a href="javascript:void(0)" style={{ cursor: "default", opacity: "0.3"}}>編集</a> :
                        site.store_id == 0 ? <Link to={getUrl(site.page_type, site.brand_id, site.store_id, site.id)}>編集</Link> : <Link to={"/site/list/" + site.company_id + "/" + site.brand_id + "/" + site.id + "/" + site.page_type}>編集</Link>
                    }
                </span>
                <DragHandle />
            </div>
        </div>
    )
});

const SortableList = SortableContainer(({items, checkSiteMap, checkedItemsSite, getUrl}) => {
    return (
        <dd className="widget__contents">
            {items.map((item, index) => <SortableItem key={`item-${index}`} index={index} site={item} checkSiteMap={checkSiteMap} checkedItemsSite={checkedItemsSite} getUrl={getUrl} />)}
        </dd>
    );

});

class SiteItemList extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { onSortEnd, items, checkSiteMap, checkedItemsSite, getUrl} =  this.props;
        console.log(items);
        return (
            <SortableList items={items} onSortEnd={onSortEnd} useDragHandle={true} checkSiteMap={checkSiteMap} checkedItemsSite={checkedItemsSite} getUrl={getUrl} />
        );
    }
}

export default SiteItemList;
