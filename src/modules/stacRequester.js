export default function (url, access) {
    console.log(url)
    const stacParameters = []
    const mappingParameters =  {}
    const parameters =  {page: 1, limit: 8}
    const predefined =  {
         start: "start",
         end: "end",
         box: "box",
         maxRecords: "limit",
         index: "offset",
         page: "page"
       }
    const defaultQuery = {}
    const searchUr = url
    const count = 0
    function getRecords (route) {
    }
    return {getRecords: getRecords}
}