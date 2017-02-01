const goenv = require('goenv');

//const env = goenv.init();
//By default get all your .json files in this folder to compose the env config.

/* ====================================
          METHOD TO INIT
=======================================*/
const options = 
{
        global: true,
        process: true,
        dirname: __dirname,
        defaultEnv:'dev',
        envName: 'nodeRocks-1.0',
        envPatterns:['dev','int','pre', 'prod'],
        types:['json','js'],
        excludeFiles:['package.json','index.js'],
        excludeFolders:['node_modules']
};

const env = goenv.init(options);
console.log('initial',global.env);


/* ====================================
          METHOD TO EXTEND
=======================================*/
const optionsExtend = 
{
global: true,
process: true,
envName: 'nodeRocks-1.0'
};
//Extend your initial config env.
const extended = goenv.extend({
	propertyExtended: {
		property: 'extended'
	}
}, optionsExtend);
console.log('extended',global.env);


/* ====================================
           METHOD TO writeEnvFile
=======================================*/
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
        path: __dirname,
        envName: 'nodeRocks-1.0',
        global:true
};

goenv.writeEnvFile(optionsWriteFile, (err,done)=> 
{
    if(err) console.log(err);

    console.log(done);
});

/* ====================================
         METHOD TO DELETE PROPS
=======================================*/
const deleteOptions = {
        global: true,
        process: true,
        envName: 'nodeRocks-1.0',
        key: 'credentials'
};
const deleted = goenv.deleteProps(deleteOptions);

/* ====================================
         PRINT FINAL ENVS
=======================================*/
console.log('global env ===============>', global['nodeRocks-1.0']);
console.log('process env ===============>' ,JSON.parse(process.env['nodeRocks-1.0'.toUpperCase()]));