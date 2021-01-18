    /* pour encoder 22.04
    * 100 = 2204
    2204 >> 8 = 8
    2204 % 256 = 156
    bytes = {8, 156}

    Pour recomposer :

    8 << 8 = 2048
    2048 + 156 = 2204
    2204 / 100 = 22.04
    */
const fft_bin_freq = 3.937752016

const payloadOptionsVerifier = {
    "3": "<td><div class=\"Elements\" id=\"WeightDiv\"><input type=\"checkbox\" id=\"WeightPresence\" onClick=\"WeightPresence()\">Weight Presence</input><div id=\"WeightElements\"></div></div></td>" +
    "<td><div class=\"Elements\" id=\"TempDiv\"><input type=\"checkbox\" id=\"TemperaturePresence\" onClick=\"TemperaturePresence()\">Temperature Presence</input><div id=\"TemperatureElements\"></div></div></td>" +
    "<td><div class=\"Elements\" id=\"FFTDiv\"><input type=\"checkbox\" id=\"FFTPresence\" onClick=\"FFTPresence()\">FFT Presence</input><div id=\"FFTElements\"></div></div></td>" +
    "<td><div class=\"Elements\" id=\"BME280Div\"><input type=\"checkbox\" id=\"BME280Presence\" onClick=\"BME280Presence()\">BME280 Presence</input><div id=\"BME280Elements\"></div></div></td>",
    "4": "<td><div class=\"Elements\" id=\"AlarmDiv\"><label>Alarm Type :<select id=\"AlarmSelection\"><option value=\"0\">ds18b20</option><option value=\"1\">bme280</option><option value=\"2\">hx711</option><option value=\"3\">audio_adc</option><option value=\"4\">nrf_adc</option><option value=\"5\">sq_min</option><option value=\"6\">attec</option><option value=\"7\">buzzer</option><option value=\"8\">lorawan</option><option value=\"9\">mx_flash</option><option value=\"10\">nrf_flash</option><option value=\"11\">application</option></select></label></div></td>" + 
    "<td><div class=\"Elements\" id=\"WeightDiv\"><input type=\"checkbox\" id=\"WeightPresence\" onClick=\"WeightPresence()\">Weight Presence</input><div id=\"WeightElements\"></div></div></td>" +
    "<td><div class=\"Elements\" id=\"TempDiv\"><input type=\"checkbox\" id=\"TemperaturePresence\" onClick=\"TemperaturePresence()\">Temperature Presence</input><div id=\"TemperatureElements\"></div></div></td>" +
    "<td><div class=\"Elements\" id=\"FFTDiv\"><input type=\"checkbox\" id=\"FFTPresence\" onClick=\"FFTPresence()\">FFT Presence</input><div id=\"FFTElements\"></div></div></td>" +
    "<td><div class=\"Elements\" id=\"BME280Div\"><input type=\"checkbox\" id=\"BME280Presence\" onClick=\"BME280Presence()\">BME280 Presence</input><div id=\"BME280Elements\"></div></div></td>"
}

const fwVersionPort1 = {
    "1": "",
    "2": "",
    "3": ""
}

const payloadOptions = {
    "weightNum" : "<label>Number of sensors :</label><br><input type=\"number\" min=1 value=1 id=\"WeightSensorsCount\" placeholder=\"Number of weight sensors\" onChange=\"addWeightInput()\"></input><br><label>Weight Value (kg, w_v) :</label><div class=\"Inputs\"id=\"WeightInput\"></div><br>",
    "weight" : "<input type=\"text\" class=\"WeightValues\" placeholder=\"Weight (kg)\" onChange=\"checkWeight(this)\"></input><br>",
    "tempNum": "<label>Number of sensors :</label><br><input type=\"number\" min=1 value=1 id=\"TemperatureSensorsCount\" placeholder=\"Number of temperature sensors\" onChange=\"addTemperatureInput()\"></input><br><label>Temperature Value (C°, t_i) :</label><div class=\"Inputs\"id=\"TemperatureInput\"></div><br>",
    "temperature": "<input type=\"text\" class=\"TemperatureValues\" placeholder=\"Temperature (C°)\"></input><br>",
    "FFTNum": "<label>Number of sensors :</label><br><input type=\"number\" min=0 value=1 id=\"FFTSensorsCount\" placeholder=\"Number of FFT sensors\" onChange=\"refreshFFTInput()\"></input><input type=\"number\" min=1 max=255 id=\"stopFFTBIN\" placeholder=\"Stop bin\" onChange=\"changeFFTInterval()\"></input><input type=\"number\" min=0 max=254 id=\"startFFTBIN\" placeholder=\"Start bin\" onChange=\"changeFFTInterval()\"></input><input type=\"number\" min=1 max=255 id=\"HzPFFTBIN\" placeholder=\"Hz interval\" readonly></input><br><label>FFT Value (Abstract, s_bin) :</label><div class=\"Inputs\"id=\"FFTInput\"></div><br>",
    "FFT": "<input type=\"text\" class=\"FFTValues\" placeholder=\"FFT\"></input><br>",
    "BME280Fields": "<label>Temperature (C°, t) :<input type=\"text\" class=\"BME280Values\" id=\"BME280t\" placeholder=\"BME280 C°\"></input></label><br><label>Humidity (%, h) :<input type=\"text\" onChange=\"checkBME280H(this)\" class=\"BME280Values\" id=\"BME280h\" placeholder=\"BME280 H%\"></input></label><br><label>Pressure (hPA, p) :<input type=\"text\" onChange=\"checkBME280P(this)\"class=\"BME280Values\" id=\"BME280p\" placeholder=\"BME280 hPA\"></input></label>"
}

