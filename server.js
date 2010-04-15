var tools = require('./node.websocket.js/tools'),
    websocket = require('./node.websocket.js/websocket');

new websocket.Server(tools.argvToObject(process.ARGV));