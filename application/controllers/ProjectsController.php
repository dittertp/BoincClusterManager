<?php

class ProjectsController extends Zend_Controller_Action
{

	public function init()
	{
		$this->_helper->removeHelper('viewRenderer');
	}

	/**
	* @remotable
	* @remoteName allprojectslist
	* @argLen 1
	*/
	public function allprojectslistAction()
	{
		$projects = new Application_Model_Projects();
		$result = $projects->AvalProjectsAsList();
		
		$this->_helper->extjs->add($result);
	}

    /**
     * @remotable
     * @remoteName getallprojectsascombo
     * @argLen 1
     */
    public function getallprojectsascomboAction(){
        $projects = new Application_Model_Projects();
        $result = $projects->getProjectsAsCombo();
        $this->_helper->extjs->add($result);
    }

    /**
     * @remotable
     * @remoteName getavailprojectsascombo
     * @argLen 1
     */
    public function getavailprojectsascomboAction(){
        $params = $this->_getParam("RawJson");
        $availprojects = array();
        $i=0;

        $projobj = new Application_Model_Projects();
        $result = $projobj->getProjectsAsList();

        $nodeobj = new Application_Model_Nodes($params[0]["data"][0]);
        $node = $nodeobj->getNode();

        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        $projects = $b->getAttachedProjects();

        foreach ($projects as $prow)
        {
            $projecturl[] = $prow["url"];
        }

        foreach ($result as $row)
        {
            if(!in_array($row["url"],$projecturl)){
                $availprojects[$i]["projectid"] = $row["id"];
                #$availprojects[$i]["url"] = $row["url"];
                $availprojects[$i]["name"] = $row["name"];
                $i++;
            }
        }
        $this->_helper->extjs->add($availprojects);
    }
	
	/**
	* @remotable
	* @remoteName getall
	* @argLen 1
	*/
	public function getallAction()
	{
		#echo "test";
		$projects = new Application_Model_Projects();
		$result = $projects->getProjectsAsList();
		#print_r($result);
		$this->_helper->extjs->add($result);
	}
	
	/**
	* @remotable
	* @remoteName getone
	* @argLen 1
	*/
	public function getoneAction()
	{
		$param = $this->_getParam("RawJson");
		$project = new Application_Model_Projects();
		$result = $project->getProjectAsList($param);
                $return = array( "success" => true ,"data"=> $result );
		$this->_helper->extjs->add($return);
	}
        
        /**
	* @remotable
	* @remoteName remove
	* @argLen 1
	*/
	public function removeAction()
	{
		$param = $this->_getParam("RawJson");
                #print_r($param);
		$project = new Application_Model_Projects();
		$result = $project->deleteProject($param);
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
	* @remoteName submit
	* @argLen 0
	* @formHandler
	*/
	public function submitAction()
	{
		$params = $this->_getParam("RawJson");
		$cm = new Application_Model_Projects();
		$result = $cm->addProject($params);
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
	* @remoteName update
	* @argLen 0
	* @formHandler
	*/
	public function updateAction()
	{
		$params = $this->_getParam("RawJson");
		$cm = new Application_Model_Projects();
		$result = $cm->updateProject($params);
	
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
	
}