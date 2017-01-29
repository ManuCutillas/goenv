const goenv = require('./goenv');
const options = 
{
        dirname: __dirname,
        defaultEnv:'pro',
        envPatterns:['pre','dev','pro','int'],
        types:['json','js'],
        excludeFiles:['package.json','index.js'],
        excludeFolders:['node_modules']
};

const env = goenv(__dirname, options);
console.log('initial',global.env);


const extended = goenv.extend({
	propertyExtended: {
		property: 'extended'
	}
});
console.log('extended',global.env);