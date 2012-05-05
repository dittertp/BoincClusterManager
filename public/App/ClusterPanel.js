Ext.define('App.ClusterPanel', {
	
    extend: 'Ext.tab.Panel',
    alias: 'widget.clusterpanel',
    closable:true,
    initComponent: function(){
        Ext.apply(this, {
            activeTab: 0,
            region: 'center',
            margins: '5 10 10 0',
            iconCls: 'cluster',
            items:  [
            this.createClusterOverview(this.clusterid)
            ]
            });
        this.callParent(arguments);
    },    
    createClusterOverview: function(rec){
    	this.ClusterOverview = Ext.create('widget.clusteroverviewpanel',{cid:rec});
    	return this.ClusterOverview;
    }
});

