(() => {
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)"),body=document.body,motionToggle=$("#motion-toggle"),motionLabel=$("#motion-label"),menuToggle=$("#menu-toggle"),nav=$("#primary-nav"),toast=$("#toast");
let toastTimer=0;
function showToast(message){if(!toast)return;toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2400)}
let motionEnabled=!reducedMotion.matches,particleFrame=0,particleCtx=null,particles=[];
const canvas=$("#particle-canvas");
function resizeCanvas(){if(!canvas)return;const ratio=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.floor(innerWidth*ratio);canvas.height=Math.floor(innerHeight*ratio);canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";particleCtx=canvas.getContext("2d");if(particleCtx)particleCtx.setTransform(ratio,0,0,ratio,0,0);particles=Array.from({length:Math.min(38,Math.floor(innerWidth/32))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.7+.4,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22}))}
function drawParticles(){if(!particleCtx||!motionEnabled||document.hidden){particleFrame=0;return}particleCtx.clearRect(0,0,innerWidth,innerHeight);for(let i=0;i<particles.length;i++){const p=particles[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>innerWidth)p.vx*=-1;if(p.y<0||p.y>innerHeight)p.vy*=-1;particleCtx.beginPath();particleCtx.arc(p.x,p.y,p.r,0,Math.PI*2);particleCtx.fillStyle="rgba(77,245,232,.62)";particleCtx.fill();for(let j=i+1;j<particles.length;j++){const q=particles[j],dx=p.x-q.x,dy=p.y-q.y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<105){particleCtx.beginPath();particleCtx.moveTo(p.x,p.y);particleCtx.lineTo(q.x,q.y);particleCtx.strokeStyle="rgba(77,245,232,"+((1-dist/105)*.13)+")";particleCtx.lineWidth=.6;particleCtx.stroke()}}}particleFrame=requestAnimationFrame(drawParticles)}
function startParticles(){if(!canvas||!motionEnabled||reducedMotion.matches||particleFrame)return;if(!particleCtx)resizeCanvas();particleFrame=requestAnimationFrame(drawParticles)}
function stopParticles(){if(particleFrame)cancelAnimationFrame(particleFrame);particleFrame=0;if(particleCtx&&canvas)particleCtx.clearRect(0,0,innerWidth,innerHeight)}
function setMotion(enabled){body.classList.toggle("motion-off",!enabled);if(motionToggle)motionToggle.setAttribute("aria-pressed",String(enabled));if(motionLabel)motionLabel.textContent=enabled?"ЭФФЕКТЫ: ON":"ЭФФЕКТЫ: OFF";if(motionToggle)motionToggle.title=enabled?"Выключить фоновые эффекты":"Включить фоновые эффекты";if(enabled)startParticles();else stopParticles()}
if(canvas){resizeCanvas();startParticles();addEventListener("resize",()=>{resizeCanvas();if(motionEnabled)startParticles()},{passive:true});document.addEventListener("visibilitychange",()=>{if(document.hidden)stopParticles();else if(motionEnabled)startParticles()})}
if(motionToggle)motionToggle.addEventListener("click",()=>{motionEnabled=body.classList.contains("motion-off");setMotion(motionEnabled);showToast(motionEnabled?"Фоновые эффекты включены":"Фоновые эффекты выключены")});
reducedMotion.addEventListener?.("change",e=>{if(e.matches){motionEnabled=false;setMotion(false)}});
if(menuToggle&&nav){menuToggle.addEventListener("click",()=>{const open=menuToggle.getAttribute("aria-expanded")==="true";menuToggle.setAttribute("aria-expanded",String(!open));nav.classList.toggle("open",!open)});$$(".nav-link",nav).forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false")}))}
const navLinks=$$(".nav-link"),sections=navLinks.map(a=>$(a.getAttribute("href"))).filter(Boolean);
if("IntersectionObserver"in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;navLinks.forEach(a=>{const active=a.getAttribute("href")==="#"+entry.target.id;a.classList.toggle("active",active);if(active)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current")})}),{rootMargin:"-25% 0px -60% 0px"});sections.forEach(s=>observer.observe(s))}
const nodeData={origin:{kicker:"NODE / 00",title:"Исходный мем",description:"Всё начинается с узнаваемого образа или короткой фразы. Люди подхватывают идею, когда она попадает в настроение и контекст.",progress:"25%"},social:{kicker:"NODE / 01",title:"Социальные сети",description:"Публикации и рекомендации помогают идее попасть к новым людям. Скорость распространения зависит от платформы, аудитории и момента.",progress:"50%"},remix:{kicker:"NODE / 02",title:"Ремиксы и вариации",description:"Пользователи меняют подписи, добавляют собственные ситуации и создают новые версии. Возможность легко адаптировать мем поддерживает его жизнь.",progress:"72%"},community:{kicker:"NODE / 03",title:"Сообщества",description:"Внутри сообществ появляются свои шутки и значения. Один и тот же шаблон может читаться по-разному в разных группах.",progress:"62%"},culture:{kicker:"NODE / 04",title:"Часть интернет-культуры",description:"Когда образ узнают без пояснений, он становится общим культурным сигналом. Популярность не гарантирует вечную жизнь — мемы постоянно меняются.",progress:"100%"}};
$$(".network-node").forEach(button=>button.addEventListener("click",()=>{const data=nodeData[button.dataset.node];if(!data)return;$$(".network-node").forEach(node=>{const selected=node===button;node.classList.toggle("selected",selected);node.setAttribute("aria-pressed",String(selected))});$("#node-kicker").textContent=data.kicker;$("#node-title").textContent=data.title;$("#node-description").textContent=data.description;$("#node-progress-fill").style.width=data.progress}));
const output=$("#terminal-output"),input=$("#terminal-input"),form=$("#terminal-form"),history=[];let historyIndex=0;
function printLine(text,cls=""){if(!output)return;const p=document.createElement("p");if(cls)p.className=cls;p.textContent=text;output.appendChild(p);while(output.children.length>80)output.removeChild(output.firstElementChild);output.scrollTop=output.scrollHeight}
const commands={
help:()=>{printLine("ДОСТУПНЫЕ КОМАНДЫ","term-accent");printLine("help — показать эту справку");printLine("about — информация о Cyber Cat");printLine("status — состояние локальной симуляции");printLine("lore — кратко об идее мема");printLine("theme — переключить фоновые эффекты");printLine("clear — очистить вывод терминала");printLine("Примечание: это демонстрация, системные команды не выполняются.","term-muted")},
about:()=>{printLine("CYBER CAT 2K25 / INTERACTIVE MEME ARCHIVE","term-accent");printLine("Фан-проект об интернет-культуре, мемах и неоновой эстетике.");printLine("Собран на HTML, CSS и JavaScript. Работает прямо в браузере.")},
status:()=>{printLine("SIMULATION: ONLINE","term-ok");printLine("NETWORK: LOCAL DEMO");printLine("SERVER CONNECTION: NONE");printLine("BACKGROUND FX: "+(motionEnabled?"ENABLED":"DISABLED"))},
lore:()=>{printLine("Окак — короткая реакция, смысл которой меняется в зависимости от контекста.","term-accent");printLine("Это творческое описание, а не подтверждённая историческая хроника.")},
theme:()=>{motionEnabled=!motionEnabled;setMotion(motionEnabled);printLine("Фоновые эффекты: "+(motionEnabled?"включены":"выключены"),"term-ok")},
clear:()=>output.replaceChildren()
};
function runCommand(raw){const command=raw.trim().toLowerCase();if(!command)return;printLine("guest@cybercat:~$ "+raw,"term-accent");if(history[history.length-1]!==raw)history.push(raw);historyIndex=history.length;if(commands[command])commands[command]();else printLine("Неизвестная команда: "+command+". Введи help для списка команд.","term-error")}
if(form&&input&&output){form.addEventListener("submit",e=>{e.preventDefault();const raw=input.value;input.value="";runCommand(raw)});input.addEventListener("keydown",e=>{if(e.key==="ArrowUp"){e.preventDefault();if(historyIndex>0)input.value=history[--historyIndex]}else if(e.key==="ArrowDown"){e.preventDefault();if(historyIndex<history.length-1)input.value=history[++historyIndex];else{historyIndex=history.length;input.value=""}}});$$("[data-command]").forEach(button=>button.addEventListener("click",()=>{runCommand(button.dataset.command);input.focus()}))}
const focusButton=$("#terminal-focus");if(focusButton&&input)focusButton.addEventListener("click",()=>{$("#terminal").scrollIntoView({behavior:reducedMotion.matches?"auto":"smooth",block:"center"});setTimeout(()=>input.focus(),reducedMotion.matches?0:350);runCommand("status")});
const soundButton=$("#cat-sound");let catAudio=null;if(soundButton)soundButton.addEventListener("click",async()=>{try{if(!catAudio){catAudio=new Audio("assets/sounds/cat-roar.mp3");catAudio.preload="none"}catAudio.currentTime=0;await catAudio.play();showToast("Мяу! Звуковой модуль активирован")}catch(error){showToast("Звук не загрузился. Проверь соединение и файл аудио.")}});
const cat=$("#cyber-cat");if(cat&&!reducedMotion.matches){cat.addEventListener("click",()=>{cat.animate([{transform:"translateY(0) rotate(0)"},{transform:"translateY(-12px) rotate(-3deg)"},{transform:"translateY(0) rotate(0)"}],{duration:450,easing:"ease-out"});showToast("Окак. Кот заметил тебя.")});cat.setAttribute("tabindex","0");cat.setAttribute("role","button");cat.setAttribute("aria-label","Нажми, чтобы активировать реакцию киберкота");cat.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();cat.click()}})}

/* Cyber Cat 2K25 v1.2 — local reaction history and favourites */
const memeContext=$("#meme-context"),memeResult=$("#meme-result"),memeCaption=$("#meme-caption");
const memeOptions={
  "plot-twist":[
    "Я моргнул — а сюжет уже в третьем сезоне. Окак.",
    "Поворот был такой резкий, что даже сценарист вышел из чата.",
    "Думал, это конец истории. Оказалось — обучающий уровень.",
    "Всё шло по плану. План просто был секретный."
  ],
  awkward:[
    "Я хотел промолчать, но лицо уже всё рассказало. Окак.",
    "В комнате стало тихо. Даже Wi-Fi перестал мигать.",
    "Сказал «и тебе» официанту, который пожелал приятного аппетита.",
    "Мой внутренний голос попросил не вспоминать это перед сном."
  ],
  technology:[
    "Перезапустил роутер. Теперь у него характер.",
    "Техника сказала «обновление готово» и открыла портал в неизвестность.",
    "Нажал одну кнопку. Получил три новых проблемы и бонусный квест.",
    "Интернет пропал ровно в тот момент, когда я сказал «сейчас покажу»."
  ],
  plans:[
    "План был идеальный. Реальность тоже пришла со своим.",
    "В списке дел один пункт: составить список дел. Уже устал.",
    "Вышел решить один вопрос. Вернулся с пятью новыми.",
    "Поставил напоминание отдохнуть. Теперь у меня дедлайн на отдых."
  ],
  everyday:[
    "Зашёл на минутку. Вышел с новым жизненным опытом.",
    "Понедельник посмотрел на меня. Я посмотрел в ответ. Окак.",
    "Всё под контролем. Контроль, правда, не мой.",
    "Хотел продуктивный день. Получился сюжетный эксперимент."
  ]
};
const memeContextLabels={
  "plot-twist":"НЕОЖИДАННЫЙ ПОВОРОТ",
  awkward:"НЕЛОВКИЙ МОМЕНТ",
  technology:"ТЕХНИКА ОПЯТЬ ЧУДИТ",
  plans:"ПЛАНЫ ПОШЛИ НЕ ТАК",
  everyday:"ОБЫЧНЫЙ ДЕНЬ"
};
const generateMemeButton=$("#generate-meme"),copyMemeButton=$("#copy-meme"),shareMemeButton=$("#share-meme");
const favoriteMemeButton=$("#favorite-meme"),historyList=$("#meme-history-list"),favoritesList=$("#meme-favorites-list");
const historyCount=$("#meme-history-count"),favoritesCount=$("#meme-favorites-count"),clearHistoryButton=$("#clear-meme-history");
const MEME_HISTORY_KEY="cybercat.v12.reaction-history",MEME_FAVORITES_KEY="cybercat.v12.reaction-favorites";
const MAX_MEME_HISTORY=8,MAX_MEME_FAVORITES=20;

function isValidStoredReaction(item){
  return item&&typeof item.text==="string"&&item.text.trim().length>0&&item.text.length<=300&&
    Object.prototype.hasOwnProperty.call(memeContextLabels,item.context);
}
function readStoredReactions(key,limit){
  try{
    const raw=window.localStorage.getItem(key);
    if(!raw)return [];
    const parsed=JSON.parse(raw);
    if(!Array.isArray(parsed))return [];
    return parsed.filter(isValidStoredReaction).slice(0,limit).map(item=>({
      text:item.text,context:item.context,createdAt:Number.isFinite(item.createdAt)?item.createdAt:Date.now()
    }));
  }catch(error){return []}
}
function writeStoredReactions(key,items){
  try{window.localStorage.setItem(key,JSON.stringify(items));return true}
  catch(error){return false}
}
let memeHistoryItems=readStoredReactions(MEME_HISTORY_KEY,MAX_MEME_HISTORY);
let memeFavoriteItems=readStoredReactions(MEME_FAVORITES_KEY,MAX_MEME_FAVORITES);
let lastMemeIndex=-1;

function getCurrentReaction(){
  return {
    text:memeResult?.textContent?.trim()||"Окак.",
    context:memeContext?.value||"everyday",
    createdAt:Date.now()
  };
}
function isFavorite(reaction){
  return memeFavoriteItems.some(item=>item.text===reaction.text&&item.context===reaction.context);
}
function updateFavoriteButton(){
  if(!favoriteMemeButton)return;
  const selected=isFavorite(getCurrentReaction());
  favoriteMemeButton.setAttribute("aria-pressed",String(selected));
  favoriteMemeButton.textContent=selected?"★ В избранном":"☆ В избранное";
}
function renderReactionList(element,items,kind){
  if(!element)return;
  element.replaceChildren();
  if(items.length===0){
    const empty=document.createElement("li");
    empty.className="reaction-empty";
    empty.textContent=kind==="history"?"Пока пусто — сгенерируй первую реакцию.":"Здесь появятся сохранённые реакции.";
    element.appendChild(empty);
    return;
  }
  items.forEach((item,index)=>{
    const row=document.createElement("li");
    const restore=document.createElement("button");
    restore.type="button";
    restore.className="reaction-restore";
    restore.dataset.reactionAction="restore";
    restore.dataset.reactionKind=kind;
    restore.dataset.reactionIndex=String(index);
    const context=document.createElement("span");
    context.className="reaction-context";
    context.textContent=memeContextLabels[item.context]||memeContextLabels.everyday;
    const text=document.createElement("span");
    text.className="reaction-text";
    text.textContent=item.text;
    restore.append(context,text);
    const remove=document.createElement("button");
    remove.type="button";
    remove.className="reaction-remove";
    remove.dataset.reactionAction="remove";
    remove.dataset.reactionKind=kind;
    remove.dataset.reactionIndex=String(index);
    remove.setAttribute("aria-label",kind==="history"?"Удалить из истории":"Удалить из избранного");
    remove.textContent="×";
    row.append(restore,remove);
    element.appendChild(row);
  });
}
function renderMemeCollections(){
  renderReactionList(historyList,memeHistoryItems,"history");
  renderReactionList(favoritesList,memeFavoriteItems,"favorite");
  if(historyCount)historyCount.textContent=String(memeHistoryItems.length);
  if(favoritesCount)favoritesCount.textContent=String(memeFavoriteItems.length);
  updateFavoriteButton();
}
function recordMeme(reaction){
  memeHistoryItems=[reaction,...memeHistoryItems.filter(item=>!(item.text===reaction.text&&item.context===reaction.context))].slice(0,MAX_MEME_HISTORY);
  writeStoredReactions(MEME_HISTORY_KEY,memeHistoryItems);
  renderMemeCollections();
}
function restoreReaction(reaction){
  if(!reaction||!memeResult)return;
  if(memeContext)memeContext.value=reaction.context;
  memeResult.textContent=reaction.text;
  if(memeCaption)memeCaption.textContent="СЦЕНАРИЙ: "+(memeContextLabels[reaction.context]||memeContextLabels.everyday);
  updateFavoriteButton();
  showToast("Реакция восстановлена");
}
function generateMeme(){
  if(!memeContext||!memeResult)return;
  const context=memeContext.value,options=memeOptions[context]||memeOptions.everyday;
  let nextIndex=options.length>1?Math.floor(Math.random()*options.length):0;
  if(options.length>1&&nextIndex===lastMemeIndex)nextIndex=(nextIndex+1)%options.length;
  lastMemeIndex=nextIndex;
  memeResult.textContent=options[nextIndex];
  if(memeCaption)memeCaption.textContent="СЦЕНАРИЙ: "+(memeContextLabels[context]||memeContextLabels.everyday);
  recordMeme(getCurrentReaction());
}
function getMemeShareText(){
  const phrase=memeResult?.textContent?.trim()||"Окак.";
  const context=memeContextLabels[memeContext?.value]||"ОКАК";
  return phrase+"\n\nCyber Cat 2K25 · "+context;
}
async function copyToClipboard(text){
  try{
    if(navigator.clipboard&&typeof navigator.clipboard.writeText==="function"){
      await navigator.clipboard.writeText(text);
      return true;
    }
  }catch(error){/* Fall through to the selection-based compatibility path. */}
  const field=document.createElement("textarea");
  field.value=text;field.setAttribute("readonly","");
  field.style.position="fixed";field.style.opacity="0";field.style.pointerEvents="none";
  document.body.appendChild(field);field.select();field.setSelectionRange(0,field.value.length);
  let copied=false;
  try{copied=document.execCommand("copy")}catch(error){copied=false}
  field.remove();
  return copied;
}
if(generateMemeButton)generateMemeButton.addEventListener("click",generateMeme);
if(memeContext)memeContext.addEventListener("change",generateMeme);
if(favoriteMemeButton)favoriteMemeButton.addEventListener("click",()=>{
  const reaction=getCurrentReaction();
  const existingIndex=memeFavoriteItems.findIndex(item=>item.text===reaction.text&&item.context===reaction.context);
  if(existingIndex>=0){
    memeFavoriteItems.splice(existingIndex,1);
    const saved=writeStoredReactions(MEME_FAVORITES_KEY,memeFavoriteItems);
    renderMemeCollections();
    showToast(saved?"Удалено из избранного":"Удалено из текущего списка браузера");
    return;
  }
  memeFavoriteItems=[reaction,...memeFavoriteItems].slice(0,MAX_MEME_FAVORITES);
  const saved=writeStoredReactions(MEME_FAVORITES_KEY,memeFavoriteItems);
  renderMemeCollections();
  showToast(saved?"Добавлено в избранное":"Браузер не разрешил сохранить список надолго");
});
function handleReactionListClick(event){
  const button=event.target.closest("button[data-reaction-action]");
  if(!button)return;
  const index=Number(button.dataset.reactionIndex),kind=button.dataset.reactionKind;
  if(!Number.isInteger(index)||index<0)return;
  const items=kind==="history"?memeHistoryItems:memeFavoriteItems;
  if(index>=items.length)return;
  if(button.dataset.reactionAction==="restore"){
    restoreReaction(items[index]);
    return;
  }
  if(button.dataset.reactionAction==="remove"){
    items.splice(index,1);
    const key=kind==="history"?MEME_HISTORY_KEY:MEME_FAVORITES_KEY;
    writeStoredReactions(key,items);
    renderMemeCollections();
    showToast(kind==="history"?"Удалено из истории":"Удалено из избранного");
  }
}
if(historyList)historyList.addEventListener("click",handleReactionListClick);
if(favoritesList)favoritesList.addEventListener("click",handleReactionListClick);
if(clearHistoryButton)clearHistoryButton.addEventListener("click",()=>{
  memeHistoryItems=[];
  writeStoredReactions(MEME_HISTORY_KEY,memeHistoryItems);
  renderMemeCollections();
  showToast("История очищена");
});
if(copyMemeButton)copyMemeButton.addEventListener("click",async()=>{
  const copied=await copyToClipboard(getMemeShareText());
  showToast(copied?"Реакция скопирована":"Не получилось скопировать — выдели текст вручную");
});
if(shareMemeButton)shareMemeButton.addEventListener("click",async()=>{
  const text=getMemeShareText();
  if(typeof navigator.share==="function"){
    try{await navigator.share({title:"Cyber Cat 2K25 — Окак",text,url:window.location.href});return}
    catch(error){if(error&&error.name==="AbortError")return}
  }
  const copied=await copyToClipboard(text+"\n"+window.location.href);
  showToast(copied?"Текст готов — скопировано для отправки":"Поделиться не удалось на этом устройстве");
});
/* Cyber Cat 2K25 v1.3 — user-authored reactions */
const customReactionForm=$("#custom-reaction-form");
const customReactionText=$("#custom-reaction-text");
const customReactionContext=$("#custom-reaction-context");
const customReactionCounter=$("#custom-reaction-counter");
const customReactionStatus=$("#custom-reaction-status");
const customReactionList=$("#custom-reaction-list");
const customReactionCount=$("#custom-reaction-count");
const CUSTOM_REACTIONS_KEY="cybercat.v13.custom-reactions";
const MAX_CUSTOM_REACTIONS=30;
const MAX_CUSTOM_REACTION_LENGTH=240;

function isValidCustomReaction(item){
  return item&&typeof item.text==="string"&&item.text.trim().length>0&&
    item.text.length<=MAX_CUSTOM_REACTION_LENGTH&&
    Object.prototype.hasOwnProperty.call(memeContextLabels,item.context);
}
function readCustomReactions(){
  try{
    const raw=window.localStorage.getItem(CUSTOM_REACTIONS_KEY);
    if(!raw)return [];
    const parsed=JSON.parse(raw);
    if(!Array.isArray(parsed))return [];
    return parsed.filter(isValidCustomReaction).slice(0,MAX_CUSTOM_REACTIONS).map(item=>({
      text:item.text.trim(),context:item.context,
      createdAt:Number.isFinite(item.createdAt)?item.createdAt:Date.now()
    }));
  }catch(error){return []}
}
function saveCustomReactions(){
  try{window.localStorage.setItem(CUSTOM_REACTIONS_KEY,JSON.stringify(customReactionItems));return true}
  catch(error){return false}
}
let customReactionItems=readCustomReactions();
function renderCustomReactions(){
  if(customReactionCount)customReactionCount.textContent=String(customReactionItems.length);
  if(!customReactionList)return;
  customReactionList.replaceChildren();
  if(customReactionItems.length===0){
    const empty=document.createElement("li");
    empty.className="reaction-empty";
    empty.textContent="Коллекция пуста — добавь первую фразу выше.";
    customReactionList.appendChild(empty);
    return;
  }
  customReactionItems.forEach((item,index)=>{
    const row=document.createElement("li");
    const restore=document.createElement("button");
    restore.type="button";
    restore.className="reaction-restore";
    restore.dataset.customReactionAction="restore";
    restore.dataset.customReactionIndex=String(index);
    const context=document.createElement("span");
    context.className="reaction-context";
    context.textContent=memeContextLabels[item.context]||memeContextLabels.everyday;
    const phrase=document.createElement("span");
    phrase.className="reaction-text";
    phrase.textContent=item.text;
    restore.append(context,phrase);
    const remove=document.createElement("button");
    remove.type="button";
    remove.className="reaction-remove";
    remove.dataset.customReactionAction="remove";
    remove.dataset.customReactionIndex=String(index);
    remove.setAttribute("aria-label","Удалить собственную реакцию");
    remove.textContent="×";
    row.append(restore,remove);
    customReactionList.appendChild(row);
  });
}
function updateCustomReactionCounter(){
  if(customReactionCounter)customReactionCounter.textContent=String(customReactionText?.value.length||0)+" / "+MAX_CUSTOM_REACTION_LENGTH;
}
if(customReactionText)customReactionText.addEventListener("input",updateCustomReactionCounter);
if(customReactionForm)customReactionForm.addEventListener("submit",event=>{
  event.preventDefault();
  const text=customReactionText?.value.trim()||"";
  const context=customReactionContext?.value||"everyday";
  if(!text){
    if(customReactionStatus)customReactionStatus.textContent="Сначала введи текст реакции.";
    customReactionText?.focus();
    return;
  }
  if(text.length>MAX_CUSTOM_REACTION_LENGTH){
    showToast("Слишком длинная фраза — максимум 240 символов");
    return;
  }
  if(customReactionItems.some(item=>item.text.toLocaleLowerCase()===text.toLocaleLowerCase()&&item.context===context)){
    if(customReactionStatus)customReactionStatus.textContent="Такая фраза с этим контекстом уже есть.";
    showToast("Эта реакция уже есть в коллекции");
    return;
  }
  customReactionItems=[{text,context,createdAt:Date.now()},...customReactionItems].slice(0,MAX_CUSTOM_REACTIONS);
  const saved=saveCustomReactions();
  renderCustomReactions();
  customReactionForm.reset();
  updateCustomReactionCounter();
  if(customReactionStatus)customReactionStatus.textContent="Реакция добавлена. "+(saved?"Она сохранена в этом браузере.":"Браузер не разрешил постоянное сохранение.");
  showToast(saved?"Своя реакция сохранена":"Реакция добавлена до закрытия страницы");
});
if(customReactionList)customReactionList.addEventListener("click",event=>{
  const button=event.target.closest("button[data-custom-reaction-action]");
  if(!button)return;
  const index=Number(button.dataset.customReactionIndex);
  if(!Number.isInteger(index)||index<0||index>=customReactionItems.length)return;
  if(button.dataset.customReactionAction==="restore"){
    const item=customReactionItems[index];
    if(memeContext)memeContext.value=item.context;
    if(memeResult)memeResult.textContent=item.text;
    if(memeCaption)memeCaption.textContent="СЦЕНАРИЙ: "+(memeContextLabels[item.context]||memeContextLabels.everyday);
    recordMeme(getCurrentReaction());
    showToast("Своя реакция восстановлена");
    return;
  }
  if(button.dataset.customReactionAction==="remove"){
    customReactionItems.splice(index,1);
    const saved=saveCustomReactions();
    renderCustomReactions();
    showToast(saved?"Своя реакция удалена":"Реакция удалена из текущего списка");
  }
});
renderCustomReactions();
updateCustomReactionCounter();

/* Cyber Cat 2K25 v1.4 — portable collection backup */
const exportCollectionsButton=$("#export-meme-collections");
const importCollectionsInput=$("#import-meme-collections");
const collectionTransferStatus=$("#collection-transfer-status");
const COLLECTION_EXPORT_FORMAT="cyber-cat-2k25-collections";
const COLLECTION_EXPORT_VERSION=1;
const MAX_IMPORT_FILE_SIZE=100*1024;

function updateCollectionTransferStatus(message){
  if(collectionTransferStatus)collectionTransferStatus.textContent=message;
}
function mergeReactionLists(existing,incoming,limit,validator){
  const merged=[];
  const seen=new Set();
  for(const item of [...incoming,...existing]){
    if(!validator(item))continue;
    const text=item.text.trim();
    const key=item.context+"\u0000"+text.toLocaleLowerCase();
    if(seen.has(key))continue;
    seen.add(key);
    merged.push({text,context:item.context,createdAt:Number.isFinite(item.createdAt)?item.createdAt:Date.now()});
    if(merged.length>=limit)break;
  }
  return merged;
}
function exportMemeCollections(){
  const backup={
    format:COLLECTION_EXPORT_FORMAT,
    version:COLLECTION_EXPORT_VERSION,
    exportedAt:new Date().toISOString(),
    collections:{
      history:memeHistoryItems.slice(0,MAX_MEME_HISTORY),
      favorites:memeFavoriteItems.slice(0,MAX_MEME_FAVORITES),
      custom:customReactionItems.slice(0,MAX_CUSTOM_REACTIONS)
    }
  };
  const blob=new Blob([JSON.stringify(backup,null,2)],{type:"application/json;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;
  link.download="cyber-cat-collections-"+new Date().toISOString().slice(0,10)+".json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  updateCollectionTransferStatus("Резервная копия подготовлена: история, избранное и собственные реакции.");
  showToast("Коллекции экспортированы в JSON");
}
function importReactionArray(value,limit,validator){
  if(!Array.isArray(value))return [];
  return value.filter(validator).map(item=>({
    text:item.text.trim(),
    context:item.context,
    createdAt:Number.isFinite(item.createdAt)?item.createdAt:Date.now()
  })).slice(0,limit);
}
async function importMemeCollections(file){
  if(!file)return;
  if(file.size>MAX_IMPORT_FILE_SIZE){
    updateCollectionTransferStatus("Файл слишком большой. Максимальный размер — 100 КБ.");
    showToast("Файл импорта слишком большой");
    return;
  }
  let parsed;
  try{
    parsed=JSON.parse(await file.text());
  }catch(error){
    updateCollectionTransferStatus("Не удалось прочитать JSON. Проверь файл и попробуй снова.");
    showToast("Некорректный JSON-файл");
    return;
  }
  if(!parsed||typeof parsed!=="object"||parsed.format!==COLLECTION_EXPORT_FORMAT||
    parsed.version!==COLLECTION_EXPORT_VERSION||!parsed.collections||typeof parsed.collections!=="object"){
    updateCollectionTransferStatus("Формат файла не распознан или версия резервной копии не поддерживается.");
    showToast("Неподдерживаемый формат резервной копии");
    return;
  }
  const incoming=parsed.collections;
  const importedHistory=importReactionArray(incoming.history,MAX_MEME_HISTORY,isValidStoredReaction);
  const importedFavorites=importReactionArray(incoming.favorites,MAX_MEME_FAVORITES,isValidStoredReaction);
  const importedCustom=importReactionArray(incoming.custom,MAX_CUSTOM_REACTIONS,isValidCustomReaction);
  const nextHistory=mergeReactionLists(memeHistoryItems,importedHistory,MAX_MEME_HISTORY,isValidStoredReaction);
  const nextFavorites=mergeReactionLists(memeFavoriteItems,importedFavorites,MAX_MEME_FAVORITES,isValidStoredReaction);
  const nextCustom=mergeReactionLists(customReactionItems,importedCustom,MAX_CUSTOM_REACTIONS,isValidCustomReaction);

  const oldHistory=memeHistoryItems,oldFavorites=memeFavoriteItems,oldCustom=customReactionItems;
  memeHistoryItems=nextHistory;
  memeFavoriteItems=nextFavorites;
  customReactionItems=nextCustom;
  const historySaved=writeStoredReactions(MEME_HISTORY_KEY,memeHistoryItems);
  const favoritesSaved=writeStoredReactions(MEME_FAVORITES_KEY,memeFavoriteItems);
  const customSaved=saveCustomReactions();
  if(!(historySaved&&favoritesSaved&&customSaved)){
    memeHistoryItems=oldHistory;
    memeFavoriteItems=oldFavorites;
    customReactionItems=oldCustom;
    writeStoredReactions(MEME_HISTORY_KEY,memeHistoryItems);
    writeStoredReactions(MEME_FAVORITES_KEY,memeFavoriteItems);
    saveCustomReactions();
    updateCollectionTransferStatus("Браузер не разрешил сохранить импорт. Исходные коллекции оставлены без изменений.");
    showToast("Не удалось сохранить импорт");
    return;
  }
  renderMemeCollections();
  renderCustomReactions();
  updateCollectionTransferStatus("Импорт завершён: коллекции объединены без повторов. История и избранное ограничены своими стандартными лимитами.");
  showToast("Коллекции импортированы");
}
if(exportCollectionsButton)exportCollectionsButton.addEventListener("click",exportMemeCollections);
if(importCollectionsInput)importCollectionsInput.addEventListener("change",async()=>{
  const file=importCollectionsInput.files&&importCollectionsInput.files[0];
  try{await importMemeCollections(file)}
  catch(error){
    updateCollectionTransferStatus("Импорт не завершён. Проверь файл и наличие свободного места в браузере.");
    showToast("Ошибка импорта коллекций");
  }finally{
    importCollectionsInput.value="";
  }
});

renderMemeCollections();

/* Cyber Cat 2K25 v1.5 — local canvas meme studio */
const memeStudioCanvas=$("#meme-image-canvas");
const memeStudioContext=memeStudioCanvas?.getContext("2d");
const memeTemplateSelect=$("#meme-template");
const memeImageUpload=$("#meme-image-upload");
const memeImageTopText=$("#meme-image-top-text");
const memeImageBottomText=$("#meme-image-bottom-text");
const memeImageCharCount=$("#meme-image-char-count");
const memeStudioStatus=$("#meme-studio-status");
const downloadMemePngButton=$("#download-meme-png");
const resetMemeImageButton=$("#reset-meme-image");
const useCurrentReactionButton=$("#use-current-reaction");
const MEME_IMAGE_MAX_FILE_SIZE=8*1024*1024;
let memeStudioImage=null;
let memeStudioImageUrl="";
const memeStudioThemes={
  cyber:{top:"#061421",bottom:"#122b42",accent:"#4df5e8",secondary:"#a98bff"},
  sunset:{top:"#200c35",bottom:"#f14d79",accent:"#ffca78",secondary:"#ff4ca5"},
  glitch:{top:"#100923",bottom:"#39205f",accent:"#bca0ff",secondary:"#ff5fba"},
  acid:{top:"#081b12",bottom:"#273d10",accent:"#d7ff65",secondary:"#4df5e8"}
};
function drawMemeBackground(ctx,width,height,theme){
  const gradient=ctx.createLinearGradient(0,0,width,height);
  gradient.addColorStop(0,theme.top);
  gradient.addColorStop(1,theme.bottom);
  ctx.fillStyle=gradient;ctx.fillRect(0,0,width,height);
  ctx.save();
  ctx.globalAlpha=.22;ctx.strokeStyle=theme.accent;ctx.lineWidth=2;
  for(let x=0;x<=width;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke()}
  for(let y=0;y<=height;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke()}
  ctx.globalAlpha=.3;ctx.strokeStyle=theme.secondary;ctx.lineWidth=7;
  for(let i=0;i<5;i++){
    ctx.beginPath();ctx.arc(width*.5,height*.51,130+i*85,0,Math.PI*2);ctx.stroke();
  }
  ctx.globalAlpha=.10;ctx.fillStyle=theme.accent;ctx.font='900 330px Impact, "Arial Black", sans-serif';
  ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("ОКАК",width/2,height/2+10);
  ctx.restore();
}
function drawMemeImageCover(ctx,image,width,height){
  const iw=image.naturalWidth||image.width,ih=image.naturalHeight||image.height;
  if(!iw||!ih)return;
  const scale=Math.max(width/iw,height/ih),sw=width/scale,sh=height/scale;
  const sx=(iw-sw)/2,sy=(ih-sh)/2;
  ctx.drawImage(image,sx,sy,sw,sh,0,0,width,height);
  const shade=ctx.createLinearGradient(0,0,0,height);
  shade.addColorStop(0,"rgba(2,6,16,.68)");
  shade.addColorStop(.38,"rgba(2,6,16,.05)");
  shade.addColorStop(.62,"rgba(2,6,16,.05)");
  shade.addColorStop(1,"rgba(2,6,16,.72)");
  ctx.fillStyle=shade;ctx.fillRect(0,0,width,height);
}
function wrapMemeCaption(ctx,text,maxWidth,maxLines){
  const words=text.trim().split(/\s+/).filter(Boolean);
  const lines=[];let line="";
  for(const word of words){
    const candidate=line?line+" "+word:word;
    if(ctx.measureText(candidate).width>maxWidth&&line){
      lines.push(line);line=word;
      if(lines.length===maxLines-1)break;
    }else line=candidate;
  }
  if(line&&lines.length<maxLines)lines.push(line);
  if(lines.length===maxLines&&words.join(" ")!==lines.join(" ")){
    let final=lines[lines.length-1];
    while(final.length>1&&ctx.measureText(final+"…").width>maxWidth)final=final.slice(0,-1);
    lines[lines.length-1]=final+"…";
  }
  return lines;
}
function drawMemeCaption(ctx,text,bandY,bandHeight,alignment,accent){
  const clean=(text||"").trim();
  if(!clean)return;
  const width=memeStudioCanvas.width,maxWidth=width-100;
  let fontSize=76,lines=[];
  do{
    ctx.font='900 '+fontSize+'px Impact, "Arial Black", sans-serif';
    lines=wrapMemeCaption(ctx,clean.toLocaleUpperCase(),maxWidth,3);
    if(lines.length*fontSize*1.04<=bandHeight-42&&lines.every(line=>ctx.measureText(line).width<=maxWidth))break;
    fontSize-=3;
  }while(fontSize>32);
  ctx.save();
  ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineJoin="round";
  ctx.font='900 '+fontSize+'px Impact, "Arial Black", sans-serif';
  const lineHeight=fontSize*1.06;
  const startY=alignment==="top"?bandY+bandHeight/2-(lines.length-1)*lineHeight/2:bandY+bandHeight/2-(lines.length-1)*lineHeight/2;
  lines.forEach((line,index)=>{
    const y=startY+index*lineHeight;
    ctx.shadowColor=accent;ctx.shadowBlur=16;ctx.lineWidth=9;ctx.strokeStyle="rgba(3,7,18,.94)";ctx.strokeText(line,width/2,y,maxWidth);
    ctx.shadowBlur=10;ctx.lineWidth=3;ctx.strokeStyle=accent;ctx.strokeText(line,width/2,y,maxWidth);
    ctx.shadowBlur=0;ctx.fillStyle="#ffffff";ctx.fillText(line,width/2,y,maxWidth);
  });
  ctx.restore();
}
function renderMemeStudio(){
  if(!memeStudioCanvas||!memeStudioContext)return;
  const ctx=memeStudioContext,width=memeStudioCanvas.width,height=memeStudioCanvas.height;
  const theme=memeStudioThemes[memeTemplateSelect?.value]||memeStudioThemes.cyber;
  ctx.clearRect(0,0,width,height);
  if(memeStudioImage)drawMemeImageCover(ctx,memeStudioImage,width,height);
  else drawMemeBackground(ctx,width,height,theme);
  const topBand=ctx.createLinearGradient(0,0,0,280);
  topBand.addColorStop(0,"rgba(2,6,16,.86)");topBand.addColorStop(1,"rgba(2,6,16,0)");
  ctx.fillStyle=topBand;ctx.fillRect(0,0,width,285);
  const bottomBand=ctx.createLinearGradient(0,height-330,0,height);
  bottomBand.addColorStop(0,"rgba(2,6,16,0)");bottomBand.addColorStop(1,"rgba(2,6,16,.92)");
  ctx.fillStyle=bottomBand;ctx.fillRect(0,height-330,width,330);
  drawMemeCaption(ctx,memeImageTopText?.value||"",35,260,"top",theme.accent);
  drawMemeCaption(ctx,memeImageBottomText?.value||"",height-300,240,"bottom",theme.secondary);
  ctx.save();
  ctx.font='600 22px "Arial", sans-serif';ctx.textAlign="right";ctx.textBaseline="bottom";
  ctx.fillStyle=theme.accent;ctx.shadowColor="#030712";ctx.shadowBlur=5;
  ctx.fillText("CYBER CAT 2K25",width-35,height-20);
  ctx.restore();
  if(memeImageCharCount)memeImageCharCount.textContent=String(memeImageBottomText?.value.length||0)+" / 140";
}
function setMemeStudioStatus(message){if(memeStudioStatus)memeStudioStatus.textContent=message}
if(memeTemplateSelect)memeTemplateSelect.addEventListener("change",renderMemeStudio);
if(memeImageTopText)memeImageTopText.addEventListener("input",renderMemeStudio);
if(memeImageBottomText)memeImageBottomText.addEventListener("input",renderMemeStudio);
if(memeImageUpload)memeImageUpload.addEventListener("change",()=>{
  const file=memeImageUpload.files&&memeImageUpload.files[0];
  if(!file)return;
  if(!/^image\/(png|jpeg|webp|gif)$/.test(file.type)){
    memeImageUpload.value="";setMemeStudioStatus("Формат не поддерживается. Выбери PNG, JPG, WebP или GIF.");
    showToast("Неподдерживаемый формат изображения");return;
  }
  if(file.size>MEME_IMAGE_MAX_FILE_SIZE){
    memeImageUpload.value="";setMemeStudioStatus("Файл больше 8 МБ. Выбери изображение меньшего размера.");
    showToast("Изображение слишком большое");return;
  }
  const nextUrl=URL.createObjectURL(file),image=new Image();
  image.onload=()=>{
    if(memeStudioImageUrl)URL.revokeObjectURL(memeStudioImageUrl);
    memeStudioImageUrl=nextUrl;memeStudioImage=image;
    renderMemeStudio();
    setMemeStudioStatus("Изображение добавлено. Оно обрабатывается локально и не отправляется на сервер.");
  };
  image.onerror=()=>{
    URL.revokeObjectURL(nextUrl);setMemeStudioStatus("Не удалось прочитать изображение. Попробуй другой файл.");
    showToast("Не удалось открыть изображение");
  };
  image.src=nextUrl;
});
if(useCurrentReactionButton)useCurrentReactionButton.addEventListener("click",()=>{
  const current=memeResult?.textContent?.trim();
  if(!current){setMemeStudioStatus("Сначала сгенерируй или выбери реакцию в блоке выше.");return}
  if(memeImageBottomText)memeImageBottomText.value=current.slice(0,140);
  renderMemeStudio();setMemeStudioStatus("Текущая реакция перенесена в нижнюю надпись.");
  showToast("Реакция добавлена на мем-картинку");
});
if(resetMemeImageButton)resetMemeImageButton.addEventListener("click",()=>{
  if(memeStudioImageUrl)URL.revokeObjectURL(memeStudioImageUrl);
  memeStudioImageUrl="";memeStudioImage=null;
  if(memeImageUpload)memeImageUpload.value="";
  if(memeTemplateSelect)memeTemplateSelect.value="cyber";
  if(memeImageTopText)memeImageTopText.value="КОГДА ВСЁ ИДЁТ ПО ПЛАНУ";
  if(memeImageBottomText)memeImageBottomText.value="А ПОТОМ ПОЯВЛЯЕТСЯ ОН. ОКАК.";
  renderMemeStudio();setMemeStudioStatus("Шаблон сброшен. Можно начинать заново.");
});
if(downloadMemePngButton)downloadMemePngButton.addEventListener("click",()=>{
  if(!memeStudioCanvas)return;
  try{
    memeStudioCanvas.toBlob(blob=>{
      if(!blob){setMemeStudioStatus("Не удалось создать PNG. Попробуй ещё раз.");showToast("PNG не создан");return}
      const url=URL.createObjectURL(blob),link=document.createElement("a");
      link.href=url;link.download="cyber-cat-meme-"+new Date().toISOString().slice(0,10)+".png";
      document.body.appendChild(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1200);
      setMemeStudioStatus("PNG скачан: 1200 × 1200 пикселей.");
      showToast("Мем-картинка скачана в PNG");
    },"image/png");
  }catch(error){setMemeStudioStatus("Браузер не смог создать файл PNG.");showToast("Не удалось экспортировать PNG")}
});
renderMemeStudio();

const year=$("#year");if(year)year.textContent=String(new Date().getFullYear());setMotion(motionEnabled);
})();