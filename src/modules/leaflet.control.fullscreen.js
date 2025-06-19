/**
 * 
 */

 L.Control.Fullscreen = L.Control.extend({
    options: {
        position: 'topright',
    },
    _large: null,
    _nodeSmall: null,
    _nodeLarge: null,
    _mapContainer: null,
    _lang: 'en',
    _removeHeight: 400,
    _fullscreen: false,
    _mouseWheel: false,
    _translate: {
      'en': {
        'fullscreen': 'Enlarge',
        'reduce': 'Reduce'
      },
      'fr': {
        'fullscreen': 'Agrandir',
        'reduce': 'Reduire'
      }
    },
    initialize: function(idLarge, options){
        this._large = idLarge
        if (options.lang) {
          this.setLang(options.lang)
        }
        if (options.hasOwnProperty('removeHeight') && options.removeHeight !== null) {
         this.setRemoveHeight(options.removeHeight) 
        }
        if (options.mouseWheel) {
          this._mouseWheel = options.mouseWheel
        }
    },
    setLang (lang) {
      this._lang = (['en', 'fr'].indexOf(lang) >=0 ? lang : 'en')
    },
    setRemoveHeight (height) {
      this._removeHeight = height
    },
    onAdd : function(map){
        this._nodeSmall = map._container.parentNode
        this._nodeLarge = document.querySelector('#' + this._large)
        if (!this._nodeLarge) {
          return
        }
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control lfh-control-fullscreen');
        var a = L.DomUtil.create('a', 'fa fa-expand')
        a.setAttribute('title', this._translate[this._lang]['fullscreen'])
        container.appendChild(a)
        var self = this
        a.onclick = function(e){
           self._fullscreen = !self._fullscreen
           this.setAttribute('class', self._fullscreen ? 'fa fa-compress' : 'fa fa-expand')
           if (self._fullscreen) {
             self._enlarge(e)
           } else {
             self._reduce(e)
           }
        }
        return container;
    },
    _enlarge : function (e) {
      this._nodeLarge.appendChild(this._map._container)
      this._nodeLarge.style.display = 'block'
      var height = window.innerHeight - this._removeHeight
      this._container.querySelector('a').setAttribute('title', this._translate[this._lang]['reduce'])
      this._map._container.style.height = height + 'px'
      this._map._container.className = this._map._container.className.replace('mtdt-small', 'mtdt-fullscreen')
      this._map.setMinZoom(2)
      if (this._mouseWheel) {
        this._map.scrollWheelZoom.enable()
      }
      this._map.invalidateSize()
      this._emitChange()
      e.stopPropagation()
    },
    _reduce : function (e) {
      this._nodeLarge.style.display = 'none'
      this._nodeSmall.appendChild(this._map._container)
      this._map.setMinZoom(1)
      this._map._container.className = this._map._container.className.replace('mtdt-fullscreen', 'mtdt-small')
      this._map.invalidateSize()
      this._map.scrollWheelZoom.disable()
      this._emitChange()
      e.stopPropagation()
    },
    _emitChange : function () {
      var event = new CustomEvent('mapNodeChange')
      document.dispatchEvent(event)
    }
})
