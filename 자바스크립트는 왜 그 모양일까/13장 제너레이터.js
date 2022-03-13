// * [자바스크립트는 왜 그 모양일까?] 13장: 제너레이터

// from 에서 to 까지 step 만큼 증가시키면서 정수 반환
function integer(from = 0, to = Number.MAX_SAFE_INTEGER, step = 1) {
  return function () {
    if (from < to) {
      const result = from;
      from += step;
      return result;
    }
  };
}

// 배열을 받아서 각 배열을 순회
function element(array, gen = integer(0, array.length)) {
  return function element_generator(...args) {
    const element_nr = gen(...args);
    if (element_nr !== undefined) {
      return array[element_nr];
    }
  };
}

// 객체의 key 값들을 배열로 받아 객체를 순회
function property(object, gen = element(Object.keys(object))) {
  return function property_generator(...args) {
    const key = gen(...args);
    if (key !== undefined) {
      return [key, object[key]];
    }
  };
}

// 제너레이터와 배열을 받아서 그 배열에 제너레이터의 반환 값들을 쭉 모은다.
function collect(generator, array) {
  return function collect_generator(...args) {
    const value = generator(...args);
    if (value !== undefined) {
      array.push(value);
    }
    return value;
  };
}

function repeat(generator) {
  if (generator() !== undefined) {
    return repeat(generator);
  }
}

// 팩토리 함수, 제너레이터 둘다 아니지만 제너레이터를 인자로 받아서 값들을 모아 반환하는 헬퍼(?) 함수
function harvest(generator) {
  const array = [];
  repeat(collect(generator, array));
  return array;
}

// 정해진 횟수 만큼만 함수 호출을 한다.
function limit(generator, count = 1) {
  return function (...args) {
    if (count >= 1) {
      count -= 1;
      return generator(...args);
    }
  };
}

// 술어함수인 predicate 가 참이 되는 경우에만 제너레이터의 값을 반환한다.
function filter(generator, predicate) {
  return function filter_generator(...args) {
    const value = generator(...args);
    if (value !== undefined && !predicate(value)) {
      return filter_generator(...args);
    }
    return value;
  };
}

// 2개 이상의 제너레이터를 받아서 순차적으로 undefined 를 반환할 때까지 실행하는 제너레이터
function concat(...generators) {
  const next = element(generators);
  let generator = next();

  return function concat_generator(...args) {
    if (generator !== undefined) {
      const value = generator(...args);
      if (value === undefined) {
        generator = next();
        return concat_generator(...args);
      }
      return value;
    }
  };
}

// 팩토리 함수와 1개 이상의 제너레이터를 받아서 제너레이터를 만든다.
// 새 제너레이터가 호출될 때마다 인자로 전달된 제너레이터를 호출하고 그 결과를 함수로 전달한다.
function join(func, ...gens) {
  return function join_generator() {
    return func(
      ...gens.map(function (gen) {
        return gen();
      })
    );
  };
}

// 배열의 map 메서드와 동일하게 동작하게끔 구현된 함수
function map(array, func) {
  return harvest(join(func, element(array)));
}

// 데이터 객체를 만드는 팩토리 함수.
// 키 값(names)을 먼저 받아 제너레이터 함수를 만든 다음,
// 그 제너레이터로 각 key 값과 매칭되는 value를 통해서 객체생성
function objectify(...names) {
  return function objectify_constructor(...values) {
    const object = Object.create(null);
    names.forEach(function (name, name_nr) {
      object[name] = values[name_nr];
    });
    return object;
  };
}
