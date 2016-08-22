<?php

abstract class Standard_TestCase extends PHPUnit_Framework_TestCase {
    const PREFIX_TEST = 'Test_';

    protected $default;
    protected $targetClass;

    public function setUp() {
        parent::setUp();
    }

    protected function extractCLassName($name) {
        $class = new \ReflectionClass(get_class($this));
        $namespace = $class->getNamespaceName();
        return substr($name, strlen(self::PREFIX_TEST) + strlen($namespace));
    }

    protected function extractMethodName($name) {        
        return substr($name, strlen(self::PREFIX_TEST));
    }

    protected function invokePrivateMethod($name, $args = null) {
        $method = self::getMethod($name);

        return $method->invokeArgs($this->default, isset($args) ? $args : array(0));
    }

    protected function getProperty($name) {
        $property = $this->targetClass->getProperty($name);
        $property->setAccessible(true);

        return $property;
    }

    private function getMethod($name) {
        $method = $this->targetClass->getMethod($name);
        $method->setAccessible(true);

        return $method;
    }

    public function additionProvider($methodName) {
        $fixture_path = $this->getFixturePath();
        $path = implode("/", array_map('strtolower', explode("_", $this->extractCLassName(get_class($this)))));
        return new YamlIterator($fixture_path.$path."/".$this->extractMethodName($methodName).".yml");
    }

    protected function getFixturePath() {        
        $class = new \ReflectionClass(get_class($this));
        $namespace = $class->getNamespaceName();

        //if class has namespace, it's in modules
        if (!empty($namespace)) {
            return  APPPATH."modules".DIRECTORY_SEPARATOR.strtolower($namespace).DIRECTORY_SEPARATOR.
            'tests'.DIRECTORY_SEPARATOR.'fixture'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR;
        } else {
            return APPPATH.'tests'.DIRECTORY_SEPARATOR.'fixture'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR;
        }
    }
}
