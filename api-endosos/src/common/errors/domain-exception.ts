export abstract class DomainException extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class TemplateNotFoundException extends DomainException {
  constructor(product: string, endorsementType: string) {
    super(
      `No existe una plantilla activa para producto="${product}" y tipoEndoso="${endorsementType}".`,
      'TEMPLATE_NOT_FOUND',
    );
  }
}

export class MissingRequiredFieldsException extends DomainException {
  constructor(public readonly missingFields: string[]) {
    super('Faltan campos requeridos por la plantilla configurada.', 'MISSING_REQUIRED_FIELDS');
  }
}

export class InvalidFieldTypeException extends DomainException {
  constructor(etiqueta: string, receivedType: string) {
    super(`El campo "${etiqueta}" debe ser texto, número o booleano, se recibió ${receivedType}.`, 'INVALID_FIELD_TYPE');
  }
}

export class MisconfiguredTemplateException extends DomainException {
  constructor() {
    super('La plantilla configurada no tiene eventos aplicados definidos.', 'MISCONFIGURED_TEMPLATE');
  }
}
