---
date: 2013-03-31 21:54:21
id: 93
path: source/_posts/2013-03-31-my-string-copystr-v2.md
tags:
  - C
  - 标准库
title: string 标准库实现日志
---

``` c
#include <stdio.h>
#include <malloc.h>
```

本文主要讨论：`memcpy`、`memmove`、`strcpy`、`strncpy`、`strcat`、`strncat`

## memcpy

memcpy的函数原型为：

```c
void *memcpy( void *s1, const void *s2, size_t n );
```

功能：函数 memcpy 从 s2 指向的对象中复制n个字符到s1指定的对象中。
如果发生在两个重叠的对象中，则这种行为未定义。

从上面这段文字来看，有两个概念是暂时不清晰的。

什么是 size_t ?
下面的这段是从crtdefs.h中拉过来的：

<!-- more -->

```c
typedef _W64 unsigned int size_t;
//所以 size_t 只不过是被 typedef 过的 unsigned int.
```

size_t 类型定义在 cstddef 头文件中，该文件是 C 标准库的头文件 stddef.h 的 C++ 版。
它是一个与机器相关的 unsigned 类型，其大小足以保证存储内存中对象的大小。
size_t 是标准 C 库中定义的，应为 unsigned int，在 64 位系统中为 long unsigned int。
关签大神指出：「理解为当前系统的可寻址内存宽度, 32 位下就是 32 位，64 位下是 64.」

当时写的时候没有细查、感谢 frimin studio 大神 关签 指出错误。

什么是**未定义**？
顾名思义，未定义就是说这种情况是C标准中没有详细说明的情况。
这时候它的执行标准是和所使用的编译器有关。

```c
void *my_memcpy_beta( void *s1, const void *s2, size_t n )
{
    unsigned int i;
    void *save = s1;

    for( i = 0; i < n; s1++, s2++, i++ )
         *s1 = *s2;
    return save;
}
```

上面是首次实现的代码，但是vs一直报错并提示： s1++, s2++,*s1 = *s2;这些表达式必须是指向完整对象类型的指针。
后来发现，在ANSI C标准中，不允许对void指针进行算术运算。 例如：在动态内存分配中使用malloc()申请到的内存是
通过返回 void *指针实现的，但我们需要使用这段内存空间时，需要将该指针 通过强制类型转换转换成我们需要的类型。
通过对比C标准库的实现，最终代码修改如下：

``` c
void *my_memcpy( void *s1, const void *s2, size_t n ) 
{
    char *use_s1 = (char *)s1;
    const char *use_s2 = (char *)s2;
    for(  ; n > 0; n-- )
        *use_s1++ = *use_s2++;
    return s1;
}
```

很奇怪的事情是，在C标准库中将s1,s2赋值给use_s1,use_s2的时候居然没有对其进行强制类型转换至于之前所描述的未
定义的行为，我认为是不需要定义的，即便是面对两个重叠对象时，他同样能够安然无恙的进行复制。当然，一般人应该不
会做这种无聊的事情吧。。

但是，容易发现的是，该函数并没有进行安全性检查，如果s1[p]中的p < n，则会发生越界，造成不安全的后果。

## memmove

memmove的函数原型为：

```c
void *memmove( void *s1, const void *s2, size_t n );
```

功能：函数memmove从s2指向的对象中复制n个字符串到s1指向的对象中，复制看上去就像先把n个字符从s2指向的对象复
制到一个n个字符的临时数组中，这个临时数组和s1、s2指向的对象都不重叠，然后再把这n个字符从临时数组中复制到s1
指向的对象中。

```c
void *my_memmove_beta( void *s1, const void *s2, size_t n )
{
    char *use_s1 = (char *)s1;
    const char *use_s2 = (const char *)s2;
    char *memory = (char *)malloc( n*sizeof(char) );
    char *save = memory;

    for(  ; n > 0; n-- )
        *memory++ = *use_s2++;
    memory = save;
    for(  ; n > 0; n-- )
        *use_s1++ = *memory++;
    free( memory );
    memory = NULL;
    return s1;
}
```

