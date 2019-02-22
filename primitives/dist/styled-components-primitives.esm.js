import Stylis from 'stylis/stylis.min';
import _insertRulePlugin from 'stylis-rule-sheet';
import React, { cloneElement, createContext, Component, createElement } from 'react';
import unitless from '@emotion/unitless';
import { isElement, ForwardRef, isValidElementType } from 'react-is';
import supportsColor from 'supports-color';
import transformDeclPairs from 'css-to-react-native';
import memoize from 'memoize-one';
import reactPrimitives from 'react-primitives';

// 
// Source: https://github.com/garycourt/murmurhash-js/blob/master/murmurhash2_gc.js
function murmurhash(c) {
  for (var e = c.length | 0, a = e | 0, d = 0, b; e >= 4;) {
    b = c.charCodeAt(d) & 255 | (c.charCodeAt(++d) & 255) << 8 | (c.charCodeAt(++d) & 255) << 16 | (c.charCodeAt(++d) & 255) << 24, b = 1540483477 * (b & 65535) + ((1540483477 * (b >>> 16) & 65535) << 16), b ^= b >>> 24, b = 1540483477 * (b & 65535) + ((1540483477 * (b >>> 16) & 65535) << 16), a = 1540483477 * (a & 65535) + ((1540483477 * (a >>> 16) & 65535) << 16) ^ b, e -= 4, ++d;
  }
  switch (e) {
    case 3:
      a ^= (c.charCodeAt(d + 2) & 255) << 16;
    case 2:
      a ^= (c.charCodeAt(d + 1) & 255) << 8;
    case 1:
      a ^= c.charCodeAt(d) & 255, a = 1540483477 * (a & 65535) + ((1540483477 * (a >>> 16) & 65535) << 16);
  }
  a ^= a >>> 13;
  a = 1540483477 * (a & 65535) + ((1540483477 * (a >>> 16) & 65535) << 16);
  return (a ^ a >>> 15) >>> 0;
}

// 

function getComponentName(target) {
  return (process.env.NODE_ENV !== 'production' ? typeof target === 'string' && target : false) || target.displayName || target.name || 'Component';
}

// 
function isFunction(test) {
  return typeof test === 'function';
}

const _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

const classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

