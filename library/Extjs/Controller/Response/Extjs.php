<?php
/** Zend_Controller_Response_Abstract */
require_once 'Zend/Controller/Response/Abstract.php';

/**
 * Extjs_Controller_Response_Extjs
 *
 * HTTP response for controllers
 *
 * @uses Zend_Controller_Response_Abstract
 * @package Zend_Controller
 * @subpackage Response
 */
class Extjs_Controller_Response_Extjs extends Zend_Controller_Response_Abstract {
	/**
	 * Echo the body segments
	 *
	 * @return void
	 */
    public function outputBody()
    {
    	$this->_body = array_filter($this->_body);
		if (count ( $this->_body ) == 1) {
			$body = implode ( '', $this->_body );
		} else {
			$bodyparts = array_filter ( $this->_body );
			$body = '[' . implode ( ',', $bodyparts ) . ']';
		}
		echo $body;
	}
	
	/**
	 * Send the response, including all headers, rendering exceptions if so
	 * requested. Force json
	 *
	 * @return void
	 */
	public function sendResponse() {
		$this->setHeader ( 'Content-Type', 'text/x-json', true );
		$this->sendHeaders ();
		
		if ($this->isException () && $this->renderExceptions ()) {
			$exceptions = '';
			foreach ( $this->getException () as $e ) {
				$exceptions .= $e->__toString () . "\n";
			}
			echo $exceptions;
			return;
		}
		
		$this->outputBody ();
	}
}
?>