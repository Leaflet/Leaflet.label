L.Label = L.Popup.extend({
	options: {
		autoPan: false,
		className: '',
		closePopupOnClick: false,
		noHide: false,
		offset: new L.Point(12, -15) // 6 (width of the label triangle) + 6 (padding)
	},

	onAdd: function (map) {
		this._map = map;

		if (!this._container) {
			this._initLayout();
		}
		this._updateContent();

		var animFade = map.options.fadeAnimation;

		if (animFade) {
			L.DomUtil.setOpacity(this._container, 0);
		}
		map._panes.popupPane.appendChild(this._container);

		map.on('viewreset', this._updatePosition, this);

		if (L.Browser.any3d) {
			map.on('zoomanim', this._zoomAnimation, this);
		}

		this._update();

		if (animFade) {
			L.DomUtil.setOpacity(this._container, 1);
		}
	},

	close: function () {
		var map = this._map;

		if (map) {
			map._label = null;

			map.removeLayer(this);
		}
	},

	_initLayout: function () {
		this._container = L.DomUtil.create('div', 'leaflet-label ' + this.options.className + ' leaflet-zoom-animated');
	},

	_updateContent: function () {
		if (!this._content) { return; }

		if (typeof this._content === 'string') {
			this._container.innerHTML = this._content;
		}
	},

	_updateLayout: function (side) {
		// Feature detection: for IE8 and earlier we have to remove previously created 'ie_after' divs
		if(typeof getComputedStyle === 'undefined') {
			var ie_afters = this._container.getElementsByTagName('div');
			for (var i = 0; i < ie_afters.length; i++) {
				ie_afters[i].parentNode.removeChild(ie_afters[i]);
			}
		}
		this._container.className = this._container.className.replace( /(?:^|\s)(no-after|no-before)(?!\S)/g , '' );
		if (side === 'to_right') {
			this._container.className += ' no-after';
		} else {
			this._container.className += ' no-before';
			// Feature detection: IE8 and earlier don't redraw :before and :after pseudo elements so we add a div with identical css
			if(typeof getComputedStyle === 'undefined') {
				L.DomUtil.create('div', 'ie_after', this._container);
			}
		}
	},

	_updatePosition: function () {
		var pos = this._map.latLngToLayerPoint(this._latlng);

		this._setPosition(pos);
	},

	_setPosition: function (pos) {
		var pixelCenter = this._map.latLngToLayerPoint(this._map.getCenter()), flipX;
		if (pos.x <= pixelCenter.x) {
			this._updateLayout('to_right');
			pos = pos.add(this.options.offset);
		} else {
			this._updateLayout('to_left');
			// Feature detection: IE8 and earlier do not support getComputedStyle
			if(typeof getComputedStyle === 'undefined') {
				flipX = new L.Point(-this.options.offset.x - this._container.offsetWidth, this.options.offset.y);
			} else {
				flipX = new L.Point(-22 - this.options.offset.x - (getComputedStyle(this._container).getPropertyValue('width').replace('px','')), this.options.offset.y);
			};
			pos = pos.add(flipX);
		}
		L.DomUtil.setPosition(this._container, pos);
	},

	_zoomAnimation: function (opt) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center);

		this._setPosition(pos);
	}
});