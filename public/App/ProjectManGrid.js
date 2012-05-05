Ext.define('App.ProjectManGrid', {
	
	extend: 'Ext.grid.Panel',
    alias: 'widget.projectmangrid',
    closable:true,
    initComponent: function(){
        Ext.apply(this, {
        	region:'center',
        	title: 'Projektverwaltung',
                iconCls:'screwdriver',
        	flex:1,        	
            store: Ext.data.StoreManager.lookup(this.createStore()),
            columns: [
                        { header: 'Name', dataIndex: 'name', width:150},
                        { header: 'Projektname', dataIndex: 'projectname', width:150},
                        { header: 'URL', dataIndex: 'url', width:150},
                        { header: 'AuthKey', dataIndex: 'authkey', width:150},
                        { header: 'Benutzername', dataIndex: 'username', width:150},
                        { header: 'Passwort', dataIndex: 'password', flex:1}
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
        this.callParent(arguments);
    },

    createStore: function(){
            this.store = Ext.create('Ext.data.DirectStore', {
                model: 'ProjectList',
                autoSync:false,
                autoLoad:false,
                api: {
                    read    : Projects.getall
                }

            });
        return this.store;
    },

    load: function(){
    	this.store.load();
    },

    reload: function(){
    	this.load();
    },

    createToolbar: function(){
    	this.createActions();
        this.toolbar = Ext.create('widget.projectmangridtb', {
        	items: [this.addAction,'-', this.editAction , '-', this.removeAction]
        });
        return this.toolbar;
    },
    createActions: function(){
        this.addAction = Ext.create('Ext.Action', {
            scope: this,
            iconCls: 'add',
            handler: this.onAddProjectClick,
            text: 'Neu'
        });

        this.editAction = Ext.create('Ext.Action', {
            itemId: 'edit',
            scope: this,
            iconCls: 'edit',
            disabled:true,
            handler: this.onEditProjectClick,
            text: 'Bearbeiten'
        });
        
        this.removeAction = Ext.create('Ext.Action', {
            itemId: 'remove',
            scope: this,
            iconCls: 'delete',
            disabled:true,
            handler: this.onConfirmRemoveProjectClick,
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
    onConfirmRemoveProjectClick: function(){
        var active = this.getSelectedItem();
         Ext.MessageBox.confirm('Bestätigen', 'Projekt sicher löschen?', 
        	function(btn){
                    if (btn == 'yes'){
                        Projects.remove(active.get('id'));
                        this.reload();
                    }        		
        	}
        ,this);	
    },
    onAddProjectClick: function(){
    	this.win = Ext.create('widget.projectwindow',{});
    	this.win.show();
    },
    onEditProjectClick: function(){
        this.editwin = Ext.create('widget.projectwindowedit',{id:this.getSelectedItem().get('id'),name:this.getSelectedItem().get('name')});
        this.editwin.show();
        this.editwin.onload();
    },
    loadEvents: function(){
        app.msgBus.on('reloadprojectstore', function(){ 
        	this.reload();
        },this);
    }
});

