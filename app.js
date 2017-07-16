'use strict';

require('dotenv').config();

var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var fs = require('fs')

var five = require("johnny-five");
var board = new five.Board({ port: process.env.SERIAL_PORT});

var app = express()

// Declare folder path
var folderPath = __dirname + '/public'

// Parse incoming requests
app.use(bodyParser.json())

// Mount your static paths
// Renders your image, title, paragraph and index.html
app.use(express.static(folderPath))

// Read file index and send
app.get('/',function(req, res){
	res.sendFile(path.join(__dirname + '/index.html'));
})

// Start board johnny five
board.on("ready", function() {
	console.log('Board is ready');

	var focus_a = new five.Led(10);
	var focus_b = new five.Led(9);

	// Request with method get to webhook
	app.get('/webhook',function(req, res){
		if(req.query['hub.verify_token'] === 'hello_token'){
			res.send(req.query['hub.challenge'])
		}else{
			res.send('Invalid token');
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
	function getMessage(messagingEvent){
		var senderID = messagingEvent.sender.id
		var messageText = messagingEvent.message.text

		evaluateTextMessage(senderID, messageText)
	}

	// Evaluate text message
	function evaluateTextMessage(senderID, messageText){
		let message = "";
		
		switch (messageText) {
			case "@help":
				message = "I can help you :)";
				break;
			case "@focus":
				message = "Focus a & b: 1.-  2.-  ";
				break;
			case "@turn_on_focus_a":
				focus_a.on();
				message = "Focus on :)";
				break;
			case "@turn_off_focus_a":
				focus_a.off();
				message = "Focus on :)";
				break;
			case "@turn_on_focus_b":
				focus_b.on();
				message = "Focus off :(";
				break;
			case "@turn_off_focus_b":
				focus_b.off();
				message = "Focus off :(";
				break;
			default:
				message = "Sorry, we are out of service.";
		}

		SendTextMessage(senderID, message);
	}

	// Send text message
	function SendTextMessage(senderID, message){
		var messageData = {
			recipient : {
				id: senderID
			},
			message: {
				text: message
			}
		}

		callSendApi(messageData)
	}

	// Calling API to send message
	function callSendApi(messageData){
		request({
			uri: 'https://graph.facebook.com/v2.9/me/messages',
			qs: {access_token: process.env.APP_TOKEN},
			method: 'POST',
			json: messageData
		},function(error, response, data){
			if(error){
				console.log('Cannot send message');
			}
			else{
				console.log('Successful message');
			}
		});
	}

	// Start the server.
	app.listen(process.env.PORT || 3000,function(){
		console.log('Listening localhost:' + process.env.PORT || 3000)
	})
});