const createClass = function () {
  function defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
      const descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

const _extends = Object.assign || function (target) {
  for (let i = 1; i < arguments.length; i++) {
    const source = arguments[i];

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

const inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(`Super expression must either be null or a function, not ${  typeof superClass}`);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

const objectWithoutProperties = function (obj, keys) {
  const target = {};

  for (const i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

const possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

// 
const isPlainObject = (function (x) {
  return (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x.constructor === Object;
});

// 
function isStyledComponent(target) {
  return target && typeof target.styledComponentId === 'string';
}

// 

const SC_ATTR = typeof process !== 'undefined' && process.env.SC_ATTR || 'data-styled';

const SC_VERSION_ATTR = 'data-styled-version';

const SC_STREAM_ATTR = 'data-styled-streamed';

const IS_BROWSER = typeof window !== 'undefined' && 'HTMLElement' in window;

const DISABLE_SPEEDY = typeof SC_DISABLE_SPEEDY === 'boolean' && SC_DISABLE_SPEEDY || process.env.NODE_ENV !== 'production';

// 


/**
 * Parse errors.md and turn it into a simple hash of code: message
 */
const ERRORS = process.env.NODE_ENV !== 'production' ? {
  "1": "Cannot create styled-component for component: %s.\n\n",
  "2": "Can't collect styles once you've consumed a `ServerStyleSheet`'s styles! `ServerStyleSheet` is a one off instance for each server-side render cycle.\n\n- Are you trying to reuse it across renders?\n- Are you accidentally calling collectStyles twice?\n\n",
  "3": "Streaming SSR is only supported in a Node.js environment; Please do not try to call this method in the browser.\n\n",
  "4": "The `StyleSheetManager` expects a valid target or sheet prop!\n\n- Does this error occur on the client and is your target falsy?\n- Does this error occur on the server and is the sheet falsy?\n\n",
  "5": "The clone method cannot be used on the client!\n\n- Are you running in a client-like environment on the server?\n- Are you trying to run SSR on the client?\n\n",
  "6": "Trying to insert a new style tag, but the given Node is unmounted!\n\n- Are you using a custom target that isn't mounted?\n- Does your document not have a valid head element?\n- Have you accidentally removed a style tag manually?\n\n",
  "7": "ThemeProvider: Please return an object from your \"theme\" prop function, e.g.\n\n```js\ntheme={() => ({})}\n```\n\n",
  "8": "ThemeProvider: Please make your \"theme\" prop an object.\n\n",
  "9": "Missing document `<head>`\n\n",
  "10": "Cannot find a StyleSheet instance. Usually this happens if there are multiple copies of styled-components loaded at once. Check out this issue for how to troubleshoot and fix the common cases where this situation can happen: https://github.com/styled-components/styled-components/issues/1941#issuecomment-417862021\n\n",
  "11": "_This error was replaced with a dev-time warning, it will be deleted for v4 final._ [createGlobalStyle] received children which will not be rendered. Please use the component without passing children elements.\n\n",
  "12": "It seems you are interpolating a keyframe declaration (%s) into an untagged string. This was supported in styled-components v3, but is not longer supported in v4 as keyframes are now injected on-demand. Please wrap your string in the css\\`\\` helper (see https://www.styled-components.com/docs/api#css), which ensures the styles are injected correctly.\n\n",
  "13": "%s is not a styled component and cannot be referred to via component selector. See https://www.styled-components.com/docs/advanced#referring-to-other-components for more details.\n"
} : {};

/**
 * super basic version of sprintf
 */
function format() {
  let a = arguments.length <= 0 ? undefined : arguments[0];
  const b = [];

  for (let c = 1, len = arguments.length; c < len; c += 1) {
    b.push(arguments.length <= c ? undefined : arguments[c]);
  }

  b.forEach((d) => {
    a = a.replace(/%[a-z]/, d);
  });

  return a;
}

/**
 * Create an error file out of errors.md for development and a simple web link to the full errors
 * in production mode.
 */

const StyledComponentsError = function (_Error) {
  inherits(StyledComponentsError, _Error);

  function StyledComponentsError(code) {
    classCallCheck(this, StyledComponentsError);

    for (var _len = arguments.length, interpolations = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      interpolations[_key - 1] = arguments[_key];
    }

    if (process.env.NODE_ENV === 'production') {
      var _this = possibleConstructorReturn(this, _Error.call(this, `An error occurred. See https://github.com/styled-components/styled-components/blob/master/src/utils/errors.md#${  code  } for more information. ${  interpolations ? `Additional arguments: ${  interpolations.join(', ')}` : ''}`));
    } else {
      var _this = possibleConstructorReturn(this, _Error.call(this, format.apply(undefined, [ERRORS[code]].concat(interpolations)).trim()));
    }
    return possibleConstructorReturn(_this);
  }

  return StyledComponentsError;
}(Error);

// 
const SC_COMPONENT_ID = /^[^\S\n]*?\/\* sc-component-id:\s*(\S+)\s+\*\//gm;

const extractComps = (function (maybeCSS) {
  const css = `${  maybeCSS || ''}`; // Definitely a string, and a clone
  const existingComponents = [];
  css.replace(SC_COMPONENT_ID, (match, componentId, matchIndex) => {
    existingComponents.push({ componentId, matchIndex });
    return match;
  });
  return existingComponents.map((_ref, i) => {
    const {componentId} = _ref;
        const {matchIndex} = _ref;

    const nextComp = existingComponents[i + 1];
    const cssFromDOM = nextComp ? css.slice(matchIndex, nextComp.matchIndex) : css.slice(matchIndex);
    return { componentId, cssFromDOM };
  });
});

// 

// NOTE: This stylis instance is only used to split rules from SSR'd style tags
const stylisSplitter = new Stylis({
  global: false,
  cascade: true,
  keyframe: false,
  prefix: false,
  compress: false,
  semicolon: true
});

const stylis = new Stylis({
  global: false,
  cascade: true,
  keyframe: false,
  prefix: true,
  compress: false,
  semicolon: false // NOTE: This means "autocomplete missing semicolons"
});

// Wrap `insertRulePlugin to build a list of rules,
// and then make our own plugin to return the rules. This
// makes it easier to hook into the existing SSR architecture

let parsingRules = [];

// eslint-disable-next-line consistent-return
const returnRulesPlugin = function returnRulesPlugin(context) {
  if (context === -2) {
    const parsedRules = parsingRules;
    parsingRules = [];
    return parsedRules;
  }
};

const parseRulesPlugin = _insertRulePlugin((rule) => {
  parsingRules.push(rule);
});

const _componentId = void 0;
const _selector = void 0;
const _selectorRegexp = void 0;

const selfReferenceReplacer = function selfReferenceReplacer(match, offset, string) {
  if (
  // the first self-ref is always untouched
  offset > 0 &&
  // there should be at least two self-refs to do a replacement (.b > .b)
  string.slice(0, offset).indexOf(_selector) !== -1 &&
  // no consecutive self refs (.b.b); that is a precedence boost and treated differently
  string.slice(offset - _selector.length, offset) !== _selector) {
    return `.${  _componentId}`;
  }

  return match;
};

/**
 * When writing a style like
 *
 * & + & {
 *   color: red;
 * }
 *
 * The second ampersand should be a reference to the static component class. stylis
 * has no knowledge of static class so we have to intelligently replace the base selector.
 */
const selfReferenceReplacementPlugin = function selfReferenceReplacementPlugin(context, _, selectors) {
  if (context === 2 && selectors.length && selectors[0].lastIndexOf(_selector) > 0) {
    // eslint-disable-next-line no-param-reassign
    selectors[0] = selectors[0].replace(_selectorRegexp, selfReferenceReplacer);
  }
};

stylis.use([selfReferenceReplacementPlugin, parseRulesPlugin, returnRulesPlugin]);
stylisSplitter.use([parseRulesPlugin, returnRulesPlugin]);

const splitByRules = function splitByRules(css) {
  return stylisSplitter('', css);
};

// 
/* eslint-disable camelcase, no-undef */

const getNonce = (function () {
  return typeof __webpack_nonce__ !== 'undefined' ? __webpack_nonce__ : null;
});

// 
/* These are helpers for the StyleTags to keep track of the injected
 * rule names for each (component) ID that they're keeping track of.
 * They're crucial for detecting whether a name has already been
 * injected.
 * (This excludes rehydrated names) */

/* adds a new ID:name pairing to a names dictionary */
const addNameForId = function addNameForId(names, id, name) {
  if (name) {
    // eslint-disable-next-line no-param-reassign
    const namesForId = names[id] || (names[id] = Object.create(null));
    namesForId[name] = true;
  }
};

/* resets an ID entirely by overwriting it in the dictionary */
const resetIdNames = function resetIdNames(names, id) {
  // eslint-disable-next-line no-param-reassign
  names[id] = Object.create(null);
};

/* factory for a names dictionary checking the existance of an ID:name pairing */
const hasNameForId = function hasNameForId(names) {
  return function (id, name) {
    return names[id] !== undefined && names[id][name];
  };
};

/* stringifies names for the html/element output */
const stringifyNames = function stringifyNames(names) {
  let str = '';
  // eslint-disable-next-line guard-for-in
  for (const id in names) {
    str += `${Object.keys(names[id]).join(' ')  } `;
  }
  return str.trim();
};

/* clones the nested names dictionary */
const cloneNames = function cloneNames(names) {
  const clone = Object.create(null);
  // eslint-disable-next-line guard-for-in
  for (const id in names) {
    clone[id] = _extends({}, names[id]);
  }
  return clone;
};

// 

/* These are helpers that deal with the insertRule (aka speedy) API
 * They are used in the StyleTags and specifically the speedy tag
 */

/* retrieve a sheet for a given style tag */
const sheetForTag = function sheetForTag(tag) {
  // $FlowFixMe
  if (tag.sheet) return tag.sheet;

  /* Firefox quirk requires us to step through all stylesheets to find one owned by the given tag */
  const size = document.styleSheets.length;
  for (let i = 0; i < size; i += 1) {
    const sheet = document.styleSheets[i];
    // $FlowFixMe
    if (sheet.ownerNode === tag) return sheet;
  }

  /* we should always be able to find a tag */
  throw new StyledComponentsError(10);
};

/* insert a rule safely and return whether it was actually injected */
const safeInsertRule = function safeInsertRule(sheet, cssRule, index) {
  /* abort early if cssRule string is falsy */
  if (!cssRule) return false;

  const maxIndex = sheet.cssRules.length;

  try {
    /* use insertRule and cap passed index with maxIndex (no of cssRules) */
    sheet.insertRule(cssRule, index <= maxIndex ? index : maxIndex);
  } catch (err) {
    /* any error indicates an invalid rule */
    return false;
  }

  return true;
};

/* deletes `size` rules starting from `removalIndex` */
const deleteRules = function deleteRules(sheet, removalIndex, size) {
  const lowerBound = removalIndex - size;
  for (let i = removalIndex; i > lowerBound; i -= 1) {
    sheet.deleteRule(i);
  }
};

// 

/* this marker separates component styles and is important for rehydration */
const makeTextMarker = function makeTextMarker(id) {
  return `\n/* sc-component-id: ${  id  } */\n`;
};

/* add up all numbers in array up until and including the index */
const addUpUntilIndex = function addUpUntilIndex(sizes, index) {
  let totalUpToIndex = 0;
  for (let i = 0; i <= index; i += 1) {
    totalUpToIndex += sizes[i];
  }

  return totalUpToIndex;
};

/* create a new style tag after lastEl */
const makeStyleTag = function makeStyleTag(target, tagEl, insertBefore) {
  const el = document.createElement('style');
  el.setAttribute(SC_ATTR, '');
  el.setAttribute(SC_VERSION_ATTR, "4.1.2");

  const nonce = getNonce();
  if (nonce) {
    el.setAttribute('nonce', nonce);
  }

  /* Work around insertRule quirk in EdgeHTML */
  el.appendChild(document.createTextNode(''));

  if (target && !tagEl) {
    /* Append to target when no previous element was passed */
    target.appendChild(el);
  } else {
    if (!tagEl || !target || !tagEl.parentNode) {
      throw new StyledComponentsError(6);
    }

    /* Insert new style tag after the previous one */
    tagEl.parentNode.insertBefore(el, insertBefore ? tagEl : tagEl.nextSibling);
  }

  return el;
};

/* takes a css factory function and outputs an html styled tag factory */
const wrapAsHtmlTag = function wrapAsHtmlTag(css, names) {
  return function (additionalAttrs) {
    const nonce = getNonce();
    const attrs = [nonce && `nonce="${  nonce  }"`, `${SC_ATTR  }="${  stringifyNames(names)  }"`, `${SC_VERSION_ATTR  }="` + `4.1.2` + `"`, additionalAttrs];

    const htmlAttr = attrs.filter(Boolean).join(' ');
    return `<style ${  htmlAttr  }>${  css()  }</style>`;
  };
};

/* takes a css factory function and outputs an element factory */
const wrapAsElement = function wrapAsElement(css, names) {
  return function () {
    let _props;

    const props = (_props = {}, _props[SC_ATTR] = stringifyNames(names), _props[SC_VERSION_ATTR] = "4.1.2", _props);

    const nonce = getNonce();
    if (nonce) {
      // $FlowFixMe
      props.nonce = nonce;
    }

    // eslint-disable-next-line react/no-danger
    return React.createElement('style', _extends({}, props, { dangerouslySetInnerHTML: { __html: css() } }));
  };
};

const getIdsFromMarkersFactory = function getIdsFromMarkersFactory(markers) {
  return function () {
    return Object.keys(markers);
  };
};

/* speedy tags utilise insertRule */
const makeSpeedyTag = function makeSpeedyTag(el, getImportRuleTag) {
  const names = Object.create(null);
  const markers = Object.create(null);
  const sizes = [];

  const extractImport = getImportRuleTag !== undefined;
  /* indicates whether getImportRuleTag was called */
  let usedImportRuleTag = false;

  const insertMarker = function insertMarker(id) {
    const prev = markers[id];
    if (prev !== undefined) {
      return prev;
    }

    markers[id] = sizes.length;
    sizes.push(0);
    resetIdNames(names, id);

    return markers[id];
  };

  const insertRules = function insertRules(id, cssRules, name) {
    const marker = insertMarker(id);
    const sheet = sheetForTag(el);
    const insertIndex = addUpUntilIndex(sizes, marker);

    let injectedRules = 0;
    const importRules = [];
    const cssRulesSize = cssRules.length;

    for (let i = 0; i < cssRulesSize; i += 1) {
      const cssRule = cssRules[i];
      let mayHaveImport = extractImport; /* @import rules are reordered to appear first */
      if (mayHaveImport && cssRule.indexOf('@import') !== -1) {
        importRules.push(cssRule);
      } else if (safeInsertRule(sheet, cssRule, insertIndex + injectedRules)) {
        mayHaveImport = false;
        injectedRules += 1;
      }
    }

    if (extractImport && importRules.length > 0) {
      usedImportRuleTag = true;
      // $FlowFixMe
      getImportRuleTag().insertRules(`${id  }-import`, importRules);
    }

    sizes[marker] += injectedRules; /* add up no of injected rules */
    addNameForId(names, id, name);
  };

  const removeRules = function removeRules(id) {
    const marker = markers[id];
    if (marker === undefined) return;

    const size = sizes[marker];
    const sheet = sheetForTag(el);
    const removalIndex = addUpUntilIndex(sizes, marker) - 1;
    deleteRules(sheet, removalIndex, size);
    sizes[marker] = 0;
    resetIdNames(names, id);

    if (extractImport && usedImportRuleTag) {
      // $FlowFixMe
      getImportRuleTag().removeRules(`${id  }-import`);
    }
  };

  const css = function css() {
    const _sheetForTag = sheetForTag(el);
        const {cssRules} = _sheetForTag;

    let str = '';

    // eslint-disable-next-line guard-for-in
    for (const id in markers) {
      str += makeTextMarker(id);
      const marker = markers[id];
      const end = addUpUntilIndex(sizes, marker);
      const size = sizes[marker];
      for (let i = end - size; i < end; i += 1) {
        const rule = cssRules[i];
        if (rule !== undefined) {
          str += rule.cssText;
        }
      }
    }

    return str;
  };

  return {
    clone: function clone() {
      throw new StyledComponentsError(5);
    },

    css,
    getIds: getIdsFromMarkersFactory(markers),
    hasNameForId: hasNameForId(names),
    insertMarker,
    insertRules,
    removeRules,
    sealed: false,
    styleTag: el,
    toElement: wrapAsElement(css, names),
    toHTML: wrapAsHtmlTag(css, names)
  };
};

const makeTextNode = function makeTextNode(id) {
  return document.createTextNode(makeTextMarker(id));
};

const makeBrowserTag = function makeBrowserTag(el, getImportRuleTag) {
  const names = Object.create(null);
  const markers = Object.create(null);

  const extractImport = getImportRuleTag !== undefined;

  /* indicates whether getImportRuleTag was called */
  let usedImportRuleTag = false;

  const insertMarker = function insertMarker(id) {
    const prev = markers[id];
    if (prev !== undefined) {
      return prev;
    }

    markers[id] = makeTextNode(id);
    el.appendChild(markers[id]);
    names[id] = Object.create(null);

    return markers[id];
  };

  const insertRules = function insertRules(id, cssRules, name) {
    const marker = insertMarker(id);
    const importRules = [];
    const cssRulesSize = cssRules.length;

    for (let i = 0; i < cssRulesSize; i += 1) {
      const rule = cssRules[i];
      let mayHaveImport = extractImport;
      if (mayHaveImport && rule.indexOf('@import') !== -1) {
        importRules.push(rule);
      } else {
        mayHaveImport = false;
        const separator = i === cssRulesSize - 1 ? '' : ' ';
        marker.appendData(`${  rule  }${separator}`);
      }
    }

    addNameForId(names, id, name);

    if (extractImport && importRules.length > 0) {
      usedImportRuleTag = true;
      // $FlowFixMe
      getImportRuleTag().insertRules(`${id  }-import`, importRules);
    }
  };

  const removeRules = function removeRules(id) {
    const marker = markers[id];
    if (marker === undefined) return;

    /* create new empty text node and replace the current one */
    const newMarker = makeTextNode(id);
    el.replaceChild(newMarker, marker);
    markers[id] = newMarker;
    resetIdNames(names, id);

    if (extractImport && usedImportRuleTag) {
      // $FlowFixMe
      getImportRuleTag().removeRules(`${id  }-import`);
    }
  };

  const css = function css() {
    let str = '';

    // eslint-disable-next-line guard-for-in
    for (const id in markers) {
      str += markers[id].data;
    }

    return str;
  };

  return {
    clone: function clone() {
      throw new StyledComponentsError(5);
    },

    css,
    getIds: getIdsFromMarkersFactory(markers),
    hasNameForId: hasNameForId(names),
    insertMarker,
    insertRules,
    removeRules,
    sealed: false,
    styleTag: el,
    toElement: wrapAsElement(css, names),
    toHTML: wrapAsHtmlTag(css, names)
  };
};

const makeServerTag = function makeServerTag(namesArg, markersArg) {
  const names = namesArg === undefined ? Object.create(null) : namesArg;
  const markers = markersArg === undefined ? Object.create(null) : markersArg;

  const insertMarker = function insertMarker(id) {
    const prev = markers[id];
    if (prev !== undefined) {
      return prev;
    }

    return markers[id] = [''];
  };

  const insertRules = function insertRules(id, cssRules, name) {
    const marker = insertMarker(id);
    marker[0] += cssRules.join(' ');
    addNameForId(names, id, name);
  };

  const removeRules = function removeRules(id) {
    const marker = markers[id];
    if (marker === undefined) return;
    marker[0] = '';
    resetIdNames(names, id);
  };

  const css = function css() {
    let str = '';
    // eslint-disable-next-line guard-for-in
    for (const id in markers) {
      const cssForId = markers[id][0];
      if (cssForId) {
        str += makeTextMarker(id) + cssForId;
      }
    }
    return str;
  };

  const clone = function clone() {
    const namesClone = cloneNames(names);
    const markersClone = Object.create(null);

    // eslint-disable-next-line guard-for-in
    for (const id in markers) {
      markersClone[id] = [markers[id][0]];
    }

    return makeServerTag(namesClone, markersClone);
  };

  const tag = {
    clone,
    css,
    getIds: getIdsFromMarkersFactory(markers),
    hasNameForId: hasNameForId(names),
    insertMarker,
    insertRules,
    removeRules,
    sealed: false,
    styleTag: null,
    toElement: wrapAsElement(css, names),
    toHTML: wrapAsHtmlTag(css, names)
  };

  return tag;
};

const makeTag = function makeTag(target, tagEl, forceServer, insertBefore, getImportRuleTag) {
  if (IS_BROWSER && !forceServer) {
    const el = makeStyleTag(target, tagEl, insertBefore);

    if (DISABLE_SPEEDY) {
      return makeBrowserTag(el, getImportRuleTag);
    } else {
      return makeSpeedyTag(el, getImportRuleTag);
    }
  }

  return makeServerTag();
};

const rehydrate = function rehydrate(tag, els, extracted) {
  /* add all extracted components to the new tag */
  for (let i = 0, len = extracted.length; i < len; i += 1) {
    const _extracted$i = extracted[i];
        const {componentId} = _extracted$i;
        const {cssFromDOM} = _extracted$i;

    const cssRules = splitByRules(cssFromDOM);
    tag.insertRules(componentId, cssRules);
  }

  /* remove old HTMLStyleElements, since they have been rehydrated */
  for (let _i = 0, _len = els.length; _i < _len; _i += 1) {
    const el = els[_i];
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }
};

// 

const SPLIT_REGEX = /\s+/;

/* determine the maximum number of components before tags are sharded */
let MAX_SIZE = void 0;
if (IS_BROWSER) {
  /* in speedy mode we can keep a lot more rules in a sheet before a slowdown can be expected */
  MAX_SIZE = DISABLE_SPEEDY ? 40 : 1000;
} else {
  /* for servers we do not need to shard at all */
  MAX_SIZE = -1;
}

let sheetRunningId = 0;
let master = void 0;

const StyleSheet = function () {

  /* a map from ids to tags */

  /* deferred rules for a given id */

  /* this is used for not reinjecting rules via hasNameForId() */

  /* when rules for an id are removed using remove() we have to ignore rehydratedNames for it */

  /* a list of tags belonging to this StyleSheet */

  /* a tag for import rules */

  /* current capacity until a new tag must be created */

  /* children (aka clones) of this StyleSheet inheriting all and future injections */

  function StyleSheet() {
    const _this = this;

    const target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : IS_BROWSER ? document.head : null;
    const forceServer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    classCallCheck(this, StyleSheet);

    this.getImportRuleTag = function () {
      const {importRuleTag} = _this;

      if (importRuleTag !== undefined) {
        return importRuleTag;
      }

      const firstTag = _this.tags[0];
      const insertBefore = true;

      return _this.importRuleTag = makeTag(_this.target, firstTag ? firstTag.styleTag : null, _this.forceServer, insertBefore);
    };

    sheetRunningId += 1;
    this.id = sheetRunningId;
    this.forceServer = forceServer;
    this.target = forceServer ? null : target;
    this.tagMap = {};
    this.deferred = {};
    this.rehydratedNames = {};
    this.ignoreRehydratedNames = {};
    this.tags = [];
    this.capacity = 1;
    this.clones = [];
  }

  /* rehydrate all SSR'd style tags */


  StyleSheet.prototype.rehydrate = function rehydrate$$1() {
    if (!IS_BROWSER || this.forceServer) return this;

    const els = [];
    const extracted = [];
    let isStreamed = false;

    /* retrieve all of our SSR style elements from the DOM */
    const nodes = document.querySelectorAll(`style[${  SC_ATTR  }][${  SC_VERSION_ATTR  }="` + `4.1.2` + `"]`);

    const nodesSize = nodes.length;

    /* abort rehydration if no previous style tags were found */
    if (!nodesSize) return this;

    for (let i = 0; i < nodesSize; i += 1) {
      const el = nodes[i];

      /* check if style tag is a streamed tag */
      if (!isStreamed) isStreamed = !!el.getAttribute(SC_STREAM_ATTR);

      /* retrieve all component names */
      const elNames = (el.getAttribute(SC_ATTR) || '').trim().split(SPLIT_REGEX);
      const elNamesSize = elNames.length;
      for (var j = 0, name; j < elNamesSize; j += 1) {
        name = elNames[j];
        /* add rehydrated name to sheet to avoid re-adding styles */
        this.rehydratedNames[name] = true;
      }

      /* extract all components and their CSS */
      extracted.push.apply(extracted, extractComps(el.textContent));

      /* store original HTMLStyleElement */
      els.push(el);
    }

    /* abort rehydration if nothing was extracted */
    const extractedSize = extracted.length;
    if (!extractedSize) return this;

    /* create a tag to be used for rehydration */
    const tag = this.makeTag(null);

    rehydrate(tag, els, extracted);

    /* reset capacity and adjust MAX_SIZE by the initial size of the rehydration */
    this.capacity = Math.max(1, MAX_SIZE - extractedSize);
    this.tags.push(tag);

    /* retrieve all component ids */
    for (let _j = 0; _j < extractedSize; _j += 1) {
      this.tagMap[extracted[_j].componentId] = tag;
    }

    return this;
  };

  /* retrieve a "master" instance of StyleSheet which is typically used when no other is available
   * The master StyleSheet is targeted by createGlobalStyle, keyframes, and components outside of any
    * StyleSheetManager's context */


  /* reset the internal "master" instance */
  StyleSheet.reset = function reset() {
    const forceServer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    master = new StyleSheet(undefined, forceServer).rehydrate();
  };

  /* adds "children" to the StyleSheet that inherit all of the parents' rules
   * while their own rules do not affect the parent */


  StyleSheet.prototype.clone = function clone() {
    const sheet = new StyleSheet(this.target, this.forceServer);

    /* add to clone array */
    this.clones.push(sheet);

    /* clone all tags */
    sheet.tags = this.tags.map((tag) => {
      const ids = tag.getIds();
      const newTag = tag.clone();

      /* reconstruct tagMap */
      for (let i = 0; i < ids.length; i += 1) {
        sheet.tagMap[ids[i]] = newTag;
      }

      return newTag;
    });

    /* clone other maps */
    sheet.rehydratedNames = _extends({}, this.rehydratedNames);
    sheet.deferred = _extends({}, this.deferred);

    return sheet;
  };

  /* force StyleSheet to create a new tag on the next injection */


  StyleSheet.prototype.sealAllTags = function sealAllTags() {
    this.capacity = 1;

    this.tags.forEach((tag) => {
      // eslint-disable-next-line no-param-reassign
      tag.sealed = true;
    });
  };

  StyleSheet.prototype.makeTag = function makeTag$$1(tag) {
    const lastEl = tag ? tag.styleTag : null;
    const insertBefore = false;

    return makeTag(this.target, lastEl, this.forceServer, insertBefore, this.getImportRuleTag);
  };

  /* get a tag for a given componentId, assign the componentId to one, or shard */
  StyleSheet.prototype.getTagForId = function getTagForId(id) {
    /* simply return a tag, when the componentId was already assigned one */
    const prev = this.tagMap[id];
    if (prev !== undefined && !prev.sealed) {
      return prev;
    }

    let tag = this.tags[this.tags.length - 1];

    /* shard (create a new tag) if the tag is exhausted (See MAX_SIZE) */
    this.capacity -= 1;

    if (this.capacity === 0) {
      this.capacity = MAX_SIZE;
      tag = this.makeTag(tag);
      this.tags.push(tag);
    }

    return this.tagMap[id] = tag;
  };

  /* mainly for createGlobalStyle to check for its id */


  StyleSheet.prototype.hasId = function hasId(id) {
    return this.tagMap[id] !== undefined;
  };

  /* caching layer checking id+name to already have a corresponding tag and injected rules */


  StyleSheet.prototype.hasNameForId = function hasNameForId(id, name) {
    /* exception for rehydrated names which are checked separately */
    if (this.ignoreRehydratedNames[id] === undefined && this.rehydratedNames[name]) {
      return true;
    }

    const tag = this.tagMap[id];
    return tag !== undefined && tag.hasNameForId(id, name);
  };

  /* registers a componentId and registers it on its tag */


  StyleSheet.prototype.deferredInject = function deferredInject(id, cssRules) {
    /* don't inject when the id is already registered */
    if (this.tagMap[id] !== undefined) return;

    const {clones} = this;

    for (let i = 0; i < clones.length; i += 1) {
      clones[i].deferredInject(id, cssRules);
    }

    this.getTagForId(id).insertMarker(id);
    this.deferred[id] = cssRules;
  };

  /* injects rules for a given id with a name that will need to be cached */


  StyleSheet.prototype.inject = function inject(id, cssRules, name) {
    const {clones} = this;


    for (let i = 0; i < clones.length; i += 1) {
      clones[i].inject(id, cssRules, name);
    }

    const tag = this.getTagForId(id);

    /* add deferred rules for component */
    if (this.deferred[id] !== undefined) {
      // Combine passed cssRules with previously deferred CSS rules
      // NOTE: We cannot mutate the deferred array itself as all clones
      // do the same (see clones[i].inject)
      const rules = this.deferred[id].concat(cssRules);
      tag.insertRules(id, rules, name);

      this.deferred[id] = undefined;
    } else {
      tag.insertRules(id, cssRules, name);
    }
  };

  /* removes all rules for a given id, which doesn't remove its marker but resets it */


  StyleSheet.prototype.remove = function remove(id) {
    const tag = this.tagMap[id];
    if (tag === undefined) return;

    const {clones} = this;

    for (let i = 0; i < clones.length; i += 1) {
      clones[i].remove(id);
    }

    /* remove all rules from the tag */
    tag.removeRules(id);

    /* ignore possible rehydrated names */
    this.ignoreRehydratedNames[id] = true;

    /* delete possible deferred rules */
    this.deferred[id] = undefined;
  };

  StyleSheet.prototype.toHTML = function toHTML() {
    return this.tags.map((tag) => tag.toHTML()).join('');
  };

  StyleSheet.prototype.toReactElements = function toReactElements() {
    const {id} = this;


    return this.tags.map((tag, i) => {
      const key = `sc-${  id  }-${  i}`;
      return cloneElement(tag.toElement(), { key });
    });
  };

  createClass(StyleSheet, null, [{
    key: 'master',
    get: function get$$1() {
      return master || (master = new StyleSheet().rehydrate());
    }

    /* NOTE: This is just for backwards-compatibility with jest-styled-components */

  }, {
    key: 'instance',
    get: function get$$1() {
      return StyleSheet.master;
    }
  }]);
  return StyleSheet;
}();

// 

const Keyframes = function () {
  function Keyframes(name, rules) {
    const _this = this;

    classCallCheck(this, Keyframes);

    this.inject = function (styleSheet) {
      if (!styleSheet.hasNameForId(_this.id, _this.name)) {
        styleSheet.inject(_this.id, _this.rules, _this.name);
      }
    };

    this.toString = function () {
      throw new StyledComponentsError(12, String(_this.name));
    };

    this.name = name;
    this.rules = rules;

    this.id = `sc-keyframes-${  name}`;
  }

  Keyframes.prototype.getName = function getName() {
    return this.name;
  };

  return Keyframes;
}();

// 

/**
 * inlined version of
 * https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/hyphenateStyleName.js
 */

const uppercasePattern = /([A-Z])/g;
const msPattern = /^ms-/;

/**
 * Hyphenates a camelcased CSS property name, for example:
 *
 *   > hyphenateStyleName('backgroundColor')
 *   < "background-color"
 *   > hyphenateStyleName('MozTransition')
 *   < "-moz-transition"
 *   > hyphenateStyleName('msTransition')
 *   < "-ms-transition"
 *
 * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
 * is converted to `-ms-`.
 *
 * @param {string} string
 * @return {string}
 */
function hyphenateStyleName(string) {
  return string.replace(uppercasePattern, '-$1').toLowerCase().replace(msPattern, '-ms-');
}

// 

// Taken from https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/react-dom/src/shared/dangerousStyleValue.js
function addUnitIfNeeded(name, value) {
  // https://github.com/amilajack/eslint-plugin-flowtype-errors/issues/133
  // $FlowFixMe
  if (value == null || typeof value === 'boolean' || value === '') {
    return '';
  }

  if (typeof value === 'number' && value !== 0 && !(name in unitless)) {
    return `${value  }px`; // Presumes implicit 'px' suffix for unitless numbers
  }

  return String(value).trim();
}

// 

/**
 * It's falsish not falsy because 0 is allowed.
 */
const isFalsish = function isFalsish(chunk) {
  return chunk === undefined || chunk === null || chunk === false || chunk === '';
};

const objToCss = function objToCss(obj, prevKey) {
  const css = Object.keys(obj).filter((key) => !isFalsish(obj[key])).map((key) => {
    if (isPlainObject(obj[key])) return objToCss(obj[key], key);
    return `${hyphenateStyleName(key)  }: ${  addUnitIfNeeded(key, obj[key])  };`;
  }).join(' ');
  return prevKey ? `${prevKey  } {\n  ${  css  }\n}` : css;
};

function flatten(chunk, executionContext, styleSheet) {
  if (Array.isArray(chunk)) {
    const ruleSet = [];

    for (var i = 0, len = chunk.length, result; i < len; i += 1) {
      result = flatten(chunk[i], executionContext, styleSheet);

      if (result === null) continue;else if (Array.isArray(result)) ruleSet.push.apply(ruleSet, result);else ruleSet.push(result);
    }

    return ruleSet;
  }

  if (isFalsish(chunk)) {
    return null;
  }

  /* Handle other components */
  if (isStyledComponent(chunk)) {
    return `.${  chunk.styledComponentId}`;
  }

  /* Either execute or defer the function */
  if (isFunction(chunk)) {
    if (executionContext) {
      let shouldThrow = false;

      try {
        // eslint-disable-next-line new-cap
        if (isElement(new chunk(executionContext))) {
          shouldThrow = true;
        }
      } catch (e) {
        /* */
      }

      if (shouldThrow) {
        throw new StyledComponentsError(13, getComponentName(chunk));
      }

      return flatten(chunk(executionContext), executionContext, styleSheet);
    } else return chunk;
  }

  if (chunk instanceof Keyframes) {
    if (styleSheet) {
      chunk.inject(styleSheet);
      return chunk.getName();
    } else return chunk;
  }

  /* Handle objects */
  return isPlainObject(chunk) ? objToCss(chunk) : chunk.toString();
}

// 
const printed = {};

function warnOnce(message) {
  if (printed[message]) return;
  printed[message] = true;

  if (typeof console !== 'undefined' && console.warn) console.warn(message);
}

// 
const SINGLE_QUOTE = "'".charCodeAt(0);
const DOUBLE_QUOTE = '"'.charCodeAt(0);
const BACKSLASH = '\\'.charCodeAt(0);
const SLASH = '/'.charCodeAt(0);
const NEWLINE = '\n'.charCodeAt(0);
const SPACE = ' '.charCodeAt(0);
const FEED = '\f'.charCodeAt(0);
const TAB = '\t'.charCodeAt(0);
const CR = '\r'.charCodeAt(0);
const OPEN_SQUARE = '['.charCodeAt(0);
const CLOSE_SQUARE = ']'.charCodeAt(0);
const OPEN_PARENTHESES = '('.charCodeAt(0);
const CLOSE_PARENTHESES = ')'.charCodeAt(0);
const OPEN_CURLY = '{'.charCodeAt(0);
const CLOSE_CURLY = '}'.charCodeAt(0);
const SEMICOLON = ';'.charCodeAt(0);
const ASTERISK = '*'.charCodeAt(0);
const COLON = ':'.charCodeAt(0);
const AT = '@'.charCodeAt(0);

const RE_AT_END = /[ \n\t\r\f\{\(\)'"\\;/\[\]#]/g;
const RE_WORD_END = /[ \n\t\r\f\(\)\{\}:;@!'"\\\]\[#]|\/(?=\*)/g;
const RE_BAD_BRACKET = /.[\\\/\("'\n]/;

function tokenize(input) {
  const options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  const tokens = [];
  const css = input.css.valueOf();

  const ignore = options.ignoreErrors;

  let code = void 0;
      let next = void 0;
      let quote = void 0;
      let lines = void 0;
      let last = void 0;
      let content = void 0;
      let escape = void 0;
      let nextLine = void 0;
      let nextOffset = void 0;
      let escaped = void 0;
      let escapePos = void 0;
      let prev = void 0;
      let n = void 0;

  const {length} = css;
  let offset = -1;
  let line = 1;
  let pos = 0;

  function unclosed(what) {
    throw input.error(`Unclosed ${  what}`, line, pos - offset);
  }

  while (pos < length) {
    code = css.charCodeAt(pos);

    if (code === NEWLINE || code === FEED || code === CR && css.charCodeAt(pos + 1) !== NEWLINE) {
      offset = pos;
      line += 1;
    }

    switch (code) {
      case NEWLINE:
      case SPACE:
      case TAB:
      case CR:
      case FEED:
        next = pos;
        do {
          next += 1;
          code = css.charCodeAt(next);
          if (code === NEWLINE) {
            offset = next;
            line += 1;
          }
        } while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);

        tokens.push(['space', css.slice(pos, next)]);
        pos = next - 1;
        break;

      case OPEN_SQUARE:
        tokens.push(['[', '[', line, pos - offset]);
        break;

      case CLOSE_SQUARE:
        tokens.push([']', ']', line, pos - offset]);
        break;

      case OPEN_CURLY:
        tokens.push(['{', '{', line, pos - offset]);
        break;

      case CLOSE_CURLY:
        tokens.push(['}', '}', line, pos - offset]);
        break;

      case COLON:
        tokens.push([':', ':', line, pos - offset]);
        break;

      case SEMICOLON:
        tokens.push([';', ';', line, pos - offset]);
        break;

      case OPEN_PARENTHESES:
        prev = tokens.length ? tokens[tokens.length - 1][1] : '';
        n = css.charCodeAt(pos + 1);
        if (prev === 'url' && n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE && n !== SPACE && n !== NEWLINE && n !== TAB && n !== FEED && n !== CR) {
          next = pos;
          do {
            escaped = false;
            next = css.indexOf(')', next + 1);
            if (next === -1) {
              if (ignore) {
                next = pos;
                break;
              } else {
                unclosed('bracket');
              }
            }
            escapePos = next;
            while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
              escapePos -= 1;
              escaped = !escaped;
            }
          } while (escaped);

          tokens.push(['brackets', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);
          pos = next;
        } else {
          next = css.indexOf(')', pos + 1);
          content = css.slice(pos, next + 1);

          if (next === -1 || RE_BAD_BRACKET.test(content)) {
            tokens.push(['(', '(', line, pos - offset]);
          } else {
            tokens.push(['brackets', content, line, pos - offset, line, next - offset]);
            pos = next;
          }
        }

        break;

      case CLOSE_PARENTHESES:
        tokens.push([')', ')', line, pos - offset]);
        break;

      case SINGLE_QUOTE:
      case DOUBLE_QUOTE:
        quote = code === SINGLE_QUOTE ? "'" : '"';
        next = pos;
        do {
          escaped = false;
          next = css.indexOf(quote, next + 1);
          if (next === -1) {
            if (ignore) {
              next = pos + 1;
              break;
            } else {
              unclosed('quote');
            }
          }
          escapePos = next;
          while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
            escapePos -= 1;
            escaped = !escaped;
          }
        } while (escaped);

        content = css.slice(pos, next + 1);
        lines = content.split('\n');
        last = lines.length - 1;

        if (last > 0) {
          nextLine = line + last;
          nextOffset = next - lines[last].length;
        } else {
          nextLine = line;
          nextOffset = offset;
        }

        tokens.push(['string', css.slice(pos, next + 1), line, pos - offset, nextLine, next - nextOffset]);

        offset = nextOffset;
        line = nextLine;
        pos = next;
        break;

      case AT:
        RE_AT_END.lastIndex = pos + 1;
        RE_AT_END.test(css);
        if (RE_AT_END.lastIndex === 0) {
          next = css.length - 1;
        } else {
          next = RE_AT_END.lastIndex - 2;
        }
        tokens.push(['at-word', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);
        pos = next;
        break;

      case BACKSLASH:
        next = pos;
        escape = true;
        while (css.charCodeAt(next + 1) === BACKSLASH) {
          next += 1;
          escape = !escape;
        }
        code = css.charCodeAt(next + 1);
        if (escape && code !== SLASH && code !== SPACE && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
          next += 1;
        }
        tokens.push(['word', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);
        pos = next;
        break;

      default:
        if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
          next = css.indexOf('*/', pos + 2) + 1;
          if (next === 0) {
            if (ignore) {
              next = css.length;
            } else {
              unclosed('comment');
            }
          }

          content = css.slice(pos, next + 1);
          lines = content.split('\n');
          last = lines.length - 1;

          if (last > 0) {
            nextLine = line + last;
            nextOffset = next - lines[last].length;
          } else {
            nextLine = line;
            nextOffset = offset;
          }

          tokens.push(['comment', content, line, pos - offset, nextLine, next - nextOffset]);

          offset = nextOffset;
          line = nextLine;
          pos = next;
        } else {
          RE_WORD_END.lastIndex = pos + 1;
          RE_WORD_END.test(css);
          if (RE_WORD_END.lastIndex === 0) {
            next = css.length - 1;
          } else {
            next = RE_WORD_END.lastIndex - 2;
          }

          tokens.push(['word', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);
          pos = next;
        }

        break;
    }

    pos++;
  }

  return tokens;
}

// 

const HIGHLIGHT_THEME = {
  brackets: [36, 39], // cyan
  string: [31, 39], // red
  'at-word': [31, 39], // red
  comment: [90, 39], // gray
  '{': [32, 39], // green
  '}': [32, 39], // green
  ':': [1, 22], // bold
  ';': [1, 22], // bold
  '(': [1, 22], // bold
  ')': [1, 22] // bold
};

function code(color) {
  return `\x1B[${  color  }m`;
}

function terminalHighlight(css) {
  const tokens = tokenize(new Input(css), { ignoreErrors: true });
  const result = [];
  tokens.forEach((token) => {
    const color = HIGHLIGHT_THEME[token[0]];
    if (color) {
      result.push(token[1].split(/\r?\n/).map((i) => code(color[0]) + i + code(color[1])).join('\n'));
    } else {
      result.push(token[1]);
    }
  });
  return result.join('');
}

// 

/**
 * The CSS parser throws this error for broken CSS.
 *
 * Custom parsers can throw this error for broken custom syntax using
 * the {@link Node#error} method.
 *
 * PostCSS will use the input source map to detect the original error location.
 * If you wrote a Sass file, compiled it to CSS and then parsed it with PostCSS,
 * PostCSS will show the original position in the Sass file.
 *
 * If you need the position in the PostCSS input
 * (e.g., to debug the previous compiler), use `error.input.file`.
 *
 * @example
 * // Catching and checking syntax error
 * try {
 *   postcss.parse('a{')
 * } catch (error) {
 *   if ( error.name === 'CssSyntaxError' ) {
 *     error //=> CssSyntaxError
 *   }
 * }
 *
 * @example
 * // Raising error from plugin
 * throw node.error('Unknown variable', { plugin: 'postcss-vars' });
 */

const CssSyntaxError = function () {
  /**
   * @param {string} message  - error message
   * @param {number} [line]   - source line of the error
   * @param {number} [column] - source column of the error
   * @param {string} [source] - source code of the broken file
   * @param {string} [file]   - absolute path to the broken file
   * @param {string} [plugin] - PostCSS plugin name, if error came from plugin
   */
  function CssSyntaxError(message, line, column, source, file, plugin) {
    classCallCheck(this, CssSyntaxError);

    /**
     * @member {string} - Always equal to `'CssSyntaxError'`. You should
     *                    always check error type
     *                    by `error.name === 'CssSyntaxError'` instead of
     *                    `error instanceof CssSyntaxError`, because
     *                    npm could have several PostCSS versions.
     *
     * @example
     * if ( error.name === 'CssSyntaxError' ) {
     *   error //=> CssSyntaxError
     * }
     */
    this.name = 'CssSyntaxError';
    /**
     * @member {string} - Error message.
     *
     * @example
     * error.message //=> 'Unclosed block'
     */
    this.reason = message;

    if (file) {
      /**
       * @member {string} - Absolute path to the broken file.
       *
       * @example
       * error.file       //=> 'a.sass'
       * error.input.file //=> 'a.css'
       */
      this.file = file;
    }
    if (source) {
      /**
       * @member {string} - Source code of the broken file.
       *
       * @example
       * error.source       //=> 'a { b {} }'
       * error.input.column //=> 'a b { }'
       */
      this.source = source;
    }
    if (plugin) {
      /**
       * @member {string} - Plugin name, if error came from plugin.
       *
       * @example
       * error.plugin //=> 'postcss-vars'
       */
      this.plugin = plugin;
    }
    if (typeof line !== 'undefined' && typeof column !== 'undefined') {
      /**
       * @member {number} - Source line of the error.
       *
       * @example
       * error.line       //=> 2
       * error.input.line //=> 4
       */
      this.line = line;
      /**
       * @member {number} - Source column of the error.
       *
       * @example
       * error.column       //=> 1
       * error.input.column //=> 4
       */
      this.column = column;
    }

    this.setMessage();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CssSyntaxError);
    }
  }

  CssSyntaxError.prototype.setMessage = function setMessage() {
    /**
     * @member {string} - Full error text in the GNU error format
     *                    with plugin, file, line and column.
     *
     * @example
     * error.message //=> 'a.css:1:1: Unclosed block'
     */
    this.message = this.plugin ? `${this.plugin  }: ` : '';
    this.message += this.file ? this.file : '<css input>';
    if (typeof this.line !== 'undefined') {
      this.message += `:${  this.line  }:${  this.column}`;
    }
    this.message += `: ${  this.reason}`;
  };

  /**
   * Returns a few lines of CSS source that caused the error.
   *
   * If the CSS has an input source map without `sourceContent`,
   * this method will return an empty string.
   *
   * @param {boolean} [color] whether arrow will be colored red by terminal
   *                          color codes. By default, PostCSS will detect
   *                          color support by `process.stdout.isTTY`
   *                          and `process.env.NODE_DISABLE_COLORS`.
   *
   * @example
   * error.showSourceCode() //=> "  4 | }
   *                        //      5 | a {
   *                        //    > 6 |   bad
   *                        //        |   ^
   *                        //      7 | }
   *                        //      8 | b {"
   *
   * @return {string} few lines of CSS source that caused the error
   */


  CssSyntaxError.prototype.showSourceCode = function showSourceCode(color) {
    const _this = this;

    if (!this.source) return '';

    let css = this.source;
    if (typeof color === 'undefined') color = supportsColor;
    if (color) css = terminalHighlight(css);

    const lines = css.split(/\r?\n/);
    const start = Math.max(this.line - 3, 0);
    const end = Math.min(this.line + 2, lines.length);

    const maxWidth = String(end).length;

    return lines.slice(start, end).map((line, index) => {
      const number = start + 1 + index;
      const padded = (` ${  number}`).slice(-maxWidth);
      const gutter = ` ${  padded  } | `;
      if (number === _this.line) {
        const spacing = gutter.replace(/\d/g, ' ') + line.slice(0, _this.column - 1).replace(/[^\t]/g, ' ');
        return `>${  gutter  }${line  }\n ${  spacing  }^`;
      } else {
        return ` ${  gutter  }${line}`;
      }
    }).join('\n');
  };

  /**
   * Returns error position, message and source code of the broken part.
   *
   * @example
   * error.toString() //=> "CssSyntaxError: app.css:1:1: Unclosed block
   *                  //    > 1 | a {
   *                  //        | ^"
   *
   * @return {string} error position, message and source code
   */


  CssSyntaxError.prototype.toString = function toString() {
    let code = this.showSourceCode();
    if (code) {
      code = `\n\n${  code  }\n`;
    }
    return `${this.name  }: ${  this.message  }${code}`;
  };

  createClass(CssSyntaxError, [{
    key: 'generated',
    get: function get$$1() {
      warnOnce('CssSyntaxError#generated is deprecated. Use input instead.');
      return this.input;
    }

    /**
     * @memberof CssSyntaxError#
     * @member {Input} input - Input object with PostCSS internal information
     *                         about input file. If input has source map
     *                         from previous tool, PostCSS will use origin
     *                         (for example, Sass) source. You can use this
     *                         object to get PostCSS input source.
     *
     * @example
     * error.input.file //=> 'a.css'
     * error.file       //=> 'a.sass'
     */

  }]);
  return CssSyntaxError;
}();

// 
/* eslint-disable valid-jsdoc */

const defaultRaw = {
  colon: ': ',
  indent: '    ',
  beforeDecl: '\n',
  beforeRule: '\n',
  beforeOpen: ' ',
  beforeClose: '\n',
  beforeComment: '\n',
  after: '\n',
  emptyBody: '',
  commentLeft: ' ',
  commentRight: ' '
};

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

const Stringifier = function () {
  function Stringifier(builder) {
    classCallCheck(this, Stringifier);

    this.builder = builder;
  }

  Stringifier.prototype.stringify = function stringify(node, semicolon) {
    this[node.type](node, semicolon);
  };

  Stringifier.prototype.root = function root(node) {
    this.body(node);
    if (node.raws.after) this.builder(node.raws.after);
  };

  Stringifier.prototype.comment = function comment(node) {
    const left = this.raw(node, 'left', 'commentLeft');
    const right = this.raw(node, 'right', 'commentRight');
    this.builder(`/*${  left  }${node.text  }${right  }*/`, node);
  };

  Stringifier.prototype.decl = function decl(node, semicolon) {
    const between = this.raw(node, 'between', 'colon');
    let string = node.prop + between + this.rawValue(node, 'value');

    if (node.important) {
      string += node.raws.important || ' !important';
    }

    if (semicolon) string += ';';
    this.builder(string, node);
  };

  Stringifier.prototype.rule = function rule(node) {
    this.block(node, this.rawValue(node, 'selector'));
  };

  Stringifier.prototype.atrule = function atrule(node, semicolon) {
    let name = `@${  node.name}`;
    const params = node.params ? this.rawValue(node, 'params') : '';

    if (typeof node.raws.afterName !== 'undefined') {
      name += node.raws.afterName;
    } else if (params) {
      name += ' ';
    }

    if (node.nodes) {
      this.block(node, name + params);
    } else {
      const end = (node.raws.between || '') + (semicolon ? ';' : '');
      this.builder(name + params + end, node);
    }
  };

  Stringifier.prototype.body = function body(node) {
    let last = node.nodes.length - 1;
    while (last > 0) {
      if (node.nodes[last].type !== 'comment') break;
      last -= 1;
    }

    const semicolon = this.raw(node, 'semicolon');
    for (let i = 0; i < node.nodes.length; i++) {
      const child = node.nodes[i];
      const before = this.raw(child, 'before');
      if (before) this.builder(before);
      this.stringify(child, last !== i || semicolon);
    }
  };

  Stringifier.prototype.block = function block(node, start) {
    const between = this.raw(node, 'between', 'beforeOpen');
    this.builder(`${start + between  }{`, node, 'start');

    let after = void 0;
    if (node.nodes && node.nodes.length) {
      this.body(node);
      after = this.raw(node, 'after');
    } else {
      after = this.raw(node, 'after', 'emptyBody');
    }

    if (after) this.builder(after);
    this.builder('}', node, 'end');
  };

  Stringifier.prototype.raw = function raw(node, own, detect) {
    let value = void 0;
    if (!detect) detect = own;

    // Already had
    if (own) {
      value = node.raws[own];
      if (typeof value !== 'undefined') return value;
    }

    const {parent} = node;

    // Hack for first rule in CSS
    if (detect === 'before') {
      if (!parent || parent.type === 'root' && parent.first === node) {
        return '';
      }
    }

    // Floating child without parent
    if (!parent) return defaultRaw[detect];

    // Detect style by other nodes
    const root = node.root();
    if (!root.rawCache) root.rawCache = {};
    if (typeof root.rawCache[detect] !== 'undefined') {
      return root.rawCache[detect];
    }

    if (detect === 'before' || detect === 'after') {
      return this.beforeAfter(node, detect);
    } else {
      const method = `raw${  capitalize(detect)}`;
      if (this[method]) {
        value = this[method](root, node);
      } else {
        root.walk((i) => {
          value = i.raws[own];
          if (typeof value !== 'undefined') return false;
        });
      }
    }

    if (typeof value === 'undefined') value = defaultRaw[detect];

    root.rawCache[detect] = value;
    return value;
  };

  Stringifier.prototype.rawSemicolon = function rawSemicolon(root) {
    let value = void 0;
    root.walk((i) => {
      if (i.nodes && i.nodes.length && i.last.type === 'decl') {
        value = i.raws.semicolon;
        if (typeof value !== 'undefined') return false;
      }
    });
    return value;
  };

  Stringifier.prototype.rawEmptyBody = function rawEmptyBody(root) {
    let value = void 0;
    root.walk((i) => {
      if (i.nodes && i.nodes.length === 0) {
        value = i.raws.after;
        if (typeof value !== 'undefined') return false;
      }
    });
    return value;
  };

  Stringifier.prototype.rawIndent = function rawIndent(root) {
    if (root.raws.indent) return root.raws.indent;
    let value = void 0;
    root.walk((i) => {
      const p = i.parent;
      if (p && p !== root && p.parent && p.parent === root) {
        if (typeof i.raws.before !== 'undefined') {
          const parts = i.raws.before.split('\n');
          value = parts[parts.length - 1];
          value = value.replace(/[^\s]/g, '');
          return false;
        }
      }
    });
    return value;
  };

  Stringifier.prototype.rawBeforeComment = function rawBeforeComment(root, node) {
    let value = void 0;
    root.walkComments((i) => {
      if (typeof i.raws.before !== 'undefined') {
        value = i.raws.before;
        if (value.indexOf('\n') !== -1) {
          value = value.replace(/[^\n]+$/, '');
        }
        return false;
      }
    });
    if (typeof value === 'undefined') {
      value = this.raw(node, null, 'beforeDecl');
    }
    return value;
  };

  Stringifier.prototype.rawBeforeDecl = function rawBeforeDecl(root, node) {
    let value = void 0;
    root.walkDecls((i) => {
      if (typeof i.raws.before !== 'undefined') {
        value = i.raws.before;
        if (value.indexOf('\n') !== -1) {
          value = value.replace(/[^\n]+$/, '');
        }
        return false;
      }
    });
    if (typeof value === 'undefined') {
      value = this.raw(node, null, 'beforeRule');
    }
    return value;
  };

  Stringifier.prototype.rawBeforeRule = function rawBeforeRule(root) {
    let value = void 0;
    root.walk((i) => {
      if (i.nodes && (i.parent !== root || root.first !== i)) {
        if (typeof i.raws.before !== 'undefined') {
          value = i.raws.before;
          if (value.indexOf('\n') !== -1) {
            value = value.replace(/[^\n]+$/, '');
          }
          return false;
        }
      }
    });
    return value;
  };

  Stringifier.prototype.rawBeforeClose = function rawBeforeClose(root) {
    let value = void 0;
    root.walk((i) => {
      if (i.nodes && i.nodes.length > 0) {
        if (typeof i.raws.after !== 'undefined') {
          value = i.raws.after;
          if (value.indexOf('\n') !== -1) {
            value = value.replace(/[^\n]+$/, '');
          }
          return false;
        }
      }
    });
    return value;
  };

  Stringifier.prototype.rawBeforeOpen = function rawBeforeOpen(root) {
    let value = void 0;
    root.walk((i) => {
      if (i.type !== 'decl') {
        value = i.raws.between;
        if (typeof value !== 'undefined') return false;
      }
    });
    return value;
  };

  Stringifier.prototype.rawColon = function rawColon(root) {
    let value = void 0;
    root.walkDecls((i) => {
      if (typeof i.raws.between !== 'undefined') {
        value = i.raws.between.replace(/[^\s:]/g, '');
        return false;
      }
    });
    return value;
  };

  Stringifier.prototype.beforeAfter = function beforeAfter(node, detect) {
    let value = void 0;
    if (node.type === 'decl') {
      value = this.raw(node, null, 'beforeDecl');
    } else if (node.type === 'comment') {
      value = this.raw(node, null, 'beforeComment');
    } else if (detect === 'before') {
      value = this.raw(node, null, 'beforeRule');
    } else {
      value = this.raw(node, null, 'beforeClose');
    }

    let buf = node.parent;
    let depth = 0;
    while (buf && buf.type !== 'root') {
      depth += 1;
      buf = buf.parent;
    }

    if (value.indexOf('\n') !== -1) {
      const indent = this.raw(node, null, 'indent');
      if (indent.length) {
        for (let step = 0; step < depth; step++) {
          value += indent;
        }
      }
    }

    return value;
  };

  Stringifier.prototype.rawValue = function rawValue(node, prop) {
    const value = node[prop];
    const raw = node.raws[prop];
    if (raw && raw.value === value) {
      return raw.raw;
    } else {
      return value;
    }
  };

  return Stringifier;
}();

// 

function stringify(node, builder) {
  const str = new Stringifier(builder);
  str.stringify(node);
}

// 

/**
 * @typedef {object} position
 * @property {number} line   - source line in file
 * @property {number} column - source column in file
 */

/**
 * @typedef {object} source
 * @property {Input} input    - {@link Input} with input file
 * @property {position} start - The starting position of the node’s source
 * @property {position} end   - The ending position of the node’s source
 */

const cloneNode = function cloneNode(obj, parent) {
  const cloned = new obj.constructor();

  for (const i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    let value = obj[i];
    const type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

    if (i === 'parent' && type === 'object') {
      if (parent) cloned[i] = parent;
    } else if (i === 'source') {
      cloned[i] = value;
    } else if (value instanceof Array) {
      cloned[i] = value.map((j) => cloneNode(j, cloned));
    } else if (i !== 'before' && i !== 'after' && i !== 'between' && i !== 'semicolon') {
      if (type === 'object' && value !== null) value = cloneNode(value);
      cloned[i] = value;
    }
  }

  return cloned;
};

/**
 * All node classes inherit the following common methods.
 *
 * @abstract
 */

const Node = function () {
  /**
   * @param {object} [defaults] - value for node properties
   */
  function Node() {
    const defaults$$1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Node);

    this.raws = {};
    for (const name in defaults$$1) {
      this[name] = defaults$$1[name];
    }
  }

  /**
   * Returns a CssSyntaxError instance containing the original position
   * of the node in the source, showing line and column numbers and also
   * a small excerpt to facilitate debugging.
   *
   * If present, an input source map will be used to get the original position
   * of the source, even from a previous compilation step
   * (e.g., from Sass compilation).
   *
   * This method produces very useful error messages.
   *
   * @param {string} message     - error description
   * @param {object} [opts]      - options
   * @param {string} opts.plugin - plugin name that created this error.
   *                               PostCSS will set it automatically.
   * @param {string} opts.word   - a word inside a node’s string that should
   *                               be highlighted as the source of the error
   * @param {number} opts.index  - an index inside a node’s string that should
   *                               be highlighted as the source of the error
   *
   * @return {CssSyntaxError} error object to throw it
   *
   * @example
   * if ( !variables[name] ) {
   *   throw decl.error('Unknown variable ' + name, { word: name });
   *   // CssSyntaxError: postcss-vars:a.sass:4:3: Unknown variable $black
   *   //   color: $black
   *   // a
   *   //          ^
   *   //   background: white
   * }
   */


  Node.prototype.error = function error(message) {
    const opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (this.source) {
      const pos = this.positionBy(opts);
      return this.source.input.error(message, pos.line, pos.column, opts);
    } else {
      return new CssSyntaxError(message);
    }
  };

  /**
   * This method is provided as a convenience wrapper for {@link Result#warn}.
   *
   * @param {Result} result      - the {@link Result} instance
   *                               that will receive the warning
   * @param {string} text        - warning message
   * @param {object} [opts]      - options
   * @param {string} opts.plugin - plugin name that created this warning.
   *                               PostCSS will set it automatically.
   * @param {string} opts.word   - a word inside a node’s string that should
   *                               be highlighted as the source of the warning
   * @param {number} opts.index  - an index inside a node’s string that should
   *                               be highlighted as the source of the warning
   *
   * @return {Warning} created warning object
   *
   * @example
   * const plugin = postcss.plugin('postcss-deprecated', () => {
   *   return (root, result) => {
   *     root.walkDecls('bad', decl => {
   *       decl.warn(result, 'Deprecated property bad');
   *     });
   *   };
   * });
   */


  Node.prototype.warn = function warn(result, text, opts) {
    const data = { node: this };
    for (const i in opts) {
      data[i] = opts[i];
    }return result.warn(text, data);
  };

  /**
   * Removes the node from its parent and cleans the parent properties
   * from the node and its children.
   *
   * @example
   * if ( decl.prop.match(/^-webkit-/) ) {
   *   decl.remove();
   * }
   *
   * @return {Node} node to make calls chain
   */


  Node.prototype.remove = function remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    this.parent = undefined;
    return this;
  };

  /**
   * Returns a CSS string representing the node.
   *
   * @param {stringifier|syntax} [stringifier] - a syntax to use
   *                                             in string generation
   *
   * @return {string} CSS string of this node
   *
   * @example
   * postcss.rule({ selector: 'a' }).toString() //=> "a {}"
   */


  Node.prototype.toString = function toString() {
    let stringifier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : stringify;

    if (stringifier.stringify) stringifier = stringifier.stringify;
    let result = '';
    stringifier(this, (i) => {
      result += i;
    });
    return result;
  };

  /**
   * Returns a clone of the node.
   *
   * The resulting cloned node and its (cloned) children will have
   * a clean parent and code style properties.
   *
   * @param {object} [overrides] - new properties to override in the clone.
   *
   * @example
   * const cloned = decl.clone({ prop: '-moz-' + decl.prop });
   * cloned.raws.before  //=> undefined
   * cloned.parent       //=> undefined
   * cloned.toString()   //=> -moz-transform: scale(0)
   *
   * @return {Node} clone of the node
   */


  Node.prototype.clone = function clone() {
    const overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    const cloned = cloneNode(this);
    for (const name in overrides) {
      cloned[name] = overrides[name];
    }
    return cloned;
  };

  /**
   * Shortcut to clone the node and insert the resulting cloned node
   * before the current node.
   *
   * @param {object} [overrides] - new properties to override in the clone.
   *
   * @example
   * decl.cloneBefore({ prop: '-moz-' + decl.prop });
   *
   * @return {Node} - new node
   */


  Node.prototype.cloneBefore = function cloneBefore() {
    const overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    const cloned = this.clone(overrides);
    this.parent.insertBefore(this, cloned);
    return cloned;
  };

  /**
   * Shortcut to clone the node and insert the resulting cloned node
   * after the current node.
   *
   * @param {object} [overrides] - new properties to override in the clone.
   *
   * @return {Node} - new node
   */


  Node.prototype.cloneAfter = function cloneAfter() {
    const overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    const cloned = this.clone(overrides);
    this.parent.insertAfter(this, cloned);
    return cloned;
  };

  /**
   * Inserts node(s) before the current node and removes the current node.
   *
   * @param {...Node} nodes - node(s) to replace current one
   *
   * @example
   * if ( atrule.name == 'mixin' ) {
   *   atrule.replaceWith(mixinRules[atrule.params]);
   * }
   *
   * @return {Node} current node to methods chain
   */


  Node.prototype.replaceWith = function replaceWith() {
    const _this = this;

    if (this.parent) {
      for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
        nodes[_key] = arguments[_key];
      }

      nodes.forEach((node) => {
        _this.parent.insertBefore(_this, node);
      });

      this.remove();
    }

    return this;
  };

  /**
   * Removes the node from its current parent and inserts it
   * at the end of `newParent`.
   *
   * This will clean the `before` and `after` code {@link Node#raws} data
   * from the node and replace them with the indentation style of `newParent`.
   * It will also clean the `between` property
   * if `newParent` is in another {@link Root}.
   *
   * @param {Container} newParent - container node where the current node
   *                                will be moved
   *
   * @example
   * atrule.moveTo(atrule.root());
   *
   * @return {Node} current node to methods chain
   */


  Node.prototype.moveTo = function moveTo(newParent) {
    this.cleanRaws(this.root() === newParent.root());
    this.remove();
    newParent.append(this);
    return this;
  };

  /**
   * Removes the node from its current parent and inserts it into
   * a new parent before `otherNode`.
   *
   * This will also clean the node’s code style properties just as it would
   * in {@link Node#moveTo}.
   *
   * @param {Node} otherNode - node that will be before current node
   *
   * @return {Node} current node to methods chain
   */


  Node.prototype.moveBefore = function moveBefore(otherNode) {
    this.cleanRaws(this.root() === otherNode.root());
    this.remove();
    otherNode.parent.insertBefore(otherNode, this);
    return this;
  };

  /**
   * Removes the node from its current parent and inserts it into
   * a new parent after `otherNode`.
   *
   * This will also clean the node’s code style properties just as it would
   * in {@link Node#moveTo}.
   *
   * @param {Node} otherNode - node that will be after current node
   *
   * @return {Node} current node to methods chain
   */


  Node.prototype.moveAfter = function moveAfter(otherNode) {
    this.cleanRaws(this.root() === otherNode.root());
    this.remove();
    otherNode.parent.insertAfter(otherNode, this);
    return this;
  };

  /**
   * Returns the next child of the node’s parent.
   * Returns `undefined` if the current node is the last child.
   *
   * @return {Node|undefined} next node
   *
   * @example
   * if ( comment.text === 'delete next' ) {
   *   const next = comment.next();
   *   if ( next ) {
   *     next.remove();
   *   }
   * }
   */


  Node.prototype.next = function next() {
    const index = this.parent.index(this);
    return this.parent.nodes[index + 1];
  };

  /**
   * Returns the previous child of the node’s parent.
   * Returns `undefined` if the current node is the first child.
   *
   * @return {Node|undefined} previous node
   *
   * @example
   * const annotation = decl.prev();
   * if ( annotation.type == 'comment' ) {
   *  readAnnotation(annotation.text);
   * }
   */


  Node.prototype.prev = function prev() {
    const index = this.parent.index(this);
    return this.parent.nodes[index - 1];
  };

  Node.prototype.toJSON = function toJSON() {
    const fixed = {};

    for (const name in this) {
      if (!this.hasOwnProperty(name)) continue;
      if (name === 'parent') continue;
      const value = this[name];

      if (value instanceof Array) {
        fixed[name] = value.map((i) => {
          if ((typeof i === 'undefined' ? 'undefined' : _typeof(i)) === 'object' && i.toJSON) {
            return i.toJSON();
          } else {
            return i;
          }
        });
      } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.toJSON) {
        fixed[name] = value.toJSON();
      } else {
        fixed[name] = value;
      }
    }

    return fixed;
  };

  /**
   * Returns a {@link Node#raws} value. If the node is missing
   * the code style property (because the node was manually built or cloned),
   * PostCSS will try to autodetect the code style property by looking
   * at other nodes in the tree.
   *
   * @param {string} prop          - name of code style property
   * @param {string} [defaultType] - name of default value, it can be missed
   *                                 if the value is the same as prop
   *
   * @example
   * const root = postcss.parse('a { background: white }');
   * root.nodes[0].append({ prop: 'color', value: 'black' });
   * root.nodes[0].nodes[1].raws.before   //=> undefined
   * root.nodes[0].nodes[1].raw('before') //=> ' '
   *
   * @return {string} code style value
   */


  Node.prototype.raw = function raw(prop, defaultType) {
    const str = new Stringifier();
    return str.raw(this, prop, defaultType);
  };

  /**
   * Finds the Root instance of the node’s tree.
   *
   * @example
   * root.nodes[0].nodes[0].root() === root
   *
   * @return {Root} root parent
   */


  Node.prototype.root = function root() {
    let result = this;
    while (result.parent) {
      result = result.parent;
    }return result;
  };

  Node.prototype.cleanRaws = function cleanRaws(keepBetween) {
    delete this.raws.before;
    delete this.raws.after;
    if (!keepBetween) delete this.raws.between;
  };

  Node.prototype.positionInside = function positionInside(index) {
    const string = this.toString();
    let {column} = this.source.start;
    let {line} = this.source.start;

    for (let i = 0; i < index; i++) {
      if (string[i] === '\n') {
        column = 1;
        line += 1;
      } else {
        column += 1;
      }
    }

    return { line, column };
  };

  Node.prototype.positionBy = function positionBy(opts) {
    let pos = this.source.start;
    if (opts.index) {
      pos = this.positionInside(opts.index);
    } else if (opts.word) {
      const index = this.toString().indexOf(opts.word);
      if (index !== -1) pos = this.positionInside(index);
    }
    return pos;
  };

  Node.prototype.removeSelf = function removeSelf() {
    warnOnce('Node#removeSelf is deprecated. Use Node#remove.');
    return this.remove();
  };

  Node.prototype.replace = function replace(nodes) {
    warnOnce('Node#replace is deprecated. Use Node#replaceWith');
    return this.replaceWith(nodes);
  };

  Node.prototype.style = function style(own, detect) {
    warnOnce('Node#style() is deprecated. Use Node#raw()');
    return this.raw(own, detect);
  };

  Node.prototype.cleanStyles = function cleanStyles(keepBetween) {
    warnOnce('Node#cleanStyles() is deprecated. Use Node#cleanRaws()');
    return this.cleanRaws(keepBetween);
  };

  createClass(Node, [{
    key: 'before',
    get: function get$$1() {
      warnOnce('Node#before is deprecated. Use Node#raws.before');
      return this.raws.before;
    },
    set: function set$$1(val) {
      warnOnce('Node#before is deprecated. Use Node#raws.before');
      this.raws.before = val;
    }
  }, {
    key: 'between',
    get: function get$$1() {
      warnOnce('Node#between is deprecated. Use Node#raws.between');
      return this.raws.between;
    },
    set: function set$$1(val) {
      warnOnce('Node#between is deprecated. Use Node#raws.between');
      this.raws.between = val;
    }

    /**
     * @memberof Node#
     * @member {string} type - String representing the node’s type.
     *                         Possible values are `root`, `atrule`, `rule`,
     *                         `decl`, or `comment`.
     *
     * @example
     * postcss.decl({ prop: 'color', value: 'black' }).type //=> 'decl'
     */

    /**
     * @memberof Node#
     * @member {Container} parent - the node’s parent node.
     *
     * @example
     * root.nodes[0].parent == root;
     */

    /**
     * @memberof Node#
     * @member {source} source - the input source of the node
     *
     * The property is used in source map generation.
     *
     * If you create a node manually (e.g., with `postcss.decl()`),
     * that node will not have a `source` property and will be absent
     * from the source map. For this reason, the plugin developer should
     * consider cloning nodes to create new ones (in which case the new node’s
     * source will reference the original, cloned node) or setting
     * the `source` property manually.
     *
     * ```js
     * // Bad
     * const prefixed = postcss.decl({
     *   prop: '-moz-' + decl.prop,
     *   value: decl.value
     * });
     *
     * // Good
     * const prefixed = decl.clone({ prop: '-moz-' + decl.prop });
     * ```
     *
     * ```js
     * if ( atrule.name == 'add-link' ) {
     *   const rule = postcss.rule({ selector: 'a', source: atrule.source });
     *   atrule.parent.insertBefore(atrule, rule);
     * }
     * ```
     *
     * @example
     * decl.source.input.from //=> '/home/ai/a.sass'
     * decl.source.start      //=> { line: 10, column: 2 }
     * decl.source.end        //=> { line: 10, column: 12 }
     */

    /**
     * @memberof Node#
     * @member {object} raws - Information to generate byte-to-byte equal
     *                         node string as it was in the origin input.
     *
     * Every parser saves its own properties,
     * but the default CSS parser uses:
     *
     * * `before`: the space symbols before the node. It also stores `*`
     *   and `_` symbols before the declaration (IE hack).
     * * `after`: the space symbols after the last child of the node
     *   to the end of the node.
     * * `between`: the symbols between the property and value
     *   for declarations, selector and `{` for rules, or last parameter
     *   and `{` for at-rules.
     * * `semicolon`: contains true if the last child has
     *   an (optional) semicolon.
     * * `afterName`: the space between the at-rule name and its parameters.
     * * `left`: the space symbols between `/*` and the comment’s text.
     * * `right`: the space symbols between the comment’s text
     *   and <code>*&#47;</code>.
     * * `important`: the content of the important statement,
     *   if it is not just `!important`.
     *
     * PostCSS cleans selectors, declaration values and at-rule parameters
     * from comments and extra spaces, but it stores origin content in raws
     * properties. As such, if you don’t change a declaration’s value,
     * PostCSS will use the raw value with comments.
     *
     * @example
     * const root = postcss.parse('a {\n  color:black\n}')
     * root.first.first.raws //=> { before: '\n  ', between: ':' }
     */

  }]);
  return Node;
}();

// 

/**
 * Represents a CSS declaration.
 *
 * @extends Node
 *
 * @example
 * const root = postcss.parse('a { color: black }');
 * const decl = root.first.first;
 * decl.type       //=> 'decl'
 * decl.toString() //=> ' color: black'
 */

const Declaration = function (_Node) {
  inherits(Declaration, _Node);

  function Declaration(defaults$$1) {
    classCallCheck(this, Declaration);

    const _this = possibleConstructorReturn(this, _Node.call(this, defaults$$1));

    _this.type = 'decl';
    return _this;
  }

  createClass(Declaration, [{
    key: '_value',
    get: function get$$1() {
      warnOnce('Node#_value was deprecated. Use Node#raws.value');
      return this.raws.value;
    },
    set: function set$$1(val) {
      warnOnce('Node#_value was deprecated. Use Node#raws.value');
      this.raws.value = val;
    }
  }, {
    key: '_important',
    get: function get$$1() {
      warnOnce('Node#_important was deprecated. Use Node#raws.important');
      return this.raws.important;
    },
    set: function set$$1(val) {
      warnOnce('Node#_important was deprecated. Use Node#raws.important');
      this.raws.important = val;
    }

    /**
     * @memberof Declaration#
     * @member {string} prop - the declaration’s property name
     *
     * @example
     * const root = postcss.parse('a { color: black }');
     * const decl = root.first.first;
     * decl.prop //=> 'color'
     */

    /**
     * @memberof Declaration#
     * @member {string} value - the declaration’s value
     *
     * @example
     * const root = postcss.parse('a { color: black }');
     * const decl = root.first.first;
     * decl.value //=> 'black'
     */

    /**
     * @memberof Declaration#
     * @member {boolean} important - `true` if the declaration
     *                               has an !important annotation.
     *
     * @example
     * const root = postcss.parse('a { color: black !important; color: red }');
     * root.first.first.important //=> true
     * root.first.last.important  //=> undefined
     */

    /**
     * @memberof Declaration#
     * @member {object} raws - Information to generate byte-to-byte equal
     *                         node string as it was in the origin input.
     *
     * Every parser saves its own properties,
     * but the default CSS parser uses:
     *
     * * `before`: the space symbols before the node. It also stores `*`
     *   and `_` symbols before the declaration (IE hack).
     * * `between`: the symbols between the property and value
     *   for declarations, selector and `{` for rules, or last parameter
     *   and `{` for at-rules.
     * * `important`: the content of the important statement,
     *   if it is not just `!important`.
     *
     * PostCSS cleans declaration from comments and extra spaces,
     * but it stores origin content in raws properties.
     * As such, if you don’t change a declaration’s value,
     * PostCSS will use the raw value with comments.
     *
     * @example
     * const root = postcss.parse('a {\n  color:black\n}')
     * root.first.first.raws //=> { before: '\n  ', between: ':' }
     */

  }]);
  return Declaration;
}(Node);

// 

/**
 * Represents a comment between declarations or statements (rule and at-rules).
 *
 * Comments inside selectors, at-rule parameters, or declaration values
 * will be stored in the `raws` properties explained above.
 *
 * @extends Node
 */

const Comment = function (_Node) {
  inherits(Comment, _Node);

  function Comment(defaults$$1) {
    classCallCheck(this, Comment);

    const _this = possibleConstructorReturn(this, _Node.call(this, defaults$$1));

    _this.type = 'comment';
    return _this;
  }

  createClass(Comment, [{
    key: 'left',
    get: function get$$1() {
      warnOnce('Comment#left was deprecated. Use Comment#raws.left');
      return this.raws.left;
    },
    set: function set$$1(val) {
      warnOnce('Comment#left was deprecated. Use Comment#raws.left');
      this.raws.left = val;
    }
  }, {
    key: 'right',
    get: function get$$1() {
      warnOnce('Comment#right was deprecated. Use Comment#raws.right');
      return this.raws.right;
    },
    set: function set$$1(val) {
      warnOnce('Comment#right was deprecated. Use Comment#raws.right');
      this.raws.right = val;
    }

    /**
     * @memberof Comment#
     * @member {string} text - the comment’s text
     */

    /**
     * @memberof Comment#
     * @member {object} raws - Information to generate byte-to-byte equal
     *                         node string as it was in the origin input.
     *
     * Every parser saves its own properties,
     * but the default CSS parser uses:
     *
     * * `before`: the space symbols before the node.
     * * `left`: the space symbols between `/*` and the comment’s text.
     * * `right`: the space symbols between the comment’s text.
     */

  }]);
  return Comment;
}(Node);

// 

const Parser = function () {
  function Parser(input) {
    classCallCheck(this, Parser);

    this.input = input;

    this.pos = 0;
    this.root = new Root();
    this.current = this.root;
    this.spaces = '';
    this.semicolon = false;

    this.root.source = { input, start: { line: 1, column: 1 } };
  }

  Parser.prototype.tokenize = function tokenize$$1() {
    this.tokens = tokenize(this.input);
  };

  Parser.prototype.loop = function loop() {
    let token = void 0;
    while (this.pos < this.tokens.length) {
      token = this.tokens[this.pos];

      switch (token[0]) {
        case 'space':
        case ';':
          this.spaces += token[1];
          break;

        case '}':
          this.end(token);
          break;

        case 'comment':
          this.comment(token);
          break;

        case 'at-word':
          this.atrule(token);
          break;

        case '{':
          this.emptyRule(token);
          break;

        default:
          this.other();
          break;
      }

      this.pos += 1;
    }
    this.endFile();
  };

  Parser.prototype.comment = function comment(token) {
    const node = new Comment();
    this.init(node, token[2], token[3]);
    node.source.end = { line: token[4], column: token[5] };

    const text = token[1].slice(2, -2);
    if (/^\s*$/.test(text)) {
      node.text = '';
      node.raws.left = text;
      node.raws.right = '';
    } else {
      const match = text.match(/^(\s*)([^]*[^\s])(\s*)$/);
      node.text = match[2];
      node.raws.left = match[1];
      node.raws.right = match[3];
    }
  };

  Parser.prototype.emptyRule = function emptyRule(token) {
    const node = new Rule();
    this.init(node, token[2], token[3]);
    node.selector = '';
    node.raws.between = '';
    this.current = node;
  };

  Parser.prototype.other = function other() {
    let token = void 0;
    let end = false;
    let type = null;
    let colon = false;
    let bracket = null;
    const brackets = [];

    const start = this.pos;
    while (this.pos < this.tokens.length) {
      token = this.tokens[this.pos];
      type = token[0];

      if (type === '(' || type === '[') {
        if (!bracket) bracket = token;
        brackets.push(type === '(' ? ')' : ']');
      } else if (brackets.length === 0) {
        if (type === ';') {
          if (colon) {
            this.decl(this.tokens.slice(start, this.pos + 1));
            return;
          } else {
            break;
          }
        } else if (type === '{') {
          this.rule(this.tokens.slice(start, this.pos + 1));
          return;
        } else if (type === '}') {
          this.pos -= 1;
          end = true;
          break;
        } else if (type === ':') {
          colon = true;
        }
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop();
        if (brackets.length === 0) bracket = null;
      }

      this.pos += 1;
    }
    if (this.pos === this.tokens.length) {
      this.pos -= 1;
      end = true;
    }

    if (brackets.length > 0) this.unclosedBracket(bracket);

    if (end && colon) {
      while (this.pos > start) {
        token = this.tokens[this.pos][0];
        if (token !== 'space' && token !== 'comment') break;
        this.pos -= 1;
      }
      this.decl(this.tokens.slice(start, this.pos + 1));
      return;
    }

    this.unknownWord(start);
  };

  Parser.prototype.rule = function rule(tokens) {
    tokens.pop();

    const node = new Rule();
    this.init(node, tokens[0][2], tokens[0][3]);

    node.raws.between = this.spacesFromEnd(tokens);
    this.raw(node, 'selector', tokens);
    this.current = node;
  };

  Parser.prototype.decl = function decl(tokens) {
    const node = new Declaration();
    this.init(node);

    const last = tokens[tokens.length - 1];
    if (last[0] === ';') {
      this.semicolon = true;
      tokens.pop();
    }
    if (last[4]) {
      node.source.end = { line: last[4], column: last[5] };
    } else {
      node.source.end = { line: last[2], column: last[3] };
    }

    while (tokens[0][0] !== 'word') {
      node.raws.before += tokens.shift()[1];
    }
    node.source.start = { line: tokens[0][2], column: tokens[0][3] };

    node.prop = '';
    while (tokens.length) {
      const type = tokens[0][0];
      if (type === ':' || type === 'space' || type === 'comment') {
        break;
      }
      node.prop += tokens.shift()[1];
    }

    node.raws.between = '';

    let token = void 0;
    while (tokens.length) {
      token = tokens.shift();

      if (token[0] === ':') {
        node.raws.between += token[1];
        break;
      } else {
        node.raws.between += token[1];
      }
    }

    if (node.prop[0] === '_' || node.prop[0] === '*') {
      node.raws.before += node.prop[0];
      node.prop = node.prop.slice(1);
    }
    node.raws.between += this.spacesFromStart(tokens);
    this.precheckMissedSemicolon(tokens);

    for (let i = tokens.length - 1; i > 0; i--) {
      token = tokens[i];
      if (token[1] === '!important') {
        node.important = true;
        let string = this.stringFrom(tokens, i);
        string = this.spacesFromEnd(tokens) + string;
        if (string !== ' !important') node.raws.important = string;
        break;
      } else if (token[1] === 'important') {
        const cache = tokens.slice(0);
        let str = '';
        for (let j = i; j > 0; j--) {
          const _type = cache[j][0];
          if (str.trim().indexOf('!') === 0 && _type !== 'space') {
            break;
          }
          str = cache.pop()[1] + str;
        }
        if (str.trim().indexOf('!') === 0) {
          node.important = true;
          node.raws.important = str;
          tokens = cache;
        }
      }

      if (token[0] !== 'space' && token[0] !== 'comment') {
        break;
      }
    }

    this.raw(node, 'value', tokens);

    if (node.value.indexOf(':') !== -1) this.checkMissedSemicolon(tokens);
  };

  Parser.prototype.atrule = function atrule(token) {
    const node = new AtRule();
    node.name = token[1].slice(1);
    if (node.name === '') {
      this.unnamedAtrule(node, token);
    }
    this.init(node, token[2], token[3]);

    let last = false;
    let open = false;
    const params = [];

    this.pos += 1;
    while (this.pos < this.tokens.length) {
      token = this.tokens[this.pos];

      if (token[0] === ';') {
        node.source.end = { line: token[2], column: token[3] };
        this.semicolon = true;
        break;
      } else if (token[0] === '{') {
        open = true;
        break;
      } else if (token[0] === '}') {
        this.end(token);
        break;
      } else {
        params.push(token);
      }

      this.pos += 1;
    }
    if (this.pos === this.tokens.length) {
      last = true;
    }

    node.raws.between = this.spacesFromEnd(params);
    if (params.length) {
      node.raws.afterName = this.spacesFromStart(params);
      this.raw(node, 'params', params);
      if (last) {
        token = params[params.length - 1];
        node.source.end = { line: token[4], column: token[5] };
        this.spaces = node.raws.between;
        node.raws.between = '';
      }
    } else {
      node.raws.afterName = '';
      node.params = '';
    }

    if (open) {
      node.nodes = [];
      this.current = node;
    }
  };

  Parser.prototype.end = function end(token) {
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon;
    }
    this.semicolon = false;

    this.current.raws.after = (this.current.raws.after || '') + this.spaces;
    this.spaces = '';

    if (this.current.parent) {
      this.current.source.end = { line: token[2], column: token[3] };
      this.current = this.current.parent;
    } else {
      this.unexpectedClose(token);
    }
  };

  Parser.prototype.endFile = function endFile() {
    if (this.current.parent) this.unclosedBlock();
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon;
    }
    this.current.raws.after = (this.current.raws.after || '') + this.spaces;
  };

  // Helpers

  Parser.prototype.init = function init(node, line, column) {
    this.current.push(node);

    node.source = { start: { line, column }, input: this.input };
    node.raws.before = this.spaces;
    this.spaces = '';
    if (node.type !== 'comment') this.semicolon = false;
  };

  Parser.prototype.raw = function raw(node, prop, tokens) {
    let token = void 0;
        let type = void 0;
    const {length} = tokens;
    let value = '';
    let clean = true;
    for (let i = 0; i < length; i += 1) {
      token = tokens[i];
      type = token[0];
      if (type === 'comment' || type === 'space' && i === length - 1) {
        clean = false;
      } else {
        value += token[1];
      }
    }
    if (!clean) {
      const raw = tokens.reduce((all, i) => all + i[1], '');
      node.raws[prop] = { value, raw };
    }
    node[prop] = value;
  };

  Parser.prototype.spacesFromEnd = function spacesFromEnd(tokens) {
    let lastTokenType = void 0;
    let spaces = '';
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0];
      if (lastTokenType !== 'space' && lastTokenType !== 'comment') break;
      spaces = tokens.pop()[1] + spaces;
    }
    return spaces;
  };

  Parser.prototype.spacesFromStart = function spacesFromStart(tokens) {
    let next = void 0;
    let spaces = '';
    while (tokens.length) {
      next = tokens[0][0];
      if (next !== 'space' && next !== 'comment') break;
      spaces += tokens.shift()[1];
    }
    return spaces;
  };

  Parser.prototype.stringFrom = function stringFrom(tokens, from) {
    let result = '';
    for (let i = from; i < tokens.length; i++) {
      result += tokens[i][1];
    }
    tokens.splice(from, tokens.length - from);
    return result;
  };

  Parser.prototype.colon = function colon(tokens) {
    let brackets = 0;
    let token = void 0;
        let type = void 0;
        let prev = void 0;
    for (let i = 0; i < tokens.length; i++) {
      token = tokens[i];
      type = token[0];

      if (type === '(') {
        brackets += 1;
      } else if (type === ')') {
        brackets -= 1;
      } else if (brackets === 0 && type === ':') {
        if (!prev) {
          this.doubleColon(token);
        } else if (prev[0] === 'word' && prev[1] === 'progid') {
          continue;
        } else {
          return i;
        }
      }

      prev = token;
    }
    return false;
  };

  // Errors

  Parser.prototype.unclosedBracket = function unclosedBracket(bracket) {
    throw this.input.error('Unclosed bracket', bracket[2], bracket[3]);
  };

  Parser.prototype.unknownWord = function unknownWord(start) {
    const token = this.tokens[start];
    throw this.input.error('Unknown word', token[2], token[3]);
  };

  Parser.prototype.unexpectedClose = function unexpectedClose(token) {
    throw this.input.error('Unexpected }', token[2], token[3]);
  };

  Parser.prototype.unclosedBlock = function unclosedBlock() {
    const pos = this.current.source.start;
    throw this.input.error('Unclosed block', pos.line, pos.column);
  };

  Parser.prototype.doubleColon = function doubleColon(token) {
    throw this.input.error('Double colon', token[2], token[3]);
  };

  Parser.prototype.unnamedAtrule = function unnamedAtrule(node, token) {
    throw this.input.error('At-rule without name', token[2], token[3]);
  };

  Parser.prototype.precheckMissedSemicolon = function precheckMissedSemicolon(tokens) {
  };

  Parser.prototype.checkMissedSemicolon = function checkMissedSemicolon(tokens) {
    const colon = this.colon(tokens);
    if (colon === false) return;

    let founded = 0;
    let token = void 0;
    for (let j = colon - 1; j >= 0; j--) {
      token = tokens[j];
      if (token[0] !== 'space') {
        founded += 1;
        if (founded === 2) break;
      }
    }
    throw this.input.error('Missed semicolon', token[2], token[3]);
  };

  return Parser;
}();

// 

function parse(css, opts) {
  if (opts && opts.safe) {
    throw new Error('Option safe was removed. ' + 'Use parser: require("postcss-safe-parser")');
  }

  const input = new Input(css, opts);

  const parser = new Parser(input);
  try {
    parser.tokenize();
    parser.loop();
  } catch (e) {
    if (e.name === 'CssSyntaxError' && opts && opts.from) {
      if (/\.scss$/i.test(opts.from)) {
        e.message += '\nYou tried to parse SCSS with ' + 'the standard CSS parser; ' + 'try again with the postcss-scss parser';
      } else if (/\.less$/i.test(opts.from)) {
        e.message += '\nYou tried to parse Less with ' + 'the standard CSS parser; ' + 'try again with the postcss-less parser';
      }
    }
    throw e;
  }

  return parser.root;
}

// 

function cleanSource(nodes) {
  return nodes.map((i) => {
    if (i.nodes) i.nodes = cleanSource(i.nodes);
    delete i.source;
    return i;
  });
}

/**
 * @callback childCondition
 * @param {Node} node    - container child
 * @param {number} index - child index
 * @param {Node[]} nodes - all container children
 * @return {boolean}
 */

/**
 * @callback childIterator
 * @param {Node} node    - container child
 * @param {number} index - child index
 * @return {false|undefined} returning `false` will break iteration
 */

/**
 * The {@link Root}, {@link AtRule}, and {@link Rule} container nodes
 * inherit some common methods to help work with their children.
 *
 * Note that all containers can store any content. If you write a rule inside
 * a rule, PostCSS will parse it.
 *
 * @extends Node
 * @abstract
 */

const Container = function (_Node) {
  inherits(Container, _Node);

  function Container() {
    classCallCheck(this, Container);
    return possibleConstructorReturn(this, _Node.apply(this, arguments));
  }

  Container.prototype.push = function push(child) {
    child.parent = this;
    this.nodes.push(child);
    return this;
  };

  /**
   * Iterates through the container’s immediate children,
   * calling `callback` for each child.
   *
   * Returning `false` in the callback will break iteration.
   *
   * This method only iterates through the container’s immediate children.
   * If you need to recursively iterate through all the container’s descendant
   * nodes, use {@link Container#walk}.
   *
   * Unlike the for `{}`-cycle or `Array#forEach` this iterator is safe
   * if you are mutating the array of child nodes during iteration.
   * PostCSS will adjust the current index to match the mutations.
   *
   * @param {childIterator} callback - iterator receives each node and index
   *
   * @return {false|undefined} returns `false` if iteration was broke
   *
   * @example
   * const root = postcss.parse('a { color: black; z-index: 1 }');
   * const rule = root.first;
   *
   * for ( let decl of rule.nodes ) {
   *     decl.cloneBefore({ prop: '-webkit-' + decl.prop });
   *     // Cycle will be infinite, because cloneBefore moves the current node
   *     // to the next index
   * }
   *
   * rule.each(decl => {
   *     decl.cloneBefore({ prop: '-webkit-' + decl.prop });
   *     // Will be executed only for color and z-index
   * });
   */


  Container.prototype.each = function each(callback) {
    if (!this.lastEach) this.lastEach = 0;
    if (!this.indexes) this.indexes = {};

    this.lastEach += 1;
    const id = this.lastEach;
    this.indexes[id] = 0;

    if (!this.nodes) return undefined;

    let index = void 0;
        let result = void 0;
    while (this.indexes[id] < this.nodes.length) {
      index = this.indexes[id];
      result = callback(this.nodes[index], index);
      if (result === false) break;

      this.indexes[id] += 1;
    }

    delete this.indexes[id];

    return result;
  };

  /**
   * Traverses the container’s descendant nodes, calling callback
   * for each node.
   *
   * Like container.each(), this method is safe to use
   * if you are mutating arrays during iteration.
   *
   * If you only need to iterate through the container’s immediate children,
   * use {@link Container#each}.
   *
   * @param {childIterator} callback - iterator receives each node and index
   *
   * @return {false|undefined} returns `false` if iteration was broke
   *
   * @example
   * root.walk(node => {
   *   // Traverses all descendant nodes.
   * });
   */


  Container.prototype.walk = function walk(callback) {
    return this.each((child, i) => {
      let result = callback(child, i);
      if (result !== false && child.walk) {
        result = child.walk(callback);
      }
      return result;
    });
  };

  /**
   * Traverses the container’s descendant nodes, calling callback
   * for each declaration node.
   *
   * If you pass a filter, iteration will only happen over declarations
   * with matching properties.
   *
   * Like {@link Container#each}, this method is safe
   * to use if you are mutating arrays during iteration.
   *
   * @param {string|RegExp} [prop]   - string or regular expression
   *                                   to filter declarations by property name
   * @param {childIterator} callback - iterator receives each node and index
   *
   * @return {false|undefined} returns `false` if iteration was broke
   *
   * @example
   * root.walkDecls(decl => {
   *   checkPropertySupport(decl.prop);
   * });
   *
   * root.walkDecls('border-radius', decl => {
   *   decl.remove();
   * });
   *
   * root.walkDecls(/^background/, decl => {
   *   decl.value = takeFirstColorFromGradient(decl.value);
   * });
   */


  Container.prototype.walkDecls = function walkDecls(prop, callback) {
    if (!callback) {
      callback = prop;
      return this.walk((child, i) => {
        if (child.type === 'decl') {
          return callback(child, i);
        }
      });
    } else if (prop instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === 'decl' && prop.test(child.prop)) {
          return callback(child, i);
        }
      });
    } else {
      return this.walk((child, i) => {
        if (child.type === 'decl' && child.prop === prop) {
          return callback(child, i);
        }
      });
    }
  };

  /**
   * Traverses the container’s descendant nodes, calling callback
   * for each rule node.
   *
   * If you pass a filter, iteration will only happen over rules
   * with matching selectors.
   *
   * Like {@link Container#each}, this method is safe
   * to use if you are mutating arrays during iteration.
   *
   * @param {string|RegExp} [selector] - string or regular expression
   *                                     to filter rules by selector
   * @param {childIterator} callback   - iterator receives each node and index
   *
   * @return {false|undefined} returns `false` if iteration was broke
   *
   * @example
   * const selectors = [];
   * root.walkRules(rule => {
   *   selectors.push(rule.selector);
   * });
   * console.log(`Your CSS uses ${selectors.length} selectors`);
   */


  Container.prototype.walkRules = function walkRules(selector, callback) {
    if (!callback) {
      callback = selector;

      return this.walk((child, i) => {
        if (child.type === 'rule') {
          return callback(child, i);
        }
      });
    } else if (selector instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === 'rule' && selector.test(child.selector)) {
          return callback(child, i);
        }
      });
    } else {
      return this.walk((child, i) => {
        if (child.type === 'rule' && child.selector === selector) {
          return callback(child, i);
        }
      });
    }
  };

  /**
   * Traverses the container’s descendant nodes, calling callback
   * for each at-rule node.
   *
   * If you pass a filter, iteration will only happen over at-rules
   * that have matching names.
   *
   * Like {@link Container#each}, this method is safe
   * to use if you are mutating arrays during iteration.
   *
   * @param {string|RegExp} [name]   - string or regular expression
   *                                   to filter at-rules by name
   * @param {childIterator} callback - iterator receives each node and index
   *
   * @return {false|undefined} returns `false` if iteration was broke
   *
   * @example
   * root.walkAtRules(rule => {
   *   if ( isOld(rule.name) ) rule.remove();
   * });
   *
   * let first = false;
   * root.walkAtRules('charset', rule => {
   *   if ( !first ) {
   *     first = true;
   *   } else {
   *     rule.remove();
   *   }
   * });
   */


  Container.prototype.walkAtRules = function walkAtRules(name, callback) {
    if (!callback) {
      callback = name;
      return this.walk((child, i) => {
        if (child.type === 'atrule') {
          return callback(child, i);
        }
      });
    } else if (name instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === 'atrule' && name.test(child.name)) {
          return callback(child, i);
        }
      });
    } else {
      return this.walk((child, i) => {
        if (child.type === 'atrule' && child.name === name) {
          return callback(child, i);
        }
      });
    }
  };

  /**
   * Traverses the container’s descendant nodes, calling callback
   * for each comment node.
   *
   * Like {@link Container#each}, this method is safe
   * to use if you are mutating arrays during iteration.
   *
   * @param {childIterator} callback - iterator receives each node and index
   *
   * @return {false|undefined} returns `false` if iteration was broke
   *
   * @example
   * root.walkComments(comment => {
   *   comment.remove();
   * });
   */


  Container.prototype.walkComments = function walkComments(callback) {
    return this.walk((child, i) => {
      if (child.type === 'comment') {
        return callback(child, i);
      }
    });
  };

  /**
   * Inserts new nodes to the start of the container.
   *
   * @param {...(Node|object|string|Node[])} children - new nodes
   *
   * @return {Node} this node for methods chain
   *
   * @example
   * const decl1 = postcss.decl({ prop: 'color', value: 'black' });
   * const decl2 = postcss.decl({ prop: 'background-color', value: 'white' });
   * rule.append(decl1, decl2);
   *
   * root.append({ name: 'charset', params: '"UTF-8"' });  // at-rule
   * root.append({ selector: 'a' });                       // rule
   * rule.append({ prop: 'color', value: 'black' });       // declaration
   * rule.append({ text: 'Comment' })                      // comment
   *
   * root.append('a {}');
   * root.first.append('color: black; z-index: 1');
   */


  Container.prototype.append = function append() {
    const _this2 = this;

    for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
      children[_key] = arguments[_key];
    }

    children.forEach((child) => {
      const nodes = _this2.normalize(child, _this2.last);
      nodes.forEach((node) => _this2.nodes.push(node));
    });
    return this;
  };

  /**
   * Inserts new nodes to the end of the container.
   *
   * @param {...(Node|object|string|Node[])} children - new nodes
   *
   * @return {Node} this node for methods chain
   *
   * @example
   * const decl1 = postcss.decl({ prop: 'color', value: 'black' });
   * const decl2 = postcss.decl({ prop: 'background-color', value: 'white' });
   * rule.prepend(decl1, decl2);
   *
   * root.append({ name: 'charset', params: '"UTF-8"' });  // at-rule
   * root.append({ selector: 'a' });                       // rule
   * rule.append({ prop: 'color', value: 'black' });       // declaration
   * rule.append({ text: 'Comment' })                      // comment
   *
   * root.append('a {}');
   * root.first.append('color: black; z-index: 1');
   */


  Container.prototype.prepend = function prepend() {
    const _this3 = this;

    for (var _len2 = arguments.length, children = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      children[_key2] = arguments[_key2];
    }

    children = children.reverse();
    children.forEach((child) => {
      const nodes = _this3.normalize(child, _this3.first, 'prepend').reverse();
      nodes.forEach((node) => _this3.nodes.unshift(node));
      for (const id in _this3.indexes) {
        _this3.indexes[id] = _this3.indexes[id] + nodes.length;
      }
    });
    return this;
  };

  Container.prototype.cleanRaws = function cleanRaws(keepBetween) {
    _Node.prototype.cleanRaws.call(this, keepBetween);
    if (this.nodes) {
      this.nodes.forEach((node) => node.cleanRaws(keepBetween));
    }
  };

  /**
   * Insert new node before old node within the container.
   *
   * @param {Node|number} exist             - child or child’s index.
   * @param {Node|object|string|Node[]} add - new node
   *
   * @return {Node} this node for methods chain
   *
   * @example
   * rule.insertBefore(decl, decl.clone({ prop: '-webkit-' + decl.prop }));
   */


  Container.prototype.insertBefore = function insertBefore(exist, add) {
    const _this4 = this;

    exist = this.index(exist);

    const type = exist === 0 ? 'prepend' : false;
    const nodes = this.normalize(add, this.nodes[exist], type).reverse();
    nodes.forEach((node) => _this4.nodes.splice(exist, 0, node));

    let index = void 0;
    for (const id in this.indexes) {
      index = this.indexes[id];
      if (exist <= index) {
        this.indexes[id] = index + nodes.length;
      }
    }

    return this;
  };

  /**
   * Insert new node after old node within the container.
   *
   * @param {Node|number} exist             - child or child’s index
   * @param {Node|object|string|Node[]} add - new node
   *
   * @return {Node} this node for methods chain
   */


  Container.prototype.insertAfter = function insertAfter(exist, add) {
    const _this5 = this;

    exist = this.index(exist);

    const nodes = this.normalize(add, this.nodes[exist]).reverse();
    nodes.forEach((node) => _this5.nodes.splice(exist + 1, 0, node));

    let index = void 0;
    for (const id in this.indexes) {
      index = this.indexes[id];
      if (exist < index) {
        this.indexes[id] = index + nodes.length;
      }
    }

    return this;
  };

  Container.prototype.remove = function remove(child) {
    if (typeof child !== 'undefined') {
      warnOnce('Container#remove is deprecated. ' + 'Use Container#removeChild');
      this.removeChild(child);
    } else {
      _Node.prototype.remove.call(this);
    }
    return this;
  };

  /**
   * Removes node from the container and cleans the parent properties
   * from the node and its children.
   *
   * @param {Node|number} child - child or child’s index
   *
   * @return {Node} this node for methods chain
   *
   * @example
   * rule.nodes.length  //=> 5
   * rule.removeChild(decl);
   * rule.nodes.length  //=> 4
   * decl.parent        //=> undefined
   */


  Container.prototype.removeChild = function removeChild(child) {
    child = this.index(child);
    this.nodes[child].parent = undefined;
    this.nodes.splice(child, 1);

    let index = void 0;
    for (const id in this.indexes) {
      index = this.indexes[id];
      if (index >= child) {
        this.indexes[id] = index - 1;
      }
    }

    return this;
  };

  /**
   * Removes all children from the container
   * and cleans their parent properties.
   *
   * @return {Node} this node for methods chain
   *
   * @example
   * rule.removeAll();
   * rule.nodes.length //=> 0
   */


  Container.prototype.removeAll = function removeAll() {
    this.nodes.forEach((node) => node.parent = undefined);
    this.nodes = [];
    return this;
  };

  /**
     * Passes all declaration values within the container that match pattern
     * through callback, replacing those values with the returned result
     * of callback.
     *
     * This method is useful if you are using a custom unit or function
     * and need to iterate through all values.
     *
     * @param {string|RegExp} pattern      - replace pattern
     * @param {object} opts                - options to speed up the search
     * @param {string|string[]} opts.props - an array of property names
     * @param {string} opts.fast           - string that’s used
     *                                       to narrow down values and speed up
                                             the regexp search
     * @param {function|string} callback   - string to replace pattern
     *                                       or callback that returns a new
     *                                       value.
     *                                       The callback will receive
     *                                       the same arguments as those
     *                                       passed to a function parameter
     *                                       of `String#replace`.
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * root.replaceValues(/\d+rem/, { fast: 'rem' }, string => {
     *   return 15 * parseInt(string) + 'px';
     * });
     */


  Container.prototype.replaceValues = function replaceValues(pattern, opts, callback) {
    if (!callback) {
      callback = opts;
      opts = {};
    }

    this.walkDecls((decl) => {
      if (opts.props && opts.props.indexOf(decl.prop) === -1) return;
      if (opts.fast && decl.value.indexOf(opts.fast) === -1) return;

      decl.value = decl.value.replace(pattern, callback);
    });

    return this;
  };

  /**
   * Returns `true` if callback returns `true`
   * for all of the container’s children.
   *
   * @param {childCondition} condition - iterator returns true or false.
   *
   * @return {boolean} is every child pass condition
   *
   * @example
   * const noPrefixes = rule.every(i => i.prop[0] !== '-');
   */


  Container.prototype.every = function every(condition) {
    return this.nodes.every(condition);
  };

  /**
   * Returns `true` if callback returns `true` for (at least) one
   * of the container’s children.
   *
   * @param {childCondition} condition - iterator returns true or false.
   *
   * @return {boolean} is some child pass condition
   *
   * @example
   * const hasPrefix = rule.some(i => i.prop[0] === '-');
   */


  Container.prototype.some = function some(condition) {
    return this.nodes.some(condition);
  };

  /**
   * Returns a `child`’s index within the {@link Container#nodes} array.
   *
   * @param {Node} child - child of the current container.
   *
   * @return {number} child index
   *
   * @example
   * rule.index( rule.nodes[2] ) //=> 2
   */


  Container.prototype.index = function index(child) {
    if (typeof child === 'number') {
      return child;
    } else {
      return this.nodes.indexOf(child);
    }
  };

  /**
   * The container’s first child.
   *
   * @type {Node}
   *
   * @example
   * rule.first == rules.nodes[0];
   */


  Container.prototype.normalize = function normalize(nodes, sample) {
    const _this6 = this;

    if (typeof nodes === 'string') {
      nodes = cleanSource(parse(nodes).nodes);
    } else if (!Array.isArray(nodes)) {
      if (nodes.type === 'root') {
        nodes = nodes.nodes;
      } else if (nodes.type) {
        nodes = [nodes];
      } else if (nodes.prop) {
        if (typeof nodes.value === 'undefined') {
          throw new Error('Value field is missed in node creation');
        } else if (typeof nodes.value !== 'string') {
          nodes.value = String(nodes.value);
        }
        nodes = [new Declaration(nodes)];
      } else if (nodes.selector) {
        nodes = [new Rule(nodes)];
      } else if (nodes.name) {
        nodes = [new AtRule(nodes)];
      } else if (nodes.text) {
        nodes = [new Comment(nodes)];
      } else {
        throw new Error('Unknown node type in node creation');
      }
    }

    const processed = nodes.map((i) => {
      if (typeof i.raws === 'undefined') i = _this6.rebuild(i);

      if (i.parent) i = i.clone();
      if (typeof i.raws.before === 'undefined') {
        if (sample && typeof sample.raws.before !== 'undefined') {
          i.raws.before = sample.raws.before.replace(/[^\s]/g, '');
        }
      }
      i.parent = _this6;
      return i;
    });

    return processed;
  };

  Container.prototype.rebuild = function rebuild(node, parent) {
    const _this7 = this;

    let fix = void 0;
    if (node.type === 'root') {
      fix = new Root();
    } else if (node.type === 'atrule') {
      fix = new AtRule();
    } else if (node.type === 'rule') {
      fix = new Rule();
    } else if (node.type === 'decl') {
      fix = new Declaration();
    } else if (node.type === 'comment') {
      fix = new Comment();
    }

    for (const i in node) {
      if (i === 'nodes') {
        fix.nodes = node.nodes.map((j) => _this7.rebuild(j, fix));
      } else if (i === 'parent' && parent) {
        fix.parent = parent;
      } else if (node.hasOwnProperty(i)) {
        fix[i] = node[i];
      }
    }

    return fix;
  };

  Container.prototype.eachInside = function eachInside(callback) {
    warnOnce('Container#eachInside is deprecated. ' + 'Use Container#walk instead.');
    return this.walk(callback);
  };

  Container.prototype.eachDecl = function eachDecl(prop, callback) {
    warnOnce('Container#eachDecl is deprecated. ' + 'Use Container#walkDecls instead.');
    return this.walkDecls(prop, callback);
  };

  Container.prototype.eachRule = function eachRule(selector, callback) {
    warnOnce('Container#eachRule is deprecated. ' + 'Use Container#walkRules instead.');
    return this.walkRules(selector, callback);
  };

  Container.prototype.eachAtRule = function eachAtRule(name, callback) {
    warnOnce('Container#eachAtRule is deprecated. ' + 'Use Container#walkAtRules instead.');
    return this.walkAtRules(name, callback);
  };

  Container.prototype.eachComment = function eachComment(callback) {
    warnOnce('Container#eachComment is deprecated. ' + 'Use Container#walkComments instead.');
    return this.walkComments(callback);
  };

  createClass(Container, [{
    key: 'first',
    get: function get$$1() {
      if (!this.nodes) return undefined;
      return this.nodes[0];
    }

    /**
     * The container’s last child.
     *
     * @type {Node}
     *
     * @example
     * rule.last == rule.nodes[rule.nodes.length - 1];
     */

  }, {
    key: 'last',
    get: function get$$1() {
      if (!this.nodes) return undefined;
      return this.nodes[this.nodes.length - 1];
    }
  }, {
    key: 'semicolon',
    get: function get$$1() {
      warnOnce('Node#semicolon is deprecated. Use Node#raws.semicolon');
      return this.raws.semicolon;
    },
    set: function set$$1(val) {
      warnOnce('Node#semicolon is deprecated. Use Node#raws.semicolon');
      this.raws.semicolon = val;
    }
  }, {
    key: 'after',
    get: function get$$1() {
      warnOnce('Node#after is deprecated. Use Node#raws.after');
      return this.raws.after;
    },
    set: function set$$1(val) {
      warnOnce('Node#after is deprecated. Use Node#raws.after');
      this.raws.after = val;
    }

    /**
     * @memberof Container#
     * @member {Node[]} nodes - an array containing the container’s children
     *
     * @example
     * const root = postcss.parse('a { color: black }');
     * root.nodes.length           //=> 1
     * root.nodes[0].selector      //=> 'a'
     * root.nodes[0].nodes[0].prop //=> 'color'
     */

  }]);
  return Container;
}(Node);

