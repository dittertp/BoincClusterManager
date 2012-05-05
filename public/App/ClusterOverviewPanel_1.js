Ext.define('App.ClusterOverviewPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.clusteroverviewpanel',
    closable:true,
    initComponent: function(){
        Ext.apply(this, {
        	region:'center',
        	title: 'Clusterübersicht',
                
        	flex:1,        	
            store: Ext.data.StoreManager.lookup(this.createStore()),
            columns: [
                        { header: 'Node', dataIndex: 'name', width:120},
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
        //this.load();
        this.loadEvents();
        this.callParent(arguments);
    },

    createStore: function(){
            this.store = Ext.create('Ext.data.DirectStore', {
                model: 'tmp',
                autoSync:false,
                autoLoad:false,
                paramOrder: ['node'],
                api: {
                    read    : Cluster.overview
                }

            });
        return this.store;
    },

    load: function(){
    	this.store.load();
    },

    reload: function(){
    	this.load();
        //app.msgBus.fireEvent('seppl');
        setTimeout("app.msgBus.fireEvent('reloadclusternodetree')",200);
    },

    createToolbar: function(){
    	this.createActions();
        this.toolbar = Ext.create('widget.clusteroverviewgridtb', {
        	items: [this.addAction,'-', this.removeAction]
        });
        return this.toolbar;
    },
    createActions: function(){
        this.addAction = Ext.create('Ext.Action', {
            scope: this,
            handler: this.onAddNodeClick,
            text: 'Neu'
        });
       
        this.removeAction = Ext.create('Ext.Action', {
            itemId: 'remove',
            scope: this,
            disabled:true,
            handler: this.onConfirmRemoveNodeClick,
            text: 'Löschen'
        })
    },
    onSelectionChange: function(){
        var selected = this.getSelectedItem();
        this.toolbar.getComponent('remove').setDisabled(!selected);
        this.toolbar.getComponent('edit').setDisabled(!selected);
    },
    getSelectedItem: function(){
        return this.view.getSelectionModel().getSelection()[0] || false;
    },
    onConfirmRemoveNodeClick: function(){
        var active = this.getSelectedItem();
         Ext.MessageBox.confirm('Bestätigen', 'Node sicher löschen?', 
        	function(btn){
        	if (btn == 'yes'){
                    Cluster.deletenode(active.get('id'));
                this.reload();
        		}        		
        	}
        ,this);	
    },
    onAddNodeClick: function(){
    	this.win = Ext.create('widget.clusternodewindow',{});
    	this.win.show();
    },
    loadEvents: function(){
        app.msgBus.on('reloadnodestore', function(){ 
        	this.reload();
        },this);
    }
});

