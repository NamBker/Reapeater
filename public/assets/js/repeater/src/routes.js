import React from 'react'
import { Route, IndexRoute, Link } from 'react-router'

/* container components */
import App from './containers/App'
import BrandList from './containers/BrandList'
import InformationList from './containers/InformationList'
import Home from './components/Home'
import UserList from './containers/UserList'
import CreateUserForm from './containers/CreateUserForm'
import UpdateUserForm from './containers/UpdateUserForm'
import StoreList from './containers/StoreList'
import CreateBrandForm from './containers/CreateBrandForm'
import UpdateBrandForm from './containers/UpdateBrandForm'
import BrandInputForm from './containers/brand/CreateForm'
import BrandConfirm from './containers/brand/ConfirmForm'
import CreateSectionForm from './containers/CreateSectionForm'
import UpdateSectionForm from './containers/UpdateSectionForm'
import CreateStoreForm from './containers/CreateStoreForm'
import StoreInputForm from './containers/store/InputForm'
import StoreConfirm from './containers/store/ShowForm'
import UpdateStoreForm from './containers/UpdateStoreForm'
import CreateInformationForm from './containers/CreateInformationForm'
import UpdateInformationForm from './containers/UpdateInformationForm'
import MemberList from './containers/MemberList'
import CreateMemberForm from './containers/CreateMemberForm'
import UpdateMemberForm from './containers/UpdateMemberForm'
import SectionList from './containers/SectionList'
import CreateCouponForm from './containers/CreateCouponForm'
import UpdateCouponForm from './containers/UpdateCouponForm'
import AreaList from './containers/AreaList'
import QuestionnaireList from './containers/QuestionnaireList'
import CreateQuestionnaireForm from './containers/CreateQuestionnaireForm'
import UpdateQuestionnaireForm from './containers/UpdateQuestionnaireForm'
import SectionInputForm from './containers/section/CreateForm'
import SectionConfirm from './containers/section/ConfirmForm'
import CouponList from './containers/CouponList'
import DeliveryList from './containers/DeliveryList'
import CreateDeliveryForm from './containers/delivery/CreateDeliveryForm'
import UpdateDeliveryForm from './containers/delivery/UpdateDeliveryForm'
import CommonSiteHeaderFooterForm  from './containers/CommonSiteHeaderFooterForm'
import PictureList from './containers/PictureList'
import MemberAnalysis from './containers/MemberAnalysis';
import AttibuteAnalysis from './containers/AttibuteAnalysis';
import DeliveryAnalysis from './containers/DeliveryAnalysis'
import DeliveryAnalysisContent from './components/analysis/delivery/Content'
import CouponAnalysisContent from './components/analysis/coupon/Content'
import QuestionnaireAnalysisContent from './components/analysis/questionnaire/Content'
import QuestionAnalysis from './containers/analysis/questionnaire/QuestionAnalysis'
import ConfigSiteForm from './containers/ConfigSiteForm'
import SiteMapConfigForm from './containers/SiteMapConfigForm'
import SiteMapConfigCreateForm from './containers/SiteMapConfigCreateForm'
import SiteMapConfigCompanyProfileForm from './containers/SiteMapConfigCompanyProfileForm'
import SiteMapConfigCompanyPageCreateForm from './containers/SiteMapConfigCompanyPageCreateForm'
import SiteMapShopPage from './containers/SiteMapShopPage'
import SiteMapConfigShopPageCreateForm from './containers/SiteMapConfigShopPageCreateForm'
import SiteMapConfigLinkAgeCreateForm from './containers/SiteMapConfigLinkAgeCreateForm'
import HeadOfficeTop  from './containers/HeadOfficeTop'
import SiteStoreList from './containers/SiteStoreList'
import SiteCompanySummary from './containers/SiteCompanySummary'
import MenuTopForm from './containers/MenuTopForm'
import MenuDetail  from './containers/MenuDetail'
import RandomCouponList from './containers/RandomCouponList'
import CreateRandomCouponForm from './containers/CreateRandomCouponForm'
import UpdateRandomCouponForm from './containers/UpdateRandomCouponForm'
import MenuFree from './containers/MenuFree'
import SiteNoLayout from './containers/SiteNoLayout'
import AreaSort  from './containers/AreaSort'