从表面上看，这个函数的复制行为似乎显得比较笨拙，因为它自身需要开辟一段新的内存空间（临时数组），它似乎显得并
不是那么的高效。但是，这样做的安全性会明显高于memcpy，这是因为，如果当s1与s2之间的距离小于n时，如果s2 < s1，
那么如果对

> 这里还没写完。。忘记当时的想法了。。

```c
void *my_memmove( void *s1, const void *s2, size_t n )
{
    char *use_s1 = (char *)s1;
    const char *use_s2 = (const char *)s2;
    if( use_s2 < use_s1 &amp;&amp; use_s1 < use_s2 + n )
     {
         for(  use_s1 += n, use_s2 += n; n > 0; n-- )
            *(--use_s1) = *(--use_s2);
    }
    else
    {
        for(  ; n > 0; n-- )
            *use_s1++ = *use_s2++;
    }
    return s1;
}
```

## strcpy

strcpy的函数原型为：

```c
char *strcpy( char *s1, const char *s2 )
```

功能：把s2指向的串（包括终止的空字符）复制到s1指向的数组中，如果复制发生在两个重叠的对象中，这行为为定义。

```c
char *my_strcpy_beta( char *s1, const char *s2 )
{
    char *save = s1;
    while( *s2 != '&#92;&#48;' )
    {
        *s1 = *s2;
        s1++;
        s2++;
    }
    *s1 = '&#92;&#48;';
    return save;
}
```

如果可以保证目标串s1和源串s2不重叠，那么strcpy(s1,s2)将安全并快速地执行复制操作。如果他们可能重叠，使用

```c
memmove(s1,s2,strlen(s2)+1)
```

来代替它。不要认为这两个函数可以以任何特定的顺序访问内存。

```c
char *my_strcpy( char *s1, const char *s2 )
{
    char *save = s1;
    while( *s2 != '&#92;&#48;' )
        *s1++ = *s2++;
    *s1 = '&#92;&#48;';
    return save;
}
```

## strncpy

strncpy的函数原型为：

```c
char *strcpy( char *s1, const char *s2 )
```

功能：把s2指向的串（包括终止的空字符）复制到s1指向的数组中，如果复制发生在两个重叠的对象中，这行为为定义。

```c
char *my_strncpy_beta( char *s1, const char *s2, size_t n )
{
    char *s_save = s1;
    int i;
    for( i = 0; i < n; i++ )
        *s1++ = *s2++;
    return s_save;
}
```

如果可以确定目标串s1和源串s2没有重叠，strncpy(s1,s2,n2) 将安全地执行复制操作。然而，函数在s1处精确地存储 
n2 个字符，他可能丢弃尾部的字符，包括终止的控制符。函数会根据需要存储一些额外的空支付来弥补一个短的计数。
如果两个区域可能重叠，使用memmove(s1,s2,n2)来代替它。（必须在结尾存储适当数量的空字符，如果这很重要的话。）
不要认为这两个函数以任意特定的顺序访问存储空间。

注意到beta既有可能导致复制过程中将s1的尾符覆盖，从而导致字符串输出时没有结束标识符，导致诡异的出错。
而标准库中居然建立了一个循环，cpy过程结束后再添加了n个\0，这样诡异的操作难道不会导致越界吗？

```c
char *my_strncpy( char *s1, const char *s2, size_t n )
{
    char *s_save = s1;
    for( ; 0 < n; n-- )
        *s1++ = *s2++;
    *s1 = '&#92;&#48;';
    return s_save;
}
```

## strcat

strcat的函数原型为：

```c
char *strcat( char *s1, const char *s2 );
```

功能：函数strcat把s2指向的串（包括终止的空字符）的副本添加到s1指向的串的末尾，s2得第一个字符覆盖s1末尾的空
支付。如果复制发生在两个重叠的对象中，则行为未定义。

