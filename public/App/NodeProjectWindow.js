Ext.define('App.NodeProjectWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.nodeprojectwindow',
    plain: true,
    initComponent: function(){
        this.form = Ext.create('widget.nodeprojectform',{
        	api: {
        	    submit: Nodes.addproject
        	},
                paramOrder: ['nodeid'],
                nodeid:this.nodeid
        });
        Ext.apply(this, {
            modal:true,
            title: 'Project zum Node Hinzufügen',
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
        console.log(this.form.getForm().getValues());
        this.form.getForm().submit({
            params: {nodeid: this.nodeid},
            success: this.destroy,
            scope: this
    	});
        //setTimeout("app.msgBus.fireEvent('reloadclusteroverviewstore')",200);
    	//app.msgBus.fireEvent('reloadnodestore');	
    }
});
