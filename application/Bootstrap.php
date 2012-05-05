<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
    	protected function _initAutoload()
	{
            $modelLoader = new Zend_Application_Module_Autoloader(array('namespace'=>'','basePath'=>APPLICATION_PATH));
            Zend_Loader_Autoloader::getInstance()->registerNamespace('Boinc_');
            return $modelLoader;
	}

	public function _initExtdirect() {
		Zend_Controller_Action_HelperBroker::addPrefix('Extjs_Controller_Action_Helper');
                
		$front = Zend_Controller_Front::getInstance ();
		$request = new Extjs_Controller_Request_RawJson ();
                
		$front->setRequest ( $request );
		// if this is a Extjs request we switch response and adds a Extjs helper action for the different controllers
		if ($front->getRequest ()->isXmlHttpRequest ()) {
			$response = new Extjs_Controller_Response_Extjs ();
			$front->setResponse ( $response );
			$extjshelper = new Extjs_Controller_Action_Helper_Extjs ();
			Zend_Controller_Action_HelperBroker::addHelper ( $extjshelper );
		}
	}

}

