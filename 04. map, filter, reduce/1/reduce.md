# reduce 리팩토링

- reduce 함수의 기본구조

```javascript
const nums = [1, 2, 3, 4, 5]

// 구조
let total = 0;
for (const n of nums) {
    total += n;
}
log(total);

// 실행 과정
add(add(add(add(add(0, 1), 2), 3), 4), 5)) // 15
```



- reduce 함수 리팩토링

```javascript
const reduce = (f, acc, iter) => {
    for (const a of iter) {
    	acc = f(acc + a)    
    }
    return acc
}
```

하지만, acc를 생략할 수 있다. 그럴 경우 iter의 첫번째 인자를 함수 내부적으로 자동으로 acc로 반환해주는 과정을 진행한다.

```javascript
const reduce = (f, acc, iter) {
    if (!iter) {
        iter = acc[Symbol.iterator]();
        acc = iter.next().value();
    }
    for (const a of iter) {
        acc = f(acc + a)
    }
    return acc
}
const add = (a, b) => a + b;
log(reduce(add, 0, [1, 2, 3, 4, 5])) // 15
```

```javascript
const products = [
    {name: '반팔티', price: 15000},
    {name: '긴팔티', price: 20000},
    {name: '핸드폰케이스', price: 15000},
    {name: '후드티', price: 30000},
    {name: '바지', price: 25000}
];

log(
    reduce(
        (total_price, product) => total_price + product.price),
        0, 
        products)
	);
```

