<?php
namespace Web;

class Controller_Store extends \Controller
{
    public function before()
    {
        parent::before();
        if (!\Auth::check()) {
            \Response::redirect_back('web/user/login');
        }
        $this->user = \Model_User::find('first',
            array('where' => array('id' => \Auth::instance()->get('id')))
        );
        if (empty($this->user)) {
            \Auth::logout();
            \Response::redirect_back('web/user/login');
        }
    }

    function action_export()
    {
        \Additional_Log::debug('【STORE CSV EXPORT】:START');

        $params = \Input::get();
        unset($params['page']);
        unset($params['per_page']);
        $params['pattern'] = PATTERN_ALL;

        \Additional_Log::debug(print_r($params, true));

        $stores = \Model_Store::getStoresByParams($this->user, $params);
        \Additional_Log::debug(\DB::last_query());

        $csv_header = array(
            'ブランドコード',
            '店舗コード',
            '店舗名',
            '状態',
            '郵便番号',
            '都道府県',
            '市区町村',
            'ビル名等',
            'アクセス',
            '電話番号',
            'FAX',
            '店長名',
            '営業時間',
            '定休日',
            '駐車場情報',
            '席情報',
            'キッズルーム',
            'メール署名',
            '利用規約',
            'プライバシーポリシー',
            'フリーワード',
//            '店舗ヘッダ画像',
            'SEOキーワード1',
            'SEOキーワード2',
            'SEOキーワード3',
        );

        // ダウンロード開始
        $filename = 'store_'.date('YmdHis', time()).'.csv';
        $response = new \Response();
        $response->set_header('Content-Type', 'octet-stream; charset:SJIS-win');
        $response->set_header('Content-Disposition', 'attachment; filename="'.$filename.'"');
        $stream = fopen('php://output', 'w');
        fputs($stream, $this->arrayToCsvString($csv_header)."\r\n");

        foreach ($stores as $store) {
            $rec = array();

            $rec[] = '"'.$store->brand->brand_code.'"';
            $rec[] = '"'.$store->store_code.'"';
            $rec[] = '"'.$store->store_name.'"';
            $rec[] = '"'.$store->store_status.'"';
            $rec[] = '"'.$store->store_postal_code.'"';
            $rec[] = '"'.$store->store_prefectures.'"';
            $rec[] = '"'.$store->store_address.'"';
            $rec[] = '"'.$store->store_building.'"';
            $rec[] = '"'.$store->store_access.'"';
            $rec[] = '"'.$store->store_phone_no.'"';
            $rec[] = '"'.$store->store_fax_no.'"';
            $rec[] = '"'.$store->store_manager_name.'"';
            $rec[] = '"'.$store->store_business_hours.'"';
            $rec[] = '"'.$store->store_regular_holiday.'"';
            $rec[] = '"'.$store->store_parking_lot.'"';
            $rec[] = '"'.$store->store_seat.'"';
            $rec[] = '"'.$store->store_kids_room.'"';
            $rec[] = '"'.$store->store_signature_block.'"';
            $rec[] = '"'.$store->store_terms_of_use.'"';
            $rec[] = '"'.$store->store_privacy_policy.'"';
            $rec[] = '"'.$store->store_freeword.'"';
            $rec[] = '"'.$store->store_seo_key1.'"';
            $rec[] = '"'.$store->store_seo_key2.'"';
            $rec[] = '"'.$store->store_seo_key3.'"';

            fputs($stream, $this->arrayToCsvString($rec)."\r\n");
        }
        \Additional_Log::debug('【STORE CSV EXPORT】:END');
        return $response->send(true);
    }

    private function arrayToCsvString($data)
    {
        $csv_data = implode(',', $data);
        return mb_convert_encoding($csv_data, 'CP932', 'ASCII,JIS,UTF-8,encJP-win,SJIS-win');
    }
}
