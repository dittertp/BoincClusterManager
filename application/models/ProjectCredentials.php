<?php

class Application_Model_ProjectCredentials extends Application_Model_Bcm
{
    private $_name = "projectcredentials";
    private $_pcid = null;
    
    public function __construct ($pcid = null){
        parent::__construct();
        $this->setPCid($pcid);
    }

    public function delete($id = null)
    {
        //@todo prüfen ob aktuelle Credentials genutzt werden
        if(!$id) { $id = $this->getPCId(); }
        $this->getAdapter()->delete (  $this->_name , 'id ='.$id); 
    }

    public function add ( $data )
    {      
        $this->getAdapter()->insert ( $this->_name , $data );
    }
    
    public function getAll()
    {
        return $this->getAdapter()->fetchAll ( $this->_name )->toArray();
    }
    
    public function edit ( $data )
    {
        $this->getAdapter()->update ( $this->_name , $data , 'id ='.$data["id"] );
    }
     
    private function setPCId($id)
    {
        if($id) { 
            $this->_pcid = $id;
        }
    }
    
    private function getPCId()
    {
        if(!$this->_pcid)
        {
            throw new Exception( "ProjectCredentialsId not set!" );
        }
        return $this->_pcid;
    }
    
}