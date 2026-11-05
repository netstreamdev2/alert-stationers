// Original, deliberately constructed vectors. No icon library or raster tracing.
// Rebuild: node brand/exploration/build-explorations.mjs
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/i,'$1'));
const ink='#1F1B1E', paper='#FBF9F8', pink='#B3125F', magenta='#E812D9';
const configs={a:{title:'Ink & Highlighter',weight:1.75,join:'round',cap:'round',accent:magenta},b:{title:'Paper Cut',weight:2,join:'bevel',cap:'butt',accent:pink},c:{title:'Full Circle',weight:1.75,join:'round',cap:'round',accent:pink}};
const manifest=[];
const write=(dir,name,contents)=>{const f=path.join(root,dir,name);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,contents);return f;};
const p=(d,extra='')=>`<path d="${d}" ${extra}/>`;
const rect=(x,y,w,h,r=0,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ${extra}/>`;
const circle=(x,y,r,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" ${extra}/>`;
const svg=(size,body,attrs='')=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" ${attrs}>${body}</svg>`;
const outline=(size,body,c,w)=>svg(size,body,`fill="none" stroke="currentColor" stroke-width="${w??c.weight}" stroke-linecap="${c.cap}" stroke-linejoin="${c.join}"`);
// Asymmetric crescent arrows: pointed tail, swollen body, blunt oblique head.
const refresh=p('M3.4 9.6C5.5 2.4 14.2 1.4 18.5 6.9L20.2 5.6L21 12.3L14.6 9.7L16.6 8.6C13.1 4.6 7.1 4.7 3.4 9.6Z','fill="currentColor" stroke="none"')+p('M20.5 14.2C18.7 21.5 10 23 5.4 17.5L3.6 18.9L2.9 12.1L9.3 14.8L7.3 15.9C11 19.8 17 19.3 20.5 14.2Z','fill="currentColor" stroke="none"');
function shapes(k){
 const b=k==='b',c=k==='c';
 const bag=b?'M4 8H20V19L18 21H6L4 19Z':c?'M5 8Q12 6.8 19 8L20 19Q20 21 18 21H6Q4 21 4 19Z':'M5 8H19L20 19Q20 21 18 21H6Q4 21 4 19Z';
 const home=b?'M3 11L12 3L21 11V21H15V15H9V21H3Z':c?'M3 11L12 3L21 11M5 9.3V19Q5 21 7 21H9V15H15V21H17Q19 21 19 19V9.3':'M3 11L12 3L21 11M5 9.3V21H9V15H15V21H19V9.3';
 const heart=b?'M12 21L3.8 12.6Q1.5 10 3 6.5Q5 2.5 9 4L12 6.5L15 4Q19 2.5 21 6.5Q22.5 10 20.2 12.6Z':'M12 21C10 18.9 3 14.5 3 8.8C3 3.2 9.1 2.3 12 6.6C14.9 2.3 21 3.2 21 8.8C21 14.5 14 18.9 12 21Z';
 const handles=p('M8 9V6C8 2 16 2 16 6V9');
 const person=c?p('M8 6.8C8 1.7 16 1.7 16 6.8C16 11.8 8 11.8 8 6.8ZM3.5 21C3.5 12 20.5 12 20.5 21Z'):circle(12,6.5,3.5)+p(b?'M4 21V17L7 14H17L20 17V21Z':'M4 21V19C4 12 20 12 20 19V21Z');
 return {
 home:p(home),search:circle(c?10.5:10,c?10.5:10,6.5)+p(c?'M15.5 15.5L21 21':'M15 15L21 21'),bag:p(bag)+handles,
 'bag-pencil':p(bag)+handles+p('M15 7L17.7 2.9L19.9 4.4L17.6 8M17 4L19.2 5.5'),heart:p(heart),user:person,
 'school-list':p(b?'M8 5H4V21H20V5H16':'M8 5H6Q4 5 4 7V21H20V7Q20 5 18 5H16')+rect(8,2.8,8,4,1)+p('M7 11L8.5 12.5L11 10M14 11H17M7 17L8.5 18.5L11 16M14 17H17'),
 truck:p(b?'M3 5H14V17H3ZM14 9H18L21 13V17H14':'M3 5H14V17H3ZM14 9H17Q18 9 19 11L21 14V17H14')+p('M15.5 10V13H20')+circle(7,18,2)+circle(18,18,2),
 edit:p('M4 15L15.8 3.2L20.8 8.2L9 20L3 21ZM4 15L9 20M6.5 17.5L18.2 5.8M14 5L19 10M3 21L4.5 17.8'),
 'tag-sale':p(b?'M3 3H12L21 12L12 21L3 12Z':'M5 3H11Q12 3 13 4L21 12L12 21L4 13Q3 12 3 11V5Q3 3 5 3Z')+circle(7,7,.8)+p('M10 15L15 10')+circle(10,10,.6)+circle(15,15,.6),
 'check-circle':circle(12,12,9)+p(c?'M7 12L10.5 15.5Q14 11 17 8.5':'M7 12L10.5 15.5L17 8.5'),
 package:p('M3 7L12 3L21 7V17L12 21L3 17ZM3 7L12 11L21 7M12 11V21M7.5 5L16.5 9V13'),
 bell:p(c?'M4 18Q7 16 7 10C7 3 17 3 17 10Q17 16 20 18ZM9 20Q12 22 15 20M12 3V2.9':'M4 18L6 15V10C6 3 18 3 18 10V15L20 18ZM9 21H15M12 3V2.9'),
 refresh,
 filled:{home:p(b?'M3 11L12 3L21 11V21H15V15H9V21H3Z':c?'M3 11L12 3L21 11H19V19Q19 21 17 21H15V15H9V21H7Q5 21 5 19V11Z':'M3 11L12 3L21 11H19V21H15V15H9V21H5V11Z'),bag:p(bag)+p('M8 9V6C8 2 16 2 16 6V9','fill="none"'),heart:p(heart),user:person}
 };
}
const accents=(body,color)=>`<g id="accent" fill="${color}" stroke="none">${body}</g>`;
function spot(k,name,cfg){
 let bg='';
 if(k==='a')bg=p('M5 18L41 11L44 29L8 36Z'); // 10° rise, deliberately broad decorative swipe.
 if(k==='b')bg=p('M8 7H35L42 14V37L36 42H7V14Z');
 if(k==='c')bg=p('M24 3A21 21 0 1 1 23.9 3ZM24 9A15 15 0 1 0 24.1 9Z','fill-rule="evenodd"');
 let body='';
 if(name==='cat-notebooks')body=p('M13 9H34V39H13ZM17 9V39M21 15H29M21 20H27M10 14H15M10 22H15M10 30H15');
 if(name==='cat-pencils')body=p('M12 32L30 8L37 13L19 37L10 40ZM12 32L19 37M15.5 34.5L33.5 10.5M27 12L34 17M10 40L12 35');
 if(name==='spot-free-delivery')body=p('M8 17H28V33H8ZM28 22H34L39 28V33H28M30 23V28H38M9 12H22')+circle(16,34,3)+circle(33,34,3);
 if(name==='spot-school-lists')body=p('M18 11H12V39H36V11H30')+rect(18,7,12,7,1)+p('M17 22L20 25L25 19M28 22H31M17 32L20 35L25 29M28 32H31');
 // Paper Cut reverses the mass: an ink card object with pink geometric inset accents.
 if(k==='b'){
  const masses={
   'cat-notebooks':p('M12 9H34V39H12ZM18 13V35H30V13Z','fill-rule="evenodd"'),
   'cat-pencils':p('M12 32L30 8L37 13L19 37L10 40ZM17 30L29 14L32 16L20 32Z','fill-rule="evenodd"'),
   'spot-free-delivery':p('M8 17H28V22H34L39 28V33H8ZM13 21V28H24V21ZM30 25V28H35Z','fill-rule="evenodd"')+circle(16,34,3)+circle(33,34,3),
   'spot-school-lists':p('M12 11H36V39H12ZM17 18V23H22V18ZM17 28V33H22V28Z','fill-rule="evenodd"')
  };
  return svg(48,accents(bg,cfg.accent)+`<g fill="currentColor">${masses[name]}</g>`);
 }
 return outline(48,accents(bg,cfg.accent)+body,cfg,2.5);
}
function empty(k,dark){
 const fg=dark?'#F4EFF2':ink, action=dark?'#F2559A':pink, tint=dark?'#3A1528':'#FCE9F2',surface=dark?'#1E1A1D':'#FFFFFF';
 let bg=k==='a'?p('M24 89L199 58L216 150L41 181Z',`fill="${tint}"`):k==='b'?p('M32 45H179L212 78V194H32Z',`fill="${tint}"`):circle(120,122,94,`fill="${tint}"`);
 let bag=k==='b'?'M60 84H178V180L165 197H73L60 184Z':'M64 86Q120 72 176 86L187 178Q188 196 169 198H72Q54 197 56 179Z';
 let body=`<g id="bg">${bg}</g><g id="main" stroke="${fg}" stroke-width="4" stroke-linejoin="${k==='b'?'bevel':'round'}" fill="${surface}">${p(bag)}${p('M64 86Q120 140 176 86Q120 55 64 86Z',`fill="${action}"`)}${p('M87 100V69C87 27 153 27 153 69V100','fill="none"')}${p('M109 96L123 85Q129 81 133 86Q137 90 132 95L117 107Q110 112 105 107Q101 103 105 99L121 86','fill="none" stroke-width="2.5"')}</g>`;
 // A single clip is visible through the open bag; no unrelated decorative objects.
 if(k==='a')body+=`<g id="anim-swipe">${p('M71 207L174 189L177 205L74 223Z',`fill="${magenta}"`)}</g>`;
 if(k==='b')body+=`<g id="anim-paper-edge">${p('M60 180L73 197H165L178 180L169 198H72Z',`fill="${action}"`)}</g>`;
 if(k==='c')body+=`<g id="anim-arc">${p('M41 152C25 102 54 47 95 35L84 30L110 26L100 49L98 39C58 54 35 100 41 152Z',`fill="${action}"`)}</g>`;
 return svg(240,body);
}
// Coordinates are baked numerically; no transform attributes enter delivered SVGs.
function mapBody(body,scale,ox,oy){
 // These primitives originate in small coordinate grids; map each numeric attribute/path coordinate.
 return body.replace(/d="([^"]+)"/g,(_,d)=>{let index=0,cmd='';const tokens=d.match(/[A-Za-z]|-?\d*\.?\d+/g);const out=[];for(let i=0;i<tokens.length;i++){let t=tokens[i];if(/[A-Za-z]/.test(t)){cmd=t;index=0;out.push(t);continue;}let n=+t;let v;if(cmd==='H')v=n*scale+ox;else if(cmd==='V')v=n*scale+oy;else if(cmd==='A'){let j=index%7;v=j<2?n*scale:j===5?n*scale+ox:j===6?n*scale+oy:n;}else v=n*scale+(index%2?oy:ox);out.push(Math.round(v*100)/100);index++;}return `d="${out.join(' ')}"`;}).replace(/\b(x|y|x1|x2|y1|y2|cx|cy|r|rx|width|height|stroke-width)="([\d.]+)"/g,(_,a,v)=>`${a}="${Math.round((+v*scale+(['x','x1','x2','cx'].includes(a)?ox:['y','y1','y2','cy'].includes(a)?oy:0))*100)/100}"`);
}
function mark(k,dark=false){
 const fg=dark?'#F4EFF2':ink,ac=k==='a'?magenta:dark?'#F2559A':pink;
 // Separate, non-identical upper and lower arrows; no wordmark/shadow. Ring kept broad enough at 16px.
 return svg(96,circle(48,48,43,`fill="none" stroke="${fg}" stroke-width="5"`)+p('M20 42C25 18 54 14 68 31L73 26L77 49L55 40L62 36C51 24 32 27 20 42Z',`fill="${fg}"`)+p('M77 54C72 80 43 84 27 66L22 71L18 48L40 57L33 61C45 74 65 70 77 54Z',`fill="${ac}"`));
}
function onboarding(k,dark){
 const fg=dark?'#F4EFF2':ink,ac=dark?'#F2559A':pink, tint=dark?'#3A1528':'#FCE9F2',surf=dark?'#1E1A1D':'#FFFFFF';
 const bg=k==='a'?p('M135 338L982 189L1066 766L219 915Z',`fill="${tint}"`):k==='b'?p('M144 144H900L1056 300V1020H144Z',`fill="${tint}"`):circle(600,600,470,`fill="${tint}"`);
 // Stationery around an intentionally open central mark: school, office and creativity.
 const notebook=p('M190 230H420V500H190Z',`fill="${surf}" stroke="${fg}" stroke-width="10"`)+p('M235 230V500M275 294H365M275 330H348M174 280H205M174 360H205M174 440H205',`fill="none" stroke="${fg}" stroke-width="10" stroke-linecap="round"`);
 const pencil=p('M770 280L917 133L967 183L820 330L752 348Z',`fill="${k==='a'?magenta:ac}" stroke="${fg}" stroke-width="10" stroke-linejoin="round"`)+p('M770 280L820 330M794 304L942 158M752 348L770 303',`fill="none" stroke="${fg}" stroke-width="8"`);
 const notes=p('M160 720H386V946H160Z',`fill="${ac}"`)+p('M160 720L386 680V720Z',`fill="${fg}"`)+p('M329 946V890H386Z',`fill="${surf}"`);
 const ruler=p('M766 833L988 794L1008 907L786 946Z',`fill="${surf}" stroke="${fg}" stroke-width="9"`)+p('M802 832L807 861M842 825L845 844M882 818L887 847M922 811L925 830M962 804L967 833',`fill="none" stroke="${fg}" stroke-width="7"`);
 const clip=p('M888 506L951 569C978 596 940 634 915 609L850 544C811 505 869 450 907 487L978 558',`fill="none" stroke="${fg}" stroke-width="14" stroke-linecap="round"`);
 const center=mapBody(mark(k,dark).replace(/^<svg[^>]*>|<\/svg>$/g,''),2.65,473,473);
 let accent=k==='a'?p('M420 387L694 339L703 389L429 437Z',`fill="${magenta}"`):k==='b'?p('M421 376H666L704 414H421Z',`fill="${ac}"`):p('M339 615C331 441 469 334 617 345L595 322L661 345L608 384L620 358C470 350 350 457 339 615Z',`fill="${ac}"`);
 return svg(1200,`<g id="bg">${bg}</g><g id="layer-back">${notebook}${ruler}</g><g id="layer-mid">${notes}${clip}</g><g id="layer-front">${pencil}${center}</g><g id="accents">${accent}</g>`);
}
function register(dir,file,group,name,variant){manifest.push({name:`${dir}/${name}`,group,files:{[variant]:`exploration/${dir}/${file}`},label:name.replaceAll('-',' '),keywords:[dir,name],status:'draft',notes:'Phase 1 only; provisional colours; client direction and master SVG pending.'});}
function add(dir,file,contents,group,name,variant){write(dir,file,contents);register(dir,file,group,name,variant);}
const rationale={
 a:'Even ink strokes keep the UI clear, while 10° magenta swipes translate the digital logo’s energy into stationery marks. The tapered refresh and two-arrow symbol retain the strongest family cue. This is strongest in dense shop and admin interfaces. Its risk is that the swipes can feel generic unless their angle and placement stay disciplined.',
 b:'Bevelled UI joins and layered, cut-out spot silhouettes echo the logo’s blunt arrowheads and solid mass. Raspberry dominates the larger paper forms, connecting the exploration to the store sign. This is strongest in category browsing and welcoming illustrations. Its risk is heavier small-size silhouettes, especially at 16px.',
 c:'Swept curves and circular spot frames draw directly from the chasing-arrow badge. Standard UI icons stay unframed; movement appears only where it supports the metaphor. This is strongest for refresh, repeat purchase and brand recognition. Its risk is too many competing circles, so onboarding uses one focal ring and only one directional accent.'
};
for(const [k,cfg]of Object.entries(configs)){
 const dir=`direction-${k}`,s=shapes(k);
 for(const [name,body]of Object.entries(s)){if(name==='filled')continue;add(dir,`icons/ui/outline/${name}.svg`,outline(24,body,cfg),'ui',name,'outline');}
 for(const [name,body]of Object.entries(s.filled))add(dir,`icons/ui/filled/${name}.svg`,svg(24,body,`fill="currentColor" stroke="currentColor" stroke-width="${cfg.weight}" stroke-linejoin="${cfg.join}" stroke-linecap="${cfg.cap}"`),'ui',name,'filled');
 for(const name of ['cat-notebooks','cat-pencils','spot-free-delivery','spot-school-lists'])add(dir,`icons/spot/${name}.svg`,spot(k,name,cfg),'spot',name,'svg');
 for(const dark of [false,true]){
  const suffix=dark?'-dark':'';
  add(dir,`illustrations/empty-bag${suffix}.svg`,empty(k,dark),'illustration','empty-bag',dark?'dark':'svg');
  add(dir,`illustrations/onboarding-01-welcome${suffix}.svg`,onboarding(k,dark),'illustration','onboarding-01-welcome',dark?'dark':'svg');
  add(dir,`platform/symbol-mark${suffix}.svg`,mark(k,dark),'platform','symbol-mark',dark?'dark':'svg');
 }
 const app=svg(1024,`<g id="bg">${rect(0,0,1024,1024,0,`fill="${k==='b'?pink:paper}"`)}</g><g id="layer-front">${mapBody(mark(k,k==='b').replace(/^<svg[^>]*>|<\/svg>$/g,''),7.5,152,152)}</g>`);
 add(dir,'platform/app-icon.svg',app,'platform','app-icon','svg');
 write(dir,'rationale.md',`# ${cfg.title}\n\n${rationale[k]}\n\nDraft exploration. Palette and arrow geometry require the master SVG. All UI is upright; ${cfg.weight}px strokes with ${cfg.join} joins. Refresh uses filled tapered crescents as a deliberate logo-motif exception within the outline set.\n`);
}
fs.writeFileSync(path.join(root,'manifest.json'),JSON.stringify({phase:'0–1',status:'draft',source:'Deliberately constructed SVG; no external assets or icon libraries.',assets:manifest},null,2)+'\n');
// Review-only HTML: filenames and copy live outside artwork. Both themes include all assets.
const load=(dir,f)=>fs.readFileSync(path.join(root,dir,f),'utf8');
const embed=(dir,f,size)=>load(dir,f).replace('<svg ',`<svg width="${size}" height="${size}" `);
for(const [k,cfg]of Object.entries(configs)){
 const dir=`direction-${k}`;
 let panels='';
 for(const dark of [false,true]){
  const suffix=dark?'-dark':'', names=Object.keys(shapes(k)).filter(x=>x!=='filled');
  const icons=names.map(n=>`<div class="icon"><div class="sizes">${[16,20,24,32].map(z=>embed(dir,`icons/ui/outline/${n}.svg`,z)).join('')}</div><label>${n}</label></div>`).join('');
  const filled=['home','bag','heart','user'].map(n=>`<div class="icon"><div class="sizes">${[16,20,24,32].map(z=>embed(dir,`icons/ui/filled/${n}.svg`,z)).join('')}</div><label>${n} · filled</label></div>`).join('');
  const spots=['cat-notebooks','cat-pencils','spot-free-delivery','spot-school-lists'].map(n=>`<div class="spot"><div>${embed(dir,`icons/spot/${n}.svg`,40).replace(cfg.accent,dark&&k!=='a'?'#F2559A':cfg.accent)}${embed(dir,`icons/spot/${n}.svg`,64).replace(cfg.accent,dark&&k!=='a'?'#F2559A':cfg.accent)}</div><label>${n}</label></div>`).join('');
  panels+=`<section class="theme ${dark?'dark':'light'}"><h2>${dark?'INK / DARK':'PAPER / LIGHT'}</h2><h3>01 / UI outlines <small>16 · 20 · 24 · 32 px</small></h3><div class="icons">${icons}</div><h3>02 / Selected states <small>16 · 20 · 24 · 32 px</small></h3><div class="filled">${filled}</div><h3>03 / Two-colour spots <small>40 · 64 px</small></h3><div class="spots">${spots}</div><h3>04 / Stationery stories</h3><div class="stories"><div>${embed(dir,`illustrations/empty-bag${suffix}.svg`,235)}<label>empty-bag</label></div><div>${embed(dir,`illustrations/onboarding-01-welcome${suffix}.svg`,350)}<label>onboarding-01-welcome</label></div></div><h3>05 / Proposed identity <small>Not approved for use</small></h3><div class="identity"><div>${embed(dir,`platform/symbol-mark${suffix}.svg`,112)}<label>symbol-mark</label></div><div class="micro">${embed(dir,`platform/symbol-mark${suffix}.svg`,40)}${embed(dir,`platform/symbol-mark${suffix}.svg`,16)}<label>mark · 40 / 16 px</label></div><div class="app">${embed(dir,'platform/app-icon.svg',112)}<label>app-icon · 1024 master</label></div><div class="micro">${embed(dir,'platform/app-icon.svg',40)}${embed(dir,'platform/app-icon.svg',16)}<label>app · 40 / 16 px</label></div></div></section>`;
 }
 const html=`<!doctype html><html><head><meta charset="utf-8"><title>Direction ${k.toUpperCase()} — ${cfg.title}</title><style>*{box-sizing:border-box}body{margin:0;width:1800px;background:#eee9e6;color:${ink};font-family:Arial,sans-serif}header{height:195px;padding:37px 44px 24px}header .eyebrow{font-size:13px;letter-spacing:3px;color:${pink}}h1{font-size:43px;letter-spacing:-1.3px;margin:12px 0 8px}header p{font-size:16px;margin:0;max-width:1500px;line-height:1.5}.panels{display:grid;grid-template-columns:1fr 1fr;gap:18px;padding:0 26px 26px}.theme{padding:28px 24px 30px}.light{background:${paper};color:${ink}}.dark{background:#151214;color:#F4EFF2}h2{font-size:12px;letter-spacing:3px;margin:0 0 26px;opacity:.65}h3{font-size:14px;font-weight:600;margin:24px 0 18px}small{font-weight:normal;opacity:.55;margin-left:12px;font-size:11px}.icons{display:grid;grid-template-columns:repeat(7,1fr);gap:25px 7px}.sizes{height:40px;display:flex;align-items:center;justify-content:center;gap:5px}.icon{text-align:center;min-width:0}label{display:block;font-size:10px;margin-top:11px;opacity:.7;white-space:nowrap}.filled{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}.spots{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;text-align:center}.spot>div{display:flex;align-items:center;justify-content:center;gap:14px}.stories{display:grid;grid-template-columns:1fr 1.4fr;align-items:center;justify-items:center;text-align:center;height:385px}.identity{display:flex;align-items:center;justify-content:space-around;gap:12px;text-align:center}.micro svg{vertical-align:middle;margin:0 5px}.app>svg{border-radius:24px}.foot{padding:0 44px 25px;font-size:12px;color:#6e6169;line-height:1.6}svg{flex-shrink:0}</style></head><body><header><div class="eyebrow">ALERT STATIONERS / ASTRA / PHASE 01 / DRAFT</div><h1>${k.toUpperCase()} — ${cfg.title}</h1><p>${rationale[k]}</p></header><main class="panels">${panels}</main><div class="foot">All artwork is original SVG. No lettering inside assets. Colours provisional; master logo SVG and client approval outstanding. UI ${cfg.weight}px / ${cfg.join} joins. App tiles shown with an OS-style rounded preview only; exported PNGs are square and opaque.</div></body></html>`;
 write(dir,'preview.html',html);
}
console.log(`Wrote ${manifest.length} draft SVG assets across three directions.`);
