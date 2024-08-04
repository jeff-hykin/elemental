// https://deno.land/x/good@1.6.1.3/value.js
var typedArrayClasses = [
  Uint16Array,
  Uint32Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Int32Array,
  Int8Array,
  Float32Array,
  Float64Array,
  globalThis.BigInt64Array,
  globalThis.BigUint64Array
].filter((each) => each);
var copyableClasses = /* @__PURE__ */ new Set([RegExp, Date, URL, ...typedArrayClasses, globalThis.ArrayBuffer, globalThis.DataView]);
var IteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));
var ArrayIterator = Object.getPrototypeOf([][Symbol.iterator]);
var MapIterator = Object.getPrototypeOf((/* @__PURE__ */ new Map())[Symbol.iterator]);
var SetIterator = Object.getPrototypeOf((/* @__PURE__ */ new Set())[Symbol.iterator]);
var AsyncFunction = class {
};
var GeneratorFunction = class {
};
var AsyncGeneratorFunction = class {
};
var SyncGenerator = class {
};
var AsyncGenerator = class {
};
try {
  AsyncFunction = eval("(async function(){}).constructor");
  GeneratorFunction = eval("(function*(){}).constructor");
  AsyncGeneratorFunction = eval("(async function*(){}).constructor");
  SyncGenerator = eval("((function*(){})()).constructor");
  AsyncGenerator = eval("((async function*(){})()).constructor");
} catch (error) {
}
var isPrimitive = (value) => !(value instanceof Object);
var isPureObject = (value) => value instanceof Object && Object.getPrototypeOf(value).constructor == Object;
var isPracticallyPrimitive = (value) => isPrimitive(value) || value instanceof Date || value instanceof RegExp || value instanceof URL;
var isBuiltInIterator = (value) => IteratorPrototype.isPrototypeOf(value);
var isGeneratorType = (value) => {
  if (value instanceof Object) {
    if (isBuiltInIterator(value)) {
      return true;
    }
    const constructor = value.constructor;
    return constructor == SyncGenerator || constructor == AsyncGenerator;
  }
  return false;
};
var isAsyncIterable = function(value) {
  return value && typeof value[Symbol.asyncIterator] === "function";
};
var isSyncIterable = function(value) {
  return value && typeof value[Symbol.iterator] === "function";
};
var isIterableObjectOrContainer = function(value) {
  return value instanceof Object && (typeof value[Symbol.iterator] == "function" || typeof value[Symbol.asyncIterator] === "function");
};
var isTechnicallyIterable = function(value) {
  return value instanceof Object || typeof value == "string";
};
var isSyncIterableObjectOrContainer = function(value) {
  return value instanceof Object && typeof value[Symbol.iterator] == "function";
};
var deepCopySymbol = Symbol.for("deepCopy");
var clonedFromSymbol = Symbol();
var getThis = Symbol();
Object.getPrototypeOf(function() {
})[getThis] = function() {
  return this;
};
function deepCopyInner(value, valueChain = [], originalToCopyMap = /* @__PURE__ */ new Map()) {
  valueChain.push(value);
  if (value == null) {
    return value;
  }
  if (!(value instanceof Object)) {
    return value;
  }
  if (originalToCopyMap.has(value)) {
    return originalToCopyMap.get(value);
  }
  if (value[deepCopySymbol] instanceof Function) {
    const clonedValue = value[deepCopySymbol](originalToCopyMap);
    originalToCopyMap.set(value, clonedValue);
    return clonedValue;
  }
  if (isGeneratorType(value)) {
    throw Error(`Sadly built-in generators cannot be deep copied.
And I found a generator along this path:
${valueChain.reverse().map((each) => `${each},
`)}`);
  }
  let object, theThis, thisCopy;
  if (value instanceof Date) {
    object = new Date(value.getTime());
  } else if (value instanceof RegExp) {
    object = new RegExp(value);
  } else if (value instanceof URL) {
    object = new URL(value);
  } else if (value instanceof Function) {
    theThis = value[getThis]();
    object = value.bind(theThis);
  } else if (copyableClasses.has(value.constructor)) {
    object = new value.constructor(value);
  } else if (value instanceof Array) {
    object = [];
  } else if (value instanceof Set) {
    object = /* @__PURE__ */ new Set();
  } else if (value instanceof Map) {
    object = /* @__PURE__ */ new Map();
  }
  originalToCopyMap.set(value, object);
  if (object instanceof Function) {
    thisCopy = deepCopyInner(theThis, valueChain, originalToCopyMap);
    object = object.bind(thisCopy);
  }
  const output = object;
  try {
    output.constructor = value.constructor;
  } catch (error) {
  }
  Object.setPrototypeOf(output, Object.getPrototypeOf(value));
  const propertyDefinitions = {};
  for (const [key2, description] of Object.entries(Object.getOwnPropertyDescriptors(value))) {
    const { value: value2, get, set, ...options } = description;
    const getIsFunc = get instanceof Function;
    const setIsFunc = set instanceof Function;
    if (getIsFunc || setIsFunc) {
      propertyDefinitions[key2] = {
        ...options,
        get: get ? function(...args) {
          return get.apply(output, args);
        } : void 0,
        set: set ? function(...args) {
          return set.apply(output, args);
        } : void 0
      };
    } else {
      if (key2 == "length" && output instanceof Array) {
        continue;
      }
      propertyDefinitions[key2] = {
        ...options,
        value: deepCopyInner(value2, valueChain, originalToCopyMap)
      };
    }
  }
  Object.defineProperties(output, propertyDefinitions);
  return output;
}
var deepCopy = (value) => deepCopyInner(value);
var shallowSortObject = (obj) => {
  return Object.keys(obj).sort().reduce(
    (newObj, key2) => {
      newObj[key2] = obj[key2];
      return newObj;
    },
    {}
  );
};
var deepSortObject = (obj, seen = /* @__PURE__ */ new Map()) => {
  if (!(obj instanceof Object)) {
    return obj;
  } else if (seen.has(obj)) {
    return seen.get(obj);
  } else {
    if (obj instanceof Array) {
      const sortedChildren = [];
      seen.set(obj, sortedChildren);
      for (const each of obj) {
        sortedChildren.push(deepSortObject(each, seen));
      }
      return sortedChildren;
    } else {
      const sorted = {};
      seen.set(obj, sorted);
      for (const eachKey of Object.keys(obj).sort()) {
        sorted[eachKey] = deepSortObject(obj[eachKey], seen);
      }
      return sorted;
    }
  }
};
var stableStringify = (value, ...args) => {
  return JSON.stringify(deepSortObject(value), ...args);
};
var allKeys = function(obj) {
  let keys = [];
  if (obj == null) {
    return [];
  }
  if (!(obj instanceof Object)) {
    obj = Object.getPrototypeOf(obj);
  }
  while (obj) {
    keys = keys.concat(Reflect.ownKeys(obj));
    obj = Object.getPrototypeOf(obj);
  }
  return keys;
};
var ownKeyDescriptions = Object.getOwnPropertyDescriptors;
var allKeyDescriptions = function(value, options = { includingBuiltin: false }) {
  var { includingBuiltin } = { ...options };
  let descriptions = [];
  if (value == null) {
    return {};
  }
  if (!(value instanceof Object)) {
    value = Object.getPrototypeOf(value);
  }
  const rootPrototype = Object.getPrototypeOf({});
  let prevObj;
  while (value && value != prevObj) {
    if (!includingBuiltin && value == rootPrototype) {
      break;
    }
    descriptions = descriptions.concat(Object.entries(Object.getOwnPropertyDescriptors(value)));
    prevObj = value;
    value = Object.getPrototypeOf(value);
  }
  descriptions.reverse();
  return Object.fromEntries(descriptions);
};

