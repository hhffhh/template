define(function (require, exports, module) {

    'use strict';

    var AMS_SPLIT = require('./split').split;


    //保护注释以免被解析
    var AMS_PlaceholderFlag = [
        [/\\#if/gm , /AMS_IF_COMMENT/gm , '#if'],
        [/\\#elseif/gm , /AMS_ELSEIF_COMMENT/gm , '#elseif'],
        [/\\#else/gm , /AMS_ELSE_COMMENT/gm , '#else'],
        [/\\#each/gm , /AMS_EACH_COMMENT/gm , '#each'],
        [/\\#end/gm , /AMS_END_COMMENT/gm , '#end'],
        [/\\#run/gm , /AMS_RUN_COMMENT/gm , '#run'],
        [/\\#js/gm , /AMS_JS_COMMENT/gm , '#js'],
        [/\\#\{/, /AMS_VARIABLE_COMMENT/, '#{'],
        [/\\\)/gmi, /AMS_CLOSE/gm, ')']
    ];

    //移除注释
    function AMS_RemoveNote(tpl) {
        return tpl.replace(/^\s*##.*$/gmi, '');
    }


    // 首先排除转义字符，以免对模板分析造成干扰
    function AMS_temporaryProtection(tpl) {

        for (var i = 0; i < AMS_PlaceholderFlag.length; i++) {
            var o = AMS_PlaceholderFlag[i];
            tpl = tpl.replace(o[0], o[1].source)
        }

        tpl = tpl.replace(/#js([\s\S]*?)#end/gm, 'AMS_FLAG_JS$1AMS_FLAG_ENDJS');

        return tpl
    }

    // temporaryProtection的逆方法
    function AMS_revertProtection(tpl) {

        for (var i = 0; i < AMS_PlaceholderFlag.length; i++) {
            var o = AMS_PlaceholderFlag[i];
            tpl = tpl.replace(o[1], o[2])
        }

        return tpl
    }

//替换#if  #end 之间的elseif 和 #else
    function AMS_ReplaceElse(str) {
        str = str.replace(/#(elseif)[\s]*(\([^)]+\)){1}/gm, 'AMS_FLAG_ELSEIF$2');
        str = str.replace(/#else/gm, 'AMS_FLAG_ELSE');
        //Revert TEMPBLOCK
        str = str.replace(/AMSTEMPBLOCKS==(.*)==/gm, '\\#$1');
        return str;
    }

//目前ECMAScript规范中暂不支持否定逆向环视，故有了这个啰嗦的方法
    function AMS_TranslateIF(tpl) {

        tpl = AMS_temporaryProtection(tpl);

        var flag = ['#if', '#each', '#js'];
        var flagRe = /#(if|each|js)/gm;
        var flagPart = /(?:#if|#each|#js)([\s\S]+?)#end/gm;

        function _translateIf() {
            if (!/#end/.test(tpl)) return;
            var _tpl = tpl.match(/[\s\S]+?#end/)[0];

            var _str = '';
            if (/#(if|each|js)/gm.test(_tpl)) {
                var point = [];

                for (var i = 0; i < flag.length; i++) {
                    var s = flag[i];
                    var _p = _tpl.lastIndexOf(s);
                    if (_p > -1) point.push(_p)
                }

                _tpl = _tpl.substring(Math.max.apply(null, point));
                var c = _tpl.match(flagRe);
                var $1 = c[0].substring(1);
                var _a = '', _b = '';
                if ($1 == "if") {
                    _a = 'AMS_FLAG_IF';
                    _b = 'AMS_FLAG_ENDIF';
                } else if ($1 == "each") {
                    _a = 'AMS_FLAG_EACH';
                    _b = 'AMS_FLAG_ENDEACH';
                } else if ($1 == "js") {
                    _a = 'AMS_FLAG_JS';
                    _b = 'AMS_FLAG_ENDJS';
                }
                _str = _tpl.replace(flagPart, _a + '$1' + _b);
                if ($1 === 'if') _str = AMS_ReplaceElse(_str);
                tpl = tpl.replace(_tpl, _str);
            } else {
                //_str = _tpl.substring(0, _tpl.length - 4) + "echo(\"#e\"+\"nd\")";
                _str = _tpl.substring(0, _tpl.length - 4);
                tpl = tpl.replace(_tpl, _str);
            }
            _translateIf();
        }

        _translateIf();

        //接下来分析模板
        function replaceEcho(_value) {
            var re = /[\\]+#\{([^}]+)\}/gm;
            tpl = _value.replace(re, 'AMS_VARIABLE_COMMENT$1}');
            tpl = tpl.replace(/#\{([^}]+)\}/gm, 'AMS_PLACEHOLDER_START--$1--AMS_PLACEHOLDER_END')
        }

        replaceEcho(tpl);

        return tpl;
    }

//寻找变量值
    function AMS_TransportOperation(tpl) {

        var re = /(AMS_FLAG_IF|AMS_FLAG_ELSEIF){1}(?:[\s]*([^)]+?\)))(.*?)(?=AMS_FLAG_ELSEIF|AMS_FLAG_ELSE|AMS_FLAG_ENDIF|AMS_FLAG_EACH|AMS_FLAG_JS|[\r\n])/gm;
        tpl = tpl.replace(re, '$1AMS_OPERATION--$2--AMS_OPERATION$3');

        return tpl;
    }

//转换JS代码块
    function AMS_transportJS(tpl) {
        var _jsRe = /AMS_FLAG_JS(?:[\s\S]+?)AMS_FLAG_ENDJS/gm;
        var match = tpl.match(_jsRe);
        if (match) {
            for (var i = 0; i < match.length; i++) {
                var str = match[i];
                var _s = str.match(/AMS_FLAG_JS([\s\S]+?)AMS_FLAG_ENDJS/);
                if (!_s) continue;
                tpl = tpl.replace(str, 'AMS_FLAG_JS' + encodeURIComponent(_s[1]) + 'AMS_FLAG_ENDJS');
            }
        }
        return tpl
    }

    function AMS_transportVar(tpl) {
        tpl = tpl.replace(/^[\s]*#run(.+?)$/gm, 'AMS_RUN_START$1AMS_RUN_END');
        return tpl
    }


    //检查IF标签配对
    var AMS_OPEN_IF = [
        'AMS_FLAG_IFAMS_OPERATION',
        'AMS_FLAG_ELSEIFAMS_OPERATION'
    ];

    var AMS_CLOSE_IF = 'AMS_OPERATION';
    var AMS_IF_FLAG = new RegExp('' +
        '(' +
        AMS_OPEN_IF[0] + '--(?:.+?)--' + AMS_CLOSE_IF + '|' +
        AMS_OPEN_IF[1] + '--(?:.+?)--' + AMS_CLOSE_IF + '|' +
        'AMS_FLAG_EACH(?:\\([^)]+?\\))|' +
        'AMS_PLACEHOLDER_START' + '--(?:.+?)--' + 'AMS_PLACEHOLDER_END|' +
        'AMS_FLAG_JS(?:.+?)AMS_FLAG_ENDJS|' +
        'AMS_RUN_START(?:.+?)AMS_RUN_END|' +
        'AMS_FLAG_ELSE|AMS_FLAG_ENDIF|AMS_FLAG_ENDEACH)', 'gm');

    var AMS_forEachRe = /AMS_FLAG_EACH\((.+?)[\s]+in[\s]+([^\s]+)\)/;


    function AMS_CreateTpl(value) {

        var tpl;
        var html = '\r\n//AMS_COMPILED\r\n';

        //开始转换为JS
        var _tpl;

        //首先移除注释
        tpl = AMS_RemoveNote(value);
        tpl = AMS_TranslateIF(tpl);
        tpl = AMS_transportJS(tpl);
        tpl = AMS_TransportOperation(tpl);
        tpl = AMS_transportVar(tpl);
        tpl = AMS_revertProtection(tpl);

        _tpl = tpl.split(/[\r\n]/);


        for (var l = 0; l < _tpl.length; l++) {
            var str = _tpl[l];

            //检查IF标签配对
            var arr = AMS_SPLIT(str, AMS_IF_FLAG);
            for (var i = 0; i < arr.length; i++) {
                var _str = arr[i];
                if (AMS_IF_FLAG.test(_str)) {
                    //匹配IF语句
                    if (/AMS_FLAG_IFAMS_OPERATION/.test(_str)) {
                        html += _str.replace(/AMS_FLAG_IFAMS_OPERATION--(.+?)--AMS_OPERATION/g, 'if $1 {');
                    } else if (/AMS_FLAG_ELSEIFAMS_OPERATION/.test(_str)) {
                        html += _str.replace(/AMS_FLAG_ELSEIFAMS_OPERATION--(.+?)--AMS_OPERATION/, '} else if $1 { ');
                    } else if (_str === 'AMS_FLAG_ELSE') {
                        html += _str.replace(/AMS_FLAG_ELSE/, '} else {');
                    } else if (_str === 'AMS_FLAG_ENDIF') {
                        html += _str.replace(/AMS_FLAG_ENDIF/gm, '}');
                    }
                    //匹配Each语句
                    else if (/AMS_FLAG_EACH/.test(_str)) {
                        html += _str.replace(AMS_forEachRe, function (_str) {
                            var match = _str.match(AMS_forEachRe);
                            var $1 = match[1].split(',');
                            var $2 = match[2];

                            //避免让嵌套的索引变量名重名，导致循环错误
                            var i = $1.length > 1 ? $1[1] : 'index';

                            var arr = $1[2] ? $1[2] : $2;
                            //模拟ES5 中forEach的参数定义
                            return '' +
                                //如果存在forEach中第3个形参
                                ($1[2] ? 'var ' + $1[2] + '=' + $2 + ';' : '') + '\r\n' +
                                '(function(){for(var ' + i + '=0;' + i + '<' + arr + '.length;' + i + '++){\r\n' +
                                'var ' + $1[0] + '=' + arr + '[' + i + '];\r\n';

                        });
                    } else if (_str === 'AMS_FLAG_ENDEACH') {
                        html += _str.replace(/AMS_FLAG_ENDEACH/gm, '}})();');
                    }
                    //匹配占位符
                    else if (/AMS_PLACEHOLDER_START/.test(_str)) {
                        html += _str.replace(/AMS_PLACEHOLDER_START--(.+?)--AMS_PLACEHOLDER_END/, 'echo($1);');
                    }
                    //匹配JS语句
                    else if (/AMS_FLAG_JS/.test(_str)) {
                        _str.match(/AMS_FLAG_JS(.+?)AMS_FLAG_ENDJS/);
                        html += _str.replace(/AMS_FLAG_JS(.+?)AMS_FLAG_ENDJS/, decodeURIComponent(_str.match(/AMS_FLAG_JS(.+?)AMS_FLAG_ENDJS/)[1]) + '\r\n');
                    }//匹配RUN
                    else if (/AMS_RUN_START/.test(_str)) {
                        html += _str.replace(/AMS_RUN_START(.+?)AMS_RUN_END/, '$1');
                    }
                } else {
                    if (_str.length > 0) html += 'AMS_RENDER+="' + _str.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '";';
                }
                if (_str.length > 0) html += '\r\n';
                if (i === arr.length - 1) html += 'AMS_RENDER+="\\r\\n";';
            }

            html += '\r\n'

        }

        return html

    }

    function AMS_Render(AMS_VALUE, AMS_DATA, s) {

        //每次都更新头

        //头文件每次都更新
        var head = 'var AMS_RENDER=" ";\r\n;function echo(s){AMS_RENDER+=s;}\r\n';

        for (var k in AMS_DATA) {
            if (AMS_DATA.hasOwnProperty(k)) {
                head += 'var ' + k + ' = AMS_DATA["' + k + '"];\r\n'
            }
        }


        //如果存在编译标识，则表明之前已经编译过
        if (AMS_VALUE.indexOf('//AMS_COMPILED') >= 0) {
            return eval(head + AMS_VALUE);
        } else {
            return eval(head + AMS_CreateTpl(AMS_VALUE, AMS_DATA));
        }
    }


    exports.render = AMS_Render;

    exports.compile = AMS_CreateTpl;

});