const payloadInputForm = {
    "1": "<select id=\"fwSelection\"><option value=\"\" disabled selected>Fw version</option><option value=\"1-3\">v1-3</option><option value=\"4-6\">v4-6</option><option value=\"7+\">v7+</option></select><input type=\"text\" id=\"temperature\" placeholder=\"Temperature outside\"/><input type=\"text\" id=\"humidity\" placeholder=\"Humidity\"/><input type=\"text\" id=\"weight\" placeholder=\"Total Weight (kG)\"/><input type=\"text\" id=\"tempinside\" placeholder=\"Temperature inside\"/><input type=\"text\" id=\"a-i\" placeholder=\"Air i ?\"/><input type=\"text\" id=\"batteryVoltage\" placeholder=\"Battery Voltage\"/><input type=\"text\" id=\"soundTotal\" placeholder=\"Sound total\"/>",
    "3": "<label>Battery Voltage (V, bv) :<input type=\"text\" id=\"inputBatV\" placeholder=\"Battery voltage\" onChange=\"checkBatV(this)\"></input></label><br><label>Battery Percentage (%, b) :<input type=\"number\" min=\"0\" max=\"100\" id=\"inputBatP\" placeholder=\"Battery percentage\" onChange=\"checkBatP(this)\"></input></label>",
    "4": "<label>Battery Voltage (V, bv) :<input type=\"text\" id=\"inputBatV\" placeholder=\"Battery voltage\" onChange=\"checkBatV(this)\"></input></label><br><label>Battery Percentage (%, b) :<input type=\"number\" min=\"0\" max=\"100\" id=\"inputBatP\" placeholder=\"Battery percentage\" onChange=\"checkBatP(this)\"></input></label>"
}

const apiFields = {
    "TTN": "<label>Enter your TTN app Id :<input id=\"app-id\" type=\"text\" placeholder=\"TTN app Id\"></input></label><br>"
}

const portSelection = "<select id=\"portSelection\" onChange=\"portChanged(this)\"><option value=\"\" disabled selected>Select your port</option><option value=\"1\">Port 1</option><option value=\"2\">Port 2</option><option value=\"3\">Port 3</option><option value=\"4\">Port 4</option></select>"

