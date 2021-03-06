import { Controller, Get, ClassMiddleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Forecast } from '@src/services/forecast';
import { Beach } from '@src/models/beaches';
import { authMiddleware } from '@src/middlewares/auth';

const forecast = new Forecast();

@Controller('forecast')
@ClassMiddleware([authMiddleware])
export class ForecastController {
  @Get('')
  public async getForecastForLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const decoded = req.decoded;
      const beaches = await Beach.find({ user: decoded?.id });
      const forecastData = await forecast.processForecastForBeaches(beaches);
      res.status(200).send(forecastData);
    } catch (error) {
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
}
