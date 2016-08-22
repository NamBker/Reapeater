<?php
namespace Web;

class Controller_Member extends \Controller
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
        \Additional_Log::debug('【MEMBER CSV EXPORT】:START');

        $user = \Auth::instance()->get_user();
        $params = \Input::get();
        unset($params['page']);
        unset($params['per_page']);
        $params['pattern'] = PATTERN_ALL;
        $res = \Model_Store_Member::getMembersByParams($user, $params);

        $csv_header = array(
            'ブランドコード',
            '店舗コード',
            'メールアドレス',
            'メルマガ配信可否',
            'アカウント登録状態',
            '会員登録日',
            '会員退会日',
            '名前',
            '電話番号',
            '生年月日',
            '性別',
            '職業',
            '都道府県',
        );

        // ダウンロード開始
        $filename = 'member_'.date('YmdHis', time()).'.csv';
        $response = new \Response();
        $response->set_header('Content-Type', 'octet-stream; charset:SJIS-win');
        $response->set_header('Content-Disposition', 'attachment; filename="'.$filename.'"');
        $stream = fopen('php://output', 'w');
        fputs($stream, $this->arrayToCsvString($csv_header)."\r\n");

        $results = $res['members'];

        foreach ($results as $store_member) {
            $brand_member = $store_member->brand_member;
            $rec = array();

            $rec[] = $brand_member->brand->brand_code;
            $rec[] = $store_member->store->store_code;
            $rec[] = $brand_member->mail_address;
            $rec[] = $store_member->mail_reception;
            $rec[] = $store_member->store_member_status;
            $rec[] = $store_member->member_registration_date;
            $rec[] = $store_member->member_leave_date;
            $rec[] = $brand_member->name;
            $rec[] = $brand_member->tel_no;
            $rec[] = $brand_member->birthday;
            $rec[] = $brand_member->gender;
            $rec[] = $brand_member->job;
            $rec[] = $brand_member->prefecture;

            $member_arr[] = $rec;
            fputs($stream, $this->arrayToCsvString($rec)."\r\n");
        }
        \Additional_Log::debug('【MEMBER CSV EXPORT】:END');
        return $response->send(true);
    }

    private function arrayToCsvString($data)
    {
        $csv_data = implode(',', $data);
        return mb_convert_encoding($csv_data, 'CP932', 'ASCII,JIS,UTF-8,encJP-win,SJIS-win');
    }
}
