const goenv = require('goenv');

//const env = goenv.init();
//By default get all your .json files in this folder to compose the env config.

///Config options
const options = 
{
        dirname: __dirname,
        defaultEnv:'dev',
        envPatterns:['dev','int','pre', 'pro'],
        types:['json','js'],
        excludeFiles:['package.json','index.js'],
        excludeFolders:['node_modules']
};

const env = goenv.init(options);
console.log('initial',global.env);

//Extend your initial config env.
const extended = goenv.extend({
	propertyExtended: {
		property: 'extended'
	}
});
console.log('extended',global.env);


//Write your config in a unique json file by default with env name in this path.
/*goenv.writeEnvFile((err,done)=> 
{
        if(err)
        {
                console.log(err);
        };
        console.log(done);
});*/

//Write your config in a unique json file with a custom name and custom path.
let optionsWriteFile ={
        filename: 'myEnvFile',
        path: __dirname
};

goenv.writeEnvFile(optionsWriteFile, (err,done)=> 
{
        if(err)
        {
                console.log(err);
        };
        console.log(done);
});