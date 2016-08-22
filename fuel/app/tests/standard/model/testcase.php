<?php

require_once("fuel/app/tests/standard/testcase.php");

abstract class Standard_Model_TestCase extends \Standard_TestCase {

    public function setUp() {
        parent::setUp();
        $this->targetClass = new \ReflectionClass($this->extractClassName(get_class($this)));
        $this->default = $this->targetClass->newInstanceArgs();
        \DB::start_transaction(MASTER);
        // clear table before test avoid duplicate
        $model = str_replace('Test_', '', get_class($this));
        $table_name = $model::table();
        \DB::delete($table_name)->execute();
    }

    public function tearDown() {
        \DB::rollback_transaction(MASTER);
        test::clean();
        parent::tearDown();
    }

    /**
     * @dataProvider additionProvider
     */
    public function test_validation($params = null) {
        $instance = $this->targetClass->newInstanceArgs(array($params));
        $instance->save();
    }

    /**
     * @dataProvider additionProvider
     * @expectedException Orm\ValidationFailed
     */
    public function test_validationError($params = null) {
        $instance = $this->targetClass->newInstanceArgs(array($params));
        $instance->save();
    }
}
