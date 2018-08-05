/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/spa-dummy-data.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/rahisi-type-utils/dist/types.js":
/*!******************************************************!*\
  !*** ./node_modules/rahisi-type-utils/dist/types.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ENTER_KEY = 13;
exports.ESCAPE_KEY = 27;
exports.notNullOrWhiteSpace = (s) => !!s && s.trim().length > 0;
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/rahisi/dist/control-extensions.js":
/*!********************************************************!*\
  !*** ./node_modules/rahisi/dist/control-extensions.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
const factory_1 = __webpack_require__(/*! ./factory */ "./node_modules/rahisi/dist/factory.js");
const index_1 = __webpack_require__(/*! ./index */ "./node_modules/rahisi/dist/index.js");
exports.CheckBox = (props) => {
    const { onCheckChanged } = props, rest = __rest(props, ["onCheckChanged"]);
    const attributes = factory_1.React.getAttributes(rest);
    if (onCheckChanged) {
        attributes.push(new index_1.OnHandlerA("click", (e) => onCheckChanged(e.currentTarget.checked)));
    }
    attributes.push(new index_1.NativeAttribute("type", "checkbox"));
    return new index_1.BaseElement("input", attributes);
};
exports.TextBox = (props) => factory_1.React.createElement("input", Object.assign({}, props, { type: "text" }));
exports.textVal = (e) => e.currentTarget.value;
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
//# sourceMappingURL=control-extensions.js.map

/***/ }),

/***/ "./node_modules/rahisi/dist/factory.js":
/*!*********************************************!*\
  !*** ./node_modules/rahisi/dist/factory.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __webpack_require__(/*! ./index */ "./node_modules/rahisi/dist/index.js");
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
        const test = child();
        if (typeof test === "function") {
            kids.push(new index_1.ConditionalRenderElement(child));
        }
        else {
            kids.push(new index_1.TextElement(child));
        }
    }
    else {
        kids.push(new index_1.TextElement(String(child)));
    }
};
exports.React = React;
//# sourceMappingURL=factory.js.map

/***/ }),

/***/ "./node_modules/rahisi/dist/forTyping.js":
/*!***********************************************!*\
  !*** ./node_modules/rahisi/dist/forTyping.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./control-extensions */ "./node_modules/rahisi/dist/control-extensions.js"));
__export(__webpack_require__(/*! ./index */ "./node_modules/rahisi/dist/index.js"));
__export(__webpack_require__(/*! ./factory */ "./node_modules/rahisi/dist/factory.js"));
//# sourceMappingURL=forTyping.js.map

/***/ }),

/***/ "./node_modules/rahisi/dist/index.js":
/*!*******************************************!*\
  !*** ./node_modules/rahisi/dist/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createRef = (() => {
    let id = 0;
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
        this.addListener = () => { };
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
    mount(parent) {
        const notifier = new Notifier();
        const v = this.render(parent, notifier, false);
        notifier.start();
        return v;
    }
    render(parent, watch, isSvg) {
        const useSvg = isSvg || this.elementName === "svg";
        if (this.elementName == null) {
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
    constructor(source) {
        this.source = source;
        this.currentNode = document.createTextNode("");
        this.currentSource = () => { throw new Error("undefined"); };
    }
    mount(parent) {
        const notifier = new Notifier();
        const v = this.render(parent, notifier, false);
        notifier.start();
        return v;
    }
    render(parent, watch, isSvg) {
        this.currentSource = this.source();
        this.currentNode = this.currentSource().render(parent, watch, isSvg);
        const gen = this.source;
        watch.subscribe(() => {
            const s = gen();
            if (this.currentSource !== s) {
                this.currentSource = s;
                const replacement = this.currentSource().render(document.createDocumentFragment(), watch, isSvg);
                parent.replaceChild(replacement, this.currentNode);
            }
        }, parent);
        parent.appendChild(this.currentNode);
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
    return new TemplateElement(source, template, placeholder || null);
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./src/async-helpers.ts":
/*!******************************!*\
  !*** ./src/async-helpers.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = (milliseconds, count) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(count);
    }, milliseconds);
});
exports.runTask = (task, timeout, shouldCancel = () => false) => {
    setTimeout(() => {
        if (shouldCancel()) {
            return;
        }
        task();
    }, timeout);
};


/***/ }),

