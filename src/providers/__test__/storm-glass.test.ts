import { StormGlass } from '@src/providers/storm-glass';

describe('Storm Glass provider', () => {
  it('should return the normalized forecast from the Storm Glass service', async () => {
    const latitude = -33.792726;
    const longitude = 151.289842;

    const stormGlass = new StormGlass();
    const response = await stormGlass.fetchPoints(latitude, longitude);
    expect(response).toEqual({});
  });
});
