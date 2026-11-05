// Local Chrome raster export; no dependencies, network assets or package installation.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawn} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const root=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/i,'$1'));
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'astra-preview-'));
const chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--disable-extensions','--no-first-run','--no-default-browser-check','--hide-scrollbars','--force-color-profile=srgb','--remote-debugging-port=19338',`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
let ws,id=0;const pending=new Map();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function cdp(method,params={}){const key=++id;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(key);reject(new Error(`Timeout: ${method}`));},15000);pending.set(key,{resolve:r=>{clearTimeout(timer);resolve(r)},reject:e=>{clearTimeout(timer);reject(e)}});ws.send(JSON.stringify({id:key,method,params}));});}
async function screenshot(url,w,h,out,transparent=false){
 await cdp('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});
 await cdp('Emulation.setDefaultBackgroundColorOverride',{color:transparent?{r:0,g:0,b:0,a:0}:{r:251,g:249,b:248,a:1}});
 await cdp('Page.navigate',{url});
 // Wait for navigation and stylesheet/layout completion, rather than a timed screenshot race.
 for(let tries=0;tries<60;tries++){await sleep(35);const r=await cdp('Runtime.evaluate',{expression:'document.readyState',returnByValue:true});if(r.result?.value==='complete')break;}
 await cdp('Runtime.evaluate',{expression:'document.fonts.ready.then(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))))',awaitPromise:true});
 const shot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(out,Buffer.from(shot.data,'base64'));
}
try{
 let tabs;
 for(let tries=0;tries<100;tries++){try{tabs=(await(await fetch('http://127.0.0.1:19338/json')).json()).filter(t=>t.type==='page');if(tabs.length)break;}catch{}await sleep(100);}
 if(!tabs?.length)throw new Error('Local Chrome did not start');
 ws=new WebSocket(tabs[0].webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
 ws.addEventListener('message',e=>{const r=JSON.parse(e.data);if(r.id&&pending.has(r.id)){const p=pending.get(r.id);pending.delete(r.id);r.error?p.reject(new Error(JSON.stringify(r.error))):p.resolve(r.result);}});
 await cdp('Page.enable');
 const m=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
 function add(name,dir,file,variant,group){m.assets.push({name:`${dir}/${name}`,group,files:{[variant]:`exploration/${dir}/${file}`},label:name.replaceAll('-',' '),keywords:[dir,name],status:'draft',notes:'Local Chrome SVG raster export; Phase 1 proposal only.'});}
 for(const k of ['a','b','c']){
  const dir=`direction-${k}`,base=path.join(root,dir);
  const renderSvg=async(file,size,out)=>{let contents=fs.readFileSync(path.join(base,file),'utf8');contents=contents.replace('<svg ',`<svg width="${size}" height="${size}" `);const html=`<!doctype html><meta charset="utf-8"><body style="margin:0;background:transparent;color:#1F1B1E">${contents}</body>`;await screenshot('data:text/html;charset=utf-8,'+encodeURIComponent(html),size,size,path.join(base,out),!file.includes('app-icon'));};
  for(const dark of [false,true]){
   const suffix=dark?'-dark':'';
   for(const size of [480,720]){const file=`illustrations/empty-bag${suffix}-${size}.png`;await renderSvg(`illustrations/empty-bag${suffix}.svg`,size,file);add('empty-bag',dir,file,`${dark?'dark-':''}png-${size}`,'illustration');}
   for(const size of [400,800,1200]){const file=`illustrations/onboarding-01-welcome${suffix}-${size}.png`;await renderSvg(`illustrations/onboarding-01-welcome${suffix}.svg`,size,file);add('onboarding-01-welcome',dir,file,`${dark?'dark-':''}png-${size}`,'illustration');}
   for(const size of [16,40]){const file=`platform/symbol-mark${suffix}-${size}.png`;await renderSvg(`platform/symbol-mark${suffix}.svg`,size,file);add('symbol-mark',dir,file,`${dark?'dark-':''}png-${size}`,'platform');}
  }
  for(const size of [16,40,1024]){const file=`platform/app-icon-${size}.png`;await renderSvg('platform/app-icon.svg',size,file);add('app-icon',dir,file,`png-${size}`,'platform');}
  const url=pathToFileURL(path.join(base,'preview.html')).href;
  await screenshot(url,1800,1600,path.join(base,'preview-sheet.png'));
  const layout=await cdp('Runtime.evaluate',{expression:'document.documentElement.scrollHeight',returnByValue:true});
  if(layout.result.value>1600)await screenshot(url,1800,layout.result.value,path.join(base,'preview-sheet.png'));
  add('preview-sheet',dir,'preview-sheet.png','png','platform');
  console.log(`Rendered ${dir}; preview height ${layout.result.value}`);
 }
 // Merge variants into one manifest entry per semantic asset.
 const merged=new Map();for(const a of m.assets){if(merged.has(a.name)){Object.assign(merged.get(a.name).files,a.files);}else merged.set(a.name,a);}
 m.assets=[...merged.values()];fs.writeFileSync(path.join(root,'manifest.json'),JSON.stringify(m,null,2)+'\n');
 fs.writeFileSync(path.join(root,'..','manifest.json'),JSON.stringify(m,null,2)+'\n');
 console.log(`Manifest: ${m.assets.length} draft asset entries.`);
}finally{ws?.close();chrome.kill();}
