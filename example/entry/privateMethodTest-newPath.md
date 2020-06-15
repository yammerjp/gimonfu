---
title: TypeScriptでprivate methodを外部から呼ぶ
date: 2019-10-17T02:50:00.000Z
categories:
  - TypeScript
  - JavaScript
  - テスト
id: "26006613563256659"
draft: false
---
題名通りの話。

TypeScriptにてprivate methodを単体テストするとき、直接呼べないので困ることがある。
private methodを外部から呼べないのは正しいふるまいだが、テストプログラム側からも呼べないのは不便だ。裏技的ではあるが、TypeScriptの制限を回避して呼ぶ方法があるので紹介する。

## 前提 TypeScriptのprivate

JavaScript(ES6~)では、class記法が使える。  
TypeScriptではclass記法で書かれたmethodにprivate修飾子をつけることが出来る。
private修飾子をつけると、同じクラス内からしかmethodを呼べない。

具体的な記法は下の例を参照のこと。

## 解決策

TypeScriptのprivate修飾子によるアクセス制限を回避する方法は2つある。  

`hogeClass.privateMethod()`だと呼べないときを例に取ると

### 1. brackets記法

`hogeClass['privateMethod']()`と呼ぶ。

### 2. クラスをanyでキャストする

`;(hogeClass as any).privateMethod()`と呼ぶ。

前文との間に`;`を入れないとエラーを出すので注意。

## 例

```ts
// TypeScript v3.5.3

class HogeClass {

  private privateMethod (): void {
    console.log("private method")
  }

  public publicMethod ():void {
    console.log('public method')

    //呼べる
    this.privateMethod()
  }
}

const hogeClass = new HogeClass()

// 呼べる
hogeClass.publicMethod()

// 呼べない コンパイルエラー
// hogeClass.privateMethod()

// 呼べる
hogeClass['privateMethod']()

// 呼べる セミコロンが必要
;(hogeClass as any).publicMethod()
```

## 注意

TypeScriptの制限をすり抜けるということは、methodが存在するかどうか評価されないので、typoしたり存在しないmethodを呼ぶ危険性がある。

テストで使うのは仕方ないかもしれないけれど、基本はあまり使うべきではなさそう。

## 感想

anyでキャストして呼べるのはまだいいとして、brackets記法で呼べてしまうのは裏技感がすごい。
最近TypeScriptに入門したが、型があるのはありがたいといっても、意外と実行時にこのような抜けがあると感じてしまうことがあったり。

まぁjsやからな。

## 参考

- [Typescriptでprivateメソッドをテストする](qiita.com/hitochan777/items/f68e77f13becd24e2691)