// 

/**
 * Represents an at-rule.
 *
 * If it’s followed in the CSS by a {} block, this node will have
 * a nodes property representing its children.
 *
 * @extends Container
 *
 * @example
 * const root = postcss.parse('@charset "UTF-8"; @media print {}');
 *
 * const charset = root.first;
 * charset.type  //=> 'atrule'
 * charset.nodes //=> undefined
 *
 * const media = root.last;
 * media.nodes   //=> []
 */

var AtRule = function (_Container) {
  inherits(AtRule, _Container);

  function AtRule(defaults$$1) {
    classCallCheck(this, AtRule);

    const _this = possibleConstructorReturn(this, _Container.call(this, defaults$$1));

    _this.type = 'atrule';
    return _this;
  }

  AtRule.prototype.append = function append() {
    let _Container$prototype$;

    if (!this.nodes) this.nodes = [];

    for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
      children[_key] = arguments[_key];
    }

    return (_Container$prototype$ = _Container.prototype.append).call.apply(_Container$prototype$, [this].concat(children));
  };

  AtRule.prototype.prepend = function prepend() {
    let _Container$prototype$2;

    if (!this.nodes) this.nodes = [];

    for (var _len2 = arguments.length, children = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      children[_key2] = arguments[_key2];
    }

    return (_Container$prototype$2 = _Container.prototype.prepend).call.apply(_Container$prototype$2, [this].concat(children));
  };

  createClass(AtRule, [{
    key: 'afterName',
    get: function get$$1() {
      warnOnce('AtRule#afterName was deprecated. Use AtRule#raws.afterName');
      return this.raws.afterName;
    },
    set: function set$$1(val) {
      warnOnce('AtRule#afterName was deprecated. Use AtRule#raws.afterName');
      this.raws.afterName = val;
    }
  }, {
    key: '_params',
    get: function get$$1() {
      warnOnce('AtRule#_params was deprecated. Use AtRule#raws.params');
      return this.raws.params;
    },
    set: function set$$1(val) {
      warnOnce('AtRule#_params was deprecated. Use AtRule#raws.params');
      this.raws.params = val;
    }

    /**
     * @memberof AtRule#
     * @member {string} name - the at-rule’s name immediately follows the `@`
     *
     * @example
     * const root  = postcss.parse('@media print {}');
     * media.name //=> 'media'
     * const media = root.first;
     */

    /**
     * @memberof AtRule#
     * @member {string} params - the at-rule’s parameters, the values
     *                           that follow the at-rule’s name but precede
     *                           any {} block
     *
     * @example
     * const root  = postcss.parse('@media print, screen {}');
     * const media = root.first;
     * media.params //=> 'print, screen'
     */

    /**
     * @memberof AtRule#
     * @member {object} raws - Information to generate byte-to-byte equal
     *                         node string as it was in the origin input.
     *
     * Every parser saves its own properties,
     * but the default CSS parser uses:
     *
     * * `before`: the space symbols before the node. It also stores `*`
     *   and `_` symbols before the declaration (IE hack).
     * * `after`: the space symbols after the last child of the node
     *   to the end of the node.
     * * `between`: the symbols between the property and value
     *   for declarations, selector and `{` for rules, or last parameter
     *   and `{` for at-rules.
     * * `semicolon`: contains true if the last child has
     *   an (optional) semicolon.
     * * `afterName`: the space between the at-rule name and its parameters.
     *
     * PostCSS cleans at-rule parameters from comments and extra spaces,
     * but it stores origin content in raws properties.
     * As such, if you don’t change a declaration’s value,
     * PostCSS will use the raw value with comments.
     *
     * @example
     * const root = postcss.parse('  @media\nprint {\n}')
     * root.first.first.raws //=> { before: '  ',
     *                       //     between: ' ',
     *                       //     afterName: '\n',
     *                       //     after: '\n' }
     */

  }]);
  return AtRule;
}(Container);

