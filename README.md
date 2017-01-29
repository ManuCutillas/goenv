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

`OPTIONS` - example:
- dirname: 'custom_path/to/my/folder'
- defaultEnv: 'pre' 
- envPatterns: ['dev','int','pre','pro']
- types:['json','js'],
- excludeFiles:['package.json','index.js'],
- excludeFolders:['node_modules','other_folder']