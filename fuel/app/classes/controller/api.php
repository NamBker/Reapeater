<?php

abstract class Controller_Api extends Controller_Rest
{
    // response_format
    protected $format = JSON;
    protected $format_req_params = array(
        'index'  => GET,
        'create' => JSON,
        'update' => JSON,
        'delete' => JSON,
    );

    protected $params;
    protected $user_id = null;
    protected $client_id = null;

    protected $is_access_token_ignore_request = false;
    protected $is_picture_request = false;

    protected $response_fields = array(
        'developer_message' => '',
        'user_message'      => '',
        'error_code'        => \ProtocolException::RESULT_CODE_OK,
    );


    protected static $required_parameters = array(
        'index'  => array(),
        'create' => array(),
        'update' => array(),
        'delete' => array(),
    );

    protected function index()
    {
        throw new \HttpNotFoundException('Invalid method');
    }

    protected function create()
    {
        throw new \HttpNotFoundException('Invalid method');
    }

    protected function update()
    {
        throw new \HttpNotFoundException('Invalid method');
    }

    protected function delete()
    {
        throw new \HttpNotFoundException('Invalid method');
    }

    public function before()
    {
        parent::before();
        try {
            \Lang::load('labels');

            \Additional_Log::debug('【BEFORE API PROCESS】:START');

            $this->response->set_header('Access-Control-Allow-Origin', \Input::server('HTTP_ORIGIN'));

            if (!$this->is_access_token_ignore_request) {
                $this->checkAccessToken();
            }
            \Additional_Log::debug('【BEFORE API PROCESS】:CHECK TOKEN OK.');

            // 実行権限チェック
            $this->checkExecutionAuthority();
            \Additional_Log::debug('【BEFORE API PROCESS】:CHECK AUTHORITY OK.');

            if ($this->format_req_params[$this->request->route->action] == JSON) {
                $this->parseJson();
            } else {
                $this->getParameters(\Input::method());
            }
            \Additional_Log::debug('【BEFORE API PROCESS】:PARSE JSON.');

            $this->getUriParameters();
            \Additional_Log::debug('【BEFORE API PROCESS】:GET PARAMETERS.');
            $this->checkParameters();
            \Additional_Log::debug('【BEFORE API PROCESS】:CHECK PARAMETERS.');

            $this->checkUserAuthority();
            \Additional_Log::debug('【BEFORE API PROCESS】:CHECK USER AUTHORITY.');
        } catch (\Exception $e) {
            \Additional_Log::info($e);
            throw $e;
        }

        \Additional_Log::debug('【BEFORE API PROCESS】:END');
    }

    public function action_index()
    {
        try {
            $this->index();
        } catch (\ProtocolException $e) {
            $this->response_fields['developer_message'] = $e->getMessage();
            $this->response_fields['user_message'] = $e->getUserMessage();
            $this->response_fields['error_code'] = $e->getCode();
            \Additional_Log::info("[{$this->response_fields['error_code']}] {$e->getMessage()}");
        } catch (\HttpException $e) {
            $this->response_status = $e->response()->status;
            $this->response_fields['developer_message'] = $e->getMessage();
            $this->response_fields['user_message'] = $e->getMessage();
            $this->response_fields['error_code'] = \ProtocolException::RESULT_CODE_ERROR;
            \Additional_Log::info($e->getMessage());
        } catch (\Exception $e) {
            $this->response_status = 500;
            $this->response_fields['developer_message'] = $e->getMessage();
            $this->response_fields['user_message'] = $e->getMessage();
            $this->response_fields['error_code'] = \ProtocolException::RESULT_CODE_ERROR;
            \Additional_Log::info($e);
        }

        if(!$this->is_picture_request){
            // 通常レスポンス
            $this->response($this->response_fields, $this->response_status);
        }else{
            // ファイルレスポンス
            $this->response(readfile($this->response_fields));
        }
    }

    public function action_create()
    {
        $this->doTransaction(array($this, 'create'));
    }

    public function action_update()
    {
        $this->doTransaction(array($this, 'update'));
    }

    public function action_delete()
    {
        $this->doTransaction(array($this, 'delete'));
    }