// https://deno.land/x/good@1.6.1.3/async.js
var objectPrototype = Object.getPrototypeOf({});

// https://deno.land/x/good@1.6.1.3/iterable.js
var emptyIterator = /* @__PURE__ */ function* () {
}();
var makeIterable = (object) => {
  if (object == null) {
    return emptyIterator;
  }
  if (object[Symbol.iterator] instanceof Function || object[Symbol.asyncIterator] instanceof Function) {
    return object;
  }
  if (Object.getPrototypeOf(object).constructor == Object) {
    return Object.entries(object);
  }
  return emptyIterator;
};
var Stop = Symbol("iterationStop");
var iter = (object) => {
  const iterable = makeIterable(object);
  if (iterable[Symbol.asyncIterator]) {
    return iterable[Symbol.asyncIterator]();
  } else {
    return iterable[Symbol.iterator]();
  }
};
async function asyncIteratorToList(asyncIterator) {
  const results = [];
  for await (const each of asyncIterator) {
    results.push(each);
  }
  return results;
}
var zip = function* (...iterables) {
  iterables = iterables.map((each) => iter(each));
  while (true) {
    const nexts = iterables.map((each) => each.next());
    if (nexts.every((each) => each.done)) {
      break;
    }
    yield nexts.map((each) => each.value);
  }
};
var ERROR_WHILE_MAPPING_MESSAGE = "Threw while mapping.";
function concurrentlyTransform({ iterator, transformFunction, poolLimit = null, awaitAll = false }) {
  poolLimit = poolLimit || concurrentlyTransform.defaultPoolLimit;
  const res = new TransformStream({
    async transform(p, controller) {
      try {
        const s = await p;
        controller.enqueue(s);
      } catch (e) {
        if (e instanceof AggregateError && e.message == ERROR_WHILE_MAPPING_MESSAGE) {
          controller.error(e);
        }
      }
    }
  });
  const mainPromise = (async () => {
    const writer = res.writable.getWriter();
    const executing = [];
    try {
      let index = 0;
      for await (const item of iterator) {
        const p = Promise.resolve().then(() => transformFunction(item, index));
        index++;
        writer.write(p);
        const e = p.then(() => executing.splice(executing.indexOf(e), 1));
        executing.push(e);
        if (executing.length >= poolLimit) {
          await Promise.race(executing);
        }
      }
      await Promise.all(executing);
      writer.close();
    } catch {
      const errors = [];
      for (const result of await Promise.allSettled(executing)) {
        if (result.status == "rejected") {
          errors.push(result.reason);
        }
      }
      writer.write(Promise.reject(
        new AggregateError(errors, ERROR_WHILE_MAPPING_MESSAGE)
      )).catch(() => {
      });
    }
  })();
  const asyncIterator = res.readable[Symbol.asyncIterator]();
  if (!awaitAll) {
    return asyncIterator;
  } else {
    return mainPromise.then(() => asyncIteratorToList(asyncIterator));
  }
}
concurrentlyTransform.defaultPoolLimit = 40;

