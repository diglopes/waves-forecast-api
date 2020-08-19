import { AxiosStatic } from 'axios';
import { InternalError } from '@src/util/errors/internal-error';

export interface StormGlassSource {
  [key: string]: number;
}

export interface StormGlassPoint {
  readonly time: string;
  readonly swellDirection: StormGlassSource;
  readonly swellHeight: StormGlassSource;
  readonly swellPeriod: StormGlassSource;
  readonly waveDirection: StormGlassSource;
  readonly waveHeight: StormGlassSource;
  readonly windDirection: StormGlassSource;
  readonly windSpeed: StormGlassSource;
}

export interface StormGlassForecastResponse {
  readonly hours: Array<StormGlassPoint>;
}

export interface ForecastPoint {
  time: string;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  waveDirection: number;
  waveHeight: number;
  windDirection: number;
  windSpeed: number;
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage = `Unexpected error when trying to communicate to StormGlass`;
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error returned by the StormGlass service';
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  constructor(protected httpClient: AxiosStatic) {}

  public async fetchPoints(
    latitude: number,
    longitude: number
  ): Promise<Array<ForecastPoint>> {
    try {
      const response = await this.httpClient.get<StormGlassForecastResponse>(
        `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&end=1592113802&lat=${latitude}&lng=${longitude}`,
        {
          headers: {
            Authorization: 'fake-token',
          },
        }
      );
      return this.normalizeResponse(response.data);
    } catch (error) {
      if (error.response?.status) {
        throw new StormGlassResponseError(
          `Error: ${JSON.stringify(error.response.data)} Code: ${
            error.response.status
          }`
        );
      } else {
        throw new ClientRequestError(error.message);
      }
    }
  }

  private normalizeResponse(
    points: StormGlassForecastResponse
  ): Array<ForecastPoint> {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      time: point.time,
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      waveHeight: point.waveHeight[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
      windSpeed: point.windSpeed[this.stormGlassAPISource],
    }));
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    );
  }
}
