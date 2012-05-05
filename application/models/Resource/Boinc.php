<?php

class Application_Model_Resource_Boinc
{
	protected $_connectionstatus = 2; #2 = not set, #1 = SUCCESS; #0 FALSE (no connection possible)
	protected $_authstatus = 2; #2 = not set, #1 = SUCCESS; #0 FALSE (wrong credentials)
    protected $_boinc;
    public function __construct() {
    }    
        
    public function connect ( $ip , $port=NULL ){
        if($this->ping($ip)){
            if( $this->getSession()->connect($ip,$port) ){
        	    $this->_connectionstatus = TRUE;
            }else{
        	    $this->_connectionstatus = FALSE;
            }
        }else{
            $this->_connectionstatus = FALSE;
        }
        return $this->_connectionstatus;
    }
    
    public function auth ( $passphrase ){
    	if( $this->getSession()->auth($passphrase) ){
    		$this->_authstatus = TRUE;
    	}else{
    		$this->_authstatus = FALSE;
    	}
        return $this->_authstatus; 
    }
    
    public function state(){
        return $this->getSession()->get_state();
    }
    
    public function messages(){
        return $this->getSession()->get_messages();
    }
    
    public function attachedProjects(){
        return $this->getSession()->get_attached_projects();
    }
    
    public function prefs(){
        return $this->getSession()->get_prefs();
    }
    
    public function setPrefsRes($pref){
        $xmlpref = array();
        foreach($pref as $key => $val){
            $xmlpref .= "<".$key.">".$val."</".$key.">";
        }
        return $this->getSession()->set_prefs($xmlpref);
    }
    
    public function getSession(){
        return $this->_boinc;
    }
    
    public function setSession($s){
        $this->_boinc = $s;
        return true;
    }
    
    public function readPrefs(){
        return $this->getSession()->read_prefs();
    }

    public function ping($ip){
        if( exec("ping -c 1 ".$ip) )
        {
            return TRUE;
        }
        return FALSE;
    }
}
