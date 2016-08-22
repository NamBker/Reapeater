<div class="container col-sm-8 col-sm-offset-3 col-md-8 col-md-offset-3">
<?php echo \Form::open(array('method' => 'post', 'class' => 'search')); ?>
    <div class='row'>
        <div class='col-sm-4'>
            <div class='form-group'>
                <label for="company_id" class="col-sm-3 control-label">企業ID</label>
                <div class="col-sm-7">
                    <input class="form-control" id="company_id" name="company_id" size="30" type="number" value="<?php echo isset($data_form['company_id']) ? $data_form['company_id'] : $company_id; ?>" <?php echo !$is_permission ? 'readonly' : ''; ?> />
                </div>
            </div>
        </div>
        <div class='col-sm-4'>
            <div class='form-group'>
                <label for="status" class="col-sm-3 control-label">状態</label>
                <div class="col-sm-7">
                    <?php echo \Form::select('brand_status', isset($data_form['brand_status']) ? $data_form['brand_status'] : null, $status, array('class' => 'form-control', 'id' => 'form-control')); ?>
                </div>
            </div>
        </div>

        <div class='col-sm-4'>
            <div class='form-group'>
                <label for="brand_id" class="col-sm-5 control-label">ブランドID</label>
                <div class="col-sm-7">
                    <input class="form-control" id="brand_id" value="<?php echo isset($data_form['brand_id']) ? $data_form['brand_id'] : ''; ?>" name="brand_id" size="30" type="number" />
                </div>
            </div><br>
            <div class='form-group'>
                <label for="brand_name" class="col-sm-5 control-label">ブランド名</label>
                <div class="col-sm-7">
                    <input class="form-control" id="brand_name" value="<?php echo isset($data_form['brand_name']) ? $data_form['brand_name'] : ''; ?>" name="brand_name" size="30" type="text" />
                </div>
            </div><br>
            <div class='form-group'>
                <label for="brand_address" class="col-sm-5 control-label">ブランド住所</label>
                <div class="col-sm-7">
                    <input class="form-control" id="brand_address" value="<?php echo isset($data_form['brand_address']) ? $data_form['brand_address'] : ''; ?>" name="brand_address" size="30" type="text" />
                </div>
            </div><br>
            <div class='form-group'>
                <label for="phone_number" class="col-sm-5 control-label">ブランド電話番号</label>
                <div class="col-sm-7">
                    <input class="form-control" id="phone_number" value="<?php echo isset($data_form['phone_number']) ? $data_form['phone_number'] : ''; ?>" name="phone_number" size="30" type="number" />
                </div>
            </div>
        </div>

        <div class="form-group">
            <input type="submit" class="btn btn-primary pull-right" value="検索" style="margin-top: 20px; margin-right: 15px;">
        </div>
    </div>
<?php echo \Form::close(); ?>
<?php echo $list; ?>
</div>
