<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Style-Type" content="text/css">
<meta http-equiv="Content-Script-Type" content="text/javascript">

<?php echo \Asset::css(array('style.css', 'lightslider.css')) ?>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<title><?php echo $title; ?></title>
</head>
<body>
<div id="wrapper">
    <header>
        <?php echo $header; ?>
    </header>

<?php echo $content; ?>

    <footer>
        <?php echo $footer; ?>
    </footer>
</div><!-- end of wrapper -->

<?php echo \Asset::js(array('jquery-2.2.4.min.js', 'lightslider.js')) ?>

<script>
    //スライドショー
    $(document).ready(function() {
		$("#content-slider").lightSlider({
            loop:true,
            keyPress:true
        });
        $('#image-gallery').lightSlider({
            gallery:true,
            item:1,
            thumbItem:5,
            slideMargin: 0,
            speed:500,
            pause: 3000,
            auto:true,
            loop:true,
            onSliderLoad: function() {
                $('#image-gallery').removeClass('cS-hidden');
            }
        });
	});
</script>
<script>
    //グローバルナビゲーション
    $(document).ready(function() {
        $(".navTrigger").click(function () {
            $(this).toggleClass("active");
            $(".gblnvBlock").slideToggle("fast");
        });
        $("li.close").click(function () {
            $(".navTrigger").toggleClass("active");
            $(".gblnvBlock").slideToggle("fast");
        });
    });
</script>

<script>
    //ページトップへ戻るボタン
    $(function(){
        var topBtn=$('#pageTop');
        topBtn.hide();
        $(window).scroll(function(){
          if($(this).scrollTop()>80){
            topBtn.fadeIn();
          }else{
            topBtn.fadeOut();
          }
        });
        topBtn.click(function(){
          $('body,html').animate({
          scrollTop: 0},500);
          return false;
        });
    });
</script>
</body>
</html>
