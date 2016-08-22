<?php
namespace Media;

class Presenter_Coupon_Issue extends \Presenter_Media
{
	public function view()
	{
		// クーポンが有効かどうか 0:無効 / 1:有効
		$this->set_safe('coupon_current_status', true);

		// 有効期限タイプ 0:設定なし / 1:期限設定型 / 2:メルマガ送信型
		$this->set('coupon_limit_type', $this->coupon->coupon_limit_type);

		// 2段階有効期限タイプ (0:設定なし / 1:期限設定型)
		$this->set('coupon_two_step_limit_type', $this->coupon->coupon_two_step_limit_type);

		// 有効期限開始日 "有効期限タイプ = 1"の時に使用を想定
		$this->set('coupon_limit_from_date_format', date('Y年n月j日', strtotime($this->coupon->coupon_limit_from)));

		// 有効期限終了日 "有効期限タイプ = 1"の時に使用を想定
		$this->set('coupon_limit_to_date_format', date('Y年n月j日', strtotime($this->coupon->coupon_limit_to)));

		// 有効期限送信型開始日数
		$this->set('coupon_limit_send_start', $this->coupon->coupon_limit_send_start);

		// 有効期限送信型有効日数
		$this->set('coupon_limit_send_count', $this->coupon->coupon_limit_send_count);

		// 2段階有効期限(分) 2段階クーポンの"クーポンを使う"ボタン押下後、何分間表示するかを設定
		$this->set('coupon_two_step_limit_min_date_format', date('Y年n月j日 H:i:s', strtotime($this->member_coupon_history->second_used_date." +{$this->coupon->coupon_two_step_limit_min} minute")));

		// 会員登録日
		$this->set('member_registration_date', $this->store_member->member_registration_date);

		// 2段階使用日時 2段階クーポンの場合のみ使用
		$this->set('second_used_date_format', date('Y年n月j日 H:i:s', strtotime($this->member_coupon_history->second_used_date)));

		// クーポンタイトル
		$this->set_safe('coupon_title', $this->coupon->coupon_title);

		// クーポン内容
		$this->set_safe('coupon_description', $this->coupon->coupon_description);

		// 2段階店員確認用内容
		$this->set_safe('coupon_two_step_confirmation', $this->coupon->coupon_two_step_confirmation);

		// 2段階使用不可時説明文
		$this->set_safe('coupon_two_step_over_description', $this->coupon->coupon_two_step_over_description);

		// 有効期限タイプ
		switch ($this->coupon->coupon_limit_type)
		{
			// 有効期限タイプ なし
			case 0:
				break;

			// 有効期限タイプ 日付設定
			case 1:

				// 開始のため無効 現在時刻 < 開始時刻 ※管理ツールでは、過去の日付は選択できない仕様になっている
				if (\Date::time()->get_timestamp() < strtotime($this->coupon->coupon_limit_from))
				{
					$this->set_safe('coupon_current_status', false);
				}

				// 終了のため無効 現在時刻 >= 終了時刻
				if (\Date::time()->get_timestamp() >= strtotime($this->coupon->coupon_limit_to))
				{
					$this->set_safe('coupon_current_status', false);
				}

				// クーポン表示後の有効時間タイプ
				switch ($this->coupon->coupon_two_step_limit_type)
				{
					// クーポン表示後の有効時間タイプ クーポンの有効期限まで
					case 0:
						break;

					// クーポン表示後の有効時間タイプ 表示後○分問
					case 1:

						// 「クーポンを使う」ボタンが押される前
						if (!is_null($this->member_coupon_history->second_used_date))
						{
							// 期限切れ 現在時刻 < 画面表示時刻 かつ 現在時刻 >= 画面表示時刻から○分後
							if (\Date::time()->get_timestamp() < strtotime($this->member_coupon_history->second_used_date) && \Date::time()->get_timestamp() >= strtotime($this->member_coupon_history->second_used_date." +{$this->coupon->coupon_two_step_limit_min} minute"))
							{
								$this->set_safe('coupon_current_status', false);
							}
						}
						break;

					default:
						break;
				}
				break;

			// 有効期限タイプ 期限設定
			case 2:

				// メルマガ送信日（会員登録日）の○日以前
				if (\Date::time()->get_timestamp() < strtotime($this->store_member->member_registration_date." +{$this->coupon->coupon_limit_send_start} day"))
				{
					$this->set_safe('coupon_current_status', false);
				}

				// メルマガ送信日（会員登録日）の○日後から○日以前
				if (\Date::time()->get_timestamp() >= strtotime(date('Y-m-d H:i:s', strtotime($this->store_member->member_registration_date." +{$this->coupon->coupon_limit_send_start} day"))." +{$this->coupon->coupon_limit_send_count} day"))
				{
					$this->set_safe('coupon_current_status', false);
				}

				switch ($this->coupon->coupon_two_step_limit_type)
				{
					// クーポン表示後の有効時間タイプ クーポンの有効期限まで
					case 0:
						break;

					// クーポン表示後の有効時間タイプ 表示後○分問
					case 1:

						// 「クーポンを使う」ボタンが押される前
						if (!is_null($this->member_coupon_history->second_used_date))
						{
							// 期限切れ 現在時刻 < 画面表示時刻 かつ 現在時刻 >= 画面表示時刻から○分後
							if (\Date::time()->get_timestamp() < strtotime($this->member_coupon_history->second_used_date) && \Date::time()->get_timestamp() >= strtotime($this->member_coupon_history->second_used_date." +{$this->coupon->coupon_two_step_limit_min} minute"))
							{
								$this->set_safe('coupon_current_status', false);
							}
						}
						break;

					default:
						break;
				}
				break;

			default:
				break;
		}
	}
}