Rawson.Control.Zoom = Rawson.Control.Base.extend({
    menuItems: function(){
        return [
            {parent: 'image', label: 'Zoom In', action: this.zoomIn},
            {parent: 'image', label: 'Zoom Out', action: this.zoomOut},
            {parent: 'image', label: 'Reset Zoom', action: this.resetZoom}
        ]
    },
    zoomIn: function (){
        this.viewer.getActivePreview().zoomIn();
    },
    zoomOut: function (){
        this.viewer.getActivePreview().zoomOut();
    },
    resetZoom: function (){
        this.viewer.getActivePreview().resetZoom();
    } 
});
