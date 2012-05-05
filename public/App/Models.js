Ext.define('Clustertree', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id',type: 'int'},
        {name:'nodeid',type: 'string'},
        {name:'clusterid',type: 'string'},
        {name:'text',type: 'string'},
        {name:'type',type:'string'},
        {name:'leaf',type: 'boolean',defaultValue:false}
    ]
});

Ext.define('Clusterlist', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id',type: 'int'},
        {name:'name',type: 'string'},
        {name:'description',type: 'string'}
    ]
});

Ext.define('Clusteroverview', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id',type: 'int'},
        {name:'nid',type:'int'},
        {name:'state',type: 'string'},
        {name:'nodename',type: 'string'},
        {name:'cpus',type: 'string'},
        {name:'domainname',type: 'string'},
        {name:'osname',type: 'string'},
        {name:'projectscount',type: 'string'},
        {name:'clientversion',type: 'string'},
        {name:'activewu',type: 'string'},
        {name:'suspwu',type: 'string'},
        {name:'completewu',type: 'string'},
        {name:'allwu',type: 'string'},
        {name:'comment',type: 'string'}
    ]
});

Ext.define('tmp', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id',type: 'int'},
        {name:'name',type: 'string'}
    ]
});


Ext.define('Nodetree', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id',type: 'int'},
        {name:'text',type: 'string'},
        {name:'type',type:'string'}
    ]
});


Ext.define('Nodecombobox', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'nid',type: 'int'},
        {name:'nodename',type: 'string'}
    ]
});

Ext.define('NodeWorkGrid', {
    extend: 'Ext.data.Model',
    fields:[
        {name:'project' , type:'string'},
        {name:'app' , type:'string'},
        {name:'name' , type:'string'},
        {name:'timeremaining' , type:'string'},
        {name:'expiry' , type:'string'},
        {name:'status' , type:'string'},
        {name:'statusid' , type:'string'},
        {name:'url' , type:'string'},
        {name:'timepast' , type:'string'},
        {name:'progress' , type:'string'}
    ]
});

Ext.define('ProjectList', {
    extend: 'Ext.data.Model',
    fields:[
	    {name:'id', type:'id'},
        {name:'name' , type:'string'},
        {name:'projectname' , type:'string'},
        {name:'url' , type:'string'},
        {name:'authkey' , type:'string'},
        {name:'username' , type:'string'},
        {name:'password' , type:'string'},
        {name:'description' , type:'string'}
    ]
});

Ext.define('Projectcombobox', {
    extend: 'Ext.data.Model',
    fields: [        
        {name:'name',type: 'string'},
        {name:'url',type: 'string'},
        {name:'projectid',type: 'string'}
    ]
});
        
Ext.define('NodeList', {
    extend: 'Ext.data.Model',
    fields:[
        {name:'id' , type:'int'},
        {name:'name' , type:'string'},
        {name:'ipaddress' , type:'string'},
        {name:'port' , type:'string'},
        {name:'passphrase' , type:'string'},
        {name:'description' , type:'string'}
    ]
});
    	
Ext.define('NodeProjectGrid', {
    extend: 'Ext.data.Model',
    fields:[
        { name: 'project', type:'string'},
        { name: 'account', type:'string'},
        { name: 'team',type:'string' },
        { name: 'workdone',type:'int' },
        { name: 'averageworkdone',type:'int' },
        { name: 'resourcesharing',type:'int' },
        { name: 'status',type:'string' },
        { name: 'statusid',type:'int' },
        { name: 'workstatusid',type:'int' },
        { name: 'projecturl',type:'string' }
    ]
});
    	
Ext.define('NodeMessageGrid', {
    extend: 'Ext.data.Model',
    fields:[
        { name: 'project', type:'string'},
        { name: 'time',type:'string'},
        { name: 'pri',type:'int'},
        { name: 'seqno',type:'int'},
        { name: 'body', type:'string'}
    ]
});
    	
Ext.define('NodeTransferGrid', {
    extend: 'Ext.data.Model',
    fields:[
        { name: 'url', type:'string'},
        { name: 'projectname', type:'string'},
        { name: 'file',type:'string'},
        { name: 'progress',type:'string'},
        { name: 'size',type:'string'},
        { name: 'timepassed',type:'string' },
        { name: 'speed',type:'string' },
        { name: 'status',type:'string' }
    ]
});

Ext.define('Admin', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'text' },
        {name: 'leaf' },
        {name: 'id' }
    ]
});
        
Ext.define('Reportgrid', {
    extend: 'Ext.data.Model',
    fields:[
        {name:'id' , type:'int' },
        {name:'foreman',type:'string'},
        {name:'type',type:'string',defaultValue:'Bautagesbericht'  },
        {name:'date', type: 'string'},
        {name:'creator', type: 'string'},
        {name:'created', type: 'string'}
    ]
});     
