<?php

namespace Api;
class Controller_Random_Coupon extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'random_coupon_title' => false,
            'statuses' => false,
            'page' => false,
            'per_page' => false,
            'pattern' => true,
        ),
        'create' => array(
            'random_coupon_name' => true,
            'random_coupon_status' => true,
            'random_coupon_screen_flg' => true,
            'random_coupon_screen_free_text_top' => false,
            'random_coupon_screen_picture_id' => false,
            'random_coupon_screen_button_label' => false,
            'random_coupon_screen_free_text_bottom' => false,
            'random_coupon_items' => true,
            'random_coupon_blank_item' => true,
        ),
        'update' => array(
            'random_coupon_id' => true,
        ),
        'delete' => array(
            'delete_ids' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('【RANDOM COUPON FETCH API】:START');
        $user = \Model_User::find($this->user_id);
        if (empty($user)) {
            throw new \HttpForbiddenException('無効なユーザです');
        }

        $conditions = $this->makeConditionForUser($user);

        if ($this->is_setted_param('random_coupon_title')) {
            $conditions[] = array('random_coupon_name', 'LIKE', "%{$this->params['random_coupon_title']}%");
        }
        if ($this->is_setted_param('statuses')) {
            $conditions[] = array('random_coupon_status', 'IN', $this->params['statuses']);
        }
        $conditions[] = array('random_coupon_deleted_flg', '!=', RANDOM_COUPON_DELETED);

        $find_params = array();
        if (0 < count($conditions)) {
            $find_params['where'] = $conditions;
        }
        $count_params = $find_params;

        if ($this->is_setted_param('page') && $this->is_setted_param('per_page')) {
            $find_params['offset'] = ($this->params['page'] - 1) * $this->params['per_page'];
            $find_params['limit'] = $this->params['per_page'];
        }
        // そーと条件を設定 TODO
        if (true) {
            $find_params['order_by'] = array('created_at' => 'desc');
        }
        $pattern = $this->params['pattern'];
        $res = \Model_Random_Coupon::find('all', $find_params);
        $count = \Model_Random_Coupon::count($count_params);
        $records = array();
        foreach($res as $random_coupon) {
            $records[] = $random_coupon->toArray($pattern);
        }
        $this->response_fields['random_coupons'] = $records;
        $this->response_fields['count'] = $count;

        \Additional_Log::debug('【RANDOM COUPON FETCH API】:END');
    }

    /**
     * ランダムクーポン情報登録
     */
    protected function create()
    {
        \Additional_Log::debug('【RANDOM COUPON CREATE API】:START');

        $user = \Model_User::find($this->user_id);
        if (empty($user)) {
            throw new \HttpForbiddenException('無効なユーザです');
        }

        $random_coupon = \Model_Random_Coupon::forge();
        $random_coupon->company_id = 0;
        $random_coupon->brand_id = 0;
        $random_coupon->section_id = 0;
        $random_coupon->store_id = 0;
        switch ($user->authority) {
        case USER_AUTHORITY_STORE:
            $random_coupon->store_id = $user->store_id;
        case USER_AUTHORITY_SECTION:
            $random_coupon->section_id = $user->section_id;
        case USER_AUTHORITY_BRAND:
            $random_coupon->brand_id = $user->brand_id;
        case USER_AUTHORITY_COMPANY:
            $random_coupon->company = $user->company;
        }

        $this->setModelByParams($random_coupon, $this->params, $user);
        $random_coupon->save();

        \Additional_Log::debug('【RANDOM COUPON CREATE API】:END');
    }

    /**
     * ランダムクーポン更新
     */
    protected function update()
    {
        \Additional_Log::debug('【RANDOM COUPON UPDATE API】:START');

        $user = \Model_User::find($this->user_id);
        if (empty($user)) {
            throw new \HttpForbiddenException('無効なユーザです');
        }
        $conditions = $this->makeConditionForUser($user);
        $random_coupon_id = $this->params['random_coupon_id'];
        $conditions[] = array('id', $random_coupon_id);

        $target = \Model_Random_Coupon::find('first', array(
            'where' => $conditions,
        ));

        if ($target) {
            if (!isset($this->params['random_coupon_name']) && isset($this->params['random_coupon_status'])) {
                // ステータスのみ更新
                $target->random_coupon_status = $this->params['random_coupon_status'];
            } else {
                $this->setModelByParams($target, $this->params, $user);
            }
            $target->save();
        } else {
            throw new \ProtocolException(\Lang::get('authority_error'), "You don't have permission to access.", \ProtocolException::RESULT_CODE_EXECUTE_AUTHORITY);
        }

        \Additional_Log::debug('【RANDOM COUPON UPDATE API】:END');
    }

    /**
     * ランダムクーポン削除
     */
    protected function delete()
    {
        \Additional_Log::debug('【RANDOM COUPON DELETE API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);
        if (empty($user)) {
            throw new \HttpForbiddenException('無効なユーザです');
        }
        $conditions = $this->makeConditionForUser($user);
        $conditions[] = array('id', 'IN', $this->params['delete_ids']);

        $targets = \Model_Random_Coupon::find('all', array(
            'where' => $conditions,
        ));

        foreach ($targets as $random_coupon) {
            $random_coupon->random_coupon_deleted_flg = RANDOM_COUPON_DELETED;
            $random_coupon->save();
        }

        \Additional_Log::debug('【RANDOM COUPON DELETE API】:END');
    }

    private function makeConditionForUser($user)
    {
        $conditions = array();
        switch($user->authority) {
            case USER_AUTHORITY_STORE:
                $conditions[] = array('store_id', 'IN', $user->store_id);
            case USER_AUTHORITY_SECTION:
                $conditions[] = array('section_id', $user->section_id);
            case USER_AUTHORITY_BRAND:
                $conditions[] = array('brand_id', $user->brand_id);
            case USER_AUTHORITY_COMPANY:
                $conditions[] = array('company_id', $user->company_id);
                break;
        }
        $conditions[] = array('random_coupon_deleted_flg', '!=', RANDOM_COUPON_DELETED);
        return $conditions;
    }

    private function setModelByParams($target, $params, $user)
    {
        $picture = null;
        if (isset($params['random_coupon_screen_picture_id']) && $params['random_coupon_screen_picture_id']) {
            $picture = \Model_Picture::findByUserAndId($user, $params['random_coupon_screen_picture_id']);
            if (empty($picture)) {
                throw new \ProtocolException(\Lang::get('authority_error'), "You don't have permission to access.", \ProtocolException::RESULT_CODE_EXECUTE_AUTHORITY);
            }
        }
        $target->random_coupon_name = $params['random_coupon_name'];
        $target->random_coupon_status = $params['random_coupon_status'];
        $target->random_coupon_screen_flg = $params['random_coupon_screen_flg'];
        $target->random_coupon_screen_free_text_top = $params['random_coupon_screen_free_text_top'];
        $target->random_coupon_screen_picture_id = empty($picture) ? 0 : $picture->id;
        $target->random_coupon_screen_button_label = $params['random_coupon_screen_button_label'];
        $target->random_coupon_screen_free_text_bottom = $params['random_coupon_screen_free_text_bottom'];

        if (count($params['random_coupon_items']) < 1) {
            throw new \ProtocolException(\Lang::get('authority_error'), "You don't have permission to access.", \ProtocolException::RESULT_CODE_EXECUTE_AUTHORITY);
        }

        $edited_items = array();
        foreach($params['random_coupon_items'] as $item) {
            $coupon = \Model_Coupon::findByUserAndId($user, $item['coupon_id']);
            if (empty($coupon)) {
                throw new \ProtocolException(\Lang::get('authority_error'), "You don't have permission to access.", \ProtocolException::RESULT_CODE_EXECUTE_AUTHORITY);
            }
            $picture = null;
            if (isset($item['coupon_screen_picture_id']) && $item['coupon_screen_picture_id']) {
                $picture = \Model_Picture::findByUserAndId($user, $item['coupon_screen_picture_id']);
                if (empty($picture)) {
                    throw new \ProtocolException(\Lang::get('authority_error'), "You don't have permission to access.", \ProtocolException::RESULT_CODE_EXECUTE_AUTHORITY);
                }
            }
            $random_coupon_item = null;
            if (0 < $item['id']) {
                foreach($target->random_coupon_items as $tmp) {
                    if ($tmp->id == $item['id']) {
                        $random_coupon_item = $tmp;
                        break;
                    }
                }
                if (empty($random_coupon_item)) {
                    throw new \ProtocolException(\Lang::get('authority_error'), "You don't have permission to access.", \ProtocolException::RESULT_CODE_EXECUTE_AUTHORITY);
                }
            } else {
                $random_coupon_item = \Model_Random_Coupon_Item::forge();
            }
            $random_coupon_item->coupon = $coupon;
            $random_coupon_item->coupon_ad_slogan = $item['coupon_ad_slogan'];
            $random_coupon_item->coupon_probability = $item['coupon_probability'];
            $random_coupon_item->coupon_max_count = $item['coupon_max_count'];
            $random_coupon_item->coupon_screen_free_text_top = $item['coupon_screen_free_text_top'];
            $random_coupon_item->coupon_screen_picture_id = empty($picture) ? 0 : $picture->id;
            $random_coupon_item->coupon_screen_button_label = $item['coupon_screen_button_label'];
            $random_coupon_item->coupon_screen_free_text_bottom = $item['coupon_screen_free_text_bottom'];
            if ($random_coupon_item->id < 1) {
                $target->random_coupon_items[] = $random_coupon_item;
            }
            $edited_items[] = $random_coupon_item;
        }
        $item = $params['random_coupon_blank_item'];
        $coupon = \Model_Coupon::findByUserAndId($user, $item['coupon_id']);
        if (empty($coupon)) {
            throw new \ProtocolException(\Lang::get('authority_error'), "You don't have permission to access.", \ProtocolException::RESULT_CODE_EXECUTE_AUTHORITY);
        }
        $picture = null;
        if (isset($item['coupon_screen_picture_id']) && $item['coupon_screen_picture_id']) {
            $picture = \Model_Picture::findByUserAndId($user, $item['coupon_screen_picture_id']);
            if (empty($picture)) {
                throw new \ProtocolException(\Lang::get('authority_error'), "You don't have permission to access.", \ProtocolException::RESULT_CODE_EXECUTE_AUTHORITY);
            }
        }
        $random_coupon_item = null;
        if (0 < $item['id']) {
            $random_coupon_item = $target->random_coupon_blank_item;
            if ($random_coupon_item->id != $item['id']) {
                throw new \ProtocolException(\Lang::get('authority_error'), "You don't have permission to access.", \ProtocolException::RESULT_CODE_EXECUTE_AUTHORITY);
            }
        } else {
            $random_coupon_item = \Model_Random_Coupon_Item::forge();
        }
        $random_coupon_item->coupon = $coupon;
        $random_coupon_item->coupon_ad_slogan = $item['coupon_ad_slogan'];
        $random_coupon_item->coupon_probability = $item['coupon_probability'];
        $random_coupon_item->coupon_max_count = 0;
        $random_coupon_item->coupon_screen_free_text_top = $item['coupon_screen_free_text_top'];
        $random_coupon_item->coupon_screen_picture_id = empty($picture) ? 0 : $picture->id;
        $random_coupon_item->coupon_screen_button_label = $item['coupon_screen_button_label'];
        $random_coupon_item->coupon_screen_free_text_bottom = $item['coupon_screen_free_text_bottom'];
        $target->random_coupon_blank_item = $random_coupon_item;
        // 削除対象を探す。
        foreach($target->random_coupon_items as $random_coupon_item) {
            if (!in_array($random_coupon_item, $edited_items)) {
                unset($target->random_coupon_items[$random_coupon_item->id]);
                $random_coupon_item->delete();
            }
        }
    }
}