// https://deno.land/x/good@1.6.1.3/string.js
var indent = ({ string, by = "    ", noLead = false }) => (noLead ? "" : by) + string.replace(/\n/g, "\n" + by);
var toString = (value) => {
  if (typeof value == "symbol") {
    return toRepresentation(value);
  } else if (!(value instanceof Object)) {
    return value != null ? value.toString() : `${value}`;
  } else {
    return toRepresentation(value);
  }
};
var reprSymbol = Symbol.for("representation");
var denoInspectSymbol = Symbol.for("Deno.customInspect");
var toRepresentation = (item) => {
  const alreadySeen = /* @__PURE__ */ new Set();
  const recursionWrapper = (item2) => {
    if (item2 instanceof Object) {
      if (alreadySeen.has(item2)) {
        return `[Self Reference]`;
      } else {
        alreadySeen.add(item2);
      }
    }
    let output;
    if (item2 === void 0) {
      output = "undefined";
    } else if (item2 === null) {
      output = "null";
    } else if (typeof item2 == "string") {
      output = JSON.stringify(item2);
    } else if (typeof item2 == "symbol") {
      if (!item2.description) {
        output = "Symbol()";
      } else {
        const globalVersion = Symbol.for(item2.description);
        if (globalVersion == item2) {
          output = `Symbol.for(${JSON.stringify(item2.description)})`;
        } else {
          output = `Symbol(${JSON.stringify(item2.description)})`;
        }
      }
    } else if (item2 instanceof Date) {
      output = `new Date(${item2.getTime()})`;
    } else if (item2 instanceof Array) {
      output = `[${item2.map((each) => recursionWrapper(each)).join(",")}]`;
    } else if (item2 instanceof Set) {
      output = `new Set(${[...item2].map((each) => recursionWrapper(each)).join(",")})`;
    } else if (item2 instanceof Object && item2.constructor == Object) {
      output = pureObjectRepr(item2);
    } else if (item2 instanceof Map) {
      let string = "new Map(";
      for (const [key2, value] of item2.entries()) {
        const stringKey = recursionWrapper(key2);
        const stringValue = recursionWrapper(value);
        if (!stringKey.match(/\n/g)) {
          string += `
  [${stringKey}, ${indent({ string: stringValue, by: "  ", noLead: true })}],`;
        } else {
          string += `
  [${indent({ string: stringKey, by: "  ", noLead: true })},
  ${indent({ string: stringValue, by: "    ", noLead: true })}],`;
        }
      }
      string += "\n)";
      output = string;
    } else {
      if (item2[reprSymbol] instanceof Function) {
        try {
          output = item2[reprSymbol]();
          return output;
        } catch (error) {
        }
      }
      if (item2[denoInspectSymbol] instanceof Function) {
        try {
          output = item2[denoInspectSymbol]();
          return output;
        } catch (error) {
        }
      }
      try {
        output = item2.toString();
        if (output !== "[object Object]") {
          return output;
        }
      } catch (error) {
      }
      try {
        if (item2.constructor instanceof Function && item2.prototype && typeof item2.name == "string") {
          output = `class ${item2.name} { /*...*/ }`;
          return output;
        }
      } catch (error) {
      }
      try {
        if (item2.constructor instanceof Function && typeof item2.constructor.name == "string") {
          output = `new ${item2.constructor.name}(${pureObjectRepr(item2)})`;
          return output;
        }
      } catch (error) {
      }
      return pureObjectRepr(item2);
    }
    return output;
  };
  const pureObjectRepr = (item2) => {
    let string = "{";
    for (const [key2, value] of Object.entries(item2)) {
      const stringKey = recursionWrapper(key2);
      const stringValue = recursionWrapper(value);
      string += `
  ${stringKey}: ${indent({ string: stringValue, by: "  ", noLead: true })},`;
    }
    string += "\n}";
    return string;
  };
  return recursionWrapper(item);
};
var reservedCharMap = {
  "&": "\\x26",
  "!": "\\x21",
  "#": "\\x23",
  "$": "\\$",
  "%": "\\x25",
  "*": "\\*",
  "+": "\\+",
  ",": "\\x2c",
  ".": "\\.",
  ":": "\\x3a",
  ";": "\\x3b",
  "<": "\\x3c",
  "=": "\\x3d",
  ">": "\\x3e",
  "?": "\\?",
  "@": "\\x40",
  "^": "\\^",
  "`": "\\x60",
  "~": "\\x7e",
  "(": "\\(",
  ")": "\\)",
  "[": "\\[",
  "]": "\\]",
  "{": "\\{",
  "}": "\\}",
  "/": "\\/",
  "-": "\\x2d",
  "\\": "\\\\",
  "|": "\\|"
};
var RX_REGEXP_ESCAPE = new RegExp(
  `[${Object.values(reservedCharMap).join("")}]`,
  "gu"
);
function escapeRegexMatch(str) {
  return str.replaceAll(
    RX_REGEXP_ESCAPE,
    (m) => reservedCharMap[m]
  );
}
var regexpProxy = Symbol("regexpProxy");
var realExec = RegExp.prototype.exec;
RegExp.prototype.exec = function(...args) {
  if (this[regexpProxy]) {
    return realExec.apply(this[regexpProxy], args);
  }
  return realExec.apply(this, args);
};
var proxyRegExp;
var regexProxyOptions = Object.freeze({
  get(original, key2) {
    if (typeof key2 == "string" && key2.match(/^[igmusyv]+$/)) {
      return proxyRegExp(original, key2);
    }
    if (key2 == regexpProxy) {
      return original;
    }
    return original[key2];
  },
  set(original, key2, value) {
    original[key2] = value;
    return true;
  }
});
proxyRegExp = (parent, flags) => {
  const regex2 = new RegExp(parent, flags);
  const output = new Proxy(regex2, regexProxyOptions);
  Object.setPrototypeOf(output, Object.getPrototypeOf(regex2));
  return output;
};
function regexWithStripWarning(shouldStrip) {
  return (strings, ...values) => {
    let newRegexString = "";
    for (const [string, value] of zip(strings, values)) {
      newRegexString += string;
      if (value instanceof RegExp) {
        if (!shouldStrip && value.flags.replace(/g/, "").length > 0) {
          console.warn(`Warning: flags inside of regex:
    The RegExp trigging this warning is: ${value}
    When calling the regex interpolater (e.g. regex\`something\${stuff}\`)
    one of the \${} values (the one above) was a RegExp with a flag enabled
    e.g. /stuff/i  <- i = ignoreCase flag enabled
    When the /stuff/i gets interpolated, its going to loose its flags
    (thats what I'm warning you about)
    
    To disable/ignore this warning do:
        regex.stripFlags\`something\${/stuff/i}\`
    If you want to add flags to the output of regex\`something\${stuff}\` do:
        regex\`something\${stuff}\`.i   // ignoreCase
        regex\`something\${stuff}\`.ig  // ignoreCase and global
        regex\`something\${stuff}\`.gi  // functionally equivlent
`);
        }
        newRegexString += `(?:${value.source})`;
      } else if (value != null) {
        newRegexString += escapeRegexMatch(toString(value));
      }
    }
    return proxyRegExp(newRegexString, "");
  };
}
var regex = regexWithStripWarning(false);
regex.stripFlags = regexWithStripWarning(true);
var textDecoder = new TextDecoder("utf-8");
var textEncoder = new TextEncoder("utf-8");
var utf8BytesToString = textDecoder.decode.bind(textDecoder);
var stringToUtf8Bytes = textEncoder.encode.bind(textEncoder);

