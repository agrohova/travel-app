const request = require('supertest');

const fetch = require('node-fetch');
jest.mock('node-fetch');

const serverModule = require('../src/server/index.js');
const app = serverModule.app;
const server = serverModule.server;

describe('Express server', () => {
  afterAll(() => {
    server.close();
  });

  test('/geo route should return data from the GeoNames API', async () => {
    const city = 'New York';
    const expectedResponse = {
      lat: '40.7128',
      lng: '-74.0060',
      city: 'New York',
      country: 'United States',
    };

    // Mock the fetch function to return the expected response
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        geonames: [
          {
            lat: '40.7128',
            lng: '-74.0060',
            name: 'New York',
            countryName: 'United States',
          },
        ],
      }),
    });

    // Make the request to the /geo route (not /geoNames)
    const response = await request(app).get('/geo').query({ city });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });
});