function generatePayload()
{
    var port = document.getElementById("portSelection").value
    var bytesArray = []
    /*if(port == 1)
    {
        var fw_v = document.getElementById("fwSelection").value
        if(fw_v == "1-3")
        {
            bytesArray.push(parseInt(document.getElementById("temperature").value) * 100, parseInt(document.getElementById("humidity").value * 100), parseInt(document.getElementById("weight").value * 100), parseInt(document.getElementById("tempinside").value * 100), parseInt(document.getElementById("a-i").value), parseInt(document.getElementById("batteryVoltage").value * 100), parseInt(document.getElementById("soundTotal").value))
        } else if(fw_v == "4-6")
        {
            
        } else if(fw_v == "7+")
        {

        } else
        {
            return
        }
    }*/
    var logs = controlUserInput()

    if(logs[0])
    {
        document.getElementById("errorMessage").style.backgroundColor = "green"
        document.getElementById("errorMessage").innerHTML = logs[1]
        if(port == 3 || port == 4)
        {
            if(port == 4)
            { 
                bytesArray.push(parseInt(document.getElementById("AlarmSelection").value))
            }
        
            bytesArray.push(27,0,0) // BEEP Base present = true (Will be handled in the future)
            // Seems like the 2 bytes after are impact less, but needed, else the decoder
            // won't work because of index
        
        
            var bv = parseFloat(document.getElementById("inputBatV").value)
        
            bv = bv * 1000
            // Battery Voltage
            bytesArray.push(bv >> 8)
            bytesArray.push(bv % 256)
        
            // Battery percentage
            var bp = parseInt(Math.floor(parseFloat(document.getElementById("inputBatP").value)))
            if(bp > 100)
                bp = 100
            else if(bp < 0)
                bp = 0
            bytesArray.push(bp)
        
            var weight_presence = document.getElementById("WeightPresence").checked
            var weight_sensor_count = 0
            if(weight_presence)
            {
                weight_sensor_count = parseInt(document.getElementById("WeightSensorsCount").value)
            }
        
            if(weight_presence && weight_sensor_count > 0)
            {
                bytesArray.push(10, weight_sensor_count) // 10 means the sensor is present
        
                var weight_values = document.getElementsByClassName("WeightValues")
                for(var i = 0; i < weight_values.length; i++){
                    weight = weight_values.item(i)
                    if(weight.value != "" && weight.value > 0)
                    {
                        // Converting value into 3 bytes
                        var firstByte = weight.value >> 16
                        var secondByte = (weight.value - (firstByte << 16)) >> 8
                        var thirdByte = weight.value % 256
                        bytesArray.push(firstByte, secondByte, thirdByte)
                    } else
                    {
                        bytesArray.push(0,0,0)
                    }
                }
        
            } else
            {
                bytesArray.push(0,0) // Not present
            }
        
            var ds18b20_presence = document.getElementById("TemperaturePresence").checked
            var ds18b20_sensor_count = 0
            if(ds18b20_presence)
            {
                ds18b20_sensor_count = parseInt(document.getElementById("TemperatureSensorsCount").value)
            }
        
            if(ds18b20_presence && ds18b20_sensor_count > 0)
            {
                bytesArray.push(4, ds18b20_sensor_count) // 4 means the sensor is present
                
                var ds18b20_values = document.getElementsByClassName("TemperatureValues")
                for(var i = 0; i < ds18b20_values.length; i++)
                {
                    var ds18b20 = ds18b20_values.item(i)
                    if(ds18b20.value != "")
                    {
                        // Converting value into 2 bytes
                        var ds18b20val = ds18b20.value * 100
                        console.log(ds18b20val)
                        var firstByte = ds18b20val >> 8
                        var secondByte = ds18b20val % 256
                        if(firstByte < 0)
                        {
                            firstByte += 256
                            secondByte += 256
                        }
                        bytesArray.push(firstByte, secondByte)
                    } else
                    {
                        bytesArray.push(0,0) // If the input value =< 0 or void
                        // Handling if value = 0 to avoid useless calculation
                    }
                }
            } else
            {
                bytesArray.push(0,0) // Not present
            }
        
            var fft_presence = document.getElementById("FFTPresence").checked
            var fft_sensor_count = 0
            if(fft_presence)
            {
                fft_sensor_count = parseInt(document.getElementById("FFTSensorsCount").value)
            }
        
            if(fft_presence && fft_sensor_count > 0)
            {
                var start_bin = parseInt(document.getElementById("startFFTBIN").value)
                var stop_bin = parseInt(document.getElementById("stopFFTBIN").value)
                bytesArray.push(12, fft_sensor_count, start_bin, stop_bin) // 12 means the sensor is present
                console.log(fft_sensor_count)
        
                var fft_values = document.getElementsByClassName("FFTValues")
        
                for(var i = 0; i < fft_values.length; i++)
                {
                    var fft_value = fft_values.item(i)
                    var fft_firstByte = fft_value.value >> 8
                    var fft_secondByte = fft_value.value % 256
                    bytesArray.push(fft_firstByte, fft_secondByte)
                }
        
            } else
            {
                bytesArray.push(0,0,0,0) // Required, else BME280 won't work because the starting point of it is 4 bytes away
                // So we need to insert 4 non significant bytes
            }
        
            var BME280_presence = document.getElementById("BME280Presence").checked
        
            if(BME280_presence)
            {
                var BME280_t = document.getElementById("BME280t").value * 100
                var BME280_h = document.getElementById("BME280h").value * 100
                var BME280_p = document.getElementById("BME280p").value
        
                if(BME280_t != 0)
                {
                    var BME280_t_firstByte = BME280_t >> 8
                    var BME280_t_secondByte = BME280_t % 256
                    if(BME280_t_firstByte < 0)
                    {
                        BME280_t_firstByte += 256
                        BME280_t_secondByte += 256
                    }
                } else
                {
                    var BME280_t_firstByte = 0
                    var BME280_t_secondByte = 0
                }
        
                if(BME280_h != 0)
                {
                    var BME280_h_firstByte = BME280_h >> 8
                    var BME280_h_secondByte = BME280_h % 256
                } else
                {
                    var BME280_h_firstByte = 0
                    var BME280_h_secondByte = 0
                }
        
                if(BME280_p != 0)
                {
                    var BME280_p_firstByte = BME280_p >> 8
                    var BME280_p_secondByte = BME280_p % 256
                } else
                {
                    var BME280_p_firstByte = 0
                    var BME280_p_secondByte = 0
                }
        
                bytesArray.push(7, BME280_t_firstByte, BME280_t_secondByte, BME280_h_firstByte, BME280_h_secondByte, BME280_p_firstByte, BME280_p_secondByte) // 7 Means the sensor is present
            } // Do not need else statement because end of payload, it doesn't need to insert anything
            // to match next index
        }
    
        document.getElementById("bytes").innerHTML = bytesArray
    
        var hexPayload = byteToHexPayload(bytesArray)
        document.getElementById("HEX").innerHTML = hexPayload
        test()
    } else
    {
        document.getElementById("errorMessage").style.backgroundColor = "red"
        document.getElementById("errorMessage").innerHTML = logs[1]
    }
}

function byteToHexPayload(bytesArray)
{
    var hexPayload = ""
    for(var i = 0; i < bytesArray.length; i++)
    {
        var hex = bytesArray[i].toString(16)
        if(hex.length < 2)
            hex = "0" + hex
        hexPayload += hex
    }
    return hexPayload.toLocaleUpperCase()
}

function checkBatP(battery)
{
    if(battery.value > 100)
    {
        battery.value = 100
    } else if(battery.value < 0)
    {
        battery.value = 0
    }
}

function checkBatV(battery)
{
    if(battery.value < 0)
    {
        battery.value = 0
    }
}

function checkBME280H(BME280h)
{
    if(BME280h.value > 100)
    {
        BME280h.value = 100
    } else if(BME280h.value < 0)
    {
        BME280h.value = 0
    }
}

function checkBME280P(BME280p)
{
    if(BME280p.value < 0)
    {
        BME280p.value = 0
    }
}

function checkWeight(Weight)
{
    if(Weight.value < 0)
    {
        Weight.value = 0
    }
}

function portChanged(comboPort)
{
    var port = comboPort.value
    document.getElementById("decodingPort").value = port
    if(port == 3 || port == 4)
    {
        document.getElementById("payloadInputForm").innerHTML = payloadInputForm[port]
        document.getElementById("optionSelector").innerHTML = payloadOptionsVerifier[port]
    } else if(port == 1)
    {
        document.getElementById("payloadInputForm").innerHTML = payloadInputForm[port]
        document.getElementById("optionSelector").innerHTML = ""
    } else if(port == 2)
    {
        return
    }
}

