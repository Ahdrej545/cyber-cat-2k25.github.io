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
  acid:{top:"#081b12",bottom:"#273d10",accent:"#d7ff65",secondary:"#4df5e8"},
  cat:{top:"#090d20",bottom:"#24143b",accent:"#4df5e8",secondary:"#ff4ca5",motif:"cat"}
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
  if(theme.motif==="cat"){
    ctx.globalAlpha=.2;ctx.strokeStyle=theme.secondary;ctx.lineWidth=7;
    for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(width*.5,height*.5,210+i*62,0,Math.PI*2);ctx.stroke()}
    ctx.globalAlpha=.82;ctx.fillStyle="#080d1a";ctx.strokeStyle=theme.accent;ctx.lineWidth=12;ctx.lineJoin="round";
    ctx.beginPath();ctx.moveTo(365,430);ctx.lineTo(320,230);ctx.lineTo(485,340);ctx.quadraticCurveTo(600,285,715,340);ctx.lineTo(880,230);ctx.lineTo(835,430);ctx.quadraticCurveTo(905,610,790,740);ctx.quadraticCurveTo(600,850,410,740);ctx.quadraticCurveTo(295,610,365,430);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle=theme.accent;ctx.shadowColor=theme.accent;ctx.shadowBlur=26;
    ctx.beginPath();ctx.moveTo(430,500);ctx.lineTo(540,520);ctx.lineTo(485,570);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(660,520);ctx.lineTo(770,500);ctx.lineTo(715,570);ctx.closePath();ctx.fill();
    ctx.shadowBlur=0;ctx.fillStyle=theme.secondary;ctx.beginPath();ctx.moveTo(576,605);ctx.lineTo(624,605);ctx.lineTo(600,628);ctx.closePath();ctx.fill();
    ctx.strokeStyle=theme.accent;ctx.lineWidth=5;ctx.globalAlpha=.65;
    for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(390,610+i*22);ctx.lineTo(270,580+i*38);ctx.stroke();ctx.beginPath();ctx.moveTo(810,610+i*22);ctx.lineTo(930,580+i*38);ctx.stroke()}
    ctx.globalAlpha=.13;ctx.fillStyle=theme.accent;ctx.font='900 170px Impact, "Arial Black", sans-serif';ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("猫",600,600);
  }else{
    ctx.globalAlpha=.3;ctx.strokeStyle=theme.secondary;ctx.lineWidth=7;
    for(let i=0;i<5;i++){
      ctx.beginPath();ctx.arc(width*.5,height*.51,130+i*85,0,Math.PI*2);ctx.stroke();
    }
    ctx.globalAlpha=.10;ctx.fillStyle=theme.accent;ctx.font='900 330px Impact, "Arial Black", sans-serif';
    ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("ОКАК",width/2,height/2+10);
  }
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

