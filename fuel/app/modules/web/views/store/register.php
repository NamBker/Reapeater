<div class="container col-sm-8 col-sm-offset-1 col-md-8 col-md-offset-1">
    <?php echo \Form::open(array('method' => 'post', 'class' => 'search')); ?>
    <div class="row">
        <div class='col-sm-4'>
            <div class='form-group'>
                <label for="company_name" class="col-sm-6 control-label">企業名</label>
                <div class="col-sm-6">
                    <span style="font-size: 13px"><?php echo !empty($company_name) ? $company_name : ''; ?></span>
                </div>
                <br><br>
                <label for="brand_name" class="col-sm-6 control-label">ブランド名</label>
                <div class="col-sm-6">
                    <?php if ($button_label != '更新') { ?>
                        <span><?php echo $brand_name; ?></span>
                    <?php } else { ?>
                        <input class="form-control" id="brand_name" name="brand_name" value="<?php echo !empty($brand_name) ? $brand_name : ''; ?>" size="30" type="text" />
                    <?php } ?>
                </div>
            </div>
        </div>
    </div><br>

    <div class='row' style="margin-right: -35% !important;">
        <div class='col-sm-4'>
            <div class='form-group'>
                <input class="form-control" id="section_id" name="section_id" value = "<?php echo $section_id; ?>" size="30" type="hidden" />
                <label for="status" class="col-sm-4 control-label">状態</label>
                <div class="col-sm-8">
                    <?php echo \Form::select('store_status', !empty($store_status) ? $store_status : null, $status, array('class' => 'form-control', 'id' => 'form-control')); ?>
                </div>
                <br><br>
                <label for="store_name" class="col-sm-4 control-label">店舗名 *</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_name" name="store_name" value = "<?php echo !empty($store_obj) ? $store_obj->store_name : ''; ?>" size="30" type="text" maxlength="32" />
                </div>
                <br><br>
                <label for="store_prefectures" class="col-sm-4 control-label">都道府県</label>
                <div class="col-sm-8">
                    <select class="form-control" name="store_prefectures">
                        <?php foreach ($prefecture_codes as $key => $prefecture_code) : ?>
                            <option value="<?php echo $key; ?>" <?php echo !empty($store_obj) && $store_obj->store_prefectures == intval($key)  ? ' selected' : '';  ?>> <?php echo $prefecture_codes[$key]; ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <br><br>
                <label for="store_address" class="col-sm-4 control-label">住所  *</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_address" name="store_address" value = "<?php echo !empty($store_obj) ? $store_obj->store_address : ''; ?>" size="30" type="text" maxlength="64" />
                </div>
                <br><br>
                <label for="store_building" class="col-sm-4 control-label">ビル名等</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_building" name="store_building" value = "<?php echo !empty($store_obj) ? $store_obj->store_building : ''; ?>" size="30" type="text" maxlength="32" />
                </div>
                <br><br>
                <label for="store_access" class="col-sm-4 control-label">アクセス *</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_access" name="store_access" value = "<?php echo !empty($store_obj) ? $store_obj->store_access : ''; ?>" size="30" type="text" maxlength="64" />
                </div>
                <br><br>
                <label for="store_latitude" class="col-sm-4 control-label">緯度  *</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_latitude" name="store_latitude" value = "<?php echo !empty($store_obj) ? $store_obj->store_latitude : ''; ?>" size="30" type="text" />
                </div>
                <br><br>
                <label for="store_longitude" class="col-sm-4 control-label">経度  *</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_longitude" name="store_longitude" value = "<?php echo !empty($store_obj) ? $store_obj->store_longitude : ''; ?>" size="30" type="text" />
                </div>
                <br><br>
                <label for="store_phone_no" class="col-sm-4 control-label">電話番号 *</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_phone_no" name="store_phone_no" value = "<?php echo !empty($store_obj) ? $store_obj->store_phone_no : ''; ?>" size="30" type="text" maxlength="16"/>
                </div>
                <br><br>
                <label for="store_fax_no" class="col-sm-4 control-label">FAX  *</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_fax_no" name="store_fax_no" value = "<?php echo !empty($store_obj) ? $store_obj->store_fax_no : ''; ?>" size="30" type="text" maxlength="16" />
                </div>
            </div>
        </div>

        <div class='col-sm-4'>
            <div class='form-group'>
                <label for="store_manager_name" class="col-sm-4 control-label">店長名  *</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_manager_name" name="store_manager_name" value = "<?php echo !empty($store_obj) ? $store_obj->store_manager_name : ''; ?>" size="30" type="text" maxlength="32" />
                </div>
                <br><br>
                <label for="store_business_hours_from" class="col-sm-4 control-label">営業時間_開店  *</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_business_hours_from" name="store_business_hours_from" value = "<?php echo !empty($store_obj) ? $store_obj->store_business_hours_from : ''; ?>" size="30" type="text" maxlength="8"/>
                </div>
                <br><br>
                <label for="store_business_hours_to" class="col-sm-4 control-label">営業時間_閉店  *</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_business_hours_to" name="store_business_hours_to" value = "<?php echo !empty($store_obj) ? $store_obj->store_business_hours_to : ''; ?>" size="30" type="text" maxlength="8" />
                </div>
                <br><br>
                <label for="store_regular_holiday" class="col-sm-4 control-label">定休日 *</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_regular_holiday" name="store_regular_holiday" value = "<?php echo !empty($store_obj) ? $store_obj->store_regular_holiday : ''; ?>" size="30" type="text" maxlength="16" />
                </div>
                <br><br>
                <label for="store_parking_lot" class="col-sm-4 control-label">駐車場情報  *</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_parking_lot" name="store_parking_lot" value = "<?php echo !empty($store_obj) ? $store_obj->store_parking_lot : ''; ?>" size="30" type="text" maxlength="16" />
                </div>
                <br><br>
                <label for="store_seat" class="col-sm-4 control-label">席情報  *</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_seat" name="store_seat" value = "<?php echo !empty($store_obj) ? $store_obj->store_seat : ''; ?>" size="30" type="text" maxlength="16" />
                </div>
                <br><br>
                <label for="store_kids_room" class="col-sm-4 control-label">キッズルーム  *</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_kids_room" name="store_kids_room" value = "<?php echo !empty($store_obj) ? $store_obj->store_kids_room : ''; ?>" size="30" type="text" maxlength="16" />
                </div>
                <br><br>
                <label for="store_signature_block" class="col-sm-4 control-label">メール署名</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_signature_block" name="store_signature_block" value = "<?php echo !empty($store_obj) ? $store_obj->store_signature_block : ''; ?>" size="30" type="text" />
                </div>
                <br><br>
                <label for="store_terms_of_use" class="col-sm-4 control-label">利用規約</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_terms_of_use" name="store_terms_of_use" value = "<?php echo !empty($store_obj) ? $store_obj->store_terms_of_use : ''; ?>" size="30" type="text" />
                </div>
                <br><br>
                <label for="store_privacy_policy" class="col-sm-4 control-label">プライバシーポリシー</label>
                <div class="col-sm-8">
                    <input class="form-control" id="store_privacy_policy" name="store_privacy_policy" value = "<?php echo !empty($store_obj) ? $store_obj->store_privacy_policy : ''; ?>" size="30" type="text" />
                </div>
            </div>
        </div>

        <div class='col-sm-4' style="line-height: 25px">
            <div class='form-group'>
                <label for="store_freeword" class="col-sm-5 control-label">フリーワード</label>
                <div class="col-sm-7">
                    <input class="form-control" id="store_freeword" name="store_freeword" size="30"   value = "<?php echo !empty($store_obj) ? $store_obj->store_freeword : ''; ?>" type="text" />
                </div>
            </div><br>
            <div class='form-group'>
                <label for="store_area_L" class="col-sm-5 control-label">エリア(大分類)</label>
                <div class="col-sm-7">
                    <input class="form-control" id="store_area_L" name="store_area_L" size="30"  value = "<?php echo !empty($store_obj) ? $store_obj->store_area_L : ''; ?>" type="text" maxlength="16" />
                </div>
            </div><br>
            <div class='form-group'>
                <label for="store_area_M" class="col-sm-5 control-label">エリア(中分類)</label>
                <div class="col-sm-7">
                    <input class="form-control" id="store_area_M" name="store_area_M" size="30" value = "<?php echo !empty($store_obj) ? $store_obj->store_area_M : ''; ?>" type="text" maxlength="16" />
                </div>
            </div><br>
            <div class='form-group'>
                <label for="store_area_S" class="col-sm-5 control-label">エリア(小分類)</label>
                <div class="col-sm-7">
                    <input class="form-control" id="store_area_S" name="store_area_S"  value = "<?php echo !empty($store_obj) ? $store_obj->store_area_S : ''; ?>" size="30" type="text" maxlength="16" />
                </div>
            </div><br>
            <div class='form-group'>
                <label for="store_seo_key1" class="col-sm-5 control-label">SEOキーワード1</label>
                <div class="col-sm-7">
                    <input class="form-control" id="store_seo_key1" name="store_seo_key1"  value = "<?php echo !empty($store_obj) ? $store_obj->store_seo_key1 : ''; ?>" size="30" type="text" maxlength="32" />
                </div>
            </div><br>
            <div class='form-group'>
                <label for="store_seo_key2" class="col-sm-5 control-label">SEOキーワード2</label>
                <div class="col-sm-7">
                    <input class="form-control" id="store_seo_key2" name="store_seo_key2"  value = "<?php echo !empty($store_obj) ? $store_obj->store_seo_key2 : ''; ?>" size="30" type="text" maxlength="32" />
                </div>
            </div><br>
            <div class='form-group'>
                <label for="store_seo_key3" class="col-sm-5 control-label">SEOキーワード3</label>
                <div class="col-sm-7">
                    <input class="form-control" id="store_seo_key3" name="store_seo_key3"  value = "<?php echo !empty($store_obj) ? $store_obj->store_seo_key3 : ''; ?>" size="30" type="text" maxlength="32" />
                </div>
            </div><br>
            <div class='form-group'>
                <label for="twitter_access_token" class="col-sm-5 control-label">twitterアクセストークン</label>
                <div class="col-sm-7">
                    <input class="form-control" id="twitter_access_token" name="twitter_access_token"  value = "<?php echo !empty($store_obj) ? $store_obj->twitter_access_token : ''; ?>" size="30" type="text" maxlength="64" />
                </div>
            </div><br>
            <div class='form-group'>
                <label for="twitter_access_token_secret" class="col-sm-5 control-label">twitterアクセスシークレット</label>
                <div class="col-sm-7">
                    <input class="form-control" id="twitter_access_token_secret" name="twitter_access_token_secret"  value = "<?php echo !empty($store_obj) ? $store_obj->twitter_access_token_secret : ''; ?>" size="30" type="text" maxlength="64"/>
                </div>
            </div><br>
            <div class='form-group'>
                <label for="facebook_id" class="col-sm-5 control-label">フェイスブックID</label>
                <div class="col-sm-7">
                    <input class="form-control" id="facebook_id" name="facebook_id"  value = "<?php echo !empty($store_obj) ? $store_obj->facebook_id : ''; ?>" size="30" type="text" maxlength="64" />
                </div>
            </div>
        </div>

        <div class="form-group">
            <input type="submit" class="btn btn-primary pull-right" value="<?php echo $button_label; ?>" style="margin-top: 20px; margin-right: 15px;">
        </div>
    </div>
    <?php echo \Form::close(); ?>
</div>