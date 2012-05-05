Ext.define('App.ManagementPanel', {
    extend: 'Ext.panel.Panel',	
    
    alias: 'widget.managementpanel',
    title: 'Management',
    region: 'west',
    width: 250,
    margins: '5 5 200 10',
    layout: 'accordion',
    activeItem: 0,
    initComponent: function(){
	    Ext.apply(this, {
	    	items: [this.createManClusterPanel(),this.createManNodePanel(),this.createManAdmPanel()]
	    });
	    this.callParent(arguments);
	},
    createManClusterPanel: function(){
    	this.AdmClusterPanel = Ext.create('widget.manclusterpanel', {title: 'Cluster'});
    	return this.AdmClusterPanel;
    },
    createManNodePanel: function(){
        this.AdmNodePanel = Ext.create('widget.mannodepanel',{title:'Nodes'});
        return this.AdmNodePanel;
    },
    createManAdmPanel: function(){
        this.AdmNodePanel = Ext.create('widget.manadmpanel',{title:'Administration'});
        return this.AdmNodePanel;
    }
});

