Ext.define('App.ClusterNodeForm', {
	
	extend: 'Ext.form.Panel',
    alias: 'widget.clusternodeform',
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
                        name:'nid',
                        fieldLabel: 'Nodes',
                        hiddenName: 'nid',
                        store: Ext.data.StoreManager.lookup(this.createStore()),
                        valueField: 'nid',
                        displayField: 'nodename',
                        //triggerAction: 'all',
                        queryMode: 'local',
                        editable: false
                        }]
        });
        this.load();
        this.callParent(arguments);
    },
    load: function(){
    	this.store.load({params:{clusterid:this.cid}});
        
    },
    createStore: function(){
            this.store = Ext.create('Ext.data.DirectStore', {
                model: 'Nodecombobox',
                autoLoad:false,
                paramOrder: ['clusterid'],
                api: {
                    read    : Cluster.getnodesnotincluster
                }

            });
        return this.store;
    }
});
