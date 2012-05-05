Ext.define('App.NodeWindowEdit', {
    extend: 'Ext.window.Window',
    alias: 'widget.nodewindowedit',
    
    plain: true,
    initComponent: function(){
        this.form = Ext.create('widget.nodeform',{
        	api: {
        		load:Nodes.getone,
                        submit: Nodes.update
        	},
        	paramOrder: ['id']
        });
        Ext.apply(this, {
            modal:true,
            title: 'Node \''+this.name+'\' Bearbeiten',
            layout: 'fit',
            items: this.form,
            buttons: [{
                xtype: 'button',
                text: 'Speichern',
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
        this.callParent(arguments);
    },

    onAddClick: function(){
    	this.form.getForm().submit({
            params: {id: this.id},
            success: this.destroy,
            scope: this
    	});
        setTimeout("app.msgBus.fireEvent('reloadnodestore')",200);
    },
    
    onload:function(){
    	console.log(this.id);
    	this.form.getForm().load({
            params: { id: this.id },
    		scope: this
    	});
    }
});
