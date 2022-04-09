function continuize(any) {
  return function hero(continuation, ...args) {
    return continuation(any(...args)); // 꼬리 호출
  };
}

// 기존 팩토리얼 함수
function factorial(n) {
  if (n < 2) {
    return 1;
  }
  return n * factorial(n - 1);
}

// 꼬리호출 팩토리얼 함수
function factorial(n, result = 1) {
  if (n < 2) {
    return result;
  }

  return factorial(n - 1, n * result);
}
