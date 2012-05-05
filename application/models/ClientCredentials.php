<?php

class Application_Model_ClientCredentials extends Application_Model_Bcm
{
    private $_name = "clientcredentials";
    private $_ccid = null;
    
    public function __construct ($ccid = null){
        parent::__construct();
        $this->setCCid($ccid);
    }

    public function delete($id = null)
    {
        //@todo prüfen ob aktuelle Credentials genutzt werden
        if(!$id) { $id = $this->getCCId(); }
        $this->getAdapter()->delete (  $this->_name , 'id ='.$id); 
    }

    public function add ( $data )
    {
         $data = array(  "name"=>$data["name"] ,
                        "passphrase"=>$data["passphrase"] );
        
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
     
    private function setCCId($id)
    {
        if($id) { 
            $this->_ccid = $id;
        }
    }
    
    private function getCCId()
    {
        if(!$this->_ccid)
        {
            throw new Exception( "ClientCredentialsId not set!" );
        }
        return $this->_ccid;
    }
    
}