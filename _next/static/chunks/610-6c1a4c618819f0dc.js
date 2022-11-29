"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[610],{8285:function(e,t,n){n.d(t,{Z:function(){return w}});var r=n(2086),a=n(8928);function o(e){var t=e.className,n=e.theme;return(0,r.jsx)("div",{className:t,children:(0,r.jsx)("div",{className:"hidden md:block relative h-32 overflow-hidden rounded",children:(0,r.jsx)("img",{src:n.header,alt:"header bookend",className:"absolute w-full"})})})}var i=n(381),l=n.n(i),c=n(7822),s=n(7630),u=n(3236),f=n(4358),d=n(2999),m=n(5220),h=n(1959),v=n(7926);function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function y(e,t,n,r,a,o,i){try{var l=e[o](i),c=l.value}catch(s){return void n(s)}l.done?t(c):Promise.resolve(c).then(r,a)}function b(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,a,o=[],i=!0,l=!1;try{for(n=n.call(e);!(i=(r=n.next()).done)&&(o.push(r.value),!t||o.length!==t);i=!0);}catch(c){l=!0,a=c}finally{try{i||null==n.return||n.return()}finally{if(l)throw a}}return o}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return p(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return p(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function g(e){var t=e.className,n=e.theme,o=(0,s.ZP)("/index.json?uuid=".concat("55e59cdc-8ab4-4248-a414-3a1275d5e218"),function(){var e,t=(e=l().mark((function e(t){var n,r;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t);case 2:return n=e.sent,e.next=5,n.json();case 5:return r=e.sent,e.abrupt("return",c.Index.load(r));case 7:case"end":return e.stop()}}),e)})),function(){var t=this,n=arguments;return new Promise((function(r,a){var o=e.apply(t,n);function i(e){y(o,r,a,i,l,"next",e)}function l(e){y(o,r,a,i,l,"throw",e)}i(void 0)}))});return function(e){return t.apply(this,arguments)}}()),i=o.data,p=(0,u.useState)(null),g=p[0],x=p[1],w=(0,u.useState)(""),j=w[0],N=w[1],A=(0,a.useRouter)(),S=i?i.query((function(){this.term((0,c.tokenizer)("*".concat(j,"*")),{})})):[];return(0,r.jsx)("div",{className:"".concat(t," ").concat(n.text.main),children:(0,r.jsx)(f.h,{value:g,onChange:function(e){if(null==e)return x(e);var t=b(e.ref.split("/"),2),n=t[0],r=t[1];A.push("/".concat((0,v.Z)(n),"/").concat((0,v.Z)(r)))},nullable:!0,children:(0,r.jsxs)("div",{className:"".concat(n.font.main," mt-1 relative"),children:[(0,r.jsxs)("div",{className:"relative w-full cursor-default overflow-hidden bg-white rounded text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-crimson-500 sm:text-sm",children:[(0,r.jsx)(f.h.Input,{className:"w-full border-none py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0 focus:ring-crimson-500",displayValue:function(e){return null===e||void 0===e?void 0:e.ref.split("/")[1]},onChange:function(e){return N(e.target.value)},autoComplete:"off",autoCorrect:"off",autoCapitalize:"off"}),(0,r.jsx)(f.h.Button,{className:"absolute inset-y-0 right-0 flex items-center pr-2",children:(0,r.jsx)(m.G,{icon:h.wn1,className:"".concat(n.text.primary," h-5 w-5")})})]}),(0,r.jsx)(d.u,{leave:"transition ease-in duration-100",leaveFrom:"opacity-100",leaveTo:"opacity-0",afterLeave:function(){return N("")},children:(0,r.jsx)(f.h.Options,{className:"absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",children:0===S.length&&""!==j?(0,r.jsx)("div",{className:"relative cursor-default select-none py-2 px-4",children:"Nothing found."}):S.map((function(e){return(0,r.jsx)(f.h.Option,{className:function(e){var t=e.active;return"relative cursor-default select-none py-2 pl-4 pr-4 ".concat(t?"".concat(n.text.bg," ").concat(n.bg.primary):"")},value:e,children:function(t){var a=t.selected,o=t.active;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("span",{className:"block truncate ".concat(a?"font-medium":"font-normal"),children:e.ref.split("/")[1]}),a?(0,r.jsx)("span",{className:"absolute inset-y-0 left-0 flex items-center pl-3 ".concat(o?n.text.bg:n.text.primary),children:(0,r.jsx)(m.G,{icon:h.LEp,className:"h-5 w-5"})}):null]})}},e.ref)}))})})]})})})}function x(e){var t=e.onClick,n=e.className,a=e.subheading,o=e.theme;return(0,r.jsx)("div",{className:n,onClick:t,children:(0,r.jsxs)("div",{className:"flex flex-col md:flex-row items-center mt-6 mb-1",children:[(0,r.jsxs)("h1",{className:"".concat(o.text.primary," ").concat(o.font.title," text-2xl"),children:["archive.",(0,r.jsx)("span",{className:"".concat(o.text.secondary," ").concat(o.font.subtitle," text-lg pl-2"),children:null!==a&&void 0!==a?a:"a repository of knowledge"})]}),(0,r.jsx)("div",{className:"flex-grow"}),(0,r.jsx)(g,{className:"z-10 w-full md:w-2/5",theme:o})]})})}function w(e){var t=e.subheading,n=e.theme,i=e.className,l=(0,a.useRouter)();return(0,r.jsxs)("div",{className:"".concat(i," flex flex-col"),children:[(0,r.jsx)(x,{className:"cursor-pointer",subheading:t,theme:n,onClick:function(){return l.push("/")}}),(0,r.jsx)(o,{theme:n})]})}},1073:function(e,t,n){n.d(t,{Z:function(){return d}});var r=n(6858),a=n(6885);function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function l(e){if(Array.isArray(e))return e}function c(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function s(e,t){return l(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,a,o=[],i=!0,l=!1;try{for(n=n.call(e);!(i=(r=n.next()).done)&&(o.push(r.value),!t||o.length!==t);i=!0);}catch(c){l=!0,a=c}finally{try{i||null==n.return||n.return()}finally{if(l)throw a}}return o}}(e,t)||f(e,t)||c()}function u(e){return l(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||f(e,i)||c()}function f(e,t){if(e){if("string"===typeof e)return o(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?o(e,t):void 0}}var d=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e);var n=s(t.split("|"),2),r=n[0],a=n[1],o=s(r.split("."),3),i=o[0],l=o[1],c=o[2];this.day=parseInt(i),this.month=parseInt(l),this.year=parseInt(c),this.cycle=parseInt(a)}var t=e.prototype;return t.compareKey=function(){return 1e5*this.cycle+1e4*this.year+1e3*this.month+this.day},t.ppMonth=function(){switch(this.month){case 0:return"None";case 1:return"Vaati";case 2:return"Udasil";case 3:return"Samay";case 4:return"Sunnok";case 5:return"Kybal";case 6:return"Kanon";case 7:return"Ravic";case 8:return"Davar";case 9:return"Vikar";case 10:return"Shamash";case 11:return"Dahn";case 12:return"Vazan";default:throw new Error("BAD DATE PASSED")}},e}();(0,a.zGw)((0,a.Vl2)("\n"),(0,a.u4g)((0,r.ZP)((function(e,t){var n=u(t.split(":")),r=n[0],a=n.slice(1);""!==r&&(e[r]=a.join(":").trim())})),{}),(function(e){var t,n,r,a,o,i,l,c,s,u,f,d,m,h,v,p,y=null!==(s=null===(t=e.refs)||void 0===t?void 0:t.split("|").map((function(e){return e.trim()})))&&void 0!==s?s:[],b=null!==(u=null===(n=e.ipa)||void 0===n?void 0:n.trim())&&void 0!==u?u:null,g=null!==(f=null===(r=e.img)||void 0===r?void 0:r.trim())&&void 0!==f?f:null,x=null!==(d=null===(a=e.dsp)||void 0===a?void 0:a.trim())&&void 0!==d?d:null,w=null!==(m=null===(o=e.date)||void 0===o?void 0:o.trim())&&void 0!==m?m:null,j=null!==(h=null===(i=e.news)||void 0===i?void 0:i.split("|").map((function(e){return e.trim()})))&&void 0!==h?h:[],N=null!==(v=null===(l=e.theme)||void 0===l?void 0:l.trim())&&void 0!==v?v:null,A=null!==(p=null===(c=e.flag)||void 0===c?void 0:c.trim())&&void 0!==p?p:null;return{refs:y,ipa:b,img:g,dsp:x,date:w,news:j.length>0?{author:j[0],paper:j[1]}:null,theme:N,flag:A}}))},7926:function(e,t,n){n.d(t,{Z:function(){return r}});n(6885),n(1073);function r(e){return encodeURIComponent(e.replaceAll(" ","-").replaceAll("&","and").replaceAll("\xae","").toLocaleLowerCase())}},2918:function(e,t,n){n.d(t,{g:function(){return l}});var r=n(6858),a={text:{primary:"text-crimson-500",secondary:"text-slate-500",main:"text-slate-900",soft:"text-slate-700",bg:"text-background-400"},bg:{primary:"bg-crimson-500",soft:"bg-crimson-700",hard:"bg-crimson-800",bg:"bg-background-400"},font:{title:"font-eczar",subtitle:"font-tauri",main:"font-gelasio",alt:"font-roboto"},header:"/header1.png"};var o,i=(o=function(e){e.text.primary="text-cyan-700",e.bg.primary="bg-cyan-700",e.bg.soft="bg-cyan-800",e.bg.hard="bg-cyan-900",e.header="/header2.jpeg"},(0,r.ZP)(a,o));function l(e){return"astra"===e?i:a}}}]);