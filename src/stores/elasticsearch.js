import { defineStore } from 'pinia'
import {useConfig} from './config'
import {useCatalog} from './catalog'

function extractAccessFromDescription (description, url) {
    url = new URL(url)
    if (url.search.length > 3) {
        var lists = url.search.replace('?', '').split('&')
        url = url.protocol + '//' + url.hostname + url.pathname
        console.log(url)
    } else {
        if (!description) {
          return {search:'free', view: 'UNKNOWN', download: 'UNKOWN'}
        }
        var lists = description.split(';')
        
    }
    var access = {}
    var query = {}
    lists.forEach(function (tab) {
      var extract = tab.split('=')
      if (extract.length > 1 && ['search', 'view', 'download'].indexOf(extract[0]) >= 0) {
         access[extract[0]] = extract[1]
      } else {
          query[extract[0]] = extract[1].split(',')
      }
    })
    return {access: access, query: query, url: url}
}
export const useElasticsearch = defineStore('elasticsearch', {
    state: () => ({
      catalogId: null,
      catalog: null,
      uuid: null,
      groupOwner: null,
      step: 'step1',
      reset: null,
      config: null,
      aggregations: {
        step1: {
          theme: { 
            terms: {
              field: 'th_formaterre_themes_tree.key',
              size: 50
            },
            meta: {
              type: 'dimension',
              thesaurus: 'formaterre_themes',
              icon: 'fa-solid fa-object-group',
              label: {fr: 'Thématique', en: 'Theme'},
              sort: 0
            }
          },
          groupOwner: {
            terms: {
              field: 'groupOwner',
              order: {_key: 'asc'},
              size: 50
            },
            meta: {
              type: 'dimension',
              icon: 'fa-solid fa-database',
              label: {fr: 'Entrepôts', en: 'Repository'},
              sort: 1
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
          provider: {
            terms: {
              field: 'th_formaterre_provider_tree.key',
              size: 50
            },
            meta: {
              type: 'dimension',
              thesaurus: 'formater_provider',
              icon: 'fa-solid fa-users',
              label: {fr: 'Fournisseur', en: 'Provider'},
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
          },
          cdos: { 
            terms: {
              field: 'th_formaterre_cdos_tree.key',
              size: 50
            },
            meta: {
              type: 'dimension',
              thesaurus: 'formaterre_cdos',
              icon: 'fa-solid fa-user-group',
              label: {fr: 'CDOS (en cours)', en: 'CDOS (on going)'},
              sort: 5
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
      // @todo à configurer sur le back office
      includes: ["uuid", "id", "groupOwner", "cl_status", "cl_hierarchyLevel", "geom", "contactForResource", "organisationName",
        "resourceTitle*", "resourceTemporalExtentDetails", "resourceAbstract*",  "th_formaterre_provider.*",
        "th_formater-platform-gn", "th_formaterre-product-gn", "th_ron.default", "th_polarisation.default", "overview","link"],
      includesXXL: ["dateStamp", "publicationDateForResource", "revisionDateForResource", "contact", "cl_topic", "format", "resourceIdentifier", "resourceCredit*", "purposeObject", 
                    "coordinateSystem", "crsDetails.name", "allKeywords", "lineageObject.*", "parentUuid", "MD_LegalConstraints*", "sourceCatalogue"]
    }),
    actions: {
        setCatalog ( routeName, catalogName, metadataId) {
            var catal = catalogName ? catalogName.toLowerCase() : null
            var reset = routeName !== this.name
            this.name = routeName
            this.groupOwner = null
            this.catalog = null
            this.uuid = metadataId
            let catalogs = this.getCatalogs()
            this.reset = reset || catal !== catalogs.getName()
            let catalog = this.catalogs.setCatalog(catalogName)
            if (catalog) {
                this.catalog = {
                    id: catalog.id
                }
            }
        },
        getCatalogs () {
            if (!this.catalogs) {
                this.catalogs = useCatalog()
            }
            return this.catalogs
        },
        getConfig () {
            if (!this.config) {
                this.config = useConfig()
            }
            return this.config
        },
        getDefaultParameters () {
            let config = this.getConfig()
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
            if (this.uuid) {
                parameters.query.bool.filter.push({term: {parentUuid: this.uuid}})
                delete parameters.query.bool.must_not
            }
            if (query.from) {
                parameters.from = parseInt(query.from) - 1
            }
            if (query.to) {
                parameters.size = parseInt(query.to) - parameters.from
            }
            if (query.sortBy) {
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
            var catalogs = this.getCatalogs()
            if (this.catalog) {
                var terms = {}
                terms['th_' + catalogs.thesaurus.th_name + '_tree.key'] = [this.catalog.id]
                parameters.query.bool.filter.push({terms: terms})
                delete aggregations[catalogs.thesaurus.th_slug]
            }

            for(var key in aggregations) {
                // console.log(aggregations[key].terms.field)
                // console.log(query)
                query[aggregations[key].terms.field + '_tree.key']
                // if (query[aggregations[key].terms.field.replace('_tree.key','')]) {
                //    // query[key] = query[aggregations[key].terms.field.replace('_tree.key','')]
                //    // delete query[aggregations[key].terms.field.replace('_tree.key','')]
                //    // parameters.query.bool.filter.push({terms: {'th_formater-platform-gn.key':  query[aggregations[key].terms.field.replace('_tree.key','')]}})
                // }
  
                if (query [key] ) {
                    if (aggregations[key].meta.type === 'dimension') {
                        var terms = {}
                        var q = decodeURIComponent(query[key])
                        var values = q.split(',')
                        terms[aggregations[key].terms.field] = values
                        parameters.query.bool.filter.push({terms: terms})
                    } else {
                        if (query[key] && query[key].indexOf('+') === -1) {
                            // OR
                            var term = {}
                            term[aggregations[key].terms.field] =  decodeURIComponent(query[key]).split(',')
                            parameters.query.bool.filter.push({terms: term})
                        } else {
                            // AND
                            var terms = decodeURIComponent(query[key]).split('+')
                            terms.forEach(function (t) {
                                var term = {}
                                term[aggregations[key].terms.field] = t
                                parameters.query.bool.filter.push({term: term})
                            })

                        }
                    }
                }
            }
            for(var key in query) {
                if (key.substring(0,3) === 'th_') {
                    var prop = key + '.link'
                    var term = {}
                    term[prop] = query[key].split(',')[0]
                    parameters.query.bool.filter.push({term: term})
                    
                }
            }
            parameters.aggregations = aggregations
            return parameters
        },
        getMetadata (uuid) {
            console.log(uuid)
            let config = useConfig()
            let api = config.state.geonetwork +  '/srv/api/search/records/_search?bucket=metadata'
            var includes = this.includesXXL.concat(this.includes)
            let parameters =  {
                from: 0,
                size: 5,
                _source: {
                  includes: includes
                },
                query: {
                  bool: {
                      filter: [{
                          term: {uuid: uuid}
                      }]
            }}} 
            var self = this
            return new Promise( (successCallback, failureCallback) => {
                fetch(api,
                {
                    headers: {'Accept': 'application/json', 'Content-type': 'application/json'},
                    method: 'POST',
                    body: JSON.stringify(parameters)
                }).then(resp => resp.json())
                .then(json => {
                    console.log(json.hits)
                    if (json.hits && json.hits.hits.length > 0) {
                        console.log(json.hits.hits[0])
                        var metadata = self.treatmentMetaXXL(json.hits.hits[0])
                        successCallback(metadata)
                    } else {
                        console.log('FAILED')
                        failureCallback('NOT FOUND')
                    }
                }).catch(err => {
                    if (failureCallback) {
                        failureCallback(err)
                    }
                })
            })
        },
        getMetadataXML (uuid) {
            // voir si pas plus simple de faire une recherche avec elasticsearch???
            var headers =  {
              'accept': 'application/json',
            }
            const config = this.getConfig()
            let url = config.state.geonetwork +  '/srv/api/records/' + this.uuid
            return new Promise((successCallback, failureCallback) => {
                fetch(url, {headers:headers})
                .then(resp => resp.json())
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
        getRecords (query) {
            const config = this.getConfig()
            let api = config.state.geonetwork +  '/srv/api/search/records/_search?bucket=metadata'
            let parameters = this.getParameters(query)
            var self = this
            return new Promise((successCallback, failureCallback) => {
                fetch(api,
                {
                    headers: {'Accept': 'application/json', 'Content-type': 'application/json'},
                    method: 'POST',
                    body: JSON.stringify(parameters)
                }
                ).then(rep => rep.json())
                .then(json => {
                    var result = self.treatmentJson(json)
                    if (successCallback) {
                        successCallback(result)
                    }
                }).catch(err => {
                    if (failureCallback) {
                        failureCallback(err)
                    }
                })
            })
        },
        getGroup (uuid) {
            const config = this.getConfig()
            let api = config.state.geonetwork +  '/srv/api/search/records/_search?bucket=metadata'
            let parameters =  {
                from: 0,
                size: 5,
                _source: {
                  includes:  ["uuid", "id", "groupOwner"]
                },
                query: {
                  bool: {
                      filter: [{
                          term: {uuid: uuid}
                      }]
            }}} 
            var self = this
            return new Promise( (successCallback, failureCallback) => {
                fetch(api,
                {
                    headers: {'Accept': 'application/json', 'Content-type': 'application/json'},
                    method: 'POST',
                    body: JSON.stringify(parameters)
                }).then(resp => resp.json())
                .then(json => {
                    var groupId = null
                    if (json.hits && json.hits.hits.length > 0) {
                        groupId = json.hits.hits[0]._source.groupOwner
                    }
                    if (successCallback && groupId) {
                        successCallback(groupId)
                    } else if (failureCallback) {
                       // failureCallback('NO RECORD')
                    }
                }).catch(err => {
                    if (failureCallback) {
                        failureCallback(err)
                    }
                })
            })
        },
        setThesaurus (name) {
            this.thesaurus = name
        },
        treatmentJson (json) {
            let config = this.getConfig()
            var list = []
            var pagination = {
                count: 0,
                total: 0
            }
            if (json.hits && json.hits.hits) {
                var list = json.hits.hits
                var pagination = {
                    count: json.hits.hits.length,
                    total: json.hits.total.value,
                    relation: json.hits.total.relation
                }
            }
            var self = this
            list.forEach(function (result, index) {
                list[index] = self.treatmentMeta(result)
                
            })
            return {list: list, pagination: pagination, aggregations: json.aggregations}
        },
        treatmentMetaXXL (result) {
            let source = result._source
            let config = useConfig()
            let uuid = source.uuid
            let meta = {
            }
            meta.exportLinks = {
                xml: config.state.geonetwork + '/srv/api/records/'+ uuid + '/formatters/xml?attachment=true',
                pdf: config.state.geonetwork + '/srv/api/records/'+ uuid + '/formatters/xsl-view?root=div&output=pdf'
    
            }
            if (source.cl_hierarchyLevel && source.cl_hierarchyLevel.length > 0) {
                meta.hierarchyLevel = {
                    icon: source.cl_hierarchyLevel[0].key === 'dataset' ? 'file' : 'folder-open',
                    name: config.tr(source.cl_hierarchyLevel[0])
                }
            } else {
                meta.hierarchyLevel = { icon: 'file', name: null}
            }
            var catalogs = this.getCatalogs()
            var group = catalogs.getGroupById(source.groupOwner)
            meta.group = group ? group.name : null
            meta.description = config.tr(source.resourceAbstractObject).replace('\n', '<br>')
            meta.title =  config.tr(source.resourceTitleObject)
            meta.dateStamp = source.dateStamp
            if (source.purposeObject) {
                meta.purpose = config.tr(source.purposeObject)
            }
            if (source.cl_topic.length > 0) {
                meta.topicCat = source.cl_topic[0].key
            }
            if (source.MD_LegalConstraintsOtherConstraintsObject) {
                if (!meta.legalConstraints) {
                    meta.legalConstraints = []
                }
                for(var k in source.MD_LegalConstraintsOtherConstraintsObject) {
                    meta.legalConstraints.push(config.tr(source.MD_LegalConstraintsOtherConstraintsObject[k]))
                }
            }
            if (source.MD_LegalConstraintsUseLimitationObject) {
                if (!meta.legalConstraints) {
                    meta.legalConstraints = []
                }
                for(var k in source.MD_LegalConstraintsUseLimitationObject) {
                    meta.legalConstraints.push(config.tr(source.MD_LegalConstraintsUseLimitationObject[k]))
                }
            }
             if (source.MD_ConstraintsUseLimitationObject) {
                if (!meta.constraints) {
                    meta.constraints = []
                }
                for(var k in source.MD_ConstraintsUseLimitationObject) {
                    meta.constraints.push(config.tr(source.MD_ConstraintsUseLimitationObject[k]))
                }
            }
            if (source.lineageObject) {
                meta.lineage = [config.tr(source.lineageObject)]
            }
            meta.contacts = {
                metadata: [],
                resource: {}
            }
            if (source.contact && source.contact.length > 0) {
                source.contact.forEach(ct => {
                    meta.contacts.metadata.push({
                        role: ct.role,
                        email: ct.email,
                        individual: ct.individual,
                        organisation: ct.organisationObject ? config.tr(ct.organisationObject) : '',
                        ror: ct.organisationObject && ct.organisationObject.link ? ct.organisationObject.link : null,
                        phone: ct.phone,
                        address: ct.address,
                        orcid: null
                    })
                })
            }
            if (source.contactForResource && source.contactForResource.length > 0) {
                source.contactForResource.forEach(ct => {
                    if (!meta.contacts.resource[ct.role]) {
                        meta.contacts.resource[ct.role] = []
                    }
                    meta.contacts.resource[ct.role].push({
                        role: ct.role,
                        email: ct.email,
                        individual: ct.individual,
                        organisation: ct.organisationObject ? config.tr(ct.organisationObject) : '',
                        ror: ct.organisationObject && ct.organisationObject.link ? ct.organisationObject.link : null,
                        phone: ct.phone,
                        address: ct.address,
                        orcid: null
                    })
                })
            }
            if (source.crsDetails && source.crsDetails.length > 0) {
                meta.crs = []
                source.crsDetails.forEach(function(crs) {
                    meta.crs.push(crs.name)
                })
            }
            if (source.revisionDateForResource && source.revisionDateForResource.length > 0) {
                source.revisionDateForResource.sort().reverse()
                meta.revisionDate = source.revisionDateForResource[0]
            }
            if (source.publicationDateForResource && source.publicationDateForResource.length > 0) {
                source.publicationDateForResource.sort().reverse()
                meta.publicationDate = source.publicationDateForResource[0]
            }
            meta.geojson = source.geom
            meta.links = this.treatmentLinks(source.link, meta.id, meta)
            if (source.resourceIdentifier && source.resourceIdentifier.length > 0) {
                meta.identifier = source.resourceIdentifier[0].code
            }
            meta.status = null
            if (source.cl_status && source.cl_status.length > 0) {
                meta.status = source.cl_status[0].key
            }
            meta.quicklook = null
            if (source.overview && source.overview.length > 0) {
                meta.quicklook = {
                  src: source.overview[0].url,
                  title: source.overview[0].nameObject ? config.tr(source.overview[0].nameObject) : ''
                }
                meta.images = []
                source.overview.forEach(function(img) {
                    meta.images.push(['overview', img.url, img.nameObject ? config.tr(img.nameObject) : ''])
                })
            }
            meta.temporalExtents = source.resourceTemporalExtentDetails
            return meta
        },
        treatmentMeta (result) {
           
            let source = result._source
            let config = this.getConfig()
            let meta = {
                 id: source.uuid, 
                 title: config.tr(source.resourceTitleObject),
                 catalogId: source.groupOwner,
                 description: config.tr(source.resourceAbstractObject).replace('\n', '<br>')
            }
            
            if (source.cl_hierarchyLevel && source.cl_hierarchyLevel.length > 0) {
                meta.hierarchyLevel = {
                    icon: source.cl_hierarchyLevel[0].key === 'dataset' ? 'file' : 'folder-open',
                    name: config.tr(source.cl_hierarchyLevel[0])
                }
            } else {
                meta.hierarchyLevel = { icon: 'file', name: null}
            }
            meta.status = null
            if (source.cl_status && source.cl_status.length > 0) {
                meta.status = {
                    key: source.cl_status[0].key,
                    label: config.tr(source.cl_status[0])
                }
            }
            meta.quicklook = null
            if (source.overview && source.overview.length > 0) {

              meta.quicklook = {
                  src: source.overview[0].url,
                  title: source.overview[0].nameObject ? config.tr(source.overview[0].nameObject) : ''
              }
            }
            meta.temporalExtents = source.resourceTemporalExtentDetails
            meta.related = []
            if (source.link) {
                meta.related = source.link
            }
            // catalog
            var catalogs = this.getCatalogs()
            var group = catalogs.getGroupById(source.groupOwner)
            meta.group = group ? group.name : null
            meta.geom = source.geom
            if ( catalogs.organismThesaurus && source['th_' + catalogs.organismThesaurus.th_name] ) {
                meta.dataCenter = []
                var name = 'th_' + catalogs.organismThesaurus.th_name
                for (var i in source[name]) {
                    meta.dataCenter.push(catalogs.organisms[source[name][i].link])
                }
               
            }
            meta.thesaurus = this.treatmentThesaurus(source)
            meta.links = this.treatmentLinks(source.link, meta.id)
            return meta
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
            let config = this.getConfig()

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
        treatmentThesaurus (source) {
            var thesaurus = {}
            for(var step in this.aggregations) {
               for (var key in this.aggregations[step]) {
                  if (this.aggregations[step][key].meta.thesaurus) {
                   var th = 'th_' + this.aggregations[step][key].meta.thesaurus
                } else {
                  var field = this.aggregations[step][key].terms.field
                  var tab = field.split('.')
                  var th =  tab[0]
                  
                }
                if (source[th] && source[th].forEach) {
                    var label = this.aggregations[step][key].meta.label
                    if (this.aggregations[step][key].meta.thesaurus) {
                        var th = 'th_' + this.aggregations[step][key].meta.thesaurus
                    } else {
                        var field = this.aggregations[step][key].terms.field
                        var tab = field.split('.')
                        var th =  tab[0]
                    }
                    var config = this.getConfig()
                    var lang = config.state.lang
                    if (this.aggregations[step][key].meta.label[lang]) {
                      label = this.aggregations[step][key].meta.label[lang]
                    }
                    thesaurus[th] = {label: label, values: source[th].map(x => config.tr(x))}
                }
               }
            }
            return thesaurus
        },
        treatmentLinks (list, id, meta) {
            let config = this.getConfig()
            var links = {}
            if (!list) {
                return links
            }
            list.forEach((lk, index) => {
            switch(lk.protocol) {
               case 'OpenSearch':
               case 'SensorThings':
               case 'Sensorthings':
               case 'STAC':
               case 'UKST':
                var obj = extractAccessFromDescription(config.tr(lk.descriptionObject), config.tr(lk.urlObject))
                if (!links.api) {
                    links.api = {}
                }
                links.api[lk.protocol] = {
                  url: obj.url,
                  name: config.tr(lk.nameObject),
                  protocol: lk.protocol,
                  access: obj.access,
                  query: obj.query
                }
                if (meta) {
                   meta[lk.protocol.toLowerCase()] = obj.url
                }
                break;
               case 'GetMap':
               case 'WTS':
               case 'OGC:WMS':
               case 'OGC:WMS-1.1.1-http-get-map':
               case 'OGC:WFS':
               case 'OGC:WFS-G':
               case 'OGC:KML':
               case 'OGC:OWS':
               case 'OGC:OWS-C':
               case 'OGC API - Tiles':
               case 'OGC Web Map Service':
               case 'GLG:KML-2.0-http-get-map':
                   if (!links.layers) {
                     links.layers = []
                   }
                   var idLayer =  id + '_' + links.layers.length 
                   links.layers.push({
                        id: idLayer,
                        uuid: id,
                        name: config.tr(lk.nameObject),
                        description: config.tr(lk.descriptionObject),
                        url:  config.tr(lk.urlObject),
                        type: lk.protocol,
                        checked: false
                   })
                  break;
               case 'application/vnd.google-earth.kml+xml':
                  break;
               case 'WWW:DOWNLOAD-1.0-ftp--download':
                   break;
               case 'WWW:DOWNLOAD-1.0-link--download':
               case 'WWW:DOWNLOAD-1.0-http--download':
               case 'download':
               case 'telechargement':
                  if (!links.download) {
                    links.download = []
                  }
                  var download = {
                        name:config.tr(lk.nameObject),
                        description: config.tr(lk.descriptionObject),
                        url: config.tr(lk.urlObject),
                        type: lk.protocol
                  }
                  
                  links.download.push(download)
                  break;
               case 'WWW:DOWNLOAD-1.0-link--order':
               case 'order':
                  if (!links.order) {
                    links.order = []
                  }
                  var download = {
                        name:config.tr(lk.nameObject),
                        description: config.tr(lk.descriptionObject),
                        url: config.tr(lk.urlObject),
                        type: lk.protocol
                 }
                 links.order.push(download)
                  break;
               case 'UKST':
                 
                 //  if (link[6] && link[6].toLowerCase() === 'opensearch') {
                 //    response.api = {}
                 //    response.api.http = link[2]
                 //    response.api.name = link[0].length > 0 ? link[0] : link[1]
                 //  }
                  break;
               case 'WWW:LINK-1.0-http--related':
                  if (!links.relatedLinks) {
                    links.relatedLinks = []
                  }
                  var link = {
                        name:config.tr(lk.nameObject),
                        description: config.tr(lk.descriptionObject),
                        url: config.tr(lk.urlObject),
                        type: lk.protocol
                  }
                  links.relatedLinks.push(link)
                  break;
               case 'WWW:LINK-1.0-http--link':
               default:
                  if (!links.links) {
                    links.links = []
                  }
                  var link = {
                        name:config.tr(lk.nameObject),
                        description: config.tr(lk.descriptionObject),
                        url: config.tr(lk.urlObject),
                        type: lk.protocol
                  }
                  links.links.push(link)
                  break;
             }
            })
            return links
        },
        prepareAggregation(key, agg) {
            var self = this
            let config = this.getConfig()
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
                if (key === catalog.organismThesaurus.th_slug) {
                    isKey = false
                }
                if (key === catalog.thesaurus.th_slug) {
                    isKey = false
                }
                if (key === 'groupOwner') {
                     isKey = false
                }
               
                let groups = catalog.groups
                
                var toTranslate = []
                var thesaurus = agg.meta.thesaurus || null


                buckets.forEach(function (item, index) {

                    if (type === 'dimension') {
                        
                        if (key === 'groupOwner') {

                            var label = groups[parseInt(item.key)].name
                        } else if (key === catalog.organismThesaurus.th_slug) {
                            
                            var label = catalog.organisms[item.key].label
                        } else if ( key === catalog.thesaurus.th_slug ) {
                            var val = catalog.list.find(x => x.id === item.key)
                            var label = val.label
                        } else {
                            var label = item.key
                            if (isKey) {
                                toTranslate.push(item.key)
                            }
                        }
                        if (!isKey) {
                            aggregation.category.push({
                                label: label,
                                key: item.key,
                                count: item.doc_count
                            })
                        }
                    } else if (type === 'select' && !isKey ) {
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
                      if (translated[item.key]) {
                        if (translated[item.key].label) {
                            buckets[index].label = translated[item.key].label
                        } else {
                            buckets[index].label = translated[item.key]
                        }
                      }
                    })
                     
                    if (type === 'select' || type === 'dimension') {
                        var category = []
                        buckets.forEach(function(item) {
                            category.push({key: item.key, label: item.label, count: item.doc_count})
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
