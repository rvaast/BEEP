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
    "4": "<td><div class=\"Elements\" id=\"AlarmDiv\"><select id=\"AlarmSelection\"><option value=\"0\">ds18b20</option><option value=\"1\">bme280</option><option value=\"2\">hx711</option><option value=\"3\">audio_adc</option><option value=\"4\">nrf_adc</option><option value=\"5\">sq_min</option><option value=\"6\">attec</option><option value=\"7\">buzzer</option><option value=\"8\">lorawan</option><option value=\"9\">mx_flash</option><option value=\"10\">nrf_flash</option><option value=\"11\">application</option></select></div></td>" + 
    "<td><div class=\"Elements\" id=\"WeightDiv\"><input type=\"checkbox\" id=\"WeightPresence\" onClick=\"WeightPresence()\">Weight Presence</input><div id=\"WeightElements\"></div></div></td>" +
    "<td><div class=\"Elements\" id=\"TempDiv\"><input type=\"checkbox\" id=\"TemperaturePresence\" onClick=\"TemperaturePresence()\">Temperature Presence</input><div id=\"TemperatureElements\"></div></div></td>" +
    "<td><div class=\"Elements\" id=\"FFTDiv\"><input type=\"checkbox\" id=\"FFTPresence\" onClick=\"FFTPresence()\">FFT Presence</input><div id=\"FFTElements\"></div></div></td>" +
    "<td><div class=\"Elements\" id=\"BME280Div\"><input type=\"checkbox\" id=\"BME280Presence\" onClick=\"BME280Presence()\">BME280 Presence</input><div id=\"BME280Elements\"></div></div></td>"
}

const payloadOptions = {
    "weightNum" : "<input type=\"number\" min=1 value=1 id=\"WeightSensorsCount\" placeholder=\"Number of weight sensors\" onChange=\"addWeightInput()\"></input><div class=\"Inputs\"id=\"WeightInput\"></div>",
    "weight" : "<input type=\"text\" class=\"WeightValues\" placeholder=\"Weight (g)\"></input><br>",
    "tempNum": "<input type=\"number\" min=1 value=1 id=\"TemperatureSensorsCount\" placeholder=\"Number of temperature sensors\" onChange=\"addTemperatureInput()\"></input><div class=\"Inputs\"id=\"TemperatureInput\"></div>",
    "temperature": "<input type=\"text\" class=\"TemperatureValues\" placeholder=\"Temperature (C°)\"></input><br>",
    "FFTNum": "<input type=\"number\" min=0 value=1 id=\"FFTSensorsCount\" placeholder=\"Number of FFT sensors\" onChange=\"refreshFFTInput()\"></input><input type=\"number\" min=1 max=255 id=\"stopFFTBIN\" placeholder=\"Stop bin\" onChange=\"changeFFTInterval()\"></input><input type=\"number\" min=0 max=254 id=\"startFFTBIN\" placeholder=\"Start bin\" onChange=\"changeFFTInterval()\"></input><input type=\"number\" min=1 max=255 id=\"HzPFFTBIN\" placeholder=\"Hz interval\" readonly></input><div class=\"Inputs\"id=\"FFTInput\"></div>",
    "FFT": "<input type=\"text\" class=\"FFTValues\" placeholder=\"FFT (W-P)\"></input><br>",
    "BME280Fields": "<input type=\"text\" id=\"BME280t\" placeholder=\"BME280 C°\"></input><br><input type=\"text\" id=\"BME280h\" placeholder=\"BME280 H%\"></input><br><input type=\"text\" id=\"BME280p\" placeholder=\"BME280 hPA\"></input><br>"
}

const payloadInputForm = {
    "3": "<input type=\"text\" id=\"inputBatV\" placeholder=\"Battery voltage\"></input><br><input type=\"number\" min=\"0\" max=\"100\" id=\"inputBatP\" placeholder=\"Battery percentage\"></input>",
    "4": "<input type=\"text\" id=\"inputBatV\" placeholder=\"Battery voltage\"></input><br><input type=\"number\" min=\"0\" max=\"100\" id=\"inputBatP\" placeholder=\"Battery percentage\"></input>"
}

const portSelection = "<select id=\"portSelection\" onChange=\"portChanged(this)\"><option value=\"\" disabled selected>Select your port</option><option value=\"1\">Port 1</option><option value=\"2\">Port 2</option><option value=\"3\">Port 3</option><option value=\"4\">Port 4</option></select>"

function generatePayload()
{
    var port = document.getElementById("portSelection").value
    var bytesArray = []
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

    document.getElementById("bytes").innerHTML = bytesArray

    var hexPayload = byteToHexPayload(bytesArray)
    document.getElementById("HEX").innerHTML = hexPayload
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

function portChanged(comboPort)
{
    var port = comboPort.value
    document.getElementById("payloadInputForm").innerHTML = payloadInputForm[port]
    document.getElementById("optionSelector").innerHTML = payloadOptionsVerifier[port]
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
    if(StartBIN == "" || parseInt(StartBIN) < 0)
        StartBIN = 0

    var StopBIN = document.getElementById("stopFFTBIN").value
    if(StopBIN == "" || parseInt(StopBIN) < 1)
        StopBIN = 1


    StartBIN = parseInt(StartBIN)
    StopBIN = parseInt(StopBIN)
    var fft_bin_total = StopBIN - StartBIN
    var summed_bins = (fft_bin_total * 2 / sensor_count)

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

    if(startBINval >= stopBINval && startBINval != null && stopBINval != null)
    {
        document.getElementById("startFFTBIN").value = stopBINval - 1
        return
    }
    setFFTInterval()
    refreshFFTInput()
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
