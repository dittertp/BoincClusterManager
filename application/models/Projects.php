<?php

class Application_Model_Projects extends Application_Model_Resource_Projects
{
	public function __construct (){
		parent::__construct();
	}
	
	
	public function AvalProjectsAsList(){
		$xml = $this->readProjectXML();
		$ar=array();
		$ar[0]["name"] = (string)"wählen...";
		$ar[0]["url"] = (string)"na";
		for($i=0;$i<count($xml->project);$i++){
			$ar[$i+1]["name"] = (string)$xml->project[$i]->name;
			$ar[$i+1]["url"] = (string)$xml->project[$i]->url;
		}
		return $ar;
	}
	
	public function getProjectsAsList(){
		$projects = $this->getAll();
		return $projects;
	}


    public function getProjectsAsCombo()
    {
        $ar = array();
        $i = 0;
        foreach ($this->getAll() as $line )
        {
            $ar[$i]["pid"] = $line["id"] ;
            $ar[$i]["name"] = $line["name"] ;
            $i++;
        }
        return $ar;
    }

	
	public function getProjectAsList($param){
		$project = $this->getOne($param[0]["data"][0]);
		return $project[0];
	}

    public function getProjectAsList2($id){
        $project = $this->getOne($id);
        return $project[0];
    }
	
	public function addProject($data){
		$ar = array();
		$ar["name"] = $data[0]["name"];
		$ar["projectname"] = $data[0]["projectname"];
		$ar["url"] = $data[0]["url"];
		$ar["username"] = $data[0]["username"];
		$ar["password"] = $data[0]["password"];
		$ar["authkey"] = $data[0]["authkey"];
		
		return $this->add($ar);
	}
	
	public function updateProject($data){
		$ar = array();
		$ar["id"] = $data[0]["id"];
		$ar["name"] = $data[0]["name"];
		$ar["projectname"] = $data[0]["projectname"];
		$ar["url"] = $data[0]["url"];
		$ar["username"] = $data[0]["username"];
		$ar["password"] = $data[0]["password"];
		$ar["authkey"] = $data[0]["authkey"];
	
		return $this->update($ar);
	}
        
        public function deleteProject($data){
            $id = $data[0]["data"][0];
            return $this->delete($id);
        }
}