import { useState, useEffect } from "react";

// ── Theme System ──────────────────────────────────────────────────────────────
const FONTS = [
  { id:"georgia",   label:"Georgia",    style:"Georgia, serif" },
  { id:"helvetica", label:"Helvetica",  style:"'Helvetica Neue', Arial, sans-serif" },
  { id:"garamond",  label:"Garamond",   style:"Garamond, 'Times New Roman', serif" },
  { id:"mono",      label:"Mono",       style:"'Courier New', monospace" },
  { id:"trebuchet", label:"Rounded",    style:"'Trebuchet MS', sans-serif" },
];

const THEME_PRESETS = [
  { id:"dark",   label:"🌙 다크",      bg:"#0f0f17", calBg:"#13131f", headerBg:"#1a1a2e", text:"#e8e6f0", sub:"#a0a0c0", border:"#2a2a4a", cell:"#1e1e30", accent:"#667eea" },
  { id:"light",  label:"☀️ 라이트",   bg:"#f0f2fa", calBg:"#ffffff", headerBg:"#ffffff", text:"#1a1a2e", sub:"#5a6a8a", border:"#dde1f0", cell:"#e8ecf4", accent:"#667eea" },
  { id:"cream",  label:"🍦 크림",      bg:"#faf8f2", calBg:"#fffef9", headerBg:"#f5f0e0", text:"#2c2416", sub:"#7a6a4a", border:"#e0d8c0", cell:"#ede8d8", accent:"#c8a84b" },
  { id:"forest", label:"🌿 포레스트",  bg:"#0d1f0f", calBg:"#122015", headerBg:"#0a1a0c", text:"#d4ecd6", sub:"#7aaa7c", border:"#1e3a20", cell:"#1a2e1c", accent:"#4caf6a" },
  { id:"rose",   label:"🌸 로즈",      bg:"#1f0d14", calBg:"#2a1520", headerBg:"#1a0a10", text:"#f0d4dc", sub:"#c07a8a", border:"#3a1a25", cell:"#2e1520", accent:"#e06080" },
  { id:"ocean",  label:"🌊 오션",      bg:"#070e1a", calBg:"#0d1830", headerBg:"#060c18", text:"#c8dff5", sub:"#6a9ac0", border:"#1a2a4a", cell:"#121e36", accent:"#4a9de0" },
];

const DEFAULT_THEME = { preset:"dark", bg:"#0f0f17", calBg:"#13131f", headerBg:"#1a1a2e", text:"#e8e6f0", sub:"#a0a0c0", border:"#2a2a4a", cell:"#1e1e30", accent:"#667eea", font:"georgia" };

const DEFAULT_CATEGORIES = {
  music:      { bg:"#f0e6ff", border:"#9b59b6", dot:"#9b59b6", emoji:"🎵", label:"음악/오디션" },
  math:       { bg:"#e6f3ff", border:"#2980b9", dot:"#2980b9", emoji:"📐", label:"수학" },
  writing:    { bg:"#e6fff3", border:"#27ae60", dot:"#27ae60", emoji:"✍️", label:"라이팅" },
  leadership: { bg:"#fff6e6", border:"#e67e22", dot:"#e67e22", emoji:"🌟", label:"리더십/봉사" },
  general:    { bg:"#f0f0f0", border:"#7f8c8d", dot:"#7f8c8d", emoji:"📌", label:"기타" },
};
const PALETTE = ["#e74c3c","#e67e22","#f1c40f","#27ae60","#1abc9c","#2980b9","#9b59b6","#e91e8c","#7f8c8d","#34495e"];
const EMOJIS  = ["🎵","📐","✍️","🌟","📌","🏆","🔬","🎨","💻","📚","🎭","🏅","🌍","🎤","🧬","⚽","🎸","🏛️","🔭","💡"];
const BASE_EVENTS = [
  { month:10, day:1,  title:"AMC 8 등록 시작",            category:"math",       desc:"AMC 8 시험 등록 오픈" },
  { month:11, day:6,  title:"AMC 8 시험",                  category:"math",       desc:"AMC 8 (중학생 대상)" },
  { month:11, day:1,  title:"AMC 10/12 A 시험",            category:"math",       desc:"AMC 10A / 12A" },
  { month:11, day:13, title:"AMC 10/12 B 시험",            category:"math",       desc:"AMC 10B / 12B" },
  { month:2,  day:1,  title:"AIME 시험",                   category:"math",       desc:"AMC 통과자 대상 AIME" },
  { month:3,  day:15, title:"MATHCOUNTS State",            category:"math",       desc:"MATHCOUNTS 주 대회" },
  { month:5,  day:10, title:"USAMO",                       category:"math",       desc:"USA Mathematical Olympiad" },
  { month:9,  day:15, title:"All-State 오디션 등록",       category:"music",      desc:"주 오케스트라/밴드 오디션 등록" },
  { month:10, day:20, title:"NYSSMA 등록 마감",            category:"music",      desc:"NYSSMA 오디션 등록 마감" },
  { month:11, day:1,  title:"All-State 오디션",            category:"music",      desc:"All-State 오디션 시즌" },
  { month:1,  day:15, title:"Youth Symphony 오디션",       category:"music",      desc:"지역 청소년 오케스트라 오디션" },
  { month:3,  day:1,  title:"Summer Music Camp 지원",      category:"music",      desc:"Interlochen, Tanglewood 등" },
  { month:4,  day:30, title:"Interlochen 마감",            category:"music",      desc:"Interlochen Arts Camp 지원 마감" },
  { month:9,  day:1,  title:"Scholastic Writing 시작",     category:"writing",    desc:"Scholastic Awards 제출 시작" },
  { month:12, day:15, title:"Scholastic Writing 마감",     category:"writing",    desc:"Scholastic Art & Writing Awards" },
  { month:10, day:1,  title:"NaNoWriMo 준비",              category:"writing",    desc:"National Novel Writing Month 준비" },
  { month:2,  day:1,  title:"YoungArts 지원",              category:"writing",    desc:"YoungArts Foundation 지원" },
  { month:3,  day:1,  title:"Concord Review 제출",         category:"writing",    desc:"역사 에세이 제출" },
  { month:9,  day:1,  title:"NHS 지원 시즌",               category:"leadership", desc:"National Honor Society 지원" },
  { month:10, day:15, title:"Boys/Girls State 등록",       category:"leadership", desc:"Boys/Girls State 프로그램" },
  { month:1,  day:15, title:"Presidential Volunteer Award",category:"leadership", desc:"봉사 시간 제출 마감" },
  { month:3,  day:1,  title:"Senate Youth Program 마감",   category:"leadership", desc:"US Senate Youth Program" },
  { month:6,  day:1,  title:"Summer Leadership Camp",      category:"leadership", desc:"리더십 여름 캠프 시즌 시작" },
  { month:8,  day:1,  title:"Common App 오픈",             category:"general",    desc:"Common Application 새 시즌 오픈" },
  { month:10, day:15, title:"Early Decision 마감",         category:"general",    desc:"ED/EA 지원 마감 (대부분 학교)" },
  { month:11, day:1,  title:"Early Action 마감",           category:"general",    desc:"EA 지원 마감" },
  { month:1,  day:1,  title:"Regular Decision 마감",       category:"general",    desc:"대부분 대학 RD 지원 마감" },
  { month:3,  day:31, title:"입학 결과 발표",              category:"general",    desc:"대부분 대학 RD 결과 발표" },
  { month:5,  day:1,  title:"입학 확정 마감",              category:"general",    desc:"Enrollment Deposit Deadline" },
];
const MONTHS       = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const DAYS_OF_WEEK = ["일","월","화","수","목","금","토"];

