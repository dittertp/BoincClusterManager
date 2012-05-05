Ext.define('App.PrefWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.prefwindow',
    
    plain: true,
    initComponent: function(){
        this.form = Ext.create('widget.prefform',{
        	api: {
        		load: Nodes.getprefs,
                        submit: Nodes.setprefs
        	},
        	paramOrder: ['nodeid']
        });
        Ext.apply(this, {
            modal:true,
            title: 'Einstellungen Bearbeiten',
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
            params: {nodeid: this.nodeid},
            success: this.destroy,
            scope: this
    	});
        //setTimeout("app.msgBus.fireEvent('reloadnodestore')",200);
    },
    
    onload: function(){
    	this.form.getForm().load({
            params: { nodeid: this.nodeid },
            scope: this
    	});
    }
});