// 
/**
 * Contains helpers for safely splitting lists of CSS values,
 * preserving parentheses and quotes.
 *
 * @example
 * const list = postcss.list;
 *
 * @namespace list
 */
var list = {
  split: function split(string, separators, last) {
    const array = [];
    let current = '';
    let split = false;

    let func = 0;
    let quote = false;
    let escape = false;

    for (let i = 0; i < string.length; i++) {
      const letter = string[i];

      if (quote) {
        if (escape) {
          escape = false;
        } else if (letter === '\\') {
          escape = true;
        } else if (letter === quote) {
          quote = false;
        }
      } else if (letter === '"' || letter === "'") {
        quote = letter;
      } else if (letter === '(') {
        func += 1;
      } else if (letter === ')') {
        if (func > 0) func -= 1;
      } else if (func === 0) {
        if (separators.indexOf(letter) !== -1) split = true;
      }

      if (split) {
        if (current !== '') array.push(current.trim());
        current = '';
        split = false;
      } else {
        current += letter;
      }
    }

    if (last || current !== '') array.push(current.trim());
    return array;
  },


  /**
   * Safely splits space-separated values (such as those for `background`,
   * `border-radius`, and other shorthand properties).
   *
   * @param {string} string - space-separated values
   *
   * @return {string[]} splitted values
   *
   * @example
   * postcss.list.space('1px calc(10% + 1px)') //=> ['1px', 'calc(10% + 1px)']
   */
  space: function space(string) {
    const spaces = [' ', '\n', '\t'];
    return list.split(string, spaces);
  },


  /**
   * Safely splits comma-separated values (such as those for `transition-*`
   * and `background` properties).
   *
   * @param {string} string - comma-separated values
   *
   * @return {string[]} splitted values
   *
   * @example
   * postcss.list.comma('black, linear-gradient(white, black)')
   * //=> ['black', 'linear-gradient(white, black)']
   */
  comma: function comma(string) {
    const comma = ',';
    return list.split(string, [comma], true);
  }
};

