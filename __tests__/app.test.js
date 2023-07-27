import {getWeatherData } from '../src/client/js/tripInfo'

// Mock fetch call

global.getch = jest.fn(() =>
    Promise.resolve ({
        ok: true,
        json: () => 
            Promise.resolve ({
                data: [
                    {
                        min_temp: 15,
                        max_temp: 23,
                        weather: {
                            description: 'Cloudy',
                        },
                    },
                ],
            }),
    })
);

describe('getWeatherData function', () => {
    test('should return weather data', async() => {
        const lat = 40.7128;
        const lng = 74.0060;

        const result = await getWeatherData(lat, lng);
        const expectedWeatherData = {
            min_temp: 15,
            max_temp: 23,
            weather_description: 'Cloudy',
        };
        expect(result).toEqual(expectedWeatherData);
    });
});