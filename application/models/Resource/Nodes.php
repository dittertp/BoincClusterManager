<?php

class Application_Model_Resource_Nodes extends Application_Model_Bcm
{
    protected $_tablename = "node";
    protected $_primary = "id";
    protected $_mixedtable = "cluster_node";
    protected $_nodeid = null;
    
    public function __construct (){
        parent::__construct();
    }

    public function getAllNodes()
    {
        $erg = $this->getAdapter()->fetchAll(
               $this->getAdapter()->select()->from( $this->_tablename) );
        return $erg;
    }
    
    public function getNodeById()
    {
        $erg = $this->getAdapter()->fetchAll(
               $this->getAdapter()->select()->from( $this->_tablename)->where($this->_primary." = ?",$this->getNodeId()) );
        return $erg;
    }
}
?>
