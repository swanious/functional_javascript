const log = console.log;

const curry = f =>
  (a, ..._) =>_.length ? f(a, ..._) : (..._) => f(a, ..._);
  
const isIterable = a => a && a[Symbol.iterator]();

const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a);

const reduceF = (acc, a, f) =>
  a instanceof Promise ?
    a.then(a => f(acc, a), e => e == nop ? acc : Promise.reject(e)) :
    f(acc, a);

// head를 뽑아주는 작업(reduce함수의 acc로 넘겨줄 값)
const head = iter => go1(take(1, iter), ([h]) => h);

const reduce = curry((f, acc, iter) => {
  if (!iter) return reduce(f, head(iter = acc[Symbol.iterator]()), iter);

  iter = iter[Symbol.iterator]();
  return go1(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      acc = reduceF(acc, cur.value, f);
      if (acc instanceof Promise) return acc.then(recur);
    }
    return acc;
  })
})

const go = (...args) => reduce((a, f) => f(a), args);

const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);


const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  // 재귀
  return function recur() {
    let cur;
    // 배열이 끝날때까지 돌기
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      // 만약 a가 Promise 객체면
      if (a instanceof Promise) {
        return a
          .then(a => res.push(a), res).length == l ? res : recur()
          .catch(e => e == nop ? recur() : Promise.reject(e));
      }
      // 아니면 a를 res에 push
      res.push(a);
      if (res.length == l) return res;
    }
    return res;
  }();
});

const takeAll = take(Infinity);

const L = {};

L.range = function *(l) {
  let i = -1;
  while (++i < l) yield i;
};

L.map = curry(function *(f, iter) {
  for (const a of iter) {
    yield go1(a, f);
  }
});

L.filter = curry(function *(f, iter) {
  for (const a of iter) {
    const b = go1(a, f);
    if (b instanceof Promise) yield b.then(b => b ? a : Promise.reject(nop));
    else if (b) yield a;
  }
})

L.entries = function *(obj) {
  for (const k in obj) yield [k, obj[k]];
};

L.flatten = function *(iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* a;
    else yield a;
  }
}

L.deepFlat = function * f(iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* f(a);
    else yield a;
  }
};

const nop = Symbol('nob');

const map = curry(pipe(L.map, takeAll));

const filter = curry(pipe(L.filter, takeAll));

const find = curry((f, iter) => go(
  iter,
  L.filter(f),
  take(1),
  // 배열을 값으로 반환하기 위해서 그런듯
  ([a]) => a))

const range = l => {
  let i = -1;
  let res = [];
  for (++i < l) {
    res.push(i);
  }
  return res;
}