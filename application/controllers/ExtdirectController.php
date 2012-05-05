<?php
class ExtdirectController extends Zend_Controller_Action {
	
	public $extdirectConfig = null;
	
	public function init() {
		/**
		 * Removing the view renderer for ajax reqs
		 */
		if ($this->getRequest ()->isXmlHttpRequest ()) {
			$this->_helper->removeHelper ( 'viewRenderer' );
		} else {
			$this->extdirectConfig = new Zend_Config_Ini ( APPLICATION_PATH . "/configs/extdirect.ini" );
			$response = new Zend_Controller_Response_Http ();
			$this->getFrontController ()->setResponse ( $response );
		}
	}
	
	/**
	 * Index action is responsible for adding the extjs requests to the stack
	 * Doing the routing part...
	 */
	public function indexAction() {
            
		// action body
		if ($this->getRequest ()->isXmlHttpRequest ()) {
			// do the handling of your ajax request				
			$request = $this->getRequest ();
			/* @var $request Axpa_Controller_Request_RawJson */
			if ($request->requestCount !== 0) {
				$params = $this->getRequest ()->getParams ();
				foreach ( $params ['RawJson'] as $json ) {
					$jsonrequest = clone $request;
					/* @var $request Axpa_Controller_Request_RawJson */
					/* Controllers in extjs are called actions and actions are methods */
					$data ['extparams'] = $json;
					$jsonrequest->setActionName ( strtolower ( $json ["method"] ) )->setControllerName ( ucfirst ( strtolower ( $json ["action"] ) ) )->setParams ( $data );
					$this->_helper->actionStack ( $jsonrequest );
				}
			}
		}
	}
	/**
	 * javascript include to declare Ext.Direct functions
	 */
	public function getapiAction() {
		$this->setResponse ( $this->getFrontController ()->getResponse () );
		$this->getResponse ()->setHeader ( 'content-type', 'text/javascript', true );
		$controllerDirs = $this->getFrontController ()->getControllerDirectory ();
		foreach ( $this->extdirectConfig->extdirect->extdirect->classes as $class ) {
			$methods = array();
			if (class_exists ( $class ) === false) {
				$classname = preg_replace ( '/Controller$/', '', $class, 1 );
				$loadedFile = Zend_Loader::loadFile ( $class . ".php", $controllerDirs, true );
				if ($loadedFile) {
					$rClass = new ReflectionClass ( $class );
					if (strlen ( $rClass->getDocComment () ) > 0) {
						$doc = $rClass->getDocComment ();
						if (! ! preg_match ( '/' . $this->extdirectConfig->extdirect->extdirect->nameAttribute . ' ([\w]+)/', $doc, $matches )) {
							$classname = $matches [1];
						}
					}
					$rMethods = $rClass->getMethods ();
					foreach ( $rMethods as $rMethod ) {
						/* @var $rMethod ReflectionMethod */
						if ($rMethod->isPublic () && strlen ( $rMethod->getDocComment () ) > 0) {
							$doc = $rMethod->getDocComment ();
							$isRemote = ! ! preg_match ( '/' . $this->extdirectConfig->extdirect->extdirect->remoteAttribute . '/', $doc );
							if ($isRemote) {
								$method = array ('name' => $rMethod->getName ());
								//, 'len' => $rMethod->getNumberOfParameters ()
								if (! ! preg_match ( '/' . $this->extdirectConfig->extdirect->extdirect->argLenAttribute . ' ([\w]+)/', $doc, $matches )) {


									$method ['len'] = (int) $matches [1];
								}else{
									$method ['len'] = 0;
								}
								if (! ! preg_match ( '/' . $this->extdirectConfig->extdirect->extdirect->nameAttribute . ' ([\w]+)/', $doc, $matches )) {
									$method ['serverMethod'] = $method ['name'];
									$method ['name'] = $matches [1];
								}
								if (! ! preg_match ( '/' . $this->extdirectConfig->extdirect->extdirect->formAttribute . '/', $doc )) {
									$method ['formHandler'] = true;
								}
								$methods [] = $method;
							}
						}
					}
					if (count ( $methods ) > 0) {
						$classes [$classname] = $methods;
					}
				}
			}
		
		}
		$api = array ('url' => $this->extdirectConfig->extdirect->extdirect->routerUrl, 'type' => $this->extdirectConfig->extdirect->extdirect->type, 'actions' => $classes );
		if ($this->extdirectConfig->extdirect->extdirect->namespace !== false) {
			if(!empty($this->extdirectConfig->extdirect->extdirect->namespace)){
				$api ['namespace'] = $this->extdirectConfig->extdirect->extdirect->namespace;
				$this->view->namespace = $api ['namespace'];
			}
		}
		$this->view->api = $api;
		$this->view->descriptor = $this->extdirectConfig->extdirect->extdirect->descriptor;
	}

	
}
?>