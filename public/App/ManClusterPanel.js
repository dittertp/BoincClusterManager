Ext.define('App.ManClusterPanel', {
	
	extend: 'Ext.tree.Panel',
    alias: 'widget.manclusterpanel',

    initComponent: function(){
        Ext.apply(this, {
            lines: false,
            rootVisible: true,
            border:false,
            store: this.createStore()
        });
        app.msgBus.on('reloadclustertree', function(){ 
        	this.store.load(); 
        },this);
        this.callParent(arguments);
    },

    createStore: function(){
            this.store = Ext.create('Ext.data.TreeStore', {
                model: 'Clustertree',
                root: {
                    text: 'Verwaltung',
                    type:'cm',
                    iconCls:'manage',
                    expanded: true
                },
                autoLoad: true,
		         proxy: {
		        	 type: 'direct',
		        	 directFn: Cluster.tree,
		        	 paramOrder: ['node']
		         }
            });
        return this.store;
    },
    listeners : {
        itemclick: function(dv, record, item, index, e) {
        	rec = new Array();
            $idtype = "id";
            if(record.get('type') == "n"){
                rec['nodeid'] = record.get('nodeid');
                rec['text'] = record.get('text');
                rec['type'] = record.get('type');
            }else if (record.get('type') == "c"){
                rec['clusterid'] = record.get('clusterid');
                rec['text'] = record.get('text');
                rec['type'] = record.get('type');
            }else if(record.get('type') == "cm"){
                rec['text'] = record.get('text');
                rec['type'] = record.get('type');
            }
        	//rec[$idtype] = record.get('id');
            //rec['text'] = record.get('text');
            //rec['type'] = record.get('type');

        	app.msgBus.fireEvent('maintabadd', rec );
        }
    }
});

