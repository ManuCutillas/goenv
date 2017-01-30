

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
   * Find and delete props
   * @param   {Object} _ext
   * @returns {Object}
   */
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