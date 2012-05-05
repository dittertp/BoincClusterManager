<?php

class Application_Model_Resource_Cluster extends Application_Model_Bcm
{
    protected $_tablename = "cluster";
    protected $_mixedtable = "cluster_node";
    protected $_clusterid = null;
    protected $_primary = "id";

    
    public function __construct (){
        parent::__construct();
    }
    
    public function getClusterNodes()
    {
             $erg = $this->getAdapter()->fetchAll(
			$this->getAdapter()->select()
			->from($this->_mixedtable)
                        ->joinLeft ( 'node','node.id = '.$this->_mixedtable.'.__nodeid' )
                        ->where ( $this->_mixedtable.'.__clusterid = '.$this->getClusterId()) );
			
             return $erg;
    }

    public function getAllClusters()
    {
        $erg = $this->getAdapter()->fetchAll(
               $this->getAdapter()->select()->from( "cluster") );
        
        return $erg;
    }
    
    public function rename($clustername)
    {
        $ar=array ( 'name' => $clustername );
        $this->getAdapter()->update ( $this->_tablename , $ar , 'id ='.$this->getClusterId() );
    }
    
    public function delete()
    {
        //@todo nodezugehörigkeiten müssen gelöscht werden!
        //@todo evtl müssen danach cluster los gelöscht werden
        
        $this->removeAllNodes();
        $this->getAdapter()->delete ( $this->_tablename , 'id ='.$this->getClusterId() );
    }
    
    public function removeAllNodes()
    {
        $this->getAdapter()->delete ( $this->_mixedtable , '__clusterid ='.$this->getClusterId() );
    }
    
    public function addNode($id)
    {
        $data = array(  "__clusterid"=>$this->getClusterId(),
                        "__nodeid"=>$id );
        
        $this->getAdapter()->inset ( $this->_mixedtable , $data );
    }
    
    public function deleteNode($id)
    {
        $where[]='__clusterid ='.$clusterid;
        $where[]='__nodeid ='.$id;
        
        $this->getAdapter()->delete ( $this->_mixedtable , $where );
    }

    public function attachProject($data)
    {
        $data = array(  "__clusterid"=>$this->getClusterId(),
                        "__projectcredentialsid"=>$data["projectcredentialsid"],
                        "settings" => $data["settings"] );
            
        $this->getAdapter()->inset ( $this->_patable , $data );
    }
    
    public function detachProject($id)
    {

        $where[]='__clusterid ='.$this->getClusterId();
        $where[]='id ='.$id;
        
        $this->getAdapter()->delete (  $this->_patable , $where ); 
    }
    
        
    protected function setClusterId ($id)
    {
        if($id)
        {
            $this->_clusterid = $id;
        }
        return TRUE;
    }
    
    protected function getClusterId()
    {
        if(!$this->_clusterid)
        {
            throw new Exception( "ClusterId not set!" );
        }
        return $this->_clusterid;
    }
    
    public function add($data)
    {
        $this->getAdapter()->insert ( $this->_tablename , $data );
    }

    public function getClusterById()
    {
        $erg = $this->getAdapter()->fetchAll(
               $this->getAdapter()->select()->from( $this->_tablename)->where($this->_primary." = ?",$this->getClusterId()) );
        return $erg;
    }
}