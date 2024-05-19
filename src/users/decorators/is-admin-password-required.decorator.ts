import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAdminPasswordRequired(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAdminPasswordRequired',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          if (obj.type === 'ADMIN') {
            return (
              value && typeof value === 'string' && value.trim().length > 0
            );
          }
          return true; // For non-admin users, no validation required
        },
        defaultMessage() {
          return 'Password is required for admin users.';
        },
      },
    });
  };
}