function getDaysInMonth(y,m){ return new Date(y,m,0).getDate(); }
function getFirstDayOfMonth(y,m){ return new Date(y,m-1,1).getDay(); }
function calcAge(bd){ if(!bd) return null; const t=new Date(),b=new Date(bd); let a=t.getFullYear()-b.getFullYear(); const m=t.getMonth()-b.getMonth(); if(m<0||(m===0&&t.getDate()<b.getDate())) a--; return a; }
function calcAgeOnDate(bd,target){ if(!bd) return null; const b=new Date(bd),t=new Date(target); let a=t.getFullYear()-b.getFullYear(); const m=t.getMonth()-b.getMonth(); if(m<0||(m===0&&t.getDate()<b.getDate())) a--; return a; }
function hexToRgb(hex){ const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return `${r},${g},${b}`; }
function colorToBg(hex){ return `rgba(${hexToRgb(hex)},0.15)`; }
async function storageSave(key,value){ try{ await window.storage.set(key,JSON.stringify(value)); }catch(e){} }
async function storageLoad(key){ try{ const r=await window.storage.get(key); return r?JSON.parse(r.value):null; }catch(e){ return null; } }

function SettingsModal({ theme, grade, birthdate, currentAge, onSaveTheme, onSaveGrade, onSaveBirthdate, onClose }) {
  const [t, setT] = useState(theme);
  const [gr, setGr] = useState(grade);
  const [bd, setBd] = useState(birthdate);
  const [tab, setTab] = useState("profile");
  function applyPreset(preset) { setT(prev => ({ ...prev, ...preset, font: prev.font, preset: preset.id })); }
  function save() { onSaveTheme(t); onSaveGrade(gr); onSaveBirthdate(bd); onClose(); }
  const age = calcAge(bd);
  const fontStyle = FONTS.find(f=>f.id===t.font)?.style || FONTS[0].style;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
      <div style={{ background: t.calBg, border:`1px solid ${t.border}`, borderRadius:18, width:400, maxHeight:"88vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(0,0,0,0.7)", fontFamily: fontStyle, color: t.text }}>
        <div style={{ background: t.headerBg, padding:"18px 22px", borderRadius:"18px 18px 0 0", borderBottom:`1px solid ${t.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ margin:0, fontSize:18, fontWeight:700 }}>⚙️ 설정</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:t.sub, fontSize:20, cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ display:"flex", borderBottom:`1px solid ${t.border}` }}>
          {[["profile","👤 프로필"],["theme","🎨 디자인"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{ flex:1, padding:"12px", background: tab===id ? t.bg : "transparent", border:"none", borderBottom: tab===id ? `2px solid ${t.accent}` : "2px solid transparent", color: tab===id ? t.text : t.sub, fontSize:13, fontWeight: tab===id?700:400, cursor:"pointer" }}>{label}</button>
          ))}
        </div>
        <div style={{ padding:"20px 22px" }}>
          {tab==="profile" && (
            <>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:"block", fontSize:12, color:t.sub, marginBottom:6 }}>학년</label>
                <select value={gr} onChange={e=>setGr(e.target.value)} style={{ width:"100%", padding:"10px 12px", background:t.bg, border:`1px solid ${t.border}`, borderRadius:8, color:t.text, fontSize:14, boxSizing:"border-box" }}>
                  <option value="">선택</option>
                  {["6","7","8","9","10","11","12"].map(g=><option key={g} value={g}>{g}학년 (Grade {g})</option>)}
                </select>
              </div>
              <div style={{ marginBottom:8 }}>
                <label style={{ display:"block", fontSize:12, color:t.sub, marginBottom:6 }}>생년월일</label>
                <input type="date" value={bd} onChange={e=>setBd(e.target.value)} max={new Date().toISOString().split("T")[0]} style={{ width:"100%", padding:"10px 12px", background:t.bg, border:`1px solid ${t.border}`, borderRadius:8, color:t.text, fontSize:14, boxSizing:"border-box" }}/>
                {bd && age!==null && <p style={{ margin:"6px 0 0", fontSize:12, color:t.accent }}>→ 현재 {age}세</p>}
              </div>
            </>
          )}
          {tab==="theme" && (
            <>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:12, color:t.sub, marginBottom:10, fontWeight:600 }}>테마 프리셋</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                  {THEME_PRESETS.map(p=>(
                    <button key={p.id} onClick={()=>applyPreset(p)} style={{ padding:"10px 6px", borderRadius:10, border: t.preset===p.id ? `2px solid ${t.accent}` : `1px solid ${t.border}`, background: p.bg, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                      <div style={{ width:"100%", height:20, borderRadius:5, background:p.calBg, border:`1px solid ${p.border}` }}/>
                      <span style={{ fontSize:11, color:p.text, fontWeight:600, whiteSpace:"nowrap" }}>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:12, color:t.sub, marginBottom:8, fontWeight:600 }}>배경색 커스텀</div>
                <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:t.bg, borderRadius:10, border:`1px solid ${t.border}` }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:t.bg, border:`2px solid ${t.border}` }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, color:t.sub, marginBottom:4 }}>배경색</div>
                    <input type="color" value={t.bg} onChange={e=>setT(prev=>({...prev,bg:e.target.value,preset:"custom"}))} style={{ width:"100%", height:28, padding:0, border:"none", borderRadius:6, cursor:"pointer", background:"transparent" }}/>
                  </div>
                  <div style={{ width:36, height:36, borderRadius:8, background:t.calBg, border:`2px solid ${t.border}` }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, color:t.sub, marginBottom:4 }}>달력 배경</div>
                    <input type="color" value={t.calBg} onChange={e=>setT(prev=>({...prev,calBg:e.target.value,preset:"custom"}))} style={{ width:"100%", height:28, padding:0, border:"none", borderRadius:6, cursor:"pointer", background:"transparent" }}/>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:12, color:t.sub, marginBottom:8, fontWeight:600 }}>포인트 색상</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {["#667eea","#e74c3c","#e67e22","#27ae60","#1abc9c","#2980b9","#9b59b6","#e91e8c","#f1c40f","#34495e"].map(c=>(
                    <button key={c} onClick={()=>setT(prev=>({...prev,accent:c,preset:"custom"}))} style={{ width:30, height:30, borderRadius:"50%", background:c, border: t.accent===c?"3px solid #fff":"2px solid transparent", cursor:"pointer" }}/>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:8 }}>
                <div style={{ fontSize:12, color:t.sub, marginBottom:8, fontWeight:600 }}>폰트</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {FONTS.map(f=>(
                    <button key={f.id} onClick={()=>setT(prev=>({...prev,font:f.id}))} style={{ padding:"10px 14px", borderRadius:8, border: t.font===f.id ? `2px solid ${t.accent}` : `1px solid ${t.border}`, background: t.font===f.id ? `rgba(${hexToRgb(t.accent)},0.12)` : t.bg, cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontFamily:f.style, fontSize:14, color:t.text }}>{f.label}</span>
                      <span style={{ fontFamily:f.style, fontSize:12, color:t.sub }}>ABC abc 123</span>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginTop:16, padding:"12px 14px", background:t.bg, borderRadius:10, border:`1px solid ${t.border}` }}>
                <div style={{ fontSize:11, color:t.sub, marginBottom:6 }}>미리보기</div>
                <div style={{ fontFamily: FONTS.find(f=>f.id===t.font)?.style, color:t.text, fontSize:14, fontWeight:700, marginBottom:3 }}>🎓 대입 준비 달력</div>
                <div style={{ fontFamily: FONTS.find(f=>f.id===t.font)?.style, color:t.sub, fontSize:12 }}>10학년 · 2010년 3월 15일 생</div>
              </div>
            </>
          )}
          <button onClick={save} style={{ width:"100%", marginTop:18, padding:"12px", background:`linear-gradient(135deg,${t.accent},${t.accent}cc)`, border:"none", borderRadius:10, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer" }}>저장하기</button>
        </div>
      </div>
    </div>
  );
}

function LinkImportModal({ categories, theme, onClose, onAdd }) {
  const t = theme;
  const [text,setText]=useState(""); const [loading,setLoading]=useState(false);
  const [results,setResults]=useState(null); const [error,setError]=useState("");
  const [added,setAdded]=useState(new Set());
  const catList=Object.entries(categories).map(([k,v])=>`"${k}":${v.emoji}${v.label}`).join(",");
  const fontStyle = FONTS.find(f=>f.id===t.font)?.style || FONTS[0].style;
  async function analyze(){
    const urls=text.split(/[\n,\s]+/).map(s=>s.trim()).filter(s=>s.startsWith("http"));
    if(!urls.length){setError("http로 시작하는 링크를 입력해주세요.");return;}
    setLoading(true);setError("");setResults(null);
    const prompt=`You are a competition/program research assistant for a high school student. Analyze these URLs and extract info. For each: name(Korean preferred), dates array [{label(Korean),month,day,year or null}], category key from [${catList}] or "general", desc(Korean ≤40chars). Today:${new Date().toLocaleDateString("en-US")}. Use upcoming year if unspecified. Use END date for ranges. URLs:\n${urls.map((u,i)=>`${i+1}. ${u}`).join("\n")}\nRespond ONLY valid JSON: {"competitions":[{"url":"","name":"","category":"","desc":"","dates":[{"label":"","month":1,"day":1,"year":null}]}]}`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const txt=(data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
      const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());
      setResults(parsed.competitions||[]);
    }catch(e){setError("분석 중 오류가 발생했어요.");}
    setLoading(false);
  }
  function addSingle(comp,d){ const key=`${comp.url}__${d.month}__${d.day}`; if(added.has(key)) return; onAdd([{title:`${comp.name} — ${d.label}`,category:comp.category||"general",desc:comp.desc||"",month:d.month,day:d.day,url:comp.url}]); setAdded(prev=>new Set([...prev,key])); }
  function addAll(){ const events=[]; (results||[]).forEach(c=>(c.dates||[]).forEach(d=>events.push({title:`${c.name} — ${d.label}`,category:c.category||"general",desc:c.desc||"",month:d.month,day:d.day,url:c.url}))); onAdd(events);onClose(); }
  const getCat=k=>categories[k]||{emoji:"📌",label:k,border:"#999",bg:"#f0f0f0"};
  const inp={width:"100%",padding:"8px 12px",background:t.bg,border:`1px solid ${t.border}`,borderRadius:8,color:t.text,fontSize:13,boxSizing:"border-box"};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300}}>
      <div style={{background:t.calBg,border:`1px solid ${t.border}`,borderRadius:16,padding:28,width:460,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.7)",fontFamily:fontStyle,color:t.text}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h3 style={{margin:0,fontSize:18,color:t.text}}>🔗 링크로 일정 자동 추가</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:t.sub,fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        {!results?(<>
          <p style={{margin:"0 0 12px",fontSize:13,color:t.sub,lineHeight:1.6}}>대회/캠프/오디션 링크를 한 줄에 하나씩 붙여넣으세요.<br/>AI가 날짜와 카테고리를 자동으로 분석해드려요.</p>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={"https://www.amc.org/...\nhttps://www.interlochen.org/..."} style={{width:"100%",height:130,padding:"10px 12px",background:t.bg,border:`1px solid ${t.border}`,borderRadius:10,color:t.text,fontSize:13,resize:"vertical",boxSizing:"border-box",fontFamily:"monospace",lineHeight:1.6}}/>
          {error&&<p style={{color:"#e74c3c",fontSize:12,margin:"8px 0 0"}}>{error}</p>}
          <div style={{display:"flex",gap:10,marginTop:14}}>
            <button onClick={onClose} style={{flex:1,padding:"10px",background:t.bg,border:`1px solid ${t.border}`,borderRadius:8,color:t.sub,cursor:"pointer"}}>취소</button>
            <button onClick={analyze} disabled={loading||!text.trim()} style={{flex:2,padding:"10px",background:loading||!text.trim()?t.bg:`linear-gradient(135deg,${t.accent},${t.accent}cc)`,border:"none",borderRadius:8,color:loading||!text.trim()?t.sub:"#fff",fontWeight:600,cursor:loading||!text.trim()?"default":"pointer",fontSize:14}}>{loading?"🤖 AI 분석 중...":"🔍 분석하기"}</button>
          </div>
          {loading&&<div style={{marginTop:14,padding:12,background:t.bg,borderRadius:10,fontSize:12,color:t.sub}}>각 사이트를 방문해 날짜와 정보를 수집하고 있어요...</div>}
        </>):(<>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <p style={{margin:0,fontSize:13,color:t.sub}}>{results.length}개 분석 완료</p>
            <button onClick={()=>setResults(null)} style={{background:"none",border:"none",color:t.accent,fontSize:12,cursor:"pointer"}}>← 다시 입력</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:18}}>
            {results.map((comp,ci)=>{ const cat=getCat(comp.category); return(
              <div key={ci} style={{background:t.bg,borderRadius:12,padding:14,border:`1.5px solid ${cat.border}`}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:10}}>
                  <div><div style={{fontSize:14,fontWeight:700,color:t.text,marginBottom:3}}>{cat.emoji} {comp.name}</div><div style={{fontSize:11,color:t.sub}}>{comp.desc}</div></div>
                  <span style={{padding:"3px 8px",borderRadius:10,background:cat.bg,color:"#1a1a2e",fontSize:11,fontWeight:600,whiteSpace:"nowrap",border:`1px solid ${cat.border}`}}>{cat.label}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {(comp.dates||[]).map((d,di)=>{ const key=`${comp.url}__${d.month}__${d.day}`;const isAdded=added.has(key); return(
                    <div key={di} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 10px",background:t.calBg,borderRadius:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:12,fontWeight:700,color:t.accent,minWidth:54}}>{d.month}월 {d.day}일</span>
                        <span style={{fontSize:12,color:t.text}}>{d.label}</span>
                        {d.year&&<span style={{fontSize:10,color:t.sub}}>{d.year}</span>}
                      </div>
                      <button onClick={()=>addSingle(comp,d)} style={{padding:"4px 12px",background:isAdded?"transparent":`linear-gradient(135deg,${t.accent},${t.accent}cc)`,border:isAdded?`1px solid #27ae60`:"none",borderRadius:6,color:isAdded?"#27ae60":"#fff",fontSize:11,fontWeight:600,cursor:isAdded?"default":"pointer",minWidth:60}}>{isAdded?"✓ 추가됨":"+ 추가"}</button>
                    </div>
                  ); })}
                </div>
              </div>
            ); })}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={onClose} style={{flex:1,padding:"10px",background:t.bg,border:`1px solid ${t.border}`,borderRadius:8,color:t.sub,cursor:"pointer"}}>닫기</button>
            <button onClick={addAll} style={{flex:2,padding:"10px",background:`linear-gradient(135deg,${t.accent},${t.accent}cc)`,border:"none",borderRadius:8,color:"#fff",fontWeight:600,cursor:"pointer"}}>📅 전체 달력에 추가</button>
          </div>
        </>)}
      </div>
    </div>
  );
}

