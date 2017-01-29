# Introduction
A set of tools to get env files and save in memory of node process

### Start
```
const goenv = require('goenv');

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

`OPTIONS` - example
- dirname: __dirname
- defaultEnv: 'pro' 
- envPatterns: ['pre','dev','pro','int']
- types:['json','js'],
- excludeFiles:['package.json','index.js'],
- excludeFolders:['node_modules']