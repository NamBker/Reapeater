<?php
// API実行権限設定
define("AUTHORITY",
    '{
        "/users":{"GET":3,"POST":3,"PUT":3,"DELETE":3},
        "/companies":{"GET":5,"POST":5,"PUT":5,"DELETE":5},
        "/brands":{"GET":5,"POST":5,"PUT":5,"DELETE":5},
        "/sections":{"GET":5,"POST":5,"PUT":5,"DELETE":5},
        "/stores":{"GET":5,"POST":5,"PUT":5,"DELETE":5},
        "/members":{"GET":5,"POST":5,"PUT":5,"DELETE":5},
        "/information":{"GET":5,"POST":5,"PUT":5,"DELETE":5},
        "/questionnaires":{"GET":4,"POST":4,"PUT":4,"DELETE":4},
        "/questions":{"GET":4,"POST":4,"PUT":4,"DELETE":4},
        "/coupons":{"GET":4,"POST":4,"PUT":4,"DELETE":4},
        "/deliveries":{"GET":5,"POST":5,"PUT":5,"DELETE":5},
        "/areas":{"GET":5,"POST":3,"PUT":3,"DELETE":3}
    }'
);

// ブランド作成時初期投入質問
define("INITIAL_QUESTION",
    '{
        "1":{"question_type":1,"question_body":"電話番号","question_char_limit":12,"question_nos":""},
        "2":{"question_type":7,"question_body":"生年月日","question_char_limit":0,"question_nos":""},
        "3":{"question_type":4,"question_body":"性別","question_char_limit":0,"question_nos":"男性,女性"},
        "4":{"question_type":5,"question_body":"職業","question_char_limit":0,"question_nos":"公務員,会社役員,会社員（正社員）,会社員（契約社員／派遣社員）,自営業・自由業,高校生,大学生・大学院生,パート・アルバイト,主婦,無職,その他"},
        "5":{"question_type":5,"question_body":"都道府県","question_char_limit":0,"question_nos":"北海道,青森県,岩手県,宮城県,秋田県,山形県,福島県,茨城県,栃木県,群馬県,埼玉県,千葉県,東京都,神奈川県,新潟県,富山県,石川県,福井県,山梨県,長野県,岐阜県,静岡県,愛知県,三重県,滋賀県,京都府,大阪府,兵庫県,奈良県,和歌山県,鳥取県,島根県,岡山県,広島県,山口県,徳島県,香川県,愛媛県,高知県,福岡県,佐賀県,長崎県,熊本県,大分県,宮崎県,鹿児島県,沖縄県"}
    }'
);

// DB接続
define('MASTER', 'master');
define('SLAVE', 'slave');

// 共通
define('DELETION_OFF', 0); // 未削除
define('DELETION_ON', 1); // 論理削除済み

// リクエストのメソッド
define('JSON', 'json');
define('GET', 'get');
define('POST', 'post');
define('DELETE', 'delete');
define('PUT', 'put');

// パターン
define('PATTERN_ONLY_KEY', 1);  // 主キー項目
define('PATTERN_LIST', 2);      // 一覧用項目
define('PATTERN_ALL', 3);       // 全項目

// 認証・認可
define('OAUTH_CLIENT_CLIENT_TYPE_WEB_APPLICATION', 1);
define('OAUTH_CLIENT_CLIENT_TYPE_USER_AGENT_BASE', 2);
define('OAUTH_CLIENT_CLIENT_TYPE_NATIVE_APPLICATION', 3);

// バッチ状況
define('BATCH_STATUS_READY', 0);    // 未実行
define('BATCH_STATUS_DOING', 1);    // 実行中
define('BATCH_STATUS_DONE', 2);     // 完了
define('BATCH_STATUS_ERROR', 3);    // エラー発生
define('BATCH_DUPLICATE_OVERWRITE', 2);    // 上書き処理

// User
define('USER_AUTHORITY_ADMIN', 1);      // 管理者
define('USER_AUTHORITY_COMPANY', 2);    // 企業
define('USER_AUTHORITY_BRAND', 3);      // ブランド
define('USER_AUTHORITY_SECTION', 4);    // 事業部
define('USER_AUTHORITY_STORE', 5);      // 店舗

