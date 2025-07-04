import { defineStore } from 'pinia'
import {useConfig} from './config'
import {useCatalog} from './catalog'

export const useElasticsearch = defineStore('elasticsearch', {
    state: () => ({
      catalogId: null,
      uuid: null,
      groupOwner: null,
      step: 'step1',
      reset: null,
      aggregations: {
        step1: {
          groupOwner: {
            terms: {
              field: 'groupOwner',
              order: {_key: 'asc'},
              size: 50
            },
            meta: {
              type: 'dimension',
              icon: 'fa-solid fa-database',
              label: {fr: 'Catalogue', en: 'Catalog'},
              sort: 0
            }
          },
          discipline: {
            terms:{
              field: 'th_formater-discipline_tree.key',
              order: {_key: 'asc'},
              size: 30
            },
            meta: {
              type: 'facet',
              thesaurus: 'formater-discipline',
              icon: 'fa-solid fa-graduation-cap',
              label: 'Discipline',
              sort: 2
            }
          },
          foi: {
            terms: {
              field: 'th_formater-foi-gn_tree.key',
              order: {_key: 'asc'},
              size: 10
            },
            meta: {
              type: 'facet',
              thesaurus: 'formater-foi-gn',
              icon: 'fa-solid fa-location-dot',
              label: {fr: "Objet d'intérêt", en: "Feature of Interest"},
              sort: 4
            }
          },
          distributor: {
            terms: {
              field: 'th_formater-distributor.default',
              size: 50
            },
            meta: {
              type: 'dimension',
              thesaurus: 'formater-distributor',
              icon: 'fa-solid fa-users',
              label: {fr: 'Distributeur', en: 'Distributor'},
              sort: 1
            }

          },
          platform: {
            terms: {
              field: 'th_formater-platform-gn_tree.key',
              order: {_key: 'asc'},
              size: 50
            }, 
            meta: {
              type: 'facet',
              thesaurus: 'formater-platform-gn',
              label: {fr: 'Plateforme', en: 'Platform'},
              sort: 3,
              icon: 'fa-solid fa-rocket'
            } 
          }
        }, 
        step2: {
          productType: {
             terms: {
               field: 'th_formaterre-product-gn_tree.key',
               order: {_key: 'asc'},
               size: 10
             },
             meta: {
               type: 'select',
               thesaurus: 'formaterre-product-gn',
               label: {fr: 'Type de produit', en: 'Product type'},
               sort: 0
             }
          },
          polarisation: {
            terms: {
              field: 'th_polarisation.default',
              order: {_key: 'asc'},
              size: 4
            },
            meta: {
              type: 'select',
              label: 'Polarisation',
              sort: 1
            }
          },
          ron: {
            terms: {
              field: 'th_ron.default',
              order: {_key: 'asc'},
              size: 4
            },
            meta: {
              type: 'select',
              label: {fr: 'Orbite relative', en: 'Relative Orbit'},
              sort: 2
            }
          }
        }
      },
      includes: ["uuid", "id", "groupOwner", "cl_status", "cl_hierarchyLevel", "geom", "contactForResource", "organisationName",
        "resourceTitle*", "resourceTemporalExtentDetails", "resourceAbstract*",  "th_formater-distributor.*",
        "th_formater-platform-gn", "th_formaterre-product-gn", "th_ron.default", "th_polarisation.default", "overview","link"]
    }),
    actions: {
        setCatalog ( routeName, catalogName) {
            var catal = catalogName ? catalogName.toLowerCase() : null
            var reset = routeName !== this.name
            this.name = routeName
            this.groupOwner = null
            let catalogs = useCatalog()
            this.reset = reset || catal !== catalogs.getName()
            let catalog = catalogs.setCatalog(catalogName)
            if (catalog) {
                this.groupOwner = catalog.id
            }
        },
        getDefaultParameters () {
            let config = useConfig()
            return {
                from: 0,
                size: config.state.size,
                _source: {
                  includes: this.includes
                },
                sort: [ {popularity: "desc"}, {changeDate: "desc"}],
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
        getParameters (query) {
            let parameters = this.getDefaultParameters()
            let aggregations = Object.assign({},this.aggregations.step1)
            console.log(query)
            if (query.from) {
                parameters.from = parseInt(query.from) - 1
            }
            if (query.to) {
                parameters.size = parseInt(query.to) - parameters.from
            }
            if (query.sortBy) {
                console.log(query.sortBy)
                // this.parameters.sort = [{changeDate: 'desc'}, {popularity: desc}]
                if (query.sortBy === 'changeDate') {
                    parameters.sort.reverse()
                } 
                // else if (route.query.sortBy === 'title') {
                //   this.parameters.sort.unshift({'resourceTitleObject.fre': {order: 'asc'}})
                // }
            }
            if (query.start || query.end) {
                parameters.query.bool.filter.push({
                    range: {
                    resourceTemporalExtentDateRange: {
                        from: query.start ? query.start : null,
                        to: query.end ? query.end : null,
                        format: 'yyyy-MM-dd'
                        }
                    }
                })
            }
            if (query.bbox) {
                var tab = query.bbox.split(',')
                if (tab.length === 4) {
                parameters.query.bool.filter.push({
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
            if (query.any) {
                var words = query.any.trim().split(/(\s+)/)
                words = words.filter(function (w) { return w.trim().length > 0;})
                var any = words.join(' AND ')
                var term = {query_string: {
                fields: ["resourceTitleObject.*", "resourceAbstractObject.*", "lineageObject.*", "tag", "uuid", "resourceIdentifier"],
                query: any
                }}
                if (!parameters.query.bool.must) {
                parameters.query.bool.must = []
                }
                parameters.query.bool.must.push(term)
            }
            if (this.groupOwner) {
                parameters.query.bool.filter.push({term: {groupOwner: this.groupOwner }})
                delete aggregations['groupOwner']
            }
            
            for(var key in aggregations) {
                if (query [key]) {
                    if (aggregations[key].meta.type === 'dimension') {
                        var terms = {}
                        var q = decodeURIComponent(query[key])
                        var values = q.split(',')
                        terms[aggregations[key].terms.field] = values
                        parameters.query.bool.filter.push({terms: terms})
                    } else {
                        var term = {}
                        term[aggregations[key].terms.field] = decodeURIComponent(query[key]).split(',')
                        parameters.query.bool.filter.push({terms: term})
                    }
                }
            }
            parameters.aggregations = aggregations
            return parameters
        },
        getRecords (query) {
            const config = useConfig()
            let api = config.state.geonetwork +  '/srv/api/search/records/_search?bucket=metadata'
            let parameters = this.getParameters(query)
            return new Promise((successCallback, failureCallback) => {
                fetch(api, 
                {
                    headers: {'Accept': 'application/json', 'Content-type': 'application/json'},
                    method: 'POST',
                    body: JSON.stringify(parameters)
                }
                ).then(rep => rep.json())
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
        },
        treatmentAggregations (aggs) {
                 
            aggs = Object.fromEntries(
                Object.entries(aggs).sort(([,a],[,b]) => {
                    if (a.meta.sort - b.meta.sort > 0) {
                        return 1
                    } else {
                        return -1
                    }
                })
            )
            var aggregations = []
            var promises = []
            for(var key in aggs) {
                if (aggs[key].buckets.length === 0) {
                    delete aggs[key]
                }
            }
           //  aggregations.sort(function (a,b) { return a.meta.sort - b.meta.sort})
            for(var key in aggs) {
                promises.push(this.prepareAggregation(key, aggs[key]))
            }
            var self = this
            return new Promise((successCallback, failureCallback) => 
                Promise.all(promises)
                .then((values) => {
                    var aggregations = {}
                    values.forEach(function (v) {
                        v.reset = self.reset
                        aggregations[v.key] = v
                    })
                    self.reset = false
                    successCallback(aggregations)
                }).catch(err => {
                    failureCallback(err)
                })
            )

        },
        translate(thesaurus, uris) {
            var self = this
            let config = useConfig()
            return new Promise(function (resolve, reject) {
                var id = uris.join(',')
                var lang = config.state.lang === 'fr' ? 'fre' : 'eng'
                var url = config.state.geonetwork + '/srv/api/registries/vocabularies/keyword?id=' + encodeURIComponent(id) + '&thesaurus=' + thesaurus + '&lang=' + lang
                fetch(url, {headers: {'accept': 'application/json'}})
                .then(resp => resp.json())
                .then(json => {
                    resolve(json)
                })
            })
          
        },
        prepareAggregation(key, agg) {
            var self = this
            let config = useConfig()
            return new Promise(function (resolve, reject) {
                var label = key
                var lang = config.state.lang
                if (agg.meta && agg.meta.label) {
                    label = agg.meta.label[lang] ? agg.meta.label[lang] : agg.meta.label
                }
                var aggStore = self.aggregations[self.step][key]
                var tab = aggStore.terms.field.split('.')
                var isKey = tab.length > 1 && tab[1] === 'key'
                var aggregation = {
                    key: key,
                    type: isKey ? 'associative' : 'simple',
                    label: label,
                    meta: agg.meta,
                    category: []
                }
                
                var type = (agg.meta && agg.meta.type) || 'dimension'
                
                var buckets = agg.buckets
                let catalog = useCatalog()
                let groups = catalog.groups
                
                var toTranslate = []
                var thesaurus = agg.meta.thesaurus || null
                
                
                buckets.forEach(function (item, index) {
                    
                    if (type === 'dimension') {
                        if (key === 'groupOwner') {
                          
                            var label = groups[parseInt(item.key)].name
                        } else {
                            var label = item.key
                        }
                        aggregation.category.push({
                            label: label,
                            key: item.key,
                            count: item.doc_count
                        })
                    } else if (type === 'select' && !isKey ) {
                       console.log(label)
                       console.log(item)
                       aggregation.category.push( item.key )
                    } else {
                        var keys = item.key.split('^')
                        var uri = keys.pop()
                        toTranslate.push(uri)
                        buckets[index].parent = keys.join('^')
                        buckets[index].length = keys.length
                        buckets[index].key = item.key
                        buckets[index].label  = item.key
                        buckets[index].uri = uri
                        buckets[index].count = item.doc_count
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
                      if (translated[item.uri]) {
                        if (translated[item.uri].label) {
                            buckets[index].label = translated[item.uri].label
                        } else {
                            buckets[index].label = translated[item.uri]
                        }
                      }
                    })
                    if (type === 'select') {
                        var category = []
                        buckets.forEach(function(item) {
                            category.push({ uri: item.uri, label: item.label })
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
        }
    }
  })