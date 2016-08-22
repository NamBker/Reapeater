<?php
require_once("fuel/app/tests/standard/testcase.php");

abstract class Standard_Controller_TestCase extends \Standard_TestCase
{
    public function setUp()
    {
        parent::setUp();
        \DB::start_transaction(MASTER);
    }

    public function tearDown()
    {
        \DB::rollback_transaction(MASTER);
        test::clean();
        parent::tearDown();
    }

    /**
     * @dataProvider additionProvider
     * @expectedException HttpBadRequestException
     */
    public function test_nullParam($param, $url, $method)
    {
        test::double('Fuel\Core\Input', [$method => $param]);
        $response = \Request::forge($url)->set_method($method)->execute()->response();
    }
}