// ユーザ属性
define('USER_ATTRIBUTE_GENDER_MEN', 1);      // 男性
define('USER_ATTRIBUTE_GENDER_WOMAN', 2);   // 女性
define('USER_ATTRIBUTE_GENDER_UNKNOWN', 3); // 未回答

// status
define('STATUS_DELETE', 0);
define('STATUS_CLOSED', 1);
define('STATUS_PREPARATION', 2);
define('STATUS_DURING_BUSINESS', 3);
// status name
define('STATUS_DELETE_LABEL', '削除');
define('STATUS_CLOSED_LABEL', '閉店・休店');
define('STATUS_PREPARATION_LABEL', '準備中');
define('STATUS_DURING_BUSINESS_LABEL', '営業中');

// store status
define('STORE_STATUS_DELETE', 0);
define('STORE_STATUS_CLOSED', 1);
define('STORE_STATUS_PREPARATION', 2);
define('STORE_STATUS_DURING_BUSINESS', 3);

// company status
define('COMPANY_STATUS_DELETE', 0);
define('COMPANY_STATUS_CLOSED', 1);
define('COMPANY_STATUS_PREPARATION', 2);
define('COMPANY_STATUS_DURING_BUSINESS', 3);

// brand status
define('BRAND_STATUS_DELETE', 0);
define('BRAND_STATUS_CLOSED', 1);
define('BRAND_STATUS_PREPARATION', 2);
define('BRAND_STATUS_DURING_BUSINESS', 3);

// brand member status
define('BRAND_MEMBER_STATUS_TEMPORARY', 0);      // 仮登録
define('BRAND_MEMBER_STATUS_REGISTRATION', 1);  // 登録済

// store member status
define('STORE_MEMBER_STATUS_ACTIVE', 1);      // 会員
define('STORE_MEMBER_STATUS_WITHDRAWAL', 2);  // 退会済み
define('STORE_MEMBER_CHECK_STATUS_NOT_EXIST', 1);               // 登録されてないメールアドレス
define('STORE_MEMBER_CHECK_STATUS_EXIST_IN_OTHER_BRAND', 2);    // 他のブランドに登録されているメールアドレス
define('STORE_MEMBER_CHECK_STATUS_ALREADY_EXIST', 3);           // 登録済みのメールアドレス

define('STORE_MEMBER_MAIL_RECEPTION_UNSENDABLE', 0);   // 受信不可
define('STORE_MEMBER_MAIL_RECEPTION_CLEAR', 1);  // 受信可

define('STORE_MEMBER_MAIL_DELIVERY_STATUS_ERROR', 0);   // エラー
define('STORE_MEMBER_MAIL_DELIVERY_STATUS_NORMAL', 1);  // 正常

// questionnaires
define('QUESTIONNAIRES_RELEASED', 1); // アンケート公開済み
define('QUESTIONNAIRES_DO_DELETE', 0); // 削除処理実施

// questions
define('QUESTIONNAIRES_TYPE_INITIAL', 1);   // 種別タイプ 1:登録初期アンケート
define('QUESTIONNAIRES_TYPE_OTHER', 2);     // 種別タイプ 2:その他
define('QUESTION_TYPE_FREE_TEXT', 1);       // 回答タイプ 1:フリーテキスト(半角英数字)
define('QUESTION_TYPE_FREE_TEXT2', 2);      // 回答タイプ 2:フリーテキスト(全角)
define('QUESTION_TYPE_FREE_TEXT3', 3);      // 回答タイプ 3:テキストエリア(全角)
define('QUESTION_TYPE_RADIO', 4);            // 回答タイプ 4:単一選択形式(ラジオボタン)
define('QUESTION_TYPE_SELECT_ONE', 5);      // 回答タイプ 5:単一選択形式(セレクトボックス)
define('QUESTION_TYPE_SELECT_MANY', 6);     // 回答タイプ 6:複数選択形式)
define('QUESTION_TYPE_DATE', 7);             // 回答タイプ 7:日付選択形式
define('QUESTION_USED_FLG_NOT_RELEASED', 1);    // 公開フラグ 1:未公開
define('QUESTION_USED_FLG_RELEASED', 2);        // 公開フラグ 2:公開済み

