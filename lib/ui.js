const CLI = require('clui');
const color = require('cli-color');

const { Spinner } = CLI;

const spinnerStyles = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];

function getSpinner(text) {
  return new Spinner(text, spinnerStyles);
}

const colors = {
  success: color.greenBright,
  failure: color.redBright,
  doing: color.blueBright,
  prompt: color.magentaBright,
};

exports.getSpinner = getSpinner;
exports.colors = colors;
