Ext.define('App.ClusterManPanel', {
	
	extend: 'Ext.grid.Panel',
    alias: 'widget.clustermanpanel',
    closable:true,
    initComponent: function(){
        Ext.apply(this, {
        	region:'center',
        	title: 'Clusterverwaltung',
                iconCls:'manage',
        	flex:1,        	
            store: Ext.data.StoreManager.lookup(this.createStore()),
            columns: [
                        { header: 'Name', dataIndex: 'name', width:120},
                        { header: 'Beschreibung', dataIndex: 'description', flex:1}
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
        this.loadEvents();
        this.callParent(arguments);
    },

    createStore: function(){
            this.store = Ext.create('Ext.data.DirectStore', {
                model: 'Clusterlist',
                autoSync:false,
                autoLoad:false,
                paramOrder: ['node'],
                api: {
                    read    : Cluster.getall
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
        setTimeout("app.msgBus.fireEvent('reloadclustertree')",200);
    },

    createToolbar: function(){
    	this.createActions();
        this.toolbar = Ext.create('widget.clustermangridtb', {
        	items: [this.addAction,'-', this.editAction , '-', this.removeAction]
        });
        return this.toolbar;
    },
    createActions: function(){
        this.addAction = Ext.create('Ext.Action', {
            scope: this,
            handler: this.onAddClusterClick,
            text: 'Neu'
        });

        this.editAction = Ext.create('Ext.Action', {
            itemId: 'edit',
            scope: this,
            disabled:true,
            handler: this.onEditClusterClick,
            text: 'Bearbeiten'
        });
        
        this.removeAction = Ext.create('Ext.Action', {
            itemId: 'remove',
            scope: this,
            disabled:true,
            handler: this.onConfirmRemoveClusterClick,
            //handler: this.rl,
            text: 'Löschen'
        })
    },
    onSelectionChange: function(){
        var selected = this.getSelectedItem();
        //alert(this.getSelectedItem().get('id'));
        this.toolbar.getComponent('remove').setDisabled(!selected);
        this.toolbar.getComponent('edit').setDisabled(!selected);
    },
    getSelectedItem: function(){
        return this.view.getSelectionModel().getSelection()[0] || false;
    },
    onConfirmRemoveClusterClick: function(){
        var active = this.getSelectedItem();
         Ext.MessageBox.confirm('Bestätigen', 'Cluster \''+active.get('name')+'\' sicher löschen?', 
        	function(btn){
        	if (btn == 'yes'){
                    Cluster.delete(active.get('id'));
                this.reload();
        		}        		
        	}
        ,this);	
    },
    onAddClusterClick: function(){
    	this.win = Ext.create('widget.clusterwindow',{});
    	this.win.show();
    },
    onEditClusterClick: function(){
        this.editwin = Ext.create('widget.clusterwindowedit',{id:this.getSelectedItem().get('id'),name:this.getSelectedItem().get('name')});
        this.editwin.show();
        this.editwin.onload();
    },
    loadEvents: function(){
        app.msgBus.on('reloadclusterstore', function(){ 
        	this.reload();
        },this);
    }
});

