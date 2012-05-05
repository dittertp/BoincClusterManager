Ext.define('xpm.NodeWorkGrid', {
	
	extend: 'Ext.grid.Panel',
    alias: 'widget.nodeworkgrid',
    
    initComponent: function(){
        Ext.apply(this, {
        	region:'center',
        	title: 'Aufgaben',
        	flex:1,        	
            store: Ext.data.StoreManager.lookup(this.createStore()),
            columns: [
                      
                      { header: 'Projekt', dataIndex: 'project', width:120},
                      { header: 'Anwendung', dataIndex: 'app', width:120},
                      { header: 'Name', dataIndex: 'name',flex:1 },
                      { header: 'Vergangen',  dataIndex: 'timepast',width:100 },
                      { header: 'Fortschritt',
                        dataIndex: 'progress',
                        width:90

                      },
                      { header: 'Verbleibende Zeit', dataIndex: 'timeremaining',width:60 },
                      { header: 'Ablaufdatum', dataIndex: 'expiry',width:100 },
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
        this.load();
        this.callParent(arguments);
    },

    createStore: function(){
            this.store = Ext.create('Ext.data.DirectStore', {
                model: 'NodeWorkGrid',
                autoSync:false,
                autoLoad:false,
                paramOrder: ['node'],
                api: {
                    read    : Nodes.getworklist
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
        this.cmdsuspendresultAction.setDisabled(!selected);
        this.cmdabortresultAction.setDisabled(!selected);

        if(selected){
            this.cmdsuspendresultAction.setText( this.changestatustext("status", selected.get('statusid')));
        }
    },
    createToolbar: function(){
        this.createTransferActions();
        this.createCommandActions();
        this.toolbar = Ext.create('widget.nodeworkgridtb',
            {items:[{xtype: 'buttongroup',title: 'Allgemein',items:[
                this.refreshAction
            ]
            },{
                xtype: 'buttongroup',title: 'Befehle',items:[
                    this.cmdsuspendresultAction,
                    this.cmdabortresultAction
                ]
            }]
            }
        );
        return this.toolbar;
    },
    changestatustext: function(type, value){
        if(type == "status"){
            if(value == 2){
                return "Fortsetzen";
            }else{
                return "Anhalten";
            }
        }
    },
    createTransferActions: function(){
        this.refreshAction = Ext.create('Ext.Action',{
            scope:this,
            iconCls: 'refresh',
            handler: this.onRefreshWorkClick,
            text:'Aktualisieren'
        });
    },
    createCommandActions: function(){
        this.cmdsuspendresultAction = Ext.create('Ext.Action', {
            scope: this,
            iconCls: 'refresh',
            disabled:true,
            handler: this.onCmdSuspendResultClick,
            text: 'Anhalten'
        });
        this.cmdabortresultAction = Ext.create('Ext.Action', {
            scope: this,
            iconCls: 'cancel',
            disabled:true,
            handler: this.onCmdAbortResultClick,
            text: 'Anhalten'
        });
    },
    onRefreshWorkClick: function(){
        this.reload();
    },
    onCmdSuspendResultClick: function(){
        var selected = this.getSelectedItem();
        var sepp = new Array( this.nodeid , selected.get('url') , selected.get('name') );
        if( selected.get('statusid') == 2){
            Nodes.resumeresult( sepp );
            selected.set('statusid','1');
        } else {
            Nodes.suspendresult( sepp );
            selected.set('statusid','2');
        }
        this.cmdsuspendresultAction.setText( this.changestatustext("status", selected.get('statusid')));

    },
    onCmdAbortResultClick: function(){
        var selected = this.getSelectedItem();
        var sepp = new Array( this.nodeid , selected.get('url') , selected.get('name') );
        Nodes.abortresult( sepp );
    }
});

