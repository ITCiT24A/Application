class WeatherApp {
    constructor() {
        this.apiKey = document.getElementById('apiKeyInput');
        this.cityInput = document.getElementById('cityInput');
        this.getWeatherBtn = document.getElementById('getWeatherBtn');
        this.getLocationBtn = document.getElementById('getLocationBtn');
        this.weatherCard = document.getElementById('weatherCard');
        this.cityName = document.getElementById('cityName');
        this.temperature = document.getElementById('temperature');
        this.description = document.getElementById('description');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        
        this.getWeatherBtn.addEventListener('click', () => this.fetchWeather());
        this.getLocationBtn.addEventListener('click', () => this.fetchWeatherByLocation());
    }

    // Abstraction: Encapsulates the display logic
    displayWeather(data) {
        this.cityName.textContent = `${data.name}, ${data.sys.country} (${data.coord.lat}, ${data.coord.lon})`;
        this.temperature.textContent = `Temperature: ${data.main.temp} °C`;
        this.description.textContent = `Weather: ${data.weather[0].description}`;
        this.humidity.textContent = `Humidity: ${data.main.humidity}%`;
        this.windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
        
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.getElementById('weatherIcon').src = iconUrl;
        
        this.weatherCard.style.display = 'block';
    }
    
    // Abstract method for fetching weather data, to be overridden by subclasses
    async fetchWeather() {
        throw new Error("Method 'fetchWeather()' must be implemented.");
    }
    
    // Abstract method for fetching weather by geolocation, to be overridden by subclasses
    async fetchWeatherByLocation() {
        throw new Error("Method 'fetchWeatherByLocation()' must be implemented.");
    }
}

class WeatherService extends WeatherApp {
    constructor() {
        super(); // Call parent class constructor
    }

    // Inheritance & Polymorphism: Override fetchWeather method to fetch data based on city
    async fetchWeather() {
        const apiKey = this.apiKey.value;
        const city = this.cityInput.value;
        if (city) {
            const data = await this.getWeatherData(city, apiKey);
            if (data) {
                this.displayWeather(data);
            } else {
                alert('City not found. Please try again.');
            }
        } else {
            alert('Please enter a city name.');
        }
    }

    // Inheritance & Polymorphism: Override fetchWeatherByLocation method to fetch weather based on location
    async fetchWeatherByLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const data = await this.getWeatherDataByCoordinates(latitude, longitude);
                    if (data) {
                        this.displayWeather(data);
                        this.cityInput.value = '';
                    } else {
                        alert('Unable to retrieve weather data for your location.');
                    }
                },
                () => {
                    alert('Unable to retrieve your location. Please allow location access.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    // Encapsulation: Weather data fetching logic from OpenWeather API (for city)
    async getWeatherData(city, apiKey) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
        return null;
    }

    // Encapsulation: Weather data fetching logic from OpenWeather API (for geolocation)
    async getWeatherDataByCoordinates(latitude, longitude, apiKey) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error fetching weather data by coordinates:', error);
        }
        return null;
    }
}

const weatherApp = new WeatherService();

document.addEventListener('DOMContentLoaded', () => {
    const modal = new bootstrap.Modal(document.getElementById('infoModal'));
    modal.show();
});
