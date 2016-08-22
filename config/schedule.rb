job_type :fuel_task, "cd :deploy_to/current && FUEL_ENV=:fuel_env /bin/env php oil refine :task >> :log_result 2>> :log_error"

#日次会員解析バッチ
#　1日1回実行。引数無しの場合、実行日前日を対象として集計を実行
#　fuel\app\tasks\daily_store_info.php
every 1.day, :at => '3:00 am' do
  fuel_task 'daily_store_info'
end

#月次会員解析バッチ：
#　毎月1回実行。引数無しの場合、実行前月を対象として集計を実行
#　fuel\app\tasks\monthly_store_info.php
every 1.day, :at => '3:15 am' do
  fuel_task 'monthly_store_info'
end

#日次配信解析バッチ
#　1日1回実行。引数無しの場合、実行日前日を対象として集計を実行
#　fuel\app\tasks\daily_delivery_info.php
every 1.day, :at => '3:30 am' do
  fuel_task 'daily_delivery_info'
end

#日次クーポン解析バッチ
#　1日1回実行。引数無しの場合、実行日前日を対象として集計を実行
#　fuel\app\tasks\coupon_analysis.php
every 1.day, :at => '3:45 am' do
  fuel_task 'coupon_analysis'
end

#日次アンケート解析バッチ
#　1日1回実行。引数無しの場合、実行日前日を対象として集計を実行
#　fuel\app\tasks\questionnaire_analysis.php
every 1.day, :at => '4:00 am' do
  fuel_task 'questionnaire_analysis'
end
