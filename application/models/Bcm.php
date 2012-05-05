<?php

class Application_Model_Bcm {
        
    protected $_db;
    protected $_patable = "projectassignment";
    
    public function __construct ( )
    {
        $this->setAdapter( Zend_Db_Table::getDefaultAdapter() );
    }
    
    protected function getAdapter()
    {
        return $this->_db;
    }
    
    private function setAdapter($db)
    {
        $this->_db = $db;
    }
}