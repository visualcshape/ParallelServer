/**
 * Created by Vodalok on 2014/9/26.
 */

var DATA_PATH = '../../../WeatherJson/F-C0032-001.json';

var processJSON = require(DATA_PATH);

var location = processJSON.fifowml.data[0].location[0].get('weather-element');

console.dir(processJSON.fifowml.data);