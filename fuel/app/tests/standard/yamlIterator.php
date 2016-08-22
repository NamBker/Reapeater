<?php

class YamlIterator implements Iterator {
    private $position = 0;
    private $array;
    private $replacement;
    const TIME_PATTERN = '#\$\{(now|timestamp)(.*)\}#';

    public function __construct($path) {
        $handle = fopen($path, 'r');
        $replaced = array();
        if ($handle) {
            while (($line = fgets($handle)) !== false) {
                preg_match(self::TIME_PATTERN, $line, $m);
                if (!empty($m[0])) {
                    $replaced[] = self::parse($line, $m[1], !empty($m[2]) ? $m[2] : null);
                } else {
                    $replaced[] = $line;
                }
            }
        }
        fclose($handle);

        $this->array = Format::forge(implode('', $replaced), 'yaml')->to_array();
    }

    private static function parse($line, $type, $offset) {
        $time = !isset($offset) ? date('Y-m-d H:i:s') : date('Y-m-d H:i:s', strtotime($offset));
        if ($type == 'timestamp') {
            $time = (new DateTime($time))->getTimestamp();
        }

        return preg_replace(self::TIME_PATTERN, $time, $line);
    }

    public function rewind() {
        $this->position = 0;
    }

    public function valid() {
        return isset($this->array[$this->position]);
    }

    public function key() {
        return $this->position;
    }

    public function current() {
        return $this->array[$this->position];
    }

    public function next() {
        $this->position++;
    }
}
