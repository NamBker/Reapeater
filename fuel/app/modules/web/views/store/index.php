<div class="container col-sm-8 col-sm-offset-3 col-md-8 col-md-offset-3">
<?php echo \Form::open(array('method' => 'post', 'class' => 'search')); ?>
<fieldset>
    <legend>店舗一覧</legend>
    <div class='row'>
        <div class='col-sm-4'>
            <div class='form-group'>
                <label for="company_id" class="col-sm-4 control-label">企業ID</label>
                <div class="col-sm-8">
                        <input class="form-control" id="company_id" name="company_id" value = "<?php echo $data_form['company_id'] ?>" size="30" type="number" <?php echo !$data_form['is_company_enable'] ? 'readonly' : '' ?>  />
                </div>
                <br><br>
                <label for="brand_id" class="col-sm-4 control-label">ブランドID</label>
                <div class="col-sm-8">
                    <input class="form-control" id="brand_id" name="brand_id" value = "<?php echo $data_form['brand_id'] ?>" size="30" type="number" <?php echo !$data_form['is_brand_enable'] ? 'readonly' : '' ?>  />
                </div>
            </div>
        </div>
        <div class='col-sm-4'>
            <div class='form-group'>
                <label for="status" class="col-sm-3 control-label">状態</label>
                <div class="col-sm-7">
                    <?php echo \Form::select('store_status', $data_form['store_status'], $status, array('class' => 'form-control', 'id' => 'form-control')); ?>
                </div>
            </div>
        </div>

        <div class='col-sm-4'>
            <div class='form-group'>
                <label for="store_id" class="col-sm-5 control-label">店舗ID</label>
                <div class="col-sm-7">
                    <input class="form-control" id="store_id" name="store_id" size="30"   value = "<?php echo $data_form['store_id'] ?>"type="text" />
                </div>
            </div><br>
            <div class='form-group'>
                <label for="store_name" class="col-sm-5 control-label">店舗名</label>
                <div class="col-sm-7">
                    <input class="form-control" id="store_name" name="store_name" size="30"  value = "<?php echo $data_form['store_name'] ?>" type="text" />
                </div>
            </div><br>
            <div class='form-group'>
                <label for="store_address" class="col-sm-5 control-label">店舗住所</label>
                <div class="col-sm-7">
                    <input class="form-control" id="store_address" name="store_address" size="30" value = "<?php echo $data_form['store_address'] ?>" type="text" />
                </div>
            </div><br>
            <div class='form-group'>
                <label for="phone_number" class="col-sm-5 control-label">店舗電話番号</label>
                <div class="col-sm-7">
                    <input class="form-control" id="phone_number" name="phone_number"  value = "<?php echo $data_form['phone_number'] ?>" size="30" type="number" />
                </div>
            </div>
        </div>

        <div class="form-group">
            <input type="submit" class="btn btn-primary pull-right" value="検索" style="margin-top: 20px; margin-right: 15px;">
        </div>
    </div>
</fieldset>
<?php echo \Form::close(); ?>
<table class="table table-striped">
    <thead>
    <tr>
        <th style="width: 100px">No</th>
        <th>企業名</th>
        <th>ブランドID</th>
        <th>状態</th>
        <th>店舗名</th>
        <th>都道府県</th>
        <th>住所</th>
        <th>電話番号</th>
        <th>店長名</th>
    </tr>
    </thead>
    <tbody>
<?php if (!empty($stores)) : ?>
  <?php $i = 1; foreach($stores as $row => $store) { ?>
    <tr>
        <td><?php echo $i ?></td>
        <td><?php echo !empty($store->company) ? $store->company->company_name : ""?></td>
        <td><?php echo !empty($store->brand) ? $store->brand->brand_name : "" ?></td>
        <td><?php echo $status[$store->store_status] ?></td>
        <td><?php echo $store->store_name ?></td>
        <td><?php echo !empty(\Util::$prefecture_codes[$store->store_prefectures])?\Util::$prefecture_codes[$store->store_prefectures]: '' ?></td>
        <td><?php echo $store->store_address ?></td>
        <td><?php echo $store->store_phone_no ?></td>
        <td><?php echo $store->store_manager_name ?></td>
    </tr>
    <?php $i++; }?>
<?php endif ?>
    </tbody>
</table>
</div>