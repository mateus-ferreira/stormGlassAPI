import './util/module-alias';
import { Server } from '@overnightjs/core';
import { Application } from 'express';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecast';
import * as database from './database';
import { BeachesController } from './controllers/beaches';
import { UsersController } from './controllers/users';

export class SetupServer extends Server {
    /*
     * same as this.port = port, declaring as private here will
     * add the port variable to the SetupServer instance
     */
    constructor(private port = 3000) {
        super();
    }

    /*
     * We use a different method to init instead of using the constructor
     * this way we allow the server to be used in tests and normal initialization
     */
    public async init(): Promise<void> {
        this.setupExpress();
        this.setupControllers();
        await this.databaseSetup();
    }

    private setupExpress(): void {
        this.app.use(bodyParser.json());
        this.setupControllers();
    }

    private setupControllers(): void {
        const forecastController = new ForecastController();
        const beachesController = new BeachesController();
        const usersController = new UsersController();
        this.addControllers([
            forecastController,
            beachesController,
            usersController,
        ]);
    }

    private async databaseSetup(): Promise<void> {
        await database.connect();
    }

    public async close(): Promise<void> {
        await database.close();
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.info(`Server listening on port: ${this.port}`);
        });
    }

    public getApp(): Application {
        return this.app;
    }
}
