### 이터레이터를 전개 연산자로 분리하는 이유?

```javascript
C.reduce = curry((f, acc, iter) => iter ? 
  reduce(f, acc, [...iter]) :
  reduce(f, [...acc]));
```

![image-20210109161346203](C:%5CUsers%5C%EC%98%A4%EC%88%98%EC%99%84%5CDesktop%5CGit%5Cfunctional_javascript%5C10.%20%EB%B9%84%EB%8F%99%EA%B8%B0%20%EB%8F%99%EC%8B%9C%EC%84%B1%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%202%5CC.reduce,%20C.take.assets%5Cimage-20210109161346203.png)

![image-20210109161313147](C:%5CUsers%5C%EC%98%A4%EC%88%98%EC%99%84%5CDesktop%5CGit%5Cfunctional_javascript%5C10.%20%EB%B9%84%EB%8F%99%EA%B8%B0%20%EB%8F%99%EC%8B%9C%EC%84%B1%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%202%5CC.reduce,%20C.take.assets%5Cimage-20210109161313147.png)