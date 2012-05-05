Ext.define('App.NodePanel', {
	
	extend: 'Ext.tab.Panel',
    alias: 'widget.nodepanel',
    closable:true,
    initComponent: function(){
        Ext.apply(this, {
            activeTab: 0,
            region: 'center',
            margins: '5 10 10 0',
            iconCls: 'node',
            items: [
                    this.createNodeProjectGrid(),
                    this.createNodeWorkGrid(),
                    this.createNodeTransferGrid(),
                    this.createNodeMessageGrid()
                    ]
        });
        
        this.callParent(arguments);
    },
    
    createNodeWorkGrid: function(){
    	this.NodeWorkGrid = Ext.create('widget.nodeworkgrid',{nodeid:this.nodeid});
    	return this.NodeWorkGrid;
    },
    createNodeProjectGrid: function(){
    	this.ProjectGrid = Ext.create('widget.nodeprojectgrid',{nodeid:this.nodeid});
    	return this.ProjectGrid;
    },
    createNodeMessageGrid: function(){
    	this.NodeMessageGrid = Ext.create('widget.nodemessagegrid',{nodeid:this.nodeid});
    	return this.NodeMessageGrid;
    },
    createNodeTransferGrid: function(){
    	this.NodeTransferGrid = Ext.create('widget.nodetransfergrid',{nodeid:this.nodeid});
    	return this.NodeTransferGrid;
    }
});


