#!/bin/sh

echo "This is deployment for PRODUCTION!! Are you sure? please input 'Yes' or 'No'"
read answer

if [ "$answer" != "Yes" ]; then
  exit 1
fi

cd /root/deploy
bundle exec cap web_app_production deploy
bundle exec cap web_api_production deploy
bundle exec cap web_img_production deploy
bundle exec cap batch_production deploy

