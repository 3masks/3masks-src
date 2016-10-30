const range = require('lodash/range');

module.exports = require('../pug/photo.pug')({
    photos: range(1, 25).map(n => require('../images/album/' + n + '.jpg'))
});
