const path = require('path');

const local = (...rest) => path.join(__dirname, ...rest)

module.exports = function (shipit) {
    require('shipit-deploy')(shipit);
    require('shipit-shared')(shipit);
    
    shipit.initConfig({
        default: {
            workspace: local('tmp'),
            deployTo: '/var/www/3masks-deploy',
            repositoryUrl: 'git@github.com:3masks/3masks-src.git',
            branch: 'master',
            ignores: ['.git', 'node_modules'],
            keepReleases: 2,
            deleteOnRollback: false,
            key: '~/.ssh/id_rsa',
            shallowClone: true,
            shared: {
                overwrite: true,
                dirs: ['node_modules', 'public', 'data']
            }
        },
        production: {
            domain: '138.201.173.99',
            servers: 'root@138.201.173.99'
        }
    });

    shipit.on('deploy', () => {
        shipit.start('docs');
    });

    shipit.on('deployed', () => {
        shipit.start('npmInstall');
        shipit.start('startServer');
    });

    shipit.blTask('docs', () => 
        shipit.local('grunt build')
              .then(() =>
                shipit.remoteCopy(local('docs'), `${shipit.currentPath}/docs`)
              ));

    shipit.blTask('npmInstall', () =>
        shipit.remote(`cd ${shipit.currentPath} && npm i`));

    shipit.blTask('startServer', () =>
        //shipit.remote(`cd ${shipit.currentPath} && NODE_ENV=production pm2 startOrRestart ${shipit.currentPath}/deploy/pm2.json`));
          shipit.remote(`cd ${shipit.currentPath} && pwd`));
};
