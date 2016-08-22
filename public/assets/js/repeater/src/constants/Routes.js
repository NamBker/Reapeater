
const routes = {
    '/user': {
        // アカウントー覧
        title: 'menu_user_list',
        child: '/user',
        createBtn: 'menu_btn_account_create',
        authority: 3,
    },
    '/user/create': {
        // アカウント作成
        title: 'menu_user_create',
        parent: '/user',
        authority: 3,
    },
    '/user/create/confirm': {
        // アカウント作成
        title: 'menu_user_create_confirm',
        parent: '/user',
        authority: 3,
    },
    '/user/edit/:userId': {
        // アカウント編集
        title: 'menu_user_update',
        parent: '/user',
        authority: 3,
    },
    '/user/edit/:userId/confirm': {
        // アカウント編集
        title: 'menu_user_update_confirm',
        parent: '/user',
        authority: 3,
    },

    '/brand': {
        // ブランドー覧
        title: 'menu_brand_list',
        createBtn: 'menu_btn_brand_create',
        child: '/brand',
        authority: 3,
    },
    '/brand/create': {
        // ブランド作成
        title: 'menu_brand_create',
        parent: '/brand',
        authority: 3,
    },
    '/brand/create/confirm': {
        // ブランド作成
        title: 'menu_brand_create_confirm',
        parent: '/brand',
        authority: 3,
    },
    '/brand/edit/:brandId': {
        // ブランド編集
        title: 'menu_brand_update',
        parent: '/brand',
        authority: 3,
    },
    '/brand/edit/:brandId/confirm': {
        // ブランド編集
        title: 'menu_brand_update_confirm',
        parent: '/brand',
        authority: 3,
    },

    '/store': {
        // 店舗一覧
        title: 'menu_store_list',
        createBtn: 'menu_btn_store_create',
        child: '/store',
        authority: 4,
    },
    '/store/create': {
        // 店舗作成
        title: 'menu_store_create',
        parent: '/store',
        authority: 4,
    },
    '/store/create/confirm': {
        // 店舗作成
        title: 'menu_store_create_confirm',
        parent: '/store',
        authority: 4,
    },
    '/store/edit/:storeId': {
        // 店舗編集
        title: 'menu_store_update',
        parent: '/store',
        authority: 4,
    },
    '/store/edit/:storeId/confirm': {
        // 店舗編集
        title: 'menu_store_update_confirm',
        parent: '/store',
        authority: 4,
    },

    '/member': {
        // 会員一覧
        title: 'menu_member_list',
        createBtn: 'menu_btn_member_create',
        child: '/member',
        authority: 5,
    },
    '/member/create': {
        // 会員作成
        title: 'menu_member_create',
        createBtn: 'menu_btn_member_csv_upload',
        doCustomCreate: true,
        parent: '/member',
        authority: 5,
    },
    '/member/edit/store/:storeId/member/:memberId': {
        // 会員編集
        title: 'menu_member_update',
        parent: '/member',
        authority: 5,
    },

    '/information': {
        // お知らせ一覧
        title: 'menu_information_list',
        createBtn: 'menu_btn_information_create',
        authority: 5,
    },
    '/information/create': {
        // お知らせ作成
        title: 'menu_information_create',
        parent: '/information',
        authority: 5,
    },
    '/information/edit/:informationId': {
        // お知らせ編集
        title: 'menu_information_update',
        parent: '/information',
        authority: 5,
    },

    '/section': {
        // 事業部一覧
        title: 'menu_section_list',
        child: '/section/create',
        createBtn: 'menu_btn_section_create',
        authority: 4,
    },
    '/section/create': {
        // 事業部作成
        title: 'menu_section_create',
        parent: '/section',
        authority: 4,
    },
    '/section/create/confirm': {
        // 事業部作成
        title: 'menu_section_create_confirm',
        parent: '/section',
        authority: 4,
    },
    '/section/edit/:sectionId': {
        // 事業部編集
        title: 'menu_section_update',
        parent: '/section',
        authority: 4,
    },
    '/section/edit/:sectionId/confirm': {
        // 事業部編集
        title: 'menu_section_update_confirm',
        parent: '/section',
        authority: 4,
    },

    '/area': {
        // エリア一覧
        title: 'menu_area_list',
        child: '/area/create',
        createBtn: 'menu_btn_area_create',
        doCustomCreate: true,
        authority: 3,
    },

    '/questionnaire': {
        // アンケート一覧
        title: 'menu_questionnaires_list',
        createBtn: 'menu_btn_questionnaires_create',
        child: '/questionnaire',
        authority: 4,
    },
    '/questionnaire/create': {
        // アンケート作成
        title: 'menu_questionnaires_create',
        parent: '/questionnaire',
        authority: 4,
    },

    '/questionnaire/edit/:questionnaireId': {
        // アンケート編集
        title: 'menu_questionnaires_update',
        parent: '/questionnaire',
        authority: 4,
    },

    '/coupon': {
        // クーポン一覧
        title: 'menu_coupon_list',
        child: '/coupon',
        authority: 4,
        createBtn: 'menu_btn_coupon_create',
    },
    '/coupon/create': {
        // クーポン作成
        title : 'menu_coupon_create',
        parent: '/coupon',
        authority: 4,
    },
    '/coupon/edit/:couponId': {
        // クーポン編集
        title: 'menu_coupon_update',
        parent: '/coupon',
        authority: 4,
    },

    '/randomCoupon': {
        // ランダムクーポン一覧
        title: 'menu_random_coupon_list',
        child: '/randomCoupon',
        authority: 5,
        createBtn: 'menu_btn_random_coupon_create',
    },
    '/randomCoupon/create': {
        // ランダムクーポン作成
        title: 'menu_random_coupon_create',
        parent: '/randomCoupon',
        authority: 5,
    },
    '/randomCoupon/edit/:randomCouponId': {
        // ランダムクーポン編集
        title: 'menu_random_coupon_update',
        parent: '/randomCoupon',
        authority: 5,
    },

    '/delivery': {
        // メールマガジン一覧
        title: 'menu_mail_list',
        createBtn: 'menu_btn_mail_create',
        parent: '/delivery',
        authority: 5,
    },
    '/delivery/create': {
        // メールマガジン作成
        title: 'menu_mail_create',
        parent: '/delivery',
        authority: 5,
    },
    '/delivery/create/:deliveryId': {
        // メールマガジン作成
        title: 'menu_mail_create',
        parent: '/delivery',
        authority: 5,
    },
    '/delivery/edit/:deliveryId': {
        // メールマガジン編集
        title: 'menu_mail_update',
        parent: '/delivery',
        authority: 5,
    },

    '/picture': {
        // 画像管理
        title: 'menu_site_picture',
        child: '/picture/create',
        createBtn: 'menu_btn_picture_create',
        doCustomCreate: true,
        authority: 4,
    },

    '/site' : {
        // サイト管理
        title: 'menu_site_management',
        child: '/site',
        authority: 3,
    },

    '/site/common': {
        // ブランド共通ヘッダ・フッタ設定
        title: 'menu_site_header_footer',
        parent: '/site/map',
        authority: 3,
    },

    '/site/config/:brandId/:storeId': {
        // 店舗トップページ設定
        title: 'menu_site_config',
        parent: '/site/map',
        authority: 3,
    },

    '/site/map/create/:companyId/:brandId': {
        // サイトマップページの追加
        title: 'menu_site_map_create',
        parent: '/site/map',
        authority: 3,
    },

    '/site/map': {
        // サイトマップ設定
        title: 'menu_site_map',
        child: '/site/map',
        authority: 3,
    },

    '/site/list/:companyId/:brandId/:siteId/:pageType': {
        // サイトマップ用店舗一覧
        title : 'menu_site_map_company_profile',
        parent: '/site/map',
        authority: 3,
    },

    '/site/config/:brandId': {
        // ブランドトップページ設定
        title: 'menu_site_head_office_top',
        parent: '/site/map',
        authority: 3,
    },

    '/site/storelist/:brandId/:storeId': {
        // 店舗一覧
        title: 'menu_site_store_list',
        parent: '/site/map',
        authority: 3,
    },

    '/site/profile/:brandId/:storeId': {
        // 会社概要
        title: 'menu_site_company_summary',
        parent: '/site/map',
        authoriry: 3,
    },

    '/site/menutop/:brandId/:storeId': {
        // メニュー一覧
        title: 'menu_site_menu_top',
        authority: 5,
    },

    '/site/menudetail/:brandId/:storeId/:siteId': {
        // 新規メニュー作成
        title: 'menu_site_detail',
        parent: '/site/map',
        authority: 5,
    },

    '/site/menufree/:brandId/:storeId/:siteId': {
        // 新規メニュー（フリーレイアウト）作成
        title: 'menu_free',
        parent: '/site/map',
        authority: 5,
    },

    '/site/nolayout/:brandId/:storeId/:siteId': {
        // レイアウト無し
        title: 'no_layout_title',
        parent: '/site/map',
        authority: 5,
    },

    '/memberanalysis': {
        // 会員分析
        title: 'menu_member_analysis',
        child: '/memberanalysis',
        authority: 5,
    },

    '/attributeanalysis': {
        // 会員属性
        title: 'menu_attribute_analysis',
        authority: 5,
    },

    '/analysis/delivery': {
        // メールマガジン分析
        title: 'menu_analyze_mail',
        authority: 5,
    },
    '/analysis/coupon': {
        // クーポン分析
        title: 'menu_analyze_coupon',
        authority: 5,
    },
    '/analysis/questionnaire': {
        // アンケート分析
        title: 'menu_analyze_questionnaire',
        authority: 5,
    },
    '/analysis/questionnaire/:questionnaireId/answer': {
        // アンケート分析 詳細
        title: 'menu_analyze_questionnaire_answer',
        authority: 5,
        parent: '/analysis/questionnaire',
    },

    '/site/map/companypage/create/:companyId/:brandId/:pageType/:siteHierarchy': {
        title: 'menu_site_map_company_page_add',
        parent: '/site/map',
        authority: 4,
    },

    '/site/map/shoppage/:companyId/:brandId/:pageType/:siteHierarchy': {
        title: 'menu_site_map_shop_page_add',
        parent: '/site/map',
        authority: 4,
    },

    '/site/map/shoppage/:companyId/:brandId/:pageType/:siteHierarchy/linkage': {
        title: 'menu_site_map_link_age_add',
        parent: '/site/map',
        authority: 4,
    },

    '/site/map/shoppage/create/:companyId/:brandId/:pageType': {
        title: 'menu_site_map_shop_page_add',
        parent: '/site/map',
        authority: 4,
    },

    '/site/map/linkage/create/:companyId/:brandId/:pageType': {
        title: 'menu_site_map_link_age_add',
        parent: '/site/map',
        authority: 4,
    },

    '/areasort': {
        title: 'menu_area_sort',
        parent: '/store',
        authority: 4,
    },
};

export default routes;
