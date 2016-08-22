<h1 style="font-size:18px;background:#a8825a;padding:10px;text-align:center;color:#ffffff;"><?php echo $coupon_title; ?></h1>
<?php if ($coupon_current_status): ?>
        <div style="padding:10px;">ｸｰﾎﾟﾝ内容<br>ｸｰﾎﾟﾝを使用する場合、以下の「ｸｰﾎﾟﾝを使う」ボタンを会計時に押してください。<br>使用の確認後に表示された画面を提示してください。</div>
        <div style="padding:10px;"><?php echo \Html::anchor($coupon_issue_url_format, 'クーポンを使う', array('style' => 'color:#ff7500'), \Util::isSecure()); ?></div>
<?php else: ?>
        <div style="padding:10px;"><?php echo $coupon_two_step_over_description; ?></div>
<?php endif; ?>
