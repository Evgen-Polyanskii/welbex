const yup = require('yup');

const schema = yup.object({
  message: yup.string().required(),
  published_at: yup.date(),
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return e.inner.map(({ path, errors }) => ({ [path]: errors }));
  }
};

module.exports = validate;
