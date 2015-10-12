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

client = bayeux.getClient()

client.subscribe '/events', (msg) ->
    if msg.device is 'midi'
        if msg.status is 'control change'
            client.publish "/midi", status: msg.status, controller: msg.controller, value: msg.value

    console.log msg

client.subscribe '/heartbeat', (msg) ->
    console.log msg

# setInterval ->
    # client.publish '/heartbeat', {event: 'heartbeat', ts: (new Date()).toISOString()}
# , 10000

server.listen SERVER_PORT
console.log "Server started and listening on port #{SERVER_PORT}"
