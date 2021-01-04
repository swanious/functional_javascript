### range()

- 배열을 생성

```javascript
const add = (a, b) => a + b;

const range = l => {
    let i = -1;
    let res = [];
    while (++i < l) {
        res.push(i)
    }
    return res;
};

var list = range(5);
log(reduce(add, list));
```



### L.range()

- next를 통해 값을 가져올 수 있는 제너레이터를 통해 생성

```javascript
const L = {};
L.range = function *(l) {
    let i = -1;
    while (++i < l) {
        yield i;
    }
}

var list = L.range(5);
log(list)
log(reduce(add, list))
```



### 둘의 차이는?

먼저 list를 출력해보자.

- range(5)

```javascript
// (5)[0, 1, 2, 3, 4]
```

- L.range(5)

```javascript
// L.range {<suspended>}
```

range같은 경우에는 배열에 담아 줬기 때문에 문제없이 배열에 담겨서 결과 값이 반환된다.

하지만, L.range의 경우 값을 반환하지 않고 이상한 것을 반환한다.

- 내부적으로 어떻게 돌아가는지 알아보자

```javascript
const add = (a, b) => a + b;

// range()
const range = l => {
    let i = -1;
    let res = [];
    while (++i < l) {
        log(i, 'range') // 이 부분을 통해 log를 찍어보자 !
        res.push(i)
    }
    return res;
};

var list = range(5);
log(list)

// L.range()
const L = {};
L.range = function *(l) {
    let i = -1;
    while (++i < l) {
        log(i, 'L.range') // 이 부분 !!
        yield i;
    }
}

var list = L.range(5);
log(list)
```

- 결과
  - range()의 경우 배열을 돌면서 log가 찍혔지만, L.range()는 아예 찍히지 않았다.

![image-20201227191444510](range()%EC%99%80%20%EB%8A%90%EA%B8%8B%ED%95%9C%20L.range().assets/image-20201227191444510.png)

### 이유는?

`range()`는 사용자가 그 배열을 통해서 값을 구하든, 그렇지 않든 상관없이 이미 list에 대한 평가를 진행하며, 값이 담긴 상태이다.(평가가 된 상태) 

 `L.range()`의 경우 iterator의 안쪽에서 iterator의 내부를 순회할 때마다 동작하는 방식이다.

즉,  `log(list.next().value);`처럼 사용자가 값을 직접 순회할 경우에만 함수가 실행된다.

예를 들어, 다음과 같은 배열이 있을 때,

```javascript
var a = [1, 2, 3, 4, 5]
```

a라는 배열은 지금 필요한 상태일까?

이 말은, a라는 배열을 통해 **사용자가 원하는 값을 뽑아낼 때** 비로소 배열이 의미가 있어진다는 의미이다.  `L.range()`의 경우 미리 배열을 만들지 않는 이유도 이때문이다. 사용자가 배열을 순회할 그 시점에 해당 값을 평가하여 반환하기 때문에 효율적이다.



### 어떻게 사용할까?

L.range가 range보다 효율성이 높다는 것은 알았다. 근데 어떻게 활용할 수 있을까?

활용 방법은 다양할 수 있지만, 무한 수열을 만들어 사용하는 것이 가능하다. 이후 take함수와 같이 활용해보자 