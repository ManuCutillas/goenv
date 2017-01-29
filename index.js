const glob = require('glob');
const path = require('path');
const callsite = require('callsite');
module.exports = function () 
{
  let _merge = {};
  let _envPatterns = [];
  let _dirname,
      _types, 
      _env, 
      _dEnv, 
      _files;
  
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
    
  /**
   * Get the environment
   * @param   {Object} options
   * @returns {String} 
   */
    function _getEnvironment(options)
    {
        if(process.env.NODE_ENV !== undefined)
        {
            let _processEnv = process.env.NODE_ENV.toLowerCase();
            _env = _envPatterns.filter((pattern)=>
            {
                return pattern.toLowerCase() === _processEnv;
            });
        }
        else
        {
            process.env.NODE_ENV = _dEnv;
            return(_dEnv);
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
            let _indexEnv = _envPatterns.indexOf(`**/*${_dEnv}.${type}`);
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
        
        if(typeof _files !== 'undefined' && Object.prototype.toString.call(_files) == '[object Array]' &&   _files.length > 0 )
        {
            _files.forEach(( file ) => 
            {
                let _tmpFile = _getFile( file );
                _merge = _extend(_merge, _tmpFile);
            });
        }; 
        _merge['envName']=_env;
        global.env = _merge;  
        return _merge;
    };

    function extend(ext)
    {
        let _newExtend = global.env;
        _newExtend = _extend(_newExtend, ext);
        global.env =  _newExtend;
        return _newExtend;
    };

    return {
        init: init,
        extend: extend
    };

}();