/***/ "./src/spa-dummy-data.tsx":
/*!********************************!*\
  !*** ./src/spa-dummy-data.tsx ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rahisi_1 = __webpack_require__(/*! rahisi */ "./node_modules/rahisi/dist/forTyping.js");
const rahisi_2 = __webpack_require__(/*! rahisi */ "./node_modules/rahisi/dist/forTyping.js");
const rahisi_3 = __webpack_require__(/*! rahisi */ "./node_modules/rahisi/dist/forTyping.js");
const rahisi_type_utils_1 = __webpack_require__(/*! rahisi-type-utils */ "./node_modules/rahisi-type-utils/dist/types.js");
const async_helpers_1 = __webpack_require__(/*! ./async-helpers */ "./src/async-helpers.ts");
exports.main = () => {
    const users = new rahisi_3.VersionedList();
    const messages = new rahisi_3.VersionedList();
    const anonUser = { name: "'Please sign-in'" };
    let currentUser = anonUser;
    let chatee = anonUser;
    let isLogonPending = false;
    let isChatOpen = false;
    const isLoggedOn = () => currentUser !== anonUser;
    const simulateDataFeed = () => {
        const shouldCancel = () => !isLoggedOn();
        async_helpers_1.runTask(() => users.add({ name: "Betty" }), 1000, shouldCancel);
        async_helpers_1.runTask(() => users.add({ name: "Mike" }), 2000, shouldCancel);
        async_helpers_1.runTask(() => users.add({ name: "Pebbles" }), 3000, shouldCancel);
        async_helpers_1.runTask(() => users.add({ name: "Wilma" }), 4000, shouldCancel);
        async_helpers_1.runTask(() => {
            const sender = users.getItem(3);
            const simulatedReceipt = {
                kind: "from",
                from: sender,
                content: `Hi there ${currentUser.name}!  ${sender.name} here.`,
            };
            if (chatee !== sender) {
                chatee = sender;
                const simulatedStart = {
                    kind: "started",
                    with: sender,
                };
                messages.add(simulatedStart);
            }
            messages.add(simulatedReceipt);
        }, 5000, shouldCancel);
    };
    const logoff = () => {
        currentUser = anonUser;
        chatee = anonUser;
        messages.clear();
        users.clear();
        isChatOpen = false;
    };
    const logon = (userName) => __awaiter(this, void 0, void 0, function* () {
        isLogonPending = true;
        yield async_helpers_1.delay(1500, 0);
        isLogonPending = false;
        currentUser = { name: userName };
        isChatOpen = true;
    });
    const processUser = () => __awaiter(this, void 0, void 0, function* () {
        if (isLoggedOn()) {
            logoff();
            return;
        }
        const userName = prompt("Please sign-in");
        if (!rahisi_type_utils_1.notNullOrWhiteSpace(userName)) {
            return;
        }
        yield logon(userName);
        simulateDataFeed();
    });
    let sendingMessage = false;
    let messageContent = "";
    const submitMessage = () => __awaiter(this, void 0, void 0, function* () {
        if (!rahisi_type_utils_1.notNullOrWhiteSpace(messageContent) || !isLoggedOn() || chatee === anonUser) {
            return;
        }
        const message = {
            kind: "to",
            to: chatee,
            content: messageContent,
        };
        messages.add(message);
        messageContent = "";
        sendingMessage = true;
        yield async_helpers_1.delay(250, 0);
        sendingMessage = false;
        const responseFrom = chatee;
        async_helpers_1.runTask(() => {
            const simulatedResponse = {
                kind: "from",
                from: responseFrom,
                content: `Thanks for the note, ${currentUser.name}`,
            };
            messages.add(simulatedResponse);
        }, 1500, () => !isLoggedOn());
    });
    const submitOnEnter = (e) => __awaiter(this, void 0, void 0, function* () {
        messageContent = rahisi_1.textVal(e);
        if (e.keyCode !== rahisi_type_utils_1.ENTER_KEY) {
            return;
        }
        yield submitMessage();
    });
    const placeholderTemplate = rahisi_1.React.createElement("div", { className: "spa-chat-list-note" },
        "\"To chat alone is the fate of all great souls...\"",
        rahisi_1.React.createElement("br", null),
        rahisi_1.React.createElement("br", null),
        "\"No one is online\"");
    const startChat = (user) => {
        chatee = user;
        const message = {
            kind: "started",
            with: user,
        };
        messages.add(message);
    };
    const selectedClass = "spa-x-select";
    const userTemplate = (user) => rahisi_1.React.createElement("div", { className: () => "spa-chat-list-name " + (chatee === user ? selectedClass : ""), onClick: () => startChat(user) }, user.name);
    const messageTemplate = (m) => {
        const [style, content] = (() => {
            switch (m.kind) {
                case "from":
                    return ["spa-chat-msg-log-msg", `${m.from.name}: ${m.content}`];
                case "to":
                    return ["spa-chat-msg-log-me", `${currentUser.name}: ${m.content}`];
                case "started":
                    return ["spa-chat-msg-log-alert", `Now chatting with ${m.with.name}`];
            }
        })();
        const onmounted = (e) => rahisi_2.doScroll(e.currentTarget, e.currentTarget.parentElement);
        return rahisi_1.React.createElement("div", { className: style, onMounted: onmounted }, content);
    };
    const animateOpen = "spa-chat spa-chat-animate-open";
    const animateClose = "spa-chat spa-chat-animate-close";
    const isChatActive = () => isLoggedOn() && isChatOpen;
    const chatContainer = rahisi_1.React.createElement("div", { className: () => isChatActive() ? animateOpen : animateClose },
        rahisi_1.React.createElement("div", { className: "spa-chat-head" },
            rahisi_1.React.createElement("div", { className: "spa-chat-head-toggle", title: () => isChatOpen ? "Tap to close" : "Tap to open", onClick: () => isChatOpen = !isChatOpen }, () => isChatOpen ? "=" : "+"),
            rahisi_1.React.createElement("div", { className: "spa-chat-head-title" }, () => "Chat " + (chatee === anonUser ? "" : chatee.name)),
            rahisi_1.React.createElement("div", { className: "spa-chat-closer", onClick: () => isLoggedOn() && logoff() }, "x")),
        rahisi_1.React.createElement("div", { className: () => isChatActive() ? "spa-chat-sizer" : "hidden" },
            rahisi_1.React.createElement("div", { className: "spa-chat-list" },
                rahisi_1.React.createElement("div", { className: "spa-chat-list-box" },
                    rahisi_1.React.createElement(rahisi_3.Template, { source: users, template: userTemplate, placeholder: placeholderTemplate }))),
            rahisi_1.React.createElement("div", { className: "spa-chat-msg" },
                rahisi_1.React.createElement("div", { className: "spa-chat-msg-log" },
                    rahisi_1.React.createElement(rahisi_3.Template, { source: messages, template: messageTemplate })),
                rahisi_1.React.createElement("div", { className: "spa-chat-msg-in" },
                    rahisi_1.React.createElement(rahisi_2.TextBox, { disabled: () => chatee === anonUser, onKeyUp: (s) => submitOnEnter(s), value: () => messageContent, focus: () => true }),
                    rahisi_1.React.createElement("div", { className: () => "spa-chat-msg-send " + (sendingMessage ? selectedClass : ""), onClick: submitMessage }, "send")))));
    const mainContainer = rahisi_1.React.createElement("div", { className: "spa" },
        rahisi_1.React.createElement("div", { className: "spa-shell-head" },
            rahisi_1.React.createElement("div", { className: "spa-shell-head-logo" },
                rahisi_1.React.createElement("h1", null, "SPA"),
                rahisi_1.React.createElement("p", null, "typescript end to end")),
            rahisi_1.React.createElement("div", { className: "spa-shell-head-acct", onClick: processUser }, () => isLogonPending ? "... processing ..." : currentUser.name)),
        rahisi_1.React.createElement("div", { className: "spa-shell-main" },
            rahisi_1.React.createElement("div", { className: "spa-shell-main-nav" }, " "),
            rahisi_1.React.createElement("div", { className: "spa-shell-main-content" })),
        rahisi_1.React.createElement("div", { className: "spa-shell-foot" }));
    mainContainer.mount(document.body);
    chatContainer.mount(document.body);
};
document.addEventListener("DOMContentLoaded", exports.main, false);


/***/ })

/******/ });