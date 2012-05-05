<?php

class ClusterController extends Zend_Controller_Action
{

    public function init()
    {
        $this->_helper->removeHelper('viewRenderer');
    }

    /**
    * @remotable
    * @remoteName tree
    * @argLen 1
    */
    public function treeAction()
    {
        $params = $this->_getParam("RawJson");
        
        if($params[0]["data"][0])
        {    
            $cm = new Application_Model_Cluster( $params[0]["data"][0] );
            $result = $cm->getClusterNodesAsTree();
        }
        else
        {
            $cm = new Application_Model_Cluster();
            $result = $cm->getAllClustersAsTree();
        }
        $this->_helper->extjs->add($result);
    }

    
    /**
    * @remotable
    * @remoteName getnodesascombo
    * @argLen 1
    */
    public function getnodesascomboAction()
    {
        $params = $this->_getParam("RawJson");
        
        if($params[0]["data"][0])
        {    
            $cm = new Application_Model_Cluster( $params[0]["data"][0] );
            $result = $cm->getClusterNodesAsList();
        }
        $this->_helper->extjs->add($result);
    }
    
        
    /**
    * @remotable
    * @remoteName getnodesnotincluster
    * @argLen 1
    */
    public function getnodesnotinclusterAction()
    {
        $params = $this->_getParam("RawJson");
        $nodeidar=array();
        $availnodes=array();
        $i=0;
        
        $cluster = new Application_Model_Cluster( $params[0]["data"][0] );
        $cres = $cluster->getClusterNodesAsList();
        
        $nodes = new Application_Model_Nodes();
        $nres = $nodes->getAllNodesAsCombo();
        
        foreach ($cres as $cr)
        {
            $nodeidar[]=$cr["nid"];
        }
        foreach($nres as $nr)
        {
            if(!in_array($nr["nid"], $nodeidar ))
            {
                $availnodes[$i]["nid"]=$nr["nid"];
                $availnodes[$i]["nodename"]=$nr["nodename"];
                $i++;
            }
        }
        $this->_helper->extjs->add($availnodes);
    }
    
    /**
    * @remotable
    * @remoteName submit
    * @argLen 0
    * @formHandler
    */
    public function submitAction()
    {
        $params = $this->_getParam("RawJson");
        $cm = new Application_Model_Cluster();
        $result = $cm->addCluster($params);
        if($result == TRUE )
        {
            $return = array( "success" => true );
        }
        else
        {
            $return = array( "success" => false );
        }
        $this->_helper->extjs->add($return);
    }
    
    
    /**
    * @remotable
    * @remoteName delete
    * @argLen 1
    */
    public function deleteAction()
    {
        $params = $this->_getParam("RawJson");
        $cm = new Application_Model_Cluster($params[0]["data"][0]);
        $result = $cm->delete();
        if($result == TRUE )
        {
            $return = array( "success" => true );
        }
        else
        {
            $return = array( "success" => false );
        }
        $this->_helper->extjs->add($return);
    }
        
    /**
    * @remotable
    * @remoteName getall
    * @argLen 1
    */
    public function getallAction()
    {
        $cm = new Application_Model_Cluster();
        $result = $cm->getAllClustersAsList();
        $this->_helper->extjs->add($result);
    }
    
    /**
    * @remotable
    * @remoteName getone
    * @argLen 1
    */
    public function getoneAction()
    {
        $params = $this->_getParam("RawJson");
        $cm = new Application_Model_Cluster($params[0]["data"][0]);
        $result = $cm->getCluster();
        $return = array( "success" => true ,"data"=> $result );
        $this->_helper->extjs->add($return);
    }
    
    /**
    * @remotable
    * @remoteName update
    * @argLen 0
    * @formHandler
    */
    public function updateAction()
    {
        $params = $this->_getParam("RawJson");
        $cm = new Application_Model_Cluster();
        $result = $cm->updateCluster($params);
        
        if($result == TRUE )
        {
            $return = array( "success" => true );
        }
        else
        {
            $return = array( "success" => false );
        }
        $this->_helper->extjs->add($return);
    }
    
        /**
    * @remotable
    * @remoteName overview
    * @argLen 1
    */
    public function overviewAction()
    {
        $params = $this->_getParam("RawJson");
        $cm = new Application_Model_Cluster($params[0]["data"][0]);
        $result = $cm->getClusterNodesAsList();

        $this->_helper->extjs->add($result);
    }
    
}