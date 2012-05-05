Ext.define('App.ClusterNodeWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.clusternodewindow',
    plain: true,
    initComponent: function(){
        this.form = Ext.create('widget.clusternodeform',{
        	api: {
        	    submit: Nodes.addtocluster
        	},
                paramOrder: ['cid'],
                cid:this.cid
        });
        Ext.apply(this, {
            modal:true,
            title: 'Node zum Cluster Hinzufügen',
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
            params: {cid: this.cid},
            success: this.destroy,
            scope: this
    	});
        setTimeout("app.msgBus.fireEvent('reloadclusteroverviewstore')",200);
    	//app.msgBus.fireEvent('reloadnodestore');	
    }
});
