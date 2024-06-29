async function getCityFromIP() {
    return new Promise((resolve, reject) => {
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                const city = data.city; 
                resolve(city);
            })
            .catch(error => {
                reject(error);
            });
    });
}





async function getData(city) {
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=7d77b96c972b4d119a3151101212704&q=${city}&days=3`);
    if (response.ok && response.status != 400) {
        let data = await response.json();
        displayCurrentDay(data.location, data.current);
        displayTheNextTwoDays(data.forecast.forecastday);
    }
}

document.querySelector("#search").addEventListener("keyup", event => {
    getData(event.target.value);
});

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



function getWindDirection(degree) {
    if (degree >= 0 && degree < 45) {
        return 'North';
    } else if (degree >= 45 && degree < 90) {
        return 'North-East';
    } else if (degree >= 90 && degree < 135) {
        return 'East';
    } else if (degree >= 135 && degree < 180) {
        return 'South-East';
    } else if (degree >= 180 && degree < 225) {
        return 'South';
    } else if (degree >= 225 && degree < 270) {
        return 'South-West';
    } else if (degree >= 270 && degree < 315) {
        return 'West';
    } else if (degree >= 315 && degree <= 360) {
        return 'North-West';
    } else {
        return 'Invalid degree';
    }
}





function displayCurrentDay(location, current) {
    if (current != null) {
        var lastUpdated = new Date(current.last_updated.replace(" ", "T")); // Convert to JavaScript Date object
        const windDirection = getWindDirection(current.wind_degree); 

        let html = `
            <div class="col-md-4">
            <div class="card d-flex flex-column justify-content-between align-items-center">

              <div class="day-info px-3 d-flex justify-content-between align-items-center w-100">
                <p class="day">${days[lastUpdated.getDay()]}</p>
                <p class="date"><span>${lastUpdated.getDate()}</span> &nbsp;&nbsp;${monthNames[lastUpdated.getMonth()]}</p>
              </div>


              <div class="degree px-3 w-100">
                <p class="city">${location.name}</p>
                <div class="test d-flex justify-content-between align-items-center">
                  <p class="current-weather">${current.temp_c}<sup>o</sup>C</p>
                  <img src="${current.condition.icon}" alt="" class="w-25">
                </div>
                <p class="status">${current.condition.text}</p>
              </div>


              <div class="weather-info px-3  d-flex justify-content-between align-items-center  w-100"><!-- cons -->
                <p class="Humidity"><i class="fa-solid fa-umbrella"></i>&nbsp;&nbsp;${current.humidity}%</p>
                <p class="speed"><i class="fa-solid fa-wind"></i>&nbsp;&nbsp;${current.wind_kph}km/h</p>
                <p class="direction"><i class="fa-regular fa-compass"></i>&nbsp;&nbsp;${windDirection}</p>

              </div>

            </div>
          </div>
            `;
        document.querySelector(".row").innerHTML = html
    }
}

function displayTheNextTwoDays(forecastDays) {
    let html = "";
    for (let i = 1; i < forecastDays.length; i++) {
        let forecastDate = new Date(forecastDays[i].date.replace(" ", "T"));// Convert to JavaScript Date object

        html += `
            <div class="col-md-4">
            <div class="card d-flex flex-column justify-content-between align-items-center">

              <div class="day-info px-3 text-center w-100">
                <p class="day">${ days[forecastDate.getDay()] }</p>

              </div>


              <div class="degree px-3 text-center w-100">
                <img src="${ forecastDays[i].day.condition.icon }" alt="" class="w-25">
                <p class="Maximum-temperature">${ forecastDays[i].day.maxtemp_c }<sup>o</sup>C</p>
                <p class="minimum-temperature">${ forecastDays[i].day.mintemp_c }<sup>o</sup>C</p>
                <p class="status">${ forecastDays[i].day.condition.text }</p>
              </div>
              <div class="weather-info  px-3 opacity-0  d-flex justify-content-between align-items-center  w-100">
                

              </div>


            </div>
          </div>
            `;
    }
    document.querySelector(".row").innerHTML += html;
}



getCityFromIP()
    .then(city => {
        getData(city);
    })
    .catch(error => {
        console.error('Error getting city from IP:', error);
        
        getData('Cairo');
    });
