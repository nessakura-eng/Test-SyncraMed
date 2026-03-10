import { useState } from "react";

const colors = {
  black: "#0a0a0a", white: "#ffffff", offWhite: "#f8f8f8",
  border: "#e8e8e8", muted: "#888888", light: "#bbbbbb",
  secondary: "#555555", success: "#276749", successBg: "#e8f5e9", danger: "#c53030",
};

const MEDICATIONS = [
  { id: "1", name: "Lisinopril", brand: "Zestril", dose: "10mg", frequency: "Once daily", condition: "Hypertension" },
  { id: "2", name: "Metformin", brand: "Glucophage", dose: "500mg", frequency: "Twice daily", condition: "Type 2 Diabetes" },
  { id: "3", name: "Atorvastatin", brand: "Lipitor", dose: "20mg", frequency: "Once daily", condition: "Cholesterol" },
];

const LOGS = {
  "2025-03-07": { taken: ["1","2"], symptoms: "Mild headache in the afternoon, went away after resting.", notes: "Drank plenty of water today. Felt better by evening." },
  "2025-03-08": { taken: ["1","2","3"], symptoms: "", notes: "Feeling great today. Went for a 30-min walk." },
  "2025-03-09": { taken: ["1"], symptoms: "Some fatigue in the morning.", notes: "Took meds with breakfast. Will try to sleep earlier." },
  "2025-03-05": { taken: ["1","2","3"], symptoms: "", notes: "" },
  "2025-03-03": { taken: ["2"], symptoms: "Nausea after taking Metformin around noon.", notes: "Tried taking with food next time — helped a lot." },
};

const REMINDERS = [
  { id: "1", medName: "Lisinopril", time: "08:00", label: "With breakfast" },
  { id: "2", medName: "Metformin", time: "08:00", label: "With breakfast" },
  { id: "3", medName: "Metformin", time: "19:00", label: "With dinner" },
  { id: "4", medName: "Atorvastatin", time: "21:00", label: "Before bed" },
];

const PHARMACIES = [
  { id: "1", name: "CVS Pharmacy", address: "8200 Pines Blvd, Pembroke Pines, FL", phone: "(954) 432-1122" },
];

const AI_EDUCATION = {
  generic: "Lisinopril", brand: "Zestril, Prinivil", drugClass: "ACE Inhibitor",
  conditions: ["Hypertension", "Heart Failure", "Diabetic Nephropathy"],
  sideEffects: ["Dry cough (up to 10%)", "Dizziness", "Headache", "Elevated potassium"],
  pros: ["Once daily dosing", "Cardioprotective", "Very affordable generic", "Kidney protective"],
  cons: ["Persistent dry cough", "Not safe in pregnancy", "Requires monitoring"],
  notes: "Lisinopril relaxes blood vessels by blocking ACE, lowering blood pressure and reducing strain on the heart.",
};

const CHAT_SEED = [
  { role: "user", content: "What are the side effects of Lisinopril?" },
  { role: "ai", content: "Lisinopril's most common side effect is a persistent dry cough (≈10% of patients). Others include dizziness, headache, and elevated potassium. Rarely, it can cause angioedema — swelling of the face or throat — which needs immediate attention." },
  { role: "user", content: "Can I drink alcohol while taking Metformin?" },
  { role: "ai", content: "Alcohol and Metformin together can increase lactic acidosis risk. Occasional moderate drinking is generally low risk, but heavy drinking should be avoided. Discuss your habits with your doctor for personalized guidance." },
];

const fmt12 = (t) => { const [h,m]=t.split(":").map(Number); return `${h>12?h-12:h===0?12:h}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`; };

