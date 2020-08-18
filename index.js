let weatherObj;
let emptyString = '';

let previousCity = 'HELLO';
let previousCityTwo = 'WORLD';
let threeCitiesSave = [];
let i = 0;
let loadCounter = 0;
let btn;
let currentTemp = 'currentTemp';
let searchMore = 'searchMore';

let sizeOfServerArray;
let serverCities; 
let cityJsons = [];     
let abc;
let counterBoi;
let x;
let myKey = config.MY_KEY;


startUpTwo();

async function startup(){ // fetch array from server 
    let myCities = await fetch('http://localhost:8080/locations')
    .then(response => response.json())
    .then(json => {
        x = json; 
        return x;
    })

    let counterboi = await fetch('http://localhost:8080/count')
    .then(response => response.json())
    .then(json => {
        counterBoi = json; 
        //return x;
    })

    
    console.log(counterBoi);

    if (!(myCities.length)){
        console.log("No information present!")
        return serverCities = [];
    }
    else{
        sizeOfServerArray = myCities.length
        return myCities; // return the array that was recevied from the server 
    }
}

async function startUpTwo(){        

    serverCities = await startup(); //serverCities is an array here*
    console.log(serverCities)
    //counterBoi = serverCities.length;

    if  (serverCities.length > 0){ // here we are getting the weather JSON for each location in the array
        for (let w = 0; w < serverCities.length; w++){
            cityJsons[w] = await getWeatherJson(serverCities[w]);
        }
        
        console.log(serverCities) // should print array location strings 
        console.log(cityJsons); // should print array of weather JSONs

        for (let j = 0; j < serverCities.length; j++){
            searchTemps(cityJsons[j], j, currentTemp)  // startup load of each location temperatures
        }
        

        // determining how many weather information divs to display on load
        if (sizeOfServerArray == 3){
            document.querySelector("#flexContainerContent").style.display = 'flex';
            document.querySelector("#first").style.display = 'flex';
            document.querySelector("#second").style.display = 'flex';
            document.querySelector("#third").style.display = 'flex';
            //counterBoi = 0;
        }
        else if (sizeOfServerArray == 2){
            document.querySelector("#flexContainerContent").style.display = 'flex';
            document.querySelector("#first").style.display = 'flex';
            document.querySelector("#second").style.display = 'flex';
            //counterBoi = 2;
        }
        else if (sizeOfServerArray == 1){
            document.querySelector("#flexContainerContent").style.display = 'flex';
            document.querySelector("#first").style.display = 'flex';
            //counterBoi = 1
            
        }
        else{
            document.querySelector("#flexContainerContent").style.display = 'none';
            document.querySelector("#first").style.display = 'none';
            document.querySelector("#second").style.display = 'none';
            document.querySelector("#third").style.display = 'none';
        }
        //return cityJsons;
    }
}

// POST to http://localhost:8080/locations
function postData(serverURL, cityString) {
    fetch(serverURL, {
        method: 'POST', 
        mode: 'no-cors', 
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: {'Content-Type': 'application/json','Access-Control-Allow-Origin' : '*'},
        body: JSON.stringify(cityString) // body data type must match "Content-Type" header
    })
}

async function getWeatherJson(location){
    const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + location + '&appid=' + myKey + '&units=imperial';
    let response = await fetch(url).then(response => response.json())
    return response; 
}

// create event handlers for each "View More Button"
let viewMoreOneBtn = document.querySelector('#viewMoreOne');  
viewMoreOneBtn.onclick =  function(event){
    
    // prevents page refreshing
    event.preventDefault();

    //console.log(abc)
    searchTemps(cityJsons[0], 0, searchMore);

};

let viewMoreTwoBtn = document.querySelector('#viewMoreTwo');  
viewMoreTwoBtn.onclick =  function(event){
    
    // prevents page refreshing
    event.preventDefault();

    //console.log(abc)
    searchTemps(cityJsons[1],1, searchMore);

};

let viewMoreThreeBtn = document.querySelector('#viewMoreThree');  
viewMoreThreeBtn.onclick =  function(event){
    
    // prevents page refreshing
    event.preventDefault();

    //console.log(abc)
    searchTemps(cityJsons[2],2, searchMore);

};

