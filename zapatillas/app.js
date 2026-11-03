const COLORS={Cobalto:'#2B3CFF',Coral:'#FF6B5B',Menta:'#2FBF9B',Negro:'#1b1f2a',Arena:'#D9C7A3'};
const BRANDS=['Vento','Kora','Atlas','Nimbo'];
const SIZES=[38,39,40,41,42,43,44,45];
const P=[
 {id:1,b:'Vento',n:'Aero Run',p:89,c:['Cobalto','Coral','Negro'],d:'Running ligera con amortiguación suave.'},
 {id:2,b:'Vento',n:'Street 90',p:74,c:['Arena','Negro'],d:'Estilo retro para el día a día.'},
 {id:3,b:'Kora',n:'Trail X',p:119,c:['Menta','Negro','Coral'],d:'Suela de tacos para montaña y tierra.'},
 {id:4,b:'Kora',n:'Court Pro',p:99,c:['Arena','Cobalto'],d:'Agarre y estabilidad en pista.'},
 {id:5,b:'Atlas',n:'Walk Flex',p:65,c:['Negro','Arena','Menta'],d:'Comodidad para caminar todo el día.'},
 {id:6,b:'Atlas',n:'High One',p:109,c:['Coral','Negro'],d:'Caña alta de piel sintética.'},
 {id:7,b:'Nimbo',n:'Cloud 2',p:129,c:['Cobalto','Menta','Arena'],d:'Máxima amortiguación en cada paso.'},
 {id:8,b:'Nimbo',n:'Slip Easy',p:55,c:['Negro','Coral'],d:'Sin cordones, fáciles de poner.'}
];
const $=s=>document.querySelector(s);
const eur=n=>n.toFixed(2).replace('.',',')+' €';
function shoe(col){return `<svg viewBox="0 0 300 150" role="img" aria-label="Zapatilla"><path d="M18 112Q18 130 40 130H262Q286 130 286 108V98H18Z" fill="#fff" stroke="#101828" stroke-width="3"/><path class="up" d="M24 98V70Q24 56 40 52L80 46Q96 44 106 30L122 18Q134 12 142 24L150 40Q160 52 180 58L246 72Q282 80 286 98Z" fill="${col}" stroke="#101828" stroke-width="3"/><path d="M60 96Q120 66 206 90" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M122 30l16 10M132 22l16 12M142 40l16 8" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>`}
// estado
let user=null,cart=[],brand='Todas',sort='n',heroCol='Cobalto';
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let users=store.get('pf_users',{}),session=store.get('pf_session',null);
if(session&&users[session])user=users[session];
cart=store.get('pf_cart',[]);
const saveUsers=()=>store.set('pf_users',users);
const saveCart=()=>store.set('pf_cart',cart);

function renderHero(){
 $('#stage').innerHTML=shoe(COLORS[heroCol]);
 $('#heroSw').innerHTML=Object.keys(COLORS).map(c=>`<button style="background:${COLORS[c]}" aria-label="${c}" aria-pressed="${c===heroCol}" data-c="${c}"></button>`).join('');
}
$('#heroSw').onclick=e=>{const c=e.target.dataset.c;if(c){heroCol=c;renderHero()}};

function renderBrands(){
 $('#brands').innerHTML=['Todas',...BRANDS].map(b=>`<button class="chip" aria-pressed="${b===brand}" data-b="${b}">${b}</button>`).join('')+
 `<select id="sort" aria-label="Ordenar"><option value="n">Ordenar: nombre</option><option value="a">Precio: menor a mayor</option><option value="d">Precio: mayor a menor</option></select>`;
 $('#sort').value=sort;
}
$('#brands').onclick=e=>{if(e.target.dataset.b){brand=e.target.dataset.b;renderBrands();renderGrid()}};
$('#brands').onchange=e=>{if(e.target.id==='sort'){sort=e.target.value;renderGrid()}};
function renderGrid(){
 let l=P.filter(x=>brand==='Todas'||x.b===brand);
 l.sort((a,b)=>sort==='a'?a.p-b.p:sort==='d'?b.p-a.p:a.n.localeCompare(b.n));
 $('#grid').innerHTML=l.map(x=>`<button class="card" data-id="${x.id}">${shoe(COLORS[x.c[0]])}<small>${x.b}</small><div class="row"><b>${x.n}</b><span>${eur(x.p)}</span></div><small>${x.c.length} colores</small></button>`).join('');
}
$('#grid').onclick=e=>{const c=e.target.closest('.card');if(c)openProd(+c.dataset.id)};

