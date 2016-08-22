#!/bin/sh

cd /root/deploy
bundle exec cap web_app_staging deploy
bundle exec cap web_api_staging deploy
bundle exec cap web_img_staging deploy
bundle exec cap batch_staging deploy

