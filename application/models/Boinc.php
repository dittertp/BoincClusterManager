<?php

class Application_Model_Boinc extends Application_Model_Resource_Boinc
{
    public function __construct() {
        parent::__construct();
        $this->_boinc = new Boinc_Rpc();
    }
    
    public function summary(){
    	$count =0;
    	$suspended=0;
    	$active=0;
    	$complete=0;
    	
    	if($this->_connectionstatus == FALSE ){
    		$result["domainname"] = (string)"n/a";
    		$result["cpus"] = (string)"n/a";
    		$result["osname"] = (string)"n/a";
    		$result["clientversion"] = (string)"n/a";
    		$result["projectscount"] = (string)"n/a";
    		$result["allwu"] = (string)"n/a";
    		$result["suspwu"] = (string)"n/a";
    		$result["activewu"] = (string)"n/a";
    		$result["completewu"] = (string)"n/a";
    		$result["status"] = (string)"TIMEOUT";
    	}elseif($this->_authstatus == FALSE ){
    		$result["domainname"] = (string)"n/a";
    		$result["cpus"] = (string)"n/a";
    		$result["osname"] = (string)"n/a";
    		$result["clientversion"] = (string)"n/a";
    		$result["projectscount"] = (string)"n/a";
    		$result["allwu"] = (string)"n/a";
    		$result["suspwu"] = (string)"n/a";
    		$result["activewu"] = (string)"n/a";
    		$result["completewu"] = (string)"n/a";
    		$result["status"] = (string)"Auth failed";
    	}else{
	        $state = $this->state();
	        
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
	                if($ob->state == 5 or $ob->state == 4){
	                    $complete++;
	                }
	        }
	        $result["allwu"] = (string)$count;
	        $result["suspwu"] = (string)$suspended;
	        $result["activewu"] = (string)$active;      
	        $result["completewu"] = (string)$complete;
	        $result["status"] = (string)"OK";
    	}
        return $result;
    }
    
    public function worklist(){
        $workunit = array();
        $projecturls = array();
        $projectnames = array();
        $appname = array();
        $appufname = array();
        $i = 0;
        
        $state = $this->state();

        //einzelne arrays für name und urls um nach url suchen zu können und
        //dann mit dem selben key den namen dazu raussuchen zu können
        foreach ($state->client_state->project as $row)
        {
            $projecturls[$i] = (string)$row->master_url;
            $projectnames[$i] = (string)$row->project_name;
            $i++;
        }
        
        //liest die appnamen und die vollstaendigen namen ein
        $i=0;
        $row=0;
        foreach ($state->client_state->app as $row)
        {
            $appname[$i] = (string)$row->name;
            $appufname[$i] = (string)$row->user_friendly_name;
            $i++;
        }

        //dieser zeil liest die Anwendung aus und schreibt den vollstaendingen
        //namen ins wu array
        $i=0;
        $row=0;
        foreach ($state->client_state->workunit as $row)
        {
            $workunit[$i]["app"] = $appufname[array_search((string)$row->app_name,$appname)];
            $i++;
        }
        
        //dieser zeil liest die Anwendung aus und schreibt den vollstaendingen
        //namen ins wu array
        $i=0;
        $row=0;
        $suspended=0;
        $active=0;
        $complete=0;
        
        foreach ($state->client_state->result as $ob)
        {
            $statusid="1";
            $status="Zur Ausführung bereit";
            $timepast = "---";
            
            $workunit[$i]["project"]= $projectnames[array_search((string)$ob->project_url,$projecturls)];
            $workunit[$i]["app"] = $appufname[array_search((string)$ob->app_name,$appname)];
            $workunit[$i]["name"] = (string)$ob->name;
            $workunit[$i]["url"] = (string)$ob->project_url;
            
            
            if($ob->active_task)
            {
                $timepast = (int)$ob->active_task->elapsed_time;
                if($ob->active_task->scheduler_state == 1){
                    $status ="Verdrängt";
                    $suspended++;
                }elseif($ob->active_task->scheduler_state == 2){
                    
                    if($ob->edf_scheduled){
                        $status = "Aktiv, hohe Priorität";          
                    }else{
                        $status = "Aktiv";
                    }
                    $active++;
                }
            }
            if($ob->final_elapsed_time){
                $timepast = (int)$ob->final_elapsed_time;
            }
            if($ob->estimated_cpu_time_remaining == 0)
            {
                $timeremaining = "---";

            }else{
                $timeremaining = (int)$ob->estimated_cpu_time_remaining;
            }
            if($ob->suspended_via_gui){
                $status = "Angehalten durch Benutzer";
                $statusid = "2";
            }
            if($ob->state == 5){
                $status = "Hochgeladen, meledebereit";
                $complete++;
            }
            if($ob->state == 4){
                $status = "Am hochladen";
                $complete++;
            }
            
            $ct = $timepast+(int)$ob->estimated_cpu_time_remaining;
            $op = $ct/100;
            $prozent = $timepast/$op;
            
            
            $workunit[$i]["timepast"]=$this->secToTime($timepast);
            $workunit[$i]["timeremaining"] = $this->secToTime($timeremaining);
            $workunit[$i]["expiry"] = date("D j M Y G:i:s T",(int)$ob->report_deadline);
            $workunit[$i]["status"]=$status;
            $workunit[$i]["statusid"]=$statusid;
            $workunit[$i]["progress"]= round($prozent,2)."%";
            $i++;
        }
        return $workunit;
    }

    private function secToTime($s){
        $h = floor($s / 3600);
        $s -= $h * 3600;
        $m = floor($s / 60);
        $s -= $m * 60;

        return sprintf("%02d:%02d:%02d", $h, $m, $s);
    }

    public function projectlist_orig(){
        $projects = array();
        $i=0;

        $state = $this->state();

        //einzelne arrays für name und urls um nach url suchen zu können und
        //dann mit dem selben key den namen dazu raussuchen zu können
        foreach ($state->client_state->project as $row)
        {
            $projects[$i]["project"] = (string)$row->project_name;
            $projects[$i]["account"] = (string)$row->user_name;
            $projects[$i]["team"] = (string)$row->team_name;
            $projects[$i]["workdone"] = (int)$row->user_total_credit;
            $projects[$i]["averageworkdone"] = (int)$row->user_expavg_credit;
            $projects[$i]["resourcesharing"] = (int)$row->resource_share;
            
            if($row->suspended_via_gui){
                $status = "Angehalten durch Benutzer";
            }
            if($row->dont_request_more_work){
                $status = "Erhält keine neue Aufgaben";
            }
            
            $projects[$i]["status"] = (string)$status;
            
            $i++;
        }
        return $projects;
    }
    
    public function projectlist(){
        $projects = array();
        $i=0;

        $state = $this->attachedProjects();

        //einzelne arrays für name und urls um nach url suchen zu können und
        //dann mit dem selben key den namen dazu raussuchen zu können
        foreach ($state->projects->project as $row)
        {
            $status = NULL;
            $projects[$i]["statusid"] = (INT)1;
            $projects[$i]["workstatusid"] = (INT)1;


            $projects[$i]["projecturl"] = (string)$row->master_url;
            $projects[$i]["project"] = (string)$row->project_name;
            $projects[$i]["account"] = (string)$row->user_name;
            $projects[$i]["team"] = (string)$row->team_name;
            $projects[$i]["workdone"] = (int)$row->user_total_credit;
            $projects[$i]["averageworkdone"] = (int)$row->user_expavg_credit;
            $projects[$i]["resourcesharing"] = (int)$row->resource_share;
            
            if($row->suspended_via_gui){
                $status = "Angehalten durch Benutzer";
                $projects[$i]["statusid"] = (int)0;
            }
            if($row->dont_request_more_work){
                if($status) {$status = $status.", Erhält keine neue Aufgaben";}
                else{
                    $status = "Erhält keine neue Aufgaben";
                }
                $projects[$i]["workstatusid"] = (INT)0;
            }
            
            $projects[$i]["status"] = (string)$status;
            
            $i++;
        }
        return $projects;
    }
    
    public function transferlist(){
        $transfer = array();
        $i=0;
        $tl = $this->getSession()->get_file_transfers();
        foreach ($tl->file_transfers->file_transfer as $row){
            $transfer[$i]["url"] = (string)$row->project_url;
            $transfer[$i]["projectname"] = (string)$row->project_name;
            $transfer[$i]["file"] = (string)$row->name;
            if ($row->project_backoff){
                $transfer[$i]["status"] = "Pausiert";
            }else{
                $transfer[$i]["status"] = "Am Hochladen";
            }
            $i++;
        }
        return $transfer;
    }
    
    public function messagelist(){
        $messages = array();
        $i=0;
        $mes = $this->messages();  
        foreach ($mes->msg as $row){
            $messages[$i]["project"] = (string)$row->project;
            $messages[$i]["pri"] = (int)$row->pri; 
            $messages[$i]["seqno"] = (int)$row->seqno;
            $messages[$i]["body"] = (string)$row->body;
            $messages[$i]["time"] = date(DATE_RFC822,(int)$row->time);
            
            #$heute = date("D d M Y H:i:s");  
            $i++;
        }
        return array_reverse ($messages );
    }
    
    public function getPrefs(){
        $ar = $this->prefs();
         $res = array();
            
            $res[run_on_batteries] = (string)$ar->global_preferences->run_on_batteries;
            $res[run_if_user_active] = (string)$ar->global_preferences->run_if_user_active;
            $res[run_gpu_if_user_active] = (string)$ar->global_preferences->run_gpu_if_user_active;
            $res[suspend_if_no_recent_input] = (string)$ar->global_preferences->suspend_if_no_recent_input;
            $res[suspend_cpu_usage] = (string)$ar->global_preferences->suspend_cpu_usage;
            $res[start_hour] = (string)$ar->global_preferences->start_hour;
            $res[end_hour] = (string)$ar->global_preferences->end_hour;
            $res[net_start_hour] = (string)$ar->global_preferences->net_start_hour;
            $res[net_end_hour]  = (string)$ar->global_preferences->net_end_hour;
            $res[leave_apps_in_memory] = (string)$ar->global_preferences->leave_apps_in_memory;
            $res[confirm_before_connecting] = (string)$ar->global_preferences->confirm_before_connecting;
            $res[hangup_if_dialed] = (string)$ar->global_preferences->hangup_if_dialed;
            $res[dont_verify_images] = (string)$ar->global_preferences->dont_verify_images;
            $res[work_buf_min_days]  = (string)$ar->global_preferences->work_buf_min_days;
            $res[work_buf_additional_days] = (string)$ar->global_preferences->work_buf_additional_days;
            $res[max_ncpus_pct] = (string)$ar->global_preferences->max_ncpus_pct;
            $res[cpu_scheduling_period_minutes] = (string)$ar->global_preferences->cpu_scheduling_period_minutes;
            $res[disk_interval] = (string)$ar->global_preferences->disk_interval;
            $res[disk_max_used_gb] = (string)$ar->global_preferences->disk_max_used_gb;
            $res[disk_max_used_pct]  = (string)$ar->global_preferences->disk_max_used_pct;
            $res[disk_min_free_gb] = (string)$ar->global_preferences->disk_min_free_gb;
            $res[vm_max_used_pct] = (string)$ar->global_preferences->vm_max_used_pct;
            $res[ram_max_used_busy_pct] = (string)$ar->global_preferences->ram_max_used_busy_pct;
            $res[ram_max_used_idle_pct] = (string)$ar->global_preferences->ram_max_used_idle_pct;
            $res[idle_time_to_run] = (string)$ar->global_preferences->idle_time_to_run;
            $res[max_bytes_sec_up] = (string)$ar->global_preferences->max_bytes_sec_up;
            $res[max_bytes_sec_down]  = (string)$ar->global_preferences->max_bytes_sec_down;
            $res[cpu_usage_limit]  = (string)$ar->global_preferences->cpu_usage_limit;
            $res[daily_xfer_limit_mb] = (string)$ar->global_preferences->daily_xfer_limit_mb;
            $res[daily_xfer_period_days] = (string)$ar->global_preferences->daily_xfer_period_days;

        return $res;
    }
    
    public function setPrefs($pref){
        return $this->setPrefsRes($pref);
        
    }

    public function getAttachedProjects(){
        $projects = array();
        $i=0;
        $state = $this->attachedProjects();
        foreach ($state->projects->project as $row)
        {
            $projects[$i]["name"] = (string)$row->project_name;
            $projects[$i]["url"] = (string)$row->master_url;
        }
        return $projects;
    }

    public function attachProject( $url , $key ) {
        return $this->getSession()->project_attach ( $url , $key );
    }

    public function detachProject( $url ) {
        return $this->getSession()->project_detach ( $url );
    }

    public function resetProject( $url ) {
        return $this->getSession()->project_reset ( $url );
    }

    public function updateProject( $url ) {
        return $this->getSession()->project_update ( $url );
    }

    public function suspendProject( $url ) {
        return $this->getSession()->project_suspend ( $url );
    }

    public function resumeProject( $url ) {
        return $this->getSession()->project_resume ( $url );
    }

    public function freezeProject( $url ) {
        return $this->getSession()->project_freeze ( $url );
    }

    public function thawProject( $url ) {
        return $this->getSession()->project_thaw ( $url );
    }

    public function retryTransfer( $file , $url) {
        return $this->getSession()->retry_transfer ( $file , $url );
    }

    public function suspendResult( $file , $url) {
        return $this->getSession()->result_suspend ( $file , $url );
    }

    public function resumeResult( $file , $url) {
        return $this->getSession()->result_resume ( $file , $url );
    }

    public function abortResult( $file , $url) {
        return $this->getSession()->result_abort ( $file , $url );
    }

}