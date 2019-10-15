// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/rahisi/dist/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRef = (() => {
    let id = 0; // possible collision
    return () => `id_${id++}`;
})();
exports.mounted = "mounted";
exports.unmounted = "unmounted";
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
            mutation.addedNodes.forEach((n) => n.dispatchEvent(new Event(exports.mounted)));
            mutation.removedNodes.forEach((n) => n.dispatchEvent(new Event(exports.unmounted)));
        }
    });
});
document.addEventListener("DOMContentLoaded", () => observer.observe(document.body, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true,
}), false);
class Notifier {
    constructor() {
        this.nextId = 0;
        this.subscribers = new Map();
    }
    start() {
        const notify = () => {
            this.subscribers.forEach((v) => v());
            window.requestAnimationFrame(notify);
        };
        window.requestAnimationFrame(notify);
    }
    subscribe(onNext, dependency) {
        const currentId = this.nextId;
        this.nextId++;
        this.subscribers.set(currentId, onNext);
        dependency.addEventListener(exports.unmounted, () => this.subscribers.delete(currentId));
    }
}
class VersionedList {
    constructor(items = new Array()) {
        this.items = items;
        this.nextKey = 0;
        // tslint:disable-next-line:no-empty
        this.addListener = () => { };
        // tslint:disable-next-line:no-empty
        this.removeListener = () => { };
    }
    getItems() {
        return this.items.map((a) => a.value);
    }
    getItem(index) {
        return this.items[index].value;
    }
    count() { return this.items.length; }
    add(item) {
        const val = { key: this.nextKey, value: item };
        this.items.push(val);
        this.nextKey++;
        this.addListener([val]);
    }
    delete(itemIndex) {
        const val = this.items[itemIndex];
        this.items.splice(itemIndex, 1);
        this.nextKey++;
        this.removeListener([val]);
    }
    remove(item) {
        this.delete(this.indexOf(item));
    }
    clear() {
        const cleared = this.items.splice(0);
        this.items.length = 0;
        this.nextKey++;
        this.removeListener(cleared);
    }
    indexOf(obj, fromIndex = 0) {
        if (fromIndex < 0) {
            fromIndex = Math.max(0, this.items.length + fromIndex);
        }
        for (let i = fromIndex, j = this.items.length; i < j; i++) {
            if (this.items[i].value === obj) {
                return i;
            }
        }
        return -1;
    }
    forEach(action) {
        this.getItems().forEach(action);
    }
    filter(filter) {
        return this.getItems().filter(filter);
    }
    setListeners(addListener, removeListener) {
        this.addListener = addListener;
        this.removeListener = removeListener;
        this.addListener(this.items);
    }
}
exports.VersionedList = VersionedList;
class BaseElement {
    constructor(elementName, attributes = new Array(), children = new Array()) {
        this.elementName = elementName;
        this.attributes = attributes;
        this.children = children;
    }
    // factor out
    mount(parent) {
        const notifier = new Notifier();
        const v = this.render(parent, notifier, false);
        notifier.start();
        return v;
    }
    render(parent, watch, isSvg) {
        const useSvg = isSvg || this.elementName === "svg";
        if (this.elementName == null) { // it's a fragment
            const view = document.createDocumentFragment();
            this.children.forEach((a) => a.render(view, watch, useSvg));
            parent.appendChild(view);
            return parent;
        }
        const view = useSvg ? document.createElementNS("http://www.w3.org/2000/svg", this.elementName) :
            document.createElement(this.elementName);
        this.attributes.forEach((a) => a.set(view, watch, useSvg));
        this.children.forEach((a) => a.render(view, watch, useSvg));
        parent.appendChild(view);
        return view;
    }
}
exports.BaseElement = BaseElement;
class ConditionalRenderElement {
    constructor(source, def) {
        this.source = source;
        this.def = def;
        this.currentNode = document.createTextNode("");
        this.fallback = { test: () => true, renderable: def };
        this.currentSource = source.find((a) => a.test()) || this.fallback;
    }
    mount(parent) {
        const notifier = new Notifier();
        const v = this.render(parent, notifier, false);
        notifier.start();
        return v;
    }
    render(parent, watch, isSvg) {
        this.currentNode =
            this.currentSource
                .renderable()
                .render(parent, watch, isSvg);
        const gen = this.source;
        watch.subscribe(() => {
            const s = gen.find((a) => a.test());
            if (this.currentSource !== s) {
                this.currentSource = s || this.fallback;
                const replacement = this.currentSource
                    .renderable()
                    .render(document.createDocumentFragment(), watch, isSvg);
                parent.replaceChild(replacement, this.currentNode);
                this.currentNode = replacement;
            }
        }, parent);
        return this.currentNode;
    }
}
exports.ConditionalRenderElement = ConditionalRenderElement;
class TemplateElement {
    constructor(source, template, placeholder) {
        this.source = source;
        this.template = template;
        this.placeholder = placeholder;
        this.nodes = new Map();
        this.currentValue = new VersionedList();
    }
    mount(parent) {
        const notifier = new Notifier();
        const v = this.render(parent, notifier, false);
        notifier.start();
        return v;
    }
    render(o, watch, isSvg) {
        const placeholderNode = this.placeholder ? this.placeholder.render(document.createDocumentFragment(), watch, isSvg) : null;
        const showPlaceHolder = () => {
            if (!placeholderNode) {
                return;
            }
            if (this.nodes.size === 0) {
                const _ = placeholderNode.parentElement === o || o.appendChild(placeholderNode);
            }
            else {
                const _ = placeholderNode.parentElement === o && o.removeChild(placeholderNode);
            }
        };
        const subscribe = () => {
            this.nodes.forEach((child, _) => o.removeChild(child));
            this.nodes.clear();
            this.currentValue.setListeners((items) => {
                const fragment = document.createDocumentFragment();
                items.forEach((i) => {
                    const child = this.template(i.value).render(fragment, watch, isSvg);
                    this.nodes.set(i.key, child);
                });
                o.appendChild(fragment);
                showPlaceHolder();
            }, (items) => {
                items.forEach((i) => {
                    o.removeChild(this.nodes.get(i.key));
                    this.nodes.delete(i.key);
                });
                showPlaceHolder();
            });
            showPlaceHolder();
        };
        if (this.source instanceof VersionedList) {
            this.currentValue = this.source;
            subscribe();
        }
        else {
            this.currentValue = this.source();
            subscribe();
            const gen = this.source;
            watch.subscribe(() => {
                const s = gen();
                if (this.currentValue !== s) {
                    this.currentValue = s;
                    subscribe();
                }
            }, o);
        }
        return o;
    }
}
exports.TemplateElement = TemplateElement;
class TextElement {
    constructor(textContent) {
        this.textContent = textContent;
        this.currentValue = "";
    }
    mount(parent) {
        const notifier = new Notifier();
        const v = this.render(parent, notifier, false);
        notifier.start();
        return v;
    }
    render(parent, watch, _) {
        const o = document.createTextNode("");
        if (typeof this.textContent !== "function") {
            this.currentValue = this.textContent;
            o.textContent = this.currentValue;
        }
        else {
            this.currentValue = this.textContent();
            o.textContent = this.currentValue;
            const gen = this.textContent;
            watch.subscribe(() => {
                const s = gen();
                if (this.currentValue !== s) {
                    this.currentValue = s;
                    o.textContent = this.currentValue;
                }
            }, o);
        }
        parent.appendChild(o);
        return o;
    }
}
exports.TextElement = TextElement;
// xss via href
class NativeAttribute {
    constructor(attribute, value) {
        this.attribute = attribute;
        this.value = value;
        this.currentValue = "";
    }
    set(o, watch, isSvg) {
        if (typeof this.value !== "function") {
            this.currentValue = this.value;
            NativeAttribute.setAttribute(this.attribute, o, this.currentValue, isSvg);
        }
        else {
            this.currentValue = this.value();
            NativeAttribute.setAttribute(this.attribute, o, this.currentValue, isSvg);
            const gen = this.value;
            watch.subscribe(() => {
                const s = gen();
                if (this.currentValue !== s) {
                    this.currentValue = s;
                    NativeAttribute.setAttribute(this.attribute, o, this.currentValue, isSvg);
                }
            }, o);
        }
    }
}
NativeAttribute.setAttribute = (attribute, element, value, isSvg) => {
    if (attribute === "style") {
        for (const key of Object.keys(value)) {
            const style = value == null || value[key] == null ? "" : value[key];
            if (key[0] === "-") {
                element[attribute].setProperty(key, style);
            }
            else {
                element[attribute][key] = style;
            }
        }
    }
    else if (attribute in element &&
        attribute !== "list" &&
        attribute !== "type" &&
        attribute !== "draggable" &&
        attribute !== "spellcheck" &&
        attribute !== "translate" &&
        !isSvg) {
        element[attribute] = value == null ? "" : value;
    }
    else if (value != null && value !== false) {
        element.setAttribute(attribute, value);
    }
    if (value == null || value === false) {
        element.removeAttribute(attribute);
    }
};
exports.NativeAttribute = NativeAttribute;
// lose focus when body is clicked
class FocusA {
    constructor(focus) {
        this.focus = focus;
        this.currentValue = false;
    }
    set(o, watch) {
        if (typeof this.focus !== "function") {
            this.currentValue = this.focus;
            if (this.currentValue) {
                o.focus();
            }
        }
        else {
            this.currentValue = this.focus();
            if (this.currentValue) {
                o.focus();
            }
            const gen = this.focus;
            watch.subscribe(() => {
                const s = gen();
                if (this.currentValue !== s) {
                    this.currentValue = s;
                }
                if (this.currentValue && document.activeElement !== o) {
                    o.focus();
                }
            }, o);
        }
    }
}
exports.FocusA = FocusA;
class OnHandlerA {
    constructor(eventName, handler) {
        this.eventName = eventName;
        this.handler = handler;
    }
    set(o, _) {
        o.addEventListener(this.eventName, this.handler);
    }
}
exports.OnHandlerA = OnHandlerA;
exports.Template = (props) => {
    const { source, template, placeholder } = props;
    return new TemplateElement(source, template, placeholder || null); // no props
};

},{}],"../node_modules/rahisi/dist/factory.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
class React {
}
React.createElement = (tagName, attributes, ...children) => {
    if (typeof tagName === "function") {
        return tagName(attributes, children);
    }
    const attribs = React.getAttributes(attributes);
    const kids = React.getChildren(children);
    return new index_1.BaseElement(tagName, attribs, kids);
};
React.getAttributes = (attributes) => {
    const attribs = new Array();
    if (attributes) {
        for (const k of Object.keys(attributes)) {
            const key = k.toLowerCase().replace("doubleclick", "dblclick");
            const attributeValue = attributes[k];
            if (key.startsWith("on")) {
                const event = key.substring(2);
                attribs.push(new index_1.OnHandlerA(event, attributeValue));
                continue;
            }
            switch (key) {
                case "classname":
                    attribs.push(new index_1.NativeAttribute("class", attributeValue));
                    break;
                case "htmlfor":
                    attribs.push(new index_1.NativeAttribute("for", attributeValue));
                    break;
                case "focus":
                    attribs.push(new index_1.FocusA(attributeValue));
                    break;
                default:
                    attribs.push(new index_1.NativeAttribute(key, attributeValue));
                    break;
            }
        }
    }
    return attribs;
};
React.getChildren = (children) => {
    const kids = new Array();
    for (const child of children) {
        React.appendChild(kids, child);
    }
    return kids;
};
React.appendChild = (kids, child) => {
    // <>{condition && <a>Display when condition is true</a>}</>
    // if condition is false, the child is a boolean, but we don't want to display anything
    if (typeof child === "undefined" || typeof child === "boolean" || child === null) {
        return;
    }
    if (Array.isArray(child)) {
        for (const value of child) {
            React.appendChild(kids, value);
        }
    }
    else if (typeof child === "string" || typeof child === "number") {
        kids.push(new index_1.TextElement(child.toString()));
    }
    else if (child instanceof index_1.BaseElement
        || child instanceof index_1.TextElement
        || child instanceof index_1.ConditionalRenderElement
        || child instanceof index_1.TemplateElement) {
        kids.push(child);
    }
    else if (typeof child === "function") {
        kids.push(new index_1.TextElement(child));
    }
    else {
        kids.push(new index_1.TextElement(String(child)));
    }
};
exports.React = React;

},{"./index":"../node_modules/rahisi/dist/index.js"}],"../node_modules/rahisi/dist/control-extensions.js":[function(require,module,exports) {
"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("./factory");
const index_1 = require("./index");
// add custom parameters checkChanged etc.
exports.CheckBox = (props) => {
    const { onCheckChanged } = props, rest = __rest(props, ["onCheckChanged"]);
    const attributes = factory_1.React.getAttributes(rest);
    if (onCheckChanged) {
        attributes.push(new index_1.OnHandlerA("click", (e) => onCheckChanged(e.currentTarget.checked)));
    }
    attributes.push(new index_1.NativeAttribute("type", "checkbox"));
    return new index_1.BaseElement("input", attributes);
};
exports.TextBox = (props) => {
    const { onTextChanged } = props, rest = __rest(props, ["onTextChanged"]);
    const attributes = factory_1.React.getAttributes(rest);
    if (onTextChanged) {
        const handler = (() => {
            let val = "";
            const onKeyUp = (e) => {
                if (e.currentTarget.value === val) {
                    return;
                }
                val = e.currentTarget.value;
                onTextChanged(val);
            };
            return onKeyUp;
        })();
        attributes.push(new index_1.OnHandlerA("keyup", handler));
    }
    attributes.push(new index_1.NativeAttribute("type", "text"));
    return new index_1.BaseElement("input", attributes);
};
// export const textVal = (e: R.KeyboardEvent<HTMLInputElement>) => e.currentTarget.value;
exports.doScroll = (o, element, to, duration) => {
    const start = element.scrollTop;
    const change = (to || o.offsetTop - 10) - start;
    const increment = 20;
    let currentTime = 0;
    const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * t * t + b;
        }
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };
    const animateScroll = () => {
        currentTime += increment;
        const d = duration || 300;
        const val = easeInOutQuad(currentTime, start, change, d);
        element.scrollTop = val;
        if (currentTime < d) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
};

},{"./factory":"../node_modules/rahisi/dist/factory.js","./index":"../node_modules/rahisi/dist/index.js"}],"../node_modules/rahisi/dist/forTyping.js":[function(require,module,exports) {
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./control-extensions"));
__export(require("./index"));
__export(require("./factory"));

},{"./control-extensions":"../node_modules/rahisi/dist/control-extensions.js","./index":"../node_modules/rahisi/dist/index.js","./factory":"../node_modules/rahisi/dist/factory.js"}],"../node_modules/rahisi-type-utils/dist/types.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENTER_KEY = 13;
exports.ESCAPE_KEY = 27;
exports.notNullOrWhiteSpace = (s) => !!s && s.trim().length > 0;

},{}],"async-helpers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.delay = function (milliseconds, count) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(count);
    }, milliseconds);
  });
};