/* Cyber Cat 2K25 v1.6 — ready-made meme gallery */
const memeGallery=$("#meme-gallery-grid");
const memeGalleryFilters=Array.from(document.querySelectorAll(".meme-gallery-filter"));
const memeGalleryPresets={
  "okak-control":{theme:"cyber",category:"okak",top:"ВСЁ ПОД КОНТРОЛЕМ",bottom:"КОНТРОЛЬ НЕ МОЙ. ОКАК."},
  "cyber-cat":{theme:"cat",category:"cat",top:"КОГДА ЗАШЁЛ НА МИНУТУ",bottom:"А УЖЕ 3 ЧАСА НОЧИ"},
  "plot-twist":{theme:"glitch",category:"okak",top:"Я ДУМАЛ, ЧТО ВСЁ",bottom:"НО ТУТ ПОВОРОТ. ОКАК."},
  "tech-chaos":{theme:"acid",category:"life",top:"ПЕРЕЗАГРУЗИЛ РОУТЕР",bottom:"ОН ПЕРЕЗАГРУЗИЛ МЕНЯ"},
  "synthwave-plans":{theme:"sunset",category:"life",top:"ПЛАН НА ВЕЧЕР",bottom:"СЮЖЕТ ВНЕС ПРАВКИ"},
  "acid-cat":{theme:"cat",category:"cat",top:"КОТ В СИСТЕМЕ",bottom:"СИСТЕМА В ПАНИКЕ"}
};
function selectMemeGalleryPreset(id){
  const preset=memeGalleryPresets[id];
  if(!preset)return;
  if(memeStudioImageUrl)URL.revokeObjectURL(memeStudioImageUrl);
  memeStudioImageUrl="";memeStudioImage=null;
  if(memeImageUpload)memeImageUpload.value="";
  if(memeTemplateSelect)memeTemplateSelect.value=preset.theme;
  if(memeImageTopText)memeImageTopText.value=preset.top;
  if(memeImageBottomText)memeImageBottomText.value=preset.bottom;
  if(memeGallery){
    $$(".meme-gallery-card",memeGallery).forEach(card=>{
      const selected=card.dataset.galleryPreset===id;
      card.classList.toggle("selected",selected);
      card.setAttribute("aria-pressed",String(selected));
    });
  }
  renderMemeStudio();
  setMemeStudioStatus("Шаблон «"+id+"» выбран. Можешь поменять надписи и скачать свой PNG.");
  showToast("Шаблон загружен в Meme Studio");
}
if(memeGallery)memeGallery.addEventListener("click",event=>{
  const card=event.target.closest("button[data-gallery-preset]");
  if(card)selectMemeGalleryPreset(card.dataset.galleryPreset);
});
memeGalleryFilters.forEach(filter=>filter.addEventListener("click",()=>{
  const category=filter.dataset.galleryFilter||"all";
  memeGalleryFilters.forEach(button=>{
    const selected=button===filter;
    button.classList.toggle("active",selected);
    button.setAttribute("aria-pressed",String(selected));
  });
  $$(".meme-gallery-card",memeGallery).forEach(card=>{
    card.hidden=category!=="all"&&card.dataset.galleryCategory!==category;
  });
}));
if(resetMemeImageButton)resetMemeImageButton.addEventListener("click",()=>{
  if(memeGallery)memeGallery.querySelectorAll(".meme-gallery-card").forEach(card=>{
    card.classList.remove("selected");
    card.setAttribute("aria-pressed","false");
  });
});

/* Cyber Cat 2K25 v1.7 — persistent local meme gallery */
const saveMemeToGalleryButton=$("#save-meme-to-gallery");
const savedMemeGallery=$("#saved-meme-gallery");
const savedMemeGalleryGrid=$("#saved-meme-gallery-grid");
const savedMemeGalleryStatus=$("#saved-meme-gallery-status");
const savedMemeGalleryCount=$("#saved-meme-gallery-count");
const refreshSavedMemesButton=$("#refresh-saved-memes");
const SAVED_MEMES_DB_NAME="cyber-cat-2k25-local-gallery";
const SAVED_MEMES_DB_VERSION=1;
const SAVED_MEMES_STORE="memes";
const MAX_SAVED_MEMES=20;
const MAX_SAVED_MEME_SIZE=12*1024*1024;
let savedMemeDatabasePromise=null;
let savedMemeObjectUrls=[];

