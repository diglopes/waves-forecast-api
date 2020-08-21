import config, { IConfig } from 'config';
import mongoose, { Mongoose } from 'mongoose';

const dbConfig: IConfig = config.get('App.database');

export class Database {
  public static async connect(): Promise<Mongoose> {
    return mongoose.connect(dbConfig.get('mongoUrl'), {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  public static async close(): Promise<void> {
    return mongoose.connection.close();
  }
}