// Event handler searches city weather API on submit
// Adds city to server array
let searchBtn = document.querySelector('.searchButton');  
searchBtn.onclick = async function(event){
    
    // prevents page refreshing
    event.preventDefault();

    // add task to array
    let input = document.querySelector('input');
    let formEntry = input.value.split(',');

    input.value = '';   

    let cityEnteredString = formEntry.toString();
    
    if (cityEnteredString.trim()){
        // saving searches to server
        postData('http://localhost:8080/locations', cityEnteredString)

        // display current temperature at city to div 1,2, or 3
        if (counterBoi === 2){
        document.querySelector('#third').style.display = 'flex';
        let a = await fetch('http://api.openweathermap.org/data/2.5/weather?q=' + cityEnteredString + '&appid='+ myKey +'&units=imperial')
                .then(response => response.json())
                .then(json => cityJsons[counterBoi] = json);
        
            console.log(a)
            console.log(counterBoi)         
            searchTemps(a, counterBoi, currentTemp);
            counterBoi = 0; 
        }
        else{ 
            let a = await fetch('http://api.openweathermap.org/data/2.5/weather?q=' + cityEnteredString + '&appid='+ myKey +'&units=imperial')
                .then(response => response.json())
                .then(json => cityJsons[counterBoi] = json);

            console.log(a)
            console.log(cityJsons[counterBoi])
            console.log(counterBoi)
            searchTemps(a, counterBoi, currentTemp);
            counterBoi++;
        }
    }
    else{
        alert("Please enter city,state")
    }
}; 

let returnOne  = document.querySelector('#returnOne');  
returnOne.onclick =  function(event){
    
    // prevents page refreshing
    event.preventDefault();

    //console.log(abc)
    //i = 1;
    searchTemps(cityJsons[0],0, currentTemp);

};

let returnTwo  = document.querySelector('#returnTwo');  
returnTwo.onclick =  function(event){
    
    // prevents page refreshing
    event.preventDefault();
    //i = 2;
    //console.log(abc)
    searchTemps(cityJsons[1],1, currentTemp);

};

let returnThree  = document.querySelector('#returnThree');  
returnThree.onclick =  function(event){
    
    // prevents page refreshing
    event.preventDefault();

    //console.log(abc)
    
    searchTemps(cityJsons[2],2, currentTemp);

};