function setSavedMemeGalleryStatus(message){
  if(savedMemeGalleryStatus)savedMemeGalleryStatus.textContent=message;
}
function openSavedMemeDatabase(){
  if(savedMemeDatabasePromise)return savedMemeDatabasePromise;
  savedMemeDatabasePromise=new Promise((resolve,reject)=>{
    if(!("indexedDB" in window)){reject(new Error("IndexedDB недоступен в этом браузере"));return}
    const request=window.indexedDB.open(SAVED_MEMES_DB_NAME,SAVED_MEMES_DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(SAVED_MEMES_STORE)){
        const store=db.createObjectStore(SAVED_MEMES_STORE,{keyPath:"id",autoIncrement:true});
        store.createIndex("createdAt","createdAt",{unique:false});
      }
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error("Не удалось открыть локальную галерею"));
    request.onblocked=()=>reject(new Error("Обновление локальной галереи заблокировано другой вкладкой"));
  });
  savedMemeDatabasePromise=savedMemeDatabasePromise.catch(error=>{
    savedMemeDatabasePromise=null;
    throw error;
  });
  return savedMemeDatabasePromise;
}
async function getSavedMemeRecords(){
  const db=await openSavedMemeDatabase();
  return new Promise((resolve,reject)=>{
    const transaction=db.transaction(SAVED_MEMES_STORE,"readonly");
    const request=transaction.objectStore(SAVED_MEMES_STORE).getAll();
    request.onsuccess=()=>resolve(Array.isArray(request.result)?request.result:[]);
    request.onerror=()=>reject(request.error||new Error("Не удалось прочитать галерею"));
    transaction.onerror=()=>reject(transaction.error||new Error("Ошибка чтения галереи"));
  });
}
async function saveMemeRecord(record){
  const db=await openSavedMemeDatabase();
  return new Promise((resolve,reject)=>{
    const transaction=db.transaction(SAVED_MEMES_STORE,"readwrite");
    const store=transaction.objectStore(SAVED_MEMES_STORE);
    let insertedId=null;
    const request=store.getAll();
    request.onsuccess=()=>{
      const records=Array.isArray(request.result)?request.result:[];
      records.sort((a,b)=>(Number(a.createdAt)||0)-(Number(b.createdAt)||0));
      const removeCount=Math.max(0,records.length-MAX_SAVED_MEMES+1);
      records.slice(0,removeCount).forEach(item=>store.delete(item.id));
      const addRequest=store.add(record);
      addRequest.onsuccess=()=>{insertedId=addRequest.result};
      addRequest.onerror=()=>{try{transaction.abort()}catch(error){}};
    };
    request.onerror=()=>{try{transaction.abort()}catch(error){}};
    transaction.oncomplete=()=>resolve(insertedId);
    transaction.onerror=()=>reject(transaction.error||new Error("Не удалось сохранить мем"));
    transaction.onabort=()=>reject(transaction.error||new Error("Сохранение галереи отменено"));
  });
}
async function deleteSavedMemeRecord(id){
  const db=await openSavedMemeDatabase();
  return new Promise((resolve,reject)=>{
    const transaction=db.transaction(SAVED_MEMES_STORE,"readwrite");
    transaction.objectStore(SAVED_MEMES_STORE).delete(Number(id));
    transaction.oncomplete=()=>resolve(true);
    transaction.onerror=()=>reject(transaction.error||new Error("Не удалось удалить мем"));
    transaction.onabort=()=>reject(transaction.error||new Error("Удаление галереи отменено"));
  });
}
function revokeSavedMemeUrls(){
  savedMemeObjectUrls.forEach(url=>URL.revokeObjectURL(url));
  savedMemeObjectUrls=[];
}
function createSavedMemeButton(label,action,id,kind){
  const button=document.createElement("button");
  button.type="button";
  button.className="saved-meme-action";
  button.textContent=label;
  button.dataset.savedMemeAction=action;
  button.dataset.savedMemeId=String(id);
  if(kind)button.dataset.savedMemeKind=kind;
  return button;
}
function renderSavedMemeRecords(records){
  if(!savedMemeGalleryGrid)return;
  revokeSavedMemeUrls();
  savedMemeGalleryGrid.replaceChildren();
  const validRecords=records.filter(record=>record&&Number.isFinite(Number(record.id))&&record.blob instanceof Blob);
  validRecords.sort((a,b)=>(Number(b.createdAt)||0)-(Number(a.createdAt)||0));
  if(savedMemeGalleryCount)savedMemeGalleryCount.textContent=validRecords.length+" / "+MAX_SAVED_MEMES+" мемов";
  if(validRecords.length===0){
    const empty=document.createElement("p");
    empty.className="saved-meme-empty";
    empty.textContent="Галерея пока пуста. Собери мем выше и нажми «Сохранить в галерею».";
    savedMemeGalleryGrid.appendChild(empty);
    return;
  }
  validRecords.forEach(record=>{
    const card=document.createElement("article");
    card.className="saved-meme-card";
    const image=document.createElement("img");
    image.className="saved-meme-thumbnail";
    image.alt="Сохранённый мем: "+((record.topText||"")+" "+(record.bottomText||"")).trim();
    image.loading="lazy";
    const imageUrl=URL.createObjectURL(record.blob);
    savedMemeObjectUrls.push(imageUrl);
    image.src=imageUrl;
    const content=document.createElement("div");
    content.className="saved-meme-card-content";
    const caption=document.createElement("p");
    caption.className="saved-meme-caption";
    caption.textContent=[record.topText,record.bottomText].filter(Boolean).join(" / ")||"Мем без надписей";
    const meta=document.createElement("p");
    meta.className="saved-meme-meta";
    const created=Number(record.createdAt);
    meta.textContent=(Number.isFinite(created)?new Date(created).toLocaleString("ru-RU"):"Дата не указана")+" · "+Math.max(1,Math.round(record.blob.size/1024))+" КБ";
    const actions=document.createElement("div");
    actions.className="saved-meme-card-actions";
    actions.append(
      createSavedMemeButton("Скачать PNG ↓","download",record.id),
      createSavedMemeButton("Удалить ×","delete",record.id)
    );
    content.append(caption,meta,actions);
    card.append(image,content);
    savedMemeGalleryGrid.appendChild(card);
  });
}
async function refreshSavedMemeGallery(){
  if(!savedMemeGalleryGrid)return;
  try{
    const records=await getSavedMemeRecords();
    renderSavedMemeRecords(records);
    setSavedMemeGalleryStatus("Сохранённые мемы доступны только в этом браузере. Максимум — "+MAX_SAVED_MEMES+" картинок.");
  }catch(error){
    if(savedMemeGalleryCount)savedMemeGalleryCount.textContent="Недоступна";
    savedMemeGalleryGrid.replaceChildren();
    const empty=document.createElement("p");empty.className="saved-meme-empty";
    empty.textContent="Браузер не разрешил открыть локальную галерею. Проверь, что IndexedDB разрешён для сайта.";
    savedMemeGalleryGrid.appendChild(empty);
    setSavedMemeGalleryStatus("Не удалось открыть галерею: "+(error?.message||"ошибка браузера"));
  }
}
if(saveMemeToGalleryButton)saveMemeToGalleryButton.addEventListener("click",async()=>{
  if(!memeStudioCanvas){setSavedMemeGalleryStatus("Предпросмотр недоступен.");return}
  saveMemeToGalleryButton.disabled=true;
  saveMemeToGalleryButton.textContent="Сохраняю…";
  try{
    const blob=await new Promise((resolve,reject)=>{
      try{
        memeStudioCanvas.toBlob(result=>result?resolve(result):reject(new Error("Браузер не создал PNG")),"image/png");
      }catch(error){reject(error)}
    });
    if(blob.size>MAX_SAVED_MEME_SIZE){
      setSavedMemeGalleryStatus("Этот PNG больше 12 МБ. Попробуй изображение поменьше.");
      showToast("Мем слишком большой для галереи");
      return;
    }
    const record={
      createdAt:Date.now(),
      topText:memeImageTopText?.value?.trim().slice(0,100)||"",
      bottomText:memeImageBottomText?.value?.trim().slice(0,140)||"",
      theme:memeTemplateSelect?.value||"cyber",
      blob
    };
    await saveMemeRecord(record);
    await refreshSavedMemeGallery();
    setSavedMemeGalleryStatus("Мем сохранён локально. В галерее не более "+MAX_SAVED_MEMES+" изображений — старые заменяются новыми.");
    showToast("Мем добавлен в личную галерею");
  }catch(error){
    setSavedMemeGalleryStatus("Не удалось сохранить мем. Проверь свободное место и разрешения браузера.");
    showToast("Ошибка сохранения в галерею");
  }finally{
    saveMemeToGalleryButton.disabled=false;
    saveMemeToGalleryButton.textContent="Сохранить в галерею ☆";
  }
});
if(refreshSavedMemesButton)refreshSavedMemesButton.addEventListener("click",refreshSavedMemeGallery);
if(savedMemeGalleryGrid)savedMemeGalleryGrid.addEventListener("click",async event=>{
  const button=event.target.closest("button[data-saved-meme-action]");
  if(!button)return;
  const id=Number(button.dataset.savedMemeId);
  if(!Number.isFinite(id))return;
  try{
    if(button.dataset.savedMemeAction==="delete"){
      const approved=window.confirm("Удалить этот мем из личной галереи?");
      if(!approved)return;
      await deleteSavedMemeRecord(id);
      await refreshSavedMemeGallery();
      setSavedMemeGalleryStatus("Мем удалён из локальной галереи.");
      showToast("Мем удалён");
      return;
    }
    if(button.dataset.savedMemeAction==="download"){
      const records=await getSavedMemeRecords();
      const record=records.find(item=>Number(item.id)===id);
      if(!record||!(record.blob instanceof Blob))throw new Error("Мем не найден");
      const url=URL.createObjectURL(record.blob);
      const link=document.createElement("a");
      link.href=url;link.download="cyber-cat-saved-meme-"+new Date(Number(record.createdAt)||Date.now()).toISOString().slice(0,10)+".png";
      document.body.appendChild(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1500);
      showToast("PNG скачан из галереи");
    }
  }catch(error){
    setSavedMemeGalleryStatus("Не удалось выполнить действие. Попробуй ещё раз.");
    showToast("Ошибка работы с галереей");
  }
});

