# Introduction
A set of tools to get env files and save

### Start

- Install
```
npm i goenv --save
```
- Use
```
const goenv = require('goenv');

const options = 
{
        global: true,
        process: true,
        dirname: __dirname,
        defaultEnv:'dev',
        envName: 'nodeRocks-1.0',
        envPatterns:['dev','int','pre', 'pro'],
        types:['json','js'],
        excludeFiles:['package.json','index.js'],
        excludeFolders:['node_modules']
};

const env = goenv.init(options);

```
`OPTIONS FOR INIT METHOD` - example:
- global: true,
- process: true,
- dirname: 'custom_path/to/my/folder'
- defaultEnv: 'pre' 
- envName: 'nodeRocks-1.0'
- envPatterns: ['dev','int','pre','pro']
- types:['json','js'],
- excludeFiles:['package.json','index.js'],
- excludeFolders:['node_modules','other_folder']

### Global var env
Get the env context in other files after call goenv in index app.

```
const env = global[myEnvNameInstance];
```

### Extend env 
```
const goenv = require('goenv');
 
const optionsExtend = 
{
global: true,
process: true,
envName: 'nodeRocks-1.0'
};

const extended = goenv.extend({
	propertyExtended: {
		property: 'extended'
	}
}, optionsExtend);
console.log('extended',global['nodeRocks-1.0']);

```

### Added method to remove deep properties

```

const deleteOptions = {
        global: true,
        process: true,
        envName: 'nodeRocks-1.0',
        key: 'credentials'
};
const deleted = goenv.deleteProps(deleteOptions);

```

`OPTIONS FOR deleteProps METHOD` - example:
- global: true,
- process: true,
- envName: 'nodeRocks-1.0',
- key: 'credentials'

### Added method to write an env file

```

let optionsWriteFile ={
        filename: 'myEnvFile',
        path: __dirname,
        envName: 'nodeRocks-1.0',
        global:true
};

goenv.writeEnvFile(optionsWriteFile, (err,done)=> 
{
        if(err)
        {
                console.log(err);
        };
        console.log(done);
});

```

`OPTIONS FOR writeEnvFile METHOD` - example:
- filename: 'myEnvFile',
- path: 'path/to/save/the/envFile'
- envName: 'nodeRocks-1.0',
- global:true
- process: false