const routes = (
    <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/brand" component={BrandList}/>
        <Route path="/brand/create" component={CreateBrandForm}>
            <IndexRoute component={BrandInputForm}/>
            <Route path="confirm" component={BrandConfirm}/>
        </Route>
        <Route path="/brand/edit/:brandId" component={UpdateBrandForm}>
            <IndexRoute component={BrandInputForm}/>
            <Route path="confirm" component={BrandConfirm}/>
        </Route>
        <Route path="/section" component={SectionList}/>
        <Route path="/section/create" component={CreateSectionForm}>
            <IndexRoute component={SectionInputForm}/>
            <Route path="confirm" component={SectionConfirm}/>
        </Route>
        <Route path="/section/edit/:sectionId" component={UpdateSectionForm}>
            <IndexRoute component={SectionInputForm}/>
            <Route path="confirm" component={SectionConfirm}/>
        </Route>
        <Route path="/store" component={StoreList} />
        <Route path="/store/create" component={CreateStoreForm}>
            <IndexRoute component={StoreInputForm}/>
            <Route path="confirm" component={StoreConfirm}/>
        </Route>
        <Route path="/store/edit/:storeId" component={UpdateStoreForm}>
            <IndexRoute component={StoreInputForm}/>
            <Route path="confirm" component={StoreConfirm}/>
        </Route>
        <Route path="/user" component={UserList}/>
        <Route path="/user/create" component={CreateUserForm}/>
        <Route path="/user/edit/:userId" component={UpdateUserForm}/>
        <Route path="/member" component={MemberList}/>
        <Route path="/member/create" component={CreateMemberForm}/>
        <Route path="/member/edit/store/:storeId/member/:memberId" component={UpdateMemberForm}/>
        <Route path="/information" component={InformationList} />
        <Route path="/information/create" component={CreateInformationForm}/>
        <Route path="/information/edit/:informationId" component={UpdateInformationForm}/>
        <Route path="/section" component={SectionList}/>
        <Route path="/coupon/create"  component={CreateCouponForm} />
        <Route path="/area" component={AreaList}/>
        <Route path="/coupon" component={CouponList}/>
        <Route path="/coupon/edit/:couponId" component={UpdateCouponForm} />
        <Route path="/delivery" component={DeliveryList}/>
        <Route path="/delivery/create" component={CreateDeliveryForm}/>
        <Route path="/delivery/create/:deliveryId" component={CreateDeliveryForm}/>
        <Route path="/delivery/edit/:deliveryId" component={UpdateDeliveryForm}/>
        <Route path="/questionnaire" component={QuestionnaireList}/>
        <Route path="/questionnaire/create" component={CreateQuestionnaireForm}/>
        <Route path="/questionnaire/edit/:questionnaireId" component={UpdateQuestionnaireForm}/>
        <Route path="/site/common" component={CommonSiteHeaderFooterForm} />
        <Route path="/picture" component={PictureList}/>
        <Route path="/site/config/:brandId/:storeId" component={ConfigSiteForm} />
        <Route path="/site/map" component={SiteMapConfigForm} />
        <Route path="/site/map/create/:companyId/:brandId" component={SiteMapConfigCreateForm} />
        <Route path="/site/map/companypage/create/:companyId/:brandId/:pageType/:siteHierarchy" component={SiteMapConfigCompanyPageCreateForm} />
        <Route path="/site/map/shoppage/:companyId/:brandId/:pageType/:siteHierarchy" component={SiteMapShopPage}>
            <IndexRoute component={SiteMapConfigShopPageCreateForm}/>
            <Route path="linkage" component={SiteMapConfigLinkAgeCreateForm} />
        </Route>
        <Route path="/site/list/:companyId/:brandId/:siteId/:pageType" component={SiteMapConfigCompanyProfileForm} />
        <Route path="/memberanalysis" component={MemberAnalysis}/>
        <Route path="/attributeanalysis" component={AttibuteAnalysis}/>
        <Route path="/site/config/:brandId" component={HeadOfficeTop} />
        <Route path="/site/storelist/:brandId/:storeId" component={SiteStoreList} />
        <Route path="/site/profile/:brandId/:storeId" component={SiteCompanySummary} />
        <Route path="/site/menutop/:brandId/:storeId" component={MenuTopForm}/>
        <Route path="/site/menudetail/:brandId/:storeId/:siteId" component={MenuDetail} />
        <Route path="/randomCoupon" component={RandomCouponList}/>
        <Route path="/randomCoupon/create" component={CreateRandomCouponForm}/>
        <Route path="/randomCoupon/edit/:randomCouponId" component={UpdateRandomCouponForm}/>
        <Route path="/site/menufree/:brandId/:storeId/:siteId" component={MenuFree}/>
        <Route path="/site/nolayout/:brandId/:storeId/:siteId" component={SiteNoLayout}/>
        <Route path="/analysis" component={DeliveryAnalysis}>
            <Route path="delivery" component={DeliveryAnalysisContent}/>
            <Route path="coupon" component={CouponAnalysisContent}/>
            <Route path="questionnaire" component={QuestionnaireAnalysisContent}/>
        </Route>
        <Route path="/analysis/questionnaire/:questionnaireId/answer" component={QuestionAnalysis}/>
        <Route path="/areasort" component={AreaSort} />
    </Route>
);

export default routes
