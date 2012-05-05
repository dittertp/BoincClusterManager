Ext.define('xpm.NodeProjectGrid', {
	
	extend: 'Ext.grid.Panel',
    alias: 'widget.nodeprojectgrid',
    
    initComponent: function(){
        Ext.apply(this, {
        	region:'center',
        	title: 'Projekte',
        	flex:1,        	
            store: Ext.data.StoreManager.lookup(this.createStore()),
            columns: [
                      
                      { header: 'Projekt', dataIndex: 'project', flex:1},
                      { header: 'Konto', dataIndex: 'account', width:100},
                      { header: 'Team', dataIndex: 'team',width:160 },
                      { header: 'Arbeit erledigt',  dataIndex: 'workdone',width:100 },
                      { header: 'Durchschnittl. erledigt', dataIndex: 'averageworkdone',width:130 },
                      { header: 'Resourcenaufteilung',
                        dataIndex: 'resourcesharing',
                        width:120,
                        renderer: function (v, m, r) {
                            var id = Ext.id();
                            Ext.defer(function () {
                                Ext.widget('progressbar', {
                                    renderTo: id,
                                    value: v / 100,
                                    width: 80,
                                    text: v+' %'
                                });
                            }, 50);
                        return Ext.String.format('<div id="{0}"></div>', id);
                        }
                      },
                      { header: 'Status', dataIndex: 'status',width:150 },
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
        //this.store.load({params:{table:'hund'}});
        this.load();
        this.callParent(arguments);
    },

    createStore: function(){
            this.store = Ext.create('Ext.data.DirectStore', {
                model: 'NodeProjectGrid',
                autoSync:false,
                autoLoad:false,
                paramOrder: ['node'],
                api: {
                    read    : Nodes.getprojectlist
                }

            });
        return this.store;
    },

    load: function(){
    	this.store.load({params:{node:this.nodeid}});
    },

    reload: function(){
    	this.load();
    },
    getSelectedItem: function(){
        return this.view.getSelectionModel().getSelection()[0] || false;
    },
    onSelectionChange: function(){
        var selected = this.getSelectedItem();
        this.cmdrefreshAction.setDisabled(!selected);
        this.cmdStatusAction.setDisabled(!selected);
        this.cmdWorkStatusAction.setDisabled(!selected);
        this.cmdResetAction.setDisabled(!selected);
        this.cmdUnsubscribeAction.setDisabled(!selected);
        if(selected){
            this.cmdStatusAction.setText( this.changestatustext("status", selected.get('statusid')));
            this.cmdWorkStatusAction.setText( this.changestatustext("workstatus", selected.get('workstatusid')));
        }
    },
    changestatustext: function(type, value){
        if(type == "status"){
            if(value == 1){
                return "Anhalten";
            }else{
                return "Fortsetzen";
            }
        }
        if(type == "workstatus"){
            if(value == 1){
                return "keine neue Aufgaben";
            }else{
                return "neue Aufgaben";
            }
        }
    },
    createToolbar: function(){
        this.createProjectActions();
        this.createCommandActions();
        this.toolbar = Ext.create('widget.nodeprojectgridtb',
                 {items:[{xtype: 'buttongroup',title: 'Allgemein',items:[
                    this.addAction,             
                    this.prefAction,
                    this.refreshAction
                    ]
            },{
            xtype: 'buttongroup',title: 'Befehle',items:[
                    this.cmdrefreshAction,
                    this.cmdStatusAction,
                    this.cmdWorkStatusAction,
                    this.cmdResetAction,
                    this.cmdUnsubscribeAction
                    ]
                }]
            }	
        );
        return this.toolbar;
    },
    createProjectActions: function(){
        this.prefAction = Ext.create('Ext.Action', {
            scope: this,
            iconCls:'settings',
            handler: this.onPrefNodeClick,
            text: 'Einstellungen'
        });
        this.refreshAction = Ext.create('Ext.Action',{
            scope:this,
            iconCls: 'refresh',
            handler: this.onRefreshProjectClick,
            text:'Aktualisieren'
        });
        this.addAction = Ext.create('Ext.Action',{
            scope:this,
            iconCls:'add',
            handler: this.onAddProjectClick,
            text:'Hinzufügen'
        });
    },
    createCommandActions: function(){
        this.cmdrefreshAction = Ext.create('Ext.Action', {
            scope: this,
            iconCls: 'refresh',
            disabled:true,
            handler: this.onCmdRefreshClick,
            text: 'Aktualisieren'
        });
        this.cmdStatusAction = Ext.create('Ext.Action',{
            scope:this,
            disabled:true,
            iconCls:'stop',
            handler: this.onCmdStatusClick,
            text:'Anhalten'
        });
        this.cmdWorkStatusAction = Ext.create('Ext.Action',{
            scope:this,
            disabled:true,
            iconCls:'nmw',
            handler: this.onCmdWorkStatusClick,
            text:'Keine neuen Aufgaben'
        });
        this.cmdResetAction = Ext.create('Ext.Action',{
            scope:this,
            disabled:true,
            iconCls:'reset',
            handler: this.onCmdResetClick,
            text:'Zurücksetzen'
        });
        this.cmdUnsubscribeAction = Ext.create('Ext.Action',{
            scope:this,
            disabled:true,
            iconCls:'delete',
            handler: this.onCmdUnsubscribeClick,
            text:'Abmelden'
        });
    },
    onPrefNodeClick: function(){
    	this.win = Ext.create('widget.prefwindow',{nodeid:this.nodeid});
    	this.win.show();
        this.win.onload();
    },
    onRefreshProjectClick: function(){
        this.reload();
        //var active = this.getSelectedItem();
        //Nodes.refreshProject( new Array( this.nodeid , active.get('pid')));
    },
    onAddProjectClick: function(){
        this.win = Ext.create('widget.nodeprojectwindow',{nodeid:this.nodeid});
        this.win.show();
    },
    onCmdRefreshClick: function(){
        var selected = this.getSelectedItem();
        var sepp = new Array(this.nodeid,selected.get('projecturl'));
        Nodes.updateproject( sepp );
    },
    onCmdStatusClick: function(){
        var selected = this.getSelectedItem();
        var sepp = new Array(this.nodeid,selected.get('projecturl'));
        if( selected.get('statusid') == 1){
            Nodes.suspendproject( sepp );
            selected.set('statusid','2');
        } else {
            Nodes.resumeproject( sepp );
            selected.set('statusid','1');
        }
        this.cmdStatusAction.setText( this.changestatustext("workstatus", selected.get('statusid')));
    },
    onCmdWorkStatusClick: function(){
        var selected = this.getSelectedItem();
        var sepp = new Array(this.nodeid,selected.get('projecturl'));
        if( selected.get('workstatusid') == 1){
            Nodes.freezeproject( sepp );
            selected.set('workstatusid','2');
        } else {
            Nodes.thawproject( sepp );
            selected.set('workstatusid','1');
        }
        this.cmdStatusAction.setText( this.changestatustext("workstatus", selected.get('workstatusid')));
    },
    onCmdResetClick: function(){
        var selected = this.getSelectedItem();
        var sepp = new Array(this.nodeid,selected.get('projecturl'));
        Nodes.resetproject( sepp );
    },
    onCmdUnsubscribeClick: function(){
        var selected = this.getSelectedItem();
        var sepp = new Array(this.nodeid,selected.get('projecturl'));
        Nodes.detachproject( sepp );
    }




});