function WeightPresence()
{
    var checked = document.getElementById("WeightPresence").checked
    if(checked)
    {
        document.getElementById("WeightElements").innerHTML = payloadOptions["weightNum"]
        addWeightInput()
    } else
        document.getElementById("WeightElements").innerHTML = ""
}

function addWeightInput()
{
    var sensor_count = document.getElementById("WeightSensorsCount").value
    document.getElementById("WeightInput").innerHTML = payloadOptions["weight"].repeat(sensor_count)
}

function TemperaturePresence()
{
    var checked = document.getElementById("TemperaturePresence").checked
    if(checked)
    {
        document.getElementById("TemperatureElements").innerHTML = payloadOptions["tempNum"]
        addTemperatureInput()
    } else
        document.getElementById("TemperatureElements").innerHTML = ""
}

function addTemperatureInput()
{
    var sensor_count = document.getElementById("TemperatureSensorsCount").value
    document.getElementById("TemperatureInput").innerHTML = payloadOptions["temperature"].repeat(sensor_count)
}

function FFTPresence()
{ 
    var checked = document.getElementById("FFTPresence").checked
    if(checked)
    {
        document.getElementById("FFTElements").innerHTML = payloadOptions["FFTNum"]
        refreshFFTInput()   
    } else
        document.getElementById("FFTElements").innerHTML = ""
}

function refreshFFTInput()
{
    setFFTInterval()
    var sensor_count = document.getElementById("FFTSensorsCount").value
    document.getElementById("FFTInput").innerHTML = payloadOptions["FFT"].repeat(sensor_count)
    var FFTValues = document.getElementsByClassName("FFTValues")

    // Just to be sure that we're not taking wrong value
    var StartBIN = document.getElementById("startFFTBIN").value
    var StopBIN = document.getElementById("stopFFTBIN").value


    StartBIN = parseInt(StartBIN)
    StopBIN = parseInt(StopBIN)
    var fft_bin_total = StopBIN - StartBIN
    var summed_bins = Math.ceil(fft_bin_total * 2 / sensor_count)

    for(var i = 0; i < FFTValues.length; i++)
    {
        var start_freq = Math.round(((StartBIN * 2) + i * summed_bins) * fft_bin_freq)
        var stop_freq = Math.round(((StartBIN * 2) + (i+1) * summed_bins) * fft_bin_freq)
        FFTValues.item(i).placeholder = "FFT " + start_freq.toString() + "-" + stop_freq.toString()
    }
}

function changeFFTInterval()
{
    var startBIN = document.getElementById("startFFTBIN")
    var stopBIN = document.getElementById("stopFFTBIN")
    var startBINval = parseInt(startBIN.value)
    var stopBINval = parseInt(stopBIN.value)
    if(startBINval != null && stopBINval != null)
    {
        if(startBINval >= stopBINval)
        {
            document.getElementById("startFFTBIN").value = stopBINval - 1
        }
        if(startBINval > 254)
            document.getElementById("startFFTBIN").value = 254
        else if(startBINval < 0)
            document.getElementById("startFFTBIN").value = 0

        if(stopBINval > 255)
            document.getElementById("stopFFTBIN").value = 255
        else if(stopBINval < 1)
            document.getElementById("stopFFTBIN").value = 1
        setFFTInterval()
        refreshFFTInput()
    }
}

function setFFTInterval()
{
    var startBIN = document.getElementById("startFFTBIN")
    var stopBIN = document.getElementById("stopFFTBIN")
    if(startBIN.value != "" && stopBIN.value != "")
    {
        var startBINval = parseInt(startBIN.value)
        var stopBINval = parseInt(stopBIN.value)
        var bin_total = stopBINval - startBINval
        var bin_amount = parseInt(document.getElementById("FFTSensorsCount").value)
        var summed_bins = Math.ceil(bin_total * 2 / bin_amount)
        var hz_per_bin = Math.round(summed_bins * fft_bin_freq)
        document.getElementById("HzPFFTBIN").value = hz_per_bin
    }
}

function BME280Presence()
{
    var checked = document.getElementById("BME280Presence").checked
    if(checked)
    {
        document.getElementById("BME280Elements").innerHTML = payloadOptions["BME280Fields"]
    } else
    { 
        document.getElementById("BME280Elements").innerHTML = ""
    }
}

