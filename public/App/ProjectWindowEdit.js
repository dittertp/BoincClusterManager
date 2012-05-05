Ext.define('App.ProjectWindowEdit', {
    extend: 'Ext.window.Window',
    alias: 'widget.projectwindowedit',
    
    plain: true,
    initComponent: function(){
        this.form = Ext.create('widget.projectform',{
        	api: {
        		load:Projects.getone,
                        submit: Projects.update
        	},
        	paramOrder: ['id']
        });
        Ext.apply(this, {
            modal:true,
            title: 'Projektdaten \''+this.name+'\' Bearbeiten',
            layout: 'fit',
            items: this.form,
            buttons: [{
                xtype: 'button',
                text: 'Speichern',
                iconCls:'accept',
                scope: this,
                handler:this.onAddClick
                
            }, {
                xtype: 'button',
                text: 'Abbrechen',
                iconCls:'cancel',
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
        setTimeout("app.msgBus.fireEvent('reloadprojectstore')",200);
    },
    
    onload:function(){
    	console.log(this.id);
    	this.form.getForm().load({
            params: { id: this.id },
    		scope: this
    	});
    }
});
