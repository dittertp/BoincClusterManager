Ext.define('xpm.NodeWorkGrid', {
	
	extend: 'Ext.panel.Panel',
    alias: 'widget.nodeworkgrid',
    initComponent: function(){
        Ext.apply(this, {
        	region:'center',
        	title:'Berichte',
        	layout: 'border'
        });
        this.callParent(arguments);
    }
});


