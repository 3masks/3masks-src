const {savePassword} = require('./util/pwd');
const pwd = process.argv[2];

savePassword(pwd).then(
    () => { console.log('admin password is successfully set'); },
    (err) => {
        console.log('something went wrong');
        console.log(err);
    }
);
