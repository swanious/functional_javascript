# filter

- filter함수의 구조
  - filter()는 일정 조건에 맞을 경우에 해당 값을 반환하는 함수
  - 아래와 같은 예시로 사용됨

```javascript
const products = [
    {name: '반팔티', price: 15000},
    {name: '긴팔티', price: 20000},
    {name: '핸드폰케이스', price: 15000},
    {name: '후드티', price: 30000},
    {name: '바지', price: 25000}
];

let under2000 = []
for (const p of products) {
    if (p.price < 20000) under2000.push(p);
}
log(...under2000)

let over2000 = []
for (const p of products) {
    if (p.price >= 20000) over2000.push(p);
}
log(...over2000)
```



- 리팩토링

```javascript
// filter(조건을 지정할 함수, iterable객체)
const filter = (f, iter) => {
    let res = [];
    for (const a of iter) {
        if (f(a)) res.push(a);
    } 
    return res;
};
```

- 기존의 방식과 리팩토링 비교

```javascript
// 기존 방식
let under2000 = []
for (const p of products) {
    if (p.price < 20000) under2000.push(p);
}
log(...under2000)


// 리팩토링한 함수 사용
log(...filter(p => p.price < 20000, products));
```

동일하게 나오는 것을 볼 수 있다.

![image-20201226141157471](filter%EC%9D%98%20%EB%8B%A4%ED%98%95%EC%84%B1.assets/image-20201226141157471.png)

- 이외의 방식

```javascript
  // 이렇게 제너레이터함수로도 사용할 수 있다!
  log(...filter(n => n % 2, function *() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
  } ()))

// 1 3 5
```

