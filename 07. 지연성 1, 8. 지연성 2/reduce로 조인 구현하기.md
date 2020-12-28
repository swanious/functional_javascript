### 이전의 함수로 queryStr 만들기

```javascript
const queryStr = obj => go(
  obj,
  map(([k, v]) => `${k}=${v}`),
  reduce((a, b) => `${a}&${b}`)
);

const queryStr = pipe(
  map(([k, v]) => `${k}=${v}`),
  reduce((a, b) => `${a}&${b}`)
)
log(queryStr({ limit: 10, offset: 10, type: 'notice' }))
// limit=10&offset=10&type=notice
```

### reduce로 join함수 구현해서 추상화하기

- reduce로 만든 join함수의 경우에는 기존의 `Array.prototype.join()`이 오직 배열만 받는 것과 다르게, 배열이 아닌 것도 사용할 수 있다. 
- 이유는, 받는 배열을 reduce로 축약하기 때문이다.

```javascript
const join = curry((sep, iter) =>
	reduce((a, b) => `${a}${sep}${b}`, iter)
);

const queryStr = pipe(
  map(([k, v]) => `${k}=${v}`),
  join('&')
)
log(queryStr({ limit: 10, offset: 10, type: 'notice' }))
```



### 기존의 메서드 `join()`과의 비교

```javascript
function *a() {
    yield 10;
    yield 11;
    yield 12;
    yield 13;
    yield 14;
}
// 기존의 join
a().join(',')

// reduce로 만든 join
log(join('-', a()))
```

- 기존의 메서드

![image-20201228155930713](reduce%EB%A1%9C%20%EC%A1%B0%EC%9D%B8%20%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0.assets/image-20201228155930713.png)

- 만든 메서드

![image-20201228155949561](reduce%EB%A1%9C%20%EC%A1%B0%EC%9D%B8%20%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0.assets/image-20201228155949561.png)

조합성이 훨씬 높다는 것을 알 수 있다.

