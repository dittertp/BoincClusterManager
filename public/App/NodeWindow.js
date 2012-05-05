Ext.define('xpm.NodeWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.nodewindow',
    plain: true,
    initComponent: function(){
        this.form = Ext.create('widget.nodeform',{
        	api: {
        	    submit: Nodes.submit
        	}
        });
        Ext.apply(this, {
            modal:true,
            title: 'Node Hinzufügen',
            layout: 'fit',
            items: this.form,
            buttons: [{
                xtype: 'button',
                text: 'Hinzufügen',
                scope: this,
                iconCls:'accept',
                handler:this.onAddClick
                
            }, {
                xtype: 'button',
                text: 'Abbrechen',
                scope: this,
                iconCls:'cancel',
                handler: this.destroy
            }]
        });
        //alert(this.pname);
        this.callParent(arguments);
    },
    onAddClick: function(){
    	this.form.getForm().submit({
            success: this.destroy,
            scope: this
    	});
        setTimeout("app.msgBus.fireEvent('reloadnodestore')",200);
    	//app.msgBus.fireEvent('reloadnodestore');	
    }
});
