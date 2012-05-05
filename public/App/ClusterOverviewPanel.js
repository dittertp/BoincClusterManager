Ext.define('App.ClusterOverviewPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.clusteroverviewpanel',
    initComponent: function(){
        Ext.apply(this, {
            region:'center',
            title: 'Summary',
            store: Ext.data.StoreManager.lookup(this.createStore()),
            columns: [
                        { header: 'Status', dataIndex: 'state', width:80},
                        { header: 'Node', dataIndex: 'nodename', width:100},
                        { header: 'Hostname', dataIndex: 'domainname', width:100},
                        { header: 'OS', dataIndex: 'osname', width:70},
                        { header: 'Client-Version', dataIndex: 'clientversion', width:80},
                        { header: 'CPU-Kerne', dataIndex: 'cpus', width:70},
                        { header: 'Projekte', dataIndex: 'projectscount', width:70},
                        { header: 'verdrängte WUs', dataIndex: 'suspwu', width:85},
                        { header: 'aktive WUs', dataIndex: 'activewu', width:70},
                        { header: 'fertige WUs', dataIndex: 'completewu', width:70},
                        { header: 'gesamt WUs', dataIndex: 'allwu', width:80},
                        { header: 'Kommentar', dataIndex: 'comment', flex:1}
            ],
            dockedItems: [this.createToolbar()],
            selModel: {
                mode: 'SINGLE',
                listeners: {
                    scope: this,
                    selectionchange: this.onSelectionChange
                }
            }
        });
        this.load();
        this.loadEvents();
        setTimeout("app.msgBus.fireEvent('initrequest')",300);
        this.callParent(arguments);
    },

    createStore: function(){

            this.store = Ext.create('Ext.data.DirectStore', {
                model: 'Clusteroverview',
                autoSync:false,
                autoLoad:false,
                paramOrder: ['clusterid'],
                api: {
                    read    : Cluster.overview
                }
            });
        return this.store;
    },
    
    load: function(){
    	this.store.load({params:{clusterid:this.cid}});
        
    },

    reload: function(){
    	this.load();
        setTimeout("app.msgBus.fireEvent('reloadclustertree')",200);
    },
    createToolbar: function(){
        this.createNodeActions();
        this.createClusterActions();
        this.toolbar = Ext.create('widget.clusteroverviewgridgtb',
            {items:[{xtype: 'buttongroup',title: 'Nodes',items:[
                    this.addAction,
                    this.removeAction,
                    this.refreshAction
                    ]
            },{
            xtype: 'buttongroup',title: 'Cluster',items:[
                    this.crefreshAction
                    ]
                }]
            }
        );
        return this.toolbar;
    },
    createNodeActions: function(){
        this.addAction = Ext.create('Ext.Action', {
            scope: this,
            iconCls: 'add',
            handler: this.onAddNodeClick,
            text: 'Neu'
        });
       
        this.removeAction = Ext.create('Ext.Action', {
            itemId: 'nremove',
            scope: this,
            disabled:true,
            iconCls: 'delete',
            handler: this.onConfirmRemoveNodeClick,
            text: 'Löschen'
        });
        this.refreshAction = Ext.create('Ext.Action', {
            itemId: 'nrefresh',
            scope: this,
            iconCls: 'refresh',
            disabled:true,
            handler: this.onRefreshNodeClick,
            text: 'Aktualisieren'
        });
    },
    createClusterActions: function(){
        this.crefreshAction = Ext.create('Ext.Action', {
            itemId: 'crefresh',
            scope: this,
            iconCls: 'refresh',
            handler: this.onRefreshClusterClick,
            text: 'Aktualisieren'
        });
    },

    readclient:function(rec){
        //console.log(rec);
        rec.set('state','Syncing...');
        Ext.bind(Nodes.getnodesummary(rec.get('nid'),
            function(response, e) {
                rec.set('cpus',response.data.cpus);
                rec.set('domainname',response.data.domainname);
                rec.set('clientversion',response.data.clientversion);
                rec.set('osname',response.data.osname);
                rec.set('activewu',response.data.activewu);
                rec.set('allwu',response.data.allwu);
                rec.set('suspwu',response.data.suspwu);
                rec.set('completewu',response.data.completewu);
                rec.set('projectscount',response.data.projectscount);
                rec.set('state',response.data.status);
                //rec.set('state','OK');
            }),this);
        },
        
    cb: function(response, e) {
        
        console.log(rec.get('state'));
        //console.log(rec);
        
        return e;
    },
    getSelectedItem: function(){
        return this.view.getSelectionModel().getSelection()[0] || false;
    },
    onSelectionChange: function(){
        var selected = this.getSelectedItem();
        this.removeAction.setDisabled(!selected);
        this.refreshAction.setDisabled(!selected);
        
        //this.store.each(function(rec){this.readclient(rec)},this);
        //console.log('open node panel');
        //console.log(Ext.ComponentQuery.query('button[itemi]'));
        //this.toolbar.query('action[id=nremove]').setDisabled(!selected);
        //this.toolbar.getComponent('nremove').setDisabled(!selected);
        //this.toolbar.getComponent('nrefresh').setDisabled(!selected);
        
        //this.toolbar.getComponent('edit').setDisabled(!selected);
    },
    onConfirmRemoveNodeClick: function(){
        var active = this.getSelectedItem();
         Ext.MessageBox.confirm('Bestätigen', 'Node sicher löschen?', 
        	function(btn){
                    if (btn == 'yes')
                    {
                        Nodes.deletenodefromcluster( new Array( this.cid , active.get('nid')));
                        this.reload();
                    }        		
        	}
        ,this);	
    },
    onAddNodeClick: function(){
       //console.log(this.cid);
    	this.win = Ext.create('widget.clusternodewindow',{cid:this.cid});
    	this.win.show();
    },
    onRefreshNodeClick: function(){
        var active = this.getSelectedItem();
        this.readclient(active);
    },
    onRefreshClusterClick: function(){
        this.initRequest();
    },
    initRequest: function(){
        this.store.each(function(rec){this.readclient(rec)},this);
    },
    loadEvents: function(){
        this.mon(app.msgBus,'reloadclusteroverviewstore', function(){
        	this.reload();
        },this);
        this.mon(app.msgBus,'initrequest', function(){
                this.initRequest();
        },this);
    }
});