let sel={};
function openProd(id){
 const x=P.find(p=>p.id===id);sel={id,c:x.c[0],s:null};drawProd();$('#dProd').showModal();
}
function drawProd(){
 const x=P.find(p=>p.id===sel.id);
 $('#dProd').innerHTML=`<div class="row"><b>${x.b}</b><button class="btn" data-close>Cerrar</button></div>
 <h2 style="margin:8px 0">${x.n}</h2>${shoe(COLORS[sel.c])}
 <p>${x.d}</p><b>Color: ${sel.c}</b>
 <div class="sw">${x.c.map(c=>`<button data-pc="${c}" style="background:${COLORS[c]}" aria-label="${c}" aria-pressed="${c===sel.c}"></button>`).join('')}</div>
 <b>Talla (EU)</b><div class="sizes">${SIZES.map(s=>`<button class="chip" data-s="${s}" aria-pressed="${s===sel.s}">${s}</button>`).join('')}</div>
 <div class="row"><b style="font-size:24px">${eur(x.p)}</b><button class="btn p" id="addBtn">Añadir al carrito</button></div><div class="msg" id="pm"></div>`;
}
$('#dProd').onclick=e=>{
 const t=e.target;
 if(t.dataset.close!==undefined)$('#dProd').close();
 if(t.dataset.pc){sel.c=t.dataset.pc;drawProd()}
 if(t.dataset.s){sel.s=+t.dataset.s;drawProd()}
 if(t.id==='addBtn'){
  if(!sel.s){$('#pm').textContent='Elige una talla para continuar.';return}
  const f=cart.find(i=>i.id===sel.id&&i.c===sel.c&&i.s===sel.s);
  f?f.q++:cart.push({id:sel.id,c:sel.c,s:sel.s,q:1});
  saveCart();updateTop();$('#dProd').close();openCart();
 }
};

let useP=false;
const total=()=>cart.reduce((a,i)=>a+P.find(p=>p.id===i.id).p*i.q,0);
function discount(){return user&&useP?Math.min(Math.floor(user.points/100)*5,Math.floor(total())):0}
function openCart(){drawCart();$('#dCart').showModal()}
function drawCart(msg=''){
 const t=total(),d=discount();
 const items=cart.length?cart.map((i,k)=>{const x=P.find(p=>p.id===i.id);return `<div class="item">${shoe(COLORS[i.c])}<div><b>${x.b} ${x.n}</b><br><small>${i.c} · talla ${i.s} · ${eur(x.p)}</small></div><button class="chip" data-m="${k}" aria-label="Quitar uno">−</button><b>${i.q}</b><button class="chip" data-a="${k}" aria-label="Añadir uno">+</button></div>`}).join(''):'<p>Tu carrito está vacío. Elige unas zapatillas para empezar.</p>';
 const canP=user&&user.points>=100;
 $('#dCart').innerHTML=`<div class="row"><h2 style="margin:0">Tu carrito</h2><button class="btn" data-close>Cerrar</button></div>${items}
 ${cart.length?`<p>${user?(canP?`<label style="font-weight:400"><input type="checkbox" id="usePts" ${useP?'checked':''} style="width:auto"> Usar mis puntos (${user.points} disponibles, −${Math.floor(user.points/100)*5} €)</label>`:`Tienes ${user.points} puntos. Con 100 puedes canjear 5 €.`):'Con una cuenta ganarías '+Math.floor(t)+' puntos con esta compra.'}</p>
 <div class="row"><b style="font-size:24px">Total ${eur(t-d)}</b><button class="btn p" id="pay">Pagar ahora</button></div>`:''}
 <div class="msg">${msg}</div>`;
}
$('#dCart').onclick=e=>{
 const t=e.target;
 if(t.dataset.close!==undefined)$('#dCart').close();
 if(t.dataset.a){cart[+t.dataset.a].q++;saveCart();updateTop();drawCart()}
 if(t.dataset.m){const i=cart[+t.dataset.m];if(--i.q<=0)cart.splice(+t.dataset.m,1);saveCart();updateTop();drawCart()}
 if(t.id==='usePts'){useP=t.checked;drawCart()}
 if(t.id==='pay'){
  const paid=total()-discount();let m='¡Pedido confirmado! Recibirás un correo con el seguimiento.';
  if(user){const used=useP?Math.floor(discount()/5)*100:0;user.points=user.points-used+Math.floor(paid);users[user.email]=user;saveUsers();m+=` Ganaste ${Math.floor(paid)} puntos. Saldo: ${user.points}.`}
  cart=[];useP=false;saveCart();updateTop();drawCart(m);
 }
};

