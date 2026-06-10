import { useState } from "react"

// ⚙️ CONFIGURA AQUÍ TU LINK DE SUSCRIPCIÓN DE MERCADOPAGO
const MP_LINK = "https://www.mercadopago.com.mx/subscriptions" // ← Reemplaza con tu link real
const WHATSAPP = "5219931598038" // Tu WhatsApp para soporte
const PRECIO = "99" // MXN mensuales

const C = {
  bg:"#0D0B14", bg2:"#161226", card:"#1C1730",
  violet:"#8B5CF6", violetL:"#A78BFA", gold:"#F0C75E", goldD:"#C9A227",
  text:"#F2EFFA", text2:"#B8B0D0", text3:"#7A7295",
  border:"rgba(139,92,246,0.25)",
}

const SIGNOS = [
  {n:"Aries",e:"♈",f:"21 mar - 19 abr"},{n:"Tauro",e:"♉",f:"20 abr - 20 may"},
  {n:"Géminis",e:"♊",f:"21 may - 20 jun"},{n:"Cáncer",e:"♋",f:"21 jun - 22 jul"},
  {n:"Leo",e:"♌",f:"23 jul - 22 ago"},{n:"Virgo",e:"♍",f:"23 ago - 22 sep"},
  {n:"Libra",e:"♎",f:"23 sep - 22 oct"},{n:"Escorpio",e:"♏",f:"23 oct - 21 nov"},
  {n:"Sagitario",e:"♐",f:"22 nov - 21 dic"},{n:"Capricornio",e:"♑",f:"22 dic - 19 ene"},
  {n:"Acuario",e:"♒",f:"20 ene - 18 feb"},{n:"Piscis",e:"♓",f:"19 feb - 20 mar"},
]

const ARCANOS = [
  "El Loco","El Mago","La Sacerdotisa","La Emperatriz","El Emperador","El Hierofante",
  "Los Enamorados","El Carro","La Fuerza","El Ermitaño","La Rueda de la Fortuna","La Justicia",
  "El Colgado","La Muerte","La Templanza","El Diablo","La Torre","La Estrella",
  "La Luna","El Sol","El Juicio","El Mundo"
]