/* Cyber Cat 2K25 v1.8 — local ZIP backup/restore for the saved meme gallery */
const exportSavedMemesZipButton=$("#export-saved-memes-zip");
const importSavedMemesZipInput=$("#import-saved-memes-zip");
const MAX_GALLERY_ZIP_SIZE=MAX_SAVED_MEMES*MAX_SAVED_MEME_SIZE+1024*1024;
const ZIP_CRC_TABLE=(()=>{
  const table=new Uint32Array(256);
  for(let n=0;n<256;n++){
    let value=n;
    for(let bit=0;bit<8;bit++)value=(value&1)?(0xedb88320^(value>>>1)):(value>>>1);
    table[n]=value>>>0;
  }
  return table;
})();
function zipCRC32(bytes){
  let crc=0xffffffff;
  for(let i=0;i<bytes.length;i++)crc=ZIP_CRC_TABLE[(crc^bytes[i])&0xff]^(crc>>>8);
  return (crc^0xffffffff)>>>0;
}
function zipDosTimestamp(timestamp){
  const date=new Date(Number(timestamp)||Date.now());
  const year=Math.min(2107,Math.max(1980,date.getFullYear()));
  return {
    time:(date.getHours()<<11)|(date.getMinutes()<<5)|Math.floor(date.getSeconds()/2),
    date:((year-1980)<<9)|((date.getMonth()+1)<<5)|date.getDate()
  };
}
function createZipLocalHeader(nameBytes,size,crc,timestamp){
  const header=new Uint8Array(30+nameBytes.length);
  const view=new DataView(header.buffer);
  const stamp=zipDosTimestamp(timestamp);
  view.setUint32(0,0x04034b50,true);
  view.setUint16(4,20,true);
  view.setUint16(6,0x0800,true);
  view.setUint16(8,0,true);
  view.setUint16(10,stamp.time,true);
  view.setUint16(12,stamp.date,true);
  view.setUint32(14,crc,true);
  view.setUint32(18,size,true);
  view.setUint32(22,size,true);
  view.setUint16(26,nameBytes.length,true);
  view.setUint16(28,0,true);
  header.set(nameBytes,30);
  return header;
}
function createZipCentralHeader(nameBytes,size,crc,timestamp,localOffset){
  const header=new Uint8Array(46+nameBytes.length);
  const view=new DataView(header.buffer);
  const stamp=zipDosTimestamp(timestamp);
  view.setUint32(0,0x02014b50,true);
  view.setUint16(4,20,true);
  view.setUint16(6,20,true);
  view.setUint16(8,0x0800,true);
  view.setUint16(10,0,true);
  view.setUint16(12,stamp.time,true);
  view.setUint16(14,stamp.date,true);
  view.setUint32(16,crc,true);
  view.setUint32(20,size,true);
  view.setUint32(24,size,true);
  view.setUint16(28,nameBytes.length,true);
  view.setUint16(30,0,true);
  view.setUint16(32,0,true);
  view.setUint16(34,0,true);
  view.setUint16(36,0,true);
  view.setUint32(38,0,true);
  view.setUint32(42,localOffset,true);
  header.set(nameBytes,46);
  return header;
}
async function createSavedMemeGalleryZip(records){
  const encoder=new TextEncoder();
  const sorted=records.filter(record=>record&&record.blob instanceof Blob).sort((a,b)=>(Number(a.createdAt)||0)-(Number(b.createdAt)||0)).slice(-MAX_SAVED_MEMES);
  const manifest={
    format:"cyber-cat-2k25-gallery",
    version:1,
    exportedAt:Date.now(),
    memes:sorted.map((record,index)=>({
      file:"memes/meme-"+String(index+1).padStart(3,"0")+".png",
      createdAt:Number(record.createdAt)||Date.now(),
      topText:String(record.topText||"").slice(0,100),
      bottomText:String(record.bottomText||"").slice(0,140),
      theme:String(record.theme||"cyber").slice(0,40),
      size:record.blob.size
    }))
  };
  const files=[{name:"manifest.json",blob:new Blob([JSON.stringify(manifest,null,2)],{type:"application/json"}),timestamp:Date.now()}];
  for(let index=0;index<sorted.length;index++){
    files.push({
      name:"memes/meme-"+String(index+1).padStart(3,"0")+".png",
      blob:sorted[index].blob,
      timestamp:Number(sorted[index].createdAt)||Date.now()
    });
  }
  const localChunks=[];
  const centralChunks=[];
  const decoder=new TextEncoder();
  let localOffset=0;
  for(const file of files){
    const nameBytes=decoder.encode(file.name);
    const bytes=new Uint8Array(await file.blob.arrayBuffer());
    const crc=zipCRC32(bytes);
    const localHeader=createZipLocalHeader(nameBytes,bytes.length,crc,file.timestamp);
    const centralHeader=createZipCentralHeader(nameBytes,bytes.length,crc,file.timestamp,localOffset);
    localChunks.push(localHeader,bytes);
    centralChunks.push(centralHeader);
    localOffset+=localHeader.length+bytes.length;
  }
  const centralOffset=localOffset;
  const centralSize=centralChunks.reduce((sum,chunk)=>sum+chunk.length,0);
  const end=new Uint8Array(22);
  const endView=new DataView(end.buffer);
  endView.setUint32(0,0x06054b50,true);
  endView.setUint16(4,0,true);
  endView.setUint16(6,0,true);
  endView.setUint16(8,files.length,true);
  endView.setUint16(10,files.length,true);
  endView.setUint32(12,centralSize,true);
  endView.setUint32(16,centralOffset,true);
  endView.setUint16(20,0,true);
  const archive=new Blob([...localChunks,...centralChunks,end],{type:"application/zip"});
  if(archive.size>MAX_GALLERY_ZIP_SIZE)throw new Error("Резервная копия превышает допустимый размер");
  return archive;
}
async function readSavedMemeGalleryZip(file){
  if(!(file instanceof Blob))throw new Error("Выбери ZIP-файл с резервной копией");
  if(file.size<22||file.size>MAX_GALLERY_ZIP_SIZE)throw new Error("Размер ZIP не подходит для галереи");
  if(file instanceof File&&!file.name.toLowerCase().endsWith(".zip")&&!["application/zip","application/x-zip-compressed"].includes(file.type))throw new Error("Выбранный файл не похож на ZIP-архив");
  const tailStart=Math.max(0,file.size-65557);
  const tail=new Uint8Array(await file.slice(tailStart).arrayBuffer());
  let endIndex=-1;
  for(let i=tail.length-22;i>=0;i--){
    if(new DataView(tail.buffer,tail.byteOffset+i,4).getUint32(0,true)===0x06054b50){
      const candidate=new DataView(tail.buffer,tail.byteOffset+i,tail.length-i);
      if(i+22+candidate.getUint16(20,true)===tail.length){endIndex=i;break;}
    }
  }
  if(endIndex<0)throw new Error("Не найден конец ZIP-архива");
  const endView=new DataView(tail.buffer,tail.byteOffset+endIndex,tail.length-endIndex);
  const disk=endView.getUint16(4,true);
  const centralDisk=endView.getUint16(6,true);
  const diskEntries=endView.getUint16(8,true);
  const entryCount=endView.getUint16(10,true);
  const centralSize=endView.getUint32(12,true);
  const centralOffset=endView.getUint32(16,true);
  const absoluteEnd=tailStart+endIndex;
  if(disk!==0||centralDisk!==0||diskEntries!==entryCount||entryCount>MAX_SAVED_MEMES+1||entryCount===0xffff)throw new Error("Архив использует неподдерживаемую структуру ZIP");
  if(centralOffset+centralSize!==absoluteEnd||centralSize>1024*1024)throw new Error("Структура ZIP повреждена или не поддерживается");
  const directory=new Uint8Array(await file.slice(centralOffset,centralOffset+centralSize).arrayBuffer());
  const directoryEntries=[];
  const seenNames=new Set();
  let position=0;
  const decoder=new TextDecoder("utf-8",{fatal:true});
  for(let i=0;i<entryCount;i++){
    if(position+46>directory.length)throw new Error("Список файлов в ZIP повреждён");
    const view=new DataView(directory.buffer,directory.byteOffset+position,directory.length-position);
    if(view.getUint32(0,true)!==0x02014b50)throw new Error("Не удалось прочитать запись ZIP");
    const flags=view.getUint16(8,true);
    const method=view.getUint16(10,true);
    const crc=view.getUint32(16,true);
    const compressedSize=view.getUint32(20,true);
    const uncompressedSize=view.getUint32(24,true);
    const nameLength=view.getUint16(28,true);
    const extraLength=view.getUint16(30,true);
    const commentLength=view.getUint16(32,true);
    const startDisk=view.getUint16(34,true);
    const localOffset=view.getUint32(42,true);
    const recordLength=46+nameLength+extraLength+commentLength;
    if(position+recordLength>directory.length)throw new Error("Запись ZIP выходит за границы списка файлов");
    if((flags&1)!==0||method!==0||compressedSize!==uncompressedSize||startDisk!==0)throw new Error("Поддерживаются только обычные ZIP-резервные копии Cyber Cat без сжатия");
    const name=decoder.decode(directory.subarray(position+46,position+46+nameLength));
    if(name!=="manifest.json"&&!/^memes\\/meme-\\d{3}\\.png$/.test(name))throw new Error("В ZIP найден неизвестный файл: "+name);
    if(seenNames.has(name))throw new Error("В ZIP повторяется имя файла");
    if(name==="manifest.json"&&uncompressedSize>256*1024)throw new Error("Манифест ZIP слишком большой");
    if(name!=="manifest.json"&&uncompressedSize>MAX_SAVED_MEME_SIZE)throw new Error("Одна из картинок превышает 12 МБ");
    directoryEntries.push({name,flags,method,crc,size:uncompressedSize,localOffset});
    seenNames.add(name);
    position+=recordLength;
  }
  if(position!==directory.length||!seenNames.has("manifest.json"))throw new Error("ZIP не содержит корректный манифест");
  const archiveFiles=new Map();
  for(const entry of directoryEntries){
    if(entry.localOffset+30>centralOffset)throw new Error("Локальная запись ZIP повреждена");
    const localHeader=new Uint8Array(await file.slice(entry.localOffset,entry.localOffset+30).arrayBuffer());
    const localView=new DataView(localHeader.buffer,localHeader.byteOffset,localHeader.byteLength);
    if(localView.getUint32(0,true)!==0x04034b50||localView.getUint16(6,true)!==entry.flags||localView.getUint16(8,true)!==entry.method)throw new Error("Локальная запись ZIP не совпадает с каталогом");
    const localNameLength=localView.getUint16(26,true);
    const localExtraLength=localView.getUint16(28,true);
    const localName=decoder.decode(new Uint8Array(await file.slice(entry.localOffset+30,entry.localOffset+30+localNameLength).arrayBuffer()));
    if(localName!==entry.name)throw new Error("Имя файла в ZIP не совпадает с каталогом");
    const payloadStart=entry.localOffset+30+localNameLength+localExtraLength;
    const payloadEnd=payloadStart+entry.size;
    if(payloadEnd>centralOffset||payloadEnd>file.size)throw new Error("Данные файла выходят за границы архива");
    const mime=entry.name==="manifest.json"?"application/json":"image/png";
    const payload=file.slice(payloadStart,payloadEnd,mime);
    const bytes=new Uint8Array(await payload.arrayBuffer());
    if(zipCRC32(bytes)!==entry.crc)throw new Error("Контрольная сумма не совпадает: "+entry.name);
    if(entry.name!=="manifest.json"){
      const pngSignature=[137,80,78,71,13,10,26,10];
      if(bytes.length<8||!pngSignature.every((value,index)=>bytes[index]===value))throw new Error("Файл не является корректным PNG: "+entry.name);
    }
    archiveFiles.set(entry.name,payload);
  }
  let manifest;
  try{manifest=JSON.parse(await archiveFiles.get("manifest.json").text())}catch(error){throw new Error("Манифест резервной копии не читается")}
  if(!manifest||manifest.format!=="cyber-cat-2k25-gallery"||manifest.version!==1||!Array.isArray(manifest.memes)||manifest.memes.length>MAX_SAVED_MEMES)throw new Error("Формат резервной копии не поддерживается");
  if(manifest.memes.length+1!==archiveFiles.size)throw new Error("Количество картинок не совпадает с манифестом");
  const referenced=new Set(["manifest.json"]);
  const restored=[];
  for(const meta of manifest.memes){
    if(!meta||typeof meta.file!=="string"||!/^memes\\/meme-\\d{3}\\.png$/.test(meta.file)||referenced.has(meta.file))throw new Error("Манифест содержит некорректное имя картинки");
    const blob=archiveFiles.get(meta.file);
    if(!blob||blob.size>MAX_SAVED_MEME_SIZE||Number(meta.size)!==blob.size)throw new Error("Картинка отсутствует или имеет неверный размер: "+meta.file);
    if(!Number.isFinite(Number(meta.createdAt))||typeof meta.topText!=="string"||meta.topText.length>100||typeof meta.bottomText!=="string"||meta.bottomText.length>140||typeof meta.theme!=="string"||meta.theme.length>40)throw new Error("Манифест содержит некорректные данные мем-картинки");
    referenced.add(meta.file);
    restored.push({
      createdAt:Number(meta.createdAt),
      topText:meta.topText,
      bottomText:meta.bottomText,
      theme:meta.theme,
      blob
    });
  }
  if(referenced.size!==archiveFiles.size)throw new Error("ZIP содержит картинки, которых нет в манифесте");
  return restored;
}
async function replaceSavedMemeGalleryRecords(records){
  if(!Array.isArray(records)||records.length>MAX_SAVED_MEMES)throw new Error("В резервной копии слишком много картинок");
  const db=await openSavedMemeDatabase();
  return new Promise((resolve,reject)=>{
    const transaction=db.transaction(SAVED_MEMES_STORE,"readwrite");
    const store=transaction.objectStore(SAVED_MEMES_STORE);
    store.clear();
    records.forEach(record=>{
      store.add({
        createdAt:Number(record.createdAt)||Date.now(),
        topText:String(record.topText||"").slice(0,100),
        bottomText:String(record.bottomText||"").slice(0,140),
        theme:String(record.theme||"cyber").slice(0,40),
        blob:record.blob
      });
    });
    transaction.oncomplete=()=>resolve(true);
    transaction.onerror=()=>reject(transaction.error||new Error("Не удалось восстановить галерею"));
    transaction.onabort=()=>reject(transaction.error||new Error("Восстановление галереи отменено"));
  });
}
if(exportSavedMemesZipButton)exportSavedMemesZipButton.addEventListener("click",async()=>{
  exportSavedMemesZipButton.disabled=true;
  const originalText=exportSavedMemesZipButton.textContent;
  exportSavedMemesZipButton.textContent="Создаю ZIP…";
  setSavedMemeGalleryStatus("Готовлю ZIP-резервную копию локальной галереи…");
  try{
    const records=await getSavedMemeRecords();
    const archive=await createSavedMemeGalleryZip(records);
    const url=URL.createObjectURL(archive);
    const link=document.createElement("a");
    link.href=url;
    link.download="cyber-cat-gallery-"+new Date().toISOString().slice(0,10)+".zip";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),3000);
    setSavedMemeGalleryStatus("ZIP создан: "+records.filter(record=>record&&record.blob instanceof Blob).length+" мемов. Сохрани файл на своём устройстве.");
    showToast("Резервная копия галереи скачана");
  }catch(error){
    setSavedMemeGalleryStatus("Не удалось создать ZIP: "+(error?.message||"ошибка резервного копирования"));
    showToast("Ошибка экспорта галереи");
  }finally{
    exportSavedMemesZipButton.disabled=false;
    exportSavedMemesZipButton.textContent=originalText;
  }
});
if(importSavedMemesZipInput)importSavedMemesZipInput.addEventListener("change",async event=>{
  const input=event.currentTarget;
  const file=input.files&&input.files[0];
  if(!file)return;
  setSavedMemeGalleryStatus("Проверяю ZIP-архив и контрольные суммы…");
  try{
    const records=await readSavedMemeGalleryZip(file);
    const existing=await getSavedMemeRecords();
    const approved=window.confirm(
      "Восстановить "+records.length+" мем(ов) из ZIP?\\n\\nТекущая галерея"+(existing.length?" ("+existing.length+" мемов)":"")+" будет заменена. Отмена ничего не изменит."
    );
    if(!approved){
      setSavedMemeGalleryStatus("Импорт отменён. Текущая галерея не изменилась.");
      return;
    }
    await replaceSavedMemeGalleryRecords(records);
    await refreshSavedMemeGallery();
    setSavedMemeGalleryStatus("Галерея восстановлена из ZIP: "+records.length+" мем(ов). Картинки сохранены только в этом браузере.");
    showToast("Галерея восстановлена из ZIP");
  }catch(error){
    setSavedMemeGalleryStatus("Не удалось импортировать ZIP: "+(error?.message||"файл повреждён или несовместим"));
    showToast("Ошибка импорта резервной копии");
  }finally{
    input.value="";
  }
});

if(savedMemeGallery)refreshSavedMemeGallery();

const year=$("#year");if(year)year.textContent=String(new Date().getFullYear());setMotion(motionEnabled);
})();