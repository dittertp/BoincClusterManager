<?php

class Application_Model_Cluster extends Application_Model_Resource_Cluster
{
    private $_mapper = null;
    
    public function __construct ( $cid = null){
        parent::__construct();
        $this->setClusterId($cid);
        
    $this->_mapper = array (
                    "clustertree" => array("id" => "id",
                                    "name" => "text"),
                    "nodetree" => array("id" => "id",
                                    "name" => "text")
                    );
    }
    
    public function getClusterNodesAsTree()
    {
        $ar = array();
        $i = 0;
        foreach ($this->getClusterNodes() as $line )
        {
            $ar[$i]["nodeid"] = $line["id"];
            $ar[$i]["type"] = "n";
            $ar[$i]["iconCls"] = "node";
            $ar[$i]["text"] = $line["name"];
            $ar[$i]["leaf"] = true;
            $i++;
        }
        return $ar;
    }
    
    public function getClusterNodesAsList()
    {
        $ar = array();
        $i = 0;
        foreach ($this->getClusterNodes() as $line )
        {
            $ar[$i]["nid"] = $line["id"];
            $ar[$i]["nodename"] = $line["name"];
            $i++;
        }
        return $ar;
    }

    public function getClusterNodesAsCombo()
    {
        $ar = array();
        $i = 0;
        foreach ($this->getClusterNodes() as $line )
        {
            $ar[$i]["nid"] = $line["id"];
            $ar[$i]["nodename"] = $line["name"];
            $i++;
        }
        return $ar;
    }

    public function getAllClustersAsTree()
    {
       $ar = array();
       $i=0;
       foreach( $this->getAllClusters() as $row )
       {
           $ar[$i]["id"] = $row["id"] ;
            $ar[$i]["clusterid"] = $row["id"] ;
            $ar[$i]["text"] = $row["name"] ;
            $ar[$i]["iconCls"] = "cluster";
            $ar[$i]["type"] = "c" ;
            $i++;
       }
       return $ar;
    }

    public function getAllClustersAsList()
    {
       $ar = array();
       $i=0;
       foreach( $this->getAllClusters() as $row )
       {
            $ar[$i]["id"] = $row["id"] ;
            $ar[$i]["name"] = $row["name"] ;
            $ar[$i]["description"] = $row["description"] ;
            $i++;
       }
       return $ar;
    }
    
   
    public function addCluster($data)
    {
        $ar=array();
        $ar["name"]=$data[0]["name"];
        $ar["description"]=$data[0]["description"];
        $this->add($ar);
        return true;
    }
    
    public function updateCluster($data)
    {
        $ar=array();
        $ar["name"]=$data[0]["name"];
        $ar["description"]=$data[0]["description"];
        $this->getAdapter()->update ( $this->_tablename , $ar , $this->_primary."=".$data[0]["id"] );
        return TRUE;
    }
    
    public function getCluster()
    {
        $erg = $this->getClusterById();
        $ar["name"] = $erg[0]["name"] ;
        $ar["description"] = $erg[0]["description"];

        return $ar;
    }
    
    
    
    
    public function getMapper($mapper)
    {
        return $this->_mapper[$mapper];
    }
    
    private function map($mm, $ar )
    {
        $mapping = $this->getMapper($mm);
        foreach($ar as $archild)
	{
            foreach ($mapping as $mappingkey => $mappingval )
            {
                $tmpar[$mappingval]=$archild[$mappingkey];
            }
            $newarray[] = $tmpar;
            $tmpar = array();
	}
	return $newarray;
    }
    
    private function rmap($mm, $ar )
    {
        $mapping = array_flip($this->getMapper($mm));
	foreach($ar as $archild)
        {
            foreach ($mapping as $mappingkey => $mappingval )
            {
                $tmpar[$mappingval]=$archild[$mappingkey];
            }
            $newarray[] = $tmpar;
            $tmpar = array();
        }
        return $newarray;
    }

}