const s = {
  wrap:{minHeight:"100vh",background:`radial-gradient(ellipse at top, #1a1230 0%, ${C.bg} 55%)`,color:C.text,fontFamily:"'Georgia',serif",paddingBottom:60},
  center:{maxWidth:680,margin:"0 auto",padding:"0 1.25rem"},
  hero:{textAlign:"center",padding:"3.5rem 1rem 2rem"},
  logo:{fontSize:44,marginBottom:8},
  h1:{fontSize:30,fontWeight:700,color:C.gold,margin:"0 0 8px",letterSpacing:1},
  tagline:{fontSize:15,color:C.text2,fontStyle:"italic",margin:0},
  nav:{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",margin:"2rem 0 1.5rem"},
  navBtn:{padding:"10px 20px",background:C.card,border:`1px solid ${C.border}`,borderRadius:24,color:C.text2,fontSize:14,cursor:"pointer",fontFamily:"inherit"},
  navSel:{border:`1px solid ${C.gold}`,background:"rgba(240,199,94,0.08)",color:C.gold},
  card:{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:"1.75rem",marginBottom:16},
  signGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:10},
  signBtn:{padding:"14px 8px",background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,color:C.text2,cursor:"pointer",textAlign:"center",fontFamily:"inherit",transition:"all .2s"},
  signSel:{border:`1px solid ${C.gold}`,background:"rgba(240,199,94,0.1)",color:C.gold},
  signEmoji:{fontSize:26,display:"block",marginBottom:4},
  signName:{fontSize:13,fontWeight:600},
  signDate:{fontSize:10,color:C.text3,display:"block",marginTop:2},
  btnGold:{padding:"13px 34px",background:`linear-gradient(135deg, ${C.gold}, ${C.goldD})`,color:"#1a1230",border:"none",borderRadius:28,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit",letterSpacing:.5,display:"block",margin:"1.5rem auto 0"},
  btnViolet:{padding:"13px 34px",background:`linear-gradient(135deg, ${C.violet}, #6D28D9)`,color:"#fff",border:"none",borderRadius:28,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit",letterSpacing:.5,display:"block",margin:"1.5rem auto 0"},
  lectura:{background:C.bg2,border:`1px solid rgba(240,199,94,0.3)`,borderRadius:14,padding:"1.5rem",marginTop:20,fontSize:15,lineHeight:1.9,whiteSpace:"pre-wrap",color:C.text},
  input:{width:"100%",padding:"12px 14px",background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:10},
  cartaWrap:{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",margin:"1.5rem 0"},
  carta:{width:90,height:140,background:`linear-gradient(135deg, #2a1f4a, #1a1230)`,border:`2px solid ${C.violet}`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,cursor:"pointer",transition:"transform .3s",color:C.violetL},
  cartaSel:{border:`2px solid ${C.gold}`,background:`linear-gradient(135deg, #3a2a1a, #2a1f0a)`,transform:"translateY(-8px)",color:C.gold},
  premium:{display:"inline-block",background:`linear-gradient(135deg, ${C.gold}, ${C.goldD})`,color:"#1a1230",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:10,letterSpacing:1,verticalAlign:"middle",marginLeft:8},
  precio:{textAlign:"center",padding:"2rem 0"},
  precioNum:{fontSize:46,fontWeight:700,color:C.gold},
  feature:{display:"flex",gap:10,alignItems:"flex-start",padding:"7px 0",fontSize:14,color:C.text2},
  loading:{textAlign:"center",padding:"2rem",fontSize:15,color:C.violetL},
  error:{background:"rgba(239,83,80,0.1)",border:"1px solid rgba(239,83,80,0.3)",borderRadius:10,padding:"12px 16px",color:"#ef9a9a",fontSize:14,marginTop:14},
  footer:{textAlign:"center",fontSize:12,color:C.text3,marginTop:40,lineHeight:1.8},
}

export default function App() {
  const [tab, setTab] = useState("horoscopo")
  const [signo, setSigno] = useState(null)
  const [signo2, setSigno2] = useState(null)
  const [nombre, setNombre] = useState("")
  const [nombre2, setNombre2] = useState("")
  const [pregunta, setPregunta] = useState("")
  const [cartasSel, setCartasSel] = useState([])
  const [mazo] = useState(() => [...ARCANOS].sort(() => Math.random() - 0.5).slice(0, 7))
  const [codigo, setCodigo] = useState(localStorage.getItem("oraculo_codigo") || "")
  const [lectura, setLectura] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

  const consultar = async (payload) => {
    setCargando(true); setError(""); setLectura("")
    try {
      const r = await fetch("/api/oraculo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const d = await r.json()
      if (d.error === "CODIGO_INVALIDO") {
        setError("⭐ Esta función es premium. Suscríbete abajo para recibir tu código de acceso.")
      } else if (d.error) {
        setError(d.error)
      } else {
        setLectura(d.lectura)
        if (payload.codigo) localStorage.setItem("oraculo_codigo", payload.codigo)
      }
    } catch (e) {
      setError("El oráculo no responde, intenta de nuevo")
    }
    setCargando(false)
  }

  const toggleCarta = (c) => {
    if (cartasSel.includes(c)) setCartasSel(cartasSel.filter(x => x !== c))
    else if (cartasSel.length < 3) setCartasSel([...cartasSel, c])
  }

  const cambiarTab = (t) => { setTab(t); setLectura(""); setError(""); setCartasSel([]) }

  return (
    <div style={s.wrap}>
      <div style={s.center}>

        <div style={s.hero}>
          <div style={s.logo}>🔮</div>
          <h1 style={s.h1}>ORÁCULO IA</h1>
          <p style={s.tagline}>Tu destino, revelado por las estrellas y la inteligencia artificial</p>
        </div>

        <div style={s.nav}>
          <button style={{...s.navBtn,...(tab==="horoscopo"?s.navSel:{})}} onClick={()=>cambiarTab("horoscopo")}>✨ Horóscopo HOY — Gratis</button>
          <button style={{...s.navBtn,...(tab==="tarot"?s.navSel:{})}} onClick={()=>cambiarTab("tarot")}>🃏 Tarot</button>
          <button style={{...s.navBtn,...(tab==="compatibilidad"?s.navSel:{})}} onClick={()=>cambiarTab("compatibilidad")}>💕 Compatibilidad</button>
        </div>

        {/* ─── HORÓSCOPO GRATIS ─── */}
        {tab==="horoscopo" && (
          <div style={s.card}>
            <p style={{textAlign:"center",color:C.text2,fontSize:14,marginTop:0}}>Elige tu signo y descubre lo que los astros tienen para ti hoy</p>
            <div style={s.signGrid}>
              {SIGNOS.map(sg=>(
                <button key={sg.n} style={{...s.signBtn,...(signo===sg.n?s.signSel:{})}} onClick={()=>setSigno(sg.n)}>
                  <span style={s.signEmoji}>{sg.e}</span>
                  <span style={s.signName}>{sg.n}</span>
                  <span style={s.signDate}>{sg.f}</span>
                </button>
              ))}
            </div>
            {signo && (
              <button style={s.btnGold} onClick={()=>consultar({tipo:"horoscopo",signo})} disabled={cargando}>
                {cargando ? "Consultando los astros..." : `✨ Revelar mi horóscopo de hoy`}
              </button>
            )}
          </div>
        )}

        {/* ─── TAROT PREMIUM ─── */}
        {tab==="tarot" && (
          <div style={s.card}>
            <p style={{textAlign:"center",color:C.text2,fontSize:14,marginTop:0}}>
              Concéntrate en tu pregunta y elige 3 cartas <span style={s.premium}>PREMIUM</span>
            </p>
            <input style={s.input} placeholder="¿Qué quieres preguntarle al oráculo? (opcional)" value={pregunta} onChange={e=>setPregunta(e.target.value)}/>
            <div style={s.cartaWrap}>
              {mazo.map(c=>(
                <div key={c} style={{...s.carta,...(cartasSel.includes(c)?s.cartaSel:{})}} onClick={()=>toggleCarta(c)}>
                  {cartasSel.includes(c) ? "✦" : "🌙"}
                </div>
              ))}
            </div>
            <p style={{textAlign:"center",fontSize:13,color:C.text3}}>
              {cartasSel.length}/3 cartas elegidas {cartasSel.length===3 && "— Pasado · Presente · Futuro"}
            </p>
            <input style={s.input} placeholder="Tu código premium" value={codigo} onChange={e=>setCodigo(e.target.value)}/>
            {cartasSel.length===3 && (
              <button style={s.btnViolet} onClick={()=>consultar({tipo:"tarot",cartas:cartasSel,pregunta,codigo})} disabled={cargando}>
                {cargando ? "Las cartas hablan..." : "🃏 Revelar mi lectura"}
              </button>
            )}
          </div>
        )}

        {/* ─── COMPATIBILIDAD PREMIUM ─── */}
        {tab==="compatibilidad" && (
          <div style={s.card}>
            <p style={{textAlign:"center",color:C.text2,fontSize:14,marginTop:0}}>
              Descubre la química entre dos almas <span style={s.premium}>PREMIUM</span>
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div>
                <input style={s.input} placeholder="Tu nombre" value={nombre} onChange={e=>setNombre(e.target.value)}/>
                <select style={s.input} value={signo||""} onChange={e=>setSigno(e.target.value)}>
                  <option value="">Tu signo...</option>
                  {SIGNOS.map(sg=><option key={sg.n} value={sg.n}>{sg.e} {sg.n}</option>)}
                </select>
              </div>
              <div>
                <input style={s.input} placeholder="Su nombre" value={nombre2} onChange={e=>setNombre2(e.target.value)}/>
                <select style={s.input} value={signo2||""} onChange={e=>setSigno2(e.target.value)}>
                  <option value="">Su signo...</option>
                  {SIGNOS.map(sg=><option key={sg.n} value={sg.n}>{sg.e} {sg.n}</option>)}
                </select>
              </div>
            </div>
            <input style={s.input} placeholder="Tu código premium" value={codigo} onChange={e=>setCodigo(e.target.value)}/>
            {signo && signo2 && (
              <button style={s.btnViolet} onClick={()=>consultar({tipo:"compatibilidad",signo,signo2,nombre,nombre2,codigo})} disabled={cargando}>
                {cargando ? "Leyendo sus estrellas..." : "💕 Revelar compatibilidad"}
              </button>
            )}
          </div>
        )}

        {cargando && <div style={s.loading}>🔮 El oráculo está consultando el cosmos...</div>}
        {error && <div style={s.error}>{error}</div>}
        {lectura && <div style={s.lectura}>{lectura}</div>}

        {/* ─── SUSCRIPCIÓN ─── */}
        <div style={{...s.card,marginTop:36,border:`1px solid rgba(240,199,94,0.4)`}}>
          <div style={s.precio}>
            <div style={{fontSize:13,color:C.text3,letterSpacing:2,marginBottom:6}}>ACCESO PREMIUM</div>
            <span style={s.precioNum}>${PRECIO}</span>
            <span style={{fontSize:16,color:C.text2}}> MXN/mes</span>
          </div>
          <div style={s.feature}><span>🃏</span><span>Lecturas de tarot ilimitadas con interpretación personalizada</span></div>
          <div style={s.feature}><span>💕</span><span>Análisis de compatibilidad con quien tú quieras</span></div>
          <div style={s.feature}><span>⚡</span><span>Respuestas al instante, 24/7, sin citas ni esperas</span></div>
          <div style={s.feature}><span>🔐</span><span>100% privado — nadie más ve tus consultas</span></div>
          <a href={MP_LINK} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
            <button style={s.btnGold}>⭐ Suscribirme ahora</button>
          </a>
          <p style={{textAlign:"center",fontSize:12,color:C.text3,marginTop:14}}>
            Después de suscribirte recibirás tu código premium por WhatsApp en menos de 1 hora.<br/>
            ¿Dudas? <a href={`https://wa.me/${WHATSAPP}`} style={{color:C.violetL}}>Escríbenos</a>
          </p>
        </div>

        <div style={s.footer}>
          🔮 Oráculo IA · Entretenimiento y orientación espiritual<br/>
          Las lecturas son generadas con inteligencia artificial y no sustituyen consejo profesional.
        </div>

      </div>
    </div>
  )
}
