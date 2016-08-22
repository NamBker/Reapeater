<div class="row col-sm-offset-1">
    <?php echo \Form::open(array('class' => 'search')); ?>
    <div style="width: 310px; display: inline-block;">
        <div class='form-group'>
            <label for="company_id" class="col-sm-5 control-label" style="padding-right: 0px">権限</label>
            <div class="col-sm-7">
                <?php echo \Form::select('authority', isset($data_from['authority']) ? $data_from['authority'] : null, $authorities, array('class' => 'form-control', 'id' => 'authority')) ?>
            </div>
        </div>
    </div>
    <div style="width: 310px; display: inline-block;">
        <div class='form-group'>
            <label for="company_id" class="col-sm-5 control-label" style="padding-right: 0px">企業ID</label>
            <div class="col-sm-7">
                <?php echo \Form::input('company_id', isset($data_from['company_id']) ? $data_from['company_id'] : null, array('class' => 'form-control', 'id' => 'company_id', 'type' => 'number')) ?>
            </div>
        </div>
        <br>
        <div class='form-group'>
            <label for="company_name" class="col-sm-5 control-label" style="padding-right: 0px">企業名</label>
            <div class="col-sm-7">
                <?php echo \Form::input('company_name', isset($data_from['company_name']) ? $data_from['company_name'] : null, array('class' => 'form-control', 'id' => 'company_name')) ?>
            </div>
        </div>
        <br>
        <div class='form-group'>
            <label for="company_address" class="col-sm-5 control-label" style="padding-right: 0px">企業住所</label>
            <div class="col-sm-7">
                <?php echo \Form::input('company_address', isset($data_from['company_address']) ? $data_from['company_address'] : null, array('class' => 'form-control', 'id' => 'company_address')) ?>
            </div>
        </div>
        <br>
        <div class='form-group'>
            <label for="company_phone_no" class="col-sm-5 control-label" style="padding-right: 0px">企業電話番号</label>
            <div class="col-sm-7">
                <?php echo \Form::input('company_phone_no', isset($data_from['company_phone_no']) ? $data_from['company_phone_no'] : null, array('class' => 'form-control', 'id' => 'company_phone_no')) ?>
            </div>
        </div>
    </div>

    <div style="width: 310px; display: inline-block;">
        <div class='form-group'>
            <label for="brand_id" class="col-sm-5 control-label" style="padding-right: 0px">ブランドID</label>
            <div class="col-sm-7">
                <?php echo \Form::input('brand_id', isset($data_from['brand_id']) ? $data_from['brand_id'] : null, array('class' => 'form-control', 'id' => 'brand_id', 'type' => 'number')) ?>
            </div>
        </div>
        <br>
        <div class='form-group'>
            <label for="brand_name" class="col-sm-5 control-label" style="padding-right: 0px">ブランド名</label>
            <div class="col-sm-7">
                <?php echo \Form::input('brand_name', isset($data_from['brand_name']) ? $data_from['brand_name'] : null, array('class' => 'form-control', 'id' => 'brand_name')) ?>
            </div>
        </div>
        <br>
        <div class='form-group'>
            <label for="brand_address" class="col-sm-5 control-label" style="padding-right: 0px">ブランド住所</label>
            <div class="col-sm-7">
                <?php echo \Form::input('brand_address', isset($data_from['brand_address']) ? $data_from['brand_address'] : null, array('class' => 'form-control', 'id' => 'brand_address')) ?>
            </div>
        </div>
        <br>
        <div class='form-group'>
            <label for="brand_phone_no" class="col-sm-5 control-label" style="padding-right: 0px">ブランド電話番号</label>
            <div class="col-sm-7">
                <?php echo \Form::input('brand_phone_no', isset($data_from['brand_phone_no']) ? $data_from['brand_phone_no'] : null, array('class' => 'form-control', 'id' => 'brand_phone_no')) ?>
            </div>
        </div>
    </div>

    <div style="width: 310px; display: inline-block;">
        <div class='form-group'>
            <label for="store_id" class="col-sm-5 control-label" style="padding-right: 0px">店舗ID</label>
            <div class="col-sm-7">
                <?php echo \Form::input('store_id', isset($data_from['store_id']) ? $data_from['store_id'] : null, array('class' => 'form-control', 'id' => 'store_id', 'type' => 'number')) ?>
            </div>
        </div>
        <br>
        <div class='form-group'>
            <label for="store_name" class="col-sm-5 control-label" style="padding-right: 0px">店舗名</label>
            <div class="col-sm-7">
                <?php echo \Form::input('store_name', isset($data_from['store_name']) ? $data_from['store_name'] : null, array('class' => 'form-control', 'id' => 'store_name')) ?>
            </div>
        </div>
        <br>
        <div class='form-group'>
            <label for="store_address" class="col-sm-5 control-label" style="padding-right: 0px">店舗住所</label>
            <div class="col-sm-7">
                <?php echo \Form::input('store_address', isset($data_from['store_address']) ? $data_from['store_address'] : null, array('class' => 'form-control', 'id' => 'store_address')) ?>
            </div>
        </div>
        <br>
        <div class='form-group'>
            <label for="store_phone_no" class="col-sm-5 control-label" style="padding-right: 0px">店舗電話番号</label>
            <div class="col-sm-7">
                <?php echo \Form::input('store_phone_no', isset($data_from['store_phone_no']) ? $data_from['store_phone_no'] : null, array('class' => 'form-control', 'id' => 'store_phone_no')) ?>
            </div>
        </div>
    </div>

    <div style="width: 310px; display: inline-block;">
        <div class='form-group'>
            <label for="user_id" class="col-sm-5 control-label" style="padding-right: 0px">ユーザID</label>
            <div class="col-sm-7">
                <?php echo \Form::input('user_id', isset($data_from['user_id']) ? $data_from['user_id'] : null, array('class' => 'form-control', 'id' => 'user_id', 'type' => 'number')) ?>
            </div>
        </div>
        <br>
        <div class='form-group'>
            <label for="user_name" class="col-sm-5 control-label" style="padding-right: 0px">ユーザ名</label>
            <div class="col-sm-7">
                <?php echo \Form::input('user_name', isset($data_from['user_name']) ? $data_from['user_name'] : null, array('class' => 'form-control', 'id' => 'user_name')) ?>
            </div>
        </div>
        <br>
        <div class='form-group'>
            <label for="user_address" class="col-sm-5 control-label" style="padding-right: 0px">ユーザ住所</label>
            <div class="col-sm-7">
                <?php echo \Form::input('user_address', isset($data_from['user_address']) ? $data_from['user_address'] : null, array('class' => 'form-control', 'id' => 'user_address')) ?>
            </div>
        </div>
        <br>
        <div class='form-group'>
            <label for="user_phone_no" class="col-sm-5 control-label" style="padding-right: 0px">ユーザ電話番号</label>
            <div class="col-sm-7">
                <?php echo \Form::input('user_phone_no', isset($data_from['user_phone_no']) ? $data_from['user_phone_no'] : null, array('class' => 'form-control', 'id' => 'user_phone_no')) ?>
            </div>
        </div>
    </div>
    <div class="form-group">
        <input type="submit" class="btn btn-primary pull-right" value="検索"
                                   style="margin-top: 20px; margin-right: 11%;">
    </div>
    <?php echo \Form::close(); ?>
</div>