// https://deno.land/x/good@0.7.8/value.js
var primitiveArrayClasses = [Uint16Array, Uint32Array, Uint8Array, Uint8ClampedArray, Int16Array, Int32Array, Int8Array, Float32Array, Float64Array, globalThis.BigInt64Array, globalThis.BigUint64Array].filter((each) => each);
var allKeys2 = function(obj) {
  let keys = [];
  if (obj == null) {
    return [];
  }
  if (!(obj instanceof Object)) {
    obj = Object.getPrototypeOf(obj);
  }
  while (obj) {
    keys = keys.concat(Reflect.ownKeys(obj));
    obj = Object.getPrototypeOf(obj);
  }
  return keys;
};
var ownKeyDescriptions2 = Object.getOwnPropertyDescriptors;
var allKeyDescriptions2 = function(value, options = { includingBuiltin: false }) {
  var { includingBuiltin } = { ...options };
  let descriptions = [];
  if (value == null) {
    return {};
  }
  if (!(value instanceof Object)) {
    value = Object.getPrototypeOf(value);
  }
  const rootPrototype = Object.getPrototypeOf({});
  let prevObj;
  while (value && value != prevObj) {
    if (!includingBuiltin && value == rootPrototype) {
      break;
    }
    descriptions = descriptions.concat(Object.entries(Object.getOwnPropertyDescriptors(value)));
    prevObj = value;
    value = Object.getPrototypeOf(value);
  }
  descriptions.reverse();
  return Object.fromEntries(descriptions);
};
var MapIterator2 = Object.getPrototypeOf((/* @__PURE__ */ new Map()).keys());
var SetIterator2 = Object.getPrototypeOf((/* @__PURE__ */ new Set()).keys());
var GeneratorFunction2 = class {
};
var AsyncGeneratorFunction2 = class {
};
try {
  GeneratorFunction2 = eval("((function*(){})()).constructor");
  AsyncGeneratorFunction2 = eval("((async function*(){})()).constructor");
} catch (error) {
}
var isGeneratorType2 = (value) => {
  if (value instanceof Object) {
    const prototype = Object.getPrototypeOf(value);
    if (prototype == MapIterator2 || prototype == SetIterator2) {
      return true;
    }
    const constructor = value.constructor;
    return constructor == GeneratorFunction2 || constructor == AsyncGeneratorFunction2;
  }
  return false;
};
var deepCopySymbol2 = Symbol.for("deepCopy");
var clonedFromSymbol2 = Symbol();
var getThis2 = Symbol();
Object.getPrototypeOf(function() {
})[getThis2] = function() {
  return this;
};
function deepCopyInner2(value, valueChain = [], originalToCopyMap = /* @__PURE__ */ new Map()) {
  valueChain.push(value);
  if (value == null) {
    return value;
  }
  if (!(value instanceof Object)) {
    return value;
  }
  if (originalToCopyMap.has(value)) {
    return originalToCopyMap.get(value);
  }
  if (value[deepCopySymbol2] instanceof Function) {
    const clonedValue = value[deepCopySymbol2]();
    originalToCopyMap.set(value, clonedValue);
    return clonedValue;
  }
  if (isGeneratorType2(value)) {
    throw Error(`Sadly built-in generators cannot be deep copied.
And I found a generator along this path:
${valueChain.reverse().map((each) => `${each},
`)}`);
  }
  let object, theThis, thisCopy;
  if (value instanceof Date) {
    object = new Date(value.getTime());
  } else if (value instanceof RegExp) {
    object = new RegExp(value);
  } else if (value instanceof Function) {
    theThis = value[getThis2]();
    object = function(...args) {
      return value.apply(thisCopy, args);
    };
  } else if (primitiveArrayClasses.includes(value.constructor)) {
    object = new value.constructor([...value]);
  } else if (value instanceof Array) {
    object = [];
  } else if (value instanceof Set) {
    object = /* @__PURE__ */ new Set();
  } else if (value instanceof Map) {
    object = /* @__PURE__ */ new Map();
  }
  originalToCopyMap.set(value, object);
  if (object instanceof Function) {
    thisCopy = deepCopyInner2(theThis, valueChain, originalToCopyMap);
  }
  const output = object;
  try {
    output.constructor = value.constructor;
  } catch (error) {
  }
  Object.setPrototypeOf(output, Object.getPrototypeOf(value));
  const propertyDefinitions = {};
  for (const [key2, description] of Object.entries(Object.getOwnPropertyDescriptors(value))) {
    const { value: value2, get, set, ...options } = description;
    const getIsFunc = get instanceof Function;
    const setIsFunc = set instanceof Function;
    if (getIsFunc || setIsFunc) {
      propertyDefinitions[key2] = {
        ...options,
        get: get ? function(...args) {
          return get.apply(output, args);
        } : void 0,
        set: set ? function(...args) {
          return set.apply(output, args);
        } : void 0
      };
    } else {
      if (key2 == "length" && output instanceof Array) {
        continue;
      }
      propertyDefinitions[key2] = {
        ...options,
        value: deepCopyInner2(value2, valueChain, originalToCopyMap)
      };
    }
  }
  Object.defineProperties(output, propertyDefinitions);
  return output;
}
var deepCopy2 = (value) => deepCopyInner2(value);
var shallowSortObject2 = (obj) => {
  return Object.keys(obj).sort().reduce(
    (newObj, key2) => {
      newObj[key2] = obj[key2];
      return newObj;
    },
    {}
  );
};
var deepSortObject2 = (obj, seen = /* @__PURE__ */ new Map()) => {
  if (!(obj instanceof Object)) {
    return obj;
  } else if (seen.has(obj)) {
    return seen.get(obj);
  } else {
    if (obj instanceof Array) {
      const sortedChildren = [];
      seen.set(obj, sortedChildren);
      for (const each of obj) {
        sortedChildren.push(deepSortObject2(each, seen));
      }
      return sortedChildren;
    } else {
      const sorted = {};
      seen.set(obj, sorted);
      for (const eachKey of Object.keys(obj).sort()) {
        sorted[eachKey] = deepSortObject2(obj[eachKey], seen);
      }
      return sorted;
    }
  }
};
var stableStringify2 = (value, ...args) => {
  return JSON.stringify(deepSortObject2(value), ...args);
};

