_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[7],{"/0+H":function(e,n,t){"use strict";n.__esModule=!0,n.isInAmpMode=i,n.useAmp=function(){return i(o.default.useContext(a.AmpStateContext))};var r,o=(r=t("q1tI"))&&r.__esModule?r:{default:r},a=t("lwAK");function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.ampFirst,t=void 0!==n&&n,r=e.hybrid,o=void 0!==r&&r,a=e.hasQuery,i=void 0!==a&&a;return t||o&&i}},0:function(e,n,t){t("74v/"),e.exports=t("nOHt")},"74v/":function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return t("cha2")}])},"8Kt/":function(e,n,t){"use strict";var r=t("lSNA");function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}n.__esModule=!0,n.defaultHead=p,n.default=void 0;var a,i=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var n=d();if(n&&n.has(e))return n.get(e);var t={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var a=r?Object.getOwnPropertyDescriptor(e,o):null;a&&(a.get||a.set)?Object.defineProperty(t,o,a):t[o]=e[o]}t.default=e,n&&n.set(e,t);return t}(t("q1tI")),c=(a=t("Xuae"))&&a.__esModule?a:{default:a},s=t("lwAK"),u=t("FYa8"),l=t("/0+H");function d(){if("function"!==typeof WeakMap)return null;var e=new WeakMap;return d=function(){return e},e}function p(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=[i.default.createElement("meta",{charSet:"utf-8"})];return e||n.push(i.default.createElement("meta",{name:"viewport",content:"width=device-width"})),n}function f(e,n){return"string"===typeof n||"number"===typeof n?e:n.type===i.default.Fragment?e.concat(i.default.Children.toArray(n.props.children).reduce((function(e,n){return"string"===typeof n||"number"===typeof n?e:e.concat(n)}),[])):e.concat(n)}var m=["name","httpEquiv","charSet","itemProp"];function h(e,n){return e.reduce((function(e,n){var t=i.default.Children.toArray(n.props.children);return e.concat(t)}),[]).reduce(f,[]).reverse().concat(p(n.inAmpMode)).filter(function(){var e=new Set,n=new Set,t=new Set,r={};return function(o){var a=!0,i=!1;if(o.key&&"number"!==typeof o.key&&o.key.indexOf("$")>0){i=!0;var c=o.key.slice(o.key.indexOf("$")+1);e.has(c)?a=!1:e.add(c)}switch(o.type){case"title":case"base":n.has(o.type)?a=!1:n.add(o.type);break;case"meta":for(var s=0,u=m.length;s<u;s++){var l=m[s];if(o.props.hasOwnProperty(l))if("charSet"===l)t.has(l)?a=!1:t.add(l);else{var d=o.props[l],p=r[l]||new Set;"name"===l&&i||!p.has(d)?(p.add(d),r[l]=p):a=!1}}}return a}}()).reverse().map((function(e,t){var a=e.key||t;if(!n.inAmpMode&&"link"===e.type&&e.props.href&&["https://fonts.googleapis.com/css"].some((function(n){return e.props.href.startsWith(n)}))){var c=function(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}({},e.props||{});return c["data-href"]=c.href,c.href=void 0,i.default.cloneElement(e,c)}return i.default.cloneElement(e,{key:a})}))}function b(e){var n=e.children,t=(0,i.useContext)(s.AmpStateContext),r=(0,i.useContext)(u.HeadManagerContext);return i.default.createElement(c.default,{reduceComponentsToState:h,headManager:r,inAmpMode:(0,l.isInAmpMode)(t)},n)}b.rewind=function(){};var v=b;n.default=v},Bnag:function(e,n){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},Ijbi:function(e,n,t){var r=t("WkPL");e.exports=function(e){if(Array.isArray(e))return r(e)}},RIqP:function(e,n,t){var r=t("Ijbi"),o=t("EbDI"),a=t("ZhPi"),i=t("Bnag");e.exports=function(e){return r(e)||o(e)||a(e)||i()}},Xuae:function(e,n,t){"use strict";var r=t("RIqP"),o=t("lwsE"),a=t("W8MJ"),i=(t("PJYZ"),t("7W2i")),c=t("a1gu"),s=t("Nsbk");function u(e){var n=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var t,r=s(e);if(n){var o=s(this).constructor;t=Reflect.construct(r,arguments,o)}else t=r.apply(this,arguments);return c(this,t)}}n.__esModule=!0,n.default=void 0;var l=t("q1tI"),d=function(e){i(t,e);var n=u(t);function t(e){var a;return o(this,t),(a=n.call(this,e))._hasHeadManager=void 0,a.emitChange=function(){a._hasHeadManager&&a.props.headManager.updateHead(a.props.reduceComponentsToState(r(a.props.headManager.mountedInstances),a.props))},a._hasHeadManager=a.props.headManager&&a.props.headManager.mountedInstances,a}return a(t,[{key:"componentDidMount",value:function(){this._hasHeadManager&&this.props.headManager.mountedInstances.add(this),this.emitChange()}},{key:"componentDidUpdate",value:function(){this.emitChange()}},{key:"componentWillUnmount",value:function(){this._hasHeadManager&&this.props.headManager.mountedInstances.delete(this),this.emitChange()}},{key:"render",value:function(){return null}}]),t}(l.Component);n.default=d},cha2:function(e,n,t){"use strict";t.r(n);var r=t("nKUr"),o=t("rePB"),a=t("jwwp"),i=t("/2u0"),c=t("KwD7"),s=t("pr4h"),u=t("qd8s"),l=t.n(u);function d(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return l()({},...n,p)}function p(e,n,t,r){if((Object(s.f)(e)||Object(s.f)(n))&&Object.prototype.hasOwnProperty.call(r,t))return function(){var t=Object(s.f)(e)?e(...arguments):e,r=Object(s.f)(n)?n(...arguments):n;return l()({},t,r,p)}}var f=t("AeFk"),m=t("q1tI"),h=t.n(m),b=()=>m.createElement(f.a,{styles:'\n      html {\n        line-height: 1.5;\n        -webkit-text-size-adjust: 100%;\n        font-family: system-ui, sans-serif;\n        -webkit-font-smoothing: antialiased;\n        text-rendering: optimizeLegibility;      \n        -moz-osx-font-smoothing: grayscale; \n        touch-action: manipulation; \n      }\n\n      body {\n        position: relative;\n        min-height: 100%;\n        font-feature-settings: \'kern\';\n      }\n\n      *,\n      *::before,\n      *::after {\n        border-width: 0;\n        border-style: solid;\n        box-sizing: border-box;\n      }\n\n      main {\n        display: block;\n      }\n\n      hr {\n        border-top-width: 1px;\n        box-sizing: content-box;\n        height: 0;\n        overflow: visible;\n      }\n\n      pre,\n      code,\n      kbd,\n      samp {\n        font-family: SFMono-Regular,  Menlo, Monaco, Consolas, monospace;\n        font-size: 1em;\n      }\n\n      a {\n        background-color: transparent;\n        color: inherit;\n        text-decoration: inherit;\n      }\n\n      abbr[title] {\n        border-bottom: none;\n        text-decoration: underline;\n        -webkit-text-decoration: underline dotted;\n        text-decoration: underline dotted;\n      }\n\n      b,\n      strong {\n        font-weight: bold;\n      }\n\n      small {\n        font-size: 80%;\n      }\n\n      sub,\n      sup {\n        font-size: 75%;\n        line-height: 0;\n        position: relative;\n        vertical-align: baseline;\n      }\n\n      sub {\n        bottom: -0.25em;\n      }\n\n      sup {\n        top: -0.5em;\n      }\n\n      img {\n        border-style: none;\n      }\n\n      button,\n      input,\n      optgroup,\n      select,\n      textarea {\n        font-family: inherit;\n        font-size: 100%;\n        line-height: 1.15;\n        margin: 0;\n      }\n\n      button,\n      input {\n        overflow: visible;\n      }\n\n      button,\n      select {\n        text-transform: none;\n      }\n\n      button::-moz-focus-inner,\n      [type="button"]::-moz-focus-inner,\n      [type="reset"]::-moz-focus-inner,\n      [type="submit"]::-moz-focus-inner {\n        border-style: none;\n        padding: 0;\n      }\n\n      fieldset {\n        padding: 0.35em 0.75em 0.625em;\n      }\n\n      legend {\n        box-sizing: border-box;\n        color: inherit;\n        display: table;\n        max-width: 100%;\n        padding: 0;\n        white-space: normal;\n      }\n\n      progress {\n        vertical-align: baseline;\n      }\n\n      textarea {\n        overflow: auto;\n      }\n\n      [type="checkbox"],\n      [type="radio"] {\n        box-sizing: border-box;\n        padding: 0;\n      }\n\n      [type="number"]::-webkit-inner-spin-button,\n      [type="number"]::-webkit-outer-spin-button {\n        -webkit-appearance: none !important;\n      }\n\n      input[type="number"] {\n        -moz-appearance: textfield;\n      }\n\n      [type="search"] {\n        -webkit-appearance: textfield;\n        outline-offset: -2px;\n      }\n\n      [type="search"]::-webkit-search-decoration {\n        -webkit-appearance: none !important;\n      }\n\n      ::-webkit-file-upload-button {\n        -webkit-appearance: button;\n        font: inherit;\n      }\n\n      details {\n        display: block;\n      }\n\n      summary {\n        display: list-item;\n      }\n\n      template {\n        display: none;\n      }\n\n      [hidden] {\n        display: none !important;\n      }\n\n      body,\n      blockquote,\n      dl,\n      dd,\n      h1,\n      h2,\n      h3,\n      h4,\n      h5,\n      h6,\n      hr,\n      figure,\n      p,\n      pre {\n        margin: 0;\n      }\n\n      button {\n        background: transparent;\n        padding: 0;\n      }\n\n      fieldset {\n        margin: 0;\n        padding: 0;\n      }\n\n      ol,\n      ul {\n        margin: 0;\n        padding: 0;\n      }\n\n      textarea {\n        resize: vertical;\n      }\n\n      button,\n      [role="button"] {\n        cursor: pointer;\n      }\n\n      button::-moz-focus-inner {\n        border: 0 !important;\n      }\n\n      table {\n        border-collapse: collapse;\n      }\n\n      h1,\n      h2,\n      h3,\n      h4,\n      h5,\n      h6 {\n        font-size: inherit;\n        font-weight: inherit;\n      }\n\n      button,\n      input,\n      optgroup,\n      select,\n      textarea {\n        padding: 0;\n        line-height: inherit;\n        color: inherit;\n      }\n\n      img,\n      svg,\n      video,\n      canvas,\n      audio,\n      iframe,\n      embed,\n      object {\n        display: block;\n        vertical-align: middle;\n      }\n\n      img,\n      video {\n        max-width: 100%;\n        height: auto;\n      }\n\n      [data-js-focus-visible] :focus:not([data-focus-visible-added]) {\n        outline: none;\n        box-shadow: none;\n      }\n\n      select::-ms-expand {\n        display: none;\n      }\n    '}),v=t("0x2G"),y=t("5+Am"),g=t("+p43"),w=t("epLR"),j={body:{classList:{add(){},remove(){}}},addEventListener(){},removeEventListener(){},activeElement:{blur(){},nodeName:""},querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,createEvent:()=>({initEvent(){}}),createElement:()=>({children:[],childNodes:[],style:{},setAttribute(){},getElementsByTagName:()=>[]})},O=()=>{},x={window:{document:j,navigator:{userAgent:""},CustomEvent:function(){return this},addEventListener:O,removeEventListener:O,getComputedStyle:()=>({getPropertyValue:()=>""}),matchMedia:()=>({matches:!1,addListener:O,removeListener:O}),requestAnimationFrame:e=>"undefined"===typeof setTimeout?(e(),null):setTimeout(e,0),cancelAnimationFrame(e){"undefined"!==typeof setTimeout&&clearTimeout(e)},setTimeout:()=>0,clearTimeout:O,setInterval:()=>0,clearInterval:O},document:j},k=w.e?{window:window,document:document}:x,E=Object(m.createContext)(k);function M(e){var{children:n,environment:t}=e,[r,o]=Object(m.useState)(null),a=Object(m.useMemo)((()=>{var e,n=null==r?void 0:r.ownerDocument,o=null==r?void 0:r.ownerDocument.defaultView;return null!=(e=null!=t?t:n?{document:n,window:o}:void 0)?e:k}),[r,t]),i=!r&&!t;return h.a.createElement(E.Provider,{value:a},n,i&&h.a.createElement("span",{ref:e=>{e&&o(e)}}))}s.a&&(E.displayName="EnvironmentContext"),s.a&&(M.displayName="EnvironmentProvider");var P=e=>{var{children:n,colorModeManager:t,portalZIndex:r,resetCSS:o=!0,theme:a=i.default,environment:c}=e;return m.createElement(M,{environment:c},m.createElement(y.c,{theme:a},m.createElement(g.b,{colorModeManager:t,options:a.config},o&&m.createElement(b,null),m.createElement(y.a,null),r?m.createElement(v.a,{zIndex:r},n):n)))},S=t("Sf+2"),_=t("Ty5D");var A=t("BsWD");function C(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e)){var t=[],r=!0,o=!1,a=void 0;try{for(var i,c=e[Symbol.iterator]();!(r=(i=c.next()).done)&&(t.push(i.value),!n||t.length!==n);r=!0);}catch(s){o=!0,a=s}finally{try{r||null==c.return||c.return()}finally{if(o)throw a}}return t}}(e,n)||Object(A.a)(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var I=t("g4pe"),z=t.n(I),D=t("bMWq"),W=t("6w0h"),q=t("itV3"),H=Object(m.memo)((function(){var e=Object(D.b)().dispatch,n=Object(D.c)().title,t=Object(_.h)();return Object(m.useEffect)((function(){var n=Object.entries(q.a).find((function(e){var n,r=C(e,2),o=r[0],a=r[1];return!!Object(_.f)(t.pathname,{path:"".concat("/frourio-demo/lock").concat(null!==(n=a.path)&&void 0!==n?n:"/".concat(o)),exact:a.exact})}));Object(W.a)(e,n?n[1].label:void 0)}),[null===t||void 0===t?void 0:t.pathname]),Object(r.jsxs)(z.a,{children:[Object(r.jsx)("meta",{name:"viewport",content:"initial-scale=1, width=device-width"}),Object(r.jsxs)("title",{children:[n?"".concat(n," - "):"","Reservation System"]}),Object(r.jsx)("link",{rel:"shortcut icon",href:"/favicon.png"})]})}));H.displayName="Head";var T=H,N=t("LhCv"),L=Object(N.a)();function R(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function B(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?R(Object(t),!0).forEach((function(n){Object(o.a)(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):R(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}var F=function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];var r=[...n],o=n[n.length-1];return Object(a.a)(o)&&r.length>1?r=r.slice(0,r.length-1):o=i.default,Object(c.c)(...r.map((e=>n=>Object(s.f)(e)?e(n):d(n,e))))(o)}({styles:{global:function(e){return{body:{color:Object(S.a)("gray.800","whiteAlpha.900")(e),bg:Object(S.a)("orange.50","gray.800")(e)},main:{width:"100%",display:"flex"}}}},components:{Button:{defaultProps:{colorScheme:"teal"},sizes:{xs:{minW:120},sm:{minW:120},md:{minW:120},lg:{minW:120}}}}}),K=function(e){var n=e.children;return Object(r.jsx)("div",{suppressHydrationWarning:!0,children:n})};n.default=function(e){var n=e.Component,t=e.pageProps;return Object(r.jsx)(K,{children:Object(r.jsx)(P,{theme:F,children:Object(r.jsx)(D.a,{children:Object(r.jsxs)(_.c,{history:L,children:[Object(r.jsx)(T,{}),Object(r.jsx)(n,B({},t))]})})})})}},g4pe:function(e,n,t){e.exports=t("8Kt/")},jwwp:function(e,n,t){"use strict";t.d(n,"a",(function(){return a}));var r=t("pr4h"),o=["borders","breakpoints","colors","components","config","direction","fonts","fontSizes","fontWeights","letterSpacings","lineHeights","radii","shadows","sizes","space","styles","transition","zIndices"];function a(e){return!!Object(r.h)(e)&&o.every((n=>Object.prototype.hasOwnProperty.call(e,n)))}},lwAK:function(e,n,t){"use strict";var r;n.__esModule=!0,n.AmpStateContext=void 0;var o=((r=t("q1tI"))&&r.__esModule?r:{default:r}).default.createContext({});n.AmpStateContext=o}},[[0,1,2,3,0,4,5]]]);