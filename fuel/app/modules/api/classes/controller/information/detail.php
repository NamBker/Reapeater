<?php
namespace Api;

/**
 * Class Information_Private
 * @package Api
 */
class Controller_Information_Detail extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'information_id' => true,
            'pattern' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::info('information/private called');
        $user = \Model_User::find($this->user_id);
        $information = \Model_Information::find($this->params['information_id']);
        if (!$information->isAccessibleUser($user)) {
            throw new \ProtocolException(\Lang::get('user_authority_error'), "user does not have authority for operation.", \ProtocolException::RESULT_CODE_USER_OPERATION_AUTHORITY_ERROR);
        }

        if (!empty($information)) {
            $this->response_fields['information'] = $information->toArray($this->params['pattern']);
            $this->response_fields['information']['publisher_company_id'] = $information->publisher_company ? $information->publisher_company->publisher_id : null;
            $this->response_fields['information']['picture_name'] = empty($information->picture) ? null : $information->picture->picture_file_name;
            $this->response_fields['information']['picture_url'] = empty($information->picture) ? null : \Model_Picture::makePictureUrl($information->picture);
            $this->response_fields['information']['publisher_brand_ids'] = $information->getPublisherIds(INFORMATION_PUBLISHER_TYPE_BRAND);
            $this->response_fields['information']['publisher_store_ids'] = $information->getPublisherIds(INFORMATION_PUBLISHER_TYPE_STORE);
        } else {
            throw new \ProtocolException(\Lang::get('information_can_not_update'), "You can not change this information",
                \ProtocolException::RESULT_CODE_INFORMATION_NOT_FOUND);
        }
    }
}