// main/deno.js
var FIELD = "\uE000";
var QUOTES = "\uE001";
function htm(statics) {
  let h = this, prev = 0, current = [null], field = 0, args, name, value, quotes = [], quote = 0, last, level = 0, pre = false;
  const evaluate = (str2, parts = [], raw) => {
    let i = 0;
    str2 = !raw && str2 === QUOTES ? quotes[quote++].slice(1, -1) : str2.replace(/\ue001/g, (m) => quotes[quote++]);
    if (!str2)
      return str2;
    str2.replace(/\ue000/g, (match, idx) => {
      if (idx)
        parts.push(str2.slice(i, idx));
      i = idx + 1;
      return parts.push(arguments[++field]);
    });
    if (i < str2.length)
      parts.push(str2.slice(i));
    return parts.length > 1 ? parts : parts[0];
  };
  const up = () => {
    ;
    [current, last, ...args] = current;
    current.push(h(last, ...args));
    if (pre === level--)
      pre = false;
  };
  let str = statics.join(FIELD).replace(/<!--[^]*?-->/g, "").replace(/<!\[CDATA\[[^]*\]\]>/g, "").replace(/('|")[^\1]*?\1/g, (match) => (quotes.push(match), QUOTES));
  str.replace(/(?:^|>)((?:[^<]|<[^\w\ue000\/?!>])*)(?:$|<)/g, (match, text, idx, str2) => {
    let tag, close2;
    if (idx) {
      str2.slice(prev, idx).replace(/(\S)\/$/, "$1 /").split(/\s+/).map((part, i) => {
        if (part[0] === "/") {
          part = part.slice(1);
          if (EMPTY[part])
            return;
          close2 = tag || part || 1;
        } else if (!i) {
          tag = evaluate(part);
          if (typeof tag === "string") {
            while (CLOSE[current[1] + tag])
              up();
          }
          current = [current, tag, null];
          level++;
          if (!pre && PRE[tag])
            pre = level;
          if (EMPTY[tag])
            close2 = tag;
        } else if (part) {
          let props = current[2] || (current[2] = {});
          if (part.slice(0, 3) === "...") {
            Object.assign(props, arguments[++field]);
          } else {
            ;
            [name, value] = part.split("=");
            Array.isArray(value = props[evaluate(name)] = value ? evaluate(value) : true) && // if prop value is array - make sure it serializes as string without csv
            (value.toString = value.join.bind(value, ""));
          }
        }
      });
    }
    if (close2) {
      if (!current[0])
        err(`Wrong close tag \`${close2}\``);
      up();
      while (last !== close2 && CLOSE[last])
        up();
    }
    prev = idx + match.length;
    if (!pre)
      text = text.replace(/\s*\n\s*/g, "").replace(/\s+/g, " ");
    if (text)
      evaluate((last = 0, text), current, true);
  });
  if (current[0] && CLOSE[current[1]])
    up();
  if (level)
    err(`Unclosed \`${current[1]}\`.`);
  return current.length < 3 ? current[1] : (current.shift(), current);
}
var err = (msg) => {
  throw SyntaxError(msg);
};
var EMPTY = htm.empty = {};
var CLOSE = htm.close = {};
var PRE = htm.pre = {};
"area base basefont bgsound br col command embed frame hr image img input keygen link meta param source track wbr ! !doctype ? ?xml".split(" ").map((v) => htm.empty[v] = true);
var close = {
  li: "",
  dt: "dd",
  dd: "dt",
  p: "address article aside blockquote details div dl fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol pre section table",
  rt: "rp",
  rp: "rt",
  optgroup: "",
  option: "optgroup",
  caption: "tbody thead tfoot tr colgroup",
  colgroup: "thead tbody tfoot tr caption",
  thead: "tbody tfoot caption",
  tbody: "tfoot caption",
  tfoot: "caption",
  tr: "tbody tfoot",
  td: "th tr",
  th: "td tr tbody"
};
for (let tag in close) {
  for (let closer of [...close[tag].split(" "), tag])
    htm.close[tag] = htm.close[tag + closer] = true;
}
"pre textarea".split(" ").map((v) => htm.pre[v] = true);
var xhtm = htm;
var validStyleAttribute = Object.freeze(/* @__PURE__ */ new Set(["accent-color", "align-content", "align-items", "align-self", "align-tracks", "all", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timeline", "animation-timing-function", "appearance", "ascent-override", "aspect-ratio", "backdrop-filter", "backface-visibility", "background", "background-attachment", "background-blend-mode", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-position-x", "background-position-y", "background-repeat", "background-size", "bleed", "block-overflow", "block-size", "border", "border-block", "border-block-color", "border-block-end", "border-block-end-color", "border-block-end-style", "border-block-end-width", "border-block-start", "border-block-start-color", "border-block-start-style", "border-block-start-width", "border-block-style", "border-block-width", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-end-end-radius", "border-end-start-radius", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-inline", "border-inline-color", "border-inline-end", "border-inline-end-color", "border-inline-end-style", "border-inline-end-width", "border-inline-start", "border-inline-start-color", "border-inline-start-style", "border-inline-start-width", "border-inline-style", "border-inline-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-start-end-radius", "border-start-start-radius", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "caret-color", "clear", "clip", "clip-path", "color", "color-scheme", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "contain", "content", "content-visibility", "counter-increment", "counter-reset", "counter-set", "cursor", "length", "angle", "descent-override", "direction", "display", "resolution", "empty-cells", "fallback", "filter", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "flex_value", "float", "font", "font-display", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-optical-sizing", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-synthesis", "font-variant", "font-variant-alternates", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-variation-settings", "font-weight", "forced-color-adjust", "gap", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-start", "grid-row", "grid-row-end", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "frequency", "hanging-punctuation", "height", "hyphenate-character", "hyphens", "image-orientation", "image-rendering", "image-resolution", "inherit", "inherits", "initial", "initial-letter", "initial-letter-align", "initial-value", "inline-size", "input-security", "inset", "inset-block", "inset-block-end", "inset-block-start", "inset-inline", "inset-inline-end", "inset-inline-start", "isolation", "justify-content", "justify-items", "justify-self", "justify-tracks", "left", "letter-spacing", "line-break", "line-clamp", "line-gap-override", "line-height", "line-height-step", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-block", "margin-block-end", "margin-block-start", "margin-bottom", "margin-inline", "margin-inline-end", "margin-inline-start", "margin-left", "margin-right", "margin-top", "margin-trim", "marks", "mask", "mask-border", "mask-border-mode", "mask-border-outset", "mask-border-repeat", "mask-border-slice", "mask-border-source", "mask-border-width", "mask-clip", "mask-composite", "mask-image", "mask-mode", "mask-origin", "mask-position", "mask-repeat", "mask-size", "mask-type", "masonry-auto-flow", "math-style", "max-block-size", "max-height", "max-inline-size", "max-lines", "max-width", "max-zoom", "min-block-size", "min-height", "min-inline-size", "min-width", "min-zoom", "mix-blend-mode", "time", "negative", "object-fit", "object-position", "offset", "offset-anchor", "offset-distance", "offset-path", "offset-position", "offset-rotate", "opacity", "order", "orientation", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-anchor", "overflow-block", "overflow-clip-margin", "overflow-inline", "overflow-wrap", "overflow-x", "overflow-y", "overscroll-behavior", "overscroll-behavior-block", "overscroll-behavior-inline", "overscroll-behavior-x", "overscroll-behavior-y", "Pseudo-classes", "Pseudo-elements", "pad", "padding", "padding-block", "padding-block-end", "padding-block-start", "padding-bottom", "padding-inline", "padding-inline-end", "padding-inline-start", "padding-left", "padding-right", "padding-top", "page-break-after", "page-break-before", "page-break-inside", "paint-order", "perspective", "perspective-origin", "place-content", "place-items", "place-self", "pointer-events", "position", "prefix", "print-color-adjust", "quotes", "range", "resize", "revert", "right", "rotate", "row-gap", "ruby-align", "ruby-merge", "ruby-position", "scale", "scroll-behavior", "scroll-margin", "scroll-margin-block", "scroll-margin-block-end", "scroll-margin-block-start", "scroll-margin-bottom", "scroll-margin-inline", "scroll-margin-inline-end", "scroll-margin-inline-start", "scroll-margin-left", "scroll-margin-right", "scroll-margin-top", "scroll-padding", "scroll-padding-block", "scroll-padding-block-end", "scroll-padding-block-start", "scroll-padding-bottom", "scroll-padding-inline", "scroll-padding-inline-end", "scroll-padding-inline-start", "scroll-padding-left", "scroll-padding-right", "scroll-padding-top", "scroll-snap-align", "scroll-snap-stop", "scroll-snap-type", "scrollbar-color", "scrollbar-gutter", "scrollbar-width", "shape-image-threshold", "shape-margin", "shape-outside", "size", "size-adjust", "speak-as", "src", "suffix", "symbols", "syntax", "system", "tab-size", "table-layout", "text-align", "text-align-last", "text-combine-upright", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-skip", "text-decoration-skip-ink", "text-decoration-style", "text-decoration-thickness", "text-emphasis", "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-indent", "text-justify", "text-orientation", "text-overflow", "text-rendering", "text-shadow", "text-size-adjust", "text-transform", "text-underline-offset", "text-underline-position", "top", "touch-action", "transform", "transform-box", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "translate", "unicode-bidi", "unicode-range", "unset", "user-select", "user-zoom", "vertical-align", "viewport-fit", "visibility", "white-space", "widows", "width", "will-change", "word-break", "word-spacing", "word-wrap", "writing-mode", "z-index", "zoom"]));
var validNonCallbackHtmlAttributes = Object.freeze(/* @__PURE__ */ new Set(["class", "style", "value", "id", "contenteditable", "href", "hidden", "autofocus", "src", "name", "accept", "accesskey", "action", "align", "alt", "async", "autocomplete", "autoplay", "border", "charset", "checked", "cite", "cols", "colspan", "content", "controls", "coords", "data", "datetime", "default", "defer", "dir", "dirname", "disabled", "download", "draggable", "enctype", "for", "form", "formaction", "headers", "high", "hreflang", "http", "ismap", "kind", "label", "lang", "list", "loop", "low", "max", "maxlength", "media", "method", "min", "multiple", "muted", "novalidate", "open", "optimum", "pattern", "placeholder", "poster", "preload", "readonly", "rel", "required", "reversed", "rows", "rowspan", "sandbox", "scope", "selected", "shape", "size", "sizes", "span", "spellcheck", "srcdoc", "srclang", "srcset", "start", "step", "tabindex", "target", "title", "translate", "type", "usemap", "wrap", "bgcolor", "width", "color", "height"]));
var isValidStyleAttribute = (key2) => key2.startsWith("-") || validStyleAttribute.has(key2);
var kebabCase = (string) => string.replace(/[a-z]([A-Z])(?=[a-z])/g, (each) => `${each[0]}-${each.slice(1).toLowerCase()}`);
var isConstructor = (obj) => !!obj.prototype && !!obj.prototype.constructor.name;
var attachProperties = (source, target) => {
  const attributes = allKeyDescriptions2(source);
  const propertiesDefition = {};
  for (const [key2, value] of Object.entries(attributes)) {
    if (["constructor", "prototype", "length"].includes(key2)) {
      continue;
    }
    propertiesDefition[key2] = {
      get: () => source[key2]
    };
  }
  Object.defineProperties(target, propertiesDefition);
  return target;
};
var toHtmlElement = Symbol.for("toHtmlElement");
var ElementalClass = class _ElementalClass {
  constructor(components = {}, options = {}) {
    const { middleware, errorComponentFactory, defaultPlaceholderFactory } = options || {};
    this.components = components || {};
    this.middleware = middleware || {};
    this.defaultPlaceholderFactory = defaultPlaceholderFactory || (() => document.createElement("div"));
    this.errorComponentFactory = errorComponentFactory || defaultErrorComponentFactory;
    this.html = this.createElement.bind(this);
    this.xhtm = xhtm.bind((...args) => this.createElement(...args));
  }
  static debug = false;
  static allTags = Symbol.for("allTags");
  static exclusivelySvgElements = /* @__PURE__ */ new Set(["svg", "animate", "animateMotion", "animateTransform", "circle", "clipPath", "defs", "desc", "discard", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "foreignObject", "g", "hatch", "hatchpath", "image", "line", "linearGradient", "marker", "mask", "mesh", "meshgradient", "meshpatch", "meshrow", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "set", "stop", "switch", "symbol", "text", "textPath", "tspan", "unknown", "use", "view"]);
  static randomId = (name) => `${name}${Math.random()}`.replace(".", "");
  static makeHtmlElement = function(element) {
    if (element instanceof Node || element instanceof Element || element instanceof HTMLDocument) {
      return element;
    } else {
      if (element == null) {
        return new window.Text("");
      } else if (typeof element == "string") {
        return new window.Text(element);
      } else if (typeof element == "symbol") {
        return new window.Text(element.toString());
      } else if (!(element instanceof Object)) {
        return new window.Text(`${element}`);
      } else if (element[toHtmlElement] != null) {
        return _ElementalClass.makeHtmlElement(element[toHtmlElement]);
      } else {
        let className;
        try {
          className = Object.getPrototypeOf(element).constructor.name;
          className = `class ${JSON.stringify(className)}`;
        } catch (error) {
        }
        throw Error(`Cannot coerce ${className || element} into an html element
`, element);
      }
    }
  };
  static appendChildren = function(element, ...children) {
    const { element: altElement, insertBefore } = element;
    let primitiveAppend = (child) => element.appendChild(child);
    if (insertBefore && !(insertBefore instanceof Function)) {
      element = altElement;
      primitiveAppend = (child) => element.insertBefore(insertBefore, child);
    }
    for (const each of children) {
      if (each instanceof Array) {
        _ElementalClass.appendChildren(element, ...each);
      } else if (each instanceof Function) {
        _ElementalClass.appendChildren(element, each());
      } else if (each instanceof Promise) {
        const elementPromise = each;
        const placeholder = elementPromise.placeholder || document.createElement("div");
        primitiveAppend(placeholder);
        setTimeout(async () => {
          try {
            const result = await elementPromise;
            if (!(result instanceof Array)) {
              const htmlElement = _ElementalClass.makeHtmlElement(result);
              placeholder.replaceWith(htmlElement);
            } else {
              let parentElement = placeholder.parentElement;
              if (!parentElement) {
                parentElement = await new Promise((resolve, reject) => {
                  let intervalId = setInterval(() => {
                    if (placeholder.parentElement) {
                      resolve(placeholder.parentElement);
                      clearInterval(intervalId);
                    }
                  }, 70);
                });
              }
              for (const each2 of result) {
                try {
                  _ElementalClass.appendChildren({
                    element: parentElement,
                    insertBefore: placeholder
                  }, each2);
                } catch (error) {
                  parentElement.insertBefore(placeholder, createErrorElement(`When async component ${toString(element)} resolved, it created an array. One of those elements in the array caused an error when it tried to be added as a child:
 ${toString(error)}`));
                }
              }
            }
          } catch (error) {
            placeholder.replaceWith(
              defaultErrorComponentFactory({ ...properties, children }, key, error)
            );
          }
        }, 0);
      } else {
        primitiveAppend(_ElementalClass.makeHtmlElement(each));
      }
    }
    return element;
  };
  static css = function(first, ...args) {
    if (typeof first == "string") {
      return first;
    } else if (first == null) {
      return "";
    } else if (first instanceof Array) {
      const strings = first;
      const values = args;
      let finalString = "";
      for (const each of strings) {
        finalString += each;
        if (values.length > 0) {
          const value = values.shift();
          if (value instanceof Object) {
            finalString += Elemental.css(value);
          } else {
            finalString += `${value}`;
          }
        }
      }
      return finalString;
    } else if (first instanceof Object) {
      let finalString = "";
      for (const [key2, value] of Object.entries(first)) {
        if (value != null) {
          finalString += `${kebabCase(key2)}: ${value};`;
        }
      }
      return finalString;
    } else {
      return first;
    }
  };
  static combineClasses = (...classes) => {
    classes = classes.filter((each) => each != null);
    let classesFinalList = [];
    for (let eachEntry of classes) {
      if (typeof eachEntry == "string") {
        eachEntry = eachEntry.split(" ");
      }
      if (eachEntry instanceof Array) {
        eachEntry = eachEntry.flat(Infinity);
        for (let eachName of eachEntry) {
          classesFinalList.push(eachName);
        }
      } else if (eachEntry instanceof Object) {
        for (const [className, enabled] of Object.entries(eachEntry)) {
          if (enabled) {
            classesFinalList.push(className);
          }
        }
      }
    }
    return classesFinalList;
  };
  createElement(...args) {
    if (args[0] instanceof Array) {
      return this.xhtm(...args);
    } else {
      _ElementalClass.debug && console.debug(`args is:`, args);
      for (const middleware of (this.middleware[_ElementalClass.allTags] || []).concat(this.middleware[args[0]] || [])) {
        try {
          args = eachMiddleWare(args);
        } catch (error) {
          console.error("[ElementalClass] one of the middleware functions failed:", eachMiddleWare, args);
        }
      }
      let [key2, properties2, ...children] = args;
      _ElementalClass.debug && console.debug(`key, properties, children is:`, key2, properties2, children);
      if (this.components[key2] instanceof Function) {
        key2 = this.components[key2];
      }
      if (key2 instanceof Function) {
        let output;
        try {
          output = isConstructor(key2) ? new key2({ ...properties2, children }) : key2({ ...properties2, children });
        } catch (error) {
          return this.errorComponentFactory({ ...properties2, children }, key2, error);
        }
        if (output instanceof Promise) {
          const elementPromise = output;
          const placeholder = elementPromise.placeholder || this.defaultPlaceholderFactory(output);
          setTimeout(async () => {
            try {
              const result = await elementPromise;
              if (!(result instanceof Array)) {
                const htmlElement = _ElementalClass.makeHtmlElement(result);
                placeholder.replaceWith(htmlElement);
              } else {
                let parentElement = placeholder.parentElement;
                if (!parentElement) {
                  parentElement = await new Promise((resolve, reject) => {
                    let intervalId = setInterval(() => {
                      if (placeholder.parentElement) {
                        resolve(placeholder.parentElement);
                        clearInterval(intervalId);
                      }
                    }, 70);
                  });
                }
                for (const each of result) {
                  try {
                    _ElementalClass.appendChildren({
                      element: parentElement,
                      insertBefore: placeholder
                    }, each);
                  } catch (error) {
                    parentElement.insertBefore(placeholder, createErrorElement(`Something returned a promise, which resolved to an array, and then something tried to append those to an element (this element: ${element}). One of the items in the array ${each} caused an error when it tried to be added as a child:
 ${toString(error)}`));
                  }
                }
              }
            } catch (error) {
              placeholder.replaceWith(
                this.errorComponentFactory({ ...properties2, children }, key2, error)
              );
            }
          }, 0);
          return placeholder;
        } else {
          return output;
        }
      }
      const isSvg = _ElementalClass.exclusivelySvgElements.has(key2);
      let element;
      if (key2 == "iframe" && properties2.src) {
        const helper = document.createElement("div");
        helper.innerHTML = `<iframe src=${JSON.stringify(properties2.src)}></iframe>`;
        element = helper.children[0];
        delete properties2.src;
      } else if (isSvg) {
        element = document.createElementNS("http://www.w3.org/2000/svg", key2);
      } else {
        element = document.createElement(key2);
      }
      let styleString = "";
      if (properties2 instanceof Object) {
        for (let [key3, value] of Object.entries(properties2)) {
          if (key3 == "style") {
            styleString += _ElementalClass.css(value);
            continue;
          }
          if (key3.slice(0, 2) == "on" && key3.slice(2, 3).toLowerCase() !== key3.slice(2, 3) && value instanceof Function) {
            element.addEventListener(key3.slice(2).toLowerCase(), value);
          }
          if (key3 == "class") {
            if (value instanceof Array) {
              value = value.join(" ");
            } else if (value instanceof Object) {
              let newValue = "";
              for (const [classString, enable] of Object.entries(value)) {
                if (enable) {
                  newValue += classString;
                }
              }
              value = newValue;
            }
          }
          if (isSvg) {
            if (value instanceof Array) {
              value = value.join(" ");
            }
            element.setAttribute(kebabCase(key3), value);
            continue;
          }
          if (value != null && !(value instanceof Object) && validNonCallbackHtmlAttributes.has(key3)) {
            element.setAttribute(key3, value);
          }
          try {
            element[key3] = value;
          } catch (error) {
          }
          if (isValidStyleAttribute(key3)) {
            styleString += `;${key3}: ${value};`;
          }
        }
      }
      if (styleString) {
        element.setAttribute("style", styleString);
      }
      return _ElementalClass.appendChildren(element, ...children);
    }
  }
  extend(additionalComponents = {}, options = {}) {
    const { middleware, ...other } = options || {};
    return Elemental(
      { ...this.components, ...additionalComponents },
      {
        middleware: { ...this.middleware, ...middleware },
        ...other
      }
    );
  }
};
var Elemental = (...args) => {
  const elementalObject = new ElementalClass(...args);
  const createElementFunction = elementalObject.createElement.bind(elementalObject);
  attachProperties(ElementalClass, createElementFunction);
  attachProperties(elementalObject, createElementFunction);
  return createElementFunction;
};
attachProperties(ElementalClass, Elemental);
function createErrorElement(error) {
  const element = document.createElement("div");
  element.setAttribute("style", `
        all:              unset;
        display:          flex;
        flex-direction:   column;
        padding:          1.5rem;
        background-color: #f5a5a8;
        color:            white;
        font-family:      -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
        font-size:        18px;
        font-weight:      400;
        overflow:         auto;
    `);
  element.innerHTML = `I'm sorry, there was an error when loading this part of the page \u{1F641}.<br>Here's the error message: ${Option(toString(error != null && error.message || error)).innerHTML}`;
}
function defaultErrorComponentFactory({ children, ...properties2 }, key2, error) {
  const element = document.createElement("div");
  const errorDetails = document.createElement("div");
  const childContainer = document.createElement("div");
  element.setAttribute("style", `
        all:              unset;
        display:          flex;
        flex-direction:   column;
        padding:          1.5rem;
        background-color: #f5a5a8;
        color:            white;
        font-family:      -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
        font-size:        18px;
        font-weight:      400;
        overflow:         auto;
    `);
  element.innerHTML = `I'm sorry, there was an error when loading this part of the page \u{1F641} `;
  let errorElementPart;
  if (typeof key2 == "string") {
    errorElementPart = `&lt;${key2} />`;
  } else {
    try {
      errorElementPart = `&lt;${key2.prototype.constructor.name} />`;
    } catch (error2) {
      try {
        errorElementPart = `&lt;${key2.name} />`;
      } catch (error3) {
        errorElementPart = `&lt;${key2} />`;
      }
    }
  }
  let errorJsonObject = {};
  for (const [key3, value] of Object.entries(properties2)) {
    try {
      errorJsonObject[key3] = JSON.parse(JSON.stringify(value));
    } catch (error2) {
      if (typeof value == "symbol") {
        errorJsonObject[key3] = value.toString();
      } else {
        errorJsonObject[key3] = `${value}`;
      }
    }
  }
  errorDetails.innerHTML = `<span>error: ${`${error}`.replace(/\n/, "<br>")}<br>location:<br>${indent({ string: error.stack, by: "    " }).replace(/\n/, "<br>")}</span><br><span>tag: ${errorElementPart}</span><br><div>properties:<br><code style="max-height: 12rem; overflow: auto;">${JSON.stringify(errorJsonObject, 0, 4)}</code></div>`;
  errorDetails.setAttribute("style", `
        padding: 1rem;
        background-color: #161b22;
        color: #789896;
        white-space: pre;
        max-width: 85vw;
        overflow: auto;
    `);
  element.appendChild(errorDetails);
  childContainer.setAttribute("style", `
        all: unset
        display: flex
        flex-direction: column
        margin-top: 1.3rem
    `);
  for (const each of children || []) {
    try {
      ElementalClass.appendChildren(childContainer, [each]);
    } catch (error2) {
    }
  }
  element.appendChild(childContainer);
  return element;
}
try {
  const originalHead = document.head;
  Object.defineProperty(document, "head", {
    set: (element) => ElementalClass.appendChildren(originalHead, ...element.childNodes),
    get: () => originalHead,
    writable: true
  });
} catch (error) {
}
var combineClasses = ElementalClass.combineClasses;
var html = Elemental();
var css = ElementalClass.css;
var allTags = ElementalClass.allTags;
var deno_default = {
  Elemental,
  html,
  css,
  allTags,
  combineClasses
};
export {
  Elemental,
  allTags,
  combineClasses,
  css,
  deno_default as default,
  html,
  toHtmlElement
};