// 

/**
 * Represents a CSS rule: a selector followed by a declaration block.
 *
 * @extends Container
 *
 * @example
 * const root = postcss.parse('a{}');
 * const rule = root.first;
 * rule.type       //=> 'rule'
 * rule.toString() //=> 'a{}'
 */

var Rule = function (_Container) {
  inherits(Rule, _Container);

  function Rule(defaults$$1) {
    classCallCheck(this, Rule);

    const _this = possibleConstructorReturn(this, _Container.call(this, defaults$$1));

    _this.type = 'rule';
    if (!_this.nodes) _this.nodes = [];
    return _this;
  }

  /**
   * An array containing the rule’s individual selectors.
   * Groups of selectors are split at commas.
   *
   * @type {string[]}
   *
   * @example
   * const root = postcss.parse('a, b { }');
   * const rule = root.first;
   *
   * rule.selector  //=> 'a, b'
   * rule.selectors //=> ['a', 'b']
   *
   * rule.selectors = ['a', 'strong'];
   * rule.selector //=> 'a, strong'
   */


  createClass(Rule, [{
    key: 'selectors',
    get: function get$$1() {
      return list.comma(this.selector);
    },
    set: function set$$1(values) {
      const match = this.selector ? this.selector.match(/,\s*/) : null;
      const sep = match ? match[0] : `,${  this.raw('between', 'beforeOpen')}`;
      this.selector = values.join(sep);
    }
  }, {
    key: '_selector',
    get: function get$$1() {
      warnOnce('Rule#_selector is deprecated. Use Rule#raws.selector');
      return this.raws.selector;
    },
    set: function set$$1(val) {
      warnOnce('Rule#_selector is deprecated. Use Rule#raws.selector');
      this.raws.selector = val;
    }

    /**
     * @memberof Rule#
     * @member {string} selector - the rule’s full selector represented
     *                             as a string
     *
     * @example
     * const root = postcss.parse('a, b { }');
     * const rule = root.first;
     * rule.selector //=> 'a, b'
     */

    /**
     * @memberof Rule#
     * @member {object} raws - Information to generate byte-to-byte equal
     *                         node string as it was in the origin input.
     *
     * Every parser saves its own properties,
     * but the default CSS parser uses:
     *
     * * `before`: the space symbols before the node. It also stores `*`
     *   and `_` symbols before the declaration (IE hack).
     * * `after`: the space symbols after the last child of the node
     *   to the end of the node.
     * * `between`: the symbols between the property and value
     *   for declarations, selector and `{` for rules, or last parameter
     *   and `{` for at-rules.
     * * `semicolon`: contains true if the last child has
     *   an (optional) semicolon.
     *
     * PostCSS cleans selectors from comments and extra spaces,
     * but it stores origin content in raws properties.
     * As such, if you don’t change a declaration’s value,
     * PostCSS will use the raw value with comments.
     *
     * @example
     * const root = postcss.parse('a {\n  color:black\n}')
     * root.first.first.raws //=> { before: '', between: ' ', after: '\n' }
     */

  }]);
  return Rule;
}(Container);

