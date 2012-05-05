Ext.define('xpm.NodeMessageGrid', {
	
	extend: 'Ext.grid.Panel',
    alias: 'widget.nodemessagegrid',
    
    initComponent: function(){
        Ext.apply(this, {
        	region:'center',
        	title: 'Nachrichten',
        	flex:1,        	
            store: Ext.data.StoreManager.lookup(this.createStore()),
            columns: [
                      { header: 'Projekt', dataIndex: 'project', width:160},
                      { header: 'Zeit', dataIndex: 'time', width:170},
                      { header: 'Meldung', dataIndex: 'body',flex:1 }
                  ],
            dockedItems: [this.createToolbar()],
            selModel: {
                mode: 'SINGLE'
            }
        });
        this.load();
        this.callParent(arguments);
    },

    createStore: function(){
            this.store = Ext.create('Ext.data.DirectStore', {
                model: 'NodeMessageGrid',
                autoSync:false,
                autoLoad:false,
                autoScroll: true,
                paramOrder: ['node'],
                api: {
                    read    : Nodes.getmessagelist
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
    createToolbar: function(){
        this.createActions();
        this.toolbar = Ext.create('widget.nodeprojectgridtb',
            {items:[
                this.refreshAction
            ]}
        );
        return this.toolbar;
    },
    createActions: function(){
        this.refreshAction = Ext.create('Ext.Action',{
            scope:this,
            iconCls: 'refresh',
            handler: this.onRefreshMessageClick,
            text:'Aktualisieren'
        });
    },
    onRefreshMessageClick: function(){
        this.reload();
    }
});

