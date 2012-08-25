Rawson.Control.Zoom = Rawson.Control.Base.extend({
    menuItems: function(){
        return [
            {parentItem: 'image', id: 'image-zoom-in', label: 'Zoom In', action: this.zoomIn},
            {parentItem: 'image', id: 'image-zoom-out',label: 'Zoom Out', action: this.zoomOut},
            {parentItem: 'image', id: 'image-zoom-reset',label: 'Reset Zoom', action: this.resetZoom}
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
