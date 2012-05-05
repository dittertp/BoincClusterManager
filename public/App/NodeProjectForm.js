Ext.define('App.NodeProjectForm', {
	
	extend: 'Ext.form.Panel',
    alias: 'widget.nodeprojectform',
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
                         xtype: 'combo',
                         name:'projectid',
                         fieldLabel: 'Projekt',
                         hiddenName: 'projectid',
                         store: Ext.data.StoreManager.lookup(this.createStore()),
                         valueField: 'projectid',
                         displayField: 'name',
                         queryMode: 'local',
                         editable: false
                        }]
        });
        console.log(this.nodeid);
        this.load();
        this.callParent(arguments);
    },
    load: function(){
    	this.store.load({params:{nodeid:this.nodeid}});
        
    },
    createStore: function(){
            this.store = Ext.create('Ext.data.DirectStore', {
                model: 'Projectcombobox',
                autoLoad:false,
                paramOrder: ['nodeid'],
                api: {
                    read    : Projects.getavailprojectsascombo
                }

            });
        return this.store;
    }
});
