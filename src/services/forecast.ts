import { StormGlass, ForecastPoint } from '@src/providers/storm-glass';
import { InternalError } from '@src/util/errors/internal-error';

export enum BeachPosition {
  South = 'S',
  East = 'E',
  West = 'W',
  North = 'N',
}

export interface Beach {
  lat: number;
  lng: number;
  name: string;
  position: BeachPosition;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: Array<BeachForecast>;
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Array<Beach>
  ): Promise<Array<TimeForecast>> {
    const pointsWithCorrectSources: Array<BeachForecast> = [];
    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData = points.map((point) => ({
          ...{
            lat: beach.lat,
            lng: beach.lng,
            name: beach.name,
            position: beach.position,
            rating: 1,
          },
          ...point,
        }));
        pointsWithCorrectSources.push(...enrichedBeachData);
      }

      return this.mapForecastByTime(pointsWithCorrectSources);
    } catch (error) {
      throw new ForecastProcessingInternalError(error.message);
    }
  }

  private mapForecastByTime(
    forecast: Array<BeachForecast>
  ): Array<TimeForecast> {
    const foreCastByTime: Array<TimeForecast> = [];
    for (const point of forecast) {
      const timePoint = foreCastByTime.find((f) => f.time === point.time);
      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        foreCastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }
    return foreCastByTime;
  }
}
