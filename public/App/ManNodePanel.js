Ext.define('App.ManNodePanel', {
	
    extend: 'Ext.tree.Panel',
    alias: 'widget.mannodepanel',

    initComponent: function(){
        Ext.apply(this, {
            lines: false,
            rootVisible: true,
            border:false,
            store: this.createStore()
        });
        app.msgBus.on('reloadnodetree', function(){ 
        	this.store.load(); 
        },this);
        //this.loadEvents();
        this.callParent(arguments);
    },
    createStore: function(){
            this.store = Ext.create('Ext.data.TreeStore', {
                model: 'Nodetree',
                root: {
                    text:'Verwaltung',
                    type:'nm',
                    iconCls:'manage',
                    expanded: true
                },
                
                autoLoad: true,
		         proxy: {
		        	 type: 'direct',
		        	 directFn: Nodes.tree,
		        	 paramOrder: ['node']
		         }
            });
        return this.store;
    },
    
    load: function(){
    	this.store.load();
    },

    reload: function(){
    	this.load();
    },
    listeners : {
        itemclick: function(dv, record, item, index, e) {
        	rec = new Array();
        	rec['nodeid'] = record.get('id');
        	rec['text'] = record.get('text');
            rec['type'] = record.get('type');
        	app.msgBus.fireEvent('maintabadd', rec );
        }
    }
});

//,
//    loadEvents: function(){
//        app.msgBus.on('reloadnodetree', function(){ 
//            console.log("asdasdasd");
//        	this.store.load();
//        },this);
//    }