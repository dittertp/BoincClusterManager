Ext.define('xpm.ProjectWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.projectwindow',
    plain: true,
    initComponent: function(){
        this.form = Ext.create('widget.projectform',{
        	api: {
        	    submit: Projects.submit
        	}
        });
        Ext.apply(this, {
            modal:true,
            title: 'Project Hinzufügen',
            layout: 'fit',
            items: this.form,
            buttons: [{
                xtype: 'button',
                text: 'Hinzufügen',
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
            success: this.destroy,
            scope: this
    	});
        setTimeout("app.msgBus.fireEvent('reloadprojectstore')",200);
    }
});
