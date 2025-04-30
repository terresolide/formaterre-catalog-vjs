import { defineStore } from 'pinia'
import {useConfig} from './config'
import {useCatalog} from './catalog'

export const useElasticsearch = defineStore('elasticsearch', {
    state: () => ({
      catalogId: null,
      uuid: null,
      groupOwner: null,
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
              icon: 'fa fa-database',
              label: {fr: 'Catalogue', en: 'Catalog'},
              sort: 0
            }
          },
          discipline: {
            terms:{
              field: 'th_formater-discipline_tree.key',
              order: {_key: 'asc'},
              size: 10
            },
            meta: {
              type: 'facet',
              thesaurus: 'formater-discipline',
              icon: 'fa fa-graduation-cap',
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
              icon: 'fa fa-map-marker',
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
              icon: 'fa fa-users',
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
              icon: 'fa fa-rocket'
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
        this.name = routeName
        if (!catalogName) {
          this.groupOwner = null
          return
        }
        let catalogs = useCatalog()
        let catalog = catalogs.getCatalog(catalogName)
        console.log(catalog)
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
        let aggregations = Object.assign(this.aggregations.step1)
        
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
                to: rquery.end ? query.end : null,
                format: 'yyyy-MM-dd'
                }
            }
            })
        }
        if (query.box) {
            
            var tab = query.box.split(',')
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
                var values = q.split('+or+')
                terms[aggregations[key].terms.field] = values
                parameters.query.bool.filter.push({terms: terms})
            } else {
                var term = {}
                term[aggregations[key].terms.field] = decodeURIComponent(query[key])
                parameters.query.bool.filter.push({term: term})
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
        
      }
      
    }
  })