<?php

class Boinc_Rpc
{
    private $socket;
    private $sc;
    public $host = "127.0.0.1";
    public $port = 31416 ;
    
    function __construct() {
        $this->socket = @socket_create(AF_INET, SOCK_STREAM, 0);
    }
    
    public function connect ( $usr_host = 0  , $usr_port = 0 ) {
        if( $usr_host != 0 )
        {
            $this->host = $usr_host;
        }
        if( $usr_port != 0 && is_numeric($usr_host) )
        {
            $this->port = $usr_port;
        }
        $sc = socket_connect( $this->socket, $this->host , $this->port );
        if ( $sc == TRUE )
        {
            $this->sc = $sc;
            return TRUE;
        }
        return FALSE;
    }
    
    private function check_connection() {
        if ( $this->sc == TRUE )
        {
            return TRUE;
        }
        return FALSE;
    }
    
    private function send ( $cmd ) {
        $this->check_connection();
        $buf = "<boinc_gui_rpc_request>\n".$cmd."\n</boinc_gui_rpc_request>\n\003";
        return socket_write($this->socket, $buf, strlen($buf));
    }
    
    private function read() {
        $data="";
        while (($buf = @socket_read($this->socket, 4096)) !== false) {
            $data .= $buf;
            if (preg_match("</boinc_gui_rpc_reply>", $data)) break;
        }
        return simplexml_load_string ( $this->c2xml ( $data ) );
    }
    
    private function c2xml($data) {
        $data = str_replace ( "\n" , "" , $data );
        $data = str_replace ( "\003" , "" , $data );
        
        return $data;
    }
    
    private function communicate ( $command ) {
        $this->send ( $command );
        $response = $this->read ();
        
        return $response;
    }
    
    public function get_messages($offset=FALSE) {
        //message offset
        $cmd="";
        if ( $offset != FALSE )
        {
            if (is_numeric($offset))
            {
                $cmd="\n<seqno>".$offset."</seqno>\n";
            }
        }
        $erg = $this->communicate ( "<get_messages>".$cmd."</get_messages>" );
        #$erg2 = $this->build_array($erg ,"msgs->msg",array("project","pri","seqno","body","time"));
        #$erg2 = $this->object_to_array($erg);
        return $erg->msgs;
    }
    
    public function auth ( $pw ) {
        $command = $this->communicate ( "<auth1/>" );
        if ( $command->nonce )
        {
            $auth_result = $this->communicate ("<auth2>\n<nonce_hash>".md5($command->nonce.$pw)."</nonce_hash>\n</auth2>");
            if ( $auth_result->authorized )
            {
                return TRUE;
            }
        }
        return FALSE;
    }
    
    
    public function get_version() {
        $erg = $this->communicate ( "<exchange_versions/>" );
        return $erg;
    }
    
    
    public function get_state() {
        return $this->communicate ( "<get_state/>" );
    }
    
     public function get_file_transfers() {
       return $this->communicate ("<get_file_transfers/>");
    }
    
    public function moep() {
        return $this->communicate ( "<acct_mgr_info/>" );
    }
    
    public function get_attached_projects() {
        return $this->communicate ( "<get_project_status/>" );
    }
    
    public function get_prefs() {
        return $this->communicate ( "<get_global_prefs_working/>" );
    }
    