// 
/**
 * Represents a plugin’s warning. It can be created using {@link Node#warn}.
 *
 * @example
 * if ( decl.important ) {
 *     decl.warn(result, 'Avoid !important', { word: '!important' });
 * }
 */
const Warning = function () {
  /**
   * @param {string} text        - warning message
   * @param {Object} [opts]      - warning options
   * @param {Node}   opts.node   - CSS node that caused the warning
   * @param {string} opts.word   - word in CSS source that caused the warning
   * @param {number} opts.index  - index in CSS node string that caused
   *                               the warning
   * @param {string} opts.plugin - name of the plugin that created
   *                               this warning. {@link Result#warn} fills
   *                               this property automatically.
   */
  function Warning(text) {
    const opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Warning);

    /**
     * @member {string} - Type to filter warnings from
     *                    {@link Result#messages}. Always equal
     *                    to `"warning"`.
     *
     * @example
     * const nonWarning = result.messages.filter(i => i.type !== 'warning')
     */
    this.type = 'warning';
    /**
     * @member {string} - The warning message.
     *
     * @example
     * warning.text //=> 'Try to avoid !important'
     */
    this.text = text;

    if (opts.node && opts.node.source) {
      const pos = opts.node.positionBy(opts);
      /**
       * @member {number} - Line in the input file
       *                    with this warning’s source
       *
       * @example
       * warning.line //=> 5
       */
      this.line = pos.line;
      /**
       * @member {number} - Column in the input file
       *                    with this warning’s source.
       *
       * @example
       * warning.column //=> 6
       */
      this.column = pos.column;
    }

    for (const opt in opts) {
      this[opt] = opts[opt];
    }
  }

  /**
   * Returns a warning position and message.
   *
   * @example
   * warning.toString() //=> 'postcss-lint:a.css:10:14: Avoid !important'
   *
   * @return {string} warning position and message
   */


  Warning.prototype.toString = function toString() {
    if (this.node) {
      return this.node.error(this.text, {
        plugin: this.plugin,
        index: this.index,
        word: this.word
      }).message;
    } else if (this.plugin) {
      return `${this.plugin  }: ${  this.text}`;
    } else {
      return this.text;
    }
  };

  /**
   * @memberof Warning#
   * @member {string} plugin - The name of the plugin that created
   *                           it will fill this property automatically.
   *                           this warning. When you call {@link Node#warn}
   *
   * @example
   * warning.plugin //=> 'postcss-important'
   */

  /**
   * @memberof Warning#
   * @member {Node} node - Contains the CSS node that caused the warning.
   *
   * @example
   * warning.node.toString() //=> 'color: white !important'
   */


  return Warning;
}();

// 

/**
 * @typedef  {object} Message
 * @property {string} type   - message type
 * @property {string} plugin - source PostCSS plugin name
 */

/**
 * Provides the result of the PostCSS transformations.
 *
 * A Result instance is returned by {@link LazyResult#then}
 * or {@link Root#toResult} methods.
 *
 * @example
 * postcss([cssnext]).process(css).then(function (result) {
 *    console.log(result.css);
 * });
 *
 * @example
 * var result2 = postcss.parse(css).toResult();
 */

const Result = function () {
  /**
   * @param {Processor} processor - processor used for this transformation.
   * @param {Root}      root      - Root node after all transformations.
   * @param {processOptions} opts - options from the {@link Processor#process}
   *                                or {@link Root#toResult}
   */
  function Result(processor, root, opts) {
    classCallCheck(this, Result);

    /**
     * @member {Processor} - The Processor instance used
     *                       for this transformation.
     *
     * @example
     * for ( let plugin of result.processor.plugins) {
     *   if ( plugin.postcssPlugin === 'postcss-bad' ) {
     *     throw 'postcss-good is incompatible with postcss-bad';
     *   }
     * });
     */
    this.processor = processor;
    /**
     * @member {Message[]} - Contains messages from plugins
     *                       (e.g., warnings or custom messages).
     *                       Each message should have type
     *                       and plugin properties.
     *
     * @example
     * postcss.plugin('postcss-min-browser', () => {
     *   return (root, result) => {
     *     var browsers = detectMinBrowsersByCanIUse(root);
     *     result.messages.push({
     *       type:    'min-browser',
     *       plugin:  'postcss-min-browser',
     *       browsers: browsers
     *     });
     *   };
     * });
     */
    this.messages = [];
    /**
     * @member {Root} - Root node after all transformations.
     *
     * @example
     * root.toResult().root == root;
     */
    this.root = root;
    /**
     * @member {processOptions} - Options from the {@link Processor#process}
     *                            or {@link Root#toResult} call
     *                            that produced this Result instance.
     *
     * @example
     * root.toResult(opts).opts == opts;
     */
    this.opts = opts;
    /**
     * @member {string} - A CSS string representing of {@link Result#root}.
     *
     * @example
     * postcss.parse('a{}').toResult().css //=> "a{}"
     */
    this.css = undefined;
    /**
     * @member {SourceMapGenerator} - An instance of `SourceMapGenerator`
     *                                class from the `source-map` library,
     *                                representing changes
     *                                to the {@link Result#root} instance.
     *
     * @example
     * result.map.toJSON() //=> { version: 3, file: 'a.css', … }
     *
     * @example
     * if ( result.map ) {
     *   fs.writeFileSync(result.opts.to + '.map', result.map.toString());
     * }
     */
    this.map = undefined;
  }

  /**
   * Returns for @{link Result#css} content.
   *
   * @example
   * result + '' === result.css
   *
   * @return {string} string representing of {@link Result#root}
   */


  Result.prototype.toString = function toString() {
    return this.css;
  };

  /**
   * Creates an instance of {@link Warning} and adds it
   * to {@link Result#messages}.
   *
   * @param {string} text        - warning message
   * @param {Object} [opts]      - warning options
   * @param {Node}   opts.node   - CSS node that caused the warning
   * @param {string} opts.word   - word in CSS source that caused the warning
   * @param {number} opts.index  - index in CSS node string that caused
   *                               the warning
   * @param {string} opts.plugin - name of the plugin that created
   *                               this warning. {@link Result#warn} fills
   *                               this property automatically.
   *
   * @return {Warning} created warning
   */


  Result.prototype.warn = function warn(text) {
    const opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!opts.plugin) {
      if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
        opts.plugin = this.lastPlugin.postcssPlugin;
      }
    }

    const warning = new Warning(text, opts);
    this.messages.push(warning);

    return warning;
  };

  /**
   * Returns warnings from plugins. Filters {@link Warning} instances
   * from {@link Result#messages}.
   *
   * @example
   * result.warnings().forEach(warn => {
   *   console.warn(warn.toString());
   * });
   *
   * @return {Warning[]} warnings from plugins
   */


  Result.prototype.warnings = function warnings() {
    return this.messages.filter((i) => i.type === 'warning');
  };

  /**
   * An alias for the {@link Result#css} property.
   * Use it with syntaxes that generate non-CSS output.
   * @type {string}
   *
   * @example
   * result.css === result.content;
   */


  createClass(Result, [{
    key: 'content',
    get: function get$$1() {
      return this.css;
    }
  }]);
  return Result;
}();

