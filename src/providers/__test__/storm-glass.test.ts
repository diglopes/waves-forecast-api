import { StormGlass } from '@src/providers/storm-glass';
import axios from 'axios';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('Storm Glass provider', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it('should return the normalized forecast from the Storm Glass service', async () => {
    const latitude = -33.792726;
    const longitude = 151.289842;

    mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture });
    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(latitude, longitude);
    expect(response).toEqual(stormGlassNormalized3HoursFixture);
  });

  it('should exclude incomplete data points', async () => {
    const latitude = -33.792726;
    const longitude = 151.289842;
    const incompleteResponse = {
      hours: [
        {
          time: '2020-04-26T00:00:00+00:00',
          waveDirection: {
            noaa: 231.38,
          },
        },
      ],
    };
    mockedAxios.get.mockResolvedValue({ data: incompleteResponse });
    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(latitude, longitude);
    expect(response).toEqual([]);
  });

  it('should get a generic error from Storm Glass service when the request fail before reaching the service', async () => {
    const latitude = -33.792726;
    const longitude = 151.289842;

    mockedAxios.get.mockRejectedValue({ message: 'Network Error' });
    const stormGlass = new StormGlass(mockedAxios);

    await expect(stormGlass.fetchPoints(latitude, longitude)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });
});
