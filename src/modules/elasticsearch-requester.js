/**
 * use geonetwork elasticsearch service 

 * 
 */



export default {
  name: 'ElasticsearchRequester',
  props: {
    group: null
  },
  _srv: null,
  _api: null,
  _headers: {'Accept': 'application'}
  initialize (srv, lang) {
     this._srv = srv
     this._api = 
  },
  data() {
    return {
      srv: null,
      api: null,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': this.$store.state.lang === 'fr' ? 'fre,eng': 'eng,fre'
      },
      first: true,
      dimensions: [],
      parameters: {},
      changePageListener:null,
      temporalChangedListener: null,
      spatialChangedListener: null,
      dimensionChangedListener: null,
      textChangedListener: null,
      selectChangedListener: null,
      closeMetadataListener: null,
      // listen a global reset event
      resetListener: null,
      facet: [],
      type: 'geonetwork',
      credentials: {}
     }
  },
  created () {
    if (this.$store.state.geonetwork) {
       this.srv = this.$store.state.geonetwork +  'srv/api/search/records/_search?bucket=metadata'
       // this.srv = this.$store.state.geonetwork +  'srv/fre/'
    }
    this.getRecords(this.$route)

  },
  destroyed () {
//     document.removeEventListener('fmt:pageChangedEvent', this.pageChangedListener);

  },
  mounted () {

  },
  methods: {
    initParameters () {
          this.parameters = {
          from: 0,
          size: this.$store.state.nbRecord,
          _source: {
            includes: this.$store.state.includes
          },
          sort: [{changeDate: "desc"}, {popularity: "desc"}],
          query: {
            bool: {
                filter: [{
                    term: {isTemplate: 'n'}
                },  {
                    terms: {resourceType: ['dataset', 'series']}
                }],
                must_not: {
                    exists: {field: 'parentUuid'}
                }
            }
          }
         }
        
       
    }, 
    getRecords (event) {
      
//       if (this.$store.state.metadata && this.first) {
//         this.first = false
//         this.searchSimpleMetadata()
//         return
//       }
      this.$store.commit('searchingChange', true)
      // trigger search event like breadcrumb
//       if (event.detail && typeof event.detail.depth == 'number') {
//         var depth = event.detail.depth
//       } else {
//         var depth = this.depth
//       }
//       var e = new CustomEvent("aerisSearchEvent", { detail: {depth: depth}});
//       document.dispatchEvent(e);
     
//       if (e.detail.api) {
//         this.api = e.detail.api
//         delete e.detail.api
//         this.type = 'opensearch'
        
 //     } else {
        this.type = 'geonetwork'
//      }

      this.prepareRequest(event)
      this.requestApi(event)
    },
//     prepareRequest (e) {
//       switch (this.type) {
//       case 'geonetwork':
//         this.prepareRequestGeonetwork(e)
//         break;
//       case 'opensearch':
//         this.prepareRequestOpensearch(e)
//         break
//       }
//     },
    // createGeometry (bbox) {
    //   var split = bbox.split(',')
    //   var north = split[3]
    //   var south = split[1]
    //   var east = split[2]
    //   var west = split[0]
    //   var box = 'POLYGON((' + west + '+' + north + ','
    //     box += east + '+' + north + ',';
    //     box += east + '+' + south + ',';
    //     box += west + '+' + south + ',';
    //     box += west + '+' + north + '))';
    //   return box;
    // },
    prepareRequest(route) {
      
      this.initParameters()
      
      if (route.name === 'Metadata') {
        var aggregations = Object.assign(this.$store.state.aggregations.step2)
       this.parameters.query.bool.filter.push({ term: {parentUuid: route.params.uuid}})
       delete this.parameters.query.bool.must_not
      } else {
       var aggregations = Object.assign(this.$store.state.aggregations.step1)
      }
      this.parameters.aggregations = aggregations
      if (route.query.from) {
        this.parameters.from = parseInt(route.query.from) - 1
      }
      if (route.query.to) {
        this.parameters.size = parseInt(route.query.to) - this.parameters.from
      }
      if (route.query.sortBy) {
        // this.parameters.sort = [{changeDate: 'desc'}, {popularity: desc}]
        if (route.query.sortBy === 'popularity') {
          this.parameters.sort.reverse()
        } 
        // else if (route.query.sortBy === 'title') {
        //   this.parameters.sort.unshift({'resourceTitleObject.fre': {order: 'asc'}})
        // }
      }
      if (route.query.start || route.query.end) {
        this.parameters.query.bool.filter.push({
          range: {
           resourceTemporalExtentDateRange: {
              from: route.query.start ? route.query.start : null,
              to: route.query.end ? route.query.end : null,
              format: 'yyyy-MM-dd'
            }
          }
        })
      }
      if (route.query.bbox) {
        
        var tab = route.query.bbox.split(',')
        if (tab.length === 4) {
          this.parameters.query.bool.filter.push({
            geo_bounding_box: {
              location: {
                bottom_left: {
                  lat: parseFloat(tab[1]),
                  lon: parseFloat(tab[0])
                },
                top_right: {
                  lat: parseFloat(tab[3]),
                  lon: parseFloat(tab[2])
                }
              }
            }
          })
        }
      }
      if (route.query.any) {
        var words = route.query.any.trim().split(/(\s+)/)
        words = words.filter(function (w) { return w.trim().length > 0;})
        var any = words.join(' AND ')
        var term = {query_string: {
          fields: ["resourceTitleObject.*", "resourceAbstractObject.*", "lineageObject.*", "tag", "uuid", "resourceIdentifier"],
          query: any
        }}
        if (!this.parameters.query.bool.must) {
          this.parameters.query.bool.must = []
        }
        this.parameters.query.bool.must.push(term)
      }
     
      if (this.group) {
        this.parameters.query.bool.filter.push({term: {groupOwner: this.group }})
        delete aggregations['groupOwner']
      }
      
      for(var key in aggregations) {
        if (route.query [key]) {
          if (aggregations[key].meta.type === 'dimension') {
            var terms = {}
            var q = decodeURIComponent(route.query[key])
            var values = q.split('+or+')
            terms[aggregations[key].terms.field] = values
            this.parameters.query.bool.filter.push({terms: terms})
          } else {
            var term = {}
            term[aggregations[key].terms.field] = decodeURIComponent(route.query[key])
            this.parameters.query.bool.filter.push({term: term})
          }
        }
      }
      this.aggregations = aggregations
    },
    searchSimpleMetadata() {
      this.$http.get(this.$store.state.metadata).then(
          response => {  
            var data = response.body
            var uuid = data['geonet:info'].uuid
            var meta = this.$gn.treatmentMetadata(data, uuid);
            // var feature = self.$gn.extractBbox(data.geoBox, uuid)
            meta.appRoot = true
            var event = new CustomEvent('fmt:metadataEvent', {detail: {meta:meta, depth: 0 } })
            document.dispatchEvent(event)
         }
        )
    },
    requestApi (route) {
      if (!this.srv) {
        return
      }
      var headers =  {
          'Accept': 'application/json'
       }

      var self = this
     
      this.$http.post(this.srv, this.parameters, {headers: headers}).then(
        response => { 
          console.log(response.body)
          this.treatmentElasticsearch(response.body, 0)
        },
        response => { this.treatmentError(response, url); })
    },
    treatmentError (response, url) {
      switch(response.status) {
      case 0:
        this.$store.commit('setError', this.$i18n.t('SERVICE_UNAVAILABLE'))
        break;
      case 403:
        this.$store.commit('setError', 'SERVER RESPONSE FOR ' + url + ' : ACCESS DENIED')
        break;
      case 404:
        this.$store.commit('setError', 'SERVER RESPONSE FOR ' + url + ' : PAGE NOT FOUND')
        break;
      default:
        this.$store.commit('setError', 'UNKNOWN ERROR FOR ' + url)
      }
      this.$store.commit('searchingChange', false)
    },
    treatmentElasticsearch (data, depth) {
       if (this.parameters.from === 0 && data.hits && data.hits.hits && data.hits.hits.length === 0) {
        this.$store.commit('searchingChange', false)
        return
       }
       this.treatmentAggregations(data.aggregations)
       var metadatas = {}
       var features = []
       var self = this
       if (data.hits && data.hits.hits) {
         data.hits.hits.forEach( function (meta, index) {
             var uuid = meta._id
             var feature = {
                type: 'Feature',
                id: uuid,
                geometry: meta._source.geom
              }
              if (feature) {
                    if (feature.geometry[0]) {
                      feature.geometry = feature.geometry[0]
                    }
                    features.push(feature)
              }
             metadatas[uuid] = self.$gn.treatmentMetaElasticsearch(meta ,uuid)
           })
       }
       data.summary = {
        from: this.parameters.from + 1,
        to: this.parameters.from + features.length,
        total: data.hits.total.value,
        dimension: []
       }
       
      data.metadata = metadatas
      data.type = 'geonetwork'
      data.features = {
        type: 'FeatureCollection',
        features: features
      }
      delete data.hits
      delete data.aggregations
      this.fill(data, depth)
      this.$store.commit('searchingChange', false)
    },
    treatmentAggregations (aggs) {
      var aggregations = []
      var promises = []
      var aggregations = []
      for(var key in aggs) {
        if (aggs[key].buckets.length > 0) {
          aggs[key].key = key
          aggregations.push(aggs[key]) 
        }
      }
      aggregations.sort(function (a,b) { return a.meta.sort - b.meta.sort})
      for(var key in aggregations) {
        promises.push(this.prepareAggregation(aggregations[key]))
      }
      Promise.all(promises)
      .then((values) => {
        var data = { dimension: values}
        data.depth = this.depth
        var event = new CustomEvent('fmt:dimensionEvent', {detail:  data})
        document.dispatchEvent(event)
      })

    
    },
    translate(thesaurus, uris) {
      var self = this
      return new Promise(function (resolve, reject) {
        var id = uris.join(',')
        var lang = self.$store.state.lang === 'fr' ? 'fre' : 'eng'
        var url = self.$store.state.geonetwork + 'srv/api/registries/vocabularies/keyword?id=' + encodeURIComponent(id) + '&thesaurus=' + thesaurus + '&lang=' + lang
        self.$http.get(url, {headers: {'accept': 'application/json'}})
        .then(resp => {
          resolve(resp.body)
        })
      })
      
    },
    prepareAggregation(agg) {
      var self = this
      return new Promise(function (resolve, reject) {
        var label = agg.key
        var lang = self.$store.state.lang
        if (agg.meta && agg.meta.label) {
          label = agg.meta.label[lang] ? agg.meta.label[lang] : agg.meta.label
        }
        var aggStore = self.aggregations[agg.key]
        var tab = aggStore.terms.field.split('.')
        var isKey = tab.length > 1 && tab[1] === 'key'
        var aggregation = {
          '@name': agg.key,
          type: isKey ? 'associative' : 'simple',
          label: label,
          meta: agg.meta,
          category: []
        }
        
        var type = (agg.meta && agg.meta.type) || 'dimension'
        
        var buckets = agg.buckets
        var gnGroups = self.$gn.groups
        var lang = self.$store.state.lang
        var toTranslate = []
        var thesaurus = agg.meta.thesaurus || null
      

        buckets.forEach(function (item, index) {

          // buckets[index].keys = keys
          buckets[index]['@value'] = item.key
          if (type === 'dimension') {
            if (agg.key === 'groupOwner') {
              var label = gnGroups[item.key].label[lang]
            } else {
              var label = item.key
            }
            aggregation.category.push({
              '@name': label,
              '@label': label,
              '@value': item.key,
              '@count': item.doc_count
            })
          } else if (type === 'select' && !isKey ) {
            console.log(label)
            console.log(item)
            aggregation.category.push( item['@value'] )
          } else {
            var keys = item.key.split('^')
            var uri = keys.pop()
            toTranslate.push(uri)
            buckets[index].parent = keys.join('^')
            buckets[index].length = keys.length
            buckets[index]['@name'] = item.key
            buckets[index]['@label'] = item.key
            buckets[index]['@value'] = uri
            buckets[index]['@count'] = item.doc_count
            delete item.doc_count
          }
          
        })
        // translate

        if (!isKey) {
          resolve(aggregation)
          return
        }
        self.translate(thesaurus, toTranslate)
        .then(translated => {
          buckets.forEach(function (item, index) {
            if (translated[item['@value']]) {
              if (translated[item['@value']].label) {
                buckets[index]['@label'] = translated[item['@value']].label
              } else {
                buckets[index]['@label'] = translated[item['@value']]
              }
            }
          })
          if (type === 'select') {
            var category = []
            buckets.forEach(function(item) {
              category.push({ '@value': item['@value'], '@label': item['@label'] })
            })
          } else {
            const arrayToTree = (arr, parent = '') =>
            arr.filter(item => item.parent === parent)
            .map(child => { 
              var category = arrayToTree(arr, child.key)
              if (category.length > 0) {
                child.category = category
              }
              return child
            });
            var category = arrayToTree(buckets)
          }
          aggregation.category = category
          resolve(aggregation)
        })
        
      })
    },
    fill (data, depth) {
      data.depth = this.depth
      var event = new CustomEvent('fmt:metadataListEvent', {detail:  data})
      document.dispatchEvent(event)
    }
  }
}

