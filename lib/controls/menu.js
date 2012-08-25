

Rawson.Control.Menu = Rawson.Control.Base.extend({
    container: '#menu-container',
    template: '<ul class="nav" id="{{this.id}}"> \
                {{#each menu}} \
                    <li class="dropdown"> \
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">{{this.label}}</a> \
                        <ul class="dropdown-menu" id="{{this.id}}"> \
                            {{#each menuItems}}\
                                {{#if this.href}} \
                                    <li><a class="menu-item" id="{{this.id}}" target="_new" href="{{this.href}}">{{this.label}}</a></li>\
                                {{else}}\
                                     <li><a class="menu-item" id="{{this.id}}" data-controlid="{{this.controlId}}" data-actionparams="{{this.actionParams}}">{{this.label}}</a></li>\
                                {{/if}}\
                            {{/each}} \
                        </ul> \
                    </li>\
                {{/each}} \
              </ul>',
    viewerEvents: {
        'control:add': 'addMenuItemsOfControl',
        'control:remove': 'removeMenuItemsOfControl',
    },
    uiEvents: {
        'click .menu-item': 'executeItemAction'
    },          
    constructor: function (options){
        Rawson.Control.Base.prototype.constructor.apply(this, arguments);
        this.menu = [];
        this.menuItems = options.menuItems;
        this.menuActions = {};
        this.addDefaultItems();
    },
    executeItemAction: function (e){
        var $clickedItem = $(e.currentTarget);
        
        // prevent execution of inactive menu items
        if ($clickedItem.hasClass('inactive')){
            return false;
        }
        var menuItemId = $clickedItem.attr('id');
        if (this.menuActions[menuItemId]){
            var actionParams = $clickedItem.data('actionparams') || {};
            this.menuActions[menuItemId](actionParams);
        }
        console.log("Executing menu item", arguments);
    },
    getMenuItem: function (id){
        for (var i = 0; i < this.menu.length; i++){
            var curItem = this.menu[i];
            if (curItem.id === id){
                return curItem;
            };
            if (curItem.menuItems){
                for (var j = 0; j < curItem.menuItems.length; j++){
                    if (curItem.menuItems[j].id === id){
                        return curItem.menuItems[j];
                    }
                }
            }
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
        //prevent duplicate menu entries
        if (this.getMenuItem(itemConfig.id)){
            return false;
        }
        if (itemConfig.parentItem){
            var parentItem = this.getMenuItem(itemConfig.parentItem);
            if (itemConfig.active === undefined){
                itemConfig.active = true;
            }
            this.menuActions[itemConfig.id] = itemConfig.clickAction; 
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
        control.events.on('deactivate', this.deactivateControlMenuItems, this);
        control.events.on('activate', this.activateControlMenuItems, this);
        
        if (jQuery.isArray(menuItems)){
            for (var i = 0; i < menuItems.length; i++){
                var curItem = menuItems[i];
                var menuItemId = Rawson.Util.uniqueId(control.id + '_');
                this.addMenuItem({
                    parentItem: curItem.parentItem,
                    id: curItem.id,
                    label: curItem.label,
                    clickAction: $.proxy(curItem.action,this),
                    actionParams: JSON.stringify(curItem.actionParams || {}),
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
        this.$el.html(this.tpl(obj));
    }
});
