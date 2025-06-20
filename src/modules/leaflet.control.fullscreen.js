/**
 * Fullscreen control
 */

 L.Control.Fullscreen = L.Control.extend({
    options: {
        position: 'topright',
    },
    _iconCompress: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 320c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0z"/></svg>',
    _iconExpand: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z"/></svg>',
    _large: null,
    _nodeSmall: null,
    _nodeLarge: null,
    _mapContainer: null,
    _lang: 'en',
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
        if (options.mouseWheel) {
          this._mouseWheel = options.mouseWheel
        }
    },
    setLang (lang) {
      this._lang = (['en', 'fr'].indexOf(lang) >=0 ? lang : 'en')
    },
    onAdd : function(map){
        this._nodeSmall = map._container.parentNode
        this._nodeLarge = document.querySelector('#' + this._large)
        if (!this._nodeLarge) {
          return
        }
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control lfh-control-fullscreen');
        var a = L.DomUtil.create('a')
        a.innerHTML = this._iconExpand
        a.setAttribute('title', this._translate[this._lang]['fullscreen'])
        container.appendChild(a)
        var self = this
        a.onclick = function(e){
           self._fullscreen = !self._fullscreen
           this.innerHTML = self._fullscreen ? self._iconCompress : self._iconExpand
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
      this._map._container.className = this._map._container.className.replace('mtdt-small', 'mtdt-fullscreen')
      if (this._mouseWheel) {
        this._map.scrollWheelZoom.enable()
      }
      e.stopPropagation()
    },
    _reduce : function (e) {
      this._nodeLarge.style.display = 'none'
      this._nodeSmall.appendChild(this._map._container)
      this._map.setMinZoom(1)
      this._map._container.className = this._map._container.className.replace('mtdt-fullscreen', 'mtdt-small')
      this._map.scrollWheelZoom.disable()
      e.stopPropagation()
    }
})
