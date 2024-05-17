import{E as q,G as R,H as U,i as _,o as $,I as J,J as X,K as W,y as Y,w as k,z as Z,e as D,x as ee,L as te}from"./runtime-core.esm-bundler.CT1DoMlh.js";function H(e){return Y()?(Z(e),!0):!1}function j(e){return typeof e=="function"?e():X(e)}const ne=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const re=e=>typeof e<"u",oe=Object.prototype.toString,ie=e=>oe.call(e)==="[object Object]",P=()=>{};function ae(e,t){function n(...i){return new Promise((r,a)=>{Promise.resolve(e(()=>t.apply(this,i),{fn:t,thisArg:this,args:i})).then(r).catch(a)})}return n}const G=e=>e();function se(e=G){const t=_(!0);function n(){t.value=!1}function i(){t.value=!0}const r=(...a)=>{t.value&&e(...a)};return{isActive:R(t),pause:n,resume:i,eventFilter:r}}function ue(e){return W()}function le(...e){if(e.length!==1)return q(...e);const t=e[0];return typeof t=="function"?R(U(()=>({get:t,set:P}))):_(t)}function ce(e,t,n={}){const{eventFilter:i=G,...r}=n;return k(e,ae(i,t),r)}function fe(e,t,n={}){const{eventFilter:i,...r}=n,{eventFilter:a,pause:c,resume:s,isActive:f}=se(i);return{stop:ce(e,t,{...r,eventFilter:a}),pause:c,resume:s,isActive:f}}function K(e,t=!0,n){ue()?$(e,n):t?e():J(e)}function B(e){var t;const n=j(e);return(t=n?.$el)!=null?t:n}const N=ne?window:void 0;function x(...e){let t,n,i,r;if(typeof e[0]=="string"||Array.isArray(e[0])?([n,i,r]=e,t=N):[t,n,i,r]=e,!t)return P;Array.isArray(n)||(n=[n]),Array.isArray(i)||(i=[i]);const a=[],c=()=>{a.forEach(h=>h()),a.length=0},s=(h,d,b,u)=>(h.addEventListener(d,b,u),()=>h.removeEventListener(d,b,u)),f=k(()=>[B(t),j(r)],([h,d])=>{if(c(),!h)return;const b=ie(d)?{...d}:d;a.push(...n.flatMap(u=>i.map(y=>s(h,u,y,b))))},{immediate:!0,flush:"post"}),m=()=>{f(),c()};return H(m),m}function de(){const e=_(!1),t=W();return t&&$(()=>{e.value=!0},t),e}function pe(e){const t=de();return D(()=>(t.value,!!e()))}function me(e,t={}){const{window:n=N}=t,i=pe(()=>n&&"matchMedia"in n&&typeof n.matchMedia=="function");let r;const a=_(!1),c=m=>{a.value=m.matches},s=()=>{r&&("removeEventListener"in r?r.removeEventListener("change",c):r.removeListener(c))},f=te(()=>{i.value&&(s(),r=n.matchMedia(j(e)),"addEventListener"in r?r.addEventListener("change",c):r.addListener(c),a.value=r.matches)});return H(()=>{f(),s(),r=void 0}),a}function ge(e){return JSON.parse(JSON.stringify(e))}const T=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},V="__vueuse_ssr_handlers__",he=ve();function ve(){return V in T||(T[V]=T[V]||{}),T[V]}function I(e,t){return he[e]||t}function ye(e){return e==null?"any":e instanceof Set?"set":e instanceof Map?"map":e instanceof Date?"date":typeof e=="boolean"?"boolean":typeof e=="string"?"string":typeof e=="object"?"object":Number.isNaN(e)?"any":"number"}const we={boolean:{read:e=>e==="true",write:e=>String(e)},object:{read:e=>JSON.parse(e),write:e=>JSON.stringify(e)},number:{read:e=>Number.parseFloat(e),write:e=>String(e)},any:{read:e=>e,write:e=>String(e)},string:{read:e=>e,write:e=>String(e)},map:{read:e=>new Map(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e.entries()))},set:{read:e=>new Set(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e))},date:{read:e=>new Date(e),write:e=>e.toISOString()}},z="vueuse-storage";function Se(e,t,n,i={}){var r;const{flush:a="pre",deep:c=!0,listenToStorageChanges:s=!0,writeDefaults:f=!0,mergeDefaults:m=!1,shallow:h,window:d=N,eventFilter:b,onError:u=o=>{console.error(o)},initOnMounted:y}=i,p=(h?ee:_)(typeof t=="function"?t():t);if(!n)try{n=I("getDefaultStorage",()=>{var o;return(o=N)==null?void 0:o.localStorage})()}catch(o){u(o)}if(!n)return p;const S=j(t),A=ye(S),C=(r=i.serializer)!=null?r:we[A],{pause:g,resume:l}=fe(p,()=>O(p.value),{flush:a,deep:c,eventFilter:b});d&&s&&K(()=>{x(d,"storage",E),x(d,z,F),y&&E()}),y||E();function w(o,v){d&&d.dispatchEvent(new CustomEvent(z,{detail:{key:e,oldValue:o,newValue:v,storageArea:n}}))}function O(o){try{const v=n.getItem(e);if(o==null)w(v,null),n.removeItem(e);else{const M=C.write(o);v!==M&&(n.setItem(e,M),w(v,M))}}catch(v){u(v)}}function L(o){const v=o?o.newValue:n.getItem(e);if(v==null)return f&&S!=null&&n.setItem(e,C.write(S)),S;if(!o&&m){const M=C.read(v);return typeof m=="function"?m(M,S):A==="object"&&!Array.isArray(M)?{...S,...M}:M}else return typeof v!="string"?v:C.read(v)}function E(o){if(!(o&&o.storageArea!==n)){if(o&&o.key==null){p.value=S;return}if(!(o&&o.key!==e)){g();try{o?.newValue!==C.write(p.value)&&(p.value=L(o))}catch(v){u(v)}finally{o?J(l):l()}}}}function F(o){E(o.detail)}return p}function Q(e){return me("(prefers-color-scheme: dark)",e)}function be(e={}){const{selector:t="html",attribute:n="class",initialValue:i="auto",window:r=N,storage:a,storageKey:c="vueuse-color-scheme",listenToStorageChanges:s=!0,storageRef:f,emitAuto:m,disableTransition:h=!0}=e,d={auto:"",light:"light",dark:"dark",...e.modes||{}},b=Q({window:r}),u=D(()=>b.value?"dark":"light"),y=f||(c==null?le(i):Se(c,i,a,{window:r,listenToStorageChanges:s})),p=D(()=>y.value==="auto"?u.value:y.value),S=I("updateHTMLAttrs",(l,w,O)=>{const L=typeof l=="string"?r?.document.querySelector(l):B(l);if(!L)return;let E;if(h&&(E=r.document.createElement("style"),E.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),r.document.head.appendChild(E)),w==="class"){const F=O.split(/\s/g);Object.values(d).flatMap(o=>(o||"").split(/\s/g)).filter(Boolean).forEach(o=>{F.includes(o)?L.classList.add(o):L.classList.remove(o)})}else L.setAttribute(w,O);h&&(r.getComputedStyle(E).opacity,document.head.removeChild(E))});function A(l){var w;S(t,n,(w=d[l])!=null?w:l)}function C(l){e.onChanged?e.onChanged(l,A):A(l)}k(p,C,{flush:"post",immediate:!0}),K(()=>C(p.value));const g=D({get(){return m?y.value:p.value},set(l){y.value=l}});try{return Object.assign(g,{store:y,system:u,state:p})}catch{return g}}function Ee(e={}){const{valueDark:t="dark",valueLight:n="",window:i=N}=e,r=be({...e,onChanged:(s,f)=>{var m;e.onChanged?(m=e.onChanged)==null||m.call(e,s==="dark",f,s):f(s)},modes:{dark:t,light:n}}),a=D(()=>r.system?r.system.value:Q({window:i}).value?"dark":"light");return D({get(){return r.value==="dark"},set(s){const f=s?"dark":"light";a.value===f?r.value="auto":r.value=f}})}function Oe(e,t,n,i={}){var r,a,c;const{clone:s=!1,passive:f=!1,eventName:m,deep:h=!1,defaultValue:d,shouldEmit:b}=i,u=W(),y=n||u?.emit||((r=u?.$emit)==null?void 0:r.bind(u))||((c=(a=u?.proxy)==null?void 0:a.$emit)==null?void 0:c.bind(u?.proxy));let p=m;p=p||`update:${t.toString()}`;const S=g=>s?typeof s=="function"?s(g):ge(g):g,A=()=>re(e[t])?S(e[t]):d,C=g=>{b?b(g)&&y(p,g):y(p,g)};if(f){const g=A(),l=_(g);let w=!1;return k(()=>e[t],O=>{w||(w=!0,l.value=S(O),J(()=>w=!1))}),k(l,O=>{!w&&(O!==e[t]||h)&&C(O)},{deep:h}),l}else return D({get(){return A()},set(g){C(g)}})}export{Oe as a,Ee as b,be as u};