    protected function is_setted_param($param_name)
    {
        return isset($this->params[$param_name]) && !is_null($this->params[$param_name]) && $this->params[$param_name] !== '';
    }

    private function doTransaction($callback)
    {
        try {
            \DB::start_transaction(MASTER);

            $callback();

            \DB::commit_transaction(MASTER);

        } catch (\ProtocolException $e) {
            $this->response_fields['developer_message'] = $e->getMessage();
            $this->response_fields['user_message'] = $e->getUserMessage();
            $this->response_fields['error_code'] = $e->getCode();
            \Additional_Log::info("[{$this->response_fields['error_code']}] {$e->getMessage()}");
        } catch (\HttpException $e) {
            $this->response_status = $e->response()->status;
            $this->response_fields['developer_message'] = $e->getMessage();
            $this->response_fields['user_message'] = $e->getMessage();
            $this->response_fields['error_code'] = \ProtocolException::RESULT_CODE_ERROR;
            \Additional_Log::info($e->getMessage());
        } catch (\Exception $e) {
            $this->response_status = 500;
            $this->response_fields['developer_message'] = $e->getMessage();
            $this->response_fields['user_message'] = $e->getMessage();
            $this->response_fields['error_code'] = \ProtocolException::RESULT_CODE_ERROR;
            \Additional_Log::info($e);
        }

        $this->response($this->response_fields, $this->response_status);
    }

    private function parseJson()
    {
        $this->params = \Input::json();
        if (json_last_error() != JSON_ERROR_NONE) {
            throw new \HttpBadRequestException('Invalid json');
        }
    }

    private function getParameters($method)
    {
        $parameters = static::$required_parameters[$this->request->route->action];
        $input_parameters = call_user_func_array(array("Input", $method), array());
        foreach ($parameters as $parameter => $not_null) {
            $this->params[$parameter] = isset($input_parameters[$parameter]) ? (is_array($input_parameters[$parameter]) ? array_unique($input_parameters[$parameter]) : $input_parameters[$parameter]) : null;
        }
    }

    private function checkParameters()
    {
        $parameters = static::$required_parameters[$this->request->route->action];
        foreach ($parameters as $parameter => $not_null) {
            if (!isset($this->params[$parameter])) {
                if ($not_null) {
                    throw new \HttpBadRequestException("{$parameter} is required");
                } else {
                    $this->params[$parameter] = null;
                }
            }
        }
    }

    private function getUriParameters()
    {
        foreach ($this->request->named_params as $param => $value) {
            $this->params[$param] = $value;
        }
    }

    private function checkAccessToken()
    {
        $token = \Input::get('token');
        if (isset($token)) {
            $access_token_obj = \Model_Oauth_Access_Token::find('first', array('where' => array('access_token' => $token)));
            if (!(isset($access_token_obj) && $access_token_obj->checkAccessToken($this->response))) {
                throw new \HttpForbiddenException("Authorization required");
            } else {
                $this->client_id = $access_token_obj->client_id;
                $this->user_id = $access_token_obj->account_id;
            }
        } else {
            throw new \HttpBadRequestException("Access token is required");
        }
    }

    /**
     * 実行権限チェック
     */
    private function checkExecutionAuthority()
    {
        // ユーザ情報取得
        $user = \Model_user::find($this->user_id);

        // 実行API抽出
        $uri = explode('?',$_SERVER["REQUEST_URI"]);
        $api = str_replace("/1", "", $uri[0]);

        // 実行権限情報取得
        $authority = json_decode(AUTHORITY, true);

        // 実行権限チェック
        if(isset($authority[$api])){
            if($user->authority > $authority[$api][$_SERVER["REQUEST_METHOD"]]){
                throw new \HttpBadRequestException('User dose not have execute authority.');
            }
        }
    }

    /**
     * 権限チェック
     */
    private function checkUserAuthority()
    {
        $user = \Model_user::find($this->user_id);
        $params = $this->params;
        $params['company_id'] = isset($params['company_id'])?$params['company_id']:$user->company_id;
        $user->authority($params);
    }
}
