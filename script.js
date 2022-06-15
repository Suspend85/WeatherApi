'use strict';

const form = document.querySelector('#weather'),
	input = form.querySelector('#city');

const getWeatherJson = async (city) => {
	const apiKey = 'YOUR_API_KEY',
		lang = 'ru';
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=${lang}&units=metric`;

	let response = await fetch(apiUrl);
	if (response.ok) {
		return await response.json();
	} else {
		alert(`cant find this place`);
		throw new Error(`Could not fetch ${apiUrl}, status: ${response.status}`);
	}
};

class CreateDiv {
	constructor(name, temperature, feelsLike, humidity, pressure, parentSelector) {
		this.name = name;
		this.temperature = temperature;
		this.feelsLike = feelsLike;
		this.humidity = humidity;
		this.pressure = pressure;
		this.parent = document.querySelector(parentSelector);
	}
	render() {
		const output = document.createElement('div');
		output.remove();
		output.classList.add('weather__response');
		output.innerHTML = `
			<h3>${this.name}</h3>
			<p>Температура: ${this.temperature} градусов</p>
			<p>Ощущается как: ${this.feelsLike} градусов</p>
			<br>
			<p>Влажность: ${this.humidity} %</p>
			<p>Давление: ${this.pressure} </p>
    	`;
		this.parent.append(output);
	}
}

form.addEventListener('submit', (e) => {
	e.preventDefault();
	const el = document.querySelectorAll('.weather__response');
	el.forEach((item) => {
		item.remove();
	});

	let cityName = input.value.toLowerCase();
	getWeatherJson(cityName).then((data) => {
		const result = [];

		const entries = Object.entries(data);
		for (const [key, value] of entries) {
			if (key == 'main' || key == 'name') {
				result.push(value);
			}
		}
		let temper = result[0].temp,
			feels = result[0].feels_like,
			humidity = result[0].humidity,
			pressure = result[0].pressure,
			name = result[1];

		new CreateDiv(name, temper, feels, humidity, pressure, '.container').render();
	});

	form.reset();
});
