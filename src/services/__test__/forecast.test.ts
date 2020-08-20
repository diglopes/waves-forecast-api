import { StormGlass } from '@src/providers/storm-glass';
import StormGlassNormalizedResponseFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import forecastExpectedResponse from '@test/fixtures/forecast_expected_response.json';
import { Beach, BeachPosition, Forecast } from '../forecast';

jest.mock('@src/providers/storm-glass');

describe('Forecast Service', () => {
  it('should return the forecast for a list of beaches', async () => {
    const mockedStormGlass = new StormGlass() as jest.Mocked<StormGlass>;
    mockedStormGlass.fetchPoints.mockResolvedValue(
      StormGlassNormalizedResponseFixture
    );
    const beaches: Array<Beach> = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.East,
        user: 'some-id',
      },
    ];

    const forecast = new Forecast(mockedStormGlass);
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);
    expect(beachesWithRating).toEqual(forecastExpectedResponse);
  });

  it('should return an empty list when the beaches array is empty', async () => {
    const forecast = new Forecast();
    const response = await forecast.processForecastForBeaches([]);
    expect(response).toEqual([]);
  });
});