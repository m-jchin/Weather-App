let http = require('http')

console.log('Starting server')

var cities = []; 
let city;
var returnLocations;
let startup = false;
let counter = 0;


http.createServer((req,res) =>{
    if (startup == true && cities.length == 0  && req.method == 'GET' && req.url == '/locations' || startup == false && req.method == 'GET' && req.url == '/locations')
    {
        res.writeHead(200, {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'})
        let sendEmpty = JSON.stringify(cities);
        startup = true;
        console.log("Replying with EMPTY Array!")
        res.write(sendEmpty)
        res.end()
    }
    else if (cities.length > 0 && req.method == 'GET' && req.url == '/locations')
    {
        res.writeHead(200, {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'})
        returnLocations = JSON.stringify(cities);
        console.log('Sent to frontend: ' + returnLocations)
        res.write(returnLocations)
        res.end()
    }
    else if (startup == true && req.method == 'GET' && req.url == '/count')
    {
        res.writeHead(200, {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'})
        console.log('Sent to counter to front end! '+ counter)
        let counterToJson = JSON.stringify(counter);     
        res.write(counterToJson)
        res.end()
    }
    else if (startup === false && req.method == 'POST' && req.url == '/locations')
    {
        console.log('Startup - POST')
        startup = true;

        req.on('data', function(data) {
            
            city = JSON.parse(data);
            console.log(city);
            console.log(cities.length)
            console.log('Startup list ready!');
        })
        
        req.on('end', function() {
            res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Methods' : '*'})
            res.end('ok')
        })
    }
    else if (startup === true && req.method == 'POST' && req.url == '/locations')
    {
        req.on('data', function(data) {

            
            if (data === '')
            {   
                res.end()
            }
            else
            {
                console.log('POST')
                console.log('Pushed to array: ' + data)

                city = JSON.parse(data);

                if (counter == 2){
                    cities[counter] = city;
                    console.log(cities)
                    counter = 0
                }
                else{
                    cities[counter] = city;
                    console.log(cities)
                    counter++;
                }
                
                
            }
        })
        
        req.on('end', function() {
            res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Methods' : '*'})
            res.end('ok')
        })
    }
    else
    {
        res.writeHead(404, {'Content-Type' : 'text/html', 'Access-Control-Allow-Origin' : '*'})
        res.end('not found')
    }
}).listen(8080)

