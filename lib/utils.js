const glob = require('glob');
module.exports = function () 
{
  /**
   * Extends json files
   * @param   {Object} _ext
   * @returns {Object}
   */
  const _extend = ( _ext ) =>
  {
      for ( var i = 1; i < arguments.length; ++i ) 
      {
          var from = arguments[i];
          if (typeof from !== 'object') continue;
          for (var j in from) 
          {
              if (from.hasOwnProperty(j)) 
              {
                  if (typeof from[j] === 'object' && Object.prototype.toString.call(from[j]) !== '[object Array]') 
                  {
                      _ext[j] = _extend({}, _ext[j], from[j]);
                  } else {
                      _ext[j] = from[j];
                  }
              }
          }
      }
      return _ext;
  };


  const _findAndDelete=(obj, key) => 
  {
      let _i;
      let _proto = Object.prototype;
      let _toString = _proto.toString;
      let _hasOwn = _proto.hasOwnProperty.bind(obj);

      for (_i in obj) 
      {
          if (_hasOwn(_i)) 
          {
              if (_i === key) 
              {
                  delete obj[_i];
              } else if (_toString.call(obj[_i]) === '[object Array]' || _toString.call(obj[_i]) === '[object Object]') 
              {
                  _findAndDelete(obj[_i], key);
              };
          };
      };
      return obj;
  };


  /**
   * Set env instance in global vars
   * @returns {String} 
   */
  const _setInstanceName=( options ) => (options && typeof options.envName !== 'undefined') ? options.envName : 'env';

  /**
   * Get the environment
   * @returns {String} 
   */
  //TODO FLAGS
  const _getEnvironment=( envSelections, defaultEnv ) =>
  {
      if (typeof process.env.NODE_ENV !== 'undefined') {
          let _processEnv = `${process.env.NODE_ENV.toLowerCase()}`;
          return envSelections.filter((pattern) => pattern.toLowerCase() === _processEnv);
      } else {
          process.env.NODE_ENV = defaultEnv;
          return defaultEnv;
      };
  };

  /**
   * set default env
   * @param   {Object} options
   * @returns {String} 
   */
  const _setDefaultEnv = (options) =>  (options && typeof options.defaultEnv !== 'undefined') ? options.defaultEnv : 'dev';

  /**
   * spliceEnv
   * @param   {Object} options
   * @returns {Array} 
   */
  const _spliceEnv = ( options, types, env, dirname, envRegExPatterns ) =>
  {
      let _exFiles = ( options && typeof options.excludeFiles !== 'undefined' && Object.prototype.toString.call(options.excludeFiles) == '[object Array]' && options.excludeFiles.length > 0 );
      let _exFolders = ( options && typeof options.excludeFolders !== 'undefined' && Object.prototype.toString.call(options.excludeFolders) == '[object Array]' && options.excludeFolders.length > 0 );

      types.forEach(( type ) => 
      {
          let _indexEnv = envRegExPatterns.indexOf( `**/*${env}.${type}` );
          envRegExPatterns.splice( _indexEnv, 1 );
      });

      if ( _exFolders ) {
          options.excludeFolders.forEach(( folder ) => envRegExPatterns.push( `${dirname}/${folder}/**` ));
      }

      if (_exFiles) {
      options.excludeFiles.forEach(( file ) => envRegExPatterns.push( `/**/${file}` ));
      }
      return envRegExPatterns;
  };

  /**
   * get all correct files in the the dirname
   * @param   {Object} options
   * @returns {Array} 
   */
  const _getPathFiles = (options, types, dirname, env, envRegExPatterns) =>
  {
      let _files = [],
          _tmpList = [],
          _ignore = _spliceEnv( options, types, env, dirname, envRegExPatterns);

      _files = types.map((type) => glob.sync(`${dirname}/**/*.${type}`, { ignore: _ignore}));
      return [].concat.apply([], _files );
  };

  /**
   * get all env states 
   * @param   {Object} options
   * @returns {Array} 
   */
  const _getEnvPatterns = ( options, types ) => 
  {
      let _tmpListPattern=[];
      let _envRegExPatternsIsOK=( options && typeof options.types !== 'undefined' && Object.prototype.toString.call(options.envPatterns) == '[object Array]' && options.envPatterns.length > 0 );
      let _envSelections=_envRegExPatternsIsOK ? options.envPatterns : ['prod', 'pre', 'int', 'dev'];
          _envSelections.forEach((_envOption) => 
          {
              types.forEach(( _type ) => 
              {
              _tmpListPattern.push(`**/*${_envOption}.${_type}`);
          });
      });
      return {
            listPattern: _tmpListPattern,
            envSelections: _envSelections
            };
  };

  /**
   * get all type of file to search
   * @param   {Object} options
   * @returns {Array} 
   */
  const _getTypes = ( options ) =>
  {
      let _typesIsString = (options && typeof options.types !== 'undefined' && Object.prototype.toString.call(options.types) == '[object String]' && Object.prototype.toString.call(options.types) !== '[object Array]');
      let _typesIsArray = (options && typeof options.types !== 'undefined' && Object.prototype.toString.call(options.types) == '[object Array]' && options.types.length > 0);
      
      if (_typesIsString) return [options.types];
      else if (_typesIsArray) return options.types;
      else return ['json'];
  };


  /**
   * get the dirname to search
   * @param   {Object} options
   * @returns {Array} 
   */
  const _getDirname = (options, dirname) => !!(options && typeof options.dirname !== 'undefined') ? options.dirname : dirname;

  /**
   * get the dirname to search
   * @param   {String} file
   * @returns {Object} 
   */
  const _getFile=( file )=> 
  {
      let _tmpContent;
      try {
          _tmpContent = require(file);
      } catch (e) {
          return e;
      };
      return _tmpContent;
  };

    return {
        extend: _extend,
        findAndDelete: _findAndDelete,
        setInstanceName: _setInstanceName,
        getEnvironment: _getEnvironment,
        setDefaultEnv : _setDefaultEnv,
        getPathFiles: _getPathFiles,
        getEnvPatterns: _getEnvPatterns,
        getTypes: _getTypes,
        getDirname: _getDirname,
        getFile: _getFile
    };

}();