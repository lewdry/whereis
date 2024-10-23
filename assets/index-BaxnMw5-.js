var ke=Object.defineProperty;var Se=(e,t,n)=>t in e?ke(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var J=(e,t,n)=>Se(e,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))l(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const f of r.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&l(f)}).observe(document,{childList:!0,subtree:!0});function n(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function l(o){if(o.ep)return;o.ep=!0;const r=n(o);fetch(o.href,r)}})();function T(){}function ae(e){return e()}function Z(){return Object.create(null)}function R(e){e.forEach(ae)}function de(e){return typeof e=="function"}function Ee(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function Ae(e){return Object.keys(e).length===0}function u(e,t){e.appendChild(t)}function N(e,t,n){e.insertBefore(t,n||null)}function E(e){e.parentNode&&e.parentNode.removeChild(e)}function ee(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function m(e){return document.createElement(e)}function S(e){return document.createTextNode(e)}function C(){return S(" ")}function me(){return S("")}function X(e,t,n,l){return e.addEventListener(t,n,l),()=>e.removeEventListener(t,n,l)}function _(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function Ne(e){return Array.from(e.childNodes)}function F(e,t){t=""+t,e.data!==t&&(e.data=t)}function $(e,t,n,l){n==null?e.style.removeProperty(t):e.style.setProperty(t,n,"")}let q;function I(e){q=e}function Pe(){if(!q)throw new Error("Function called outside component initialization");return q}function Oe(e){Pe().$$.on_mount.push(e)}const B=[],te=[];let W=[];const ne=[],he=Promise.resolve();let K=!1;function pe(){K||(K=!0,he.then(ge))}function ze(){return pe(),he}function U(e){W.push(e)}const V=new Set;let G=0;function ge(){if(G!==0)return;const e=q;do{try{for(;G<B.length;){const t=B[G];G++,I(t),Ce(t.$$)}}catch(t){throw B.length=0,G=0,t}for(I(null),B.length=0,G=0;te.length;)te.pop()();for(let t=0;t<W.length;t+=1){const n=W[t];V.has(n)||(V.add(n),n())}W.length=0}while(B.length);for(;ne.length;)ne.pop()();K=!1,V.clear(),I(e)}function Ce(e){if(e.fragment!==null){e.update(),R(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(U)}}function $e(e){const t=[],n=[];W.forEach(l=>e.indexOf(l)===-1?t.push(l):n.push(l)),n.forEach(l=>l()),W=t}const Le=new Set;function Fe(e,t){e&&e.i&&(Le.delete(e),e.i(t))}function H(e){return(e==null?void 0:e.length)!==void 0?e:Array.from(e)}function Ge(e,t,n){const{fragment:l,after_update:o}=e.$$;l&&l.m(t,n),U(()=>{const r=e.$$.on_mount.map(ae).filter(de);e.$$.on_destroy?e.$$.on_destroy.push(...r):R(r),e.$$.on_mount=[]}),o.forEach(U)}function Be(e,t){const n=e.$$;n.fragment!==null&&($e(n.after_update),R(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function We(e,t){e.$$.dirty[0]===-1&&(B.push(e),pe(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function Ie(e,t,n,l,o,r,f=null,s=[-1]){const c=q;I(e);const i=e.$$={fragment:null,ctx:[],props:r,update:T,not_equal:o,bound:Z(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(c?c.$$.context:[])),callbacks:Z(),dirty:s,skip_bound:!1,root:t.target||c.$$.root};f&&f(i.root);let h=!1;if(i.ctx=n?n(e,t.props||{},(a,p,...v)=>{const g=v.length?v[0]:p;return i.ctx&&o(i.ctx[a],i.ctx[a]=g)&&(!i.skip_bound&&i.bound[a]&&i.bound[a](g),h&&We(e,a)),p}):[],i.update(),h=!0,R(i.before_update),i.fragment=l?l(i.ctx):!1,t.target){if(t.hydrate){const a=Ne(t.target);i.fragment&&i.fragment.l(a),a.forEach(E)}else i.fragment&&i.fragment.c();t.intro&&Fe(e.$$.fragment),Ge(e,t.target,t.anchor),ge()}I(c)}class Te{constructor(){J(this,"$$");J(this,"$$set")}$destroy(){Be(this,1),this.$destroy=T}$on(t,n){if(!de(n))return T;const l=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return l.push(n),()=>{const o=l.indexOf(n);o!==-1&&l.splice(o,1)}}$set(t){this.$$set&&!Ae(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const qe="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(qe);function oe(e,t,n){const l=e.slice();return l[26]=t[n],l}function le(e,t,n){const l=e.slice();return l[29]=t[n],l}function se(e){let t,n,l,o,r,f,s,c,i,h,a,p,v=e[3].emoji+"",g,j,b,w,P;return{c(){t=m("div"),n=m("div"),l=m("h1"),o=m("span"),o.textContent="Where is",r=m("br"),f=m("span"),s=S(e[0]),c=C(),i=S(e[1]),h=S("?"),a=C(),p=m("div"),g=S(v),j=C(),b=m("button"),b.textContent="Search",_(o,"class","highlight svelte-b238sj"),_(f,"class","name svelte-b238sj"),_(l,"class","svelte-b238sj"),_(n,"class","text-container svelte-b238sj"),_(p,"class","emoji svelte-b238sj"),_(b,"class","svelte-b238sj"),_(t,"class","splash-screen svelte-b238sj")},m(A,O){N(A,t,O),u(t,n),u(n,l),u(l,o),u(l,r),u(l,f),u(f,s),u(f,c),u(f,i),u(l,h),u(t,a),u(t,p),u(p,g),u(t,j),u(t,b),w||(P=X(b,"click",e[8]),w=!0)},p(A,O){O[0]&1&&F(s,A[0]),O[0]&2&&F(i,A[1]),O[0]&8&&v!==(v=A[3].emoji+"")&&F(g,v)},d(A){A&&E(t),w=!1,P()}}}function ie(e){let t,n=e[7]&&re(e);return{c(){t=m("div"),n&&n.c(),_(t,"class","game-screen svelte-b238sj")},m(l,o){N(l,t,o),n&&n.m(t,null)},p(l,o){l[7]?n?n.p(l,o):(n=re(l),n.c(),n.m(t,null)):n&&(n.d(1),n=null)},d(l){l&&E(t),n&&n.d()}}}function re(e){let t,n,l=H(e[5]),o=[];for(let s=0;s<l.length;s+=1)o[s]=fe(le(e,l,s));let r=H(e[6]),f=[];for(let s=0;s<r.length;s+=1)f[s]=ce(oe(e,r,s));return{c(){for(let s=0;s<o.length;s+=1)o[s].c();t=C();for(let s=0;s<f.length;s+=1)f[s].c();n=me()},m(s,c){for(let i=0;i<o.length;i+=1)o[i]&&o[i].m(s,c);N(s,t,c);for(let i=0;i<f.length;i+=1)f[i]&&f[i].m(s,c);N(s,n,c)},p(s,c){if(c[0]&32){l=H(s[5]);let i;for(i=0;i<l.length;i+=1){const h=le(s,l,i);o[i]?o[i].p(h,c):(o[i]=fe(h),o[i].c(),o[i].m(t.parentNode,t))}for(;i<o.length;i+=1)o[i].d(1);o.length=l.length}if(c[0]&1088){r=H(s[6]);let i;for(i=0;i<r.length;i+=1){const h=oe(s,r,i);f[i]?f[i].p(h,c):(f[i]=ce(h),f[i].c(),f[i].m(n.parentNode,n))}for(;i<f.length;i+=1)f[i].d(1);f.length=r.length}},d(s){s&&(E(t),E(n)),ee(o,s),ee(f,s)}}}function fe(e){let t,n=e[29].emoji+"",l;return{c(){t=m("div"),l=S(n),_(t,"class","background-emoji svelte-b238sj"),$(t,"top",e[29].y+"%"),$(t,"left",e[29].x+"%")},m(o,r){N(o,t,r),u(t,l)},p(o,r){r[0]&32&&n!==(n=o[29].emoji+"")&&F(l,n),r[0]&32&&$(t,"top",o[29].y+"%"),r[0]&32&&$(t,"left",o[29].x+"%")},d(o){o&&E(t)}}}function ce(e){let t,n=e[26].emoji+"",l,o,r,f;function s(){return e[11](e[26])}return{c(){t=m("button"),l=S(n),o=C(),_(t,"class","person-emoji svelte-b238sj"),$(t,"top",e[26].y+"%"),$(t,"left",e[26].x+"%")},m(c,i){N(c,t,i),u(t,l),u(t,o),r||(f=X(t,"click",s),r=!0)},p(c,i){e=c,i[0]&64&&n!==(n=e[26].emoji+"")&&F(l,n),i[0]&64&&$(t,"top",e[26].y+"%"),i[0]&64&&$(t,"left",e[26].x+"%")},d(c){c&&E(t),r=!1,f()}}}function ue(e){let t,n,l,o,r,f,s,c,i,h,a,p,v,g,j,b;return{c(){t=m("div"),n=m("div"),l=m("h1"),o=m("span"),o.textContent="Congratulations!",r=m("br"),f=S("You found"),s=m("br"),c=m("span"),i=S(e[0]),h=C(),a=S(e[1]),p=S("!"),v=C(),g=m("button"),g.textContent="New Game",_(o,"class","highlight svelte-b238sj"),_(c,"class","name svelte-b238sj"),_(l,"class","svelte-b238sj"),_(n,"class","text-container svelte-b238sj"),_(g,"class","new-game-btn svelte-b238sj"),_(t,"class","win-screen svelte-b238sj")},m(w,P){N(w,t,P),u(t,n),u(n,l),u(l,o),u(l,r),u(l,f),u(l,s),u(l,c),u(c,i),u(c,h),u(c,a),u(l,p),u(t,v),u(t,g),j||(b=X(g,"click",e[9]),j=!0)},p(w,P){P[0]&1&&F(i,w[0]),P[0]&2&&F(a,w[1])},d(w){w&&E(t),j=!1,b()}}}function He(e){let t,n,l,o=!e[4]&&se(e),r=e[4]&&!e[2]&&ie(e),f=e[2]&&ue(e);return{c(){o&&o.c(),t=C(),r&&r.c(),n=C(),f&&f.c(),l=me()},m(s,c){o&&o.m(s,c),N(s,t,c),r&&r.m(s,c),N(s,n,c),f&&f.m(s,c),N(s,l,c)},p(s,c){s[4]?o&&(o.d(1),o=null):o?o.p(s,c):(o=se(s),o.c(),o.m(t.parentNode,t)),s[4]&&!s[2]?r?r.p(s,c):(r=ie(s),r.c(),r.m(n.parentNode,n)):r&&(r.d(1),r=null),s[2]?f?f.p(s,c):(f=ue(s),f.c(),f.m(l.parentNode,l)):f&&(f.d(1),f=null)},i:T,o:T,d(s){s&&(E(t),E(n),E(l)),o&&o.d(s),r&&r.d(s),f&&f.d(s)}}}function Re(e,t,n=10){const l=Math.abs(e.x-t.x),o=Math.abs(e.y-t.y);return l<n&&o<n}function Ye(e,t,n){let l=["Ali","Ashley","Ang","Bradlee","Bobbie","Jose","Wei","Yan","Andy","Ying","Jean","Fransico","Hong","Fady","Rich","Rory","Jo","Sammy","Philly","Mal","Tippy","Sal","Barb"],o=["Beaverton","Affagato","Consomme","Vendetta","Smiley","Gorge","Keyboard","Diamanté","Blancmange","Afterdinner","Tobermory","Futon","Banquette","Meringue","Fingertip","President","Chapter","Cookie","Tennis-Smythe","Badminton","Flounder","Crust","Sandal","Greenhouse","Bassoon","Foothold","Mouthbreath","Rowboat","Childsplay","Flatbread","Legume"],r=["🌳","🌲","🎄","🌴","⛩️","🗿","🗼","🎡","⛲️"],f=["🏠","🏰","🛕","🏩","🕍","🏚️","🏢","🏬","🏛️","🏥","💒","🕌","🏦","🏟️","🏫","🏯","🏣","🏪","🏤"],s=["🧍‍♂️","🧍‍♀️","💃","🕺","🧜","🧘","🤾","👨‍🦼","👩‍🦯‍➡️","⛹️‍♀️","🧚","🤺","🤸‍♀️","🏌️‍♂️","🪂","🏇","🏋️‍♀️"],c={},i="",h="",a=!1,p=!1,v=[],g=[],j,b,w=!1;const P=()=>{const d=window.innerWidth;return d<=480?{size:48,fontSize:"8vw"}:d<=768?{size:48,fontSize:"6vw"}:{size:48,fontSize:"5vw"}};function A(d=!1){const{size:z}=P(),M=z/2,L=j-z-M,y=b-z-M;if(d){const k=z*1.5,x=Math.floor(L/k),we=Math.floor(y/k),je=Math.floor(Math.random()*x),Me=Math.floor(Math.random()*we);return{x:(M+je*k)/j*100,y:(M+Me*k)/b*100}}return{x:(M+Math.random()*(L-M))/j*100,y:(M+Math.random()*(y-M))/b*100}}function O(d,z=!1){let M=0;const L=500;for(;M<L;){const y=A(z);if(!d.some(x=>Re(y,x,z?15:10)))return y;M++}return A(z)}function D(){n(0,i=l[Math.floor(Math.random()*l.length)]),n(1,h=o[Math.floor(Math.random()*o.length)]),n(3,c={emoji:s[Math.floor(Math.random()*s.length)],id:Math.random().toString(36).substr(2,9)}),n(5,v=[]),n(6,g=[])}function _e(){if(!j||!b){const y=document.querySelector(".game-screen");y&&(j=y.clientWidth,b=y.clientHeight)}const d=[];n(5,v=[...r,...f].map(y=>{const k=O(d,!0);return d.push(k),{emoji:y,x:k.x,y:k.y}}));const M=[...s].filter(y=>y!==c.emoji).sort(()=>Math.random()-.5).slice(0,5).map(y=>{const k=O(d,!1);return d.push(k),{emoji:y,id:Math.random().toString(36).substr(2,9),x:k.x,y:k.y}}),L=O(d,!1);n(3,c={...c,x:L.x,y:L.y}),n(6,g=[...M,c])}function Y(){const d=document.querySelector(".game-screen");d&&(j=d.clientWidth,b=d.clientHeight,a&&!p&&_e())}Oe(()=>(D(),window.addEventListener("resize",Y),()=>{window.removeEventListener("resize",Y)}));async function be(){n(4,a=!0),n(2,p=!1),await ze(),setTimeout(()=>{Y(),n(7,w=!0)},50)}function ye(){D(),n(4,a=!1),n(2,p=!1),n(7,w=!1)}function Q(d){d.id===c.id&&n(2,p=!0)}const ve=d=>Q(d);return e.$$.update=()=>{e.$$.dirty[0]&7},[i,h,p,c,a,v,g,w,be,ye,Q,ve]}class xe extends Te{constructor(t){super(),Ie(this,t,Ye,He,Ee,{},null,[-1,-1])}}new xe({target:document.getElementById("app")});
