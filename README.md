# template

---

语法简洁，易用的JavaScript模板引擎。

---

## API

```javascript
template('#{name}',{name:'arale'}); //output: arale
```

#### #{placeholder}

```javascript
template('#{name}',{name:'arale'}) //output: arale
template('#{name.substring(0,1)}',{name:'arale'})  //output: a
```

#### #if
```javascript
template('#if(n>1) n>1 #end',{n:2}) //output: n>1
template('#if(n>1) n>1 #elseif(n<1) n<1 #else #{n} #end',{n:1}); //output: 1
```


#### #each
```javascript
template('#each(item in arr)#{item}#end',{arr:['a','r','a','l','e']}); //output: arale
template('#each(n in arr)#if(n%2==0)#{n}#end#end',{arr:[1,2,3,4,5,6]}); //output: 246

```

#### #run

单行javascript语句，需要独占一行，多行定义请用#js

```javascript
#run var arr=[1,2,3];
//之后可以在模板中直接使用
#each(n in arr) #{n} #end //output:123
```

#### #js

可以理解为html文件中的script标记

```javascript
#js
var arr=['a','r','a','l','e'];
echo (arr.join('')); // output:arale
#end
```

#### 注释

反斜杠
\\#if | \\#each | \\#end ...


## 性能 & 兼容性

* 内建缓存
* IE6也兼容

## Bug反馈

* 此处提issue或邮箱: xiongsongsong@outlook.com

## todo
* 缓存启用开关
* 模板注释
* 增加demo页