exports.runTask = function (task, timeout) {
  var shouldCancel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
    return false;
  };
  setTimeout(function () {
    if (shouldCancel()) {
      return;
    }

    task();
  }, timeout);
};
},{}],"spa-dummy-data.tsx":[function(require,module,exports) {
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var rahisi_1 = require("rahisi");

var rahisi_2 = require("rahisi");

var rahisi_3 = require("rahisi");

var rahisi_type_utils_1 = require("rahisi-type-utils");

var async_helpers_1 = require("./async-helpers");

exports.main = function () {
  var users = new rahisi_3.VersionedList();
  var messages = new rahisi_3.VersionedList();
  var anonUser = {
    name: "'Please sign-in'"
  };
  var currentUser = anonUser;
  var chatee = anonUser;
  var isLogonPending = false;
  var isChatOpen = false;

  var isLoggedOn = function isLoggedOn() {
    return currentUser !== anonUser;
  };

  var simulateDataFeed = function simulateDataFeed() {
    var shouldCancel = function shouldCancel() {
      return !isLoggedOn();
    };

    async_helpers_1.runTask(function () {
      return users.add({
        name: "Betty"
      });
    }, 1000, shouldCancel);
    async_helpers_1.runTask(function () {
      return users.add({
        name: "Mike"
      });
    }, 2000, shouldCancel);
    async_helpers_1.runTask(function () {
      return users.add({
        name: "Pebbles"
      });
    }, 3000, shouldCancel);
    async_helpers_1.runTask(function () {
      return users.add({
        name: "Wilma"
      });
    }, 4000, shouldCancel);
    async_helpers_1.runTask(function () {
      var sender = users.getItem(3);
      var simulatedReceipt = {
        kind: "from",
        from: sender,
        content: "Hi there ".concat(currentUser.name, "!  ").concat(sender.name, " here.")
      };

      if (chatee !== sender) {
        chatee = sender;
        var simulatedStart = {
          kind: "started",
          with: sender
        };
        messages.add(simulatedStart);
      }

      messages.add(simulatedReceipt);
    }, 5000, shouldCancel);
  };

  var logoff = function logoff() {
    currentUser = anonUser;
    chatee = anonUser;
    messages.clear();
    users.clear();
    isChatOpen = false;
  };

  var logon = function logon(userName) {
    return __awaiter(void 0, void 0, void 0,
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              isLogonPending = true;
              _context.next = 3;
              return async_helpers_1.delay(1500, 0);

            case 3:
              isLogonPending = false;
              currentUser = {
                name: userName
              };
              isChatOpen = true;

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
  };

  var processUser = function processUser() {
    return __awaiter(void 0, void 0, void 0,
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var userName;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!isLoggedOn()) {
                _context2.next = 3;
                break;
              }

              logoff();
              return _context2.abrupt("return");

            case 3:
              userName = prompt("Please sign-in");

              if (!rahisi_type_utils_1.notNullOrWhiteSpace(userName)) {
                _context2.next = 8;
                break;
              }

              _context2.next = 7;
              return logon(userName);

            case 7:
              simulateDataFeed();

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
  };

  var sendingMessage = false;
  var messageContent = "";

  var submitMessage = function submitMessage() {
    return __awaiter(void 0, void 0, void 0,
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var message, responseFrom;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(!rahisi_type_utils_1.notNullOrWhiteSpace(messageContent) || !isLoggedOn() || chatee === anonUser)) {
                _context3.next = 2;
                break;
              }

              return _context3.abrupt("return");

            case 2:
              message = {
                kind: "to",
                to: chatee,
                content: messageContent
              };
              messages.add(message);
              messageContent = "";
              sendingMessage = true;
              _context3.next = 8;
              return async_helpers_1.delay(250, 0);

            case 8:
              sendingMessage = false;
              responseFrom = chatee;
              async_helpers_1.runTask(function () {
                var simulatedResponse = {
                  kind: "from",
                  from: responseFrom,
                  content: "Thanks for the note, ".concat(currentUser.name)
                };
                messages.add(simulatedResponse);
              }, 1500, function () {
                return !isLoggedOn();
              });

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
  };

  var submitOnEnter = function submitOnEnter(e) {
    return __awaiter(void 0, void 0, void 0,
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!(e.keyCode !== rahisi_type_utils_1.ENTER_KEY)) {
                _context4.next = 2;
                break;
              }

              return _context4.abrupt("return");

            case 2:
              _context4.next = 4;
              return submitMessage();

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
  };

  var placeholderTemplate = rahisi_1.React.createElement("div", {
    className: "spa-chat-list-note"
  }, "\"To chat alone is the fate of all great souls...\"", rahisi_1.React.createElement("br", null), rahisi_1.React.createElement("br", null), "\"No one is online\"");

  var startChat = function startChat(user) {
    chatee = user;
    var message = {
      kind: "started",
      with: user
    };
    messages.add(message);
  };

  var selectedClass = "spa-x-select";

  var userTemplate = function userTemplate(user) {
    return rahisi_1.React.createElement("div", {
      className: function className() {
        return "spa-chat-list-name " + (chatee === user ? selectedClass : "");
      },
      onClick: function onClick() {
        return startChat(user);
      }
    }, user.name);
  };

  var messageTemplate = function messageTemplate(m) {
    var _ref = function () {
      switch (m.kind) {
        case "from":
          return ["spa-chat-msg-log-msg", "".concat(m.from.name, ": ").concat(m.content)];

        case "to":
          return ["spa-chat-msg-log-me", "".concat(currentUser.name, ": ").concat(m.content)];

        case "started":
          return ["spa-chat-msg-log-alert", "Now chatting with ".concat(m.with.name)];
      }
    }(),
        _ref2 = _slicedToArray(_ref, 2),
        style = _ref2[0],
        content = _ref2[1];

    var onmounted = function onmounted(e) {
      return rahisi_2.doScroll(e.currentTarget, e.currentTarget.parentElement);
    };

    return rahisi_1.React.createElement("div", {
      className: style,
      onMounted: onmounted
    }, content);
  };

  var animateOpen = "spa-chat spa-chat-animate-open";
  var animateClose = "spa-chat spa-chat-animate-close";

  var isChatActive = function isChatActive() {
    return isLoggedOn() && isChatOpen;
  };

  var chatContainer = rahisi_1.React.createElement("div", {
    className: function className() {
      return isChatActive() ? animateOpen : animateClose;
    }
  }, rahisi_1.React.createElement("div", {
    className: "spa-chat-head"
  }, rahisi_1.React.createElement("div", {
    className: "spa-chat-head-toggle",
    title: function title() {
      return isChatOpen ? "Tap to close" : "Tap to open";
    },
    onClick: function onClick() {
      return isChatOpen = !isChatOpen;
    }
  }, function () {
    return isChatOpen ? "=" : "+";
  }), rahisi_1.React.createElement("div", {
    className: "spa-chat-head-title"
  }, function () {
    return "Chat " + (chatee === anonUser ? "" : chatee.name);
  }), rahisi_1.React.createElement("div", {
    className: "spa-chat-closer",
    onClick: function onClick() {
      return isLoggedOn() && logoff();
    }
  }, "x")), rahisi_1.React.createElement("div", {
    className: function className() {
      return isChatActive() ? "spa-chat-sizer" : "hidden";
    }
  }, rahisi_1.React.createElement("div", {
    className: "spa-chat-list"
  }, rahisi_1.React.createElement("div", {
    className: "spa-chat-list-box"
  }, rahisi_1.React.createElement(rahisi_3.Template, {
    source: users,
    template: userTemplate,
    placeholder: placeholderTemplate
  }))), rahisi_1.React.createElement("div", {
    className: "spa-chat-msg"
  }, rahisi_1.React.createElement("div", {
    className: "spa-chat-msg-log"
  }, rahisi_1.React.createElement(rahisi_3.Template, {
    source: messages,
    template: messageTemplate
  })), rahisi_1.React.createElement("div", {
    className: "spa-chat-msg-in"
  }, rahisi_1.React.createElement(rahisi_2.TextBox, {
    disabled: function disabled() {
      return chatee === anonUser;
    },
    onTextChanged: function onTextChanged(s) {
      return messageContent = s;
    },
    onKeyUp: function onKeyUp(s) {
      return submitOnEnter(s);
    },
    value: function value() {
      return messageContent;
    },
    focus: function focus() {
      return true;
    }
  }), rahisi_1.React.createElement("div", {
    className: function className() {
      return "spa-chat-msg-send " + (sendingMessage ? selectedClass : "");
    },
    onClick: submitMessage
  }, "send")))));
  var mainContainer = rahisi_1.React.createElement("div", {
    className: "spa"
  }, rahisi_1.React.createElement("div", {
    className: "spa-shell-head"
  }, rahisi_1.React.createElement("div", {
    className: "spa-shell-head-logo"
  }, rahisi_1.React.createElement("h1", null, "SPA"), rahisi_1.React.createElement("p", null, "typescript end to end")), rahisi_1.React.createElement("div", {
    className: "spa-shell-head-acct",
    onClick: processUser
  }, function () {
    return isLogonPending ? "... processing ..." : currentUser.name;
  })), rahisi_1.React.createElement("div", {
    className: "spa-shell-main"
  }, rahisi_1.React.createElement("div", {
    className: "spa-shell-main-nav"
  }, " "), rahisi_1.React.createElement("div", {
    className: "spa-shell-main-content"
  })), rahisi_1.React.createElement("div", {
    className: "spa-shell-foot"
  }));
  mainContainer.mount(document.body);
  chatContainer.mount(document.body);
};

document.addEventListener("DOMContentLoaded", exports.main, false);
},{"rahisi":"../node_modules/rahisi/dist/forTyping.js","rahisi-type-utils":"../node_modules/rahisi-type-utils/dist/types.js","./async-helpers":"async-helpers.ts"}],"../../../../../Users/muigai/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54892" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../Users/muigai/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","spa-dummy-data.tsx"], null)
//# sourceMappingURL=/spa-dummy-data.js.map