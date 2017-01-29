# Introduction
A set of tools to get env files and save in memory of node process

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
        dirname: 'custom_path/to/my/folder',
        defaultEnv:'dev',
        envPatterns:['dev','int','pre','pro'],
        types:['json','js'],
        excludeFiles:['package.json','index.js'],
        excludeFolders:['node_modules']
};

const env = goenv.init(options);

```
`OPTIONS FOR INIT METHOD` - example:
- dirname: 'custom_path/to/my/folder'
- defaultEnv: 'pre' 
- envPatterns: ['dev','int','pre','pro']
- types:['json','js'],
- excludeFiles:['package.json','index.js'],
- excludeFolders:['node_modules','other_folder']

### Global var env
Get the env context in other files after call goenv in index app.

```
const env = global.env
```

### Extend env 
```
const goenv = require('goenv');
 
goenv.extend({
    extendConfig:{
        property1:1,
        property2:2
    }
});

```

### Added method to write an env file

```

const optionsWriteFile ={
        filename: 'initConfig',
        path: __dirname
};

goenv.writeEnvFile( optionsWriteFile, ( err, done ) => 
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