function controlUserInput()
{
    var port = document.getElementById("portSelection").value

    if(port != "")
    {

        if(port == 3 || port == 4)
        {
            var b = document.getElementById("inputBatP").value
            var bv = document.getElementById("inputBatV").value
            if(isNaN(b) || b == "")
            {
                return [false, ("Please enter correct battery percentage")]
            } else if(isNaN(bv) || bv == "")
            {
                return [false, ("Please enter correct battery voltage")]
            }

            if(document.getElementById("TemperaturePresence").checked)
            {
                var tempValue = document.getElementsByClassName("TemperatureValues")
                for(var i = 0; i < tempValue.length; i++)
                {
                    if(isNaN(tempValue.item(i).value))
                    {
                        return [false, ("Invalid temperature " + (i + 1).toString())]
                    }
                }
            }

            if(document.getElementById("WeightPresence").checked)
            {
                var weightValues = document.getElementsByClassName("WeightValues")
                for(var i = 0; i < weightValues.length; i++)
                {
                    if(isNaN(weightValues.item(i).value) || parseFloat(weightValues.item(i).value) < 0)
                    {
                        return [false, ("Invalid weight " + (i + 1).toString())]
                    }
                }
            }

            if(document.getElementById("FFTPresence").checked)
            {
                var startBIN = document.getElementById("startFFTBIN").value
                var stopBIN = document.getElementById("stopFFTBIN").value

                if(parseInt(startBIN) >= parseInt(stopBIN) || startBIN == "" || stopBIN == "")
                {
                    return [false, ("Invalid FFT start or stop value")]
                }
                var fftValues = document.getElementsByClassName("FFTValues")
                for(var i = 0; i < fftValues.length; i++)
                {
                    if(isNaN(fftValues.item(i).value))
                    {
                        return [false, ("Invalid FFT " + (i + 1).toString())]
                    }
                }
            }
            
            if(document.getElementById("BME280Presence").checked)
            {
                var bme280Values = document.getElementsByClassName("BME280Values")
                for(var i = 0; i < bme280Values.length; i++)
                {
                    if(isNaN(bme280Values.item(i).value))
                    {
                        return [false, ("Invalid BME280 " + (i + 1).toString())]
                    }
                }
                if(bme280Values.item(1).value < 0)
                {
                    return [false, ("Invalid BME280 Humidity")]
                } else if(bme280Values.item(2).value < 0)
                {
                    return [false, ("Invalid BME280 Pressure")]
                }
            }
        }
    } else
    {
        return [false, ("Select port")]
    }

    return [true, ("OK")]
}


