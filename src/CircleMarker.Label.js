L.CircleMarker.include({
    showLabel:function(){
        return this._label&&this._map&&(this._label.setLatLng(this._latlng),this._map.showLabel(this._label)),this
    },
         
                          
    hideLabel:function(){
        return this._label&&this._label.close(),this
    },
                           
    setLabelNoHide:function(t){
        this._labelNoHide!==t&&(this._labelNoHide=t,t?(this._removeLabelRevealHandlers(),this.showLabel()):(this._addLabelRevealHandlers(),this.hideLabel()))
    },
                                                                                                     
    bindLabel:function(content, options){          
        var anchor = new L.Point(0,0);
        anchor = anchor.add(L.Label.prototype.options.offset);         
                           
        if (options && options.offset) {
            anchor = anchor.add(options.offset);
        }
                           
        options = L.Util.extend({offset: anchor}, options);
        this._label=new L.Label(options,this);
        this._label.setContent(content);
        this._showLabelAdded;
        this._showLabel;
        this._labelNoHide = options.noHide;
                           
        if (!this._label) {
            if (!this._labelNoHide) {
                this._addLabelRevealHandlers();
            }
                           
            this
                .on('remove', this.hideLabel, this)
                .on('move', this._moveLabel, this);
                           
            this._hasLabelHandlers = true;
        }
           
        if (!this._showLabelAdded) {
                           
            if (!this._labelNoHide && !options.mobile) {
                this.on('mouseover', this._showLabel, this);
                this.on('mousemove', this._moveLabel, this);           
                this.on('mouseout remove', this._hideLabel, this);
            }
                           
            if (L.Browser.touch) {
                this.on('click', this._showLabel, this);
            }
                           
            this._showLabelAdded = true;
        }                          
                           
        this._label = new L.Label(options, this)
        .setContent(content);
                           
        return this;          
    },
                                       
    unbindLabel:function(){
          return this._label&&(this.hideLabel(),this._label=null,this._hasLabelHandlers&&(this._labelNoHide||this._removeLabelRevealHandlers(),this.off("remove",this.hideLabel,this).off("move",this._moveLabel,this)),this._hasLabelHandlers=!1),this
    },
                     
    updateLabelContent:function(t){
        this._label&&this._label.setContent(t)
    },
                            
    _addLabelRevealHandlers:function(){
        this.on("mouseover",this.showLabel,this).on("mouseout",this.hideLabel,this),L.Browser.touch&&this.on("click",this.showLabel,this)
    },
                           
    _removeLabelRevealHandlers:function(){
        this.off("mouseover",this.showLabel,this).off("mouseout",this.hideLabel,this).off("remove",this.hideLabel,this).off("move",this._moveLabel,this),L.Browser.touch&&this.off("click",this.showLabel,this)
    },
                          
    _moveLabel:function(t){
        this._label.setLatLng(t.latlng)
    },
                             
    _originalUpdateZIndex:L.Marker.prototype._updateZIndex,_updateZIndex:function(t){
        var e=this._zIndex+t;this._originalUpdateZIndex(t),this._label&&this._label.updateZIndex(e)
    },
                           
    _originalSetOpacity:L.Marker.prototype.setOpacity,setOpacity:function(t,e){
        this.options.labelHasSemiTransparency=e,this._originalSetOpacity(t)
    },
                        
    _originalUpdateOpacity:L.Marker.prototype._updateOpacity,_updateOpacity:function(){
        var t=0===this.options.opacity?0:1;this._originalUpdateOpacity(),this._label&&this._label.setOpacity(this.options.labelHasSemiTransparency?this.options.opacity:t)
    }
        
}