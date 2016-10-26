const fs = require('fs');

module.exports = {
    html: {
        files: {
            'docs/index.html': 'src/pug/index.pug'
        },
        options: {
            data: function () {
                try {
                    return {
                        teachers: JSON.parse(fs.readFileSync('docs/teachers.json', 'utf-8'))
                    };
                } catch (e) {
                    console.log('no docs/teachers');
                    return {
                        teachers: []
                    };
                }
            }
        }
    }
};