// deliver
define('RELEASED', 2); // リリース済み
define('DELIVERY_STATUS_DRAFT', 0); // 下書き
define('DELIVERY_STATUS_UNDELIVERED', 1); // 未配信
define('DELIVERY_STATUS_DELIVERED', 2); // 配信済み
define('DELIVERY_STATUS_DELIVERING', 3); // 配信中
define('DELIVERY_STATUS_ERROR', 4); // 配信エラー
define('DELIVERY_TYPE_MAIL', 1);    // メール
define('DELIVERY_TYPE_PUSH', 2);    // PUSH通知
define('DELIVERY_TYPE_GEO_PUSH', 3);    // ジオPUSH
define('DELIVERY_TYPE_LINE', 4);    // LINE@
define('DELIVERY_REPICA_STATUS_UNCHECKED', 0); // 未確認
define('DELIVERY_REPICA_STATUS_CHECKING', 1); // 確認中
define('DELIVERY_REPICA_STATUS_CHECKED', 2); // 確認済み
define('DELIVERY_REPICA_STATUS_ERROR', 3); // 確認エラー
define('DELIVERY_REPICA_SEND_SUCCESS', 0); // レピカメール正常終了

// information publisher
define('INFORMATION_PUBLISHER_TYPE_COMPANY', 1);
define('INFORMATION_PUBLISHER_TYPE_BRAND', 2);
define('INFORMATION_PUBLISHER_TYPE_STORE', 3);

// csv import duplicate process type
define('CSV_IMPORT_DUPLICATE_PROCESS_TYPE_SKIP', 1);
define('CSV_IMPORT_DUPLICATE_PROCESS_TYPE_OVERWRITE', 2);

// csv import target table
define('CSV_IMPORT_TARGET_TABLE_STORES', 1);    // 店舗テーブル
define('CSV_IMPORT_TARGET_TABLE_MEMBERS', 2);   // 会員テーブル

// coupon status
define('COUPON_LIMIT_TYPE_UNSET', 0); // 設定無し
define('COUPON_LIMIT_TYPE_SET', 1); // 期日設定型
define('COUPON_LIMIT_TYPE_MAIL', 2); // メルマガ送信型
define('COUPON_STATUS_ACTIVE', 1); // 有効

// delivery
define('DELIVERY_RELEASE_FLG_PUBLISHED', 1); // 公開済み

// member delivery history
define('SITE_REFERENCE_DELIVERY_FAILURE', 0);  // 配信失敗
define('SITE_REFERENCE_UNREFERENCED', 1);   // 配信済み未参照
define('SITE_REFERENCE_REFERENCED', 2);   // 配信済み参照済み

// random coupon
define('RANDOM_COUPON_DELETED', 1);    // 論理削除済み

// site map page type
define('PAGE_TYPE_HOME_TOP', 1);
define('PAGE_TYPE_STORE_TOP', 2);
define('PAGE_TYPE_STORE_LIST', 3);
define('PAGE_TYPE_MENU_TOP', 4);
define('PAGE_TYPE_MENU_DETAIL', 5);
define('PAGE_TYPE_COMPANY_SUMMARY', 6);
define('PAGE_TYPE_KODAWARY', 7);
define('PAGE_TYPE_RECRUITMENT', 8);
define('PAGE_TYPE_MERCHANT_RECRUITMENT', 9);
define('PAGE_TYPE_GENERAL_PURPOSE_PATTERN_1', 10);
define('PAGE_TYPE_GENERAL_PURPOSE_PATTERN_2', 11);
define('PAGE_TYPE_GENERAL_PURPOSE_PATTERN_3', 12);
define('PAGE_TYPE_NO_LAYOUT', 13);
define('PAGE_TYPE_NO_MEMNU_LAYOUT', 14);
define('PAGE_TYPE_MAIL_MAGAZIN_COUPON', 15);
define('PAGE_TYPE_REGISTER_STORE_SELECTION', 16);

define('DISPLAY_TYPE_ALL_SHOP', 1);
define('DISPLAY_TYPE_AREA', 2);

define('NOAREA_LABEL', 2);
