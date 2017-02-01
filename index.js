const path = require('path');
const callsite = require('callsite');
const fs = require('fs');
const utils=require('./lib/utils');
module.exports = function () 
{
    let _merge = {};
    const init=( options ) =>
    {
        let _stack = callsite(),
            _requester = _stack[1].getFileName(),
            _requestDirname = path.dirname(_requester);

        let _dirname = utils.getDirname( options, _requestDirname ),
            _types = utils.getTypes( options ),
            _dEnv = utils.setDefaultEnv( options ),
            _envsObj = utils.getEnvPatterns( options, _types ),
            _envRegExPatterns = _envsObj.listPattern,
            _envSelections = _envsObj.envSelections,
            _env = utils.getEnvironment(_envSelections, _dEnv),
            _files = utils.getPathFiles( options, _types, _dirname, _env, _envRegExPatterns),
            _envName = utils.setInstanceName( options );

        let _globalItsOk = ( options && typeof  options.global !== 'undefined' &&  options.global),
            _processEnvItsOk = !!( options && typeof options.process !== 'undefined' &&  options.process);
        
        if(typeof _files !== 'undefined' && _files.length > 0 )
        {
            _files.forEach(( file ) => 
            {
                let _tmpFile = utils.getFile( file );
                _merge = utils.extend( _merge, _tmpFile );
            });
        };
        _merge['env']=_env;
        _merge['envName']=_envName;

        if( options ) global[_envName] = _merge;  
        if( _processEnvItsOk )
        {
            process.env[_envName.toUpperCase()] = JSON.stringify(_merge);
        };
        return _merge;
    };

    const extend=( ext, options )=>
    {
        let extended;
        let _globalItsOk = !!(options && typeof options.global !== 'undefined' && options.global);
        let _processEnvItsOk = !!(options && typeof options.process !== 'undefined' && options.process);
        let _envNAMEItsOK = ( options && typeof options.envName !== 'undefined');

        if(_envNAMEItsOK)
        {
            if(typeof global[options.envName] !== 'undefined' && global)
            {
                let _newExtend;
                    _newExtend = global[options.envName];
                    _newExtend = utils.extend(_newExtend, ext);
                    global[options.envName] = _newExtend;
                    extended = _newExtend;
            };

            if(typeof process.env[options.envName.toUpperCase()] !== 'undefined')
            {
                    let _newExtend;
                        _newExtend = JSON.parse(process.env[options.envName.toUpperCase()]);
                        _newExtend = utils.extend(_newExtend, ext);
                        process.env[options.envName.toUpperCase()] = JSON.stringify(_newExtend);
                        extended = _newExtend;
            };
        }
        else
        {
            if(typeof global.env !== 'undefined' && global)
            {
                let _newExtend;
                    _newExtend = global.env;
                    _newExtend = utils.extend(_newExtend, ext);
                    global.env = _newExtend;
                    extended = _newExtend;
            };

            if(typeof process.env.ENV !== 'undefined' && options.process)
            {
                let _newExtend;
                    _newExtend = JSON.parse(process.env.ENV);
                    _newExtend = utils.extend(_newExtend, ext);
                    process.env.ENV = JSON.stringify(_newExtend);
                    extended = _newExtend;
            };
        }
        return extended;
    };

    const writeEnvFile = function()
    {
        let options;
        let done;
        if(arguments.length > 0 && typeof arguments[arguments.length-1] == 'function'){
            done=arguments[arguments.length-1];
        };
        
        if(arguments.length > 0 && typeof arguments[0].filename !== 'undefined' || arguments.length > 0 && typeof arguments[0].path !== 'undefined')
        {
             options=arguments[0];
        };

        let _filename = 'env';
        let _envNameItsOk = (options && typeof options.envName !== 'undefined' && options.envName);
        let _globalItsOk = (options && _envNameItsOk && typeof options.global !== 'undefined' && options.global && typeof global[options.envName] !== 'undefined');
        let _processItsOk = (options && _envNameItsOk && typeof options.process !== 'undefined' && options.process && typeof process.env[options.envName.toUpperCase()] !== 'undefined');
        
        //filename
        if(options && typeof options.filename !== 'undefined')
        {
          _filename = options.filename
        }
        else if(options && typeof options.filename === 'undefined' && _envNameItsOk)
        {
          _filename = options.envName.toLowerCase();
        };

        let _stack = callsite();
        let _requester = _stack[1].getFileName();
        let _folder = !!(options &&  typeof options.path !== 'undefined') ? options.path : path.dirname(_requester);
        if( _globalItsOk || _processItsOk )
        {   
            try {
                if(_globalItsOk){
                  fs.writeFileSync(`${_folder}/${_filename}.json`, JSON.stringify(global[options.envName], null, 4));  
                } else if(_processItsOk)
                {
                   fs.writeFileSync(`${_folder}/${_filename}.json`, JSON.stringify(process.env[options.envName.toUpperCase()], null, 4));   
                }
                if(done)
                {
                    return done(null, `File: ${_filename}.json it´s created in folder: ${_folder}`);
                };
            } catch(e) 
            {
                return done(e, null);
            };
        } 
        else
        {
            if(done)
            {
                return done( new Error('global.env doesn´t exist, initializes goenv first.'), null );
            };
        };
    };

    const deleteProps = ( options ) => 
    {
        let _globalItsOk = !!(options && typeof options.global !== 'undefined' && options.global);
        let _processEnvItsOk = !!(options && typeof options.process !== 'undefined' && options.process);
        let _optionsEnvNameItsOk = !!(_processEnvItsOk && typeof options.envName !== 'undefined');
        let _keyItsOk = !!(options && typeof options.key !== 'undefined');
        let results = [];

        if(options && _globalItsOk && typeof global[options.envName] !== 'undefined' && _keyItsOk)
        {
            var _delEnv = global[options.envName];
            utils.findAndDelete(global[options.envName],options.key);
            global[options.envName] = _delEnv;
            results.push('ok');
        };
        if(options && _processEnvItsOk && _optionsEnvNameItsOk && typeof process.env[options.envName.toUpperCase()] !== 'undefined' && _keyItsOk)
        {
            var _delEnv = JSON.parse(process.env[options.envName.toUpperCase()]);
            utils.findAndDelete(_delEnv, options.key);
            process.env[options.envName.toUpperCase()] = JSON.stringify(_delEnv);
            results.push('ok');
        };
        return results;
    };

    return {
        init: init,
        extend: extend,
        writeEnvFile: writeEnvFile,
        deleteProps: deleteProps
    };

}();