Ext.define('xpm.NodeTransferGrid', {
	
	extend: 'Ext.grid.Panel',
    alias: 'widget.nodetransfergrid',
    
    initComponent: function(){
        Ext.apply(this, {
        	region:'center',
        	title: 'Übertragung',
        	flex:1,        	
            store: Ext.data.StoreManager.lookup(this.createStore()),
            columns: [
                      { header: 'Projekt', dataIndex: 'projectname', width:180},
                      { header: 'Datei', dataIndex: 'file', flex:1},
                      //{ header: 'Fortschritt', dataIndex: 'progress',width:100},
                      //{ header: 'Größe', dataIndex: 'size',width:100 },
                      //{ header: 'vergangene Zeit', dataIndex: 'timepassed',width:100 },
                      //{ header: 'Geschwindigkeit', dataIndex: 'speed',width:100 },
                      { header: 'Status', dataIndex: 'status',width:200 }
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
                model: 'NodeTransferGrid',
                autoSync:false,
                autoLoad:false,
                paramOrder: ['node'],
                api: {
                    read    : Nodes.gettransferlist
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
    },
    createToolbar: function(){
        this.createTransferActions();
        this.createCommandActions();
        this.toolbar = Ext.create('widget.nodetransfergridtb',
            {items:[{xtype: 'buttongroup',title: 'Allgemein',items:[
                this.refreshAction
            ]
            },{
                xtype: 'buttongroup',title: 'Befehle',items:[
                    this.cmdrefreshAction,
                ]
            }]
            }
        );
        return this.toolbar;
    },
    createTransferActions: function(){
        this.refreshAction = Ext.create('Ext.Action',{
            scope:this,
            iconCls: 'refresh',
            handler: this.onRefreshTransferClick,
            text:'Aktualisieren'
        });
    },
    createCommandActions: function(){
        this.cmdrefreshAction = Ext.create('Ext.Action', {
            scope: this,
            iconCls: 'refresh',
            disabled:true,
            handler: this.onCmdRefreshClick,
            text: 'Jetzt nocheinmal versuchen'
        });
    },
    onRefreshTransferClick: function(){
        this.reload();
    },
    onCmdRefreshClick: function(){
        var selected = this.getSelectedItem();
        var sepp = new Array( this.nodeid , selected.get('url') , selected.get('file') );
        Nodes.retrytransfer( sepp );
    }
});

