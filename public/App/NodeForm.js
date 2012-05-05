Ext.define('App.NodeForm', {
	
	extend: 'Ext.form.Panel',
    alias: 'widget.nodeform',
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
	             },{
	                 fieldLabel: 'IP-Adresse',
	                 name: 'ipaddress',
	                 xtype: 'textfield',
	                 allowBlank: false,
	                 msgTarget: 'side'
	             },{
	                 fieldLabel: 'Port (optional)',
	                 name: 'port',
	                 xtype: 'textfield',
	                 allowBlank: true,
	                 msgTarget: 'side'
	             },{
	                 fieldLabel: 'Passphrase (optional)',
	                 name: 'passphrase',
	                 xtype: 'textfield',
	                 allowBlank: true,
	                 msgTarget: 'side'
	             },{
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