    public function set_prefs($pref) {
        return $this->communicate ( "<set_global_prefs_override>\n
            <global_preferences>".$pref."</global_preferences>
            </set_global_prefs_override>" );
    }
    
    public function read_prefs(){
        return $this->communicate ("<read_global_prefs_override/>");
    }
    
        public function sgp() {
        return $this->communicate ( "<set_global_prefs_override>\n
<global_preferences>
   <run_on_batteries>0</run_on_batteries>
   <run_if_user_active>1</run_if_user_active>
   <run_gpu_if_user_active>1</run_gpu_if_user_active>
   <suspend_cpu_usage>25.000000</suspend_cpu_usage>
   <start_hour>0.000000</start_hour>
   <end_hour>0.000000</end_hour>
   <net_start_hour>0.000000</net_start_hour>
   <net_end_hour>0.000000</net_end_hour>
   <leave_apps_in_memory>0</leave_apps_in_memory>
   <confirm_before_connecting>0</confirm_before_connecting>
   <hangup_if_dialed>0</hangup_if_dialed>
   <dont_verify_images>0</dont_verify_images>
   <work_buf_min_days>0.000000</work_buf_min_days>
   <work_buf_additional_days>6.000000</work_buf_additional_days>
   <max_ncpus_pct>100.000000</max_ncpus_pct>
   <cpu_scheduling_period_minutes>60.000000</cpu_scheduling_period_minutes>
   <disk_interval>60.000000</disk_interval>
   <disk_max_used_gb>100.000000</disk_max_used_gb>
   <disk_max_used_pct>50.000000</disk_max_used_pct>
   <disk_min_free_gb>0.000000</disk_min_free_gb>
   <vm_max_used_pct>75.000000</vm_max_used_pct>
   <ram_max_used_busy_pct>50.000000</ram_max_used_busy_pct>
   <ram_max_used_idle_pct>90.000000</ram_max_used_idle_pct>
   <max_bytes_sec_up>0.000000</max_bytes_sec_up>
   <max_bytes_sec_down>0.000000</max_bytes_sec_down>
   <cpu_usage_limit>100.000000</cpu_usage_limit>
   <daily_xfer_limit_mb>0.000000</daily_xfer_limit_mb>
   <daily_xfer_period_days>0</daily_xfer_period_days>
</global_preferences>
</set_global_prefs_override>" );
    }
    
    
    
    
    ##project_attach(char* url, char* account_key, char* project_name)
    public function project_attach ($url , $key ) {
        $cmd = "<project_url>".$url."</project_url>\n";
        $cmd .= "<authenticator>".$key."</authenticator>\n";
        return $this->communicate ( "<project_attach>\n".$cmd."</project_attach>" );
    }
    
    function project_detach($url) {
        if (!$url) return false;
        $cmd =
            "<project_detach>\n".
            "<project_url>".$url."</project_url>\n".
            "</project_detach>\n";
        return $this->communicate ( $cmd );
    }
    
    function project_reset($url) {
        if (!$url) return false;
        $cmd =
            "<project_reset>\n".
            "<project_url>".$url."</project_url>\n".
            "</project_reset>\n";
        return $this->communicate ( $cmd );
    }
    
    public function set_network_mode($mode) {
        switch ($mode) {
            case "0":
                $cmd = "<always>";
                break;
            case "1":
                $cmd = "<auto>";
                break;
            case "2":
                $cmd = "<never>";
                break;
            default:
                return false;
        }
        return $this->communicate ( "<set_network_mode>\n".$cmd."\n</set_network_mode>\n" );
    }

    public function set_run_mode($mode) {
        switch ($mode) {
            case "0":
                $cmd = "<always>";
                break;
            case "1":
                $cmd = "<auto>";
                break;
            case "2":
                $cmd = "<never>";
                break;
            default:
                return false;
        }
        return $this->communicate ( "<set_run_mode>\n".$cmd."\n</set_run_mode>\n" );
    }

    public function project_update( $url ) {
        if (!$url) return false;
        $cmd =
            "<project_update>\n".
                "<project_url>".$url."</project_url>\n".
                "</project_update>\n";
        return $this->communicate ( $cmd );
    }

    public function project_suspend($url) {
        if (!$url) return false;
        $cmd =
            "<project_suspend>\n".
                "<project_url>".$url."</project_url>\n".
                "</project_suspend>\n";
        return $this->communicate ( $cmd );
    }

    public function project_resume($url) {
        if (!$url) return false;
        $cmd =
            "<project_resume>\n".
                "<project_url>".$url."</project_url>\n".
                "</project_resume>\n";
        return $this->communicate ( $cmd );
    }

    public function project_freeze($url) {
        if (!$url) return false;
        $cmd =
            "<project_nomorework>\n".
                "<project_url>".$url."</project_url>\n".
                "</project_nomorework>\n";
        return $this->communicate ( $cmd );
    }

    public function project_thaw($url) {
        if (!$url) return false;
        $cmd =
            "<project_allowmorework>\n".
                "<project_url>".$url."</project_url>\n".
                "</project_allowmorework>\n";
        return $this->communicate ( $cmd );
    }

    public function result_suspend($rslt, $url) {
        if (!$url) return false;
        $cmd =
            "<suspend_result>\n".
                "<project_url>".$url."</project_url>\n".
                "<name>".$rslt."</name>\n".
                "</suspend_result>\n";
        return $this->communicate ( $cmd );
    }

    public function result_resume($rslt, $url) {
        if (!$url) return false;
        $cmd =
            "<resume_result>\n".
                "<project_url>".$url."</project_url>\n".
                "<name>".$rslt."</name>\n".
                "</resume_result>\n";
        return $this->communicate ( $cmd );
    }

    public function result_abort($rslt, $url) {
        if (!$url) return false;
        $cmd =
            "<abort_result>\n".
                "<project_url>".$url."</project_url>\n".
                "<name>".$rslt."</name>\n".
                "</abort_result>\n";
        return $this->communicate ( $cmd );
    }

    public function retry_transfer($file, $url) {
        if (!$url) return false;
        $cmd =
            "<retry_file_transfer>\n".
                "<project_url>".$url."</project_url>\n".
                "<filename>".$file."</filename\n".
                "</retry_file_transfer>\n";
        return $this->communicate ( $cmd );
    }

}