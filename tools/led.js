var five = require("johnny-five");

var led = new five.Led(13);

led.blink(500);
