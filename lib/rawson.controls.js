// Rawson.Control
// 
// a control extends the Rawson.Viewer with additional functionality,
// e.g. support for file drag and drop, saving files in different formats
// etc. It never manipulates the loaded image itself, this is the task
// of the Rawson.PixelPusher
//

Rawson.Control = {};

Rawson.Control.Base = Rawson.Class.extend({
    
    // each control gets the viewer object passed in
    viewer: null,
     
    // DOM container of the control, 
    // either a reference to an existing DOM node (DOMElement, jQuery Selector or JQuery Node)
    // or a hash containing tagName, className, id and attributes for creating an element on the fly -> http://backbonejs.org/#View-el
    // if null, the control will be attached to the viewer 
    container: null,
    
    
    // local events object -> http://backbonejs.org/#Events
    events: null,
    
    // eventListeners -> define an event literal up-front
    eventListeners: {},
    
    CLASS_NAME: 'Rawson.Control.Base',
    
    //templates hash literal -> should reference all templates used in this control
    templates: {},
    
    // menuItems: the menuItems this control defines
    // can either be given as literal or as function
    menuItems: [],
    
    //regex to split ui events, taken from backbone.js
    uiEventSplitter: /^(\S+)\s*(.*)$/,
    
    //if the control should be auto-activated or not
    autoActivate: true,
    
    constructor: function (options){
        this.options = options || {};
        this.events = Rawson.Events.clone();
        this.id = Rawson.Util.uniqueId(this.CLASS_NAME.split('.').join('_'));
        this.isActive = false;
        
        var container = this.options.container;
        if (container){
            if (jQuery.isPlainObject(container)){
                this.$el = this._makeContainer()
            }
            else {
                this.$el = jQuery(container);
            }
        }
    },
    //TODO: review this method
    _makeContainer: function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return $(el);
    },
    
     // activates the control
    activate: function (){
        this.events.trigger('activate', this);
        this.isActive = true;
    },
    
    // deactivates the control
    deactivate: function (){
        this.events.trigger('deactivate', this);
        this.isActive = false;
    },
    addViewerEvents: function (viewerEvents){
        for (evt in viewerEvents){
            var method = this[viewerEvents[evt]];
            if (jQuery.isFunction(method)){
                this.viewer.events.on(evt,method,this);
            }
        }
    },
    removeViewerEvents: function (viewerEvents){
        for (evt in viewerEvents){
            var method = this[evt];
            if (jQuery.isFunction(method)){
                this.viewer.off(evt,method,this);
            }
        }
    },
    // here we add the control to the viewer, 
    // subclass-able for pre -or post-adding hooks
    setViewer: function (viewer){
        this.viewer = viewer;
        if (this.viewerEvents){
            this.addViewerEvents(this.viewerEvents);
        }
        if (this.uiEvents){
            this.addUIEvents(this.uiEvents);
        }
        this.viewer.events.trigger('control:add',this);
    },
    // add ui events to the control via jQuery.delegate
    addUIEvents: function (uiEvents){
        this.removeUIEvents();
        for (var key in uiEvents) {
            var method = uiEvents[key];
            if (!jQuery.isFunction(method)) method = this[uiEvents[key]];
            if (!method) throw new Error('Method "' + uiEvents[key] + '" does not exist');
            var match = key.match(this.uiEventSplitter);
            var eventName = match[1], selector = match[2];
            method = jQuery.proxy(method, this);
            eventName += '.delegateEvents' + this.id;
            if (selector === '') {
              this.$el.bind(eventName, method);
            } else {
              this.$el.delegate(selector, eventName, method);
            }
        }
    },
    // remove ui events from the control
    removeUIEvents: function (uiEvents){
        this.$el.unbind('.delegateEvents' + this.id);
    },
    //rendering function for the control
    render: function (){
        
    },
    toString: function (){
        return this.CLASS_NAME;
    },
    destroy: function (){
        this.events.trigger('control:remove',this);
        this.removeMenuItems();
        if (this.viewerEvents){
            this.removeViewerEvents();
        }
        if (this.uiEvents){
            this.removeUIEvents(this.uiEvents);
        }
        this.events.off();
    }
});