```c
char *my_strcat_beta( char *s1, const char *s2 )
{
    char *save = s1;
    while( *s1 != '&#92;&#48;' )
        s1++;
    while( *s2 != '&#92;&#48;' )
        *s1++ = *s2++;
    *s1 = '&#92;&#48;';
    return save;
}
```

如果只需要连接两个串s1和s2或者两个短串，使用strcat(s1,s2)。否则，可以使用例如strcpy(s1+=strlen(s1),s2)
这样的形式。这样可以避免对串的厨师部分进行重复和不断延长的重扫描。要保证目标数组足够大可以存放连接起来的串。
注意，strcat返回s1，而不是指向串的形的尾部的指针。

```c
char *my_strcat( char *s1, const char *s2 )
{
    char *save = s1;
    while( *s1 != '&#92;&#48;' )
        s1++;
    while( *s2 != '&#92;&#48;' )
        *s1++ = *s2++;
    *s1 = '&#92;&#48;';
    return save;
}
```

## strncat

strncat的函数原型为：

```c
char *strcat( char *s1, const char *s2, size_t n );
```

功能：函数strncat匆匆s2指向的数组中将最多n个字符（空字符及其后面的字符不添加）添加到s1指向的串的末尾，
s2的第一个字符覆盖s1末尾的空字符。通常在最后的结果后面加上一个空字符。如果复制发生在两个重叠的对象中，则行为未定义。

```c
char *my_strncat_beta( char *s1, char *s2, size_t n )
{
    char *save = s1;
    int i;
    while( *s1 != '&#92;&#48;' )
        s1++;
    for( i = 0; i < n; i++)
        *s1++ = *s2++;
    *s1 = '&#92;&#48;';
    return save;
}
```

strncat(s1,s2,n2)中的strn是指函数连接到以空支付结尾的串s1的尾部的串s2。函数最多复制n2个字符，如果它没有
复制终止的控制符的话，还会加上一个空字符。因此，调用strncat的结果最多使strlen(s1)增大n2。这就使strncat比
strcat更安全，虽然可能街截取s3的前n2个字符为代价。

```c
char *my_strncat( char *s1, char *s2, size_t n )
{
    char *save = s1;
    while( *s1 != '&#92;&#48;' )
        s1++;
    for( ; 0 < n; n--)
        *s1++ = *s2++;
    *s1 = '&#92;&#48;';
    return save;
}
```

## 整合

比较上面的所有复制函数，事实上可以整合到一个函数当中，对于strcat、和strncat完全可以在书写实参的时候加以处理。

对字符串的处理，我们构思以下函数，方便完成字符串的copy工作。

```c
char *strcpy_saf_quk( char *s1, const char *s2, size_t n )
{
    char *save_s1 = s1;
    const char *save_s2 = s2;

    if( s1 - s2 >= n || s2 - s1 >= n )
    {
        while( n-- > 0 )
            *s1++ = *s2++;
    }
    else if( s1 < s2 &amp;&amp; s2 - s1 < n )        //  避免了const char *s2的本意失效的问题，具体见下图。
    {
        while( s1 != save_s2 )
        {
            *s1++ = *s2++;
        }
    }
    else if( s2 < s1 &amp;&amp; s1 - s2 < n )
    {
        for(  s1 += n, s2 += n; n > 0; n-- )
            *(--s1) = *(--s2);
    }

    return save_s1;
}
```

![](/images/posts/93/1.jpg)

如果要从2006的位置往2000的位置拷贝6个以上的字符时，原本用于防止数据被修改的const char *就显得无力了，
因此，这里写出的效果是2006后的字符串最多只拷贝六个字符到2000-2005。

当然，如果有必要上面的函数可以进一步改进：

1. 增加参数，让用户来控制是否具备s2的覆盖功能。
2. 上面的这个程序没有整合strcat和strncat的功能，如果对传入实参写为s1+=strlen(s1)，对象重叠的话会导致错误。
3. 待挖掘。