function CategoryModal({ categories, theme, onClose, onSave }) {
  const t = theme;
  const fontStyle = FONTS.find(f=>f.id===t.font)?.style || FONTS[0].style;
  const [cats,setCats]=useState(()=>Object.entries(categories).map(([key,val])=>({key,...val})));
  const [newLabel,setNewLabel]=useState(""); const [newEmoji,setNewEmoji]=useState("🏆");
  const [newColor,setNewColor]=useState("#e74c3c"); const [editIdx,setEditIdx]=useState(null);
  function addCat(){ if(!newLabel.trim()) return; setCats(prev=>[...prev,{key:"cat_"+Date.now(),label:newLabel.trim(),emoji:newEmoji,border:newColor,dot:newColor,bg:colorToBg(newColor)}]); setNewLabel("");setNewColor("#e74c3c");setNewEmoji("🏆"); }
  function removeCat(idx){ setCats(prev=>prev.filter((_,i)=>i!==idx)); }
  function updateCat(idx,field,val){ setCats(prev=>prev.map((c,i)=>{ if(i!==idx) return c; const u={...c,[field]:val}; if(field==="border"){u.dot=val;u.bg=colorToBg(val);} return u; })); }
  function handleSave(){ const r={}; cats.forEach(c=>{r[c.key]={bg:c.bg,border:c.border,dot:c.dot,emoji:c.emoji,label:c.label};}); onSave(r); }
  const inp={width:"100%",padding:"7px 10px",background:t.bg,border:`1px solid ${t.border}`,borderRadius:7,color:t.text,fontSize:13,boxSizing:"border-box"};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>
      <div style={{background:t.calBg,border:`1px solid ${t.border}`,borderRadius:16,padding:28,width:380,maxHeight:"85vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.6)",fontFamily:fontStyle,color:t.text}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h3 style={{margin:0,fontSize:18}}>🗂️ 카테고리 관리</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:t.sub,fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {cats.map((cat,idx)=>(
            <div key={cat.key} style={{background:t.bg,borderRadius:10,padding:"10px 12px",border:`1.5px solid ${cat.border}`}}>
              {editIdx===idx?(<div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div><div style={{fontSize:11,color:t.sub,marginBottom:3}}>이름</div><input value={cat.label} onChange={e=>updateCat(idx,"label",e.target.value)} style={inp}/></div>
                <div><div style={{fontSize:11,color:t.sub,marginBottom:5}}>이모지</div><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{EMOJIS.map(em=><button key={em} onClick={()=>updateCat(idx,"emoji",em)} style={{width:30,height:30,borderRadius:6,border:cat.emoji===em?`2px solid ${cat.border}`:`1px solid ${t.border}`,background:cat.emoji===em?t.calBg:"transparent",cursor:"pointer",fontSize:15}}>{em}</button>)}</div></div>
                <div><div style={{fontSize:11,color:t.sub,marginBottom:5}}>색상</div><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{PALETTE.map(col=><button key={col} onClick={()=>updateCat(idx,"border",col)} style={{width:24,height:24,borderRadius:"50%",background:col,border:cat.border===col?"2px solid #fff":"2px solid transparent",cursor:"pointer"}}/>)}</div></div>
                <button onClick={()=>setEditIdx(null)} style={{padding:"6px 14px",background:t.accent,border:"none",borderRadius:7,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",alignSelf:"flex-end"}}>완료</button>
              </div>):(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{cat.emoji}</span><span style={{fontSize:14,fontWeight:600}}>{cat.label}</span></div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>setEditIdx(idx)} style={{padding:"4px 10px",background:t.calBg,border:`1px solid ${t.border}`,borderRadius:6,color:t.sub,fontSize:11,cursor:"pointer"}}>수정</button>
                  <button onClick={()=>removeCat(idx)} style={{padding:"4px 10px",background:"transparent",border:"1px solid #e74c3c",borderRadius:6,color:"#e74c3c",fontSize:11,cursor:"pointer"}}>삭제</button>
                </div>
              </div>)}
            </div>
          ))}
        </div>
        <div style={{background:t.bg,borderRadius:10,padding:14,border:`1px dashed ${t.border}`,marginBottom:20}}>
          <div style={{fontSize:12,color:t.sub,marginBottom:10,fontWeight:600}}>+ 새 카테고리 추가</div>
          <input value={newLabel} onChange={e=>setNewLabel(e.target.value)} placeholder="이름 (예: SAT/AP)" style={{...inp,marginBottom:10}}/>
          <div style={{fontSize:11,color:t.sub,marginBottom:5}}>이모지</div><div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>{EMOJIS.map(em=><button key={em} onClick={()=>setNewEmoji(em)} style={{width:28,height:28,borderRadius:6,border:newEmoji===em?`2px solid ${t.accent}`:`1px solid ${t.border}`,background:newEmoji===em?t.calBg:"transparent",cursor:"pointer",fontSize:14}}>{em}</button>)}</div>
          <div style={{fontSize:11,color:t.sub,marginBottom:5}}>색상</div><div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>{PALETTE.map(col=><button key={col} onClick={()=>setNewColor(col)} style={{width:22,height:22,borderRadius:"50%",background:col,border:newColor===col?"2px solid #fff":"2px solid transparent",cursor:"pointer"}}/>)}</div>
          <button onClick={addCat} disabled={!newLabel.trim()} style={{width:"100%",padding:"8px",background:newLabel.trim()?t.accent:t.bg,border:"none",borderRadius:7,color:newLabel.trim()?"#fff":t.sub,fontWeight:600,cursor:newLabel.trim()?"pointer":"default",fontSize:13}}>추가하기</button>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:"10px",background:t.bg,border:`1px solid ${t.border}`,borderRadius:8,color:t.sub,cursor:"pointer"}}>취소</button>
          <button onClick={handleSave} style={{flex:1,padding:"10px",background:t.accent,border:"none",borderRadius:8,color:"#fff",fontWeight:600,cursor:"pointer"}}>저장</button>
        </div>
      </div>
    </div>
  );
}

