const fs = require("fs");
const handlebars = require("handlebars");

function renderEmailTemplate(templatePath, data) {
  const templateSource = fs.readFileSync(templatePath, "utf-8");
  const template = handlebars.compile(templateSource);
  return template(data);
}

module.exports = renderEmailTemplate;
