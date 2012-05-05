Ext.define('App.MainPanel', {	
    extend: 'Ext.tab.Panel',
    alias: 'widget.mainpanel',

    activeTab: 0,
    region: 'center',
    margins: '5 10 10 0',	
    items: [{
            xtype: 'panel',
            title: 'Dashboard',
            closeable:true
    }],
    initComponent: function(){ 
    	this.loadEvents();
        this.callParent(arguments);
    },
    onAddTab: function(rec) {
        var at = this.ifexists(rec);
        if ( at ){
            this.setActiveTab(at);
        }else{
            switch(rec['type'])
            {
                case 'n':
                    this.setActiveTab(this.add(this.createNodePanel(rec)));
                    break;
                case 'c':
                    this.setActiveTab(this.add(this.createClusterPanel(rec)));
                    break;
                case 'nm':
                    this.setActiveTab(this.add(this.createNodeManPanel(rec)));
                    break;
                case 'cm':
                    this.setActiveTab(this.add(this.createClusterManPanel(rec)));
                    break;
                case 'p':
                    this.setActiveTab(this.add(this.createProjectManGrid(rec)));
                    break;  
                default:
                    console.log('nichts zu tun');
            }
        }
    },
    ifexists: function(rec){
        tabType = rec.type;

        switch(tabType)
        {
            case 'nm':
                var tab = this.items.findBy(function(i){
                    return i.type == tabType;
                });
                break;
            case 'cm':
                var tab = this.items.findBy(function(i){
                    return i.type == tabType;
                });
                break;
            case 'p':
                var tab = this.items.findBy(function(i){
                    return i.type == tabType;
                });
                break;
            case 'n':
                var tab = this.items.findBy(function(i){
                        return i.nodeid == rec.nodeid;
                    });
                break;
            case 'c':
                var tab = this.items.findBy(function(i){
                    return i.clusterid == rec.clusterid;
                });
                break;
            default:
                console.log('nichts zu tun');
        }
        return tab;
    },
    ifexists_orig: function(rec){
        console.log(rec.clusterid);
        console.log(rec.nodeid);
        console.log(rec.type);
        if(rec.type == "cm" || rec.type == "nm" || rec.type == "p"){
            var tab = this.items.findBy(function(i){
                return i.type == rec.type;
            });
            //if(tab){return tab;}
            return tab;
        }
        tabID = rec.id;
        tabType = rec.type;
        var tab = this.items.findBy(function(i){
            if(i.type == tabType){
                return i.id == tabID;
            }
            //return i.id == tabID;
        });
        return tab;
    },
        createNodePanel: function(rec){
    	this.NodePanel = Ext.create('widget.nodepanel', {title: rec.text, nodeid:rec.nodeid,type:rec.type});
    	return this.NodePanel;
        },
        createNodeManPanel: function(rec){
    	this.NodeManPanel = Ext.create('widget.nodemanpanel', {closeable:true, title: "Nodeverwaltung", type:rec.type});
    	return this.NodeManPanel;
        },
        createClusterPanel: function(rec){
    	this.ClusterPanel = Ext.create('widget.clusterpanel', {title: rec.text, clusterid:rec.clusterid,type:rec.type});
    	return this.ClusterPanel;
        },
        createClusterManPanel: function(rec){
    	this.ClusterManPanel = Ext.create('widget.clustermanpanel', {title: "Clusterverwaltung", type:rec.type});
    	return this.ClusterManPanel;
        },
        createProjectManGrid: function(rec){
        	this.ProjectManGrid = Ext.create('widget.projectmangrid', {title: rec.text, id:rec.id,type:rec.type});
        	return this.ProjectManGrid;
            },
        loadEvents: function(){
            app.msgBus.on('maintabadd', function(rec){ 
                    this.onAddTab(rec);
            },this);
        }
});

