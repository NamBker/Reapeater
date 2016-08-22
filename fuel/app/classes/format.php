<?php
/**
 *  app/classes/common/format.phpを作成
 */
class Format extends \Fuel\Core\Format {

    public function to_csv($data = NULL, $delimiter = NULL, $enclose_numbers = NULL, array $headings = array()){
        $csv = parent::to_csv($data, $delimiter, $enclose_numbers, $headings);
        $csv = mb_convert_encoding($csv, 'SJIS-win', 'UTF-8');
        return $csv;
    }
}