<?php
class Extjs_Controller_Action_Helper_Extjs extends Zend_Controller_Action_Helper_Abstract {
	
	public function setTransactionsParams($resultData) {
		$result = array ();
		$params = $this->getRequest ()->getParams ();
		$result ['type'] = $params ['extparams'] ['type'];
		$result ['tid'] = $params ['extparams'] ['tid'];
		$result ['method'] = $params ['extparams'] ['method'];
		$result ['action'] = $params ['extparams'] ['action'];
		$result ['result'] = $resultData;
		return $result;
	}
	
	public function addResponseToBody($responseData) {
		$content = Zend_Json::encode ( $responseData, false, array () );
		// The goal here is to make sure we always add with a new ID, currently this doesnt work!
		/**
		 * @todo Fix the check for unique ID in the isset $body[$id]
		 */
		$id = rand ( 1, 100000000000 );
		$body = $this->getResponse ()->getBody ( true );
		while ( isset ( $body [$id] ) ) {
			$id = rand ( 1, 100000000000 );
		}
		
		#, ( string ) $id
		return $this->getResponse ()->appendBody ( $content);
	}
	
	public function add($resultData, $direct = TRUE) {
		if($direct == TRUE){
			$data = $this->setTransactionsParams ( $resultData );
		}else{
			$data = $resultData;
		}
		return $this->addResponseToBody ($data );
	}
}
?>