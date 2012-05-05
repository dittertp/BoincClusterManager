Ext.define('App.ManAdmPanel', {
	
    extend: 'Ext.tree.Panel',
    alias: 'widget.manadmpanel',

    initComponent: function(){
        Ext.apply(this, {
            lines: false,
            rootVisible: false,
            border:false,
            store: this.createStore()
        });
        this.callParent(arguments);
    },

    createStore: function(){
            this.store = Ext.create('Ext.data.TreeStore', {
                model: 'Nodetree',
                autoLoad: true,
                root: {
                    expanded: true,
                    text: "My Root"
                },
                proxy: {
                    type: 'ajax',
                    url: 'data/adm.json',
                    reader: {
                        type: 'json',
                        root: 'users',
                        successProperty: 'success'
                    }
                }
            });
        return this.store;
    },
    listeners : {
        itemclick: function(dv, record, item, index, e) {
        	rec = new Array();
        	rec['id'] = record.get('id');
        	rec['text'] = record.get('text');
        	rec['type'] = record.get('type');
        	app.msgBus.fireEvent('maintabadd', rec );
        }
    }
});

