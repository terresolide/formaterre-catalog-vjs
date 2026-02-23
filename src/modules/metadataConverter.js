/**
* Convert json iso19139 metadata to readable json
**/
import {JSONPath} from 'jsonpath'
import {useConfig} from '@/stores/config.js'
import {useCatalog} from '@/stores/catalog.js'
export default function (attrs) {
    let config = useConfig()
    let catalog = useCatalog()
    
    let JSONPATH = new JSONPath()
    function transform (uuid, json) {
        var metadata = {}
        if (config.state.geonetwork) {
          if (json.logo) {
            metadata.logo = config.state.geonetwork + '/' + json.logo.replace(/^\//, '')
          }
          metadata.exportLinks = {
              xml: config.state.geonetwork + '/srv/api/records/'+ uuid + '/formatters/xml?attachment=true',
              pdf: config.state.geonetwork + '/srv/api/records/'+ uuid + '/formatters/xsl-view?root=div&output=pdf'
          }
        }
        metadata.group = json.group
        var idLang = config.state.locale
        if (idLang === 'fre') {
            idLang = 'FR'
        } else {
            idLang = 'EN'
        }
        // search lang code
        metadata.uuid = uuid

        metadata.title = extractFromLangs(
             JSONPATH.query(json, "$..['gmd:citation']['gmd:CI_Citation']['gmd:title']"),
             idLang)
      
        var description = extractFromLangs(
            JSONPATH.query(json, "$..['gmd:abstract']"),
            idLang)
        if (description && Array.isArray(description)) {
          description = description[0]
        } else if (!description) {
           description = ''
        }
        metadata.dateStamp = json['gmd:dateStamp']['gco:DateTime']['#text']
        metadata.description = description.replace(/(?:\\[rn]|[\r\n])/g, '<br />')
        metadata.credit = extractFromLangs(json['gmd:credit'], idLang)
        metadata.purpose = extractFromLangs(json['gmd:purpose'], idLang)
        if (json['gmd:parentIdentifier']) {
            metadata.parentIdentifier = json['gmd:parentIdentifier']['gco:CharacterString']["#text"]
        }
        if (json['gmd:hierarchyLevel']) {
            metadata.hierarchyLevel = json['gmd:hierarchyLevel']['gmd:MD_ScopeCode']['@codeListValue']
        } else {
            metadata.hierarchyLevel = 'dataset'
        }
        if (metadata.purpose) {
          metadata.purpose = metadata.purpose.replace(/(?:\\[rn]|[\r\n])/g, '<br />')
        }
        var dataInfo = json['gmd:identificationInfo']['gmd:MD_DataIdentification']
        metadata.status = JSONPATH.query(json,"$..['gmd:status']['gmd:MD_ProgressCode']['@codeListValue']")[0]
        metadata.identifier = JSONPATH.query(dataInfo, "$..['gmd:identifier']..['gco:CharacterString']['#text']")[0]
      
        // metadata.dataCenter =
        if (dataInfo['gmd:topicCategory']) {
        metadata.topicCat = dataInfo['gmd:topicCategory']['gmd:MD_TopicCategoryCode']
        }
        extractKeywords(metadata, dataInfo['gmd:descriptiveKeywords'], idLang)
        metadata.images = extractImages(dataInfo['gmd:graphicOverview'], idLang)
        var constraints = extractConstraints(
            JSONPATH.query(dataInfo, "$..['gmd:resourceConstraints']..['gmd:MD_LegalConstraints']"),
            idLang)
        if (constraints) {
          metadata.legalConstraints = constraints
        }
        var constraints = extractConstraints(
            JSONPATH.query(dataInfo, "$..['gmd:resourceConstraints']..['gmd:MD_Constraints']"),
            idLang)
        if (constraints) {
          metadata.constraints = constraints
        }
        extractLineage(metadata, json, idLang)
        extractCrs(metadata, json, idLang)
        var contacts = extractContacts(
            JSONPATH.query(dataInfo['gmd:pointOfContact'], "$..['gmd:CI_ResponsibleParty']"), idLang)

        metadata.contacts = {resource: contacts}
        var contacts = extractContacts(
            JSONPATH.query(json['gmd:contact'], "$..['gmd:CI_ResponsibleParty']"), idLang)

        metadata.contacts.metadata = contacts
        // extractDistributionInfo (metadata, json, idLang) 
        var json2 = json['gmd:distributionInfo']['gmd:MD_Distribution']['gmd:distributionFormat'] || {}
        extractFormat(metadata, json2, idLang)
        extractLinks (metadata, json, idLang, uuid) 
        extractExtent(metadata, dataInfo['gmd:extent'])
        extractDates(metadata,  JSONPATH.query(dataInfo, "$..['gmd:citation']..['gmd:CI_Date']"))
        extractAssociation(metadata, dataInfo['gmd:aggregationInfo'])
        extractResolution(metadata, dataInfo['gmd:spatialResolution'])
        extractSpatialRepresentation(metadata, dataInfo['gmd:spatialRepresentationType'])
        return metadata
    }
    
    function extractAddress (json) {
        if (json === undefined) {
          return null
        }
        var address = []
        for (var key in json) {
          if (key !== 'gmd:electronicMailAddress' && json[key]['gco:CharacterString'] &&
              json[key]['gco:CharacterString']['#text']) {
            address.push(json[key]['gco:CharacterString']['#text'])
          }
        }
        if (address.length == 0) {
          return null
        } 
        return address.join(',')
    }
    function extractAssociation (metadata, json) {
        if (!json || json === undefined) {
          return
        }
        if (!metadata.related) {
          metadata.related = { siblings: []}
        }
        if (!metadata.related.siblings) {
          metadata.related.siblings =[]
        }
        if (json && !json.forEach) {
          json = [json]
        }
        json.forEach(function (node) {
          var initiative = node['gmd:MD_AggregateInformation']['gmd:initiativeType']['gmd:DS_InitiativeTypeCode']['@codeListValue']
          var identifiers = JSONPATH.query(node, "$..['gmd:MD_Identifier']..['#text']")
          if (identifiers.length > 0) {
            metadata.related.siblings.push(
              {
                initiativeType: initiative,
                title: identifiers[0],
                id: identifiers[0]
              })
            }
        })
    }
    function extractBboxJson (json) {
        if (json === undefined) {
          return null
        }
        var latmin = json['gmd:southBoundLatitude']['gco:Decimal']['#text']
        var latmax = json['gmd:northBoundLatitude']['gco:Decimal']['#text']
        var lngmin = json['gmd:westBoundLongitude']['gco:Decimal']['#text']
        var lngmax = json['gmd:eastBoundLongitude']['gco:Decimal']['#text']
        
        var coordinates = [[[parseFloat(lngmin), parseFloat(latmin)],
                            [parseFloat(lngmin), parseFloat(latmax)],
                            [parseFloat(lngmax), parseFloat(latmax)],
                            [parseFloat(lngmax), parseFloat(latmin)],
                            [parseFloat(lngmin), parseFloat(latmin)]]]
        return coordinates
    }
    function extractConstraints (json, idLang) {
        if (!json) {
        return null
        }
        var constraints = []
        if (!json || json.length === 0) {
        return null
        }
        json.forEach (function (node) {
        var list = node['gmd:otherConstraints']
        if (list ) {
          var list = !list.forEach ? [list] : list
          list.forEach(function (constraint) {
            constraints.push(extractFromLangs(constraint, idLang))
          })
        }
        var list = node['gmd:useLimitation']
        if (list ) {
          var list = !list.forEach ? [list] : list
          list.forEach(function (constraint) {
            constraints.push(extractFromLangs(constraint, idLang))
          })
        }
        })
        return constraints
    }
    function extractContacts (json, idLang) {

         var contacts = []
        if (!json) {
          return contacts
        }
        if (json.length > 0) {
          json.forEach (function (jsoncontact) {
             contacts.push(extractContact(jsoncontact, idLang))
          })
        } else {
          contacts.push(extractContact(json, idLang))
        }
        var resp = {}
         contacts.forEach(function (contact) {
          if (resp[contact[0]]) {
            resp[contact[0]].push(contact)
          } else {
            resp[contact[0]] = [contact]
          }
        })
        return resp
    }
    function extractContact (json, idLang) {
        var role = JSONPATH.query(json, "$..['gmd:CI_RoleCode']['@codeListValue']")[0]
        var organisationNode  = JSONPATH.query(json, "$..['gmd:organisationName']" )[0]
        var organisation = extractFromLangs(organisationNode, idLang)
        var organisationLink = extractHref(organisationNode)
        var nameNode = JSONPATH.query(json, "$..['gmd:individualName']" )[0]
        var name = extractFromLangs(nameNode, idLang)
        var individualLink = extractHref(nameNode)
            // JSONPATH.query(json, "$..['gmd:individualName']['gco:CharacterString']" )[0]
        var email = JSONPATH.query(json, "$..['gmd:electronicMailAddress']..['#text']")[0]
        var address = extractAddress(JSONPATH.query(json, "$..['gmd:CI_Address']")[0])
        var position = null
        return [role, type, organisation, name, email, position, null, address, organisationLink, individualLink]
    }
    function extractCrs (metadata, json, idLang) {
        var crs = JSONPATH.query(json, "$..['gmd:referenceSystemInfo']..['gmd:code']")
        metadata.crs = []
        crs.forEach(function(node) {
            metadata.crs.push(extractFromLangs(node, idLang))
        })
    }
    function extractDates (metadata, json) {
        if (!json || json === 'undefined' || json.length === 0) {
          return
        }
        json.forEach(function (jsonDate) {
          var key = jsonDate['gmd:dateType']['gmd:CI_DateTypeCode']['@codeListValue']
          var value = jsonDate['gmd:date']['gco:Date'] ? jsonDate['gmd:date']['gco:Date']['#text'] : jsonDate['gmd:date']['gco:DateTime']['#text']
          metadata[key + 'Date'] = value
        })
    }
    function extractDistributionInfo (metadata, json, idLang) {
        var json2 = json['gmd:distributionInfo']['gmd:MD_Distribution']['gmd:distributionFormat'] || {}
        extractFormat(metadata, json2, idLang)
        extractLinks (metadata, json, idLang) 
    }
    function extractExtent (metadata, json) {
        metadata.temporalExtents = []
        var start = JSONPATH.query(json, "$..['gml:beginPosition']")
        if (start.length > 0) {
            var temp = {start: {date: start[0]}}
       
            var end = JSONPATH.query(json, "$..['gml:endPosition']")
            if (end.length > 0) {
              temp.end = {date: end[0]}
            }
            metadata.temporalExtents.push(temp)
        }
        var geographics = JSONPATH.query(json, "$..['gmd:EX_GeographicBoundingBox']")
        if (geographics.length === 0) {
          return
        }
        
        if (geographics.length > 1) {
          metadata.geojson = {
              type: 'FeatureCollection',
              features: []
          }
          geographics.forEach(function (boxjson) {
           // var bbox = extractBboxJson(boxjson)
            metadata.geojson.features.push({
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: extractBboxJson(boxjson)
                }
            })
          })
        } else {
          metadata.geojson = {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: extractBboxJson(geographics[0])
                }
            }
        }
    }
    function extractFormat (metadata, json, idLang) {
        var formats = []
        var nodes = JSONPATH.query(json, "$..['gmd:MD_Format']")
        if (nodes === undefined) {
          return formats
        }
        if (!nodes.forEach) {
          nodes = [nodes]
        }
        nodes.forEach(function (format) {
           formats.push(extractFromLangs(format['gmd:name'], idLang))
        })
        metadata.format = formats
    }
    /**
     * Extract needed role to use fonctionnality
     * from api description like
     * search=free;view=MACHIN_V;download=MACHIN_VD
     **/
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
    function extractHref (json) {
        if (json === undefined) {
          return null
        }
        var values = JSONPATH.query(json, "$..['gmx:Anchor']['@xlink:href']")
        if (values.length > 0) {
          return values[0]
        }
        return null
    }
    function extractFromLangs(json, idLang) {
        var value = null
        if (json === undefined) {
          return null
        }
        if (idLang) {
          var values = JSONPATH.query(json, "$..['gmd:LocalisedCharacterString']")
          if (values.length > 0) {
            values.forEach(function (node) {
              if (node['@locale'] === '#' + idLang && node['#text']) {
                value = node['#text']
              }
            })
          }
        }
        if (!value) {
          json = json.length > 0 ? json[0] : json
          value = json['gco:CharacterString']? json['gco:CharacterString']['#text'] : (json['gmx:Anchor'] ? json['gmx:Anchor']['#text'] : null)
        }
        return value
    }
    function extractImages (json, idLang) {
        var images = []
        if (json === undefined) {
          return null
        }
        if (!json.forEach) {
          json = [json]
        }
        json.forEach(function (image) {
         if (image['gmd:MD_BrowseGraphic']['gmd:fileName']['gco:CharacterString']) {
          var file = image['gmd:MD_BrowseGraphic']['gmd:fileName']['gco:CharacterString']['#text']
          var description = extractFromLangs(image['gmd:MD_BrowseGraphic']['gmd:fileDescription'], idLang)
          images.push(['overview', file, description ? description : ''])
          }
        })
        return images
    }
    function extractKeywords (metadata, json, idLang) {
    
        var keywords = []
        if (json) 
        json.forEach(function (keynode) {
            var list = keynode['gmd:MD_Keywords']['gmd:keyword']
            var type = JSONPATH.query(keynode, "$..['gmd:MD_KeywordTypeCode']['@codeListValue']")
            if (type) {
                type = type[0]
            } else {
                type = null
            }
            var isDataCenter = false
            if (keynode['gmd:MD_Keywords']['gmd:thesaurusName']) {
                var key = JSONPATH.query(keynode['gmd:MD_Keywords']['gmd:thesaurusName'], "$..['gmd:identifier']..['gmd:code']['gmx:Anchor']['#text']")[0]
                console.log(key)
                if (key) {
                    var keys = key.split('.')
                    type = keys[3]
                    var key = 'th_' + keys.slice(4, keys.length + 1).join('.')
                    
                    var name = JSONPATH.query(keynode['gmd:MD_Keywords']['gmd:thesaurusName'], "$..['gmd:title']..['#text']")
                    
                    if (catalog.organismThesaurus && key.indexOf(catalog.organismThesaurus.th_name) >= 0) {
                        console.log('est dataCenter ', key)
                        isDataCenter = true
                    }
                }
            }
            if (!list.forEach) {
              list = [list]
            }
            
            var kwds = []
            if (isDataCenter) {
                metadata.dataCenter = []
            }
            list.forEach (function (node) {
              var keywd = extractFromLangs(node, idLang)
              var link = JSONPATH.query(node, "$..['gmx:Anchor']['@xlink:href']")
              if (link) {
                  link = link[0]
              }
              if (keywd) {
                kwds.push({
                    name: extractFromLangs(node, idLang),
                    link: link
                })
                if (isDataCenter) {
                    metadata.dataCenter.push(catalog.organisms[link])
                    // metadata.cds = link.substring(link.lastIndexOf('#') + 1)
                }
              }
            })
            keywords.push({
                type: type,
                key: key,
                keywords: kwds
            })
        })
        metadata.keyword = keywords
    } 
    function extractLineage(metadata, json, idLang) {
        metadata.lineage = 'un tesst curiosité'
        var statements = JSONPATH.query(json, "$..['gmd:statement']")
        var sentences = []
        statements.forEach(function (statement) {
          var sentence = extractFromLangs(statement, idLang)
          if (sentence) {
            sentences.push(sentence.replace(/(?:\\[rn]|[\r\n])/g, '<br />'))
          }
        })
        metadata.lineage = sentences
    }
    function extractLinks (metadata, json, idLang, uuid) {
        var list = {}
        var links = JSONPATH.query(json, "$..['gmd:CI_OnlineResource']")
        if (links[0] && links[0].length > 0) {
          var aux = []
          links.forEach(function (link) {
            aux = aux.concat(link)
          })
          links = aux
        }
        links.forEach(function (online, index) {
             var protocol = 'WWW:LINK-1.0-http--link'
             if (online['gmd:protocol']['gmx:Anchor']) {
               var protocol = online['gmd:protocol']['gmx:Anchor']['#text']
             } else if (online['gmd:protocol']['gco:CharacterString'] ) {
              var protocol = online['gmd:protocol']['gco:CharacterString']['#text'] 
             }
              var url = online['gmd:linkage']['gmd:URL']
              var name = extractFromLangs(online['gmd:name'], idLang)
              var description = extractFromLangs(online['gmd:description'], idLang)
              var link = {
                  id: index,
                  name: name,
                  description: description,
                  url: url,
                  type: protocol
                }
              switch(protocol) {
                  case 'UKST':
                  case 'OpenSearch':
                  case 'Opensearch':
                  case 'opensearch':
                  case 'SensorThings':
                  case 'STAC':
                    var obj =  extractAccessFromDescription(description, url)
                    console.log(url)
                    if (!list.api) {
                        list.api = {}
                    }
                    list.api[protocol] = {
                      url: obj.url,
                      name: name,
                      protocol: protocol,
                      access: obj.access,
                      query: obj.query
                    }
                    metadata[protocol.toLowerCase()] = url
                    break;
                  case 'GetMap':
                  case 'WTS':
                  case 'WMTS':
                  case 'OGC API - Tiles':
                  case 'XYZ-Tile-Service':
                  case 'OGC:WMS': 
                  case 'OGC:WMS-1.1.1-http-get-map':
                  case 'OGC:WFS':
                  case 'OGC:WFS-G':
                  case 'OGC:KML':
                  case 'OGC:OWS':
                  case 'OGC:OWS-C':
                  case 'OGC Web Map Service':
                  case 'GLG:KML-2.0-http-get-map':
                      if (!list.layers) {
                        list.layers = []
                      }
                      var id = uuid + '_' + list.layers.length
                      link.id = id
                      list.layers.push(link)
                    break;
                  case 'application/vnd.google-earth.kml+xml':
                  case 'WWW:DOWNLOAD-1.0-ftp--download':
                     break;
                  case 'WWW:DOWNLOAD-1.0-link--download':
                  
                  case 'telechargement':
                  case 'download':
                  case 'WWW:DOWNLOAD-1.0-http--download':
                    if (!list.download) {
                      list.download = []
                    }
                    
                    list.download.push(link)
                    break;
                  case 'WWW:DOWNLOAD-1.0-link--order':
                  case 'order':
                    if (!list.order) {
                      list.order = []
                    }
                    list.order.push(link)
                    break;
                  case 'WWW:LINK-1.0-http--related':
                    if (!list.relatedLinks) {
                      list.relatedLinks = []
                    }
                    list.relatedLinks.push(link)
                    break;
                  case 'WWW:LINK-1.0-http--link':
                  case 'WWW:LINK-1.0-http--partners':
                  case 'DOI':
                  default:
                    if (!list.links) {
                      list.links = []
                    }
                   
                    list.links.push(link)
                    break;
                  }
        })
        metadata.links = list
    }
    function extractResolution (metadata, json) {
        if (json === undefined) {
          return
        }
        var dist = JSONPATH.query(json, "$..['gco:Distance']")
        var denominator = JSONPATH.query(json, "$..['gmd:denominator']['gco:Integer']")
        var resolution = []
        if (dist && dist.length > 0) {
           var list = dist.map(d => d['#text'] + ' ' + d['@uom'] )
           resolution = list
        
        } 
        if (denominator && denominator.length > 0) {
            var list = dist.map(d => '1 / ' + d['#text'])
            resolution = resolution.concat(list)
        }
        
        metadata.resolution = resolution
    }
    function extractSpatialRepresentation (metadata, json) {
        if (json === undefined) {
          return
        }
        if (json['gmd:MD_SpatialRepresentationTypeCode'] && json['gmd:MD_SpatialRepresentationTypeCode']['@codeListValue']) {
          metadata.representation = json['gmd:MD_SpatialRepresentationTypeCode']['@codeListValue']
        }
    }
    return {transform: transform}
}