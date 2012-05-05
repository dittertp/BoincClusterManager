<?php

class Application_Model_Nodes extends Application_Model_Resource_Nodes
{
    
    public function __construct ($nodeid = null){
        parent::__construct();
        $this->setNodeId($nodeid);
    }
    
    public function delete()
    {
        //@todo nodezugehörigkeiten müssen gelöscht werden!
        //@todo logs löschen
        $this->getAdapter()->delete ( $this->_tablename , 'id ='.$this->getNodeId() );
        return TRUE;
    }
    
    public function removeFromCluster($clusterid)
    {
        $where[]='__clusterid ='.$clusterid;
        $where[]='__nodeid ='.$this->getNodeId();
        $this->getAdapter()->delete ( $this->_mixedtable , $where);
        return TRUE;
    }
    
    public function addToCluster($id)
    {
        $data = array(  "__nodeid"=>$this->getNodeId() ,
                        "__clusterid"=>$id );
        
        $this->getAdapter()->insert ( $this->_mixedtable , $data );
        return TRUE;
    }
    
    public function detachProject($id)
    {
        #@info sinnfreie methode
        #@info nur nutzbar wenn node nicht in einem cluster hängt

        $where[]='__nodeid ='.$this->getNodeId();
        $where[]='id ='.$id;
        
        $this->getAdapter()->delete (  $this->_patable , $where ); 
    }

    
    private function setNodeId($id)
    {
        if($id) { 
            $this->_nodeid = $id;
        }
    }
    
    public function getNodeId()
    {
        if(!$this->_nodeid)
        {
            throw new Exception( "NodeId not set!" );
        }
        return $this->_nodeid;
    }
    
    public function getNode()
    {
        $erg = $this->getNodeById();
        $ar["id"] = $erg[0]["id"] ;
        $ar["name"] = $erg[0]["name"] ;
        $ar["ipaddress"] = $erg[0]["ip"];
        $ar["port"] = $erg[0]["port"];
        $ar["passphrase"] = $erg[0]["passphrase"];
        $ar["description"] = $erg[0]["description"];
        return $ar;
    }
    
    public function getAllNodesAsTree()
    {
        $ar = array();
        $i = 0;
        foreach ($this->getAllNodes() as $line )
        {
            $ar[$i]["id"] = $line["id"] ;
            $ar[$i]["text"] = $line["name"] ;
            $ar[$i]["type"] = "n";
            $ar[$i]["iconCls"] = "node";
            $ar[$i]["leaf"] = "true";
            $i++;
        }
        return $ar;
    }
    
    public function getAllNodesAsList()
    {
        $ar = array();
        $i = 0;
        foreach ($this->getAllNodes() as $line )
        {
            $ar[$i]["id"] = $line["id"] ;
            $ar[$i]["name"] = $line["name"] ;
            $ar[$i]["ipaddress"] = $line["ip"];
            $ar[$i]["port"] = $line["port"];
            $ar[$i]["passphrase"] = $line["passphrase"];
            $ar[$i]["description"] = $line["description"];
            $i++;
        }
        return $ar;
    }
    
        public function getAllNodesAsCombo()
    {
        $ar = array();
        $i = 0;
        foreach ($this->getAllNodes() as $line )
        {
            $ar[$i]["nid"] = $line["id"] ;
            $ar[$i]["nodename"] = $line["name"] ;
            $i++;
        }
        return $ar;
    }
    
    
    public function add($data)
    {
        $ar=array();
        $ar["name"]=$data[0]["name"];
        $ar["ip"]=$data[0]["ipaddress"];
        $ar["port"]=$data[0]["port"];
        $ar["passphrase"]=$data[0]["passphrase"];
        $ar["description"]=$data[0]["description"];
        $this->getAdapter()->insert ( $this->_tablename , $ar );
        return TRUE;
    }
    
    public function update($data)
    {
        $ar=array();
        $ar["name"]=$data[0]["name"];
        $ar["ip"]=$data[0]["ipaddress"];
        $ar["port"]=$data[0]["port"];
        $ar["passphrase"]=$data[0]["passphrase"];
        $ar["description"]=$data[0]["description"];
        $this->getAdapter()->update ( "node" , $ar , $this->_primary."=".$data[0]["id"] );
        return TRUE;
    }
    
   
}