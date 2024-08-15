import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import mongoose, { isValidObjectId } from 'mongoose';

@ValidatorConstraint({ name: 'ObjectID', async: false })
export class IsValidIdConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments) {
    const isValid = mongoose.Types.ObjectId.isValid(value);
    return isValid;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Id is not valid ObjectId';
  }
}

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: isValidObjectId,
    });
  };
}
