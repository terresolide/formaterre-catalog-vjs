/**
 * 
 */

 L.Control.Legend= L.Control.extend({
    options: {
        position: 'topright',
    },
    _legend: null,
    _legends: null,
    _imgNode: null,
    _lang: 'en',
    _toId: null,
    _translate: {
      'en': {
        'legend': 'Legend'
      },
      'fr': {
        'legend': 'Légende'
      }
    },
    initialize: function(lang, toId){
        this.setLang(lang)
        this._legends = new Map()
        this._toId = toId
    },
    setLang (lang) {
      this._lang = (['en', 'fr'].indexOf(lang) >=0 ? lang : 'en')
    },
    addLegend (uuid, layerId, url) {
       console.log(uuid)
      // this._legend = url
      if (!this._legends.has(uuid)) {
        this._legends.set(uuid, new Map())
      } 
      if (!this._legends.get(uuid).has(layerId)) {
        this._legends.get(uuid).set(layerId, url)
        this._addLegendToDom( layerId, url)
      }
      this.currentUuid = uuid
    },
    removeLegend(layerId) {
      // search legend in current uuid
      this._removeLegendFromDom(layerId)
      if (this._legends.has(this.currentUuid)) {
        this._legends.get(this.currentUuid).delete(layerId)
      }
    },
    back (uuid) {
      var keys = this._legends.keys()
      var last = null
      var previous = null
      //search last uuid with legend and previous uuid with legend
      for(var key of keys) {
        previous = last
        last = key
      }
      if (last) {
        // remove current legend in dom
        for(var layerId of this._legends.get(last).keys()) {
          this._removeLegendFromDom(layerId)
        }
        this._legends.delete(last)
      }
      this.currentUuid = uuid
      if (previous && previous === uuid) {
        for(var [layerId, url] of this._legends.get(previous)){
          this._addLegendToDom(layerId, url)
        }
      }
    },
   
    removeAll () {
      this._legends.forEach(function (legend) {
        legend.clear()
      })
      this._legends.clear() 
      this._container.querySelectorAll('img').forEach(function (img) {
        img.parentNode.removeChild(img)
      })
      
    },
    onAdd : function(map){
        
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control lfh-control-legend hidden');
        var a = L.DomUtil.create('a', 'icon-palette')
        a.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3L344 320c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>'
        a.setAttribute('title', this._translate[this._lang]['legend'])
        container.appendChild(a)
        container.onclick = function(){
          if (this.className.indexOf('expand') >= 0){
            this.classList.remove('expand')
          }else {
            this.classList.add('expand')
          }
        }
        return container;
    },
    _removeLegendFromDom(layerId) {
      var node = this._container.querySelector('#' + this._toId(layerId))
      if (node) {
        node.parentNode.removeChild(node)
      }
      if (this._container.childNodes.length < 2) {
        this._container.classList.add('hidden')
      }
    },
    _addLegendToDom (layerId, url) {
      var img = document.createElement('img')
      img.src = url
      img.id = this._toId(layerId)
      this._container.appendChild(img)
       if (this._container.childNodes.length >= 2) {
        this._container.classList.remove('hidden')
      }
    }
})