// ─── Clean SVG icon set ───────────────────────────────────────────────────────
const Icon = ({ name, size=20, color="#0a0a0a", sw=1.8 }) => {
  const base = { stroke:color, strokeWidth:sw, strokeLinecap:"round", strokeLinejoin:"round", fill:"none" };
  const g = (d,extra) => <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><path {...base} {...extra} d={d}/></svg>;
  const icons = {
    home:     <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><path {...base} d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1z"/><path {...base} d="M9 21V12h6v9"/></svg>,
    medkit:   <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><rect {...base} x="2" y="7" width="20" height="14" rx="2"/><path {...base} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/><line {...base} x1="12" y1="11" x2="12" y2="17"/><line {...base} x1="9" y1="14" x2="15" y2="14"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><rect {...base} x="3" y="4" width="18" height="18" rx="2"/><line {...base} x1="16" y1="2" x2="16" y2="6"/><line {...base} x1="8" y1="2" x2="8" y2="6"/><line {...base} x1="3" y1="10" x2="21" y2="10"/></svg>,
    alarm:    <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><circle {...base} cx="12" cy="13" r="8"/><path {...base} d="M12 9v4l2.5 2.5"/><path {...base} d="M5 3L2 6M22 6l-3-3"/></svg>,
    store:    <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><path {...base} d="M2 7h20M5 7l1.5-4h11L19 7"/><path {...base} d="M5 7a3 3 0 006 0M11 7a3 3 0 006 0"/><path {...base} d="M19 7v12a1 1 0 01-1 1H6a1 1 0 01-1-1V7"/><rect {...base} x="9" y="13" width="6" height="8"/></svg>,
    chat:     <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><path {...base} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><circle fill={color} cx="8" cy="10" r="1"/><circle fill={color} cx="12" cy="10" r="1"/><circle fill={color} cx="16" cy="10" r="1"/></svg>,
    sparkle:  <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><path {...base} d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74z"/></svg>,
    check:    <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><polyline {...base} points="20 6 9 17 4 12"/></svg>,
    plus:     <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><line {...base} x1="12" y1="5" x2="12" y2="19"/><line {...base} x1="5" y1="12" x2="19" y2="12"/></svg>,
    close:    <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><line {...base} x1="18" y1="6" x2="6" y2="18"/><line {...base} x1="6" y1="6" x2="18" y2="18"/></svg>,
    trash:    <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><polyline {...base} points="3 6 5 6 21 6"/><path {...base} d="M19 6l-1 14H6L5 6"/><path {...base} d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
    journal:  <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><path {...base} d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path {...base} d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><line {...base} x1="8" y1="7" x2="16" y2="7"/><line {...base} x1="8" y1="11" x2="16" y2="11"/><line {...base} x1="8" y1="15" x2="12" y2="15"/></svg>,
    chevL:    <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><polyline {...base} points="15 18 9 12 15 6"/></svg>,
    chevR:    <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><polyline {...base} points="9 18 15 12 9 6"/></svg>,
    info:     <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><circle {...base} cx="12" cy="12" r="10"/><line {...base} x1="12" y1="16" x2="12" y2="12"/><line {...base} x1="12" y1="8" x2="12.01" y2="8" strokeWidth={2.5}/></svg>,
    refresh:  <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><polyline {...base} points="23 4 23 10 17 10"/><path {...base} d="M20.5 15a9 9 0 11-2.8-8.5L23 10"/></svg>,
    up:       <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><line {...base} x1="12" y1="19" x2="12" y2="5"/><polyline {...base} points="5 12 12 5 19 12"/></svg>,
    flame:    <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}><path {...base} d="M12 2C9 6 7 9 9 13c-2-1-3-3-3-5C3 13 4 20 12 22c8-2 9-9 6-14-1 3-3 4-6 4 2-2 1-6 0-10z"/></svg>,
  };
  return icons[name] || null;
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SyncraMedPreview() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [takenToday, setTakenToday] = useState(["1"]);
  const [showAI, setShowAI] = useState(false);
  const [calSelected, setCalSelected] = useState("2025-03-09");
  const [chatInput, setChatInput] = useState("");

  const adherence = Math.round((takenToday.length / MEDICATIONS.length) * 100);

  const tabs = [
    { id:"dashboard",  icon:"home",     label:"Home"     },
    { id:"medications",icon:"medkit",   label:"Meds"     },
    { id:"calendar",   icon:"calendar", label:"Calendar" },
    { id:"reminders",  icon:"alarm",    label:"Reminders"},
    { id:"pharmacy",   icon:"store",    label:"Pharmacy" },
    { id:"ai",         icon:"chat",     label:"AI Chat"  },
  ];

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#ddd;border-radius:3px}
        .tap{cursor:pointer;transition:transform .1s,opacity .1s}.tap:active{transform:scale(.97);opacity:.85}
        .tabbtn{cursor:pointer;border-radius:10px;transition:all .15s}
        .rowhov:hover{background:#f9f9f9}
        .fade{animation:fi .25s ease}@keyframes fi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
        .sup{animation:su .28s cubic-bezier(.2,.8,.3,1)}@keyframes su{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
        .dot1{animation:bo .9s infinite}
        .dot2{animation:bo .9s .2s infinite}
        .dot3{animation:bo .9s .4s infinite}
        @keyframes bo{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
        input{outline:none;font-family:inherit}
      `}</style>

      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:20 }}>
        {/* Brand */}
        <div style={{ textAlign:"center" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:4 }}>
            <div style={{ width:30,height:30,background:"white",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Icon name="medkit" size={16} color={colors.black} sw={2.2}/>
            </div>
            <span style={{ fontFamily:"'DM Serif Display',serif",fontSize:22,color:"white",fontWeight:400 }}>SyncraMed</span>
          </div>
          <p style={{ color:"rgba(255,255,255,0.4)",fontSize:12 }}>Interactive App Preview</p>
        </div>

        {/* Phone frame */}
        <div style={{ transform: "scale(0.85)", transformOrigin: "top center" }}>
          <div style={{ position:"relative", width:375, background:"#141414", borderRadius:50, padding:12, boxShadow:"0 40px 80px rgba(0,0,0,0.65),0 0 0 1px rgba(255,255,255,0.08)" }}>
            {/* Notch and Screen content */}
  
            <div style={{ position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",width:110,height:28,background:"#141414",borderRadius:"0 0 14px 14px",zIndex:10,display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
              <div style={{ width:7,height:7,background:"#2a2a2a",borderRadius:"50%" }}/>
              <div style={{ width:44,height:7,background:"#2a2a2a",borderRadius:4 }}/>
            </div>
  
            {/* Screen */}
            <div style={{ background:colors.offWhite,borderRadius:40,overflow:"hidden",height:760,display:"flex",flexDirection:"column",position:"relative" }}>
              {/* Status bar */}
              <div style={{ background:colors.white,padding:"14px 20px 8px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0 }}>
                <span style={{ fontSize:12,fontWeight:700 }}>9:41</span>
                <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                  {[4,6,8,10].map((h,i)=><div key={i} style={{ width:3,height:h,background:colors.black,borderRadius:1 }}/>)}
                  <span style={{ fontSize:11,fontWeight:600,marginLeft:4 }}>100%</span>
                </div>
              </div>
  
              {/* App header */}
              <div style={{ background:colors.white,padding:"8px 18px 12px",borderBottom:`1px solid ${colors.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <div style={{ width:26,height:26,background:colors.black,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <Icon name="medkit" size={13} color="white" sw={2.2}/>
                  </div>
                  <span style={{ fontFamily:"'DM Serif Display',serif",fontSize:17,fontWeight:400 }}>SyncraMed</span>
                </div>
                <div style={{ width:30,height:30,background:colors.black,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:13,fontWeight:700 }}>P</div>
              </div>
  
              {/* Screen content */}
              <div style={{ flex:1,overflowY:"auto" }} className="fade" key={activeTab}>
                {activeTab==="dashboard"    && <DashboardView takenToday={takenToday} setTakenToday={setTakenToday} adherence={adherence}/>}
                {activeTab==="medications"  && <MedicationsView showAI={showAI} setShowAI={setShowAI} takenToday={takenToday} setTakenToday={setTakenToday}/>}
                {activeTab==="calendar"     && <CalendarView logs={LOGS} selected={calSelected} setSelected={setCalSelected}/>}
                {activeTab==="reminders"    && <RemindersView/>}
                {activeTab==="pharmacy"     && <PharmacyView/>}
                {activeTab==="ai"           && <AIChatView chatInput={chatInput} setChatInput={setChatInput}/>}
              </div>
  
              {/* Tab bar */}
              <div style={{ background:colors.white,borderTop:`1px solid ${colors.border}`,padding:"8px 0 20px",display:"flex",justifyContent:"space-around",flexShrink:0 }}>
                {tabs.map(t=>{
                  const on=activeTab===t.id;
                  return (
                    <div key={t.id} className="tabbtn" onClick={()=>setActiveTab(t.id)}
                      style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 10px",background:on?"#f0f0f0":"transparent" }}>
                      <Icon name={t.icon} size={21} color={on?colors.black:colors.light} sw={on?2.2:1.8}/>
                      <span style={{ fontSize:9,fontWeight:600,color:on?colors.black:colors.light,letterSpacing:0.3 }}>{t.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        
        {/* Nav pills */}
        <div style={{ display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center" }}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{ padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:activeTab===t.id?"white":"rgba(255,255,255,0.13)",color:activeTab===t.id?colors.black:"rgba(255,255,255,0.75)",transition:"all .2s",display:"flex",alignItems:"center",gap:6 }}>
              <Icon name={t.icon} size={13} color={activeTab===t.id?colors.black:"rgba(255,255,255,0.75)"} sw={2}/>
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function DashboardView({ takenToday, setTakenToday, adherence }) {
  return (
    <div style={{ padding:"16px 16px 24px" }}>
      <p style={{ fontSize:11,color:colors.muted,marginBottom:2 }}>Sunday, March 9, 2025</p>
      <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:22,fontWeight:400,marginBottom:16 }}>Good morning 👋</h1>

      <div style={{ display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:4 }}>
        {[{l:"Medications",v:"3",icon:"medkit"},{l:"Adherence",v:`${adherence}%`,icon:"check"},{l:"Streak",v:"7 days",icon:"flame"}].map(s=>(
          <div key={s.l} style={{ background:colors.white,borderRadius:14,padding:"12px 14px",border:`1px solid ${colors.border}`,minWidth:108,flexShrink:0 }}>
            <div style={{ width:32,height:32,background:colors.black,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8 }}>
              <Icon name={s.icon} size={16} color="white" sw={2}/>
            </div>
            <div style={{ fontSize:20,fontWeight:700 }}>{s.v}</div>
            <div style={{ fontSize:10,color:colors.muted,fontWeight:500,marginTop:1 }}>{s.l}</div>
          </div>
        ))}
      </div>

    </div>
  );
}

      <div style={{ background:colors.white,borderRadius:16,padding:16,border:`1px solid ${colors.border}`,marginBottom:12 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
          <span style={{ fontWeight:700,fontSize:14 }}>Today's Medications</span>
          <span style={{ fontSize:11,color:colors.muted }}>{takenToday.length}/3 taken</span>
        </div>
        <div style={{ height:4,background:"#eee",borderRadius:2,marginBottom:12,overflow:"hidden" }}>
          <div style={{ height:"100%",background:colors.black,borderRadius:2,width:`${adherence}%`,transition:"width .4s" }}/>
        </div>
        {MEDICATIONS.map(med=>{
          const taken=takenToday.includes(med.id);
          return (
            <div key={med.id} className="rowhov tap" onClick={()=>setTakenToday(p=>taken?p.filter(x=>x!==med.id):[...p,med.id])}
              style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 6px",borderBottom:"1px solid #f5f5f5",borderRadius:8,transition:"background .15s" }}>
              <div style={{ width:24,height:24,borderRadius:"50%",border:`2px solid ${colors.black}`,background:taken?colors.black:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s" }}>
                {taken&&<Icon name="check" size={12} color="white" sw={3}/>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13,fontWeight:600,color:taken?colors.muted:colors.black,textDecoration:taken?"line-through":"none" }}>{med.name}</div>
                <div style={{ fontSize:11,color:colors.muted }}>{med.dose} · {med.frequency}</div>
              </div>
              <span style={{ padding:"2px 8px",borderRadius:20,fontSize:9,fontWeight:600,background:"#f5f5f5",color:colors.secondary,letterSpacing:0.3,textTransform:"uppercase",whiteSpace:"nowrap" }}>{med.condition}</span>
            </div>
          );
        })}
      </div>

      <div style={{ background:colors.white,borderRadius:16,padding:16,border:`1px solid ${colors.border}` }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
          <Icon name="journal" size={16} color={colors.secondary} sw={1.8}/>
          <span style={{ fontWeight:700,fontSize:14 }}>Daily Journal</span>
        </div>
        {[{l:"Symptoms Today",ph:"Describe any symptoms you're experiencing..."},{l:"Notes",ph:"Any general notes for today..."}].map((f,i)=>(
          <div key={f.l}>
            <div style={{ fontSize:10,fontWeight:700,color:colors.secondary,textTransform:"uppercase",letterSpacing:0.5,marginBottom:5,marginTop:i>0?10:0 }}>{f.l}</div>
            <div style={{ border:"1.5px solid #e0e0e0",borderRadius:10,padding:"10px 12px",fontSize:12,color:colors.muted,minHeight:54,background:"#fafafa",lineHeight:1.6 }}>{f.ph}</div>
          </div>
        ))}
        <div className="tap" style={{ background:colors.black,borderRadius:10,padding:"11px",textAlign:"center",marginTop:12,color:"white",fontWeight:700,fontSize:13 }}>Save Journal</div>
      </div>
    </div>
  );
}

// ─── MEDICATIONS ─────────────────────────────────────────────────────────────
function MedicationsView({ showAI, setShowAI, takenToday, setTakenToday }) {
  return (
    <div style={{ padding:"16px 16px 24px",position:"relative" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
        <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:22,fontWeight:400 }}>Medications</h1>
        <div className="tap" style={{ background:colors.black,borderRadius:8,padding:"6px 12px",color:"white",fontWeight:700,fontSize:12,display:"flex",alignItems:"center",gap:5 }}>
          <Icon name="plus" size={14} color="white" sw={2.5}/> Add
        </div>
      </div>
      {MEDICATIONS.map(med=>{
        const taken=takenToday.includes(med.id);
        return (
          <div key={med.id} style={{ background:colors.white,borderRadius:16,padding:16,border:`1px solid ${colors.border}`,marginBottom:10 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
              <div style={{ width:40,height:40,background:colors.offWhite,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Icon name="medkit" size={18} color={colors.black} sw={1.8}/>
              </div>
              <div className="tap"><Icon name="trash" size={16} color={colors.light} sw={1.8}/></div>
            </div>
            <div style={{ fontWeight:700,fontSize:15,marginBottom:2 }}>{med.name}</div>
            <div style={{ fontSize:11,color:colors.muted,marginBottom:10 }}>Brand: {med.brand}</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:12 }}>
              {[med.dose,med.frequency,med.condition].map(tag=>(
                <span key={tag} style={{ padding:"3px 10px",borderRadius:20,border:"1.5px solid #e0e0e0",fontSize:10,fontWeight:500,color:colors.secondary }}>{tag}</span>
              ))}
            </div>
            <div style={{ display:"flex",gap:8 }}>
              <div className="tap" onClick={()=>setShowAI(true)} style={{ flex:1,background:colors.black,borderRadius:9,padding:"9px",color:"white",fontWeight:700,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",gap:5 }}>
                <Icon name="sparkle" size={12} color="white" sw={1.8}/> AI Education
              </div>
              <div className="tap" onClick={()=>setTakenToday(p=>taken?p.filter(x=>x!==med.id):[...p,med.id])}
                style={{ flex:1,border:`1.5px solid ${taken?colors.black:"#e0e0e0"}`,background:taken?colors.black:"white",borderRadius:9,padding:"9px",fontWeight:700,fontSize:11,color:taken?"white":colors.black,display:"flex",alignItems:"center",justifyContent:"center",gap:5 }}>
                {taken&&<Icon name="check" size={12} color="white" sw={3}/>}{taken?"Taken":"Mark Taken"}
              </div>
            </div>
          </div>
        );
      })}

      {showAI&&(
        <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",zIndex:50,display:"flex",alignItems:"flex-end" }} onClick={()=>setShowAI(false)}>
          <div className="sup" style={{ background:"white",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"88%",overflowY:"auto",padding:20 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
              <div>
                <div style={{ fontWeight:700,fontSize:18 }}>Lisinopril</div>
                <div style={{ fontSize:12,color:colors.muted,display:"flex",alignItems:"center",gap:4,marginTop:2 }}>
                  <Icon name="sparkle" size={11} color={colors.muted} sw={1.8}/> AI Medication Education
                </div>
              </div>
              <div className="tap" onClick={()=>setShowAI(false)}><Icon name="close" size={22} color={colors.light} sw={2}/></div>
            </div>
            <div style={{ display:"flex",gap:8,marginBottom:12 }}>
              {[{l:"Generic",v:AI_EDUCATION.generic},{l:"Drug Class",v:AI_EDUCATION.drugClass}].map(c=>(
                <div key={c.l} style={{ flex:1,background:colors.offWhite,borderRadius:10,padding:10,border:`1px solid ${colors.border}` }}>
                  <div style={{ fontSize:9,fontWeight:700,color:colors.muted,textTransform:"uppercase",letterSpacing:0.4,marginBottom:3 }}>{c.l}</div>
                  <div style={{ fontSize:12,fontWeight:700 }}>{c.v}</div>
                </div>
              ))}
            </div>
            <div style={{ background:"#f8f8f8",borderLeft:`3px solid ${colors.black}`,padding:"10px 12px",borderRadius:"0 8px 8px 0",marginBottom:12 }}>
              <div style={{ fontSize:12,color:colors.secondary,lineHeight:1.6 }}>{AI_EDUCATION.notes}</div>
            </div>
            {[{t:"Common Conditions",items:AI_EDUCATION.conditions,c:colors.black},{t:"⚠ Side Effects",items:AI_EDUCATION.sideEffects,c:colors.danger},{t:"Pros",items:AI_EDUCATION.pros,c:colors.success},{t:"Cons",items:AI_EDUCATION.cons,c:colors.danger}].map(s=>(
              <div key={s.t} style={{ background:colors.white,border:`1px solid ${colors.border}`,borderRadius:12,padding:12,marginBottom:8 }}>
                <div style={{ fontWeight:700,fontSize:13,color:s.c,marginBottom:8 }}>{s.t}</div>
                {s.items.map(item=>(
                  <div key={item} style={{ display:"flex",gap:8,alignItems:"flex-start",padding:"4px 0",borderBottom:"1px solid #f5f5f5" }}>
                    <div style={{ width:5,height:5,borderRadius:"50%",background:colors.black,marginTop:6,flexShrink:0 }}/>
                    <span style={{ fontSize:12,color:colors.secondary,lineHeight:1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
            <div style={{ fontSize:10,color:colors.muted,textAlign:"center",padding:"8px 0 4px",lineHeight:1.6 }}>Educational only · Always consult your doctor or pharmacist</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CALENDAR ────────────────────────────────────────────────────────────────
function CalendarView({ logs, selected, setSelected }) {
  const DAYS=["Su","Mo","Tu","We","Th","Fr","Sa"];
  const ds=(d)=>`2025-03-${String(d).padStart(2,"0")}`;
  const selLog=logs[selected];

  return (
    <div style={{ padding:"16px 16px 24px" }}>
      <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:22,fontWeight:400,marginBottom:16 }}>Calendar</h1>

      {/* Month grid */}
      <div style={{ background:colors.white,borderRadius:16,padding:16,border:`1px solid ${colors.border}`,marginBottom:12 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
          <div style={{ width:30,height:30,borderRadius:8,border:"1.5px solid #e0e0e0",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Icon name="chevL" size={16} color={colors.secondary} sw={2}/>
          </div>
          <span style={{ fontWeight:700,fontSize:14 }}>March 2025</span>
          <div style={{ width:30,height:30,borderRadius:8,border:"1.5px solid #e0e0e0",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Icon name="chevR" size={16} color={colors.secondary} sw={2}/>
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",textAlign:"center",marginBottom:6 }}>
          {DAYS.map(d=><div key={d} style={{ fontSize:10,fontWeight:700,color:colors.muted,padding:"2px 0" }}>{d}</div>)}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",textAlign:"center",gap:"2px 0" }}>
          {Array(6).fill(null).map((_,i)=><div key={`e${i}`}/>)}
          {Array(31).fill(null).map((_,i)=>{
            const day=i+1, d=ds(day);
            const isToday=d==="2025-03-09", isSel=d===selected;
            const hasLog=!!(logs[d]?.taken?.length||logs[d]?.symptoms||logs[d]?.notes);
            return (
              <div key={day} className="tap" onClick={()=>setSelected(d)}
                style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:34,borderRadius:"50%",background:isSel?colors.black:isToday?"#f0f0f0":"transparent",border:isToday&&!isSel?`2px solid ${colors.black}`:"2px solid transparent",position:"relative" }}>
                <span style={{ fontSize:12,fontWeight:isSel||isToday?700:400,color:isSel?"white":colors.black }}>{day}</span>
                {hasLog&&!isSel&&<div style={{ width:4,height:4,borderRadius:"50%",background:colors.black,position:"absolute",bottom:2 }}/>}
              </div>
            );
          })}
        </div>
        <div style={{ display:"flex",gap:16,marginTop:12,paddingTop:10,borderTop:`1px solid ${colors.border}` }}>
          <div style={{ display:"flex",alignItems:"center",gap:5 }}><div style={{ width:10,height:10,borderRadius:"50%",background:colors.black }}/><span style={{ fontSize:11,color:colors.muted }}>Selected</span></div>
          <div style={{ display:"flex",alignItems:"center",gap:5 }}><div style={{ width:5,height:5,borderRadius:"50%",background:colors.black }}/><span style={{ fontSize:11,color:colors.muted }}>Has entry</span></div>
        </div>
      </div>

      {/* Day detail */}
      <div style={{ background:colors.white,borderRadius:16,padding:16,border:`1px solid ${colors.border}` }}>
        <div style={{ fontWeight:700,fontSize:15,marginBottom:14 }}>
          {new Date(selected+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}
        </div>

        {selLog ? (
          <>
            {/* Medications */}
            <div style={{ display:"flex",alignItems:"center",gap:5,marginBottom:8 }}>
              <Icon name="medkit" size={12} color={colors.secondary} sw={2}/>
              <span style={{ fontSize:10,fontWeight:700,color:colors.secondary,textTransform:"uppercase",letterSpacing:0.5 }}>Medications</span>
            </div>
            {MEDICATIONS.map(med=>{
              const taken=selLog.taken?.includes(med.id);
              return (
                <div key={med.id} style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid #f5f5f5" }}>
                  <div style={{ width:18,height:18,borderRadius:"50%",background:taken?colors.black:"#e0e0e0",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    {taken&&<Icon name="check" size={10} color="white" sw={3}/>}
                  </div>
                  <span style={{ fontSize:13,fontWeight:500,flex:1,color:taken?colors.black:colors.muted }}>{med.name}</span>
                  <span style={{ fontSize:11,color:colors.muted }}>{med.dose}</span>
                </div>
              );
            })}

            {/* ── JOURNAL ── */}
            <div style={{ marginTop:14,paddingTop:14,borderTop:`1px solid ${colors.border}` }}>
              <div style={{ display:"flex",alignItems:"center",gap:5,marginBottom:10 }}>
                <Icon name="journal" size={12} color={colors.secondary} sw={2}/>
                <span style={{ fontSize:10,fontWeight:700,color:colors.secondary,textTransform:"uppercase",letterSpacing:0.5 }}>Daily Journal</span>
              </div>

              <div style={{ fontSize:10,fontWeight:600,color:colors.muted,textTransform:"uppercase",letterSpacing:0.4,marginBottom:5 }}>Symptoms</div>
              {selLog.symptoms
                ? <div style={{ background:colors.offWhite,borderRadius:8,padding:"9px 12px",fontSize:12,color:colors.secondary,lineHeight:1.6,marginBottom:10 }}>{selLog.symptoms}</div>
                : <div style={{ border:`1px dashed ${colors.border}`,borderRadius:8,padding:"9px 12px",fontSize:12,color:colors.light,fontStyle:"italic",marginBottom:10 }}>No symptoms recorded</div>
              }

              <div style={{ fontSize:10,fontWeight:600,color:colors.muted,textTransform:"uppercase",letterSpacing:0.4,marginBottom:5 }}>Notes</div>
              {selLog.notes
                ? <div style={{ background:colors.offWhite,borderRadius:8,padding:"9px 12px",fontSize:12,color:colors.secondary,lineHeight:1.6 }}>{selLog.notes}</div>
                : <div style={{ border:`1px dashed ${colors.border}`,borderRadius:8,padding:"9px 12px",fontSize:12,color:colors.light,fontStyle:"italic" }}>No notes recorded</div>
              }
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center",padding:"24px 0",color:colors.light }}>
            <Icon name="calendar" size={36} color={colors.border} sw={1.5}/>
            <div style={{ fontSize:13,marginTop:10,fontWeight:500 }}>No log for this date</div>
            <div style={{ fontSize:11,marginTop:4 }}>Tap a highlighted day to view details</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── REMINDERS ───────────────────────────────────────────────────────────────
function RemindersView() {
  return (
    <div style={{ padding:"16px 16px 24px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
        <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:22,fontWeight:400 }}>Reminders</h1>
        <div className="tap" style={{ background:colors.black,borderRadius:8,padding:"6px 12px",color:"white",fontWeight:700,fontSize:12,display:"flex",alignItems:"center",gap:5 }}>
          <Icon name="plus" size={14} color="white" sw={2.5}/> Add
        </div>
      </div>
      {REMINDERS.map(r=>(
        <div key={r.id} style={{ background:colors.white,borderRadius:14,padding:"14px 16px",border:`1px solid ${colors.border}`,marginBottom:8,display:"flex",alignItems:"center",gap:14 }}>
          <div style={{ width:42,height:42,background:colors.black,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Icon name="alarm" size={20} color="white" sw={1.8}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:20,fontWeight:700,lineHeight:1.2 }}>{fmt12(r.time)}</div>
            <div style={{ fontSize:12,color:colors.muted }}>{r.medName}</div>
            {r.label&&<div style={{ fontSize:11,color:colors.light }}>{r.label}</div>}
          </div>
          <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6 }}>
            <span style={{ padding:"2px 8px",borderRadius:20,fontSize:9,fontWeight:700,background:"#f5f5f5",color:colors.secondary,letterSpacing:0.3 }}>DAILY</span>
            <div className="tap"><Icon name="trash" size={15} color={colors.light} sw={1.8}/></div>
          </div>
        </div>
      ))}
      <div style={{ background:colors.white,borderRadius:12,padding:12,border:`1px solid ${colors.border}`,marginTop:4,display:"flex",gap:8,alignItems:"flex-start" }}>
        <Icon name="info" size={16} color={colors.muted} sw={1.8}/>
        <span style={{ fontSize:11,color:colors.muted,lineHeight:1.6 }}>Reminders fire daily via expo-notifications even when the app is closed.</span>
      </div>
    </div>
  );
}

// ─── PHARMACY ────────────────────────────────────────────────────────────────
function PharmacyView() {
  const [sent,setSent]=useState(null);
  return (
    <div style={{ padding:"16px 16px 24px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
        <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:22,fontWeight:400 }}>Pharmacy</h1>
        <div className="tap" style={{ background:colors.black,borderRadius:8,padding:"6px 12px",color:"white",fontWeight:700,fontSize:12,display:"flex",alignItems:"center",gap:5 }}>
          <Icon name="plus" size={14} color="white" sw={2.5}/> Link
        </div>
      </div>
      {PHARMACIES.map(ph=>(
        <div key={ph.id} style={{ background:colors.white,borderRadius:16,padding:16,border:`1px solid ${colors.border}`,marginBottom:12 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
            <div style={{ width:40,height:40,background:colors.black,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Icon name="store" size={20} color="white" sw={1.8}/>
            </div>
            <span style={{ padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:700,background:colors.successBg,color:colors.success,display:"flex",alignItems:"center",gap:4 }}>
              <Icon name="check" size={10} color={colors.success} sw={3}/> Linked
            </span>
          </div>
          <div style={{ fontWeight:700,fontSize:15,marginBottom:8 }}>{ph.name}</div>
          <div style={{ fontSize:12,color:colors.muted,marginBottom:3 }}>📍 {ph.address}</div>
          <div style={{ fontSize:12,color:colors.muted,marginBottom:14 }}>📞 {ph.phone}</div>
          <div style={{ fontSize:10,fontWeight:700,color:colors.secondary,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8,paddingTop:10,borderTop:`1px solid ${colors.border}` }}>Quick Refill</div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:12 }}>
            {MEDICATIONS.map(med=>(
              <div key={med.id} className="tap" onClick={()=>setSent(med.id)}
                style={{ padding:"5px 10px",borderRadius:20,border:"1.5px solid #e0e0e0",fontSize:11,fontWeight:500,background:sent===med.id?colors.black:"white",color:sent===med.id?"white":colors.secondary,display:"flex",alignItems:"center",gap:4,transition:"all .2s" }}>
                {sent===med.id?<Icon name="check" size={10} color="white" sw={3}/>:<Icon name="refresh" size={10} color={colors.muted} sw={2}/>}
                {med.name} {med.dose}
              </div>
            ))}
          </div>
          <div className="tap" style={{ background:colors.black,borderRadius:10,padding:"11px",textAlign:"center",color:"white",fontWeight:700,fontSize:13 }}>Request All Refills</div>
        </div>
      ))}
    </div>
  );
}

// ─── AI CHAT ─────────────────────────────────────────────────────────────────
function AIChatView({ chatInput, setChatInput }) {
  const [msgs,setMsgs]=useState(CHAT_SEED);
  const [loading,setLoading]=useState(false);
  function send() {
    if(!chatInput.trim())return;
    const m=chatInput.trim(); setChatInput("");
    setMsgs(p=>[...p,{role:"user",content:m}]);
    setLoading(true);
    setTimeout(()=>{ setMsgs(p=>[...p,{role:"ai",content:"That's a great question about your medications. Based on your current regimen, I'd strongly recommend discussing this with your pharmacist or doctor for personalized advice. Always take medications as prescribed and report any unusual symptoms promptly."}]); setLoading(false); },1200);
  }
  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%" }}>
      <div style={{ background:colors.white,padding:"10px 16px",borderBottom:`1px solid ${colors.border}`,display:"flex",alignItems:"center",gap:10,flexShrink:0 }}>
        <div style={{ width:36,height:36,background:colors.black,borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <Icon name="sparkle" size={16} color="white" sw={1.8}/>
        </div>
        <div>
          <div style={{ fontWeight:700,fontSize:13 }}>SyncraMed AI</div>
          <div style={{ fontSize:10,color:colors.muted }}>Clinical Pharmacist Assistant</div>
        </div>
      </div>
      <div style={{ flex:1,padding:"12px",overflowY:"auto",display:"flex",flexDirection:"column",gap:10 }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:8,alignItems:"flex-end" }}>
            {m.role==="ai"&&<div style={{ width:24,height:24,background:colors.black,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><Icon name="sparkle" size={11} color="white" sw={2}/></div>}
            <div style={{ maxWidth:"76%",padding:"10px 12px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:m.role==="user"?colors.black:colors.white,border:m.role==="ai"?`1.5px solid ${colors.border}`:"none",fontSize:12,lineHeight:1.6,color:m.role==="user"?"white":colors.secondary }}>{m.content}</div>
          </div>
        ))}
        {loading&&(
          <div style={{ display:"flex",gap:8,alignItems:"flex-end" }}>
            <div style={{ width:24,height:24,background:colors.black,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center" }}><Icon name="sparkle" size={11} color="white" sw={2}/></div>
            <div style={{ background:colors.white,border:`1.5px solid ${colors.border}`,borderRadius:"16px 16px 16px 4px",padding:"12px 14px",display:"flex",gap:4,alignItems:"center" }}>
              <div className="dot1" style={{ width:6,height:6,background:"#ccc",borderRadius:"50%" }}/>
              <div className="dot2" style={{ width:6,height:6,background:"#ccc",borderRadius:"50%" }}/>
              <div className="dot3" style={{ width:6,height:6,background:"#ccc",borderRadius:"50%" }}/>
            </div>
          </div>
        )}
      </div>
      <div style={{ padding:"10px 12px 12px",background:colors.white,borderTop:`1px solid ${colors.border}`,flexShrink:0 }}>
        <div style={{ fontSize:9,color:colors.light,marginBottom:6,textAlign:"center" }}>Tracking: Lisinopril · Metformin · Atorvastatin</div>
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Ask about your medications..."
            style={{ flex:1,border:"1.5px solid #e0e0e0",borderRadius:20,padding:"9px 14px",fontSize:12,fontFamily:"inherit" }}/>
          <div className="tap" onClick={send} style={{ width:36,height:36,background:colors.black,borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <Icon name="up" size={16} color="white" sw={2.5}/>
          </div>
        </div>
        <div style={{ fontSize:9,color:colors.light,textAlign:"center",marginTop:5 }}>Educational only · Not medical advice</div>
      </div>
    </div>
  );
}
