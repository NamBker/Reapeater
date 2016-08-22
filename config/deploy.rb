# config valid only for current version of Capistrano
lock '3.4.1'

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, '/var/www/my_app_name'
# set :deploy_to, '/var/www/gmorepeater.jp'

# Default value for :scm is :git
set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')

# Default value for linked_dirs is []
# set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system')
set :linked_dirs, fetch(:linked_dirs, []).push('fuel/app/logs', 'fuel/app/tmp')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
set :keep_releases, 5

# for npm
set :npm_target_path, -> { release_path.join('public/assets/js/repeater') }
set :npm_roles, :npm

# for whenever
set :whenever_roles, :batch
set :whenever_identifier, ->{ "#{fetch(:application)}_#{fetch(:stage)}" }

namespace :fuelphp do
  desc "database migration"
  task :migrate do
        on roles(:migrate) do
                execute "cd #{release_path} && FUEL_ENV=#{fetch(:env)} php oil refine session:create"
                execute "cd #{release_path} && FUEL_ENV=#{fetch(:env)} php oil refine migrate"
        end
  end
  task :create_symlinks do
        on roles(:web) do
                execute "ln -s /data/repeater/picture #{release_path}/public/assets/img/picture"
        end
  end
end

namespace :npm do
  desc "node build"
  task :build do
        on roles(:npm_stage) do
                execute "cd #{fetch(:npm_target_path)} && npm run stage"
        end
        on roles(:npm_build) do
                execute "cd #{fetch(:npm_target_path)} && npm run build"
        end
  end
end

namespace :phpfpm do
  desc "php-fpm reload"
  task :reload do
    on roles(:web) do
      execute "sudo systemctl reload php-fpm.service"
    end
  end
end

namespace :bundle do
  task :install do
    on roles(:batch) do
        execute "cd #{release_path} && bundle install"
    end
  end
end

namespace :whenever do
  task :init_variables do
    set :whenever_variables, "'environment=#{fetch(:env)}&fuel_env=#{fetch(:env)}&deploy_to=#{fetch(:deploy_to)}&log_result=/data/repeater/logs/cron/result.log&log_error=/data/repeater/logs/cron/error.log'"
  end
end

before 'deploy:updated', 'fuelphp:migrate'
before 'deploy:updated', 'fuelphp:create_symlinks'
after 'deploy:updated', 'phpfpm:reload'
after 'npm:install', 'npm:build'
before 'whenever:update_crontab', 'bundle:install'
before 'whenever:update_crontab', 'whenever:init_variables'
