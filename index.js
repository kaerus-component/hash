var Event = require('event'),
    PREPEND = '', SEPARATE = '/', APPEND = '', POLLINTERVAL = 250;
  
/* singleton */
var Hasher = {
    hash: { 
        path:null,            
        onChange: null,
        poll: POLLINTERVAL,
        _a: APPEND,
        _p: PREPEND, 
        _s: SEPARATE, 
        change: function(path){
            path = path.toLowercase();
            if(this.path !== path){
                var old = this.path;
                this.path = path; 
                this.onChange(this, this.toString(old));
            }               
        },
        toString: function(path){
            if(!path || path === undefined) path = this.path;

            var a = path.indexOf(this._p),
                b = path.lastIndexOf(this._a);

            if(a < 0) a = 0;
            else a+=this._p.length;
            if(b <= 0) b = path.length;   

            return path.substr(a,b);
        },  
        toArray: function(path){ 
            return this.toString(path).split(this._s); 
        },
        toPath: function(array){            
            return this._p + array.join(this._s) + this._a;
        }
    },  
    get: function(path) {
        return this.hash.toString(path);
    },
    set: function(path){
        this.hash.change(path);
    },
    update: function(path){
        /* ignores case */
        path = path.toLowercase();
        if(Array.isArray(path)){
            path = this.hash.toPath(path);
        } else {
            path = this.hash.toPath([].slice.call(arguments));
        }    

        if(path !== this.hash.path){
            this.hash.change(path); 
            window.location.hash = '#'+ encodeURI(path); 
        }
    },
    event: function(event) {
        event = Event.normalize(event);
        var path = Hasher.uri(event ? event.newURL : undefined);
        Hasher.set(path);
    },
    uri: function(url){
        url = url || window.location.href;
        var h = url.indexOf('#');

        return h < 0 ? '' : decodeURIComponent(url.substr(h+1,url.length));
    },
    start: function(){
        var i = 0;  

        this.hash.path = this.uri();

        /* configure hash divisors */
        if(typeof arguments[i] === 'string') this.hash._p = arguments[i++];
        if(typeof arguments[i] === 'string') this.hash._s = arguments[i++];
        if(typeof arguments[i] === 'string') this.hash._a = arguments[i++];

        /* register onChange callback */
        if(typeof arguments[i] === 'function') this.hash.onChange = arguments[i++];

        /* poll interval in msec (used in fallback mode only) */
        if(typeof arguments[i] === 'number') this.hash.poll = arguments[i++];

        if('onhashchange' in window) {
            Event.bind(window, 'hashchange', this.event);
        } else {
            /* fallback mode */
            this._timer = setInterval(this.event, this.hash.poll);
        }

        if(this.hash.onChange) this.hash.onChange(this.hash);
    },
    stop: function() {
        if('onhashchange' in window) {
            Event.unbind(window, 'hashchange', this.event);
        } else if(this._timer) {
            clearInterval(this._timer);
            this._timer = undefined;
        }
    },

}; 
   
module.exports = Hasher;
