<?php

abstract class Model_Standard_Model extends Orm\Model {
    protected static $_write_connection = 'master';
    protected static $_connection = 'master';

    protected static $_observers = array(
        'Orm\\Observer_CreatedAt' => array(
            'events' => array('before_insert'),
            'property' => 'created_at',
            'mysql_timestamp' => true
        ),
        'Orm\\Observer_UpdatedAt' => array(
            'events' => array('before_save'),
            'property' => 'updated_at',
            'mysql_timestamp' => true
        ),
        'Orm\\Observer_Validation' => array(
            'events' => array('before_save')
        ),
        'Orm\\Observer_Typing' => array(
            'events' => array('after_load')
        ),
    );

    public static function find($id = null, array $options = array(), $exception_code = null, $userMessage = null, $developMessage = null) {

        $result = parent::find($id, $options);
        if (isset($exception_code) && $id != 'all' && $id != 'last' && !isset($result)) {
            $info = array();
            if ($id == 'first') {
                $where = array();
                if (!isset($options['related'])) {
                    $where[] = $options['where'];
                } else {
                    foreach ($options['related'] as $value) {
                        if (isset($value['join_on'])) {
                            $where[] = $value['join_on'];
                        }
                        if (isset($value['where'])) {
                            $where[] = $value['where'];
                        }
                    }
                }

                foreach ($where as $conditions) {
                    foreach ($conditions as $key => $value) {
                        if (is_array($value)) {
                            $info[] = "{$value[0]} : ".(isset($value[2]) ? $value[2] : $value[1]);
                        } else {
                            $info[] = "{$key} : {$value}";
                        }
                    }
                }
            } else if (isset($id)) {
                $i = 0;
                if (is_array($id)) {
                    if (count($id) == count(static::$_primary_key)) {
                        foreach (static::$_primary_key as $key) {
                            $info[] = "{$key} : {$id[$i++]}";
                        }
                    }
                } else {
                    foreach (static::$_primary_key as $key) {
                        $info[] = "{$key} : {$id}";
                    }
                }
            }

            $model = get_called_class();
            \Additional_Log::error($model.' not found. '.implode(' ', $info));

            \Config::load('db', true);
            $db_name = \Config::get('db.' . static::$_connection . '.connection.database');
            $jp_name = \DB::query("SELECT table_comment FROM INFORMATION_SCHEMA.TABLES where table_schema='{$db_name}' and table_name='{$model::table()}'")
                           ->execute()[0]['table_comment'];
            throw new \ProtocolException(
                isset($userMessage) ? $userMessage : $jp_name.\Lang::get('not_exist'),
                isset($developMessage) ? $developMessage : Inflector::humanize($model::table()).' not found. '.implode(' ', $info),
                isset($exception_code) ? $exception_code : \ProtocolException::RESULT_CODE_ERROR
            );
        }

        return $result;
    }

    public function toArray($expose_pattern = 3) {
        $data = $this->to_array();
        $properties = array_merge(static::$_properties);

        if (isset(static::$_belongs_to)) {
            $properties = array_merge($properties, static::$_belongs_to);
        }

        if (isset(static::$_has_one)) {
            $properties = array_merge($properties, static::$_has_one);
        }

        if (isset(static::$_has_many)) {
            $properties = array_merge($properties, static::$_has_many);
        }

        if (isset(static::$_many_many)) {
            $properties = array_merge($properties, static::$_many_many);
        }

        foreach ($properties as $key => $property) {
            if ((isset($property['data_type']) && $property['data_type'] == 'bigint')) {
                $data[$key] = (int)$data[$key];
            }
            if (isset($property['expose_type'])) {
                if ($property['expose_type'] == 'null') {
                    unset($data[$key]);
                } else if ($property['expose_type'] == 'datetime') {
                    $data[$key] = isset($data[$key]) ? \Util::formatDate($data[$key]) : null;
                }
            }
            if (isset($property['expose_pattern']) && $expose_pattern < $property['expose_pattern']) {
                unset($data[$key]);
            }
        }

        return $data;
    }
}
