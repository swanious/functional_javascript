### 이터러블 프로토콜을 따른 map의 다형성

아래와 같은 데이터가 있다. 새로 map함수를 만들어 놀아보자.

```javascript
const products = [
    {name: '반팔티', price: 15000},
    {name: '긴팔티', price: 20000},
    {name: '핸드폰케이스', price: 15000},
    {name: '후드티', price: 30000},
    {name: '바지', price: 25000}
];
```

iterable 프로토콜을 따르기 위해 `for ... of `문을 사용해서 map함수를 만들었다.

```javascript
const map = (f, iter) => {
    let res = [];
    for (const a of iter) {
        res.push(f(a));
    }
    return res;
};

// 실행
log(map(p => p.name, products));
log(map(p => p.price, products));
```

실행결과 아주 잘나온다!

![image-20201225185430949](%EC%9D%B4%ED%84%B0%EB%9F%AC%EB%B8%94%20%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C%EC%9D%84%20%EB%94%B0%EB%A5%B8%20map%EC%9D%98%20%EB%8B%A4%ED%98%95%EC%84%B1.assets/image-20201225185430949.png)



그럼, map함수가 구현되어있지 않은 webAPI(`document.querySelector`)에 map을 적용시켜볼 수 있을까?

원래 `map()`을 사용해보면 아래와 같이 `TypeError`가 난다. 그 이유는?



```javascript
log([1,2,3].map(a => a + 1)) // (3)[2,3,4]

// 브라우저에서 사용되는 webAPI는 array를 상속받은 객체가 아니므로, map함수가 구현이 안되어 있음
log(document.querySelectorAll('*').map(el=> el.nodeNames))) // TypeError
```

그럼 함수가 구현돼있는지 아닌지 알아보기 위해서는?
`__proto__`를 열어 확인해보자.



우선, `log([1,2,3].map(a => a + 1))` 부터보면 아래 map함수를 사용할 수 있다.

![image-20201225185001803](%EC%9D%B4%ED%84%B0%EB%9F%AC%EB%B8%94%20%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C%EC%9D%84%20%EB%94%B0%EB%A5%B8%20map%EC%9D%98%20%EB%8B%A4%ED%98%95%EC%84%B1.assets/image-20201225185001803.png)

다음, `log(document.querySelectorAll('*'))` 확인해보면, 구현되어있지 않다 !

![image-20201225185119359](%EC%9D%B4%ED%84%B0%EB%9F%AC%EB%B8%94%20%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C%EC%9D%84%20%EB%94%B0%EB%A5%B8%20map%EC%9D%98%20%EB%8B%A4%ED%98%95%EC%84%B1.assets/image-20201225185119359.png)

그럼, 내장 map함수말고 우리가 만든 map을 사용해보자.

```javascript
  log(map(el => el.nodeName, document.querySelectorAll('*')));
  
  const it = document.querySelectorAll('*')[Symbol.iterator]();
  log(it.next());
  log(it.next());
  log(it.next());
  log(it.next());
  log(it.next());
```

놀랍게도 `next()`로 순회할 수 있는 iterable 객체로 바꼈다. `next()`로 순회하면 잘 된다.

![image-20201225190346629](%EC%9D%B4%ED%84%B0%EB%9F%AC%EB%B8%94%20%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C%EC%9D%84%20%EB%94%B0%EB%A5%B8%20map%EC%9D%98%20%EB%8B%A4%ED%98%95%EC%84%B1.assets/image-20201225190346629.png)

이제 generator 함수 또한 map으로 반환해보자.

```javascript
  function *gen() {
    yield 2;
    yield 3;
    yield 4;
  }

  log(map(a => a * a, gen()));
```

아주 잘된다.

![image-20201225191129917](%EC%9D%B4%ED%84%B0%EB%9F%AC%EB%B8%94%20%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C%EC%9D%84%20%EB%94%B0%EB%A5%B8%20map%EC%9D%98%20%EB%8B%A4%ED%98%95%EC%84%B1.assets/image-20201225191129917.png)

마지막으로, key, value 쌍으로 이루어진 `Map`객체를 생성하여 map()을 통해 가공해보자

1. `m = new Map()`으로 Map객체 생성
2. 객체에 값 담기
3. map()을 통해 val을 변형하여 출력해보자 

```javascript
let m = new Map();
m.set('a', 10);
m.set('b', 20);
log(new Map(map(([key, val])=> [key, val * 2], m)));
console.log(m)
```

good...!

![image-20201225192111162](%EC%9D%B4%ED%84%B0%EB%9F%AC%EB%B8%94%20%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C%EC%9D%84%20%EB%94%B0%EB%A5%B8%20map%EC%9D%98%20%EB%8B%A4%ED%98%95%EC%84%B1.assets/image-20201225192111162.png)

### 결론

- 위 처럼 만든 map함수는 다형성이 굉장히 높기 때문에, 모든 것을 map을 통해 반환할 수 있다

- iterable 프로토콜을 따르는 함수를 사용하는 것은 많은 헬퍼함수와의 조합성이 높아지는 것을 의미한다.

- 브라우저에서 제공하는 webAPI도 iterable프로토콜을 많이 따르고 있기 때문에 위와 같이 map을 통해 값을 반환할 수 있었다.