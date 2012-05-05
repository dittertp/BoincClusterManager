Ext.define('App.PrefForm', {
	
	extend: 'Ext.form.Panel',
    alias: 'widget.prefform',
    initComponent: function(){
        Ext.apply(this, {
            border:false,
             autoHeight: true,
             width   : 650,
             bodyPadding: 10,
             items:[{
                xtype:'tabpanel',
                plain:true,
                activeTab: 0,
                height:360,
                defaults:{bodyStyle:'padding:10px'},
                    items:[{
                    /**** new tab section ****/
                    title:'Nutzung des Prozessors',
                    deferredRender:'true',
                    xtype:'form',
                    items:[{
	                   xtype: 'fieldset',
	                   margin: '0 5 0 0',
	                   title: 'Rechnen erlaubt',
                           defaults: {
                           labelWidth: 89,
                           anchor: '100%',
                           layout: {
                                    type: 'hbox',
                                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                                    }
                            },
                            items: [
                            {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'under',
                            defaults: {
                            hideLabel: true
                            },
                            items: [
                                {xtype: 'checkbox', name: 'run_on_batteries',inputValue: '1'},
                                {xtype: 'displayfield', value: 'Wenn der Computer im Batteriebetrieb ist'},
                                    ]
                            },
                            {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'under',
                            defaults: {
                            hideLabel: true
                            },
                            items: [
                                {xtype: 'checkbox',name: 'run_if_user_active',inputValue: '1'},
                                {xtype: 'displayfield', value: 'Wenn der Computer benutzt wird'},
                                    ]
                            },
                            {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'under',
                            defaults: {
                            hideLabel: true
                            },
                            items: [
                                {xtype: 'checkbox',name: 'run_gpu_if_user_active',inputValue: '1'},
                                {xtype: 'displayfield', value: 'Grafikkarte benutzen wenn der Computer benutzt wird'},
                                    ]
                            },
                            {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'under',
                            defaults: {
                            hideLabel: true
                            },
                            items: [
                                {xtype: 'displayfield', value: 'Nur wenn der Computer nicht beschäftigt war seit'},
                                {xtype: 'textfield',name: 'aaaa',width:50},
                                {xtype: 'displayfield', value: 'Minuten'},
                                    ]
                            },
                            {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'under',
                            defaults: {
                            hideLabel: true
                            },
                            items: [
                                {xtype: 'displayfield', value: 'Wenn CPU-Auslastung geringer als'},
                                {xtype: 'textfield',name: 'suspend_cpu_usage',width:40},
                                {xtype: 'displayfield', value: '% (0 = keine Einschränkung'},
                                    ]
                            },
                            {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'under',
                            defaults: {
                            hideLabel: true
                            },
                            items: [
                                {xtype: 'displayfield', value: 'Jeden Tag in der Zeit zwischen'},
                                {xtype: 'textfield',name: 'start_hour',width:60},
                                {xtype: 'displayfield', value: 'und'},
                                {xtype: 'textfield',name: 'end_hour',width:60},
                                {xtype: 'displayfield', value: '(keine Einschränkungen, wenn gleich'},
                                    ]
                            }
                           ]
	                 },{
	                   xtype: 'fieldset',
	                   margin: '0 5 0 0',
	                   title: 'andere Optionen',
                           defaults: {
                           labelWidth: 89,
                           anchor: '100%',
                           layout: {
                                    type: 'hbox',
                                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                                    }
                            },
                            items: [
                            {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'under',
                            defaults: {
                            hideLabel: true
                            },
                            items: [
                                {xtype: 'displayfield', value: 'Wechsel zwischen den Anwendung alle'},
                                {xtype: 'textfield',name: 'disk_interval',width:40},
                                {xtype: 'displayfield', value: 'Minuten'}
                                    ]
                            },
                            {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'under',
                            defaults: {
                            hideLabel: true
                            },
                            items: [
                                {xtype: 'displayfield', value: 'Auf Multiprozessorsystemen nutze höchstens'},
                                {xtype: 'textfield',name: 'max_ncpus_pct',width:50},
                                {xtype: 'displayfield', value: '% der Prozessoren'}
                                    ]
                            },
                            {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'under',
                            defaults: {
                            hideLabel: true
                            },
                            items: [
                                {xtype: 'displayfield', value: 'Nutze höchstens'},
                                {xtype: 'textfield',name: 'cpu_usage_limit',width:50},
                                {xtype: 'displayfield', value: '% der Prozessor-Zeit'}
                                    ]
                            }
                        ]    
                     }
                 ]
            },{
              /**** new tab section ****/
                xtype:'form',
                title: 'Nutzung des Netzwerks',
                deferredRender:'true',
                items:[ 
                    {
	                   xtype: 'fieldset',
	                   margin: '0 5 0 0',
	                   title: 'allgemeine Einstellungen',
                           defaults: {
                           labelWidth: 89,
                           anchor: '100%',
                           layout: {
                                    type: 'hbox',
                                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                                    }
                            },
                            items: [
                            {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'under',
                            defaults: {
                            hideLabel: true
                            },
                            items: [
                                {xtype: 'displayfield', value: 'Maximale Download-Rate',width:160},
                                {xtype: 'textfield', name: 'max_bytes_sec_down',width:40},
                                {xtype: 'displayfield', value: 'KByte/Sek.',width:80},
                                {xtype: 'displayfield', value: 'Maximale Upload-Rate',width:160,labelAlign : 'right'},
                                {xtype: 'textfield', name: 'max_bytes_sec_up',width:40},
                                {xtype: 'displayfield', value: 'KByte/Sek.'}
                                    ]
                            },
                            {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'under',
                            defaults: {
                            hideLabel: true
                            },
                            items: [
                                {xtype: 'displayfield', value: 'Übertrage höchstens',width:160},
                                {xtype: 'textfield', name: 'daily_xfer_limit_mb',width:40},
                                {xtype: 'displayfield', value: 'MB',width:80},
                                {xtype: 'displayfield', value: 'pro',width:160,labelAlign : 'right'},
                                {xtype: 'textfield', name: 'daily_xfer_period_days',width:40},
                                {xtype: 'displayfield', value: 'Tage'}
                                    ]
                            },
                            {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'under',
                            defaults: {
                            hideLabel: true
                            },
                            items: [
                                {xtype: 'displayfield', value: 'verbinde etwa alle',width:160},
                                {xtype: 'textfield', name: 'work_buf_min_days',width:40},
                                {xtype: 'displayfield', value: 'Tage',width:80},
                                {xtype: 'displayfield', value: 'Zusätzlicher Arbeitspuffer',width:160,labelAlign : 'right'},
                                {xtype: 'textfield', name: 'work_buf_additional_days',width:40},
                                {xtype: 'displayfield', value: 'Tage (max. 10)'}
                                    ]
                            }
                        ]
                    }]
                }]

                }]
        });
        
        this.callParent(arguments);
    }
});
