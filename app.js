'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const fs = require('fs')

const APP_TOKEN = 'EAAEi5xta9rUBAMZAoklTSPikydMZBSADVZBvVAkwP5jvhxuQwt0NMbnrGXoragec3xcCrZAMRB5OPR18vht7igKB21PZCSYZCVsk0IM0JTZCvwGAEWjZCNKCIj7D2sZChSZB1uiH3IHmcF2pmMc7g6pGYgYMZASJ34R9cm7HcUuLmp7LAZDZD';

var app = express()
const folderPath = __dirname + '/app'

app.use(bodyParser.json())

// Declare port 
var PORT = process.env.PORT || 3000;

// Mount your static paths
// Renders your image, title, paragraph and index.html
app.use(express.static(folderPath))

// Start the server.
app.listen(PORT,function(){
	console.log('Listening localhost:3000')
})

// Read file index and send 
app.get('/',function(req, res){
	res.sendFile(path.join(__dirname + '/index.html'));
})

// Request with method get to webhook 
app.get('/webhook',function(req, res){
	if(req.query['hub.verify_token'] === 'hello_token'){
		res.send(req.query['hub.challenge'])
	}else{
		res.send('text');
	}
})

// Request with method post to webhook
app.post('/webhook',function(req, res){
	var data = req.body

	if(data.object == 'page'){
		data.entry.forEach(function(pageEntry){
			pageEntry.messaging.forEach(function(messagingEvent){
				if(messagingEvent.message){					
					getMessage(messagingEvent)
				}
			})
		})
	}
	res.sendStatus(200)
})

// Get text messages
function getMessage(event){
	var senderID = event.sender.id
	var messageText = event.message.text
	
	evaluateTextMessage(senderID, messageText)
}

// Evaluate text message
function evaluateTextMessage(senderID, messageText){
	
}

