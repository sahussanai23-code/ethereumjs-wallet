// Weather Dashboard App
class WeatherApp {
    constructor() {
        // OpenWeatherMap API (free tier)
        this.API_KEY = 'f6e18b7a5482c4f96e2fa62177d3e977'; // Free tier API key
        this.API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
        this.STORAGE_KEY = 'recentCities';
        this.UNITS = 'metric'; // Celsius
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadRecentCities();
    }

    initializeElements() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.currentLocationBtn = document.getElementById('currentLocationBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.currentWeather = document.getElementById('currentWeather');
        this.forecastSection = document.getElementById('forecastSection');
        this.hourlySection = document.getElementById('hourlySection');
        this.emptyState = document.getElementById('emptyState');
        this.recentCitiesContainer = document.getElementById('recentCities');
        this.forecast = document.getElementById('forecast');
        this.hourlyForecast = document.getElementById('hourlyForecast');
    }

    attachEventListeners() {
        this.searchBtn.addEventListener('click', () => this.searchWeather());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchWeather();
        });
        this.currentLocationBtn.addEventListener('click', () => this.useCurrentLocation());
    }

    async searchWeather() {
        const city = this.cityInput.value.trim();
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }
        await this.fetchWeatherByCity(city);
    }

    async fetchWeatherByCity(city) {
        try {
            this.showLoading(true);
            this.hideError();

            // Get coordinates from city name
            const geoUrl = `${this.API_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=${this.UNITS}`;
            const geoResponse = await fetch(geoUrl);

            if (!geoResponse.ok) {
                throw new Error('City not found');
            }

            const geoData = await geoResponse.json();
            const { lat, lon, name, sys } = geoData;

            // Save to recent cities
            this.saveRecentCity(name);

            // Fetch full weather data
            await this.fetchWeatherData(lat, lon, name, sys.country);
            
        } catch (error) {
            this.showError(error.message || 'Error fetching weather data');
            console.error('Error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async useCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by your browser');
            return;
        }

        try {
            this.showLoading(true);
            this.hideError();

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await this.fetchWeatherData(latitude, longitude);
                },
                (error) => {
                    this.showError('Unable to get your location: ' + error.message);
                    this.showLoading(false);
                }
            );
        } catch (error) {
            this.showError('Error getting location');
            this.showLoading(false);
        }
    }

    async fetchWeatherData(lat, lon, cityName = null) {
        try {
            // Fetch current weather
            const currentUrl = `${this.API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=${this.UNITS}`;
            const currentResponse = await fetch(currentUrl);
            const currentData = await currentResponse.json();

            // Fetch 5-day forecast
            const forecastUrl = `${this.API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=${this.UNITS}`;
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();

            // Display data
            this.displayCurrentWeather(currentData);
            this.displayForecast(forecastData);
            this.displayHourlyForecast(forecastData);

            this.emptyState.classList.add('hidden');
            this.currentWeather.classList.remove('hidden');
            this.forecastSection.classList.remove('hidden');
            this.hourlySection.classList.remove('hidden');

            this.cityInput.value = '';
        } catch (error) {
            this.showError('Error fetching weather data');
            console.error('Error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    displayCurrentWeather(data) {
        const { name, sys, main, weather, wind, clouds, visibility } = data;

        document.getElementById('cityName').textContent = `${name}, ${sys.country}`;
        document.getElementById('lastUpdated').textContent = `Last updated: ${new Date().toLocaleString()}`;
        document.getElementById('currentTemp').textContent = Math.round(main.temp);
        document.getElementById('weatherDesc').textContent = weather[0].main;
        document.getElementById('weatherDetails').textContent = this.capitalizeWords(weather[0].description);
        
        // Weather icon
        const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;
        document.getElementById('weatherIcon').src = iconUrl;

        // Metrics
        document.getElementById('humidity').textContent = `${main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${wind.speed.toFixed(1)} m/s`;
        document.getElementById('pressure').textContent = `${main.pressure} hPa`;
        document.getElementById('visibility').textContent = `${(visibility / 1000).toFixed(1)} km`;
        document.getElementById('windDirection').textContent = this.getWindDirection(wind.deg);
        document.getElementById('feelsLike').textContent = `${Math.round(main.feels_like)}°C`;
    }

    displayForecast(data) {
        // Get daily forecasts (one per day at noon)
        const dailyForecasts = {};
        
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toLocaleDateString();
            
            // Keep the forecast at noon if available, otherwise keep the first one
            if (!dailyForecasts[dateKey] || date.getHours() === 12) {
                dailyForecasts[dateKey] = item;
            }
        });

        // Convert to array and take first 5 days
        const forecasts = Object.values(dailyForecasts).slice(0, 5);

        this.forecast.innerHTML = '';
        forecasts.forEach(item => {
            const date = new Date(item.dt * 1000);
            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <div class="forecast-date">${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                <div class="forecast-icon">
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather icon">
                </div>
                <div class="forecast-temp">
                    <span class="forecast-high">${Math.round(item.main.temp_max)}°</span>
                    <span class="forecast-low">${Math.round(item.main.temp_min)}°</span>
                </div>
                <div class="forecast-desc">${this.capitalizeWords(item.weather[0].description)}</div>
            `;
            this.forecast.appendChild(card);
        });
    }

    displayHourlyForecast(data) {
        // Get next 24 hours
        const hourlyData = data.list.slice(0, 8); // 8 * 3-hour intervals = 24 hours

        this.hourlyForecast.innerHTML = '';
        hourlyData.forEach(item => {
            const date = new Date(item.dt * 1000);
            const card = document.createElement('div');
            card.className = 'hourly-card';
            card.innerHTML = `
                <div class="hourly-time">${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                <div class="hourly-icon">
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather icon">
                </div>
                <div class="hourly-temp">${Math.round(item.main.temp)}°</div>
                <div class="hourly-condition">${item.weather[0].main}</div>
            `;
            this.hourlyForecast.appendChild(card);
        });
    }

    saveRecentCity(cityName) {
        let recentCities = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        
        // Remove if already exists, then add to beginning
        recentCities = recentCities.filter(c => c !== cityName);
        recentCities.unshift(cityName);
        
        // Keep only last 5 cities
        recentCities = recentCities.slice(0, 5);
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentCities));
        this.renderRecentCities(recentCities);
    }

    loadRecentCities() {
        const recentCities = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        this.renderRecentCities(recentCities);
    }

    renderRecentCities(recentCities) {
        this.recentCitiesContainer.innerHTML = '';
        
        if (recentCities.length === 0) return;

        const label = document.createElement('span');
        label.style.fontSize = '0.9em';
        label.style.color = '#999';
        label.style.marginRight = '10px';
        label.textContent = 'Recent:';
        this.recentCitiesContainer.appendChild(label);

        recentCities.forEach(city => {
            const btn = document.createElement('button');
            btn.className = 'recent-city-btn';
            btn.textContent = city;
            btn.addEventListener('click', () => this.fetchWeatherByCity(city));
            this.recentCitiesContainer.appendChild(btn);
        });
    }

    showLoading(show) {
        if (show) {
            this.loadingSpinner.classList.remove('hidden');
        } else {
            this.loadingSpinner.classList.add('hidden');
        }
    }

    showError(message) {
        this.errorMessage.textContent = '❌ ' + message;
        this.errorMessage.classList.remove('hidden');
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }

    getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                          'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }

    capitalizeWords(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.weatherApp = new WeatherApp();
});