// Fetch weather API
function searchTemps(weatherObject, count, searchType){
    
    // this section displays current temperatures for the city searched
    if (searchType == "currentTemp"){ 
        if (count == 0){ 
            document.querySelector("#flexContainerContent").style.display = 'flex';
            document.querySelector("#first").style.display = 'flex';
            document.querySelector("#firstCity").innerHTML =   weatherObject.name + "<br>" + "<br>" + weatherObject.main.temp +  '°F.' + '<br>' + "<br>" + 'Weather conditions: ' + weatherObject.weather[0].main;
            document.getElementById("viewMoreOne").innerHTML = "<button id='viewMoreOneButton'>View More</button>";
            document.getElementById("viewMoreOne").style.display = 'flex';
            document.getElementById("returnOne").style.display = 'none' ;

            if (weatherObject.weather[0].main === 'Clear'){
                document.querySelector('#first').style.backgroundImage = "url('gifs/clear.gif')";
            }
            if (weatherObject.weather[0].main === 'Clouds'){
                document.querySelector('#first').style.backgroundImage = "url('gifs/clouds.gif')";
            }
            if (weatherObject.weather[0].main === 'Rain'){
                document.querySelector('#first').style.backgroundImage = "url('gifs/rain.gif')";
            }
            if (weatherObject.weather[0].main === 'Snow'){
                document.querySelector('#first').style.backgroundImage = "url('gifs/snow.gif')";
            }
            if (weatherObject.weather[0].main === 'Wind'){
                document.querySelector('#first').style.backgroundImage = "url('gifs/wind.gif')";
            }
            if (weatherObject.weather[0].main === 'Mist'){
                document.querySelector('#first').style.backgroundImage = "url('gifs/mist.gif')";
            }
            
        }
        else if (count == 1){   
            document.querySelector("#flexContainerContent").style.display = 'flex';
            document.querySelector("#second").style.display = 'flex';          
            document.querySelector("#secondCity").innerHTML = weatherObject.name + "<br>" + "<br>" + weatherObject.main.temp +  '°F.' + '<br>' + "<br>" + 'Weather conditions: ' + weatherObject.weather[0].main;
            document.getElementById("viewMoreTwo").innerHTML = "<button id='viewMoreTwoButton'>View More</button>"
            document.getElementById("viewMoreTwo").style.display = 'flex'
            document.getElementById("returnTwo").style.display = 'none' 

            if (weatherObject.weather[0].main === 'Clear'){
                document.querySelector('#second').style.backgroundImage = "url('gifs/clear.gif')";
            }
            if (weatherObject.weather[0].main === 'Clouds'){
                document.querySelector('#second').style.backgroundImage = "url('gifs/clouds.gif')";
            }
            if (weatherObject.weather[0].main === 'Rain'){
                document.querySelector('#second').style.backgroundImage = "url('gifs/rain.gif')";
            }
            if (weatherObject.weather[0].main === 'Snow'){
                document.querySelector('#second').style.backgroundImage = "url('gifs/snow.gif')";
            }
            if (weatherObject.weather[0].main === 'Wind'){
                document.querySelector('#second').style.backgroundImage = "url('gifs/wind.gif')";
            }
            if (weatherObject.weather[0].main === 'Mist'){
                document.querySelector('#second').style.backgroundImage = "url('gifs/mist.gif')";
            }

        }
        else{    
            document.querySelector("#flexContainerContent").style.display = 'flex';
            document.querySelector("#third").style.display = 'flex';
            document.querySelector("#thirdCity").innerHTML = weatherObject.name + "<br>" + "<br>" + weatherObject.main.temp +  '°F.' + '<br>' + "<br>" + 'Weather conditions: ' + weatherObject.weather[0].main;
            document.getElementById("viewMoreThree").innerHTML = "<button id='viewMoreThreeButton'>View More</button>";  
            document.getElementById("viewMoreThree").style.display = 'flex'
            document.getElementById("returnThree").style.display = 'none' 

            if (weatherObject.weather[0].main === 'Clear'){
                document.querySelector('#third').style.backgroundImage = "url('gifs/clear.gif')";
            }
            if (weatherObject.weather[0].main === 'Clouds'){
                document.querySelector('#third').style.backgroundImage = "url('gifs/clouds.gif')";
            }
            if (weatherObject.weather[0].main === 'Rain'){
                document.querySelector('#third').style.backgroundImage = "url('gifs/rain.gif')";
            }
            if (weatherObject.weather[0].main === 'Snow'){
                document.querySelector('#third').style.backgroundImage = "url('gifs/snow.gif')";
            }
            if (weatherObject.weather[0].main === 'Wind'){
                document.querySelector('#third').style.backgroundImage = "url('gifs/wind.gif')";
            }
            if (weatherObject.weather[0].main === 'Mist'){
                document.querySelector('#third').style.backgroundImage = "url('gifs/mist.gif')";
            }
        }
    }
    else if(searchType == "searchMore"){ // this section displays more weather information when View More is pressed
        if (count == 0){
            document.querySelector("#firstCity").innerHTML  = `Feels Like: ${weatherObject.main.feels_like} °F<br><br>Wind Speed: ${weatherObject.wind.speed}mph`;
            document.getElementById("viewMoreOne").style.display = 'none';
            document.getElementById("returnOne").innerHTML = "<button id='returnOneButton'>Return</button>";
            document.getElementById("returnOne").style.display = 'flex';  
        }
        else if (count == 1){
            
            document.querySelector("#secondCity").innerHTML  = `Feels Like: ${weatherObject.main.feels_like} °F<br><br>Wind Speed: ${weatherObject.wind.speed}mph`;
            document.getElementById("viewMoreTwo").style.display = 'none';
            document.getElementById("returnTwo").innerHTML = "<button id='returnTwoButton'>Return</button>";
            document.getElementById("returnTwo").style.display = 'flex';  
        }
        else{    
            document.querySelector("#third").style.display = 'flex';
            document.querySelector("#thirdCity").innerHTML  = `Feels Like: ${weatherObject.main.feels_like} °F<br><br>Wind Speed: ${weatherObject.wind.speed}mph`;
            document.getElementById("viewMoreThree").style.display = 'none';
            document.getElementById("returnThree").innerHTML = "<button id='returnThreeButton'>Return</button>";
            document.getElementById("returnThree").style.display = 'flex';  

        }
    }
}   

