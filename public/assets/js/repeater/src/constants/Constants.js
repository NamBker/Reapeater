// modal
export const MODAL_CREATED_QUESTION_LIST = 'MODAL_CREATED_QUESTION_LIST';
export const MODAL_CREATE_QUESTION_FORM = 'MODAL_CREATE_QUESTION_FORM';
export const MODAL_PREVIEW = 'MODAL_PREVIEW';


export const USER_AUTHORITY_ADMIN = 1;
export const USER_AUTHORITY_COMPANY = 2;
export const USER_AUTHORITY_BRAND = 3;
export const USER_AUTHORITY_SECTION = 4;
export const USER_AUTHORITY_STORE = 5;

// status
export const BUSINESS_CONDITION_DELETE = 0;
export const BUSINESS_CONDITION_CLOSE = 1;
export const BUSINESS_CONDITION_PREPARE = 2;
export const BUSINESS_CONDITION_OPEN = 3;

// brand
export const BRAND_STATUS_DEFAULT_VALUE = 2;

// pattern status
export const GET_NAME_ONLY_PATTERN = 1;
export const GET_DISPLAY_ITEMS_ONLY_PATTERN = 2;
export const GET_ALL_PATTERN = 3;

// prefecture
export const PREFECTURE_HOKKAIDO = 1;
export const PREFECTURE_AOMORI = 2;
export const PREFECTURE_IWATE = 3;
export const PREFECTURE_MIYAGI = 4;
export const PREFECTURE_AKITA = 5;
export const PREFECTURE_YAMAGATA = 6;
export const PREFECTURE_FUKUSHIMA = 7;
export const PREFECTURE_IBARAKI = 8;
export const PREFECTURE_TOCHIGI = 9;
export const PREFECTURE_GUMMA = 10;
export const PREFECTURE_SAITAMA = 11;
export const PREFECTURE_CHIBA = 12;
export const PREFECTURE_TOKYO = 13;
export const PREFECTURE_KANAGAWA = 14;
export const PREFECTURE_NIIGATA = 15;
export const PREFECTURE_TOYAMA = 16;
export const PREFECTURE_ISHIKAWA = 17;
export const PREFECTURE_FUKUI = 18;
export const PREFECTURE_YAMANASHI = 19;
export const PREFECTURE_NAGANO = 20;
export const PREFECTURE_GIFU = 21;
export const PREFECTURE_SHIZUOKA = 22;
export const PREFECTURE_AICHI = 23;
export const PREFECTURE_MIE = 24;
export const PREFECTURE_SHIGA = 25;
export const PREFECTURE_KYOTO = 26;
export const PREFECTURE_OSAKA = 27;
export const PREFECTURE_HYOGO = 28;
export const PREFECTURE_NARA = 29;
export const PREFECTURE_WAKAYAMA = 30;
export const PREFECTURE_TOTTORI = 31;
export const PREFECTURE_SHIMANE = 32;
export const PREFECTURE_OKAYAMA = 33;
export const PREFECTURE_HIROSHIMA = 34;
export const PREFECTURE_YAMAGUCHI = 35;
export const PREFECTURE_TOKUSHIMA = 36;
export const PREFECTURE_KAGAWA = 37;
export const PREFECTURE_EHIME = 38;
export const PREFECTURE_KOCHI = 39;
export const PREFECTURE_FUKUOKA = 40;
export const PREFECTURE_SAGA = 41;
export const PREFECTURE_NAGASAKI = 42;
export const PREFECTURE_KUMAMOTO = 43;
export const PREFECTURE_OITA = 44;
export const PREFECTURE_MIYAZAKI = 45;
export const PREFECTURE_KAGOSHIMA = 46;
export const PREFECTURE_OKINAWA = 47;
export const PREFECTURE_ARRAY = [ "北海道", "青森県", "岩手県", "宮城県",
 "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県", "埼玉県",
 "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県",
 "山梨県", "長野県", "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県",
 "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県", "鳥取県", "島根県",
 "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県",
 "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県",
 "沖縄県"];

// gender
export const GENDER_MAN = 1;
export const GENDER_WOMAN = 2;
export const GENDER_ARRAY = ["男", "女"];

