Ext.define('App.Launcher', {
    extend: 'Ext.container.Viewport',

    initComponent: function(){
    	app = this;
    	this.msgBus = new Ext.util.Observable();
        Ext.apply(this, {
            layout: 'border',
            items: [this.createHeaderPanel(),this.createControlPanel(),this.createMainPanel()]
        });
        this.callParent(arguments);
    },
    createHeaderPanel: function(){
        this.HeaderPanel = Ext.create('widget.headerpanel');
        return this.HeaderPanel;
    },
    createControlPanel: function(){
        this.ControlPanel = Ext.create('widget.managementpanel');
        return this.ControlPanel;
    },
    createMainPanel: function(){
        this.MainPanel = Ext.create('widget.mainpanel');
        return this.MainPanel;
    },
    un:function(){
    	return true;
    }
    
});

