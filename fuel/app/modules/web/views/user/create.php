<div class="col-sm-8 col-sm-offset-2">
    <?php echo \Form::open(array('class' => 'form-horizontal'));?>
    <div class="form-group">
        <label for="mail_address" class="col-sm-3 control-label"><?php echo $user->getLabel('mail_address');?></label>
        <div class="col-sm-9">
            <input type="email" class="form-control" id="mail_address" name="mail_address" style="ime-mode: inactive;" value="<?php echo empty($data_form['mail_address']) ? '' : $data_form['mail_address']?>">
        </div>
    </div>
    <div class="form-group">
        <label for="password" class="col-sm-3 control-label"><?php echo $user->getLabel('password');?></label>
        <div class="col-sm-9">
            <input type="password" class="form-control" id="password" name="password" style="ime-mode: inactive;" value="<?php echo empty($data_form['password']) ? '' : $data_form['password']?>">
        </div>
    </div>
    <div class="form-group">
        <label for="authority" class="col-sm-3 control-label"><?php echo $user->getLabel('authority');?></label>
        <div class="col-sm-9">
            <?php echo \Form::select('authority', empty($data_form['authority']) ? 1 : $data_form['authority'],
                $user->getAuthorityOptions(),
                array('class' => 'form-control', 'id' => 'authority', 'required')
                ) ?>
        </div>
    </div>
    <div class="form-group">
        <label for="company_id" class="col-sm-3 control-label"><?php echo $user->getLabel('company_id');?></label>
        <div class="col-sm-9">
            <?php echo \Form::select('company_id', empty($data_form['company_id']) ? '' : $data_form['company_id'],
                $company_option,
                array('class' => 'form-control', 'id' => 'company_id')
            ) ?>
        </div>
    </div>
    <div class="form-group">
        <label for="brand_id" class="col-sm-3 control-label"><?php echo $user->getLabel('brand_id');?></label>
        <div class="col-sm-9">
            <?php echo \Form::select('brand_id', empty($data_form['brand_id']) ? '' : $data_form['brand_id'],
                $brand_option,
                array('class' => 'form-control', 'id' => 'brand_id')
            ) ?>
        </div>
    </div>
    <div class="form-group">
        <label for="store_id" class="col-sm-3 control-label"><?php echo $user->getLabel('store_id');?></label>
        <div class="col-sm-9">
            <?php echo \Form::select('store_id', empty($data_form['store_id']) ? '' : $data_form['store_id'],
                $store_option,
                array('class' => 'form-control', 'id' => 'store_id')
            ) ?>
        </div>
    </div>
    <div class="form-group">
        <label for="name" class="col-sm-3 control-label"><?php echo $user->getLabel('name');?></label>
        <div class="col-sm-9">
            <input type="text" class="form-control" id="name" name="name" value="<?php echo empty($data_form['name']) ? '' : $data_form['name']?>" required>
        </div>
    </div>
    <div class="form-group">
        <label for="address" class="col-sm-3 control-label"><?php echo $user->getLabel('address');?></label>
        <div class="col-sm-9">
            <input type="text" class="form-control" id="address" name="address" value="<?php echo empty($data_form['address']) ? '' : $data_form['address']?>">
        </div>
    </div>
    <div class="form-group">
        <label for="phone_no" class="col-sm-3 control-label"><?php echo $user->getLabel('phone_no');?></label>
        <div class="col-sm-9">
            <input type="text" class="form-control" id="phone_no" name="phone_no" style="ime-mode: inactive;" value="<?php echo empty($data_form['phone_no']) ? '' : $data_form['phone_no']?>">
        </div>
    </div>
    <div class="form-group">
        <div class="col-sm-9 col-sm-offset-3">
            <input type="submit" class="btn btn-primary" value="<?php echo $is_edit ? '編集' : '登録' ?>">
        </div>
    </div>
    <?php echo \Form::close()?>
</div>