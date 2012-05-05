Ext.define('App.ClusterForm', {
	
    extend: 'Ext.form.Panel',
    alias: 'widget.clusterform',
    initComponent: function(){
        Ext.apply(this, {
            border:false,
             autoHeight: true,
             width   : 600,
             bodyPadding: 10,
             defaults: {
                 anchor: '100%',
                 labelWidth: 200
             },
             items   : [
                    {
	                 fieldLabel: 'Name',
	                 xtype: 'textfield',
	                 name: 'name',
	                 allowBlank: false,
	                 msgTarget: 'side'
	             },
                     {
                         fieldLabel: 'Beschreibung',
                         name: 'description',
                         xtype: 'textarea',
                         allowBlank: true,
	                 msgTarget: 'side'
                    }
             ]
        });
        
        this.callParent(arguments);
    }
});
