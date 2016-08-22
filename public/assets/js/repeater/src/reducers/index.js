import { combineReducers } from 'redux'
import { users, user_count } from './users'
import { currentUser, currentCompanies, currentBrands, currentAreas, currentStores } from './currentUser'
import { updateUser } from './updateUser'
import { brands, brands_count } from './brands'
import { stores, stores_count, storeDetail } from './stores'
import { companies } from './companies'
import { informations, information_count } from './informations'
import { updateBrand } from './updateBrand'
import { members, member_count, member_info } from './members'
import { sections, sections_count } from './sections'
import { areas, areas_count } from './areas'
import { count } from './count'
import { updateInformation } from './updateInfomation'
import { updateSection } from './updateSection'
import { updateCoupon } from './updateCoupon'
import { questionnaires, questionnaire_count } from './questionnaires'
import { doCreate } from './routes'
import { deliveries, delivery_detail, delivery_count, delivery_count_per_status } from './delivery'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { coupons, coupons_count } from './coupons'
import { notification } from './notification'
import { questions } from './questions'
import { modalType } from './modalType'
import { site_headers_footers, site_store_free, site_store_info, site_store_free_url, site_map, site_company_summary, site_store_free_all } from './site'
import { memberAnalysis } from './memberanalysis'
import { error } from './error'
import { randomCoupons, randomCouponCount } from './randomCoupon'
import { deliveryAnalysis } from './deliveryAnalysis'
import { couponAnalysis } from './couponAnalysis'
import { questionnaireAnalysis } from './questionnaireAnalysis'
import { questionAnalysis } from './questionAnalysis'

import { pictures, picture_count, picture } from './pictures'
import { updatePicture } from './updatePicture'
import { updateQuestionnaire } from './updateQuestionnaire'

const rootReducer = combineReducers({
    routing: routerReducer,
    count,
    modalType,
    users,
    user_count,
    currentUser,
    currentCompanies,
    currentBrands,
    currentAreas,
    currentStores,
    updateUser,
    brands,
    brands_count,
    stores,
    stores_count,
    storeDetail,
    companies,
    informations,
    information_count,
    updateBrand,
    members,
    member_count,
    member_info,
    areas,
    areas_count,
    sections,
    sections_count,
    updateInformation,
    updateSection,
    updateCoupon,
    questionnaires,
    questionnaire_count,
    doCreate,
    coupons,
    coupons_count,
    deliveries,
    delivery_detail,
    delivery_count,
    delivery_count_per_status,
    notification,
    questions,
    site_headers_footers,
    site_store_free,
    site_store_free_all,
    site_store_info,
    site_map,
    site_company_summary,
    updateQuestionnaire,
    pictures,
    picture_count,
    picture,
    updatePicture,
    memberAnalysis,
    site_store_free_url,
    error,
    randomCoupons,
    randomCouponCount,
    deliveryAnalysis,
    couponAnalysis,
    questionnaireAnalysis,
    questionAnalysis,
});

export default rootReducer
