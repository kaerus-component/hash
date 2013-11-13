var Event = require('event'),
    PREPEND = '', 
    SEPARATE = '/', 
    APPEND = '', 
    POLLINTERVAL = 250,
    routing = {};
  
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
            if(this.path !== path){
                var from = this.toString(), 
                    to = this.toString(path),
                    match = Object.keys(routing).filter(function(route){
                        return to.match(RegExp(route));
                    }).sort(), n = match.length;
                
                this.path = path; 
                
                function next(x){ if(n--) routing[match[n]](to,from,next,x) }
                if(n) next();       
            } 

            return this.path;              
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
    set: function(newUrl){
        return this.hash.change(this.uri(newUrl));
    },
    uri: function(url){
        url = url || window.location.href;
        var h = url.indexOf('#');

        return h < 0 ? '' : decodeURIComponent(url.substr(h+1,url.length));

        return this;
    },
    update: function(path){
        if(Array.isArray(path)){
            path = this.hash.toPath(path);
        } else {
            path = this.hash.toPath([].slice.call(arguments));
        }    

        if(path !== this.hash.path){
            this.hash.change(path); 
            window.location.hash = '#'+ encodeURI(path); 
        }

        return this;
    },
    event: function(event) {
        event = Event.normalize(event);
        Hasher.set(event.newURL);

        return this;
    },
    route: function(match,callback){
        routing[match] = callback;

        return this;
    },
    init: function() {
        var i = 0, options = {}, callback;

        if(typeof arguments[i] === 'object')
            options = arguments[i++];
        if(typeof arguments[i] === 'function')
            callback = arguments[i++];

        this.start(options,callback);

        return this;
    },
    start: function(options,callback){

        this.hash.path = this.uri();

        /* configure hash divisors */
        this.hash._p = options.prepend || PREPEND;
        this.hash._s = options.separate || SEPARATE;
        this.hash._a = options.append || APPEND;

        /* poll interval in msec (used in fallback mode only) */
        this.hash.poll = options.poll || POLLINTERVAL;

        if('onhashchange' in window) {
            Event.bind(window, 'hashchange', this.event);
        } else {
            /* fallback mode */
            this._timer = setInterval(this.event, this.hash.poll);
        }

        if(callback) callback(this.hash.toString());

        return this;
    },
    stop: function() {
        if('onhashchange' in window) {
            Event.unbind(window, 'hashchange', this.event);
        } else if(this._timer) {
            clearInterval(this._timer);
            this._timer = undefined;
        }

        return this;
    },

}; 
   
module.exports = Hasher;
