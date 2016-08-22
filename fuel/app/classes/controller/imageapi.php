<?php

abstract class Controller_Imageapi extends Controller_Rest
{
    // response_format
    //protected $format = JSON;
    protected $format_req_params = array(
        'index'  => GET,
        'create' => JSON,
        'update' => JSON,
        'delete' => DELETE,
    );

    protected $params;
    protected $user_id = null;
    protected $client_id = null;

    // protected $is_access_token_ignore_request = false;

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

            if (\Input::method() != 'GET') {
                $this->checkAccessToken();
	    }

            \Additional_Log::debug('【BEFORE API PROCESS】:CHECK TOKEN OK.');

            if ($this->format_req_params[$this->request->route->action] == JSON) {
                $this->parseJson();
            \Additional_Log::debug('JSON');
            } else {
                $this->getParameters();
            \Additional_Log::debug('NOT JSON');
            }
            \Additional_Log::debug('【BEFORE API PROCESS】:PARSE JSON.');

            $this->getUriParameters();
            \Additional_Log::debug('【BEFORE API PROCESS】:GET PARAMETERS.');
            $this->checkParameters();
            \Additional_Log::debug('【BEFORE API PROCESS】:CHECK PARAMETERS.');
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

        //$this->response($this->response_fields, $this->response_status);
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

    private function getParameters()
    {
        $parameters = static::$required_parameters[$this->request->route->action];
        $input_parameters = call_user_func_array(array("Input", "get"), array());
        foreach ($parameters as $parameter => $not_null) {
            $this->params[$parameter] = isset($input_parameters[$parameter]) ? $input_parameters[$parameter] : null;
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
}
