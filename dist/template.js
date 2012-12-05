define("arale/template/1.0.0/split",[],function(e,t,n){var r;r=r||function(e){var t=String.prototype.split,n=/()??/.exec("")[1]===e,r;return r=function(r,i,s){if(Object.prototype.toString.call(i)!=="[object RegExp]")return t.call(r,i,s);var o=[],u=(i.ignoreCase?"i":"")+(i.multiline?"m":"")+(i.extended?"x":"")+(i.sticky?"y":""),a=0,i=new RegExp(i.source,u+"g"),f,l,c,h;r+="",n||(f=new RegExp("^"+i.source+"$(?!\\s)",u)),s=s===e?-1>>>0:s>>>0;while(l=i.exec(r)){c=l.index+l[0].length;if(c>a){o.push(r.slice(a,l.index)),!n&&l.length>1&&l[0].replace(f,function(){for(var t=1;t<arguments.length-2;t++)arguments[t]===e&&(l[t]=e)}),l.length>1&&l.index<r.length&&Array.prototype.push.apply(o,l.slice(1)),h=l[0].length,a=c;if(o.length>=s)break}i.lastIndex===l.index&&i.lastIndex++}return a===r.length?h||!i.test(""):o.push(r.slice(a)),o.length>s?o.slice(0,s):o},String.prototype.split=function(e,t){return r(this,e,t)},r}(),t.split=r}),define("arale/template/1.0.0/json2",[],function(require,exports,module){typeof JSON!="object"&&(JSON={}),function(){"use strict";function f(e){return e<10?"0"+e:e}function quote(e){return escapable.lastIndex=0,escapable.test(e)?'"'+e.replace(escapable,function(e){var t=meta[e];return typeof t=="string"?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var n,r,i,s,o=gap,u,a=t[e];a&&typeof a=="object"&&typeof a.toJSON=="function"&&(a=a.toJSON(e)),typeof rep=="function"&&(a=rep.call(t,e,a));switch(typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a)return"null";gap+=indent,u=[];if(Object.prototype.toString.apply(a)==="[object Array]"){s=a.length;for(n=0;n<s;n+=1)u[n]=str(n,a)||"null";return i=u.length===0?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+o+"]":"["+u.join(",")+"]",gap=o,i}if(rep&&typeof rep=="object"){s=rep.length;for(n=0;n<s;n+=1)typeof rep[n]=="string"&&(r=rep[n],i=str(r,a),i&&u.push(quote(r)+(gap?": ":":")+i))}else for(r in a)Object.prototype.hasOwnProperty.call(a,r)&&(i=str(r,a),i&&u.push(quote(r)+(gap?": ":":")+i));return i=u.length===0?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+o+"}":"{"+u.join(",")+"}",gap=o,i}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(e){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(e){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(e,t,n){var r;gap="",indent="";if(typeof n=="number")for(r=0;r<n;r+=1)indent+=" ";else typeof n=="string"&&(indent=n);rep=t;if(!t||typeof t=="function"||typeof t=="object"&&typeof t.length=="number")return str("",{"":e});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(e,t){var n,r,i=e[t];if(i&&typeof i=="object")for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r=walk(i,n),r!==undefined?i[n]=r:delete i[n]);return reviver.call(e,t,i)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}(),exports.JSON=JSON}),define("arale/template/1.0.0/template",["./split","./json2"],function(require,exports,module){"use strict";function temporaryProtection(e){for(var t=0;t<placeholderFlag.length;t++){var n=placeholderFlag[t];e=e.replace(n[0],n[1].source)}return e=e.replace(/#js([\s\S]*?)#end/gm,"AMS_FLAG_JS$1AMS_FLAG_ENDJS"),e}function revertProtection(e){for(var t=0;t<placeholderFlag.length;t++){var n=placeholderFlag[t];e=e.replace(n[1],n[2])}return e}function replaceElse(e){return e=e.replace(/#(elseif)[\s]*(\([^)]+\)){1}/gm,"AMS_FLAG_ELSEIF$2"),e=e.replace(/#else/gm,"AMS_FLAG_ELSE"),e=e.replace(/AMSTEMPBLOCKS==(.*)==/gm,"\\#$1"),e}function translateIF(e){function i(){if(!/#end/.test(e))return;var s=e.match(/[\s\S]+?#end/)[0],o="";if(/#(if|each|js)/gm.test(s)){var u=[];for(var a=0;a<t.length;a++){var f=t[a],l=s.lastIndexOf(f);l>-1&&u.push(l)}s=s.substring(Math.max.apply(null,u));var c=s.match(n),h=c[0].substring(1),p="",d="";h=="if"?(p="AMS_FLAG_IF",d="AMS_FLAG_ENDIF"):h=="each"?(p="AMS_FLAG_EACH",d="AMS_FLAG_ENDEACH"):h=="js"&&(p="AMS_FLAG_JS",d="AMS_FLAG_ENDJS"),o=s.replace(r,p+"$1"+d),h==="if"&&(o=replaceElse(o)),e=e.replace(s,o)}else o=s.substring(0,s.length-4),e=e.replace(s,o);i()}function s(t){var n=/[\\]+#\{([^}]+)\}/gm;e=t.replace(n,"AMS_VARIABLE_COMMENT$1}"),e=e.replace(/#\{([^}]+)\}/gm,"AMS_PLACEHOLDER_START--$1--AMS_PLACEHOLDER_END")}e=temporaryProtection(e);var t=["#if","#each","#js"],n=/#(if|each|js)/gm,r=/(?:#if|#each|#js)([\s\S]+?)#end/gm;return i(),s(e),e}function transportOperation(e){var t=/(AMS_FLAG_IF|AMS_FLAG_ELSEIF){1}(?:[\s]*([^)]+?\)))(.*?)(?=AMS_FLAG_ELSEIF|AMS_FLAG_ELSE|AMS_FLAG_ENDIF|AMS_FLAG_EACH|AMS_FLAG_JS|[\r\n])/gm;return e=e.replace(t,"$1AMS_OPERATION--$2--AMS_OPERATION$3"),e}function transportJS(e){var t=/AMS_FLAG_JS(?:[\s\S]+?)AMS_FLAG_ENDJS/gm,n=e.match(t);if(n)for(var r=0;r<n.length;r++){var i=n[r],s=i.match(/AMS_FLAG_JS([\s\S]+?)AMS_FLAG_ENDJS/);if(!s)continue;e=e.replace(i,"AMS_FLAG_JS"+encodeURIComponent(s[1])+"AMS_FLAG_ENDJS")}return e}function transportVar(e){return e=e.replace(/^[\s]*#run(.+?)$/gm,"AMS_RUN_START$1AMS_RUN_END"),e}function render(value,data){var tpl,isCache=!1,html;for(var c=0;c<cache.length;c++){var _cache=cache[c];if(value===_cache[0]){html=_cache[1],isCache=!0;break}}var head=['(function(){ \r\n "use strict";\r\n',"var AMS_RENDER=[];\r\n","function echo(s){AMS_RENDER.push(s);}\r\n"];head.push("var AMS_DATA="+JSON.stringify(data)+";\r\n");for(var k in data)data.hasOwnProperty(k)&&head.push("var "+k+" = AMS_DATA."+k+";\r\n");var _tpl;if(isCache===!1){html=[],tpl=translateIF(value),tpl=transportJS(tpl),tpl=transportOperation(tpl),tpl=transportVar(tpl),tpl=revertProtection(tpl),_tpl=tpl.split(/[\r\n]/);for(var l=0;l<_tpl.length;l++){var str=_tpl[l],arr=split(str,IF_FLAG);for(var i=0;i<arr.length;i++){var _str=arr[i];IF_FLAG.test(_str)?/AMS_FLAG_IFAMS_OPERATION/.test(_str)?html.push(_str.replace(/AMS_FLAG_IFAMS_OPERATION--(.+?)--AMS_OPERATION/g,"if $1 {")):/AMS_FLAG_ELSEIFAMS_OPERATION/.test(_str)?html.push(_str.replace(/AMS_FLAG_ELSEIFAMS_OPERATION--(.+?)--AMS_OPERATION/,"} else if $1 { ")):_str==="AMS_FLAG_ELSE"?html.push(_str.replace(/AMS_FLAG_ELSE/,"} else {")):_str==="AMS_FLAG_ENDIF"?html.push(_str.replace(/AMS_FLAG_ENDIF/gm,"}")):/AMS_FLAG_EACH/.test(_str)?html.push(_str.replace(forEachRe,function(e){var t=e.match(forEachRe),n=t[1].split(","),r=t[2],i=n.length>1?n[1]:"index",s=n[2]?n[2]:r;return""+(n[2]?"var "+n[2]+"="+r+";":"")+"\r\n"+"for(var "+i+"=0;"+i+"<"+s+".length;"+i+"++){\r\n"+"var "+n[0]+"="+s+"["+i+"];\r\n"})):_str==="AMS_FLAG_ENDEACH"?html.push(_str.replace(/AMS_FLAG_ENDEACH/gm,"};")):/AMS_PLACEHOLDER_START/.test(_str)?html.push(_str.replace(/AMS_PLACEHOLDER_START--(.+?)--AMS_PLACEHOLDER_END/,"echo($1);")):/AMS_FLAG_JS/.test(_str)?(_str.match(/AMS_FLAG_JS(.+?)AMS_FLAG_ENDJS/),html.push(_str.replace(/AMS_FLAG_JS(.+?)AMS_FLAG_ENDJS/,decodeURIComponent(_str.match(/AMS_FLAG_JS(.+?)AMS_FLAG_ENDJS/)[1])+"\r\n"))):/AMS_RUN_START/.test(_str)&&html.push(_str.replace(/AMS_RUN_START(.+?)AMS_RUN_END/,"$1")):_str.length>0&&html.push('AMS_RENDER.push("'+_str.replace(/\\/g,"\\\\").replace(/"/g,'\\"')+'");'),_str.length>0&&html.push("\r\n"),i===arr.length-1&&html.push('AMS_RENDER.push("\\r\\n");')}html.push("\r\n")}cache.push([value,html.join("")])}return eval(head.join("")+""+(isCache?html:html.join(""))+"\r\n return AMS_RENDER.join('');\r\n})();")}var split=require("./split").split,JSON=require("./json2").JSON,cache=[[]],placeholderFlag=[[/\\#if/gm,/AMS_IF_COMMENT/gm,"#if"],[/\\#elseif/gm,/AMS_ELSEIF_COMMENT/gm,"#elseif"],[/\\#else/gm,/AMS_ELSE_COMMENT/gm,"#else"],[/\\#each/gm,/AMS_EACH_COMMENT/gm,"#each"],[/\\#end/gm,/AMS_END_COMMENT/gm,"#end"],[/\\#run/gm,/AMS_RUN_COMMENT/gm,"#run"],[/\\#js/gm,/AMS_JS_COMMENT/gm,"#js"],[/\\#\{/,/AMS_VARIABLE_COMMENT/,"#{"],[/\$/gmi,/AMS_RE/gm,"$"],[/\\\)/gmi,/AMS_CLOSE/gm,")"]],OPEN_IF=["AMS_FLAG_IFAMS_OPERATION","AMS_FLAG_ELSEIFAMS_OPERATION"],CLOSE_IF="AMS_OPERATION",IF_FLAG=new RegExp("("+OPEN_IF[0]+"--(?:.+?)--"+CLOSE_IF+"|"+OPEN_IF[1]+"--(?:.+?)--"+CLOSE_IF+"|"+"AMS_FLAG_EACH(?:\\([^)]+?\\))|"+"AMS_PLACEHOLDER_START"+"--(?:.+?)--"+"AMS_PLACEHOLDER_END|"+"AMS_FLAG_JS(?:.+?)AMS_FLAG_ENDJS|"+"AMS_RUN_START(?:.+?)AMS_RUN_END|"+"AMS_FLAG_ELSE|AMS_FLAG_ENDIF|AMS_FLAG_ENDEACH)","gm"),forEachRe=/AMS_FLAG_EACH\((.+?)[\s]+in[\s]+([^\s]+)\)/;module.exports?module.exports=render:window.template=template});