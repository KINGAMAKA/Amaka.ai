const $ = id => document.getElementById(id);
const messages = $("messages");
const memoryKey = "amaka_memories_v1";
const settingsKey = "amaka_settings_v1";
let memories = JSON.parse(localStorage.getItem(memoryKey) || "[]");
let settings = JSON.parse(localStorage.getItem(settingsKey) || '{"autoSpeak":true,"concise":true,"voiceURI":"","rate":1}');
let recognition = null;
let voices = [];

function addMessage(text, who="assistant", speak=false) {
  const article=document.createElement("article"); article.className="message "+who;
  if(who==="assistant"){const av=document.createElement("div");av.className="avatar";av.textContent="A";article.appendChild(av);}
  const bubble=document.createElement("div");bubble.className="bubble";
  if(who==="assistant"){const label=document.createElement("span");label.className="speaker";label.textContent="AMAKA";bubble.appendChild(label);}
  const p=document.createElement("p");p.textContent=text;bubble.appendChild(p);article.appendChild(bubble);
  messages.appendChild(article);messages.scrollTop=messages.scrollHeight;
  if(speak && settings.autoSpeak) speakText(text);
}
function speakText(text){
  if(!("speechSynthesis" in window)){ $("micHint").textContent="Speech output is not supported by this browser.";return; }
  window.speechSynthesis.cancel();
  const utter=new SpeechSynthesisUtterance(text);
  const voice=voices.find(v=>v.voiceURI===settings.voiceURI);
  if(voice) utter.voice=voice;
  utter.rate=Number(settings.rate||1);utter.pitch=0.88;
  window.speechSynthesis.speak(utter);
}
function saveMemories(){localStorage.setItem(memoryKey,JSON.stringify(memories));renderMemories();}
function renderMemories(){
  const list=$("memoryList");list.innerHTML="";
  if(!memories.length){list.textContent="No memories saved yet.";return;}
  memories.forEach((m,i)=>{const item=document.createElement("div");item.className="memory-item";item.textContent=m.text+" ";
    const del=document.createElement("button");del.textContent="DELETE";del.onclick=()=>{memories.splice(i,1);saveMemories();};item.appendChild(del);list.appendChild(item);});
}
function reply(input){
  const q=input.trim(), s=q.toLowerCase();
  if(!q)return "I'm listening.";
  if(/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(s)) return "Hello. Good to hear from you. What would you like to work on?";
  if(s.includes("what can you do")||s.includes("help")) return "In this prototype I can tell you the time and date, calculate simple sums, save and recall notes, and help you organise a basic plan. My full cloud intelligence is not connected yet.";
  if(s.includes("time")) return "The time on your device is "+new Date().toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})+".";
  if(s.includes("date")||s.includes("today")) return "Today is "+new Date().toLocaleDateString(undefined,{weekday:"long",year:"numeric",month:"long",day:"numeric"})+".";
  if(s.startsWith("remember ")||s.startsWith("save a memory ")||s.startsWith("note ")){
    let value=q.replace(/^(remember|save a memory|note)\s*/i,"").replace(/^that\s+/i,"").trim();
    if(!value)return "Tell me what you want me to remember.";
    memories.unshift({text:value,created:Date.now()});saveMemories();return "I've saved that on this device: "+value;
  }
  if(s.includes("show my notes")||s.includes("what do you remember")||s.includes("my memories")){
    return memories.length ? "Here is what I have saved:\n"+memories.map((m,i)=>(i+1)+". "+m.text).join("\n") : "I don't have any saved memories yet. Open the Memory tab to add one.";
  }
  if(s.startsWith("calculate ")||s.startsWith("what is ")||s.startsWith("compute ")){
    const expr=q.replace(/^(calculate|what is|compute)\s*/i,"").replace(/[×]/g,"*").replace(/[÷]/g,"/");
    if(/^[\d\s.+\-*/()%]+$/.test(expr)){try{const result=Function('"use strict";return ('+expr+')')();if(Number.isFinite(result))return "The answer is "+result+"."; }catch(e){}}
  }
  if(s.includes("plan my day")||s.includes("organise my day")||s.includes("organize my day")) return "Let's make a simple plan. First, tell me the three most important things you need to accomplish today. I'll help you put them in order.";
  if(s.includes("amaka ai")||s.includes("who are you")) return "I am AMAKA AI, your adaptive personal assistant. This is version 0.1, so I currently use local commands and device storage rather than a connected large language model.";
  return "I understand you're asking about: \""+q+"\". My local prototype brain doesn't understand open-ended questions yet. The next development stage will connect me to a cloud AI model so I can reason and converse properly.";
}
function send(text){
  const value=(text??$("prompt").value).trim();if(!value)return;
  addMessage(value,"user");$("prompt").value="";
  const answer=reply(value);setTimeout(()=>addMessage(answer,"assistant",true),220);
}
$("sendBtn").addEventListener("click",()=>send());
$("prompt").addEventListener("keydown",e=>{if(e.key==="Enter")send();});
document.querySelectorAll(".quick-actions button").forEach(b=>b.addEventListener("click",()=>send(b.dataset.prompt)));

