<div class="container col-sm-8 col-sm-offset-3 col-md-8 col-md-offset-3">
<?php echo \Form::open(array('method' => 'post', 'class' => 'search')); ?>
        <div class="row">
            <div class='col-sm-4'>
                <div class='form-group'>
                    <label for="company_id" class="col-sm-6 control-label">企業名</label>
                    <div class="col-sm-6">
                        <span style="font-size: 13px"><?php echo $company_name; ?></span>
                    </div>
                    <br><br>
                </div>
            </div>
        </div><br>

        <div class='row' style="margin-right: -35% !important;">
            <div class='col-sm-4'>
                <div class='form-group'>
                    <label for="status" class="col-sm-4 control-label">状態 *</label>
                    <div class="col-sm-8">
                        <?php echo \Form::select('brand_status', !empty($brand_obj) ? $brand_obj->brand_status : null, $status, array('class' => 'form-control', 'id' => 'form-control')); ?>
                    </div>
                    <br><br>
                    <label for="brand_name" class="col-sm-4 control-label">ブランド名 *</label>
                    <div class="col-sm-8">
                        <input class="form-control" id="brand_name" name="brand_name" value = "<?php echo !empty($brand_obj) ? $brand_obj->brand_name : ''; ?>" size="30" type="text" />
                    </div>
                    <br><br>
                    <label for="brand_address" class="col-sm-4 control-label">住所  *</label>
                    <div class="col-sm-8">
                        <input class="form-control" id="brand_address" name="brand_address" value = "<?php echo !empty($brand_obj) ? $brand_obj->brand_address : ''; ?>" size="30" type="text" />
                    </div>
                    <br><br>
                    <label for="brand_phone_no" class="col-sm-4 control-label">電話番号 *</label>
                    <div class="col-sm-8">
                        <input class="form-control" id="brand_phone_no" name="brand_phone_no" value = "<?php echo !empty($brand_obj) ? $brand_obj->brand_phone_no : ''; ?>" size="30" type="text" />
                    </div>
                    <label for="brand_prefectures" class="col-sm-4 control-label">定休日</label>
                    <div class="col-sm-8">
                        <input class="form-control" id="brand_regular_holiday" name="brand_regular_holiday" value = "<?php echo !empty($brand_obj) ? $brand_obj->brand_regular_holiday : ''; ?>" size="30" />
                    </div>
                    <br><br>
                    <br><br>
                    <label for="brand_building" class="col-sm-4 control-label">メール署名</label>
                    <div class="col-sm-8">
                        <input class="form-control" id="brand_signature_block" name="brand_signature_block" value = "<?php echo !empty($brand_obj) ? $brand_obj->brand_signature_block : ''; ?>" size="30" type="text" />
                    </div>
                    <br><br>
                    <label for="brand_access" class="col-sm-4 control-label">利用規則</label>
                    <div class="col-sm-8">
                        <input class="form-control" id="brand_terms_of_use" name="brand_terms_of_use" value = "<?php echo !empty($brand_obj) ? $brand_obj->brand_terms_of_use : ''; ?>" size="30" type="text" />
                    </div>
                    <br><br>
                    <label for="brand_latitude" class="col-sm-4 control-label" style="font-size: 13px">プライバシーポリシー</label>
                    <div class="col-sm-8">
                        <input class="form-control" id="brand_privacy_policy" name="brand_privacy_policy" value = "<?php echo !empty($brand_obj) ? $brand_obj->brand_privacy_policy : ''; ?>" size="30" type="text" />
                    </div>
                    <br><br>
                    <label for="brand_longitude" class="col-sm-4 control-label">フリーワード</label>
                    <div class="col-sm-8">
                        <input class="form-control" id="brand_freeword" name="brand_freeword" value = "<?php echo !empty($brand_obj) ? $brand_obj->brand_freeword : ''; ?>" size="30" type="text" />
                    </div>
                </div>
            </div>

            <div class='col-sm-4'>
                <div class='form-group'>
                    <label for="brand_manager_name" class="col-sm-6 control-label">googleアナリティクスID</label>
                    <div class="col-sm-6">
                        <input class="form-control" id="google_analytics_id" name="google_analytics_id" value = "<?php echo !empty($brand_obj) ? $brand_obj->google_analytics_id : ''; ?>" size="30" type="number" />
                    </div>
                    <br><br>
                    <label for="brand_business_hours_from" class="col-sm-6 control-label">googleアナリティクスパス</label>
                    <div class="col-sm-6">
                        <input class="form-control" id="google_analytics_pass" name="google_analytics_pass" value = "<?php echo !empty($brand_obj) ? $brand_obj->google_analytics_pass : ''; ?>" size="30" type="text" />
                    </div>
                </div>
                <br><br>
                <div class="form-group">
                    <input type="submit" class="btn btn-primary pull-right" value="<?php echo !empty($brand_id) ? '更新' : '登録' ?>" style="margin-top: 20px; margin-right: 15px;">
                </div>
            </div>

        </div>
<?php echo \Form::close(); ?>
</div>
