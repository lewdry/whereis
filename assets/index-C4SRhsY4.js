var Le=Object.defineProperty;var Be=(e,t,n)=>t in e?Le(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var Z=(e,t,n)=>Be(e,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const a of l.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(o){if(o.ep)return;o.ep=!0;const l=n(o);fetch(o.href,l)}})();function J(){}function ye(e){return e()}function se(){return Object.create(null)}function X(e){e.forEach(ye)}function be(e){return typeof e=="function"}function Oe(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function Ge(e){return Object.keys(e).length===0}function f(e,t){e.appendChild(t)}function L(e,t,n){e.insertBefore(t,n||null)}function x(e){e.parentNode&&e.parentNode.removeChild(e)}function re(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function m(e){return document.createElement(e)}function j(e){return document.createTextNode(e)}function B(){return j(" ")}function we(){return j("")}function z(e,t,n,s){return e.addEventListener(t,n,s),()=>e.removeEventListener(t,n,s)}function $(e){return function(t){return t.preventDefault(),e.call(this,t)}}function p(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function Fe(e){return Array.from(e.childNodes)}function Y(e,t){t=""+t,e.data!==t&&(e.data=t)}function O(e,t,n,s){n==null?e.style.removeProperty(t):e.style.setProperty(t,n,"")}let q;function I(e){q=e}function ze(){if(!q)throw new Error("Function called outside component initialization");return q}function Ye(e){ze().$$.on_mount.push(e)}const W=[],ae=[];let D=[];const ce=[],ve=Promise.resolve();let ne=!1;function Me(){ne||(ne=!0,ve.then(Se))}function Te(){return Me(),ve}function oe(e){D.push(e)}const ee=new Set;let R=0;function Se(){if(R!==0)return;const e=q;do{try{for(;R<W.length;){const t=W[R];R++,I(t),Re(t.$$)}}catch(t){throw W.length=0,R=0,t}for(I(null),W.length=0,R=0;ae.length;)ae.pop()();for(let t=0;t<D.length;t+=1){const n=D[t];ee.has(n)||(ee.add(n),n())}D.length=0}while(W.length);for(;ce.length;)ce.pop()();ne=!1,ee.clear(),I(e)}function Re(e){if(e.fragment!==null){e.update(),X(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(oe)}}function We(e){const t=[],n=[];D.forEach(s=>e.indexOf(s)===-1?t.push(s):n.push(s)),n.forEach(s=>s()),D=t}const De=new Set;function Xe(e,t){e&&e.i&&(De.delete(e),e.i(t))}function H(e){return(e==null?void 0:e.length)!==void 0?e:Array.from(e)}function Ie(e,t,n){const{fragment:s,after_update:o}=e.$$;s&&s.m(t,n),oe(()=>{const l=e.$$.on_mount.map(ye).filter(be);e.$$.on_destroy?e.$$.on_destroy.push(...l):X(l),e.$$.on_mount=[]}),o.forEach(oe)}function Je(e,t){const n=e.$$;n.fragment!==null&&(We(n.after_update),X(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function qe(e,t){e.$$.dirty[0]===-1&&(W.push(e),Me(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function He(e,t,n,s,o,l,a=null,r=[-1]){const c=q;I(e);const i=e.$$={fragment:null,ctx:[],props:l,update:J,not_equal:o,bound:se(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(c?c.$$.context:[])),callbacks:se(),dirty:r,skip_bound:!1,root:t.target||c.$$.root};a&&a(i.root);let u=!1;if(i.ctx=n?n(e,t.props||{},(h,S,...g)=>{const _=g.length?g[0]:S;return i.ctx&&o(i.ctx[h],i.ctx[h]=_)&&(!i.skip_bound&&i.bound[h]&&i.bound[h](_),u&&qe(e,h)),S}):[],i.update(),u=!0,X(i.before_update),i.fragment=s?s(i.ctx):!1,t.target){if(t.hydrate){const h=Fe(t.target);i.fragment&&i.fragment.l(h),h.forEach(x)}else i.fragment&&i.fragment.c();t.intro&&Xe(e.$$.fragment),Ie(e,t.target,t.anchor),Se()}I(c)}class $e{constructor(){Z(this,"$$");Z(this,"$$set")}$destroy(){Je(this,1),this.$destroy=J}$on(t,n){if(!be(n))return J;const s=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return s.push(n),()=>{const o=s.indexOf(n);o!==-1&&s.splice(o,1)}}$set(t){this.$$set&&!Ge(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const Ve="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(Ve);const te="/whereis/assets/win.mp3";function fe(e,t,n){const s=e.slice();return s[31]=t[n],s}function ue(e,t,n){const s=e.slice();return s[34]=t[n],s}function de(e){let t,n,s,o,l,a,r,c,i,u,h,S,g,_=e[3].emoji+"",b,E,w,A,P;return{c(){t=m("div"),n=m("div"),s=m("div"),o=m("h1"),l=m("span"),l.textContent="Where is",a=m("br"),r=m("span"),c=j(e[0]),i=B(),u=j(e[1]),h=j("?"),S=B(),g=m("div"),b=j(_),E=B(),w=m("button"),w.textContent="Search",p(l,"class","highlight svelte-l65gnw"),p(r,"class","name svelte-l65gnw"),p(o,"class","svelte-l65gnw"),p(s,"class","text-container svelte-l65gnw"),p(g,"class","emoji svelte-l65gnw"),p(w,"class","svelte-l65gnw"),p(n,"class","splash-screen svelte-l65gnw"),p(t,"class","container svelte-l65gnw")},m(N,G){L(N,t,G),f(t,n),f(n,s),f(s,o),f(o,l),f(o,a),f(o,r),f(r,c),f(r,i),f(r,u),f(o,h),f(n,S),f(n,g),f(g,b),f(n,E),f(n,w),A||(P=z(w,"click",e[8]),A=!0)},p(N,G){G[0]&1&&Y(c,N[0]),G[0]&2&&Y(u,N[1]),G[0]&8&&_!==(_=N[3].emoji+"")&&Y(b,_)},d(N){N&&x(t),A=!1,P()}}}function me(e){let t,n,s,o,l=e[7]&&he(e);return{c(){t=m("div"),n=m("div"),l&&l.c(),p(n,"class","game-screen svelte-l65gnw"),p(t,"class","container svelte-l65gnw")},m(a,r){L(a,t,r),f(t,n),l&&l.m(n,null),s||(o=[z(n,"touchmove",$(et)),z(n,"touchstart",$(tt)),z(n,"touchend",$(nt))],s=!0)},p(a,r){a[7]?l?l.p(a,r):(l=he(a),l.c(),l.m(n,null)):l&&(l.d(1),l=null)},d(a){a&&x(t),l&&l.d(),s=!1,X(o)}}}function he(e){let t,n,s=H(e[5]),o=[];for(let r=0;r<s.length;r+=1)o[r]=pe(ue(e,s,r));let l=H(e[6]),a=[];for(let r=0;r<l.length;r+=1)a[r]=ge(fe(e,l,r));return{c(){for(let r=0;r<o.length;r+=1)o[r].c();t=B();for(let r=0;r<a.length;r+=1)a[r].c();n=we()},m(r,c){for(let i=0;i<o.length;i+=1)o[i]&&o[i].m(r,c);L(r,t,c);for(let i=0;i<a.length;i+=1)a[i]&&a[i].m(r,c);L(r,n,c)},p(r,c){if(c[0]&32){s=H(r[5]);let i;for(i=0;i<s.length;i+=1){const u=ue(r,s,i);o[i]?o[i].p(u,c):(o[i]=pe(u),o[i].c(),o[i].m(t.parentNode,t))}for(;i<o.length;i+=1)o[i].d(1);o.length=s.length}if(c[0]&1088){l=H(r[6]);let i;for(i=0;i<l.length;i+=1){const u=fe(r,l,i);a[i]?a[i].p(u,c):(a[i]=ge(u),a[i].c(),a[i].m(n.parentNode,n))}for(;i<a.length;i+=1)a[i].d(1);a.length=l.length}},d(r){r&&(x(t),x(n)),re(o,r),re(a,r)}}}function pe(e){let t,n=e[34].emoji+"",s;return{c(){t=m("div"),s=j(n),p(t,"class","background-emoji svelte-l65gnw"),O(t,"top",e[34].y+"%"),O(t,"left",e[34].x+"%")},m(o,l){L(o,t,l),f(t,s)},p(o,l){l[0]&32&&n!==(n=o[34].emoji+"")&&Y(s,n),l[0]&32&&O(t,"top",o[34].y+"%"),l[0]&32&&O(t,"left",o[34].x+"%")},d(o){o&&x(t)}}}function ge(e){let t,n=e[31].emoji+"",s,o,l,a;function r(){return e[11](e[31])}function c(){return e[12](e[31])}return{c(){t=m("button"),s=j(n),o=B(),p(t,"class","person-emoji svelte-l65gnw"),O(t,"top",e[31].y+"%"),O(t,"left",e[31].x+"%")},m(i,u){L(i,t,u),f(t,s),f(t,o),l||(a=[z(t,"click",r),z(t,"touchstart",$(c))],l=!0)},p(i,u){e=i,u[0]&64&&n!==(n=e[31].emoji+"")&&Y(s,n),u[0]&64&&O(t,"top",e[31].y+"%"),u[0]&64&&O(t,"left",e[31].x+"%")},d(i){i&&x(t),l=!1,X(a)}}}function _e(e){let t,n,s,o,l,a,r,c,i,u,h,S,g,_,b,E,w;return{c(){t=m("div"),n=m("div"),s=m("div"),o=m("h1"),l=m("span"),l.textContent="Congratulations!",a=m("br"),r=j("You found"),c=m("br"),i=m("span"),u=j(e[0]),h=B(),S=j(e[1]),g=j("!"),_=B(),b=m("button"),b.textContent="New Game",p(l,"class","highlight svelte-l65gnw"),p(i,"class","name svelte-l65gnw"),p(o,"class","svelte-l65gnw"),p(s,"class","text-container svelte-l65gnw"),p(b,"class","new-game-btn svelte-l65gnw"),p(n,"class","win-screen svelte-l65gnw"),p(t,"class","container svelte-l65gnw")},m(A,P){L(A,t,P),f(t,n),f(n,s),f(s,o),f(o,l),f(o,a),f(o,r),f(o,c),f(o,i),f(i,u),f(i,h),f(i,S),f(o,g),f(n,_),f(n,b),E||(w=z(b,"click",e[9]),E=!0)},p(A,P){P[0]&1&&Y(u,A[0]),P[0]&2&&Y(S,A[1])},d(A){A&&x(t),E=!1,w()}}}function Ke(e){let t,n,s,o=!e[4]&&de(e),l=e[4]&&!e[2]&&me(e),a=e[2]&&_e(e);return{c(){o&&o.c(),t=B(),l&&l.c(),n=B(),a&&a.c(),s=we()},m(r,c){o&&o.m(r,c),L(r,t,c),l&&l.m(r,c),L(r,n,c),a&&a.m(r,c),L(r,s,c)},p(r,c){r[4]?o&&(o.d(1),o=null):o?o.p(r,c):(o=de(r),o.c(),o.m(t.parentNode,t)),r[4]&&!r[2]?l?l.p(r,c):(l=me(r),l.c(),l.m(n.parentNode,n)):l&&(l.d(1),l=null),r[2]?a?a.p(r,c):(a=_e(r),a.c(),a.m(s.parentNode,s)):a&&(a.d(1),a=null)},i:J,o:J,d(r){r&&(x(t),x(n),x(s)),o&&o.d(r),l&&l.d(r),a&&a.d(r)}}}function Ue(e){const t=e.map(n=>({x:n.x,y:n.y}));return{minX:Math.min(...t.map(n=>n.x)),maxX:Math.max(...t.map(n=>n.x)),minY:Math.min(...t.map(n=>n.y)),maxY:Math.max(...t.map(n=>n.y))}}function Qe(e,t){const n=[...e,...t],s=Ue(n),o=100-(s.maxX-s.minX),l=100-(s.maxY-s.minY),a=o/4,r=l/4;return(o>10||l>10)&&(e.forEach(c=>{c.x=Math.min(Math.max(c.x+a,5),95),c.y=Math.min(Math.max(c.y+r,5),95)}),t.forEach(c=>{c.x=Math.min(Math.max(c.x+a,5),95),c.y=Math.min(Math.max(c.y+r,5),95)})),{backgroundEmojis:e,peopleOnScreen:t}}function Ze(e,t,n=5){const s=Math.abs(e.x-t.x),o=Math.abs(e.y-t.y);return s<n&&o<n}const et=()=>{},tt=()=>{},nt=()=>{};function ot(e,t,n){const s=new Audio(te);s.preload="auto";let o=["Ali","Ashley","Ang","Bradlee","Bobbie","Wei","Yan","Andy","Ying","Jean","Franc","Hong","Rich","Rory","Jo","Sammy","Philly","Mal","Tippy","Sal","Barb","River","Gio","Leith","Leaf","Paris","Axel","Yun","Cameron","Avery","Ainsley","Adrian","Ari","Charlie","Ellis","Dylan","Drew","Jordan","Riley","Morgan","Taylor","Jesse","Robin","Jo","Jules","Terri","Ridley","Sage","Blake","Ira","Basil","Scout","Ollie","Devon","Shannon","Birch","Pat"],l=["Beaverton","Affagato","Consommé","Vendetta","Smiley","Gorgon","Keyboard","Diamanté","Blancmange","Afterdinner","Tobermory","Futon","Banquette","Meringue","Fingertip","President","Hotdog","Cookie","Tennis-Smythe","Badminton","Flounder","Stuffed-Crust","Sandal","Greenhouse","Bassoon","Foothold","Mouthbreath","Rowboat","Childsplay","Flatbread","Legume","Broadbean","Sneaker","Turtle","Bouquet","Salmon","Goldleaf","Croissant","Crossbow","Trolley"],a=["🌳","🌲","🎄","🌴","⛩️","🗿","🗼","🎡","⛲️","🌳","🌲","🌴","🌳","🌲","🌴","🌵","🌵"],r=["🏠","🏡","🏰","🛕","🏩","🕍","🏚️","🏢","🏬","🏛️","🏥","💒","🏦","🏟️","🏫","🏯","🏣","🏪","🏤","🏠","🎪","🛖","🏗️","🏘️","⛪️"],c=["🧍‍♂️","🧍‍♀️","💃","🕺","🧜","🧘‍♀️","🧘‍♂️","🤾‍♀️","🤾‍♂️","👨‍🦼","👩‍🦽‍➡️","👩‍🦯‍➡️","👨‍🦯","⛹️‍♀️","⛹️‍♂️","🧚‍♀️","🧚‍♂️","🤺","🤸‍♀️","🤸‍♂️","🏌️‍♂️","🏌️‍♀️","🪂","🏇","🏋️‍♂️","🏋️‍♀️","🏂","🚴‍♀️","🚴‍♂️"],i={},u="",h="",S=!1,g=!1,_=[],b=[],E,w,A=!1,P={firstName:"",lastName:"",emoji:""},N=!0;const G=()=>window.innerWidth<=768?{size:38}:{size:48,fontSize:"5vw"};function Ae(){return new Promise((d,v)=>{console.log("Loading audio from:",te),s.oncanplaythrough=()=>{console.log("Audio loaded successfully"),d()},s.onerror=y=>{console.error("Audio loading error:",y),console.log("Attempted audio path:",te),v(y)},s.load()})}function le(d=!1){const{size:v}=G(),y=v/2,T=d?v/2:v,F=E-y*2,k=w-(y+T);if(d){const M=v*1,C=Math.floor(F/M),Q=Math.floor(k/M),Ne=Math.floor(Math.random()*C),Ce=Math.floor(Math.random()*Q);return{x:(y+Ne*M)/E*100,y:(y+Ce*M)/w*100}}return{x:(y+Math.random()*F)/E*80,y:(y+Math.random()*(k-y))/w*80}}function V(d,v=!1){let y=0;const T=100;for(;y<T;){const k=le(v);if(k.x<0||k.x>100||k.y<0||k.y>95){y++;continue}if(!d.some(Q=>Ze(k,Q,v?5:10)))return k;y++}const F=le(v);return{x:Math.min(Math.max(F.x,5),95),y:Math.min(Math.max(F.y,5),95)}}function ie(){if(N)n(0,u="Bobbie"),n(1,h="Futon"),n(3,i={emoji:"🧍‍♀️",id:Math.random().toString(36).substr(2,9)}),N=!1;else do{n(0,u=o[Math.floor(Math.random()*o.length)]),n(1,h=l[Math.floor(Math.random()*l.length)]);const d=c[Math.floor(Math.random()*c.length)];if(u!==P.firstName&&h!==P.lastName&&d!==P.emoji){n(3,i={emoji:d,id:Math.random().toString(36).substr(2,9)});break}}while(!0);n(5,_=[]),n(6,b=[])}function Ee(){if(!E||!w){const M=document.querySelector(".game-screen");M&&(E=M.clientWidth,w=M.clientHeight)}const d=[],y=[...c].filter(M=>M!==i.emoji).sort(()=>Math.random()-.5).slice(0,5).map(M=>{const C=V(d,!1);return d.push(C),{emoji:M,id:Math.random().toString(36).substr(2,9),x:C.x,y:C.y}}),T=V(d,!1);n(3,i={...i,x:T.x,y:T.y}),n(6,b=[...y,i]),n(5,_=[...a,...r].map(M=>{const C=V(d,!0);return d.push(C),{emoji:M,x:C.x,y:C.y}}));const{backgroundEmojis:F,peopleOnScreen:k}=Qe(_,b);n(5,_=F),n(6,b=k)}function K(){const d=document.querySelector(".game-screen");d&&(E=d.clientWidth,w=d.clientHeight,S&&!g&&Ee())}Ye(()=>(Ae().then(()=>{ie()}),window.addEventListener("resize",K),()=>{window.removeEventListener("resize",K)}));async function Pe(){n(4,S=!0),n(2,g=!1),await Te(),setTimeout(()=>{K(),n(7,A=!0)},50)}function je(){P={firstName:u,lastName:h,emoji:i.emoji},ie(),n(4,S=!1),n(2,g=!1),n(7,A=!1)}function U(d){d.id===i.id&&(n(2,g=!0),s.currentTime=0,s.play().catch(v=>console.error("Error playing sound:",v)))}const ke=d=>U(d),xe=d=>U(d);return e.$$.update=()=>{e.$$.dirty[0]&7},[u,h,g,i,S,_,b,A,Pe,je,U,ke,xe]}class lt extends $e{constructor(t){super(),He(this,t,ot,Ke,Oe,{},null,[-1,-1])}}new lt({target:document.getElementById("app")});