// 

function isPromise(obj) {
  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && typeof obj.then === 'function';
}

/**
 * @callback onFulfilled
 * @param {Result} result
 */

/**
 * @callback onRejected
 * @param {Error} error
 */

/**
 * A Promise proxy for the result of PostCSS transformations.
 *
 * A `LazyResult` instance is returned by {@link Processor#process}.
 *
 * @example
 * const lazy = postcss([cssnext]).process(css);
 */

const LazyResult = function () {
  function LazyResult(processor, css, opts) {
    classCallCheck(this, LazyResult);

    this.stringified = false;
    this.processed = false;

    let root = void 0;
    if ((typeof css === 'undefined' ? 'undefined' : _typeof(css)) === 'object' && css.type === 'root') {
      root = css;
    } else if (css instanceof LazyResult || css instanceof Result) {
      root = css.root;
      if (css.map) {
        if (typeof opts.map === 'undefined') opts.map = {};
        if (!opts.map.inline) opts.map.inline = false;
        opts.map.prev = css.map;
      }
    } else {
      let parser = parse;
      if (opts.syntax) parser = opts.syntax.parse;
      if (opts.parser) parser = opts.parser;
      if (parser.parse) parser = parser.parse;

      try {
        root = parser(css, opts);
      } catch (error) {
        this.error = error;
      }
    }

    this.result = new Result(processor, root, opts);
  }

  /**
   * Returns a {@link Processor} instance, which will be used
   * for CSS transformations.
   * @type {Processor}
   */


  /**
   * Processes input CSS through synchronous plugins
   * and calls {@link Result#warnings()}.
   *
   * @return {Warning[]} warnings from plugins
   */
  LazyResult.prototype.warnings = function warnings() {
    return this.sync().warnings();
  };

  /**
   * Alias for the {@link LazyResult#css} property.
   *
   * @example
   * lazy + '' === lazy.css;
   *
   * @return {string} output CSS
   */


  LazyResult.prototype.toString = function toString() {
    return this.css;
  };

  /**
   * Processes input CSS through synchronous and asynchronous plugins
   * and calls `onFulfilled` with a Result instance. If a plugin throws
   * an error, the `onRejected` callback will be executed.
   *
   * It implements standard Promise API.
   *
   * @param {onFulfilled} onFulfilled - callback will be executed
   *                                    when all plugins will finish work
   * @param {onRejected}  onRejected  - callback will be execited on any error
   *
   * @return {Promise} Promise API to make queue
   *
   * @example
   * postcss([cssnext]).process(css).then(result => {
   *   console.log(result.css);
   * });
   */


  LazyResult.prototype.then = function then(onFulfilled, onRejected) {
    return this.async().then(onFulfilled, onRejected);
  };

  /**
   * Processes input CSS through synchronous and asynchronous plugins
   * and calls onRejected for each error thrown in any plugin.
   *
   * It implements standard Promise API.
   *
   * @param {onRejected} onRejected - callback will be execited on any error
   *
   * @return {Promise} Promise API to make queue
   *
   * @example
   * postcss([cssnext]).process(css).then(result => {
   *   console.log(result.css);
   * }).catch(error => {
   *   console.error(error);
   * });
   */


  LazyResult.prototype.catch = function _catch(onRejected) {
    return this.async().catch(onRejected);
  };

  LazyResult.prototype.handleError = function handleError(error, plugin) {
    try {
      this.error = error;
      if (error.name === 'CssSyntaxError' && !error.plugin) {
        error.plugin = plugin.postcssPlugin;
        error.setMessage();
      } else if (plugin.postcssVersion) {
        const pluginName = plugin.postcssPlugin;
        const pluginVer = plugin.postcssVersion;
        const runtimeVer = this.result.processor.version;
        const a = pluginVer.split('.');
        const b = runtimeVer.split('.');

        if (a[0] !== b[0] || parseInt(a[1]) > parseInt(b[1])) {
          warnOnce(`${'' + ('Your current PostCSS version ' + 'is ')}${  runtimeVer  }, but ${  pluginName  } ` + `uses ${  pluginVer  }. Perhaps this is ` + `the source of the error below.`);
        }
      }
    } catch (err) {
      if (console && console.error) console.error(err);
    }
  };

  LazyResult.prototype.asyncTick = function asyncTick(resolve, reject) {
    const _this = this;

    if (this.plugin >= this.processor.plugins.length) {
      this.processed = true;
      return resolve();
    }

    try {
      const plugin = this.processor.plugins[this.plugin];
      const promise = this.run(plugin);
      this.plugin += 1;

      if (isPromise(promise)) {
        promise.then(() => {
          _this.asyncTick(resolve, reject);
        }).catch((error) => {
          _this.handleError(error, plugin);
          _this.processed = true;
          reject(error);
        });
      } else {
        this.asyncTick(resolve, reject);
      }
    } catch (error) {
      this.processed = true;
      reject(error);
    }
  };

  LazyResult.prototype.async = function async() {
    const _this2 = this;

    if (this.processed) {
      return new Promise(((resolve, reject) => {
        if (_this2.error) {
          reject(_this2.error);
        } else {
          resolve(_this2.stringify());
        }
      }));
    }
    if (this.processing) {
      return this.processing;
    }

    this.processing = new Promise(((resolve, reject) => {
      if (_this2.error) return reject(_this2.error);
      _this2.plugin = 0;
      _this2.asyncTick(resolve, reject);
    })).then(() => {
      _this2.processed = true;
      return _this2.stringify();
    });

    return this.processing;
  };

  LazyResult.prototype.sync = function sync() {
    const _this3 = this;

    if (this.processed) return this.result;
    this.processed = true;

    if (this.processing) {
      throw new Error('Use process(css).then(cb) to work with async plugins');
    }

    if (this.error) throw this.error;

    this.result.processor.plugins.forEach((plugin) => {
      const promise = _this3.run(plugin);
      if (isPromise(promise)) {
        throw new Error('Use process(css).then(cb) to work with async plugins');
      }
    });

    return this.result;
  };

  LazyResult.prototype.run = function run(plugin) {
    this.result.lastPlugin = plugin;

    try {
      return plugin(this.result.root, this.result);
    } catch (error) {
      this.handleError(error, plugin);
      throw error;
    }
  };

  LazyResult.prototype.stringify = function stringify$$1() {
    if (this.stringified) return this.result;
    this.stringified = true;

    this.sync();

    const {opts} = this.result;
    let str = stringify;
    if (opts.syntax) str = opts.syntax.stringify;
    if (opts.stringifier) str = opts.stringifier;
    if (str.stringify) str = str.stringify;

    let result = '';
    str(this.root, (i) => {
      result += i;
    });
    this.result.css = result;

    return this.result;
  };

  createClass(LazyResult, [{
    key: 'processor',
    get: function get$$1() {
      return this.result.processor;
    }

    /**
     * Options from the {@link Processor#process} call.
     * @type {processOptions}
     */

  }, {
    key: 'opts',
    get: function get$$1() {
      return this.result.opts;
    }

    /**
     * Processes input CSS through synchronous plugins, converts `Root`
     * to a CSS string and returns {@link Result#css}.
     *
     * This property will only work with synchronous plugins.
     * If the processor contains any asynchronous plugins
     * it will throw an error. This is why this method is only
     * for debug purpose, you should always use {@link LazyResult#then}.
     *
     * @type {string}
     * @see Result#css
     */

  }, {
    key: 'css',
    get: function get$$1() {
      return this.stringify().css;
    }

    /**
     * An alias for the `css` property. Use it with syntaxes
     * that generate non-CSS output.
     *
     * This property will only work with synchronous plugins.
     * If the processor contains any asynchronous plugins
     * it will throw an error. This is why this method is only
     * for debug purpose, you should always use {@link LazyResult#then}.
     *
     * @type {string}
     * @see Result#content
     */

  }, {
    key: 'content',
    get: function get$$1() {
      return this.stringify().content;
    }

    /**
     * Processes input CSS through synchronous plugins
     * and returns {@link Result#map}.
     *
     * This property will only work with synchronous plugins.
     * If the processor contains any asynchronous plugins
     * it will throw an error. This is why this method is only
     * for debug purpose, you should always use {@link LazyResult#then}.
     *
     * @type {SourceMapGenerator}
     * @see Result#map
     */

  }, {
    key: 'map',
    get: function get$$1() {
      return this.stringify().map;
    }

    /**
     * Processes input CSS through synchronous plugins
     * and returns {@link Result#root}.
     *
     * This property will only work with synchronous plugins. If the processor
     * contains any asynchronous plugins it will throw an error.
     *
     * This is why this method is only for debug purpose,
     * you should always use {@link LazyResult#then}.
     *
     * @type {Root}
     * @see Result#root
     */

  }, {
    key: 'root',
    get: function get$$1() {
      return this.sync().root;
    }

    /**
     * Processes input CSS through synchronous plugins
     * and returns {@link Result#messages}.
     *
     * This property will only work with synchronous plugins. If the processor
     * contains any asynchronous plugins it will throw an error.
     *
     * This is why this method is only for debug purpose,
     * you should always use {@link LazyResult#then}.
     *
     * @type {Message[]}
     * @see Result#messages
     */

  }, {
    key: 'messages',
    get: function get$$1() {
      return this.sync().messages;
    }
  }]);
  return LazyResult;
}();

// 

/**
 * @callback builder
 * @param {string} part          - part of generated CSS connected to this node
 * @param {Node}   node          - AST node
 * @param {"start"|"end"} [type] - node’s part type
 */

/**
 * @callback parser
 *
 * @param {string|toString} css   - string with input CSS or any object
 *                                  with toString() method, like a Buffer
 * @param {processOptions} [opts] - options with only `from` and `map` keys
 *
 * @return {Root} PostCSS AST
 */

/**
 * @callback stringifier
 *
 * @param {Node} node       - start node for stringifing. Usually {@link Root}.
 * @param {builder} builder - function to concatenate CSS from node’s parts
 *                            or generate string and source map
 *
 * @return {void}
 */

/**
 * @typedef {object} syntax
 * @property {parser} parse          - function to generate AST by string
 * @property {stringifier} stringify - function to generate string by AST
 */

/**
 * @typedef {object} toString
 * @property {function} toString
 */

/**
 * @callback pluginFunction
 * @param {Root} root     - parsed input CSS
 * @param {Result} result - result to set warnings or check other plugins
 */

/**
 * @typedef {object} Plugin
 * @property {function} postcss - PostCSS plugin function
 */

/**
 * @typedef {object} processOptions
 * @property {string} from             - the path of the CSS source file.
 *                                       You should always set `from`,
 *                                       because it is used in source map
 *                                       generation and syntax error messages.
 * @property {string} to               - the path where you’ll put the output
 *                                       CSS file. You should always set `to`
 *                                       to generate correct source maps.
 * @property {parser} parser           - function to generate AST by string
 * @property {stringifier} stringifier - class to generate string by AST
 * @property {syntax} syntax           - object with `parse` and `stringify`
 * @property {object} map              - source map options
 * @property {boolean} map.inline                    - does source map should
 *                                                     be embedded in the output
 *                                                     CSS as a base64-encoded
 *                                                     comment
 * @property {string|object|false|function} map.prev - source map content
 *                                                     from a previous
 *                                                     processing step
 *                                                     (for example, Sass).
 *                                                     PostCSS will try to find
 *                                                     previous map
 *                                                     automatically, so you
 *                                                     could disable it by
 *                                                     `false` value.
 * @property {boolean} map.sourcesContent            - does PostCSS should set
 *                                                     the origin content to map
 * @property {string|false} map.annotation           - does PostCSS should set
 *                                                     annotation comment to map
 * @property {string} map.from                       - override `from` in map’s
 *                                                     `sources`
 */

/**
 * Contains plugins to process CSS. Create one `Processor` instance,
 * initialize its plugins, and then use that instance on numerous CSS files.
 *
 * @example
 * const processor = postcss([autoprefixer, precss]);
 * processor.process(css1).then(result => console.log(result.css));
 * processor.process(css2).then(result => console.log(result.css));
 */

const Processor = function () {
  /**
   * @param {Array.<Plugin|pluginFunction>|Processor} plugins - PostCSS
   *        plugins. See {@link Processor#use} for plugin format.
   */
  function Processor() {
    const plugins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    classCallCheck(this, Processor);

    /**
     * @member {string} - Current PostCSS version.
     *
     * @example
     * if ( result.processor.version.split('.')[0] !== '5' ) {
     *   throw new Error('This plugin works only with PostCSS 5');
     * }
     */
    this.version = '5.2.0';
    /**
     * @member {pluginFunction[]} - Plugins added to this processor.
     *
     * @example
     * const processor = postcss([autoprefixer, precss]);
     * processor.plugins.length //=> 2
     */
    this.plugins = this.normalize(plugins);
  }

  /**
   * Adds a plugin to be used as a CSS processor.
   *
   * PostCSS plugin can be in 4 formats:
   * * A plugin created by {@link postcss.plugin} method.
   * * A function. PostCSS will pass the function a @{link Root}
   *   as the first argument and current {@link Result} instance
   *   as the second.
   * * An object with a `postcss` method. PostCSS will use that method
   *   as described in #2.
   * * Another {@link Processor} instance. PostCSS will copy plugins
   *   from that instance into this one.
   *
   * Plugins can also be added by passing them as arguments when creating
   * a `postcss` instance (see [`postcss(plugins)`]).
   *
   * Asynchronous plugins should return a `Promise` instance.
   *
   * @param {Plugin|pluginFunction|Processor} plugin - PostCSS plugin
   *                                                   or {@link Processor}
   *                                                   with plugins
   *
   * @example
   * const processor = postcss()
   *   .use(autoprefixer)
   *   .use(precss);
   *
   * @return {Processes} current processor to make methods chain
   */


  Processor.prototype.use = function use(plugin) {
    this.plugins = this.plugins.concat(this.normalize([plugin]));
    return this;
  };

  /**
   * Parses source CSS and returns a {@link LazyResult} Promise proxy.
   * Because some plugins can be asynchronous it doesn’t make
   * any transformations. Transformations will be applied
   * in the {@link LazyResult} methods.
   *
   * @param {string|toString|Result} css - String with input CSS or
   *                                       any object with a `toString()`
   *                                       method, like a Buffer.
   *                                       Optionally, send a {@link Result}
   *                                       instance and the processor will
   *                                       take the {@link Root} from it.
   * @param {processOptions} [opts]      - options
   *
   * @return {LazyResult} Promise proxy
   *
   * @example
   * processor.process(css, { from: 'a.css', to: 'a.out.css' })
   *   .then(result => {
   *      console.log(result.css);
   *   });
   */


  Processor.prototype.process = function process(css) {
    const opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new LazyResult(this, css, opts);
  };

  Processor.prototype.normalize = function normalize(plugins) {
    let normalized = [];
    plugins.forEach((i) => {
      if (i.postcss) i = i.postcss;

      if ((typeof i === 'undefined' ? 'undefined' : _typeof(i)) === 'object' && Array.isArray(i.plugins)) {
        normalized = normalized.concat(i.plugins);
      } else if (typeof i === 'function') {
        normalized.push(i);
      } else {
        throw new Error(`${i  } is not a PostCSS plugin`);
      }
    });
    return normalized;
  };

  return Processor;
}();

// 

/**
 * Represents a CSS file and contains all its parsed nodes.
 *
 * @extends Container
 *
 * @example
 * const root = postcss.parse('a{color:black} b{z-index:2}');
 * root.type         //=> 'root'
 * root.nodes.length //=> 2
 */

var Root = function (_Container) {
  inherits(Root, _Container);

  function Root(defaults$$1) {
    classCallCheck(this, Root);

    const _this = possibleConstructorReturn(this, _Container.call(this, defaults$$1));

    _this.type = 'root';
    if (!_this.nodes) _this.nodes = [];
    return _this;
  }

  Root.prototype.removeChild = function removeChild(child) {
    child = this.index(child);

    if (child === 0 && this.nodes.length > 1) {
      this.nodes[1].raws.before = this.nodes[child].raws.before;
    }

    return _Container.prototype.removeChild.call(this, child);
  };

  Root.prototype.normalize = function normalize(child, sample, type) {
    const nodes = _Container.prototype.normalize.call(this, child);

    if (sample) {
      if (type === 'prepend') {
        if (this.nodes.length > 1) {
          sample.raws.before = this.nodes[1].raws.before;
        } else {
          delete sample.raws.before;
        }
      } else if (this.first !== sample) {
        nodes.forEach((node) => {
          node.raws.before = sample.raws.before;
        });
      }
    }

    return nodes;
  };

  /**
   * Returns a {@link Result} instance representing the root’s CSS.
   *
   * @param {processOptions} [opts] - options with only `to` and `map` keys
   *
   * @return {Result} result with current root’s CSS
   *
   * @example
   * const root1 = postcss.parse(css1, { from: 'a.css' });
   * const root2 = postcss.parse(css2, { from: 'b.css' });
   * root1.append(root2);
   * const result = root1.toResult({ to: 'all.css', map: true });
   */


  Root.prototype.toResult = function toResult() {
    const opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    const lazy = new LazyResult(new Processor(), this, opts);
    return lazy.stringify();
  };

  Root.prototype.remove = function remove(child) {
    warnOnce('Root#remove is deprecated. Use Root#removeChild');
    this.removeChild(child);
  };

  Root.prototype.prevMap = function prevMap() {
    warnOnce('Root#prevMap is deprecated. Use Root#source.input.map');
    return this.source.input.map;
  };

  /**
   * @memberof Root#
   * @member {object} raws - Information to generate byte-to-byte equal
   *                         node string as it was in the origin input.
   *
   * Every parser saves its own properties,
   * but the default CSS parser uses:
   *
   * * `after`: the space symbols after the last child to the end of file.
   * * `semicolon`: is the last child has an (optional) semicolon.
   *
   * @example
   * postcss.parse('a {}\n').raws //=> { after: '\n' }
   * postcss.parse('a {}').raws   //=> { after: '' }
   */


  return Root;
}(Container);

// 
// import PreviousMap    from './previous-map';

let sequence = 0;

/**
 * @typedef  {object} filePosition
 * @property {string} file   - path to file
 * @property {number} line   - source line in file
 * @property {number} column - source column in file
 */

/**
 * Represents the source CSS.
 *
 * @example
 * const root  = postcss.parse(css, { from: file });
 * const input = root.source.input;
 */

var Input = function () {
  /**
   * @param {string} css    - input CSS source
   * @param {object} [opts] - {@link Processor#process} options
   */
  function Input(css) {
    const opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Input);

    /**
     * @member {string} - input CSS source
     *
     * @example
     * const input = postcss.parse('a{}', { from: file }).input;
     * input.css //=> "a{}";
     */
    this.css = css.toString();

    if (this.css[0] === '\uFEFF' || this.css[0] === '\uFFFE') {
      this.css = this.css.slice(1);
    }

    if (opts.from) {
      if (/^\w+:\/\//.test(opts.from)) {
        /**
         * @member {string} - The absolute path to the CSS source file
         *                    defined with the `from` option.
         *
         * @example
         * const root = postcss.parse(css, { from: 'a.css' });
         * root.source.input.file //=> '/home/ai/a.css'
         */
        this.file = opts.from;
      } else {
        this.file = path.resolve(opts.from);
      }
    }

    /*
        let map = new PreviousMap(this.css, opts);
        if ( map.text ) {
            /!**
             * @member {PreviousMap} - The input source map passed from
             *                         a compilation step before PostCSS
             *                         (for example, from Sass compiler).
             *
             * @example
             * root.source.input.map.consumer().sources //=> ['a.sass']
             *!/
            this.map = map;
            let file = map.consumer().file;
            if ( !this.file && file ) this.file = this.mapResolve(file);
        }
    */

    if (!this.file) {
      sequence += 1;
      /**
       * @member {string} - The unique ID of the CSS source. It will be
       *                    created if `from` option is not provided
       *                    (because PostCSS does not know the file path).
       *
       * @example
       * const root = postcss.parse(css);
       * root.source.input.file //=> undefined
       * root.source.input.id   //=> "<input css 1>"
       */
      this.id = `<input css ${  sequence  }>`;
    }
    if (this.map) this.map.file = this.from;
  }

  Input.prototype.error = function error(message, line, column) {
    const opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    let result = void 0;
    const origin = this.origin(line, column);
    if (origin) {
      result = new CssSyntaxError(message, origin.line, origin.column, origin.source, origin.file, opts.plugin);
    } else {
      result = new CssSyntaxError(message, line, column, this.css, this.file, opts.plugin);
    }

    result.input = { line, column, source: this.css };
    if (this.file) result.input.file = this.file;

    return result;
  };

  /**
   * Reads the input source map and returns a symbol position
   * in the input source (e.g., in a Sass file that was compiled
   * to CSS before being passed to PostCSS).
   *
   * @param {number} line   - line in input CSS
   * @param {number} column - column in input CSS
   *
   * @return {filePosition} position in input source
   *
   * @example
   * root.source.input.origin(1, 1) //=> { file: 'a.css', line: 3, column: 1 }
   */


  Input.prototype.origin = function origin(line, column) {
    if (!this.map) return false;
    const consumer = this.map.consumer();

    const from = consumer.originalPositionFor({ line, column });
    if (!from.source) return false;

    const result = {
      file: this.mapResolve(from.source),
      line: from.line,
      column: from.column
    };

    const source = consumer.sourceContentFor(from.source);
    if (source) result.source = source;

    return result;
  };

  Input.prototype.mapResolve = function mapResolve(file) {
    if (/^\w+:\/\//.test(file)) {
      return file;
    } else {
      return path.resolve(this.map.consumer().sourceRoot || '.', file);
    }
  };

  /**
   * The CSS source identifier. Contains {@link Input#file} if the user
   * set the `from` option, or {@link Input#id} if they did not.
   * @type {string}
   *
   * @example
   * const root = postcss.parse(css, { from: 'a.css' });
   * root.source.input.from //=> "/home/ai/a.css"
   *
   * const root = postcss.parse(css);
   * root.source.input.from //=> "<input css 1>"
   */


  createClass(Input, [{
    key: 'from',
    get: function get$$1() {
      return this.file || this.id;
    }
  }]);
  return Input;
}();

