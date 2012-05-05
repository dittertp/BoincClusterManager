Ext.define('App.ClusterWindowEdit', {
    extend: 'Ext.window.Window',
    alias: 'widget.clusterwindowedit',
    
    plain: true,
    initComponent: function(){
        this.form = Ext.create('widget.clusterform',{
        	api: {
        		load:Cluster.getone,
                        submit: Cluster.update
        	},
        	paramOrder: ['id']
        });
        Ext.apply(this, {
            modal:true,
            title: 'Cluster \''+this.name+'\' Bearbeiten',
            layout: 'fit',
            items: this.form,
            buttons: [{
                xtype: 'button',
                text: 'Speichern',
                scope: this,
                handler:this.onAddClick
                
            }, {
                xtype: 'button',
                text: 'Abbrechen',
                scope: this,
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
        setTimeout("app.msgBus.fireEvent('reloadclusterstore')",200);
    },
    
    onload:function(){
    	//console.log(this.id);
    	this.form.getForm().load({
            params: { id: this.id },
    		scope: this
    	});
    }
});
