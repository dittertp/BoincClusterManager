Ext.define('App.ClusterWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.clusterwindow',
    plain: true,
    initComponent: function(){
        this.form = Ext.create('widget.clusterform',{
        	api: {
        	    submit: Cluster.submit
        	}
        });
        Ext.apply(this, {
            modal:true,
            title: 'Cluster Hinzufügen',
            layout: 'fit',
            items: this.form,
            buttons: [{
                xtype: 'button',
                text: 'Hinzufügen',
                scope: this,
                handler:this.onAddClick
                
            }, {
                xtype: 'button',
                text: 'Abbrechen',
                scope: this,
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
        setTimeout("app.msgBus.fireEvent('reloadclusterstore')",200);
    	//app.msgBus.fireEvent('reloadnodestore');	
    }
});
