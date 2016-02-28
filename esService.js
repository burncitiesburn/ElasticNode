var indexName = "index";
var type = "type";

var elasticsearch = require('elasticsearch');

var elas_client = new elasticsearch.Client({
  host: '192.168.99.100:9200',
  log: 'trace'
});


/**
* Delete an existing index
*/
function deleteIndex() {  
    return elas_client.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
* create the index
*/
function initIndex() {  
    return elas_client.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/**
* check if the index exists
*/
function indexExists() {  
    return elas_client.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;  

function initMapping() {  
    return elas_client.indices.putMapping({
        index: indexName,
        type: "document",
        body: {
            properties: {
                title: { type: "string" },
                content: { type: "string" },
                suggest: {
                    type: "completion",
                    analyzer: "simple",
                    search_analyzer: "simple",
                    payloads: true
                }
            }
        }
    });
}
exports.initMapping = initMapping;

function addDocument(document) {  
    return elas_client.index({
        index: indexName,
        type: "document",
        body: {
            title: document.title,
            content: document.content,
            suggest: {
                input: document.title.split(" "),
                output: document.title,
                payload: document.metadata || {}
            }
        }
    });
}
exports.addDocument = addDocument;

function getSuggestions(input) {  
    return elas_client.suggest({
        index: indexName,
        type: "document",
        body: {
            docsuggest: {
                text: input,
                completion: {
                    field: "suggest",
                    fuzzy: true
                }
            }
        }
    })
}
exports.getSuggestions = getSuggestions;