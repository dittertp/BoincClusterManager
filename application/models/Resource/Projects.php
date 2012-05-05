<?php


class Application_Model_Resource_Projects extends Application_Model_Bcm
{
	protected $_tablename = "projectcredentials";
	protected $_primary = "id";
	
	public function __construct (){
		parent::__construct();
	}

	protected function add($data){
		$this->getAdapter()->insert ( $this->_tablename , $data );
		return TRUE;
	}
	
	protected function update($data){
		$this->getAdapter()->update ( $this->_tablename , $data , $this->_primary.'='.$data["id"] );
		return TRUE;
	}
	
	protected function delete($id){
		$this->getAdapter()->delete ( $this->_tablename , $this->_primary.'='.$id );
		return TRUE;
	}
	
	protected function getAll(){
		$erg = $this->getAdapter()->fetchAll(
		$this->getAdapter()->select()->from( $this->_tablename ) );
		return $erg;
	}
	
	protected function getOne($data){
		$erg = $this->getAdapter()->fetchAll(
		$this->getAdapter()->select()
		->from($this->_tablename)
		->where ( $this->_primary." = ?", $data ));
		return $erg;
	}
	
	protected function readProjectXML()
	{
		$xml = simplexml_load_file(APPLICATION_PATH."/../data/all_projects_list.xml");
		return $xml;
	}
}