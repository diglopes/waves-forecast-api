import './util/module-alias';
import { Server } from '@overnightjs/core';
import { json, Application } from 'express';
import { ForecastController } from './controllers/forecast';
import { Database } from './database';
import { BeachesController } from './controllers/beaches';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    this.addControllers([forecastController, beachesController]);
  }

  private async databaseSetup(): Promise<void> {
    await Database.connect();
  }

  public async close(): Promise<void> {
    await Database.close();
  }

  public getApp(): Application {
    return this.app;
  }
}