// job
export const JOB_PUBLIC_SERVANT = 1;
export const JOB_EXECUTIVE = 2;
export const JOB_FULL_TIME_WORKER = 3;
export const JOB_CONTRACT_WORKER = 4;
export const JOB_INDEFENDENT_BUSINESS = 5;
export const JOB_HIGH_SCHOOL_STUDENT = 6;
export const JOB_COLLEGE_STUDENT = 7;
export const JOB_PART_TIMEER = 8;
export const JOB_HOUSEWIFE = 9;
export const JOB_NONE = 10;
export const JOB_OTHER = 11;
export const JOB_ARRAY = ["公務員", "会社役員", "会社員（正社員）", "会社員（契約社員／派遣社員）",
 "自営業・自由業", "高校生", "大学生・大学院生", "パート・アルバイト", "主婦", "無職", "その他"];

//area type
export const AREA_TYPE_LARGE = 1;
export const AREA_TYPE_MEDIUM = 2;
export const AREA_TYPE_SMALL = 3;


// information status
export const INFORMATION_STATUS_NOT_PUBLIC = 0;
export const INFORMATION_STATUS_PUBLIC = 1;
export const INFORMATION_STATUS_DELETED = 2;
export const informationStatus = ['非公開', '公開', '削除'];

// questionnaries
export const QUESTIONNAIRE_RELEASE_FLG_UNPUBLISHED = 0;
export const QUESTIONNAIRE_RELEASE_FLG_PUBLISHED = 1;
export const QUESTIONNAIRE_TYPE_INITIAL_REGISTRATION = 1;
export const QUESTIONNAIRE_TYPE_OTHER = 2;

export const QUESTIONNAIRE_AGREEMENT_IS_NOT_SHOW = 0;
export const QUESTIONNAIRE_AGREEMENT_IS_SHOW = 1;
export const QUESTIONNAIRE_STATUS_UNUSED = 0;
export const QUESTIONNAIRE_STATUS_USING = 1;

// question
export const QUESTION_TYPE_FREE_TEXT_ONLY_HALF_SIZE = 1;
export const QUESTION_TYPE_FREE_TEXT = 2;
export const QUESTION_TYPE_TEXTAREA = 3;
export const QUESTION_TYPE_RADIO_BUTTON = 4;
export const QUESTION_TYPE_SELECT_BOX = 5;
export const QUESTION_TYPE_CHECK_BOX = 6;
export const QUESTION_TYPE_DATE = 7;
export const QUESTION_USED_FLG_UNPUBLISHED = 1;
export const QUESTION_USED_FLG_PUBLISHED = 2;

// delivery
export const DELIVERY_STATUS_DRAFT = 0;
export const DELIVERY_STATUS_UNDELIVERED = 1;
export const DELIVERY_STATUS_DELIVERED = 2;
export const DELIVERY_STATUS_DELIVERING = 3;
export const DELIVERY_STATUS_FAILED = 4;
export const DELIVERY_TYPE_MAIL = 1;
export const DELIVERY_TYPE_PUSH = 2;
export const DELIVERY_TYPE_GEO_PUSH = 3;
export const DELIVERY_TYPE_LINE = 4;
export const DELIVERY_DEVICE_ALL = 1;
export const DELIVERY_DEVICE_ANDROID = 2;
export const DELIVERY_DEVICE_IOS = 3;
export const DELIVERY_SEGMENT_GENDER_MAN = 1;
export const DELIVERY_SEGMENT_GENDER_WOMAN = 2;
export const DELIVERY_SEGMENT_GENDER_NOT_ANSWERED = 3;
export const DELIVERY_GENDER_MAN = 1;
export const DELIVERY_GENDER_WOMAN = 2;
export const DELIVERY_GENDER_NOT_ANSWERED = 3;


export const NOTIFICATION_DISPLAY_TIME = 3000;

// Page Size
export const PER_PAGE = 10;
export const PAGE_TYPE_HOME_TOP = 1;
export const PAGE_TYPE_STORE_TOP = 2;
export const PAGE_TYPE_STORE_LIST = 3;
export const PAGE_TYPE_MENU_TOP = 4;
export const PAGE_TYPE_MENU_DETAIL = 5;
export const PAGE_TYPE_COMPANY_SUMMARY = 6;
export const PAGE_TYPE_KODAWARY = 7;
export const PAGE_TYPE_RECRUITMENT = 8;
export const PAGE_TYPE_MERCHANT_RECRUITMENT= 9;
export const PAGE_TYPE_GENERAL_PURPOSE_PATTERN_1 = 10;
export const PAGE_TYPE_GENERAL_PURPOSE_PATTERN_2 = 11;
export const PAGE_TYPE_GENERAL_PURPOSE_PATTERN_3 = 12;
export const PAGE_TYPE_NO_LAYOUT= 13;
export const PAGE_TYPE_NO_MEMNU_LAYOUT= 14;
export const PAGE_TYPE_MAIL_MAGAZIN_COUPON= 15;
export const PAGE_TYPE_REGISTER_STORE_SELECTION= 16;

