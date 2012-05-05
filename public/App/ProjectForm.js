Ext.define('App.ProjectForm', {
	
	extend: 'Ext.form.Panel',
    alias: 'widget.projectform',
    initComponent: function(){
        Ext.apply(this, {
            border:false,
             autoHeight: true,
             bodyPadding: 10,
             defaults: {
                 anchor: '100%',
                 labelWidth: 200
             },
             items   : [{
	                 	fieldLabel: 'Name',
	                 	xtype: 'textfield',
	                 	name: 'name',
	                 	allowBlank: false,
	                 	msgTarget: 'side',
                                listeners: {
                                    afterrender: function(field) {
                                        field.focus(false, 1000);
                                    }
                                }
	             	},{
                        xtype: 'combo',
                        name:'pid',
                        fieldLabel: 'Projekte',
                        hiddenName: 'url',
                        store: Ext.data.StoreManager.lookup(this.createStore()),
                        valueField: 'name',
                        displayField: 'name',
                        queryMode: 'local',
                        editable: false,
                        listeners: {
                            select: function(combo, record) {
                            	if(record[0].data.url != "na"){
                            		this.getForm().setValues({
                            			projectname: record[0].data.name, 
                            			url: record[0].data.url
                            		});
                            	}
                            }
                        ,scope:this}
                        },{	
                        fieldLabel: 'Projetname',
        	            name: 'projectname',
        	            xtype: 'textfield',
        	            msgTarget: 'side'
                        },{
        	            fieldLabel: 'Projekturl',
        	            name: 'url',
        	            xtype: 'textfield',
        	            msgTarget: 'side'
                        },{
    	                 fieldLabel: 'AuthKey',
    	                 name: 'authkey',
    	                 xtype: 'textfield',
    	                 msgTarget: 'side'
                        },{
       	                fieldLabel: 'Benutzername (Optional)',
    	                name: 'username',
    	                xtype: 'textfield',
    	                msgTarget: 'side'
                        },{
    	                 fieldLabel: 'Passwort (Optional)',
    	                 name: 'password',
    	                 xtype: 'textfield',
    	                 msgTarget: 'side'
                        }]
        });
        this.load();
        this.callParent(arguments);
    },
    load: function(){
    	this.store.load();
        
    },
    createStore: function(){
            this.store = Ext.create('Ext.data.DirectStore', {
                model: 'Projectcombobox',
                autoLoad:false,
                api: {
                    read    : Projects.allprojectslist
                }

            });
        return this.store;
    }
});