function updateTop(){
 $('#btnCart').textContent=`Carrito (${cart.reduce((a,i)=>a+i.q,0)})`;
 $('#btnAcc').textContent=user?`${user.points} puntos · ${user.name.split(' ')[0]}`:'Crear cuenta';
}
$('#btnCart').onclick=openCart;
let mode='reg';
function drawAcc(msg=''){
 if(user){$('#dAcc').innerHTML=`<div class="row"><h2 style="margin:0">Mi cuenta</h2><button class="btn" data-close>Cerrar</button></div><p id="nm"></p><p><b style="font-size:32px">${user.points}</b> puntos<br><small>Equivalen a ${Math.floor(user.points/100)*5} € de descuento.</small></p><button class="btn" id="out">Cerrar sesión</button>`;$('#nm').textContent=`${user.name} · ${user.email}`;return}
 $('#dAcc').innerHTML=`<div class="row"><h2 style="margin:0">${mode==='reg'?'Crear cuenta':'Iniciar sesión'}</h2><button class="btn" data-close>Cerrar</button></div>
 ${mode==='reg'?'<label for="fn">Nombre</label><input id="fn" autocomplete="name">':''}
 <label for="fe">Correo</label><input id="fe" type="email" autocomplete="email">
 <label for="fp">Contraseña (mínimo 6 caracteres)</label><input id="fp" type="password" autocomplete="${mode==='reg'?'new-password':'current-password'}">
 <p class="msg">${msg}</p><div class="row"><button class="btn" id="sw">${mode==='reg'?'Ya tengo cuenta':'Quiero registrarme'}</button><button class="btn p" id="go">${mode==='reg'?'Crear cuenta':'Entrar'}</button></div>`;
}
$('#btnAcc').onclick=()=>{drawAcc();$('#dAcc').showModal()};
$('#dAcc').onclick=e=>{
 const t=e.target;
 if(t.dataset.close!==undefined)$('#dAcc').close();
 if(t.id==='sw'){mode=mode==='reg'?'login':'reg';drawAcc()}
 if(t.id==='out'){user=null;store.set('pf_session',null);useP=false;updateTop();drawAcc()}
 if(t.id==='go'){
  const em=$('#fe').value.trim().toLowerCase(),pw=$('#fp').value,nm=mode==='reg'?$('#fn').value.trim():'';
  if(!/^\S+@\S+\.\S+$/.test(em))return drawAcc('Escribe un correo válido.');
  if(pw.length<6)return drawAcc('La contraseña necesita al menos 6 caracteres.');
  if(mode==='reg'){
   if(!nm)return drawAcc('Escribe tu nombre.');
   if(users[em])return drawAcc('Ese correo ya tiene cuenta. Inicia sesión.');
   users[em]={name:nm,email:em,pw:btoa(pw),points:50};saveUsers();user=users[em];
  }else{
   if(!users[em]||users[em].pw!==btoa(pw))return drawAcc('Correo o contraseña incorrectos.');
   user=users[em];
  }
  store.set('pf_session',em);updateTop();drawAcc();
 }
};
renderHero();renderBrands();renderGrid();updateTop();
