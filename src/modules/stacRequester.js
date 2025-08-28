export default function (url, fixed={}, limit=24, cds) {
    console.log(fixed)
    console.log(url)
    const stacParameters = []
    const mappingParameters =  {}
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
    
    function getRecords (route) {
        prepareRequest(route)
        return new Promise((successCallback, failureCallback) => {
            fetch(searchUrl,  {
                    headers: {'Content-Type': 'application/json'},
                    method: 'POST',
                    body: JSON.stringify(parameters)
            }).then(rep => rep.json())
            .then(json => {
                var resp = treatmentGeojson(json)
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
    function treatmentJson (json) {
    }
    function prepareRequest(newroute) {
        // initParameters()
        
        if (newroute.query.from) {
          var nb = parseInt(newroute.query.to) - parseInt(newroute.query.from) + 1
          parameters.limit = nb
          parameters.page = Math.round((parseInt(newroute.query.from) -1) / nb) + 1
        }
        if (newroute.query.box) {
          parameters.bbox = newroute.query.box.split(',')
        }
        if (newroute.query.start) {
          parameters.query['start_datetime'] = {gte: newroute.query.start + 'T00:00:00.000Z'}
        }
        if (newroute.query.end) {
          parameters.query['end_datetime']= {lte: newroute.query.end + 'T23:59:59.999Z'}
        }
        for (var key in defaultQuery) {
            console.log(key)
            parameters.query[key] = {in: defaultQuery[key]}
        }
        for(var name in mappingParameters) {
            if (newroute.query[name]){
                parameters.query[mappingParameters[name]] = {eq: newroute.query[name]}
            }
        }
    }
    function treatmentGeojson (data) {
      var metadatas = {}
      var list = []
      data.features.forEach( function (feature) {

        var metadata =  mapToGeonetwork(feature)
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
      return {list: list, pagination: pagination, aggregations: {}}
    }
    function mapToGeonetwork(feature) {
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
          properties.revisionDate = feature.properties.datetime
        }
        if (feature.properties['spaceborne:keywords']) {
          properties.keyword = feature.properties['spaceborne:keywords']
        }
        properties.links = {download:[]}
        for (var key in feature.assets) {
            if (feature.assets[key].roles.indexOf('overview') >=0) {
              properties.quicklook = {
                  src:  feature.assets[key].href,
                  title: ''
              }
              // properties.images = [[feature.assets[key].title, feature.assets[key].href, '']]
              // properties.thumbnail = feature.assets[key].href 
        
            } else if (feature.assets[key].roles.indexOf('data') >=0) {
              // feature.assets[key].renameProperty('href', 'url')
              // feature.assets[key].url = feature.assets[key].href
              // properties.download= [feature.assets[key]]
              properties.download.push({
                  url: feature.assets[key].href,
                  name: key,
                  type: 'download',
                  description: ''
              })
            }
        }
        if (feature.properties.endpoint_url) {
             var tab = feature.properties.endpoint_url.split('/')
             properties.links.download.push({
                  url: feature.properties.endpoint_url,
                  name: tab[tab.length - 1],
                  type: 'download',
                  description: ''
              })
        }
        for (var key in feature.properties) {
          if (['datetime', 'start_datetime', 'end_datetime', 'spaceborne:keywords'].indexOf(key) < 0) {
            var tab = key.split(':')
            var prop= tab.pop()
            properties[prop] = feature.properties[key]
        
          }
        }
        properties.exportLinks = {}
        var lk = feature.links.find(f => f.rel === 'self')
        if (lk) {
          properties.exportLinks.json = lk.href
        }
        
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