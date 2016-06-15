//>>built
define("dojox/dtl/_base","dojo/_base/kernel dojo/_base/lang dojox/string/tokenize dojo/_base/json dojo/dom dojo/_base/xhr dojox/string/Builder dojo/_base/Deferred".split(" "),function(q,h,m,C,r,n,s,p){q.experimental("dojox.dtl");var d=h.getObject("dojox.dtl",!0);d._base={};d.TOKEN_BLOCK=-1;d.TOKEN_VAR=-2;d.TOKEN_COMMENT=-3;d.TOKEN_TEXT=3;d._Context=h.extend(function(a){a&&(h._mixin(this,a),a.get&&(this._getter=a.get,delete this.get))},{push:function(){var a=this,c=h.delegate(this);c.pop=function(){return a};
return c},pop:function(){throw Error("pop() called on empty Context");},get:function(a,c){var b=this._normalize;if(this._getter){var d=this._getter(a);if(void 0!==d)return b(d)}return void 0!==this[a]?b(this[a]):c},_normalize:function(a){a instanceof Date&&(a.year=a.getFullYear(),a.month=a.getMonth()+1,a.day=a.getDate(),a.date=a.year+"-"+("0"+a.month).slice(-2)+"-"+("0"+a.day).slice(-2),a.hour=a.getHours(),a.minute=a.getMinutes(),a.second=a.getSeconds(),a.microsecond=a.getMilliseconds());return a},
update:function(a){var c=this.push();a&&h._mixin(this,a);return c}});var t=/("(?:[^"\\]*(?:\\.[^"\\]*)*)"|'(?:[^'\\]*(?:\\.[^'\\]*)*)'|[^\s]+)/g,u=/\s+/g,v=function(a,c){a=a||u;a instanceof RegExp||(a=RegExp(a,"g"));if(!a.global)throw Error("You must use a globally flagged RegExp with split "+a);a.exec("");for(var b,d=[],f=0,g=0;(b=a.exec(this))&&!(d.push(this.slice(f,a.lastIndex-b[0].length)),f=a.lastIndex,c&&++g>c-1););d.push(this.slice(f));return d};d.Token=function(a,c){this.token_type=a;this.contents=
new String(h.trim(c));this.contents.split=v;this.split=function(){return String.prototype.split.apply(this.contents,arguments)}};d.Token.prototype.split_contents=function(a){var c,b=[],d=0;for(a=a||999;d++<a&&(c=t.exec(this.contents));)c=c[0],'"'==c.charAt(0)&&'"'==c.slice(-1)?b.push('"'+c.slice(1,-1).replace('\\"','"').replace("\\\\","\\")+'"'):"'"==c.charAt(0)&&"'"==c.slice(-1)?b.push("'"+c.slice(1,-1).replace("\\'","'").replace("\\\\","\\")+"'"):b.push(c);return b};var k=d.text={_get:function(a,
c,b){a=d.register.get(a,c.toLowerCase(),b);if(!a){if(!b)throw Error("No tag found for "+c);return null}b=a[1];a=a[2];-1!=b.indexOf(":")&&(b=b.split(":"),b=b.pop());var e=a;/\./.test(a)&&(a=a.replace(/\./g,"/"));require([a],function(){});a=h.getObject(e);return a[b||c]||a[c+"_"]||a[b+"_"]},getTag:function(a,c){return k._get("tag",a,c)},getFilter:function(a,c){return k._get("filter",a,c)},getTemplate:function(a){return new d.Template(k.getTemplateString(a))},getTemplateString:function(a){return n._getText(a.toString())||
""},_resolveLazy:function(a,c,b){return c?b?b.fromJson(n._getText(a))||{}:d.text.getTemplateString(a):n.get({handleAs:b?"json":"text",url:a})},_resolveTemplateArg:function(a,c){if(k._isTemplate(a)){if(!c){var b=new p;b.callback(a);return b}return a}return k._resolveLazy(a,c)},_isTemplate:function(a){return void 0===a||"string"==typeof a&&(a.match(/^\s*[<{]/)||-1!=a.indexOf(" "))},_resolveContextArg:function(a,c){if(a.constructor==Object){if(!c){var b=new p;b.callback(a);return b}return a}return k._resolveLazy(a,
c,!0)},_re:/(?:\{\{\s*(.+?)\s*\}\}|\{%\s*(load\s*)?(.+?)\s*%\})/g,tokenize:function(a){return m(a,k._re,k._parseDelims)},_parseDelims:function(a,c,b){if(a)return[d.TOKEN_VAR,a];if(c){a=h.trim(b).split(/\s+/g);for(c=0;b=a[c];c++)/\./.test(b)&&(b=b.replace(/\./g,"/")),require([b])}else return[d.TOKEN_BLOCK,b]}};d.Template=h.extend(function(a,c){var b=c?a:k._resolveTemplateArg(a,!0)||"",b=k.tokenize(b);this.nodelist=(new d._Parser(b)).parse()},{update:function(a,c){return k._resolveContextArg(c).addCallback(this,
function(b){var c=this.render(new d._Context(b));a.forEach?a.forEach(function(a){a.innerHTML=c}):r.byId(a).innerHTML=c;return this})},render:function(a,c){c=c||this.getBuffer();a=a||new d._Context({});return this.nodelist.render(a,c)+""},getBuffer:function(){return new s}});var w=/\{\{\s*(.+?)\s*\}\}/g;d.quickFilter=function(a){if(!a)return new d._NodeList;if(-1==a.indexOf("{%"))return new d._QuickNodeList(m(a,w,function(a){return new d._Filter(a)}))};d._QuickNodeList=h.extend(function(a){this.contents=
a},{render:function(a,c){for(var b=0,d=this.contents.length;b<d;b++)c=this.contents[b].resolve?c.concat(this.contents[b].resolve(a)):c.concat(this.contents[b]);return c},dummyRender:function(a){return this.render(a,d.Template.prototype.getBuffer()).toString()},clone:function(a){return this}});d._Filter=h.extend(function(a){if(!a)throw Error("Filter must be called with variable name");this.contents=a;var c=this._cache[a];c?(this.key=c[0],this.filters=c[1]):(this.filters=[],m(a,this._re,this._tokenize,
this),this._cache[a]=[this.key,this.filters])},{_cache:{},_re:/(?:^_\("([^\\"]*(?:\\.[^\\"])*)"\)|^"([^\\"]*(?:\\.[^\\"]*)*)"|^([a-zA-Z0-9_.]+)|\|(\w+)(?::(?:_\("([^\\"]*(?:\\.[^\\"])*)"\)|"([^\\"]*(?:\\.[^\\"]*)*)"|([a-zA-Z0-9_.]+)|'([^\\']*(?:\\.[^\\']*)*)'))?|^'([^\\']*(?:\\.[^\\']*)*)')/g,_values:{"0":'"',1:'"',2:"",8:'"'},_args:{4:'"',5:'"',6:"",7:"'"},_tokenize:function(){for(var a,c,b=0,d=[];b<arguments.length;b++)d[b]=void 0!==arguments[b]&&"string"==typeof arguments[b]&&arguments[b];if(this.key){for(a in this._args)if(d[a]){c=
arguments[a];"'"==this._args[a]?c=c.replace(/\\'/g,"'"):'"'==this._args[a]&&(c=c.replace(/\\"/g,'"'));c=[!this._args[a],c];break}a=k.getFilter(arguments[3]);if(!h.isFunction(a))throw Error(arguments[3]+" is not registered as a filter");this.filters.push([a,c])}else for(a in this._values)if(d[a]){this.key=this._values[a]+arguments[a]+this._values[a];break}},getExpression:function(){return this.contents},resolve:function(a){if(void 0===this.key)return"";for(var c=this.resolvePath(this.key,a),b=0,d;d=
this.filters[b];b++)c=d[1]?d[1][0]?d[0](c,this.resolvePath(d[1][1],a)):d[0](c,d[1][1]):d[0](c);return c},resolvePath:function(a,c){var b,e;b=a.charAt(0);e=a.slice(-1);if(isNaN(parseInt(b)))if('"'==b&&b==e)b=a.slice(1,-1);else{if("true"==a)return!0;if("false"==a)return!1;if("null"==a||"None"==a)return null;e=a.split(".");b=c.get(e[0]);if(h.isFunction(b)){var f=c.getThis&&c.getThis();b=b.alters_data?"":f?b.call(f):""}for(f=1;f<e.length;f++){var g=e[f];if(b){var k=b;if(h.isObject(b)&&"items"==g&&void 0===
b[g]){var g=[],l;for(l in b)g.push([l,b[l]]);b=g}else{if(b.get&&h.isFunction(b.get)&&b.get.safe)b=b.get(g);else if(void 0===b[g]){b=b[g];break}else b=b[g];h.isFunction(b)?b=b.alters_data?"":b.call(k):b instanceof Date&&(b=d._Context.prototype._normalize(b))}}else return""}}else b=-1==a.indexOf(".")?parseInt(a):parseFloat(a);return b}});d._TextNode=d._Node=h.extend(function(a){this.contents=a},{set:function(a){this.contents=a;return this},render:function(a,c){return c.concat(this.contents)},isEmpty:function(){return!h.trim(this.contents)},
clone:function(){return this}});d._NodeList=h.extend(function(a){this.contents=a||[];this.last=""},{push:function(a){this.contents.push(a);return this},concat:function(a){this.contents=this.contents.concat(a);return this},render:function(a,c){for(var b=0;b<this.contents.length;b++)if(c=this.contents[b].render(a,c),!c)throw Error("Template must return buffer");return c},dummyRender:function(a){return this.render(a,d.Template.prototype.getBuffer()).toString()},unrender:function(a,c){return c},clone:function(){return this},
rtrim:function(){for(;;)if(i=this.contents.length-1,this.contents[i]instanceof d._TextNode&&this.contents[i].isEmpty())this.contents.pop();else break;return this}});d._VarNode=h.extend(function(a){this.contents=new d._Filter(a)},{render:function(a,c){var b=this.contents.resolve(a);b.safe||(b=d._base.escape(""+b));return c.concat(b)}});d._noOpNode=new function(){this.render=this.unrender=function(a,c){return c};this.clone=function(){return this}};d._Parser=h.extend(function(a){this.contents=a},{i:0,
parse:function(a){var c={},b;a=a||[];for(var e=0;e<a.length;e++)c[a[e]]=!0;for(e=new d._NodeList;this.i<this.contents.length;)if(b=this.contents[this.i++],"string"==typeof b)e.push(new d._TextNode(b));else{var f=b[0];b=b[1];if(f==d.TOKEN_VAR)e.push(new d._VarNode(b));else if(f==d.TOKEN_BLOCK){if(c[b])return--this.i,e;var g=b.split(/\s+/g);g.length&&(g=g[0],(g=k.getTag(g))&&e.push(g(this,new d.Token(f,b))))}}if(a.length)throw Error("Could not find closing tag(s): "+a.toString());this.contents.length=
0;return e},next_token:function(){var a=this.contents[this.i++];return new d.Token(a[0],a[1])},delete_first_token:function(){this.i++},skip_past:function(a){for(;this.i<this.contents.length;){var c=this.contents[this.i++];if(c[0]==d.TOKEN_BLOCK&&c[1]==a)return}throw Error("Unclosed tag found when looking for "+a);},create_variable_node:function(a){return new d._VarNode(a)},create_text_node:function(a){return new d._TextNode(a||"")},getTemplate:function(a){return new d.Template(a)}});d.register={_registry:{attributes:[],
tags:[],filters:[]},get:function(a,c){for(var b=d.register._registry[a+"s"],e=0,f;f=b[e];e++)if("string"==typeof f[0]){if(f[0]==c)return f}else if(c.match(f[0]))return f},getAttributeTags:function(){for(var a=[],c=d.register._registry.attributes,b=0,e;e=c[b];b++)if(3==e.length)a.push(e);else{var f=h.getObject(e[1]);f&&h.isFunction(f)&&(e.push(f),a.push(e))}return a},_any:function(a,c,b){for(var e in b)for(var f=0,g;g=b[e][f];f++){var k=g;h.isArray(g)&&(k=g[0],g=g[1]);if("string"==typeof k){if("attr:"==
k.substr(0,5)){var l=g;"attr:"==l.substr(0,5)&&(l=l.slice(5));d.register._registry.attributes.push([l.toLowerCase(),c+"."+e+"."+l])}k=k.toLowerCase()}d.register._registry[a].push([k,g,c+"."+e])}},tags:function(a,c){d.register._any("tags",a,c)},filters:function(a,c){d.register._any("filters",a,c)}};var x=/&/g,y=/</g,z=/>/g,A=/'/g,B=/"/g;d._base.escape=function(a){return d.mark_safe(a.replace(x,"\x26amp;").replace(y,"\x26lt;").replace(z,"\x26gt;").replace(B,"\x26quot;").replace(A,"\x26#39;"))};d._base.safe=
function(a){"string"==typeof a&&(a=new String(a));"object"==typeof a&&(a.safe=!0);return a};d.mark_safe=d._base.safe;d.register.tags("dojox.dtl.tag",{date:["now"],logic:["if","for","ifequal","ifnotequal"],loader:["extends","block","include","load","ssi"],misc:"comment debug filter firstof spaceless templatetag widthratio with".split(" "),loop:["cycle","ifchanged","regroup"]});d.register.filters("dojox.dtl.filter",{dates:["date","time","timesince","timeuntil"],htmlstrings:["linebreaks","linebreaksbr",
"removetags","striptags"],integers:["add","get_digit"],lists:"dictsort dictsortreversed first join length length_is random slice unordered_list".split(" "),logic:["default","default_if_none","divisibleby","yesno"],misc:["filesizeformat","pluralize","phone2numeric","pprint"],strings:"addslashes capfirst center cut fix_ampersands floatformat iriencode linenumbers ljust lower make_list rjust slugify stringformat title truncatewords truncatewords_html upper urlencode urlize urlizetrunc wordcount wordwrap".split(" ")});
d.register.filters("dojox.dtl",{_base:["escape","safe"]});return d});