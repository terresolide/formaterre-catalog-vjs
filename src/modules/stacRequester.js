export default function (url, limit, fixed) {
    console.log(url)
    const stacParameters = []
    const mappingParameters =  {}
    const parameters =  {page: 1, limit: 8, query: {dataset: {in: ['FLATSIM_BALKANS_INTERFEROGRAM_PUBLIC']}}, sortBy:[{direction: 'desc',field: 'start_datetime' }]}
    const predefined =  {
         start: "start",
         end: "end",
         box: "box",
         maxRecords: "limit",
         index: "offset",
         page: "page"
       }
    const defaultQuery = {}
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
                if (successCallback) {
                    successCallback(json)
                }
            }).catch(err => {
                if (failureCallback) {
                    failureCallback(err)
                }
            })
        })
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
        for(var name in mappingParameters) {
            if (newroute.query[name]){
                parameters.query[this.mappingParameters[name]] = {eq: newroute.query[name]}
            }
        }
    }
    function treatmentGeojson (data, depth) {
      var metadatas = {}
      var self = this
      var features = []
      data.features.forEach( function (feature) {
        if (!feature.id) {
          feature.id = feature.properties.productIdentifier
        }
        feature.properties.id = feature.id
        metadatas[feature.id] =  self.mapToGeonetwork(feature)
        features.push({type: feature.type, id: feature.id, geometry: feature.geometry})
       
      })
      if (data.features.length === 0) {
        metadatas = {}
      }
      if (data.context) {
        var properties = data.context
      } else {
        var properties = {}
      }
        properties.startIndex = (this.parameters.page - 1 ) * this.parameters.limit + 1
      
      if (properties.matched) {
        properties.totalResults = parseInt(properties.matched)
      }
      if (!properties.limit) {
        properties.itemsPerPage = this.parameters.limit
      }
    
    }
    function mapToGeonetwork(feature) {
      var properties = {}
      properties.fromOs = true
      properties.cds = this.cds
      properties.type = 'dataset'
      
      if (feature.properties.identifier) {
        properties.identifier = feature.properties.identifier
        properties.title = feature.properties.identifier
      }
      if (feature.properties['temporal:startDate']) {
        properties.tempExtentBegin = feature.properties['temporal:startDate']
      }
      if (feature.properties['temporal:endDate']) {
        properties.tempExtentEnd = feature.properties['temporal:endDate']
      }
      if (feature.properties.datetime) {
        properties.revisionDate = feature.properties.datetime
      }
      if (feature.properties['spaceborne:keywords']) {
        properties.keyword = feature.properties['spaceborne:keywords']
      }
      for (var key in feature.assets) {
          if (feature.assets[key].roles.indexOf('overview') >=0) {
            
            properties.images = [[feature.assets[key].title, feature.assets[key].href, '']]
            properties.thumbnail = feature.assets[key].href 

          } else if (feature.assets[key].roles.indexOf('data') >=0) {
            // feature.assets[key].renameProperty('href', 'url')
            feature.assets[key].url = feature.assets[key].href
            properties.download= [feature.assets[key]]
          }
      }
      for (var key in feature.properties) {
        if (['datetime', 'temporal:starDate', 'temporal:endDate', 'spaceborne:keywords'].indexOf(key) < 0) {
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
    function requestApi () {
      if (this.count > 2) {
        return
      }

      this.$http.post(
        this.searchUrl,
        this.parameters,
       {headers: {'Content-Type': 'application/json'}}
      ).then(
        resp => { this.treatmentGeojson (resp.body, this.depth)},
        resp => {
          switch (resp.status) {

          }
          if (this.searchUrl !== this.$store.state.proxyGeodes + '/items') {
            this.searchUrl = this.$store.state.proxyGeodes + '/items'
            this.requestApi()
          }
        }
      )

    }
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