function VolunteerReportModal({ logs, grade, theme, onClose }) {
  const t = theme;
  const fontStyle = FONTS.find(f=>f.id===t.font)?.style || FONTS[0].style;
  const [previewFile,setPreviewFile]=useState(null);
  const byMonth=logs.reduce((acc,l)=>{ const key=l.date.slice(0,7); if(!acc[key]) acc[key]=[]; acc[key].push(l); return acc; },{});
  const byGradeYear=logs.reduce((acc,l)=>{ if(!l.date) return acc; const d=new Date(l.date); const sy=d.getMonth()>=8?d.getFullYear():d.getFullYear()-1; const key=`${sy}–${sy+1} 학년도`; if(!acc[key]) acc[key]=0; acc[key]+=(l.hours||0); return acc; },{});
  const total=logs.reduce((s,l)=>s+(l.hours||0),0);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400}}>
      <div style={{background:t.calBg,border:`1px solid ${t.border}`,borderRadius:16,width:540,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.8)",fontFamily:fontStyle,color:t.text}}>
        <div style={{background:t.headerBg,padding:"18px 22px",borderRadius:"16px 16px 0 0",borderBottom:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><h2 style={{margin:0,fontSize:17,color:t.text}}>🤝 봉사 활동 보고서</h2><p style={{margin:"4px 0 0",fontSize:11,color:t.sub}}>총 {total.toFixed(1)}시간 · {logs.length}건</p></div>
          <button onClick={onClose} style={{background:"none",border:"none",color:t.sub,fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:"18px 22px"}}>
          {Object.keys(byGradeYear).length>0&&(<div style={{marginBottom:18}}>
            <h3 style={{margin:"0 0 10px",fontSize:13,color:t.sub}}>📊 학년도별 합산</h3>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {Object.entries(byGradeYear).sort().map(([yr,hrs])=>(<div key={yr} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 14px",background:t.bg,borderRadius:8,border:`1px solid ${t.border}`}}><span style={{fontSize:13,fontWeight:600}}>{yr}</span><span style={{fontSize:14,fontWeight:700,color:"#27ae60"}}>{hrs.toFixed(1)}시간</span></div>))}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"rgba(39,174,96,0.12)",borderRadius:8,border:"1px solid #27ae60"}}><span style={{fontSize:13,color:"#27ae60",fontWeight:700}}>총 합계</span><span style={{fontSize:16,fontWeight:700,color:"#27ae60"}}>{total.toFixed(1)}시간</span></div>
            </div>
          </div>)}
          {Object.keys(byMonth).length===0?(<p style={{color:t.sub,fontSize:14,textAlign:"center",padding:"20px 0"}}>기록된 봉사 활동이 없어요.</p>):(
            Object.entries(byMonth).sort().map(([ym,entries])=>{ const [y,m]=ym.split("-"); const monthTotal=entries.reduce((s,l)=>s+(l.hours||0),0); return(
              <div key={ym} style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><h4 style={{margin:0,fontSize:13,color:t.accent}}>{y}년 {parseInt(m)}월</h4><span style={{fontSize:13,fontWeight:700}}>{monthTotal.toFixed(1)}시간</span></div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {entries.map((l,i)=>(<div key={i} style={{background:t.bg,borderRadius:10,padding:"10px 14px",border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
                      <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}><span style={{fontSize:11,color:t.sub}}>{l.date}</span><span style={{fontSize:13,fontWeight:700}}>{l.org}</span></div>{l.desc&&<div style={{fontSize:11,color:t.sub,marginBottom:4}}>{l.desc}</div>}{l.fileName&&<button onClick={()=>setPreviewFile(l)} style={{background:"none",border:`1px solid ${t.border}`,borderRadius:5,padding:"2px 8px",color:t.accent,fontSize:10,cursor:"pointer"}}>📎 {l.fileName}</button>}</div>
                      <span style={{fontSize:14,fontWeight:700,color:"#27ae60",whiteSpace:"nowrap"}}>{(l.hours||0).toFixed(1)}h</span>
                    </div>
                  </div>))}
                </div>
              </div>
            ); })
          )}
        </div>
      </div>
      {previewFile&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500}} onClick={()=>setPreviewFile(null)}>
        <div style={{maxWidth:"90vw",maxHeight:"90vh",display:"flex",flexDirection:"column",alignItems:"center",gap:12}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",alignItems:"center",gap:12}}><span style={{color:"#e8e6f0",fontSize:14}}>{previewFile.fileName}</span><button onClick={()=>setPreviewFile(null)} style={{background:"#2a2a4a",border:"none",color:"#e8e6f0",padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:12}}>닫기</button></div>
          {previewFile.fileData?(previewFile.fileData.startsWith("data:image")?<img src={previewFile.fileData} alt="증빙서류" style={{maxWidth:"85vw",maxHeight:"80vh",borderRadius:8,objectFit:"contain"}}/>:previewFile.fileData.startsWith("data:application/pdf")?<iframe src={previewFile.fileData} style={{width:"80vw",height:"80vh",borderRadius:8,border:"none"}} title="PDF 미리보기"/>:<div style={{color:"#a0a0c0",fontSize:14}}>미리보기를 지원하지 않는 파일 형식이에요.</div>):(<div style={{color:"#a0a0c0",fontSize:13,padding:20,background:"#1a1a2e",borderRadius:10}}>파일 데이터가 없어요.</div>)}
        </div>
      </div>)}
    </div>
  );
}

export default function App() {
  const today=new Date();
  const [loaded,setLoaded]=useState(false);
  const [theme,setTheme]=useState(DEFAULT_THEME);
  const [calendarName,setCalendarName]=useState("대입 준비 달력");
  const [editingName,setEditingName]=useState(false);
  const [tempName,setTempName]=useState("대입 준비 달력");
  const [grade,setGrade]=useState("");
  const [birthdate,setBirthdate]=useState("");
  const [currentYear,setCurrentYear]=useState(today.getFullYear());
  const [currentMonth,setCurrentMonth]=useState(today.getMonth()+1);
  const [customEvents,setCustomEvents]=useState([]);
  const [selectedDay,setSelectedDay]=useState(null);
  const [showAddModal,setShowAddModal]=useState(false);
  const [showSetup,setShowSetup]=useState(false);
  const [showCatModal,setShowCatModal]=useState(false);
  const [showLinkModal,setShowLinkModal]=useState(false);
  const [categories,setCategories]=useState(DEFAULT_CATEGORIES);
  const [newEvent,setNewEvent]=useState({title:"",category:"general",desc:"",day:1});
  const [activeCategories,setActiveCategories]=useState(Object.keys(DEFAULT_CATEGORIES));
  const [saveIndicator,setSaveIndicator]=useState("");
  const [volunteerLogs,setVolunteerLogs]=useState([]);
  const [showVolReport,setShowVolReport]=useState(false);
  const [volForm,setVolForm]=useState({date:"",org:"",desc:"",hours:"",fileName:"",fileData:null});
  const [volOpen,setVolOpen]=useState(true);

  useEffect(()=>{
    async function load(){
      const [th,name,gr,bd,cats,active,events,vlogs]=await Promise.all([storageLoad("theme"),storageLoad("calendarName"),storageLoad("grade"),storageLoad("birthdate"),storageLoad("categories"),storageLoad("activeCategories"),storageLoad("customEvents"),storageLoad("volunteerLogs")]);
      if(th) setTheme(th); if(name) setCalendarName(name); if(gr) setGrade(gr); if(bd) setBirthdate(bd);
      if(cats) setCategories(cats); if(active) setActiveCategories(active); if(events) setCustomEvents(events); if(vlogs) setVolunteerLogs(vlogs);
      setShowSetup(!bd); setLoaded(true);
    }
    load();
  },[]);

  const t=theme;
  const fontStyle=FONTS.find(f=>f.id===t.font)?.style||FONTS[0].style;
  function flash(){ setSaveIndicator("✓ 저장됨"); setTimeout(()=>setSaveIndicator(""),2000); }
  function saveTheme(v){ setTheme(v); storageSave("theme",v); flash(); }
  function saveCalName(v){ setCalendarName(v); storageSave("calendarName",v); }
  function saveGrade(v){ setGrade(v); storageSave("grade",v); }
  function saveBirthdate(v){ setBirthdate(v); storageSave("birthdate",v); }
  function saveCategories(v){ setCategories(v); storageSave("categories",v); }
  function saveActiveCats(fn){ setActiveCategories(prev=>{ const next=typeof fn==="function"?fn(prev):fn; storageSave("activeCategories",next); return next; }); }
  function saveCustomEvents(fn){ setCustomEvents(prev=>{ const next=typeof fn==="function"?fn(prev):fn; storageSave("customEvents",next); return next; }); }
  function saveVolLogs(fn){ setVolunteerLogs(prev=>{ const next=typeof fn==="function"?fn(prev):fn; storageSave("volunteerLogs",next.map(l=>({...l,fileData:null}))); return next; }); }

  const currentAge=calcAge(birthdate);
  const allEvents=[...BASE_EVENTS,...customEvents];
  const eventsThisMonth=allEvents.filter(e=>e.month===currentMonth);
  const daysInMonth=getDaysInMonth(currentYear,currentMonth);
  const firstDay=getFirstDayOfMonth(currentYear,currentMonth);

  function prevMonth(){ if(currentMonth===1){setCurrentMonth(12);setCurrentYear(y=>y-1);}else setCurrentMonth(m=>m-1);setSelectedDay(null); }
  function nextMonth(){ if(currentMonth===12){setCurrentMonth(1);setCurrentYear(y=>y+1);}else setCurrentMonth(m=>m+1);setSelectedDay(null); }
  function getCat(key){ return categories[key]||{bg:"#f0f0f0",border:"#999",dot:"#999",emoji:"📌",label:key}; }
  function getEventsOnDay(day){ return eventsThisMonth.filter(e=>e.day===day&&activeCategories.includes(e.category)); }
  function toggleCat(cat){ saveActiveCats(prev=>prev.includes(cat)?prev.filter(c=>c!==cat):[...prev,cat]); }
  function addCustomEvent(){ if(!newEvent.title) return; saveCustomEvents(prev=>[...prev,{...newEvent,month:currentMonth,day:parseInt(newEvent.day)}]); setNewEvent({title:"",category:Object.keys(categories)[0]||"general",desc:"",day:selectedDay||1}); setShowAddModal(false); flash(); }
  function deleteCustomEvent(idx){ saveCustomEvents(prev=>prev.filter((_,i)=>i!==idx)); flash(); }
  function saveName(){ if(!tempName.trim()) return; saveCalName(tempName.trim()); setEditingName(false); flash(); }
  function handleSaveCategories(newCats){ saveCategories(newCats); saveActiveCats(prev=>{ const valid=prev.filter(k=>newCats[k]); const added=Object.keys(newCats).filter(k=>!prev.includes(k)); return [...valid,...added]; }); setShowCatModal(false); flash(); }
  function handleAddFromLinks(events){ saveCustomEvents(prev=>[...prev,...events]); flash(); }
  function handleVolFile(e){ const file=e.target.files[0]; if(!file) return; const reader=new FileReader(); reader.onload=ev=>setVolForm(f=>({...f,fileName:file.name,fileData:ev.target.result})); reader.readAsDataURL(file); }
  function addVolLog(){ if(!volForm.date||!volForm.org||!volForm.hours) return; const entry={id:Date.now(),date:volForm.date,org:volForm.org,desc:volForm.desc,hours:parseFloat(volForm.hours)||0,fileName:volForm.fileName,fileData:volForm.fileData}; saveVolLogs(prev=>[...prev,entry].sort((a,b)=>a.date.localeCompare(b.date))); setVolForm({date:"",org:"",desc:"",hours:"",fileName:"",fileData:null}); flash(); }
  function deleteVolLog(id){ saveVolLogs(prev=>prev.filter(l=>l.id!==id)); flash(); }

  const totalVolHours=volunteerLogs.reduce((s,l)=>s+(l.hours||0),0);
  const currentMonthVolHours=volunteerLogs.filter(l=>{ const d=new Date(l.date); return d.getFullYear()===currentYear&&d.getMonth()+1===currentMonth; }).reduce((s,l)=>s+(l.hours||0),0);
  const selectedEvents=selectedDay?getEventsOnDay(selectedDay):[];
  const gradeLabel=grade?`${grade}학년`:"";
  const birthdateLabel=birthdate?`${new Date(birthdate).toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric"})} 생`:"";
  const ageLabel=currentAge!==null?`(현재 ${currentAge}세)`:"";
  const inp={width:"100%",padding:"8px 12px",background:t.bg,border:`1px solid ${t.border}`,borderRadius:8,color:t.text,fontSize:14,boxSizing:"border-box"};

  if(!loaded) return <div style={{minHeight:"100vh",background:"#0f0f17",display:"flex",alignItems:"center",justifyContent:"center",color:"#667eea",fontSize:16}}>불러오는 중...</div>;

  return(
    <div style={{minHeight:"100vh",background:t.bg,color:t.text,fontFamily:fontStyle,transition:"background 0.3s, color 0.3s"}}>
      <div style={{background:t.headerBg,padding:"18px 24px",borderBottom:`1px solid ${t.border}`,boxShadow:`0 2px 12px rgba(0,0,0,0.15)`}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <div>
            {editingName?(<div style={{display:"flex",alignItems:"center",gap:8}}>
              <input autoFocus value={tempName} onChange={e=>setTempName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveName();if(e.key==="Escape")setEditingName(false);}} style={{fontSize:20,fontWeight:700,background:"transparent",border:"none",borderBottom:`2px solid ${t.accent}`,color:t.text,outline:"none",width:200,padding:"2px 4px",fontFamily:fontStyle}}/>
              <button onClick={saveName} style={{background:t.accent,border:"none",color:"#fff",padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600}}>저장</button>
              <button onClick={()=>setEditingName(false)} style={{background:"transparent",border:`1px solid ${t.border}`,color:t.sub,padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>취소</button>
            </div>):(<div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>{setTempName(calendarName);setEditingName(true);}}>
              <h1 style={{margin:0,fontSize:22,fontWeight:700,color:t.text}}>🎓 {calendarName}</h1>
              <span style={{fontSize:13,color:t.sub}}>✏️</span>
            </div>)}
            <div style={{display:"flex",alignItems:"center",gap:10,marginTop:3}}>
              {(grade||birthdate)&&<p style={{margin:0,fontSize:12,color:t.sub}}>{gradeLabel} {birthdateLabel} {ageLabel}</p>}
              {saveIndicator&&<span style={{fontSize:11,color:"#27ae60",fontWeight:600}}>{saveIndicator}</span>}
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={()=>setShowLinkModal(true)} style={{background:t.accent,border:"none",color:"#fff",padding:"7px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600}}>🔗 링크로 추가</button>
            <button onClick={()=>setShowCatModal(true)} style={{background:"transparent",border:`1px solid ${t.border}`,color:t.sub,padding:"7px 12px",borderRadius:8,cursor:"pointer",fontSize:12}}>🗂️ 카테고리</button>
            <button onClick={()=>setShowSetup(true)} style={{background:"transparent",border:`1px solid ${t.border}`,color:t.sub,padding:"7px 12px",borderRadius:8,cursor:"pointer",fontSize:12}}>⚙️ 설정</button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"18px 16px"}}>
        {showSetup&&<SettingsModal theme={t} grade={grade} birthdate={birthdate} currentAge={currentAge} onSaveTheme={saveTheme} onSaveGrade={saveGrade} onSaveBirthdate={saveBirthdate} onClose={()=>setShowSetup(false)}/>}
        {showCatModal&&<CategoryModal categories={categories} theme={t} onClose={()=>setShowCatModal(false)} onSave={handleSaveCategories}/>}
        {showLinkModal&&<LinkImportModal categories={categories} theme={t} onClose={()=>setShowLinkModal(false)} onAdd={handleAddFromLinks}/>}
        {showVolReport&&<VolunteerReportModal logs={volunteerLogs} grade={grade} theme={t} onClose={()=>setShowVolReport(false)}/>}

        <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
          {Object.entries(categories).map(([key,val])=>(<button key={key} onClick={()=>toggleCat(key)} style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${val.border}`,background:activeCategories.includes(key)?val.bg:"transparent",color:activeCategories.includes(key)?"#1a1a2e":t.sub,fontSize:12,cursor:"pointer",fontWeight:600,transition:"all 0.15s"}}>{val.emoji} {val.label}</button>))}
        </div>

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <button onClick={prevMonth} style={{background:t.calBg,border:`1px solid ${t.border}`,color:t.text,width:34,height:34,borderRadius:8,cursor:"pointer",fontSize:18}}>‹</button>
          <h2 style={{margin:0,fontSize:20,fontWeight:700,color:t.text}}>{currentYear}년 {MONTHS[currentMonth-1]}</h2>
          <button onClick={nextMonth} style={{background:t.calBg,border:`1px solid ${t.border}`,color:t.text,width:34,height:34,borderRadius:8,cursor:"pointer",fontSize:18}}>›</button>
        </div>

        <div style={{background:t.calBg,borderRadius:16,overflow:"hidden",border:`1px solid ${t.border}`,marginBottom:18}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:`1px solid ${t.border}`}}>
            {DAYS_OF_WEEK.map((d,i)=>(<div key={d} style={{padding:"8px 0",textAlign:"center",fontSize:11,fontWeight:700,color:i===0?"#e74c3c":i===6?"#5dade2":t.sub}}>{d}</div>))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
            {Array.from({length:firstDay}).map((_,i)=>(<div key={`e${i}`} style={{minHeight:76,borderRight:`1px solid ${t.cell}`,borderBottom:`1px solid ${t.cell}`,overflow:"hidden"}}/>))}
            {Array.from({length:daysInMonth}).map((_,i)=>{
              const day=i+1; const dayEvents=getEventsOnDay(day);
              const isToday=day===today.getDate()&&currentMonth===today.getMonth()+1&&currentYear===today.getFullYear();
              const isSelected=selectedDay===day;
              const dayVolHours=volunteerLogs.filter(l=>{ const d=new Date(l.date); return d.getFullYear()===currentYear&&d.getMonth()+1===currentMonth&&d.getDate()===day; }).reduce((s,l)=>s+(l.hours||0),0);
              return(<div key={day} onClick={()=>setSelectedDay(isSelected?null:day)} style={{minHeight:76,borderRight:`1px solid ${t.cell}`,borderBottom:`1px solid ${t.cell}`,padding:"5px 4px 3px",cursor:"pointer",background:isSelected?`rgba(${hexToRgb(t.accent)},0.12)`:t.calBg,transition:"background 0.15s",overflow:"hidden",boxSizing:"border-box"}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:isToday?t.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:isToday?700:400,color:isToday?"#fff":t.text,marginBottom:2}}>{day}</div>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>
                  {dayEvents.slice(0,2).map((ev,idx)=>{ const c=getCat(ev.category); return(<div key={idx} style={{fontSize:9,padding:"2px 3px",borderRadius:3,background:c.bg,color:"#1a1a2e",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",borderLeft:`2px solid ${c.border}`,maxWidth:"100%"}}>{c.emoji} {ev.title}</div>); })}
                  {dayEvents.length>2&&<div style={{fontSize:9,color:t.sub}}>+{dayEvents.length-2}개</div>}
                  {dayVolHours>0&&<div style={{fontSize:9,padding:"1px 3px",borderRadius:3,background:"rgba(39,174,96,0.15)",color:"#27ae60",fontWeight:700,borderLeft:"2px solid #27ae60"}}>🤝 {dayVolHours}h</div>}
                </div>
              </div>);
            })}
          </div>
        </div>

        {selectedDay&&(<div style={{background:t.calBg,borderRadius:12,border:`1px solid ${t.border}`,padding:16,marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <h3 style={{margin:0,fontSize:15,color:t.text}}>{currentMonth}월 {selectedDay}일 일정</h3>
            <button onClick={()=>{setNewEvent(e=>({...e,day:selectedDay}));setShowAddModal(true);}} style={{background:t.accent,border:"none",color:"#fff",padding:"5px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600}}>+ 추가</button>
          </div>
          {selectedEvents.length===0?(<p style={{color:t.sub,fontSize:13,margin:0}}>등록된 일정이 없어요.</p>):(
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {selectedEvents.map((ev,idx)=>{
                const c=getCat(ev.category);
                const ageOnDay=birthdate?calcAgeOnDate(birthdate,`${currentYear}-${String(currentMonth).padStart(2,"0")}-${String(selectedDay).padStart(2,"0")}`):null;
                const customIdx=customEvents.findIndex(ce=>ce.title===ev.title&&ce.month===ev.month&&ce.day===ev.day&&ce.category===ev.category);
                return(<div key={idx} style={{padding:"10px 14px",borderRadius:10,background:c.bg,borderLeft:`3px solid ${c.border}`}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#1a1a2e",marginBottom:2}}>{c.emoji} {ev.title}</div>
                      {ev.desc&&<div style={{fontSize:11,color:"#4a4a6a"}}>{ev.desc}</div>}
                      {ev.url&&<a href={ev.url} target="_blank" rel="noreferrer" style={{fontSize:10,color:t.accent,display:"block",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>🔗 {ev.url}</a>}
                      {ageOnDay!==null&&<div style={{fontSize:10,color:"#7a7a8a",marginTop:3}}>📅 이 날 기준 {ageOnDay}세</div>}
                    </div>
                    {customIdx>=0&&<button onClick={()=>deleteCustomEvent(customIdx)} style={{background:"none",border:"none",color:"#e74c3c",fontSize:14,cursor:"pointer",padding:"0 2px",flexShrink:0}}>✕</button>}
                  </div>
                </div>);
              })}
            </div>
          )}
        </div>)}

        <div style={{background:t.calBg,borderRadius:12,border:`1px solid ${t.border}`,padding:16,marginBottom:18}}>
          <h3 style={{margin:"0 0 10px",fontSize:14,color:t.sub}}>📋 이번 달 전체 일정</h3>
          {eventsThisMonth.filter(e=>activeCategories.includes(e.category)).length===0?(<p style={{color:t.sub,fontSize:13,margin:0,opacity:0.6}}>이번 달 등록된 일정이 없어요.</p>):(
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {eventsThisMonth.filter(e=>activeCategories.includes(e.category)).sort((a,b)=>a.day-b.day).map((ev,idx)=>{ const c=getCat(ev.category); return(<div key={idx} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 10px",borderRadius:8,background:t.bg}}>
                <div style={{minWidth:28,textAlign:"center",fontSize:12,fontWeight:700,color:t.accent}}>{ev.day}일</div>
                <div style={{width:7,height:7,borderRadius:"50%",background:c.dot,flexShrink:0}}/>
                <div style={{flex:1,overflow:"hidden"}}><div style={{fontSize:12,color:t.text,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.emoji} {ev.title}</div>{ev.desc&&<div style={{fontSize:10,color:t.sub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.desc}</div>}</div>
              </div>); })}
            </div>
          )}
        </div>

        <div style={{background:t.calBg,borderRadius:16,border:"1px solid #27ae60",overflow:"hidden",marginBottom:18}}>
          <div style={{background:`rgba(39,174,96,0.08)`,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",borderBottom:volOpen?`1px solid rgba(39,174,96,0.2)`:"none"}} onClick={()=>setVolOpen(v=>!v)}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:18}}>🤝</span>
              <div><div style={{fontSize:15,fontWeight:700,color:t.text}}>봉사 활동 기록</div><div style={{fontSize:11,color:"#6a8a6a",marginTop:1}}>총 {totalVolHours.toFixed(1)}시간 · {volunteerLogs.length}건{currentMonthVolHours>0?` · 이번 달 ${currentMonthVolHours.toFixed(1)}h`:""}</div></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button onClick={e=>{e.stopPropagation();setShowVolReport(true);}} style={{background:"#27ae60",border:"none",color:"#fff",padding:"5px 12px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600}}>📊 보고서</button>
              <span style={{color:"#27ae60",fontSize:16}}>{volOpen?"▲":"▼"}</span>
            </div>
          </div>
          {volOpen&&(<div style={{padding:"16px 18px"}}>
            <div style={{background:t.bg,borderRadius:12,padding:16,marginBottom:16,border:`1px solid ${t.border}`}}>
              <div style={{fontSize:12,color:t.sub,marginBottom:12,fontWeight:600}}>+ 봉사 활동 추가</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <div><label style={{display:"block",fontSize:11,color:t.sub,marginBottom:4}}>날짜 *</label><input type="date" value={volForm.date} onChange={e=>setVolForm(f=>({...f,date:e.target.value}))} style={{...inp,fontSize:13}}/></div>
                <div><label style={{display:"block",fontSize:11,color:t.sub,marginBottom:4}}>시간 (h) *</label><input type="number" value={volForm.hours} onChange={e=>setVolForm(f=>({...f,hours:e.target.value}))} placeholder="예: 3.5" min="0" step="0.5" style={{...inp,fontSize:13}}/></div>
              </div>
              <div style={{marginBottom:10}}><label style={{display:"block",fontSize:11,color:t.sub,marginBottom:4}}>기관/단체명 *</label><input value={volForm.org} onChange={e=>setVolForm(f=>({...f,org:e.target.value}))} placeholder="예: 지역 도서관" style={{...inp,fontSize:13}}/></div>
              <div style={{marginBottom:12}}><label style={{display:"block",fontSize:11,color:t.sub,marginBottom:4}}>활동 내용</label><input value={volForm.desc} onChange={e=>setVolForm(f=>({...f,desc:e.target.value}))} placeholder="예: 독서 멘토링" style={{...inp,fontSize:13}}/></div>
              <div style={{marginBottom:14}}>
                <label style={{display:"block",fontSize:11,color:t.sub,marginBottom:6}}>📎 증빙서류 (이미지/PDF)</label>
                <label style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",background:t.calBg,border:`1px dashed ${t.border}`,borderRadius:8,cursor:"pointer"}}>
                  <span style={{fontSize:18}}>📁</span>
                  <div><div style={{fontSize:12,color:t.text,fontWeight:600}}>{volForm.fileName||"파일 선택 (클릭)"}</div><div style={{fontSize:10,color:t.sub}}>JPG, PNG, PDF 지원</div></div>
                  <input type="file" accept="image/*,.pdf" onChange={handleVolFile} style={{display:"none"}}/>
                </label>
                {volForm.fileData&&volForm.fileData.startsWith("data:image")&&(<img src={volForm.fileData} alt="미리보기" style={{marginTop:8,maxHeight:100,maxWidth:"100%",borderRadius:8,objectFit:"cover",border:`1px solid ${t.border}`}}/>)}
                {volForm.fileData&&volForm.fileData.startsWith("data:application/pdf")&&(<div style={{marginTop:8,padding:"6px 10px",background:"rgba(39,174,96,0.1)",borderRadius:6,fontSize:11,color:"#27ae60"}}>📄 PDF 첨부됨: {volForm.fileName}</div>)}
              </div>
              <button onClick={addVolLog} disabled={!volForm.date||!volForm.org||!volForm.hours} style={{width:"100%",padding:"10px",background:(!volForm.date||!volForm.org||!volForm.hours)?t.bg:"linear-gradient(135deg,#27ae60,#1e8449)",border:`1px solid ${(!volForm.date||!volForm.org||!volForm.hours)?t.border:"#27ae60"}`,borderRadius:8,color:(!volForm.date||!volForm.org||!volForm.hours)?t.sub:"#fff",fontWeight:600,cursor:(!volForm.date||!volForm.org||!volForm.hours)?"default":"pointer",fontSize:13}}>봉사 기록 저장</button>
            </div>
            {volunteerLogs.length===0?(<p style={{color:t.sub,fontSize:13,textAlign:"center",padding:"10px 0",opacity:0.6}}>아직 기록된 봉사 활동이 없어요.</p>):(
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {[...volunteerLogs].reverse().slice(0,10).map((l)=>(<div key={l.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:t.bg,borderRadius:10,border:`1px solid ${t.border}`}}>
                  <div style={{minWidth:60,textAlign:"center"}}><div style={{fontSize:10,color:t.sub}}>{l.date}</div><div style={{fontSize:15,fontWeight:700,color:"#27ae60"}}>{(l.hours||0).toFixed(1)}h</div></div>
                  <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,color:t.text,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.org}</div>{l.desc&&<div style={{fontSize:11,color:t.sub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.desc}</div>}{l.fileName&&<span style={{fontSize:10,color:"#3a8a3a"}}>📎 {l.fileName}</span>}</div>
                  <button onClick={()=>deleteVolLog(l.id)} style={{background:"none",border:"none",color:"#e74c3c",fontSize:14,cursor:"pointer",flexShrink:0}}>✕</button>
                </div>))}
                {volunteerLogs.length>10&&<p style={{fontSize:11,color:t.sub,textAlign:"center",margin:"4px 0 0",opacity:0.7}}>최근 10건 표시 · 전체는 보고서에서</p>}
              </div>
            )}
          </div>)}
        </div>

        {showAddModal&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}>
          <div style={{background:t.calBg,border:`1px solid ${t.border}`,borderRadius:16,padding:28,width:320,boxShadow:"0 20px 60px rgba(0,0,0,0.5)",fontFamily:fontStyle,color:t.text}}>
            <h3 style={{margin:"0 0 18px",fontSize:17}}>📌 일정 추가</h3>
            <div style={{marginBottom:11}}><label style={{display:"block",fontSize:12,color:t.sub,marginBottom:4}}>날짜 (일)</label><input type="number" value={newEvent.day} onChange={e=>setNewEvent(v=>({...v,day:e.target.value}))} min="1" max={daysInMonth} style={inp}/></div>
            <div style={{marginBottom:11}}><label style={{display:"block",fontSize:12,color:t.sub,marginBottom:4}}>제목</label><input value={newEvent.title} onChange={e=>setNewEvent(v=>({...v,title:e.target.value}))} placeholder="예: SAT 시험" style={inp} onKeyDown={e=>e.key==="Enter"&&addCustomEvent()}/></div>
            <div style={{marginBottom:11}}>
              <label style={{display:"block",fontSize:12,color:t.sub,marginBottom:4}}>카테고리</label>
              <select value={newEvent.category} onChange={e=>setNewEvent(v=>({...v,category:e.target.value}))} style={inp}>
                {Object.entries(categories).map(([k,v])=><option key={k} value={k}>{v.emoji} {v.label}</option>)}
              </select>
            </div>
            <div style={{marginBottom:18}}><label style={{display:"block",fontSize:12,color:t.sub,marginBottom:4}}>메모 (선택)</label><input value={newEvent.desc} onChange={e=>setNewEvent(v=>({...v,desc:e.target.value}))} placeholder="간단한 설명" style={inp}/></div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setShowAddModal(false)} style={{flex:1,padding:"10px",background:t.bg,border:`1px solid ${t.border}`,borderRadius:8,color:t.sub,cursor:"pointer"}}>취소</button>
              <button onClick={addCustomEvent} style={{flex:1,padding:"10px",background:t.accent,border:"none",borderRadius:8,color:"#fff",fontWeight:600,cursor:"pointer"}}>저장</button>
            </div>
          </div>
        </div>)}
      </div>
    </div>
  );
}
