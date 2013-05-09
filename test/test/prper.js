/**
 * Created with JetBrains WebStorm.
 * User: xiongsongsong
 * Date: 13-5-8
 * Time: 下午10:41
 * To change this template use File | Settings | File Templates.
 */


define(function () {


// 数据量
    var length = 100;
// 渲染次数
    var number = 10000;


    var data = {
        list: []
    };

    for (var i = 0; i < length; i++) {
        data.list.push({
            index: i,
            user: '<strong style="color:red">糖饼</strong>',
            site: 'http://www.planeart.cn',
            weibo: 'http://weibo.com/planeart',
            QQweibo: 'http://t.qq.com/tangbin'
        });
    }

    var tpl = '#each(item in list) <li>#{item.index}. 用户: #{item.user}/ 网站：#{item.site}</li>#end'

    var a = Date.now();

    for (var k = 0; k < number; k++) {
        render(tpl, data)
    }

    var b = Date.now();

    console.log('编译模式' + (b - a) + '毫秒')


    var _tpl = compile(tpl, data);

    console.log(_tpl)

    var c = Date.now();
    for (var j = 0; j < number; j++) {
        render(_tpl, data, true)
    }
    var d = Date.now();
    console.log('缓存模式' + (d - c) + '毫秒')


});