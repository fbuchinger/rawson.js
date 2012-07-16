

Rawson.Control.Menu = Rawson.Control.Base.extend({
    container: '#menu-container',
    template: '<ul class="nav" id="{{this.id}}"> \
                {{#each menu}} \
                    <li class="dropdown"> \
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">{{this.label}}</a> \
                        <ul class="dropdown-menu" id="{{this.id}}"> \
                            {{#each menuItems}}\
                              <li><a id="{{this.id}}" data-controlid="{{this.controlId}}" href="{{this.href}}" target="_new">{{this.label}}</a></li>\
                            {{/each}} \
                        </ul> \
                    </li>\
                {{/each}} \
              </ul>',
              
    constructor: function (options){
        Rawson.Control.Base.prototype.constructor.apply(this, arguments);
        this.menu = [];
        this.menuItems = options.menuItems;
        this.addDefaultItems();
    },
    setViewer: function (viewer){
        Rawson.Control.Base.prototype.setViewer.apply(this, arguments);
        this.viewer.events.on('control:add', this.addMenuItemsOfControl, this);
        this.viewer.events.on('control:remove', this.removeMenuItemsOfControl, this);
    },
    getMenuItem: function (id){
        for (var i = 0; i < this.menu.length; i++){
            if (this.menu[i].id === id){
                return this.menu[i];
            };
        }
    },
    addMainMenu: function (id, menuLabel){
        if (!this.getMenuItem(id)){
            this.menu.push({id: id, label: menuLabel, menuItems: []});
        }
    },
    // menuConfig
    //  parentItem: id of the parent menu node
    //  label: label
    //  action: the click action of the menu item
    //  id (optional): id of the menu item node
    //  active: whether the menu item should be active or not
    addMenuItem: function (itemConfig){
        if (itemConfig.parentItem){
            var parentItem = this.getMenuItem(itemConfig.parentItem);
            if (itemConfig.active === undefined){
                itemConfig.active = true;
            }
            itemConfig.cssClass = itemConfig.active ? 'active' : 'inactive';
            parentItem.menuItems.push(itemConfig);
        }
        else {
            this.menu.push(jQuery.extend(itemConfig,{menuItems:[]}));
        }
        this.render();
    },
    removeMenuItem: function (mainMenuId, itemLabel){
        console.log("removing menu item", arguments);
    },
    addDefaultItems: function (){
        for (var i = 0; i < this.menuItems.length; i++){
            this.addMenuItem(this.menuItems[i]);
        }
    },
    addMenuItemsOfControl: function (control){
        var menuItems = jQuery.isFunction(control.menuItems) ? control.menuItems(): control.menuItems;
        var menuItemId = Rawson.Util.uniqueId(control.id + '_');
        console.log("adding menuitems", menuItems);
        control.events.on('deactivate', this.deactivateControlMenuItems, this);
        control.events.on('activate', this.activateControlMenuItems, this);
        
        if (jQuery.isArray(menuItems)){
            for (var i = 0; i < menuItems.length; i++){
                var curItem = menuItems[i];
                this.addMenuItem({
                    parentItem: curItem.parentItem,
                    id: menuItemId,
                    label: curItem.label,
                    clickAction: $.proxy(curItem.action,this),
                    controlId: control.id,
                });
            }
        }
        
        control.autoActivate ? this.activateControlMenuItems(control) : this.deactivateControlMenuItems(control);
    },
    getItemsOfControl: function (control){
        return this.$el.find('a').filter(function(){
            return $(this).data('controlid') === control.id;
        });
    },
    deactivateControlMenuItems: function (control){
        this.getItemsOfControl(control).addClass('inactive').removeClass('active');
    },
    activateControlMenuItems: function (control){
        this.getItemsOfControl(control).addClass('active').removeClass('inactive');
    },
    removeMenuItemsOfControl: function (controlId){
        var menuItems = jQuery.isFunction(this.menuItems) ? this.menuItems(): this.menuItems;
        if (jQuery.isArray(menuItems)){
            for (var i = 0; i < menuItems.length; i++){
                var curItem = menuItems[i];
                this.removeMenuItem(curItem.parent, curItem.label, $.proxy(curItem.action,this));
            }
        }
    },
    render: function(){
        this.tpl = Handlebars.compile(this.template);
        var obj = {
            id:'yummy',
            menu: this.menu
        }
        //TODO: add the rendering of menu items
        this.$el.html(this.tpl(obj));
    },
    destroy: function (){
        
    }
});
