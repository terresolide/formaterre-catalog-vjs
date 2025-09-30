import {useClient} from '@/stores/client.js'
export function stacRequester (url, fixed={}, limit=24, cds) {
    const client = useClient()
    const stacParameters = []
    console.log(url)
    const mappingParameters =  {}
    for (var key in fixed) {
        mappingParameters[key.replace(':', '_')] = key
    }
    const parameters =  {page: 1, limit: limit, query: {}, sortBy:[{direction: 'desc',field: 'start_datetime' }]}
    const predefined =  {
         start: "start",
         end: "end",
         box: "box",
         maxRecords: "limit",
         index: "offset",
         page: "page"
       }
    const defaultQuery = fixed
    const searchUrl = url
    const count = 0
    const stacProperties = ['beam_ids', 'instrument', 'instrument_mode', 'orbit_state', 'platform', 'polarizations', 'relative_orbit']

    function getRecords (parent, route) {
        prepareRequest(route)
        return new Promise((successCallback, failureCallback) => {
            fetch(searchUrl,  {
                    headers: {'Content-Type': 'application/json'},
                    method: 'POST',
                    body: JSON.stringify(parameters)
            }).then(rep => rep.json())
            .then(json => {
                var resp = treatmentGeojson(parent, json)
                if (successCallback) {
                    successCallback(resp)
                }
            }).catch(err => {
                if (failureCallback) {
                    failureCallback(err)
                }
            })
        })
    }
    
    function prepareRequest( newroute) {
        // initParameters()
        
        if (newroute.query.from) {
          var nb = parseInt(newroute.query.to) - parseInt(newroute.query.from) + 1
          parameters.limit = nb
          parameters.page = Math.round((parseInt(newroute.query.from) -1) / nb) + 1
        }
        if (newroute.query.bbox) {
            var bbox = newroute.query.bbox.split(',')
            parameters.bbox = bbox.map(x => parseFloat(x))
        }
        if (newroute.query.start) {
          parameters.query['end_datetime'] = {gte: newroute.query.start + 'T00:00:00.000Z'}
        }
        if (newroute.query.end) {
          parameters.query['start_datetime']= {lte: newroute.query.end + 'T23:59:59.000Z'}
        }
        for (var key in defaultQuery) {
            // les filtres fixes, issus des metadonnées
            parameters.query[key] = {in: defaultQuery[key]}
        }
        for (var key in newroute.query) {
            if (['from', 'to', 'bbox', 'start', 'end'].indexOf(key) < 0) {
                parameters.query[key] = {in: newroute.query[key].split(',')}
            }
        }
        for(var name in mappingParameters) {
            if (newroute.query[name]){
                parameters.query[mappingParameters[name]] = {eq: newroute.query[name]}
            }
        }
    }
    function treatmentGeojson (parent, data) {
      console.log(parent.keyword)
      var metadatas = {}
      var list = []
      data.features.forEach( function (feature) {

        var metadata =  mapToGeonetwork(parent, feature)
        list.push(metadata)
       
      })
      
      var pagination = {
          count: list.length
      }
      if (data.context && data.context.matched) {
          pagination.total = parseInt(data.context.matched)
      }
     
      // if (data.context) {
      //   var properties = data.context
      // } else {
      //   var properties = {}
      // }
      //   properties.startIndex = (parameters.page - 1 ) * parameters.limit + 1
      // 
      // if (properties.matched) {
      //   properties.totalResults = parseInt(properties.matched)
      // }
      // if (!properties.limit) {
      //   properties.itemsPerPage = parameters.limit
      // }
      var aggregations = {}
      
      for (var key in fixed) {
          var category = fixed[key].map(x => {return {key: x, label: x, count: null}})
          aggregations[key] = {
              category: category,
              meta: {label: key.replace(':', '_'), type: 'dimension'}
          }
      }
      // idem pour summaries et/ou queryable
      return {list: list, pagination: pagination, aggregations: aggregations}
    }
    function mapToGeonetwork(parent, feature) {
        var properties = {}
        properties.fromStac = true
        properties.cds = cds
        properties.hierachyLevel = {
              icon:'file',
              name: 'dataset'
        }
        properties.geom = [feature.geometry]
        properties.uuid = feature.id
        properties.id = feature.id
        properties.links = {}
        if (feature.properties.identifier) {
          properties.identifier = feature.properties.identifier
          properties.title = feature.properties.identifier
        }
        if (feature.properties['start_datetime']) {
          properties.temporalExtents = [{
              start: {date: feature.properties['start_datetime'].substring(0,10)},
              end: {date: feature.properties['end_datetime'].substring(0,10)}
          }]
        }
        
        if (feature.properties.datetime) {
          properties.dateStamp = feature.properties.datetime
        }
        if (feature.properties['processing:datetime']) {
          properties.processingDate = feature.properties['processing:datetime']
        }
        if (feature.properties['spaceborne:keywords']) {
          properties.keyword = feature.properties['spaceborne:keywords']
        }
        if (feature.properties['raster:spatial_resolution']) {
            properties.resolution = [feature.properties['raster:spatial_resolution'] + 'm']
        }
       
        properties.links = {download:[]}
        for (var key in feature.assets) {
            if (feature.assets[key].roles.indexOf('overview') >=0) {
              properties.quicklook = {
                  src:  feature.assets[key].href,
                  title: ''
              }
              properties.images = [[feature.assets[key].title, feature.assets[key].href, '']]
              // properties.thumbnail = feature.assets[key].href 
        
            } else if (feature.assets[key].roles.indexOf('data') >=0) {
              // feature.assets[key].renameProperty('href', 'url')
              // feature.assets[key].url = feature.assets[key].href
              // properties.download= [feature.assets[key]]
              properties.links.download.push({
                  url: feature.assets[key].href,
                  name: key,
                  type: 'download',
                  description: '',
                  access: parent.links.api.STAC.access
              })
            }
        }
        if (feature.properties.endpoint_url) {
             var tab = feature.properties.endpoint_url.split('/')
             properties.links.download.push({
                  url: feature.properties.endpoint_url,
                  name: tab[tab.length - 1],
                  type: 'download',
                  description: '',
                  access: parent.links.api.STAC.access
              })
        }
        for (var key in feature.properties) {
          // if (['datetime', 'start_datetime', 'end_datetime'].indexOf(key) < 0) {
            if (['identifier', 'instrument', 'subtitle', 'platform', 'product:type', 'grid:code'].indexOf(key) >= 0) {
                properties[key] = feature.properties[key]
            } else if (key.indexOf('sar:') >= 0 || key.indexOf('sat:') >= 0) {
                 var tab = key.split(':')
                 var prop= tab.pop()
                 properties[prop] = feature.properties[key]
            }
          // }
        }
        properties.exportLinks = {}
        var lk = feature.links.find(f => f.rel === 'self')
        if (lk) {
          properties.exportLinks.json = lk.href
        }
        properties.crs = parent.crs
        properties.contacts = parent.contacts
        properties.legalConstraints = parent.legalConstraints
        properties.lineage = parent.lineage
        properties.representation = parent.representation
        properties.status = parent.status
        properties.dataCenter = parent.dataCenter
        properties.keyword = []
        parent.keyword.forEach(function (list) {
            if (list.key !== 'th_regions') {
                properties.keyword.push(list)
            }
        })
      
        
        return properties
    }
    // function requestApi () {
    //     if (this.count > 2) {
    //       return
    //     }
    //     
    //     this.$http.post(
    //       this.searchUrl,
    //       this.parameters,
    //      {headers: {'Content-Type': 'application/json'}}
    //     ).then(
    //       resp => { this.treatmentGeojson (resp.body, this.depth)},
    //       resp => {
    //         switch (resp.status) {
    //     
    //         }
    //         if (this.searchUrl !== this.$store.state.proxyGeodes + '/items') {
    //           this.searchUrl = this.$store.state.proxyGeodes + '/items'
    //           this.requestApi()
    //         }
    //       }
    //     )
    // 
    // }
    function extractDescribeParameters(json) {
      for(var i in json.links) {
        if (json.links[i].rel === 'root') {
          this.searchUrl = json.links[i].href + '/search'
        }
      }
      this.defaultQuery = {
        dataset: {in: [json.id]}
      }
      json.summaries = {'spaceborne:orbitDirection': ['Ascending', 'Descending']}
      if (json.summaries) {
        // extraction des éléments de recherche
        for (var key in json.summaries) {
          var tab = key.split(':')
          var name = tab.pop()
          var obj = {name: name, title: name, label: name}
          // range 
          if (json.summaries[key].minimum ) {
            obj.min = json.summaries[key].minimum
          }
          if (json.summaries[key].maximum) {
            obj.maximum = json.summaries[key].maximum
          }
          if (Array.isArray(json.summaries[key])) {
            if (json.summaries[key].length <2) {
              continue
            }
            obj.options = json.summaries[key]
          }
          this.stacParameters.push(obj)
          this.mappingParameters[name] = key

        }
      }
      this.$emit('parametersChange', {api: this.describe, parameters:this.stacParameters, mapping: this.predefined, fixed: []})
      this.getRecords(this.$route)
    }
    return {getRecords: getRecords}
}