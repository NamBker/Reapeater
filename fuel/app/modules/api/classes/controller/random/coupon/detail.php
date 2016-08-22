<?php

namespace Api;
class Controller_Random_Coupon_Detail extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'random_coupon_id' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('【RANDOM COUPON DETAIL API】:START');

        // 自ユーザ情報取得
        $user = \Model_User::find($this->user_id);
        if (empty($user)) {
            throw new \HttpForForbiddenException('無効なユーザーです');
        }

        // 引数情報取得
        $random_coupon = \Model_Random_Coupon::findByUserAndId($user, $this->params['random_coupon_id']);

        $result = array();
        if ($random_coupon) {
            $result = $random_coupon->toArray(PATTERN_ALL);
            if ($random_coupon->random_coupon_screen_picture) {
                $result['random_coupon_screen_picture']['filename'] = $random_coupon->random_coupon_screen_picture->picture_file_name;
                $picture_urls = \Model_Picture::makePictureUrl($random_coupon->random_coupon_screen_picture);
                $result['random_coupon_screen_picture']['thumbnail'] = $picture_urls['thumb_url'];
            }
            foreach ($random_coupon->random_coupon_items as $random_coupon_item) {
                $tmp = $random_coupon_item->toArray(PATTERN_ALL);
                $tmp['coupon'] = $random_coupon_item->coupon->toArray(PATTERN_ALL);
                if ($random_coupon_item->coupon_screen_picture) {
                    $tmp['coupon_screen_picture']['filename'] = $random_coupon_item->coupon_screen_picture->picture_file_name;
                    $picture_urls = \Model_Picture::makePictureUrl($random_coupon_item->coupon_screen_picture);
                    $tmp['coupon_screen_picture']['thumbnail'] = $picture_urls['thumb_url'];
                }
                $result['random_coupon_items'][] = $tmp;
            }
            $random_coupon_blank_item = $random_coupon->random_coupon_blank_item;
            $result['random_coupon_blank_item'] = $random_coupon_blank_item->toArray(PATTERN_ALL);
            $result['random_coupon_blank_item']['coupon'] = $random_coupon_blank_item->coupon->toArray(PATTERN_ALL);
            if ($random_coupon_blank_item->coupon_screen_picture) {
                $result['random_coupon_blank_item']['coupon_screen_picture']['filename'] = $random_coupon_blank_item->coupon_screen_picture->picture_file_name;
                $picture_urls = \Model_Picture::makePictureUrl($random_coupon_blank_item->coupon_screen_picture);
                $result['random_coupon_blank_item']['coupon_screen_picture']['thumbnail'] = $picture_urls['thumb_url'];
            }
        }
        $this->response_fields['random_coupon'] = $result;

        \Additional_Log::debug('【RANDOM COUPON DETAIL API】:END');
    }
}
