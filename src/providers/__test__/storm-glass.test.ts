import { StormGlass } from '@src/providers/storm-glass';
import * as HTTPUtil from '@src/util/httpClient';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('@src/util/httpClient');

describe('Storm Glass provider', () => {
  const mockedHttpClient = new HTTPUtil.HttpClient() as jest.Mocked<
    HTTPUtil.HttpClient
  >;
  const MockedHttpClientClass = HTTPUtil.HttpClient as jest.Mocked<
    typeof HTTPUtil.HttpClient
  >;
  it('should return the normalized forecast from the Storm Glass service', async () => {
    const latitude = -33.792726;
    const longitude = 151.289842;

    mockedHttpClient.get.mockResolvedValue({
      data: stormGlassWeather3HoursFixture,
    } as HTTPUtil.Response);
    const stormGlass = new StormGlass(mockedHttpClient);
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
    mockedHttpClient.get.mockResolvedValue({
      data: incompleteResponse,
    } as HTTPUtil.Response);
    const stormGlass = new StormGlass(mockedHttpClient);
    const response = await stormGlass.fetchPoints(latitude, longitude);
    expect(response).toEqual([]);
  });

  it('should get a generic error from Storm Glass service when the request fail before reaching the service', async () => {
    const latitude = -33.792726;
    const longitude = 151.289842;

    mockedHttpClient.get.mockRejectedValue({ message: 'Network Error' });
    const stormGlass = new StormGlass(mockedHttpClient);

    await expect(stormGlass.fetchPoints(latitude, longitude)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  it('should get an StormGlassREsponseError when Storm Glass responds with error', async () => {
    const latitude = -33.792726;
    const longitude = 151.289842;

    MockedHttpClientClass.isRequestError.mockReturnValue(true);
    mockedHttpClient.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      },
    });
    const stormGlass = new StormGlass(mockedHttpClient);

    await expect(stormGlass.fetchPoints(latitude, longitude)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
