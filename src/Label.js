L.Label = L.Popup.extend({

	includes: L.Mixin.Events,

	options: {
		autoPan: false,
		className: '',
		clickable: false,
		closePopupOnClick: false,
		noHide: false,
		offset: new L.Point(12, -15), // 6 (width of the label triangle) + 6 (padding)
		opacity: 1,
		flip: false
	},

	onAdd: function (map) {
		this._map = map;

		this._pane = this._source instanceof L.Marker ? map._panes.markerPane : map._panes.popupPane;

		if (!this._container) {
			this._initLayout();
		}
		this._updateContent();

		this._pane.appendChild(this._container);

		map.on('viewreset', this._updatePosition, this);

		if (this._animated) {
			map.on('zoomanim', this._zoomAnimation, this);
		}

		if (L.Browser.touch && !this.options.noHide) {
			L.DomEvent.on(this._container, 'click', this.close, this);
		}

		this._initInteraction();

		this._update();

		this.setOpacity(this.options.opacity);
	},

	onRemove: function (map) {
		this._pane.removeChild(this._container);

		map.off({
			viewreset: this._updatePosition,
			zoomanim: this._zoomAnimation
		}, this);

		this._removeInteraction();

		this._map = null;
	},

	close: function () {
		var map = this._map;

		if (map) {
			if (L.Browser.touch && !this.options.noHide) {
				L.DomEvent.off(this._container, 'click', this.close);
			}

			map.removeLayer(this);
		}
	},

	updateZIndex: function (zIndex) {
		this._zIndex = zIndex;

		if (this._container && this._zIndex) {
			this._container.style.zIndex = zIndex;
		}
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		if (this._container) {
			L.DomUtil.setOpacity(this._container, opacity);
		}
	},

	_initLayout: function () {
		this._container = L.DomUtil.create('div', 'leaflet-label ' + this.options.className + ' leaflet-zoom-animated');
		this.updateZIndex(this._zIndex);
	},

	_updateContent: function () {
		if (!this._content) { return; }

		if (typeof this._content === 'string') {
			this._container.innerHTML = this._content;
		}
	},

	_updateLayout: function () {
		// Do nothing
	},

	_updatePosition: function () {
		var pos = this._map.latLngToLayerPoint(this._latlng);

		this._setPosition(pos);
	},

	_setPosition: function (pos) {
		if (!this.options.flip) {
			pos = pos.add(this.options.offset);
		} else {
			var pixelCenter = this._map.latLngToLayerPoint(this._map.getCenter()), flipX;
				// Feature detection: IE8 and earlier do not support getComputedStyle
				if(typeof getComputedStyle === 'undefined') {
					flipX = new L.Point(
						-this.options.offset.x - this._container.offsetWidth,
						this.options.offset.y
					);
				} else {
					var computedStyle = getComputedStyle(this._container);
					var widthProperty = computedStyle.getPropertyValue('width');
					var width = widthProperty.replace('px','');
					flipX = new L.Point(-22 - this.options.offset.x - width, this.options.offset.y)
				};
				pos = pos.add(flipX);
		}

		L.DomUtil.setPosition(this._container, pos);
	},

	_zoomAnimation: function (opt) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center);

		this._setPosition(pos);
	},

	_initInteraction: function () {
		if (!this.options.clickable) { return; }

		var container = this._container,
			events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu'];

		L.DomUtil.addClass(container, 'leaflet-clickable');
		L.DomEvent.on(container, 'click', this._onMouseClick, this);

		for (var i = 0; i < events.length; i++) {
			L.DomEvent.on(container, events[i], this._fireMouseEvent, this);
		}
	},

	_removeInteraction: function () {
		if (!this.options.clickable) { return; }

		var container = this._container,
			events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu'];

		L.DomUtil.removeClass(container, 'leaflet-clickable');
		L.DomEvent.off(container, 'click', this._onMouseClick, this);

		for (var i = 0; i < events.length; i++) {
			L.DomEvent.off(container, events[i], this._fireMouseEvent, this);
		}
	},

	_onMouseClick: function (e) {
		if (this.hasEventListeners(e.type)) {
			L.DomEvent.stopPropagation(e);
		}

		this.fire(e.type, {
			originalEvent: e
		});
	},

	_fireMouseEvent: function (e) {
		this.fire(e.type, {
			originalEvent: e
		});

		// TODO proper custom event propagation
		// this line will always be called if marker is in a FeatureGroup
		if (e.type === 'contextmenu' && this.hasEventListeners(e.type)) {
			L.DomEvent.preventDefault(e);
		}
		if (e.type !== 'mousedown') {
			L.DomEvent.stopPropagation(e);
		} else {
			L.DomEvent.preventDefault(e);
		}
	}
});