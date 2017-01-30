const glob = require('glob');
const path = require('path');
const callsite = require('callsite');
const fs = require('fs');
module.exports = function () 
{
  let _merge = {};
  let _envPatterns = [];
  let _dirname,
      _types, 
      _env,
      _dEnv, 
      _files,
      _envName;
  
  /**
   * Extends json files
   * @param   {Object} _ext
   * @returns {Object}
   */
   function _extend( _ext ) 
    {
        for (var i = 1; i < arguments.length; ++i) {
            var from = arguments[i];
            if (typeof from !== 'object') continue;
            for (var j in from) {
                if (from.hasOwnProperty(j)) 
                {
                    if(typeof from[j] === 'object' && Object.prototype.toString.call(from[j]) !== '[object Array]')
                    {
                        _ext[j] = _extend({}, _ext[j], from[j]);
                    }
                    else
                    {
                        _ext[j] = from[j];
                    }
                }
            }
        }
        return _ext;
  };

  function _findAndDelete(obj,key)
  {
        let _i;
        let _proto=Object.prototype;
        let _toString=_proto.toString;
        let _hasOwn=_proto.hasOwnProperty.bind(obj);

        for (_i in obj) 
        {
            if (_hasOwn(_i)) 
            {
                if (_i === key) 
                {
                    delete obj[_i];
                } 
                else if ( _toString.call(obj[_i]) === '[object Array]' || _toString.call(obj[_i]) === '[object Object]' ) 
                {
                    _findAndDelete(obj[_i], key);
                };
            };
        };
      return obj;
  };

  function deleteProps(options) 
  {
      let _optionsItsOk = !!(options && Object.prototype.toString.call(options) === '[object Object]');
      let _globalItsOk = !!(_optionsItsOk && typeof options.global !== undefined && options.global);
      let _processEnvItsOk = !!(_optionsItsOk && typeof options.process !== undefined && options.process);
      let _optionsEnvNameItsOk = !!(_processEnvItsOk && typeof options.envName !== undefined);
      let _keyItsOk = !!(_optionsItsOk && typeof options.key !== undefined);
      let results = [];

      if(_optionsItsOk && _globalItsOk && typeof global[options.envName] !== 'undefined' && _keyItsOk)
      {
            let _delEnv = _findAndDelete(global[options.envName],options.key);
            global[options.envName] = _delEnv ;
            results.push('ok');
      };
      if(_optionsItsOk && _processEnvItsOk && _optionsEnvNameItsOk)
      {
            let pProcessName = options.envName.toUpperCase();
            if(typeof process.env[pProcessName] !== 'undefined' && _keyItsOk)
            {
                let _delEnv  = _findAndDelete(JSON.parse(process.env[pProcessName]), options.key);
                process.env[options.envName] = _delEnv;
                results.push('ok');
            };
      };

      return results;
  };

  /**
   * Set env instance in global vars
   * @returns {String} 
   */
  function _setInstanceName(options)
  {
      let _itsOk = ( options && typeof options.envName!== 'undefined' );
      return _itsOk ? options.envName : 'env';
  };
    
  /**
   * Get the environment
   * @returns {String} 
   */
    function _getEnvironment()
    {
        let _getEnv;
        if(typeof process.env.NODE_ENV !== 'undefined')
        {

            let _processEnv = process.env.NODE_ENV.toLowerCase();
            _getEnv = _envPatterns.filter((pattern)=>
            {
                return pattern.toLowerCase() === _processEnv;
            });
            return _getEnv;
        }
        else
        {
            process.env.NODE_ENV= _dEnv;
            return _dEnv;
        };
    };

  /**
   * set default env
   * @param   {Object} options
   * @returns {String} 
   */
   function _setDefaultEnv(options)
   {
       return (options && typeof options.defaultEnv !== 'undefined') ? options.defaultEnv : 'dev';
   };

  /**
   * spliceEnv
   * @param   {Object} options
   * @returns {Array} 
   */
   function _spliceEnv(options)
   {
       let _exFiles= (options && typeof options.excludeFiles !== 'undefined' && Object.prototype.toString.call(options.excludeFiles) == '[object Array]' && options.excludeFiles.length > 0);
       let _exFolders= (options && typeof options.excludeFolders !== 'undefined' && Object.prototype.toString.call(options.excludeFolders) == '[object Array]' && options.excludeFolders.length > 0);

       _types.forEach((type)=>
       {
            let _indexEnv = _envPatterns.indexOf(`**/*${_env}.${type}`);
            _envPatterns.splice(_indexEnv, 1);
       });

       if(_exFolders)
       {
           options.excludeFolders.forEach((folder)=>
           {
                _envPatterns.push(`${_dirname}/${folder}/**`);
           });
       };

       if(_exFiles)
       {
           options.excludeFiles.forEach((file)=>
           {
                _envPatterns.push(`/**/${file}`);
           });
       };
       return _envPatterns;
   };
    
    /**
     * get all correct files in the the dirname
     * @param   {Object} options
     * @returns {Array} 
     */
    function _getPathFiles(options)
    {
        let files=[];
        let _tmpList=[];
        let _ignore = _spliceEnv(options);

        files = _types.map((type) =>
        {
            return glob.sync(`${_dirname}/**/*.${type}`, { ignore: _ignore });
        });
        files = [].concat.apply([],files); 
        return files;
    };

    /**
     * get all env states 
     * @param   {Object} options
     * @returns {Array} 
     */
    function _getEnvPatterns(options)
    {
        let tmpListPattern = [];
        let _envPatternsIsOK = (options && typeof options.types !== 'undefined' && Object.prototype.toString.call(options.envPatterns) == '[object Array]' && options.envPatterns.length > 0);
        let _patterns = _envPatternsIsOK ? options.envPatterns : ['pro','pre','int','dev'];
        _patterns.forEach((_envOption)=>
        {
            _types.forEach((_type)=>
            {
                tmpListPattern.push(`**/*${_envOption}.${_type}`);
            });
        });
        return tmpListPattern;
    };

    /**
     * get all type of file to search
     * @param   {Object} options
     * @returns {Array} 
     */
    function _getTypes(options)
    {
        let _typesIsString = (options && typeof options.types !== 'undefined' && Object.prototype.toString.call(options.types) == '[object String]' && Object.prototype.toString.call(options.types) !== '[object Array]');
        let _typesIsArray = (options && typeof options.types !== 'undefined' && Object.prototype.toString.call(options.types) == '[object Array]' &&  options.types.length > 0);
        if(_typesIsString)
        {
            return [options.types];       
        }
        else if(_typesIsArray)
        {
            return options.types;
        }
        else
        {       
            return ['json'];
        };
    };

    /**
     * get the dirname to search
     * @param   {Object} options
     * @returns {Array} 
     */
    function _getDirname(options)
    {
        let _stack = callsite();
        let _requester = _stack[1].getFileName();
        return !!(options && typeof options.dirname !== 'undefined') ? options.dirname : path.dirname(_requester);
    };

    /**
     * get the dirname to search
     * @param   {String} file
     * @returns {Object} 
     */
    function _getFile(file)
    {
        let _tmpContent;
        try {  
            _tmpContent = require( file );   
        } catch(e) 
        {
            return e.stack;
        };
        return _tmpContent;
    };

    function init(options)
    {
        _dirname = _getDirname(options);
        _types = _getTypes(options);
        _dEnv = _setDefaultEnv(options);
        _envPatterns = _getEnvPatterns(options);
        _env = _getEnvironment(options);
        _files = _getPathFiles(options);
        _envName = _setInstanceName(options);

        let _optionsItsOk = !!(options && Object.prototype.toString.call(options) === '[object Object]');
        let _globalItsOk = !!(_optionsItsOk && typeof options.global !== undefined && options.global);
        let _processEnvItsOk = !!(_optionsItsOk && typeof options.process !== undefined && options.process);
        
        if(typeof _files !== 'undefined' && Object.prototype.toString.call(_files) == '[object Array]' &&   _files.length > 0 )
        {
            _files.forEach(( file ) => 
            {
                let _tmpFile = _getFile( file );
                _merge = _extend(_merge, _tmpFile);
            });
        };
        _merge['env']=_env;
        _merge['envName']=_envName;

        if(_optionsItsOk) global[_envName] = _merge;  
        if(_processEnvItsOk)
        {
            let pEnvName = _envName.toUpperCase();
            process.env[pEnvName] = JSON.stringify(_merge);
        };
        return _merge;
    };

    function extend(ext, options)
    {
        let extended;
        let _optionsItsOk = !!(options && Object.prototype.toString.call(options) === '[object Object]');
        let _globalItsOk = !!(_optionsItsOk && typeof options.global !== undefined && options.global);
        let _processEnvItsOk = !!(_optionsItsOk && typeof options.process !== undefined && options.process);
        let _envNAMEItsOK = ( _optionsItsOk && typeof options.envName !== 'undefined');

        if(ext && Object.prototype.toString.call(ext) !== '[object Object]')
        {
            return 'Please set a object';
        };

        if(_optionsItsOk && typeof options.envName !== 'undefined')
        {
            if(typeof global[options.envName] !== 'undefined' && global)
            {
                let _newExtend;
                    _newExtend = global[options.envName];
                    _newExtend = _extend(_newExtend, ext);
                    global[options.envName] = _newExtend;
                    extended = _newExtend;
            };
            if(_envNAMEItsOK)
            {
                let uperEnvName = options.envName.toUpperCase();
                if(typeof process.env[uperEnvName] !== 'undefined')
                {
                    let _newExtend;
                        _newExtend = JSON.parse(process.env[uperEnvName]);
                        _newExtend = _extend(_newExtend, ext);
                        process.env[uperEnvName] = JSON.stringify(_newExtend);
                        extended = _newExtend;
                };
            }
        }
        else
        {
            if(typeof global.env !== 'undefined' && global)
            {
                let _newExtend;
                    _newExtend = global.env;
                    _newExtend = _extend(_newExtend, ext);
                    global.env = _newExtend;
                    extended = _newExtend;
            };

            if(typeof process.env.ENV !== 'undefined' && options.process)
            {
                let _newExtend;
                    _newExtend = JSON.parse(process.env.ENV);
                    _newExtend = _extend(_newExtend, ext);
                    process.env.ENV = JSON.stringify(_newExtend);
                    extended = _newExtend;
            };

        }

        return extended;
    };

    function writeEnvFile()
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

    return {
        init: init,
        extend: extend,
        writeEnvFile: writeEnvFile,
        deleteProps: deleteProps
    };

}();