function Decoder(bytes, port) {
    // BEEP TTN mesurement system LoRa payload decoder
    // Decode an uplink message from a buffer
    // (array) of bytes to an object of fields.
    var decoded = {};

    function toHexString( number, width )
    {
      //console.log('toHexString', number, width);
      width -= number.toString(16).length;
      if ( width > 0 )
      {
        return new Array( width + (/\./.test( number.toString(16) ) ? 2 : 1) ).join( '0' ) + number.toString(16);
      }
      return number.toString(16) + ""; // always return a string
    }
  
    function hexToInt(hex, size) 
    {
      var a = parseInt(hex, 16);
      if (size == 4 && (a & 0x8000) > 0) {
         a = a - 0x10000;
      }
      return a;
    }
  
    // check ports and convert payload data
    console.log(port)
    if (port == 1)
    {
      decoded.length = bytes.length;
      if (bytes.length == 7) // fw v1-3
      {
        decoded.t     =  bytes[0];
        decoded.h     =  bytes[1];
        decoded.w_v   =  bytes[2];
        decoded.t_i   =  bytes[3];
        decoded.a_i   =  bytes[4];
        decoded.bv    =  bytes[5];
        decoded.s_tot =  bytes[6];
        decoded.long  =  false;
        console.log(decoded)
      }
      else if (bytes.length == 14) // fw v4-6
      {
        decoded.t     =  (bytes[0]  << 8) + bytes[1];
        decoded.h     =  (bytes[2]  << 8) + bytes[3];
        decoded.w_v   =  (bytes[4]  << 8) + bytes[5];
        decoded.t_i   =  (bytes[6]  << 8) + bytes[7];
        decoded.a_i   =  (bytes[8]  << 8) + bytes[9];
        decoded.bv    =  (bytes[10] << 8) + bytes[11];
        decoded.s_tot =  (bytes[12] << 8) + bytes[13];
        decoded.long  =  false;
      }
      else if (bytes.length == 19)  // fw v7+
      {
        decoded.t     =  bytes[0];
        decoded.h     =  bytes[1];
        decoded.w_v   =  bytes[2];
        decoded.t_i   =  bytes[3];
        decoded.a_i   =  bytes[4];
        decoded.bv    =  bytes[5];
        decoded.s_tot =  bytes[6];
        decoded.s_fan_4= bytes[7];
        decoded.s_fan_6= bytes[8];
        decoded.s_fan_9= bytes[9];
        decoded.s_fly_a= bytes[10];
        decoded.w_fl   = (bytes[11] << 8) + bytes[12];
        decoded.w_fr   = (bytes[13] << 8) + bytes[14];
        decoded.w_bl   = (bytes[15] << 8) + bytes[16];
        decoded.w_br   = (bytes[17] << 8) + bytes[18];
        decoded.long   = true;
      }
    }
    else if (port == 2) // BEEP base fw 1.2.0+ start-up message
    {
      if (bytes[0] == 0x01 && bytes.length == 30) // BEEP base fw 1.3.3+ start-up message
      {
        // 0100010003000402935685E6FFFF94540E01237A26A67D24D8EE1D000001
        // 01 00 01 00 03 00 04 02 93 56 85 E6 FF FF 94 54 0E 01 23 7A 26 A6 7D 24 D8 EE 1D 00 00 01 
        // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 
        //    pl  fw version    hw version                 ATTEC ID (14)                 app config
        decoded.beep_base        = true;
        decoded.firmware_version = ((bytes[1] << 8) + bytes[2]) + "." + ((bytes[3] << 8) + bytes[4]) + "." + ((bytes[5] << 8) + bytes[6]);
        decoded.hardware_version = ((bytes[8] << 8) + bytes[9]) + "." + ((bytes[10] << 8) + bytes[11]) + " ID:" + ((bytes[12] << 32) + (bytes[13] << 16) + (bytes[14] << 8) + bytes[15]);
        decoded.hardware_id      = toHexString(bytes[17], 2) + toHexString(bytes[18], 2) + toHexString(bytes[19], 2) + toHexString(bytes[20], 2) + toHexString(bytes[21], 2) + toHexString(bytes[22], 2) + toHexString(bytes[23], 2) + toHexString(bytes[24], 2) + toHexString(bytes[25], 2);
        decoded.measurement_transmission_ratio = (bytes[27]);
        decoded.measurement_interval_min       = ((bytes[28] << 8) + bytes[29]);
      }
      else if (bytes[0] == 0x01 && bytes.length == 26) // Beep base fw < 1.3.2 start-up message
      {
        // 01 00 01 00 03 00 01 02 93 56 85 E6 FF FF 94 54 0E 01 23 7A 26 A6 7D 24 D8 EE 
        // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 
        //    pl  fw version    hw version                 ATTEC ID (14)
        decoded.beep_base        = true;
        decoded.firmware_version = ((bytes[1] << 8) + bytes[2]) + "." + ((bytes[3] << 8) + bytes[4]) + "." + ((bytes[5] << 8) + bytes[6]);
        decoded.hardware_version = ((bytes[8] << 8) + bytes[9]) + "." + ((bytes[10] << 8) + bytes[11]) + " ID:" + ((bytes[12] << 32) + (bytes[13] << 16) + (bytes[14] << 8) + bytes[15]);
        decoded.hardware_id      = toHexString(bytes[17], 2) + toHexString(bytes[18], 2) + toHexString(bytes[19], 2) + toHexString(bytes[20], 2) + toHexString(bytes[21], 2) + toHexString(bytes[22], 2) + toHexString(bytes[23], 2) + toHexString(bytes[24], 2) + toHexString(bytes[25], 2);
      }
      else if (bytes[0] == 0x02 && bytes.length == 40) // BEEP base fw 1.3.3+ start-up message
      {
        // 02250100010003000002000100000002e70e0e01233d2308ec8e91ee1f0000000b03091d0000010a
        // 02 25  01 00 01 00 03 00 00  02 00 01 00 00 00 02 e7 0e  0e 01 23 3d 23 08 ec 8e 91 ee  1f 00 00 00 0b  03 09  1d 00 00 01 0a 
        // 0  1   2  3  4  5  6  7  8   9  10 11 12 13 14 15 16 17  18 19 20 21 22 23 24 25 26 27  28 29 30 31 32  33 34  35 36 37 38 39 
        //    pl  fw version            hw version                  ATTEC ID (14)                     Boot count      ds#    app config
        decoded.beep_base        = true;
        decoded.firmware_version = ((bytes[3] << 8) + bytes[4]) + "." + ((bytes[5] << 8) + bytes[6]) + "." + ((bytes[7] << 8) + bytes[8]);
        decoded.hardware_version = ((bytes[10] << 8) + bytes[11]) + "." + ((bytes[12] << 8) + bytes[13]) + " ID:" + ((bytes[14] << 32) + (bytes[15] << 16) + (bytes[16] << 8) + bytes[17]);
        decoded.hardware_id      = toHexString(bytes[19], 2) + toHexString(bytes[20], 2) + toHexString(bytes[21], 2) + toHexString(bytes[22], 2) + toHexString(bytes[23], 2) + toHexString(bytes[24], 2) + toHexString(bytes[25], 2) + toHexString(bytes[26], 2) + toHexString(bytes[27], 2);
        decoded.bootcount        = ((bytes[29] << 32) + (bytes[30] << 16) + (bytes[31] << 8) + bytes[32]);
        decoded.ds18b20_sensor_amount          = (bytes[34]);
        decoded.measurement_transmission_ratio = (bytes[36]);
        decoded.measurement_interval_min       = ((bytes[37] << 8) + bytes[38]);
      }
    }
    else if (bytes.length >= 15 && ( (port == 3 && bytes[0] == 0x1B) || (port == 4 && bytes[1] == 0x1B) ) )  // BEEP base fw 1.2.0+ measurement message, and alarm message
    {
      //              1B 0C 1B 0C 0E 64  0A 01 FF F6 98  04 02 0A D7 0A DD  0C 0A 00 FF 00 58 00 12 00 10 00 0C 00 0D 00 0A 00 0A 00 09 00 08 00 07  07 00 00 00 00 00 00
      // pl incl fft: 1B 0D 15 0D 0A 64  0A 01 00 00 93  04 00              0C 0A 00 FF 00 20 00 05 00 0C 00 03 00 05 00 09 00 04 00 11 00 06 00 02  07 00 00 00 00 00 00
      //              0  1  2  3  4  5   6  7  8  9  10  11 12              13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36  37 38 39 40 41 42 43
      //                 Batt            Weight          Temp               FFT                                                                      BME280
      // raw pl  1B0C4B0C44640A01012D2D040107D6
      // Payload 1B 0C4B0C4464 0A 01 012D2D 04 01 07D6
      //         6  batt       5  1 weight  5 1-5 temp (1 to 5)
      
      decoded.beep_base = true;
      decoded.alarm     = null; 
  
      var bv_start_byte = 3;
  
      if (port == 4)
      {
        bv_start_byte = 4;
        switch(bytes[0])
        {
          case 0:
            decoded.alarm = 'ds18b20';
            break;
          case 1:
            decoded.alarm = 'bme280';
            break;
          case 2:
            decoded.alarm = 'hx711';
            break;
          case 3:
            decoded.alarm = 'audio_adc';
            break;
          case 4:
            decoded.alarm = 'nrf_adc';
            break;
          case 5:
            decoded.alarm = 'sq_min';
            break;
          case 6:
            decoded.alarm = 'attec';
            break;
          case 7:
            decoded.alarm = 'buzzer';
            break;
          case 8:
            decoded.alarm = 'lorawan';
            break;
          case 9:
            decoded.alarm = 'mx_flash';
            break;
          case 10:
            decoded.alarm = 'nrf_flash';
            break;
          case 11:
            decoded.alarm = 'application';
            break;
        }
      }
  
      // Battery: 0x1B
      decoded.bv = (bytes[bv_start_byte] << 8) + bytes[bv_start_byte+1]; // 1B (0 batt) 0C4B (1-2 vcc) 0C44 (3-4 vbat) 64 (5 %bat)
      decoded.bat_perc = bytes[bv_start_byte+2];
  
      // Weight (1 or 2): 0x0A
      var weight_byte_length           = 3;
      var weight_start_byte            = bv_start_byte + 3;
      decoded.weight_sensor_amount     = bytes[weight_start_byte + 1];
      var weight_values_start_byte     = weight_start_byte + 2;
      if (bytes[weight_start_byte] == 0x0A && decoded.weight_sensor_amount > 0)
      {
        decoded.weight_present = true;
        if (decoded.weight_sensor_amount == 1)
        {
          decoded['w_v'] = (bytes[weight_values_start_byte] << 16) + (bytes[weight_values_start_byte+1] << 8) + bytes[weight_values_start_byte+2]; // 0A (6 weight) 01 (7 1x) 012D2D (8-10 value)
        }
        else
        {
          for(var i = 0; i < decoded.weight_sensor_amount; i++)
          {
            var valueByteIndex = weight_values_start_byte + (i * weight_byte_length); 
            decoded['w_v_' + i] = (bytes[valueByteIndex] << 16) + (bytes[valueByteIndex+1] << 8) + bytes[valueByteIndex+2]; 
          }
        }
      }
      else
      {
        decoded.weight_present = false;
      }
      var weight_values_end_byte = weight_values_start_byte + (decoded.weight_sensor_amount * weight_byte_length);
  
  
      // Temperature 1-5x DS18b20: 0x04
      var ds18b20_byte_length           = 2;
      var ds18b20_start_byte            = weight_values_end_byte;
      var ds18b20_values_start_byte     = ds18b20_start_byte + 2;
      decoded.ds18b20_sensor_amount     = bytes[ds18b20_start_byte + 1];
      
      //console.log(bytes[7], decoded.weight_sensor_amount, weight_start_byte, weight_values_end_byte, ds18b20_start_byte, bytes[ds18b20_start_byte]);
  
      if (bytes[ds18b20_start_byte] == 0x04 && decoded.ds18b20_sensor_amount > 0)
      {
        decoded.ds18b20_present = true;
        if (decoded.ds18b20_sensor_amount == 1)
        {
          decoded.t_i =  hexToInt(toHexString(bytes[ds18b20_values_start_byte], 2) + toHexString(bytes[ds18b20_values_start_byte+1], 2), 4); // 04 (11 temp) 01 (12 1x) 07D6 (13-14 value)
        }
        else
        {
          for(var j = 0; j < decoded.ds18b20_sensor_amount; j++)
          {
            var tempValueByteIndex = ds18b20_values_start_byte + (j * ds18b20_byte_length); 
            decoded['t_' + j] = hexToInt(toHexString(bytes[tempValueByteIndex], 2) + toHexString(bytes[tempValueByteIndex+1], 2), 4); 
            //console.log(tempValueByteIndex, tempValueByteIndex+1, toHexString(bytes[tempValueByteIndex], 2) + toHexString(bytes[tempValueByteIndex+1], 2), decoded['t_' + j]);
          }
        }
      }
      else
      {
        decoded.ds18b20_present = false;
      }
      var ds18b20_values_end_byte = ds18b20_values_start_byte + (decoded.ds18b20_sensor_amount * ds18b20_byte_length);
  
  
      // Audio FFT: 0x0C
      var fft_byte_length        = 2;
      var fft_bin_freq           = 3.937752016; // = about 2000 / 510
      var fft_start_byte         = ds18b20_values_end_byte;
      console.log(fft_start_byte)
      decoded.fft_bin_amount     = bytes[fft_start_byte+1];
      decoded.fft_start_bin      = bytes[fft_start_byte+2];
      decoded.fft_stop_bin       = bytes[fft_start_byte+3];
      var fft_bin_total          = decoded.fft_stop_bin - decoded.fft_start_bin;
      var fft_values_start_byte  = fft_start_byte + 4;
  
      if (bytes[fft_start_byte] == 0x0C && fft_bin_total > 0 && decoded.fft_bin_amount > 0)
      {
        decoded.fft_present      = true;
        var summed_bins          = Math.ceil(fft_bin_total * 2 / decoded.fft_bin_amount) ;
        decoded.fft_hz_per_bin   = Math.round(summed_bins * fft_bin_freq);
        
        for(var k = 0; k < decoded.fft_bin_amount; k++)
        {
          var fftValueByteIndex = fft_values_start_byte + (k * fft_byte_length); 
          var start_freq = Math.round( ( (decoded.fft_start_bin * 2) + k * summed_bins) * fft_bin_freq);
          var stop_freq  = Math.round( ( (decoded.fft_start_bin * 2) + (k+1) * summed_bins) * fft_bin_freq);
  
          decoded['s_bin_' + start_freq + '_' + stop_freq] = (bytes[fftValueByteIndex] << 8) + bytes[fftValueByteIndex+1];
        }
      }
      else
      {
        decoded.fft_present = false;
      }
      var fft_values_end_byte = fft_values_start_byte + (decoded.fft_bin_amount * fft_byte_length);
      console.log(fft_values_end_byte)

      // BME280: 0x07
      var bme280_start_byte        = fft_values_end_byte;
      var bme280_values_start_byte = bme280_start_byte + 1;
  
      if (bytes[bme280_start_byte] == 0x07)
      {
        var bme280_t = hexToInt(toHexString(bytes[bme280_values_start_byte+0], 2) + toHexString(bytes[bme280_values_start_byte+1], 2), 4);
        var bme280_h = (bytes[bme280_values_start_byte+2] << 8) + bytes[bme280_values_start_byte+3];
        var bme280_p = (bytes[bme280_values_start_byte+4] << 8) + bytes[bme280_values_start_byte+5];
        if ((bme280_t + bme280_h + bme280_p) != 0)
        {
          decoded.bme280_present = true;
          decoded.bme280_t = bme280_t;
          decoded.bme280_h = bme280_h;
          decoded.bme280_p = bme280_p;
        }
      }
      else
      {
        decoded.bme280_present = false;
      }
      var bme280_values_end_byte = bme280_values_start_byte + 6;
  
  
    }
  
  
    // Integrate converter because of not supporting by TTN console from mid 2020
    var converted = {};
  
    if (port === 1 && decoded.long === false && decoded.beep_base === false)
    {
      if (decoded.t > 0)
        converted.t     =  decoded.t / 100;
      if (decoded.h > 0)
        converted.h     =  decoded.h / 100;
      if (decoded.w_v > 0)
        converted.w_v   =  decoded.w_v / 100;
      if (decoded.t_i > 0)
        converted.t_i   =  decoded.t_i / 100;
      if (decoded.a_i > 0)
        converted.a_i     = decoded.a_i;
      if (decoded.bv > 0)
        converted.bv    =  decoded.bv / 100;
      if (decoded.s_tot > 0)
        converted.s_tot =  decoded.s_tot;
    }
    else if (port === 1 && decoded.long === true && decoded.beep_base === false)
    {
      // leave sounds and w_v as is
      if (decoded.t > 0)
        converted.t       =  (decoded.t / 5) - 10;
      if (decoded.h > 0)
        converted.h       =  decoded.h / 2;
      if (decoded.w_v > 0)
        converted.w_v     = decoded.w_v
      if (decoded.t_i > 0)
        converted.t_i     =  (decoded.t_i / 5) - 10;
      if (decoded.a_i > 0)
        converted.a_i     = decoded.a_i;
      if (decoded.bv > 0)
        converted.bv      =  decoded.bv / 10;
      if (decoded.s_tot > 0)
        converted.s_tot   = decoded.s_tot;
      if (decoded.s_fan_4 > 0)
        converted.s_fan_4 = decoded.s_fan_4;
      if (decoded.s_fan_6 > 0)
        converted.s_fan_6 = decoded.s_fan_6;
      if (decoded.s_fan_9 > 0)
        converted.s_fan_9 = decoded.s_fan_9;
      if (decoded.s_fly_a > 0)
        converted.s_fly_a = decoded.s_fly_a;
      if (decoded.w_fl > 0)
        converted.w_fl    =  decoded.w_fl / 300;
      if (decoded.w_fr > 0)
        converted.w_fr    =  decoded.w_fr / 300;
      if (decoded.w_bl > 0)
        converted.w_bl    =  decoded.w_bl / 300;
      if (decoded.w_br > 0)
        converted.w_br    =  decoded.w_br / 300;
    }
    else if (decoded.beep_base === true)
    {
      converted = decoded;
      
      // battery
      if (decoded.bv > 0)
        converted.bv =  decoded.bv / 1000;
      
      // weight is not converted
  
      // temperature (-99 is error code)
      if (decoded.ds18b20_present)
      {
        if (decoded.ds18b20_sensor_amount == 1)
        {
          converted.t_i =  decoded.t_i / 100;
          
        }
        else if (decoded.ds18b20_sensor_amount > 1)
        {
          for (var i = 0; i < decoded.ds18b20_sensor_amount; i++) 
          {
            converted['t_'+i] = decoded['t_'+i] / 100;
          }
        }
      }
  
      // sound fft not converted
  
      // bme280
      if (decoded.bme280_present)
      {
        converted.t = decoded.bme280_t / 100;
        converted.h = decoded.bme280_h / 100;
        converted.p = decoded.bme280_p; // hPa
      }
    }
  
    return converted;
  }


function DisplayDecodedValue(decoded)
{
  var bodyString = ""

  for(var key in decoded)
  {
    bodyString += `<tr><td>${key}</td><td>${decoded[key]}</td></tr>`
  }

  document.getElementById("decodedTableBody").innerHTML = bodyString

  document.getElementById("decodedContent").style.display = "block"
}

function sendPayload()
{
    var checked = document.getElementById("sensor-type").checked
    var sensor_type = "sensors"
    var url = ""
    if(checked)
        sensor_type = "lora_sensors"
    
    var json = JSON.parse(document.getElementById("payload-send-input").value)
    var domain = document.getElementById("domain-name").value


    var hardware_id = document.getElementById("hardware-id-input").value

    url = domain + "api/" + sensor_type + "/"
    json.key = hardware_id

    fetch(url, {method: 'POST', body: JSON.stringify(json)})
        .then(function(result) {
            console.log(result)
        })
    
}

function changeAPI(cbx)
{
    var api = cbx.value
    if(api == "TTN")
    {
        document.getElementById("APIFields").innerHTML = apiFields["TTN"]
    }
}