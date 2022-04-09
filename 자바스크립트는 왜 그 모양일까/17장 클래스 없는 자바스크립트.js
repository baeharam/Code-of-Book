// 함수 컴포지션
function my_little_constructor(spec) {
  let { member } = spec;
  const reuse = other_constructor(spec);
  const method = function () {
    // 이 method 는 spec, member, reuse, method를 사용할 수 있음
  };
  return Object.freeze({
    method,
    goodness: reuse.goodness,
  });
}
