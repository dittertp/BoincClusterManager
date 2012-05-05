<?php

class NodesController extends Zend_Controller_Action
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
        $cm = new Application_Model_Nodes();
        $result = $cm->getAllNodesAsTree();
        $this->_helper->extjs->add($result);
    }
    /**
    * @remotable
    * @remoteName getall
    * @argLen 1
    */
    public function getallAction()
    {
        $cm = new Application_Model_Nodes();
        $result = $cm->getAllNodesAsList();
        $this->_helper->extjs->add($result);
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
        $cm = new Application_Model_Nodes();
        $result = $cm->add($params);
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
        $cm = new Application_Model_Nodes($params[0]["data"][0]);
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
    * @remoteName getone
    * @argLen 1
    */
    public function getoneAction()
    {
        $params = $this->_getParam("RawJson");
        $cm = new Application_Model_Nodes($params[0]["data"][0]);
        $result = $cm->getNode();
        $return = array( "success" => true ,"data"=> $result );
        $this->_helper->extjs->add($return);
    }
    
    /**
    * @remotable
    * @remoteName getnodesummary
    * @argLen 1
    */
    public function getnodesummary2Action()
    {
        $params = $this->_getParam("RawJson");
        $count =0;
        $suspended=0;
        $active=0;
        $complete=0;
        $cm = new Application_Model_Nodes($params[0]["data"][0]);
        $node = $cm->getNode();
        
        $b = new Boinc_Rpc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        $state = $b->get_state();
        $result["domainname"] = (string)$state->client_state->host_info->domain_name;
        $result["cpus"] = (int)$state->client_state->host_info->p_ncpus;
        $result["osname"] = (string)$state->client_state->host_info->os_name;
        $clientversion = (string)$state->client_state->core_client_major_version;
        $clientversion .= (string)".".$state->client_state->core_client_minor_version;
        $result["clientversion"] = (string)$clientversion .= ".".$state->client_state->core_client_release;
        $result["projectscount"] = (string)count($state->client_state->project);
        
        foreach($state->client_state->result as $ob)
        {
            $count++;
                if($ob->active_task){
                    if($ob->active_task->scheduler_state == 1){
                        $suspended++;
                    }elseif($ob->active_task->scheduler_state == 2){
                        $active++;
                    }
                }
                if($ob->state == 5){
                    $complete++;
                }
        }
        $result["allwu"] = (string)$count;
        $result["suspwu"] = (string)$suspended;
        $result["activewu"] = (string)$active;      
        $result["completewu"] = (string)$complete;

        $return = array( "success" => true ,"data"=> $result );
        $this->_helper->extjs->add($return);
    }
    
    /**
    * @remotable
    * @remoteName getnodesummary
    * @argLen 1
    */
    public function getnodesummaryAction()
    {
        $params = $this->_getParam("RawJson");

        $cm = new Application_Model_Nodes($params[0]["data"][0]);
        $node = $cm->getNode();
        
        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        
        $result = $b->summary();
        
        $return = array( "success" => true ,"data"=> $result );
        $this->_helper->extjs->add($return);
    }
   
    /**
    * @remotable
    * @remoteName getworklist
    * @argLen 1
    */
    public function getworklistAction()
    {
        $params = $this->_getParam("RawJson");
        
        $cm = new Application_Model_Nodes($params[0]["data"][0]);
        $node = $cm->getNode();
        
        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        
        $result = $b->worklist();
        
        $this->_helper->extjs->add($result);
    }

        /**
    * @remotable
    * @remoteName getprojectlist
    * @argLen 1
    */
    public function getprojectlistAction()
    {
        $params = $this->_getParam("RawJson");
        
        $cm = new Application_Model_Nodes($params[0]["data"][0]);
        $node = $cm->getNode();
        
        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        
        $result = $b->projectlist();
        
        $this->_helper->extjs->add($result);
    }


    /**
     * @remotable
     * @remoteName gettransferlist
     * @argLen 1
     */
    public function gettransferlistAction()
    {
        $params = $this->_getParam("RawJson");

        $cm = new Application_Model_Nodes($params[0]["data"][0]);
        $node = $cm->getNode();

        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);

        $result = $b->transferlist();

        $this->_helper->extjs->add($result);
    }


    
    /**
    * @remotable
    * @remoteName getmessagelist
    * @argLen 1
    */
    public function getmessagelistAction()
    {
        $params = $this->_getParam("RawJson");
        
        $cm = new Application_Model_Nodes($params[0]["data"][0]);
        $node = $cm->getNode();
        
        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        
        $result = $b->messagelist();
        
        $this->_helper->extjs->add($result);
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
        $cm = new Application_Model_Nodes();
        $result = $cm->update($params);
        
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
    * @remoteName addtocluster
    * @argLen 0
    * @formHandler
    */
    public function addtoclusterAction()
    {
        $params = $this->_getParam("RawJson");

        $cm = new Application_Model_Nodes( $params[0]["nid"] );
        $result = $cm->addToCluster( $params[0]["cid"] );
        
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
     * @remoteName addproject
     * @argLen 0
     * @formHandler
     */
    public function addprojectAction()
    {
        $params = $this->_getParam("RawJson");
        $cm = new Application_Model_Nodes( $params[0]["nodeid"] );
        $node = $cm->getNode();

        $pj = new Application_Model_Projects();
        $p = $pj->getProjectAsList2( $params[0]["projectid"] );

        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);

        $b->attachProject( $p["url"] , $p["authkey"] );

        $return = array( "success" => true );

        $this->_helper->extjs->add($return);
    }

    /**
     * @remotable
     * @remoteName suspendproject
     * @argLen 1
     */
    public function suspendprojectAction() {
        $params = $this->_getParam("RawJson");
        $nodeid = $params[0]["data"][0][0];
        $projecturl = $params[0]["data"][0][1];

        $cm = new Application_Model_Nodes( $nodeid );
        $node = $cm->getNode();

        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        $b->suspendProject( $projecturl );

        $return = array( "success" => true );

        $this->_helper->extjs->add($return);
    }

    /**
     * @remotable
     * @remoteName resumeproject
     * @argLen 1
     */
    public function resumeprojectAction() {
        $params = $this->_getParam("RawJson");
        $nodeid = $params[0]["data"][0][0];
        $projecturl = $params[0]["data"][0][1];

        $cm = new Application_Model_Nodes( $nodeid );
        $node = $cm->getNode();

        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        $b->resumeProject( $projecturl );

        $return = array( "success" => true );

        $this->_helper->extjs->add($return);
    }

    /**
     * @remotable
     * @remoteName freezeproject
     * @argLen 1
     */
    public function freezeprojectAction() {
        $params = $this->_getParam("RawJson");
        $nodeid = $params[0]["data"][0][0];
        $projecturl = $params[0]["data"][0][1];

        $cm = new Application_Model_Nodes( $nodeid );
        $node = $cm->getNode();

        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        $b->freezeProject( $projecturl );

        $return = array( "success" => true );

        $this->_helper->extjs->add($return);
    }

    /**
     * @remotable
     * @remoteName thawproject
     * @argLen 1
     */
    public function thawprojectAction() {
        $params = $this->_getParam("RawJson");
        $nodeid = $params[0]["data"][0][0];
        $projecturl = $params[0]["data"][0][1];

        $cm = new Application_Model_Nodes( $nodeid );
        $node = $cm->getNode();

        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        $b->thawProject( $projecturl );

        $return = array( "success" => true );

        $this->_helper->extjs->add($return);
    }

    /**
     * @remotable
     * @remoteName detachproject
     * @argLen 1
     */
    public function  detachprojectAction() {
        $params = $this->_getParam("RawJson");
        $nodeid = $params[0]["data"][0][0];
        $projecturl = $params[0]["data"][0][1];

        $cm = new Application_Model_Nodes( $nodeid );
        $node = $cm->getNode();

        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        $b->detachProject( $projecturl );

        $return = array( "success" => true );

        $this->_helper->extjs->add($return);
    }


    /**
     * @remotable
     * @remoteName updateproject
     * @argLen 1
     */
    public function  updateprojectAction() {
        $params = $this->_getParam("RawJson");
        $nodeid = $params[0]["data"][0][0];
        $projecturl = $params[0]["data"][0][1];

        $cm = new Application_Model_Nodes( $nodeid );
        $node = $cm->getNode();

        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        $b->updateProject( $projecturl );

        $return = array( "success" => true );

        $this->_helper->extjs->add($return);
    }

    /**
     * @remotable
     * @remoteName resetproject
     * @argLen 1
     */
    public function  resetprojectAction() {
        $params = $this->_getParam("RawJson");
        $nodeid = $params[0]["data"][0][0];
        $projecturl = $params[0]["data"][0][1];

        $cm = new Application_Model_Nodes( $nodeid );
        $node = $cm->getNode();

        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        $b->resetProject( $projecturl );

        $return = array( "success" => true );

        $this->_helper->extjs->add($return);
    }

    /**
     * @remotable
     * @remoteName suspendresult
     * @argLen 1
     */
    public function  suspendresultAction() {
        $params = $this->_getParam("RawJson");
        $nodeid = $params[0]["data"][0][0];
        $projecturl = $params[0]["data"][0][1];
        $file = $params[0]["data"][0][2];

        $cm = new Application_Model_Nodes( $nodeid );
        $node = $cm->getNode();

        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        $b->suspendResult( $file , $projecturl );

        $return = array( "success" => true );

        $this->_helper->extjs->add($return);
    }

    /**
     * @remotable
     * @remoteName resumeresult
     * @argLen 1
     */
    public function  resumeresultAction() {
        $params = $this->_getParam("RawJson");
        $nodeid = $params[0]["data"][0][0];
        $projecturl = $params[0]["data"][0][1];
        $file = $params[0]["data"][0][2];

        $cm = new Application_Model_Nodes( $nodeid );
        $node = $cm->getNode();

        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        $b->resumeResult( $file , $projecturl );

        $return = array( "success" => true );

        $this->_helper->extjs->add($return);
    }

    /**
     * @remotable
     * @remoteName abortresult
     * @argLen 1
     */
    public function  abortresultAction() {
        $params = $this->_getParam("RawJson");
        $nodeid = $params[0]["data"][0][0];
        $projecturl = $params[0]["data"][0][1];
        $file = $params[0]["data"][0][2];

        $cm = new Application_Model_Nodes( $nodeid );
        $node = $cm->getNode();

        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        $b->abortResult( $file , $projecturl );

        $return = array( "success" => true );

        $this->_helper->extjs->add($return);
    }

    /**
     * @remotable
     * @remoteName retrytransfer
     * @argLen 1
     */
    public function retrytransferAction() {
        $params = $this->_getParam("RawJson");
        $nodeid = $params[0]["data"][0][0];
        $projecturl = $params[0]["data"][0][1];
        $file = $params[0]["data"][0][2];

        $cm = new Application_Model_Nodes( $nodeid );
        $node = $cm->getNode();

        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        $b->retryTransfer( $file , $projecturl );

        $return = array( "success" => true );

        $this->_helper->extjs->add($return);
    }


    /**
    * @remotable
    * @remoteName deletenodefromcluster
    * @argLen 1
    */
    public function deletenodefromclusterAction()
    {
        $params = $this->_getParam("RawJson");

        $cm = new Application_Model_Nodes($params[0]["data"][0][1]);
        $result = $cm->removeFromCluster($params[0]["data"][0][0]);
         
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
 
    
    public function moepAction(){
        throw new asdException("error");
    }
    
    /**
    * @remotable
    * @remoteName getprefs
    * @argLen 1
    */
    public function getprefsAction()
    {
        $params = $this->_getParam("RawJson");
        $cm = new Application_Model_Nodes($params[0]["data"][0]);
        $node = $cm->getNode();
        
        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        
        $result = $b->getPrefs();
        $return = array( "success" => true ,"data"=> $result );
        $this->_helper->extjs->add($return);
    }
    
    /**
    * @remotable
    * @remoteName setprefs
    * @argLen 0
    * @formHandler
    */
    public function setprefsAction()
    {
        $prefs = array();
        $exclude = array("tid","action","method","type","extUpload","nodeid","aaaa");
        $params = $this->_getParam("RawJson");
        foreach($params[0] as $rowkey => $rowval){
            if (!in_array($rowkey, $exclude)) {
                $prefs[$rowkey] = $rowval;
            }
        }
        
        $params = $this->_getParam("RawJson");
        $cm = new Application_Model_Nodes($params[0]["nodeid"]);
        $node = $cm->getNode();
        
        $b = new Application_Model_Boinc();
        $b->connect($node["ipaddress"]);
        $b->auth($node["passphrase"]);
        
        $result = $b->setPrefs($prefs);
        if($result->set_global_prefs_override_reply->status == 0){
            $b->readPrefs();
            $return = array( "success" => true);
        }else{
            $return = array( "success" => false ,"errors" =>array("reason"=> 'fehler'));
        }
        $this->_helper->extjs->add($return);
    }
    
}