// site map config
export const SITE_MAP_CONFIG_COMPANY = [
  {'sitemap_name' : "ブランドトップ", 'sitemap_url' : "index", 'site_hierarchy': 1, 'page_type': 1},
  {'sitemap_name' : "店舗一覧", 'sitemap_url' : "shoplist", 'site_hierarchy': 2, 'page_type': 3},
  {'sitemap_name' : "メニュートップ", 'sitemap_url' : "menutop", 'site_hierarchy': 2, 'page_type': 4},
  {'sitemap_name' : "メニュー詳細", 'sitemap_url' : "menudetail", 'site_hierarchy': 3, 'page_type': 5},
  {'sitemap_name' : "メニュー/レイアウト無し", 'sitemap_url' : "menuplain", 'site_hierarchy': 3, 'page_type': 14},
  {'sitemap_name' : "レイアウト無し", 'sitemap_url' : "plain", 'site_hierarchy': 2, 'page_type': 13},
  {'sitemap_name' : "会社概要", 'sitemap_url' : "company", 'site_hierarchy': 2, 'page_type': 6},
];

export const SITE_MAP_CONFIG_STORE = [
 {'sitemap_name' : "店舗トップ", 'sitemap_url' : "index", 'site_hierarchy': 1, 'page_type': 2},
 {'sitemap_name' : "店舗一覧", 'sitemap_url' : "shoplist", 'site_hierarchy': 2, 'page_type': 3},
 {'sitemap_name' : "メニュートップ", 'sitemap_url' : "menutop", 'site_hierarchy': 2, 'page_type': 4},
 {'sitemap_name' : "メニュー詳細", 'sitemap_url' : "menudetail", 'site_hierarchy': 3, 'page_type': 5},
 {'sitemap_name' : "メニュー/レイアウト無し", 'sitemap_url' : "menuplain", 'site_hierarchy': 3, 'page_type': 14},
 {'sitemap_name' : "レイアウト無し", 'sitemap_url' : "plain", 'site_hierarchy': 2, 'page_type': 13},
 {'sitemap_name' : "会社概要", 'sitemap_url' : "company", 'site_hierarchy': 2, 'page_type': 6},
];

// site map page type
export const SITE_MAP_PAGE_TYPE =  [
    "ブランドトップ", "店舗トップ",  "店舗一覧",  "メニュートップ",
    "メニュー詳細", "会社概要", "こだわり", "人材募集",
    "加盟店募集", "汎用パターン1",  "汎用パターン2", "汎用パターン3",
    "レイアウト無し", "メニュー/レイアウト無し", "メールマガクーポン", "登録店舗選択"
];

// member
export const MEMBER_STATUS_REGISTERED = 1;
export const MEMBER_STATUS_WITHDRAW = 2;
export const MEMBER_DELIVERY_CONDITION_DENIED = 0;
export const MEMBER_DELIVERY_CONDITION_PERMITTED = 1;
export const MEMBER_DELIVERY_STATUS_ERROR = 0;
export const MEMBER_DELIVERY_STATUS_NORMAL = 1;
export const MEMBER_EMAIL_CHECK_RESULT_NOT_EXIST = 1;
export const MEMBER_EMAIL_CHECK_RESULT_EXIST_IN_OTHER_BRAND = 2;
export const MEMBER_EMAIL_CHECK_RESULT_ALREADY_EXIST = 3;

// random coupon
export const RANDOM_COUPON_STATUS_DISABLED = 0;
export const RANDOM_COUPON_STATUS_ENABLED = 1;
export const RANDOM_COUPON_SCREEN_FLG_UNDISPLAY = 0;
export const RANDOM_COUPON_SCREEN_FLG_DISPLAY = 1;

export const COUPON_LIMIT_TYPE_UNSET = 0;
export const COUPON_LIMIT_TYPE_SET = 1;
export const COUPON_LIMIT_TYPE_MAIL = 2;

// 状態
export const STATUS = ["削除", "閉店・休店", "準備", "営業中"];
