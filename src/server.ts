import './util/module-alias';
import { Server } from '@overnightjs/core';
import { json, Application } from 'express';
import { ForecastController } from './controllers/forecast';
import { Database } from './database';
import { BeachesController } from './controllers/beaches';
import { UsersCotroller } from './controllers/users';

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
    const usersController = new UsersCotroller();
    this.addControllers([
      forecastController,
      beachesController,
      usersController,
    ]);
  }

  private async databaseSetup(): Promise<void> {
    await Database.connect();
  }

  public async close(): Promise<void> {
    await Database.close();
  }

  public async start(): Promise<void> {
    this.app.listen(this.port, () => {
      console.info('Server listening on port:', this.port);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}
