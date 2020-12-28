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

그럼 generator함수를 이용하여 지연성, 효율성을 높여보자.

```javascript
const queryStr = pipe(
  Object.entries,
  map(([k,v]) => `${k}=${v}`),
  function (a) {
    console.log(a) return a  
  },
  reduce((a, b) => `${a}&${b}`)
)
log(queryStr({ limit: 10, offset: 10, type: 'notice' }))
```

![image-20201228161004248](reduce%EB%A1%9C%20%EC%A1%B0%EC%9D%B8%20%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0.assets/image-20201228161004248.png)

위 처럼 map함수는 L.map과 비교하면 함수의 동작을 통해 미리 값을 배열에 평가한 상태이다.

평가한 상태의 값이 Object로 들어가 있다면, 연산이 많아질수록 속도가 늘어남을 미리 살펴봤다.

그럼 이것을 `L.map`으로 바꿔서 필요할때만 값을 평가하는 방식으로 변환하면 연산 속도가 현저히 줄어들 것이다.

```javascript
const queryStr = pipe(
  ...
    
  L.map(([k,v]) => `${k}=${v}`),
    
  ...
)
log(queryStr({ limit: 10, offset: 10, type: 'notice' }))
```

![image-20201228161203681](reduce%EB%A1%9C%20%EC%A1%B0%EC%9D%B8%20%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0.assets/image-20201228161203681.png)

### Object.entries를 느슨하게 바꿔보기

Object.entries의 경우 `key:value` 쌍으로 이루어진 객체를 배열로 감싸준다. 예시를 보자.

```javascript
const queryStr = pipe(
    Object.entries,
    function(a) {
        console.log(a)
        return a
    },
    L.map(([k, v]) => `${k}=${v}`),
    reduce((a, b) => `${a}&${b}`)
);
log(queryStr({ limit: 10, offset: 10, type: 'notice' }))
```

![image-20201228161628820](reduce%EB%A1%9C%20%EC%A1%B0%EC%9D%B8%20%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0.assets/image-20201228161628820.png)

이처럼, Object.entries의 경우에도 이미 배열에 모든 값이 담긴 상태이다.

이를  지연성을 부여해서 필요할 때마다 값을 뽑아내도록 바꿔보자.

```javascript
L.entries = function *(obj) {
    for (const k in obj) yield [k, obj[k]]
}

var it =  L.entries({ limit: 10, offset: 10, type: 'notice' })
it.next();
it.next();
it.next();
```

![image-20201228162104122](reduce%EB%A1%9C%20%EC%A1%B0%EC%9D%B8%20%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0.assets/image-20201228162104122.png)

위 처럼, 순회할 때만 값을 뽑아낼 수 있다.

### 전체 코드

```javascript
L.map = curry(function *(f, iter) {
    iter = iter[Symbol.iterator]();
    let cur;
    while (!(cur = iter.next()).done) {
        const a = cur.value;
        yield f(a);
    }
});

L.entries = function *(obj) {
    for (const k in obj) yield [k, obj[k]];
}

const queryStr = pipe(
    // 지연성 평가
    L.entries,
    L.map(([k, v]) => `${k}=${v}`),
    reduce((a, b) => `${a}&${b}`)
);
log(queryStr({ limit: 10, offset: 10, type: 'notice' }))
```

