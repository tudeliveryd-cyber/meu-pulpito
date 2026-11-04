/* Precio en la moneda local: Paraguay y Brasil usan los precios fijos del panel (₲ y R$);
   en otros países se muestra el valor aproximado, convertido desde el precio en guaraníes
   con la cotización del día (ExchangeRate-API, open.er-api.com), guardada 12 h en el aparato. */
(function(){var M={},fx=null,Z={},T=window.MP_TZCUR||{};
  Object.keys(T).forEach(function(c){T[c].forEach(function(z){Z[z]=c})});
  function tz(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){return''}}
  M.code=function(){var c=Z[tz()];return c||'USD'};
  M.fixed=function(){var c=M.code();return c==='PYG'||c==='BRL'};
  try{var s=JSON.parse(localStorage.getItem('mp.fx')||'null');if(s&&s.r&&Date.now()-s.t<432e5)fx=s.r}catch(e){}
  M.load=function(cb){if(M.fixed()||fx){cb&&cb();return}
    fetch('https://open.er-api.com/v6/latest/USD').then(function(r){return r.json()}).then(function(d){if(d&&d.rates&&d.rates.PYG){fx=d.rates;try{localStorage.setItem('mp.fx',JSON.stringify({t:Date.now(),r:fx}))}catch(e){}}cb&&cb()}).catch(function(){cb&&cb()})};
  function nice(v){if(v<10)return Math.round(v*10)/10;var d=Math.pow(10,Math.max(0,Math.floor(Math.log(v)/Math.LN10)-1));return Math.round(v/d)*d}
  /* valor aproximado en la moneda local a partir de guaraníes; null si no aplica o no hay cotización */
  M.local=function(pyg){var c=M.code();if(M.fixed()||!fx||!fx.PYG||!fx[c])return null;return{v:nice(pyg*fx[c]/fx.PYG),c:c}};
  M.fmt=function(v,c,L){var f=v>0&&v<10?2:0;try{return new Intl.NumberFormat(L==='pt'?'pt-BR':'es',{style:'currency',currency:c,currencyDisplay:'narrowSymbol',maximumFractionDigits:f,minimumFractionDigits:f}).format(v)}catch(e){return c+' '+v}};
  M.name=function(c,L){try{return new Intl.DisplayNames([L==='pt'?'pt-BR':'es'],{type:'currency'}).of(c)}catch(e){return c}};
  window.MP_CUR=M})();
