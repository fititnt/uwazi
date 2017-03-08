export function notEmpty(val) {
  if (Array.isArray(val)) {
    return Boolean(val.length);
  }
  if (typeof val === 'number') {
    return true;
  }
  return !!val && val.trim() !== '';
}

export default {
  generate(template) {
    let validationObject = {
      title: {required: notEmpty}
    };

    template.properties.forEach((property) => {
      if (property.required) {
        validationObject[`metadata.${property.name}`] = {required: notEmpty};
      }
    });

    return validationObject;
  }
};