function startListening(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){$("micHint").textContent="Speech recognition isn't available here. Try opening this installed app in Chrome, with internet access, or type your message.";return;}
  if(recognition){try{recognition.stop();}catch(e){}}
  recognition=new SR();recognition.lang="en-ZM";recognition.interimResults=false;recognition.maxAlternatives=1;
  $("micBtn").classList.add("listening");$("micHint").textContent="Listening… speak now.";
  recognition.onresult=e=>{const said=e.results[0][0].transcript;$("prompt").value=said;send(said);};
  recognition.onerror=e=>{$("micHint").textContent="Microphone issue: "+e.error+". You can type instead.";};
  recognition.onend=()=>{$("micBtn").classList.remove("listening");if($("micHint").textContent==="Listening… speak now.")$("micHint").textContent="Tap the microphone to speak."};
  try{recognition.start();}catch(e){$("micHint").textContent="Couldn't start the microphone. Check browser permission."; $("micBtn").classList.remove("listening");}
}
$("micBtn").addEventListener("click",startListening);

function loadVoices(){
  if(!("speechSynthesis" in window))return;
  voices=window.speechSynthesis.getVoices();
  const select=$("voiceSelect");select.innerHTML='<option value="">System default</option>';
  voices.forEach(v=>{const o=document.createElement("option");o.value=v.voiceURI;o.textContent=v.name+" ("+v.lang+")";select.appendChild(o);});
  select.value=settings.voiceURI||"";
}
if("speechSynthesis" in window){loadVoices();window.speechSynthesis.onvoiceschanged=loadVoices;}
$("voiceSelect").addEventListener("change",e=>{settings.voiceURI=e.target.value;saveSettings();});
$("rate").value=settings.rate||1;$("rateValue").textContent=Number(settings.rate||1).toFixed(1)+"×";
$("rate").addEventListener("input",e=>{$("rateValue").textContent=Number(e.target.value).toFixed(1)+"×";settings.rate=e.target.value;saveSettings();});
$("autoSpeak").checked=settings.autoSpeak!==false;$("autoSpeak").addEventListener("change",e=>{settings.autoSpeak=e.target.checked;saveSettings();});
$("concise").checked=settings.concise!==false;$("concise").addEventListener("change",e=>{settings.concise=e.target.checked;saveSettings();});
function saveSettings(){localStorage.setItem(settingsKey,JSON.stringify(settings));}

$("saveMemory").addEventListener("click",()=>{const t=$("memoryInput").value.trim();if(!t)return;memories.unshift({text:t,created:Date.now()});$("memoryInput").value="";saveMemories();});
$("clearData").addEventListener("click",()=>{if(confirm("Delete all AMAKA AI memories and settings stored in this browser?")){localStorage.removeItem(memoryKey);localStorage.removeItem(settingsKey);memories=[];settings={autoSpeak:true,concise:true,voiceURI:"",rate:1};saveMemories();saveSettings();location.reload();}});
renderMemories();

function showView(name){
  $("memoryView").classList.toggle("hidden",name!=="memory");
  $("settingsView").classList.toggle("hidden",name!=="settings");
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));
  if(name==="memory")renderMemories();
}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.tab)));
document.querySelectorAll(".backBtn").forEach(b=>b.addEventListener("click",()=>showView("chat")));

if("serviceWorker" in navigator && location.protocol.startsWith("http")){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}
