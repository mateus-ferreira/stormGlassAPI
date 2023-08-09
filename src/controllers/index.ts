import { Response } from 'express';
import mongoose from 'mongoose';
import { CUSTOM_VALIDATION } from '../models/user';

export abstract class BaseController {
  protected sendCreatedUpdateErrorResponse(res: Response, errorReceived: mongoose.Error.ValidationError | Error): void {
    if(errorReceived instanceof mongoose.Error.ValidationError){
      const { code, error } = this.handleClientErrors(errorReceived);
      res.status(code).send({ code, error });
    } else {
      res.status(500).send({code: 500, error: 'Something went wrong!'});
    }
  }

  private handleClientErrors(error: mongoose.Error.ValidationError): {code: number, error: String} {
    const duplicatedKindErrors = Object.values(error.errors).filter(
      (err) =>
        err.kind === CUSTOM_VALIDATION.DUPLICATED
    );
    if(duplicatedKindErrors.length) {
      return { code: 409, error: error.message };
    } else {
      return { code: 422, error: error.message };
    }
  }
}