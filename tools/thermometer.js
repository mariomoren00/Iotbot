var five = require("johnny-five");

var thermometer = new five.Thermometer({
  controller: "DHT11_I2C_NANO_BACKPACK"
});

thermometer.on("change", function() {
  console.log("Thermometer");
  console.log("  celsius           : ", this.celsius);
  console.log("  fahrenheit        : ", this.fahrenheit);
  console.log("  kelvin            : ", this.kelvin);
  console.log("--------------------------------------");
});
