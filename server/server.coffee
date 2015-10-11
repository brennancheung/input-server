http       = require 'http'
faye       = require 'faye'
express    = require 'express'
bodyParser = require 'body-parser'

SERVER_PORT = 4000

app = express()

app.use bodyParser.json()

app.use (req, res, next) ->
    console.info "#{req.method} #{req.url}"
    next()

app.use '/inputs', express.static "#{__dirname}/inputs"

app.all '*', (req, res) ->
    res.status(404).send 'not found'

app.use (err, req, res, next) ->
    console.log "-------------------------------"
    console.log err.stack
    res.status(500).send "<pre>#{err.stack}</pre>"

server = http.createServer app

bayeux = new faye.NodeAdapter mount: "/events", timeout: 60
bayeux.attach server

notifyClient = bayeux.getClient()

notifyClient.subscribe '/events', (msg) ->
    console.log msg

notifyClient.subscribe '/heartbeat', (msg) ->
    console.log msg

setInterval ->
    notifyClient.publish '/heartbeat', {event: 'heartbeat', ts: (new Date()).toISOString()}
, 10000

server.listen SERVER_PORT
console.log "Server started and listening on port #{SERVER_PORT}"
