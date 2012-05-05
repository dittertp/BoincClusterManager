Ext.define('App.NodeManPanel', {
	
	extend: 'Ext.grid.Panel',
    alias: 'widget.nodemanpanel',
    closable:true,
    initComponent: function(){
        Ext.apply(this, {
        	region:'center',
        	title: 'Nodeverwaltung',
                iconCls:'manage',
        	flex:1,        	
            store: Ext.data.StoreManager.lookup(this.createStore()),
            columns: [
                        { header: 'Name', dataIndex: 'name', width:120},
                        { header: 'IP-Adresse', dataIndex: 'ipaddress', width:120},
                        { header: 'Port', dataIndex: 'port', width:120},
                        { header: 'Passphrase', dataIndex: 'passphrase', width:120},
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
                model: 'NodeList',
                autoSync:false,
                autoLoad:false,
                paramOrder: ['node'],
                api: {
                    read    : Nodes.getall
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
        setTimeout("app.msgBus.fireEvent('reloadnodetree')",200);
    },

    createToolbar: function(){
    	this.createActions();
        this.toolbar = Ext.create('widget.nodemangridtb', {
        	items: [this.addAction,'-', this.editAction , '-', this.removeAction]
        });
        return this.toolbar;
    },
    createActions: function(){
        this.addAction = Ext.create('Ext.Action', {
            scope: this,
            iconCls: 'add',
            handler: this.onAddNodeClick,
            text: 'Neu'
        });

        this.editAction = Ext.create('Ext.Action', {
            itemId: 'edit',
            scope: this,
            iconCls: 'edit',
            disabled:true,
            handler: this.onEditNodeClick,
            text: 'Bearbeiten'
        });
        
        this.removeAction = Ext.create('Ext.Action', {
            itemId: 'remove',
            scope: this,
            iconCls: 'delete',
            disabled:true,
            handler: this.onConfirmRemoveNodeClick,
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
    onConfirmRemoveNodeClick: function(){
        var active = this.getSelectedItem();
         Ext.MessageBox.confirm('Bestätigen', 'Node sicher löschen?', 
        	function(btn){
        	if (btn == 'yes'){
                    Nodes.delete(active.get('id'));
                this.reload();
        		}        		
        	}
        ,this);	
    },
    onAddNodeClick: function(){
    	this.win = Ext.create('widget.nodewindow',{});
    	this.win.show();
    },
    onEditNodeClick: function(){
        this.editwin = Ext.create('widget.nodewindowedit',{id:this.getSelectedItem().get('id'),name:this.getSelectedItem().get('name')});
        this.editwin.show();
        this.editwin.onload();
    },
    loadEvents: function(){
        app.msgBus.on('reloadnodestore', function(){ 
        	this.reload();
        },this);
    }
});

