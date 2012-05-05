Ext.define('App.ClusterOverviewGridGroupTb', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.clusteroverviewgridgrouptb',
    initComponent: function(){
        Ext.apply(this,{
            items: [{
                xtype: 'buttongroup',
                title: 'Nodes',
                items: [
                    {text: 'Neu'},
                    {text: 'Löschen'},
                    {text: 'Aktualisieren'}
                ]}
                ,{
                xtype: 'buttongroup',
                title: 'Cluster',
                items: [
                    {text: 'Aktualisieren'}
                    ]
                }]
        });
        this.callParent(arguments);
    }
});