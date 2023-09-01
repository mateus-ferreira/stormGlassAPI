import config, { IConfig } from 'config';
import { connect as mongooseConnect, connection } from 'mongoose';
import * as process from "process";

const dbConfig: IConfig = config.get('App.database');

const url = process.env.MONGOURL as string;

export const connect = async (): Promise<void> => {
    await mongooseConnect(url);
};

export const close = (): Promise<void> => connection.close();