// 

const SafeParser = function (_Parser) {
  inherits(SafeParser, _Parser);

  function SafeParser() {
    classCallCheck(this, SafeParser);
    return possibleConstructorReturn(this, _Parser.apply(this, arguments));
  }

  SafeParser.prototype.tokenize = function tokenize$$1() {
    this.tokens = tokenize(this.input, { ignoreErrors: true });
  };

  SafeParser.prototype.comment = function comment(token) {
    const node = new Comment();
    this.init(node, token[2], token[3]);
    node.source.end = { line: token[4], column: token[5] };

    let text = token[1].slice(2);
    if (text.slice(-2) === '*/') text = text.slice(0, -2);

    if (/^\s*$/.test(text)) {
      node.text = '';
      node.raws.left = text;
      node.raws.right = '';
    } else {
      const match = text.match(/^(\s*)([^]*[^\s])(\s*)$/);
      node.text = match[2];
      node.raws.left = match[1];
      node.raws.right = match[3];
    }
  };

  SafeParser.prototype.unclosedBracket = function unclosedBracket() {};

  SafeParser.prototype.unknownWord = function unknownWord(start) {
    const buffer = this.tokens.slice(start, this.pos + 1);
    this.spaces += buffer.map((i) => i[1]).join('');
  };

  SafeParser.prototype.unexpectedClose = function unexpectedClose() {
    this.current.raws.after += '}';
  };

  SafeParser.prototype.doubleColon = function doubleColon() {};

  SafeParser.prototype.unnamedAtrule = function unnamedAtrule(node) {
    node.name = '';
  };

  SafeParser.prototype.precheckMissedSemicolon = function precheckMissedSemicolon(tokens) {
    const colon = this.colon(tokens);
    if (colon === false) return;

    let split = void 0;
    for (split = colon - 1; split >= 0; split--) {
      if (tokens[split][0] === 'word') break;
    }
    for (split -= 1; split >= 0; split--) {
      if (tokens[split][0] !== 'space') {
        split += 1;
        break;
      }
    }
    const other = tokens.splice(split, tokens.length - split);
    this.decl(other);
  };

  SafeParser.prototype.checkMissedSemicolon = function checkMissedSemicolon() {};

  SafeParser.prototype.endFile = function endFile() {
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon;
    }
    this.current.raws.after = (this.current.raws.after || '') + this.spaces;

    while (this.current.parent) {
      this.current = this.current.parent;
      this.current.raws.after = '';
    }
  };

  return SafeParser;
}(Parser);

// 

function safeParse(css, opts) {
  const input = new Input(css, opts);

  const parser = new SafeParser(input);
  parser.tokenize();
  parser.loop();

  return parser.root;
}

// 

const generated = {};

/*
 InlineStyle takes arbitrary CSS and generates a flat object
 */
const _InlineStyle = (function (styleSheet) {
  const InlineStyle = function () {
    function InlineStyle(rules) {
      classCallCheck(this, InlineStyle);

      this.rules = rules;
    }

    InlineStyle.prototype.generateStyleObject = function generateStyleObject(executionContext) {
      const flatCSS = flatten(this.rules, executionContext).join('');

      const hash = murmurhash(flatCSS);
      if (!generated[hash]) {
        const root = safeParse(flatCSS);
        const declPairs = [];
        root.each((node) => {
          if (node.type === 'decl') {
            declPairs.push([node.prop, node.value]);
          } else if (process.env.NODE_ENV !== 'production' && node.type !== 'comment') {
            /* eslint-disable no-console */
            console.warn(`Node of type ${  node.type  } not supported as an inline style`);
          }
        });
        // RN currently does not support differing values for the corner radii of Image
        // components (but does for View). It is almost impossible to tell whether we'll have
        // support, so we'll just disable multiple values here.
        // https://github.com/styled-components/css-to-react-native/issues/11
        const styleObject = transformDeclPairs(declPairs, ['borderRadius', 'borderWidth', 'borderColor', 'borderStyle']);
        const styles = styleSheet.create({
          generated: styleObject
        });
        generated[hash] = styles.generated;
      }
      return generated[hash];
    };

    return InlineStyle;
  }();

  return InlineStyle;
});

// 
const EMPTY_ARRAY = Object.freeze([]);
const EMPTY_OBJECT = Object.freeze({});

// 

const determineTheme = (function (props, fallbackTheme) {
  const defaultProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EMPTY_OBJECT;

  // Props should take precedence over ThemeProvider, which should take precedence over
  // defaultProps, but React automatically puts defaultProps on props.

  /* eslint-disable react/prop-types, flowtype-errors/show-errors */
  const isDefaultTheme = defaultProps ? props.theme === defaultProps.theme : false;
  const theme = props.theme && !isDefaultTheme ? props.theme : fallbackTheme || defaultProps.theme;
  /* eslint-enable */

  return theme;
});

// 

function isTag(target) {
  return typeof target === 'string' && (process.env.NODE_ENV !== 'production' ? target.charAt(0) === target.charAt(0).toLowerCase() : true);
}

// 

function generateDisplayName(target) {
  // $FlowFixMe
  return isTag(target) ? `styled.${  target}` : `Styled(${  getComponentName(target)  })`;
}

let _TYPE_STATICS;

const REACT_STATICS = {
  childContextTypes: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDerivedStateFromProps: true,
  propTypes: true,
  type: true
};

const KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};

const TYPE_STATICS = (_TYPE_STATICS = {}, _TYPE_STATICS[ForwardRef] = {
  $$typeof: true,
  render: true
}, _TYPE_STATICS);

const defineProperty$1 = Object.defineProperty;
    const {getOwnPropertyNames} = Object;
    const _Object$getOwnPropert = Object.getOwnPropertySymbols;
    const getOwnPropertySymbols = _Object$getOwnPropert === undefined ? function () {
  return [];
} : _Object$getOwnPropert;
    const {getOwnPropertyDescriptor} = Object;
    const {getPrototypeOf} = Object;
    const objectPrototype = Object.prototype;
const arrayPrototype = Array.prototype;


function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if (typeof sourceComponent !== 'string') {
    // don't hoist over string (html) components

    const inheritedComponent = getPrototypeOf(sourceComponent);

    if (inheritedComponent && inheritedComponent !== objectPrototype) {
      hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
    }

    const keys = arrayPrototype.concat(getOwnPropertyNames(sourceComponent),
    // $FlowFixMe
    getOwnPropertySymbols(sourceComponent));

    const targetStatics = TYPE_STATICS[targetComponent.$$typeof] || REACT_STATICS;

    const sourceStatics = TYPE_STATICS[sourceComponent.$$typeof] || REACT_STATICS;

    let i = keys.length;
    let descriptor = void 0;
    let key = void 0;

    // eslint-disable-next-line no-plusplus
    while (i--) {
      key = keys[i];

      if (
      // $FlowFixMe
      !KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) &&
      // $FlowFixMe
      !(targetStatics && targetStatics[key])) {
        descriptor = getOwnPropertyDescriptor(sourceComponent, key);

        if (descriptor) {
          try {
            // Avoid failures from read-only properties
            defineProperty$1(targetComponent, key, descriptor);
          } catch (e) {
            /* fail silently */
          }
        }
      }
    }

    return targetComponent;
  }

  return targetComponent;
}

// 
function isDerivedReactComponent(fn) {
  return !!(fn && fn.prototype && fn.prototype.isReactComponent);
}

// 
// Helper to call a given function, only once
const once = (function (cb) {
  let called = false;

  return function () {
    if (!called) {
      called = true;
      cb.apply(undefined, arguments);
    }
  };
});

// 

const ThemeContext = createContext();

const ThemeConsumer = ThemeContext.Consumer;

/**
 * Provide a theme to an entire react component tree via context
 */

const ThemeProvider = function (_Component) {
  inherits(ThemeProvider, _Component);

  function ThemeProvider(props) {
    classCallCheck(this, ThemeProvider);

    const _this = possibleConstructorReturn(this, _Component.call(this, props));

    _this.getContext = memoize(_this.getContext.bind(_this));
    _this.renderInner = _this.renderInner.bind(_this);
    return _this;
  }

  ThemeProvider.prototype.render = function render() {
    if (!this.props.children) return null;

    return React.createElement(
      ThemeContext.Consumer,
      null,
      this.renderInner
    );
  };

  ThemeProvider.prototype.renderInner = function renderInner(outerTheme) {
    const context = this.getContext(this.props.theme, outerTheme);

    return React.createElement(
      ThemeContext.Provider,
      { value: context },
      React.Children.only(this.props.children)
    );
  };

  /**
   * Get the theme from the props, supporting both (outerTheme) => {}
   * as well as object notation
   */


  ThemeProvider.prototype.getTheme = function getTheme(theme, outerTheme) {
    if (isFunction(theme)) {
      const mergedTheme = theme(outerTheme);

      if (process.env.NODE_ENV !== 'production' && (mergedTheme === null || Array.isArray(mergedTheme) || (typeof mergedTheme === 'undefined' ? 'undefined' : _typeof(mergedTheme)) !== 'object')) {
        throw new StyledComponentsError(7);
      }

      return mergedTheme;
    }

    if (theme === null || Array.isArray(theme) || (typeof theme === 'undefined' ? 'undefined' : _typeof(theme)) !== 'object') {
      throw new StyledComponentsError(8);
    }

    return _extends({}, outerTheme, theme);
  };

  ThemeProvider.prototype.getContext = function getContext(theme, outerTheme) {
    return this.getTheme(theme, outerTheme);
  };

  return ThemeProvider;
}(Component);

// 

// $FlowFixMe

const StyledNativeComponent = function (_Component) {
  inherits(StyledNativeComponent, _Component);

  function StyledNativeComponent(props) {
    classCallCheck(this, StyledNativeComponent);

    const _this = possibleConstructorReturn(this, _Component.call(this, props));

    _this.attrs = {};


    if (process.env.NODE_ENV !== 'production') {
      _this.warnInnerRef = once((displayName) => (
          // eslint-disable-next-line no-console
          console.warn(`The "innerRef" API has been removed in styled-components v4 in favor of React 16 ref forwarding, use "ref" instead like a typical component. "innerRef" was detected on component "${  displayName  }".`)
        ));

      _this.warnAttrsFnObjectKeyDeprecated = once((key, displayName) => (
          // eslint-disable-next-line no-console
          console.warn(`Functions as object-form attrs({}) keys are now deprecated and will be removed in a future version of styled-components. Switch to the new attrs(props => ({})) syntax instead for easier and more powerful composition. The attrs key in question is "${  key  }" on component "${  displayName  }".`)
        ));

      _this.warnNonStyledComponentAttrsObjectKey = once((key, displayName) => (
          // eslint-disable-next-line no-console
          console.warn(`It looks like you've used a non styled-component as the value for the "${  key  }" prop in an object-form attrs constructor of "${  displayName  }".\n` + `You should use the new function-form attrs constructor which avoids this issue: attrs(props => ({ yourStuff }))\n` + `To continue using the deprecated object syntax, you'll need to wrap your component prop in a function to make it available inside the styled component (you'll still get the deprecation warning though.)\n` + `For example, { ${  key  }: () => InnerComponent } instead of { ${  key  }: InnerComponent }`)
        ));
    }
    return _this;
  }

  StyledNativeComponent.prototype.render = function render() {
    const _this2 = this;

    return React.createElement(
      ThemeConsumer,
      null,
      (theme) => {
        const _props = _this2.props;
            const renderAs = _props.as;
            const {forwardedComponent} = _props;
            const {forwardedRef} = _props;
            const {innerRef} = _props;
            const _props$style = _props.style;
            const style = _props$style === undefined ? [] : _props$style;
            const props = objectWithoutProperties(_props, ['as', 'forwardedComponent', 'forwardedRef', 'innerRef', 'style']);
        const {defaultProps} = forwardedComponent;
            const {displayName} = forwardedComponent;
            const {target} = forwardedComponent;


        let generatedStyles = void 0;
        if (theme !== undefined) {
          const themeProp = determineTheme(_this2.props, theme, defaultProps);
          generatedStyles = _this2.generateAndInjectStyles(themeProp, _this2.props);
        } else {
          generatedStyles = _this2.generateAndInjectStyles(theme || EMPTY_OBJECT, _this2.props);
        }

        const propsForElement = _extends({}, _this2.attrs, props, {
          style: [generatedStyles].concat(style)
        });

        if (forwardedRef) propsForElement.ref = forwardedRef;

        if (process.env.NODE_ENV !== 'production' && innerRef) {
          _this2.warnInnerRef(displayName);
        }

        return createElement(renderAs || target, propsForElement);
      }
    );
  };

  StyledNativeComponent.prototype.buildExecutionContext = function buildExecutionContext(theme, props, attrs) {
    const _this3 = this;

    const context = _extends({}, props, { theme });

    if (!attrs.length) return context;

    this.attrs = {};

    attrs.forEach((attrDef) => {
      let resolvedAttrDef = attrDef;
      let attrDefWasFn = false;
      let attr = void 0;
      let key = void 0;

      if (isFunction(resolvedAttrDef)) {
        // $FlowFixMe
        resolvedAttrDef = resolvedAttrDef(context);
        attrDefWasFn = true;
      }

      /* eslint-disable guard-for-in */
      // $FlowFixMe
      for (key in resolvedAttrDef) {
        attr = resolvedAttrDef[key];

        if (!attrDefWasFn) {
          if (isFunction(attr) && !isDerivedReactComponent(attr) && !isStyledComponent(attr)) {
            if (process.env.NODE_ENV !== 'production') {
              _this3.warnAttrsFnObjectKeyDeprecated(key, _this3.props.forwardedComponent.displayName);
            }

            attr = attr(context);

            if (process.env.NODE_ENV !== 'production' && React.isValidElement(attr)) {
              _this3.warnNonStyledComponentAttrsObjectKey(key, _this3.props.forwardedComponent.displayName);
            }
          }
        }

        _this3.attrs[key] = attr;
        context[key] = attr;
      }
      /* eslint-enable */
    });

    return context;
  };

  StyledNativeComponent.prototype.generateAndInjectStyles = function generateAndInjectStyles(theme, props) {
    const {inlineStyle} = props.forwardedComponent;


    const executionContext = this.buildExecutionContext(theme, props, props.forwardedComponent.attrs);

    return inlineStyle.generateStyleObject(executionContext);
  };

  StyledNativeComponent.prototype.setNativeProps = function setNativeProps(nativeProps) {
    if (this.root !== undefined) {
      // $FlowFixMe
      this.root.setNativeProps(nativeProps);
    } else if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('setNativeProps was called on a Styled Component wrapping a stateless functional component.');
    }
  };

  return StyledNativeComponent;
}(Component);

const _StyledNativeComponent = (function (InlineStyle) {
  const createStyledNativeComponent = function createStyledNativeComponent(target, options, rules) {
    const _options$attrs = options.attrs;
        const attrs = _options$attrs === undefined ? EMPTY_ARRAY : _options$attrs;
        const _options$displayName = options.displayName;
        const displayName = _options$displayName === undefined ? generateDisplayName(target) : _options$displayName;
        const _options$ParentCompon = options.ParentComponent;
        const ParentComponent = _options$ParentCompon === undefined ? StyledNativeComponent : _options$ParentCompon;


    const isClass = !isTag(target);
    const isTargetStyledComp = isStyledComponent(target);

    var WrappedStyledNativeComponent = React.forwardRef((props, ref) => React.createElement(ParentComponent, _extends({}, props, {
        forwardedComponent: WrappedStyledNativeComponent,
        forwardedRef: ref
      })));

    const finalAttrs =
    // $FlowFixMe
    isTargetStyledComp && target.attrs ? Array.prototype.concat(target.attrs, attrs).filter(Boolean) : attrs;

    /**
     * forwardRef creates a new interim component, which we'll take advantage of
     * instead of extending ParentComponent to create _another_ interim class
     */

    // $FlowFixMe
    WrappedStyledNativeComponent.attrs = finalAttrs;

    WrappedStyledNativeComponent.displayName = displayName;

    // $FlowFixMe
    WrappedStyledNativeComponent.inlineStyle = new InlineStyle(
    // $FlowFixMe
    isTargetStyledComp ? target.inlineStyle.rules.concat(rules) : rules);

    // $FlowFixMe
    WrappedStyledNativeComponent.styledComponentId = 'StyledNativeComponent';
    // $FlowFixMe
    WrappedStyledNativeComponent.target = isTargetStyledComp ? // $FlowFixMe
    target.target : target;
    // $FlowFixMe
    WrappedStyledNativeComponent.withComponent = function withComponent(tag) {
      const _ = options.displayName;
          const __ = options.componentId;
          const optionsToCopy = objectWithoutProperties(options, ['displayName', 'componentId']);

      const newOptions = _extends({}, optionsToCopy, {
        attrs: finalAttrs,
        ParentComponent
      });

      return createStyledNativeComponent(tag, newOptions, rules);
    };

    if (isClass) {
      // $FlowFixMe
      hoistNonReactStatics(WrappedStyledNativeComponent, target, {
        // all SC-specific things should not be hoisted
        attrs: true,
        displayName: true,
        inlineStyle: true,
        styledComponentId: true,
        target: true,
        withComponent: true
      });
    }

    return WrappedStyledNativeComponent;
  };

  return createStyledNativeComponent;
});

// 

const interleave = (function (strings, interpolations) {
  const result = [strings[0]];

  for (let i = 0, len = interpolations.length; i < len; i += 1) {
    result.push(interpolations[i], strings[i + 1]);
  }

  return result;
});

// 

function css(styles) {
  for (var _len = arguments.length, interpolations = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    interpolations[_key - 1] = arguments[_key];
  }

  if (isFunction(styles) || isPlainObject(styles)) {
    // $FlowFixMe
    return flatten(interleave(EMPTY_ARRAY, [styles].concat(interpolations)));
  }

  // $FlowFixMe
  return flatten(interleave(styles, interpolations));
}

// 

function constructWithOptions(componentConstructor, tag) {
  const options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EMPTY_OBJECT;

  if (!isValidElementType(tag)) {
    throw new StyledComponentsError(1, String(tag));
  }

  /* This is callable directly as a template function */
  // $FlowFixMe: Not typed to avoid destructuring arguments
  const templateFunction = function templateFunction() {
    return componentConstructor(tag, options, css.apply(undefined, arguments));
  };

  /* If config methods are called, wrap up a new template function and merge options */
  templateFunction.withConfig = function (config) {
    return constructWithOptions(componentConstructor, tag, _extends({}, options, config));
  };

  /* Modify/inject new props at runtime */
  templateFunction.attrs = function (attrs) {
    return constructWithOptions(componentConstructor, tag, _extends({}, options, {
      attrs: Array.prototype.concat(options.attrs, attrs).filter(Boolean)
    }));
  };

  return templateFunction;
}

// 

const withTheme = (function (Component$$1) {
  const WithTheme = React.forwardRef((props, ref) => React.createElement(
      ThemeConsumer,
      null,
      (theme) => {
        // $FlowFixMe
        const {defaultProps} = Component$$1;

        const themeProp = determineTheme(props, theme, defaultProps);

        if (process.env.NODE_ENV !== 'production' && themeProp === undefined) {
          // eslint-disable-next-line no-console
          console.warn(`[withTheme] You are not using a ThemeProvider nor passing a theme prop or a theme in defaultProps in component class "${  getComponentName(Component$$1)  }"`);
        }

        return React.createElement(Component$$1, _extends({}, props, { theme: themeProp, ref }));
      }
    ));

  hoistNonReactStatics(WithTheme, Component$$1);

  WithTheme.displayName = `WithTheme(${  getComponentName(Component$$1)  })`;

  return WithTheme;
});

// 

const InlineStyle = _InlineStyle(reactPrimitives.StyleSheet);
const StyledNativeComponent$1 = _StyledNativeComponent(InlineStyle);
const styled = function styled(tag) {
  return constructWithOptions(StyledNativeComponent$1, tag);
};

/* React native lazy-requires each of these modules for some reason, so let's
 *  assume it's for a good reason and not eagerly load them all */
const aliases = 'Image Text Touchable View ';

/* Define a getter for each alias which simply gets the reactNative component
 * and passes it to styled */
aliases.split(/\s+/m).forEach((alias) => Object.defineProperty(styled, alias, {
    enumerable: true,
    configurable: false,
    get: function get() {
      return styled(reactPrimitives[alias]);
    }
  }));

export default styled;
export { css, isStyledComponent, ThemeProvider, ThemeConsumer, ThemeContext, withTheme };
// # sourceMappingURL=styled-components-primitives.esm.js.map
