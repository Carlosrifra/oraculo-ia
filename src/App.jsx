import { useState, useEffect } from "react"
import { auth } from "./firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"

// ⚙️ CONFIGURA AQUÍ TU LINK DE SUSCRIPCIÓN DE MERCADOPAGO
const MP_LINK = "https://www.mercadopago.com.mx/subscriptions" // ← Reemplaza con tu link real
const WHATSAPP = "5219931598038"
const PRECIO = "99"

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

const PARTIDOS = [
  {f:"11 jun",h:"13:00",e1:"México",c1:"mx",e2:"Sudáfrica",c2:"za",sede:"CDMX · Inaugural"},
  {f:"11 jun",h:"20:00",e1:"Corea del Sur",c1:"kr",e2:"Rep. Checa",c2:"cz",sede:"Guadalajara"},
  {f:"12 jun",h:"13:00",e1:"Canadá",c1:"ca",e2:"Bosnia",c2:"ba",sede:"Toronto"},
  {f:"12 jun",h:"19:00",e1:"Estados Unidos",c1:"us",e2:"Paraguay",c2:"py",sede:"Los Ángeles"},
  {f:"13 jun",h:"13:00",e1:"Qatar",c1:"qa",e2:"Suiza",c2:"ch",sede:"San Francisco"},
  {f:"13 jun",h:"16:00",e1:"Brasil",c1:"br",e2:"Marruecos",c2:"ma",sede:"Nueva Jersey"},
  {f:"13 jun",h:"19:00",e1:"Haití",c1:"ht",e2:"Escocia",c2:"gb-sct",sede:"Boston"},
  {f:"13 jun",h:"22:00",e1:"Australia",c1:"au",e2:"Turquía",c2:"tr",sede:"Vancouver"},
  {f:"14 jun",h:"11:00",e1:"Alemania",c1:"de",e2:"Curazao",c2:"cw",sede:"Houston"},
  {f:"14 jun",h:"14:00",e1:"Países Bajos",c1:"nl",e2:"Japón",c2:"jp",sede:"Dallas"},
  {f:"14 jun",h:"17:00",e1:"Costa de Marfil",c1:"ci",e2:"Ecuador",c2:"ec",sede:"Philadelphia"},
  {f:"14 jun",h:"20:00",e1:"Suecia",c1:"se",e2:"Túnez",c2:"tn",sede:"Monterrey"},
  {f:"15 jun",h:"10:00",e1:"España",c1:"es",e2:"Cabo Verde",c2:"cv",sede:"Atlanta"},
  {f:"15 jun",h:"13:00",e1:"Bélgica",c1:"be",e2:"Egipto",c2:"eg",sede:"Seattle"},
  {f:"15 jun",h:"16:00",e1:"Arabia Saudita",c1:"sa",e2:"Uruguay",c2:"uy",sede:"Miami"},
  {f:"15 jun",h:"19:00",e1:"Irán",c1:"ir",e2:"Nueva Zelanda",c2:"nz",sede:"Los Ángeles"},
  {f:"16 jun",h:"13:00",e1:"Francia",c1:"fr",e2:"Senegal",c2:"sn",sede:"Nueva Jersey"},
  {f:"16 jun",h:"16:00",e1:"Irak",c1:"iq",e2:"Noruega",c2:"no",sede:"Boston"},
  {f:"16 jun",h:"19:00",e1:"Argentina",c1:"ar",e2:"Argelia",c2:"dz",sede:"Kansas City"},
  {f:"16 jun",h:"22:00",e1:"Austria",c1:"at",e2:"Jordania",c2:"jo",sede:"San Francisco"},
  {f:"17 jun",h:"11:00",e1:"Portugal",c1:"pt",e2:"RD Congo",c2:"cd",sede:"Houston"},
  {f:"17 jun",h:"14:00",e1:"Inglaterra",c1:"gb-eng",e2:"Croacia",c2:"hr",sede:"Dallas"},
  {f:"17 jun",h:"17:00",e1:"Ghana",c1:"gh",e2:"Panamá",c2:"pa",sede:"Toronto"},
  {f:"17 jun",h:"20:00",e1:"Uzbekistán",c1:"uz",e2:"Colombia",c2:"co",sede:"CDMX"},
  {f:"18 jun",h:"10:00",e1:"Rep. Checa",c1:"cz",e2:"Sudáfrica",c2:"za",sede:"Atlanta"},
  {f:"18 jun",h:"13:00",e1:"Suiza",c1:"ch",e2:"Bosnia",c2:"ba",sede:"Los Ángeles"},
  {f:"18 jun",h:"16:00",e1:"Canadá",c1:"ca",e2:"Qatar",c2:"qa",sede:"Vancouver"},
  {f:"18 jun",h:"19:00",e1:"México",c1:"mx",e2:"Corea del Sur",c2:"kr",sede:"Guadalajara"},
  {f:"19 jun",h:"13:00",e1:"Estados Unidos",c1:"us",e2:"Australia",c2:"au",sede:"Seattle"},
  {f:"19 jun",h:"16:00",e1:"Escocia",c1:"gb-sct",e2:"Marruecos",c2:"ma",sede:"Boston"},
  {f:"19 jun",h:"18:30",e1:"Brasil",c1:"br",e2:"Haití",c2:"ht",sede:"Philadelphia"},
  {f:"19 jun",h:"21:00",e1:"Turquía",c1:"tr",e2:"Paraguay",c2:"py",sede:"San Francisco"},
  {f:"20 jun",h:"11:00",e1:"Países Bajos",c1:"nl",e2:"Suecia",c2:"se",sede:"Houston"},
  {f:"20 jun",h:"14:00",e1:"Alemania",c1:"de",e2:"Costa de Marfil",c2:"ci",sede:"Toronto"},
  {f:"20 jun",h:"20:00",e1:"Ecuador",c1:"ec",e2:"Curazao",c2:"cw",sede:"Kansas City"},
  {f:"20 jun",h:"22:00",e1:"Túnez",c1:"tn",e2:"Japón",c2:"jp",sede:"Monterrey"},
  {f:"21 jun",h:"10:00",e1:"España",c1:"es",e2:"Arabia Saudita",c2:"sa",sede:"Atlanta"},
  {f:"21 jun",h:"13:00",e1:"Bélgica",c1:"be",e2:"Irán",c2:"ir",sede:"Los Ángeles"},
  {f:"21 jun",h:"16:00",e1:"Uruguay",c1:"uy",e2:"Cabo Verde",c2:"cv",sede:"Miami"},
  {f:"21 jun",h:"19:00",e1:"Nueva Zelanda",c1:"nz",e2:"Egipto",c2:"eg",sede:"Vancouver"},
  {f:"22 jun",h:"11:00",e1:"Argentina",c1:"ar",e2:"Austria",c2:"at",sede:"Dallas"},
  {f:"22 jun",h:"15:00",e1:"Francia",c1:"fr",e2:"Irak",c2:"iq",sede:"Philadelphia"},
  {f:"22 jun",h:"18:00",e1:"Noruega",c1:"no",e2:"Senegal",c2:"sn",sede:"Nueva Jersey"},
  {f:"22 jun",h:"21:00",e1:"Jordania",c1:"jo",e2:"Argelia",c2:"dz",sede:"San Francisco"},
  {f:"23 jun",h:"11:00",e1:"Portugal",c1:"pt",e2:"Uzbekistán",c2:"uz",sede:"Houston"},
  {f:"23 jun",h:"14:00",e1:"Inglaterra",c1:"gb-eng",e2:"Ghana",c2:"gh",sede:"Boston"},
  {f:"23 jun",h:"17:00",e1:"Panamá",c1:"pa",e2:"Croacia",c2:"hr",sede:"Toronto"},
  {f:"23 jun",h:"20:00",e1:"Colombia",c1:"co",e2:"RD Congo",c2:"cd",sede:"Guadalajara"},
]
const bandera = (c) => `https://flagcdn.com/w160/${c}.png`

const s = {
  wrap:{minHeight:"100vh",background:`radial-gradient(ellipse at top, #1a1230 0%, ${C.bg} 55%)`,color:C.text,fontFamily:"'Georgia',serif",paddingBottom:60},
  center:{maxWidth:680,margin:"0 auto",padding:"0 1.25rem"},
  hero:{textAlign:"center",padding:"3rem 1rem 1.5rem"},
  logo:{fontSize:44,marginBottom:8},
  h1:{fontSize:30,fontWeight:700,color:C.gold,margin:"0 0 8px",letterSpacing:1},
  tagline:{fontSize:15,color:C.text2,fontStyle:"italic",margin:0},
  userBar:{display:"flex",justifyContent:"center",alignItems:"center",gap:12,fontSize:13,color:C.text2,marginTop:14,flexWrap:"wrap"},
  linkBtn:{background:"none",border:"none",color:C.violetL,cursor:"pointer",fontSize:13,textDecoration:"underline",fontFamily:"inherit"},
  nav:{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",margin:"1.5rem 0"},
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
  precio:{textAlign:"center",padding:"2rem 0 1rem"},
  precioNum:{fontSize:46,fontWeight:700,color:C.gold},
  feature:{display:"flex",gap:10,alignItems:"flex-start",padding:"7px 0",fontSize:14,color:C.text2},
  loading:{textAlign:"center",padding:"2rem",fontSize:15,color:C.violetL},
  error:{background:"rgba(239,83,80,0.1)",border:"1px solid rgba(239,83,80,0.3)",borderRadius:10,padding:"12px 16px",color:"#ef9a9a",fontSize:14,marginTop:14},
  aviso:{background:"rgba(240,199,94,0.08)",border:`1px solid rgba(240,199,94,0.3)`,borderRadius:10,padding:"12px 16px",color:C.gold,fontSize:13,marginTop:14,lineHeight:1.6},
  footer:{textAlign:"center",fontSize:12,color:C.text3,marginTop:40,lineHeight:1.8},
  modal:{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:"1rem"},
  modalCard:{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:"2rem",maxWidth:400,width:"100%"},
}

export default function App() {
  const [tab, setTab] = useState("horoscopo")
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [signo, setSigno] = useState(null)
  const [signo2, setSigno2] = useState(null)
  const [nombre, setNombre] = useState("")
  const [nombre2, setNombre2] = useState("")
  const [pregunta, setPregunta] = useState("")
  const [cartasSel, setCartasSel] = useState([])
  const [mazo] = useState(() => [...ARCANOS].sort(() => Math.random() - 0.5).slice(0, 7))
  const [lectura, setLectura] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [sinSub, setSinSub] = useState(false)
  const [partido, setPartido] = useState(null)
  const [fechaNac, setFechaNac] = useState("")
  const [telefono, setTelefono] = useState("")
  const [colorFav, setColorFav] = useState("")
  const [prediccion, setPrediccion] = useState(null)

  useEffect(() => onAuthStateChanged(auth, u => setUser(u)), [])

  const autenticar = async () => {
    setAuthError("")
    try {
      if (authMode === "registro") {
        await createUserWithEmailAndPassword(auth, email.trim(), password)
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password)
      }
      setShowAuth(false); setEmail(""); setPassword("")
    } catch (e) {
      const msgs = {
        "auth/email-already-in-use": "Este correo ya tiene cuenta. Inicia sesión.",
        "auth/invalid-credential": "Correo o contraseña incorrectos",
        "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
        "auth/invalid-email": "Correo inválido",
      }
      setAuthError(msgs[e.code] || "Error: " + e.code)
    }
  }

  const consultar = async (payload) => {
    setCargando(true); setError(""); setLectura(""); setSinSub(false)
    try {
      const idToken = user ? await user.getIdToken() : null
      const r = await fetch("/api/oraculo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, idToken }),
      })
      const d = await r.json()
      if (d.error === "LOGIN_REQUERIDO") {
        setShowAuth(true)
        setError("Inicia sesión o crea tu cuenta para usar esta función")
      } else if (d.error === "SIN_SUSCRIPCION") {
        setSinSub(true)
      } else if (d.error) {
        setError(d.error)
      } else {
        setLectura(d.lectura)
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

  const cambiarTab = (t) => { setTab(t); setLectura(""); setError(""); setCartasSel([]); setSinSub(false); setPrediccion(null) }

  const predecirMundial = async () => {
    if (!partido) return
    setCargando(true); setError(""); setPrediccion(null)
    try {
      const r = await fetch("/api/oraculo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo:"mundial", equipo1:partido.e1, equipo2:partido.e2, nombreUsuario:nombre, fechaNac, telefono, colorFav }),
      })
      const d = await r.json()
      if (d.error) { setError(d.error); setCargando(false); return }
      const m = d.lectura.match(/MARCADOR:\s*(\d+)\s*-\s*(\d+)/)
      setPrediccion({ texto: d.lectura, g1: m?.[1]||"?", g2: m?.[2]||"?" })
    } catch(e) { setError("El oráculo no responde, intenta de nuevo") }
    setCargando(false)
  }

  const descargarTarjeta = async () => {
    if (!prediccion || !partido) return
    const canvas = document.createElement("canvas")
    canvas.width = 1080; canvas.height = 1350
    const ctx = canvas.getContext("2d")

    const grad = ctx.createLinearGradient(0,0,0,1350)
    grad.addColorStop(0,"#1a1230"); grad.addColorStop(1,"#0D0B14")
    ctx.fillStyle = grad; ctx.fillRect(0,0,1080,1350)

    ctx.fillStyle = "#F0C75E"; ctx.font = "bold 56px Georgia"; ctx.textAlign = "center"
    ctx.fillText("🔮 ORÁCULO IA", 540, 110)
    ctx.fillStyle = "#B8B0D0"; ctx.font = "italic 32px Georgia"
    ctx.fillText("Predicción Mística · Mundial 2026", 540, 165)

    const cargarImg = (url) => new Promise((res) => {
      const img = new Image(); img.crossOrigin = "anonymous"
      img.onload = () => res(img); img.onerror = () => res(null)
      img.src = url
    })
    const [img1, img2] = await Promise.all([cargarImg(bandera(partido.c1)), cargarImg(bandera(partido.c2))])

    if (img1) ctx.drawImage(img1, 120, 280, 280, 187)
    if (img2) ctx.drawImage(img2, 680, 280, 280, 187)
    ctx.strokeStyle = "#F0C75E"; ctx.lineWidth = 4
    ctx.strokeRect(120, 280, 280, 187); ctx.strokeRect(680, 280, 280, 187)

    ctx.fillStyle = "#F2EFFA"; ctx.font = "bold 40px Georgia"
    ctx.fillText(partido.e1, 260, 530); ctx.fillText(partido.e2, 820, 530)

    ctx.fillStyle = "#F0C75E"; ctx.font = "bold 160px Georgia"
    ctx.fillText(`${prediccion.g1} - ${prediccion.g2}`, 540, 430)

    ctx.fillStyle = "#7A7295"; ctx.font = "28px Georgia"
    ctx.fillText(`${partido.f} · ${partido.h} (MX) · ${partido.sede}`, 540, 600)

    const frase = prediccion.texto.match(/FRASE DEL ORÁCULO:\s*([\s\S]+?)$/)?.[1]?.trim() || ""
    const señal = prediccion.texto.match(/LA SEÑAL:\s*([\s\S]+?)(?=MINUTO CLAVE:|$)/)?.[1]?.trim() || ""
    ctx.fillStyle = "#B8B0D0"; ctx.font = "30px Georgia"
    const wrap = (txt, y, maxW) => {
      const palabras = txt.split(" "); let linea = ""; let yy = y
      for (const p of palabras) {
        if (ctx.measureText(linea + p).width > maxW) { ctx.fillText(linea, 540, yy); linea = p + " "; yy += 44 }
        else linea += p + " "
      }
      ctx.fillText(linea, 540, yy); return yy
    }
    let y = wrap(señal.slice(0,220), 700, 880)
    ctx.fillStyle = "#F0C75E"; ctx.font = "italic bold 34px Georgia"
    wrap('"' + frase.slice(0,150) + '"', y + 90, 880)

    ctx.fillStyle = "#7A7295"; ctx.font = "26px Georgia"
    ctx.fillText("Haz tu predicción gratis en", 540, 1240)
    ctx.fillStyle = "#A78BFA"; ctx.font = "bold 32px Georgia"
    ctx.fillText(window.location.host, 540, 1285)

    const link = document.createElement("a")
    link.download = `prediccion-${partido.e1}-vs-${partido.e2}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div style={s.wrap}>
      <div style={s.center}>

        <div style={s.hero}>
          <div style={s.logo}>🔮</div>
          <h1 style={s.h1}>ORÁCULO IA</h1>
          <p style={s.tagline}>Tu destino, revelado por las estrellas y la inteligencia artificial</p>
          <div style={s.userBar}>
            {user ? (
              <>
                <span>🌟 {user.email}</span>
                <button style={s.linkBtn} onClick={()=>signOut(auth)}>Cerrar sesión</button>
              </>
            ) : (
              <button style={s.linkBtn} onClick={()=>{setShowAuth(true);setAuthMode("login")}}>Iniciar sesión / Crear cuenta</button>
            )}
          </div>
        </div>

        <div style={s.nav}>
          <button style={{...s.navBtn,...(tab==="mundial"?s.navSel:{}),border:tab==="mundial"?`1px solid ${C.gold}`:`1px solid #2e7d32`,color:tab==="mundial"?C.gold:"#81c784"}} onClick={()=>cambiarTab("mundial")}>⚽ Predice el Mundial — Gratis</button>
          <button style={{...s.navBtn,...(tab==="horoscopo"?s.navSel:{})}} onClick={()=>cambiarTab("horoscopo")}>✨ Horóscopo HOY</button>
          <button style={{...s.navBtn,...(tab==="tarot"?s.navSel:{})}} onClick={()=>cambiarTab("tarot")}>🃏 Tarot</button>
          <button style={{...s.navBtn,...(tab==="compatibilidad"?s.navSel:{})}} onClick={()=>cambiarTab("compatibilidad")}>💕 Compatibilidad</button>
        </div>

        {tab==="mundial" && (
          <div style={s.card}>
            <p style={{textAlign:"center",color:C.text2,fontSize:14,marginTop:0}}>
              🏆 El oráculo lee TU energía para predecir el marcador. Elige un partido:
            </p>
            <div style={{maxHeight:300,overflowY:"auto",border:`1px solid ${C.border}`,borderRadius:12,marginBottom:16}}>
              {PARTIDOS.map((p,i)=>(
                <div key={i} onClick={()=>setPartido(p)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",borderBottom:`1px solid ${C.border}`,background:partido===p?"rgba(240,199,94,0.1)":"transparent"}}>
                  <span style={{fontSize:11,color:C.text3,width:52,flexShrink:0}}>{p.f}<br/>{p.h}</span>
                  <img src={bandera(p.c1)} alt="" style={{width:30,height:20,borderRadius:3,objectFit:"cover"}}/>
                  <span style={{fontSize:13,flex:1,textAlign:"right",color:partido===p?C.gold:C.text}}>{p.e1}</span>
                  <span style={{fontSize:11,color:C.text3}}>vs</span>
                  <span style={{fontSize:13,flex:1,color:partido===p?C.gold:C.text}}>{p.e2}</span>
                  <img src={bandera(p.c2)} alt="" style={{width:30,height:20,borderRadius:3,objectFit:"cover"}}/>
                </div>
              ))}
            </div>
            {partido && (
              <>
                <p style={{textAlign:"center",fontSize:13,color:C.violetL}}>Dale tus datos místicos al oráculo:</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <input style={s.input} placeholder="Tu nombre" value={nombre} onChange={e=>setNombre(e.target.value)}/>
                  <input style={s.input} type="date" value={fechaNac} onChange={e=>setFechaNac(e.target.value)}/>
                  <input style={s.input} placeholder="Tu teléfono (solo lo lee el cosmos)" value={telefono} onChange={e=>setTelefono(e.target.value)}/>
                  <input style={s.input} placeholder="Tu color favorito" value={colorFav} onChange={e=>setColorFav(e.target.value)}/>
                </div>
                <button style={s.btnGold} onClick={predecirMundial} disabled={cargando}>
                  {cargando ? "El cosmos calcula..." : `⚽ Predecir ${partido.e1} vs ${partido.e2}`}
                </button>
              </>
            )}
            {prediccion && (
              <>
                <div style={{...s.lectura,textAlign:"center"}}>
                  <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:20,marginBottom:16}}>
                    <img src={bandera(partido.c1)} alt="" style={{width:64,height:43,borderRadius:5,objectFit:"cover"}}/>
                    <span style={{fontSize:42,fontWeight:700,color:C.gold}}>{prediccion.g1} - {prediccion.g2}</span>
                    <img src={bandera(partido.c2)} alt="" style={{width:64,height:43,borderRadius:5,objectFit:"cover"}}/>
                  </div>
                  <div style={{textAlign:"left",whiteSpace:"pre-wrap"}}>{prediccion.texto}</div>
                </div>
                <button style={s.btnViolet} onClick={descargarTarjeta}>
                  📲 Descargar tarjeta para compartir
                </button>
              </>
            )}
          </div>
        )}

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
            {cartasSel.length===3 && (
              <button style={s.btnViolet} onClick={()=>consultar({tipo:"tarot",cartas:cartasSel,pregunta})} disabled={cargando}>
                {cargando ? "Las cartas hablan..." : "🃏 Revelar mi lectura"}
              </button>
            )}
          </div>
        )}

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
            {signo && signo2 && (
              <button style={s.btnViolet} onClick={()=>consultar({tipo:"compatibilidad",signo,signo2,nombre,nombre2})} disabled={cargando}>
                {cargando ? "Leyendo sus estrellas..." : "💕 Revelar compatibilidad"}
              </button>
            )}
          </div>
        )}

        {cargando && <div style={s.loading}>🔮 El oráculo está consultando el cosmos...</div>}
        {error && <div style={s.error}>{error}</div>}
        {sinSub && (
          <div style={s.aviso}>
            ⭐ Tu cuenta <strong>{user?.email}</strong> aún no tiene una suscripción activa.<br/>
            Suscríbete abajo usando <strong>este mismo correo</strong> en MercadoPago y tendrás acceso inmediato.<br/>
            ¿Ya pagaste? El cobro puede tardar unos minutos en confirmarse. <a href={`https://wa.me/${WHATSAPP}`} style={{color:C.violetL}}>Contáctanos si necesitas ayuda</a>.
          </div>
        )}
        {lectura && <div style={s.lectura}>{lectura}</div>}

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
            ⚠️ Importante: paga en MercadoPago con el <strong style={{color:C.gold}}>mismo correo</strong> de tu cuenta del Oráculo.<br/>
            Tu acceso se activa automáticamente al confirmarse el pago.
          </p>
        </div>

        <div style={s.footer}>
          🔮 Oráculo IA · Entretenimiento y orientación espiritual<br/>
          Las lecturas son generadas con inteligencia artificial y no sustituyen consejo profesional.
        </div>

      </div>

      {/* ─── MODAL LOGIN/REGISTRO ─── */}
      {showAuth && (
        <div style={s.modal} onClick={()=>setShowAuth(false)}>
          <div style={s.modalCard} onClick={e=>e.stopPropagation()}>
            <h2 style={{color:C.gold,marginTop:0,fontSize:20,textAlign:"center"}}>
              {authMode==="login" ? "🌙 Iniciar sesión" : "✨ Crear cuenta"}
            </h2>
            <input style={s.input} type="email" placeholder="Correo electrónico" value={email} onChange={e=>setEmail(e.target.value)}/>
            <input style={s.input} type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&autenticar()}/>
            {authError && <div style={{...s.error,marginTop:4,marginBottom:10}}>{authError}</div>}
            <button style={{...s.btnViolet,margin:"8px auto 0",width:"100%"}} onClick={autenticar}>
              {authMode==="login" ? "Entrar" : "Crear mi cuenta"}
            </button>
            <p style={{textAlign:"center",fontSize:13,color:C.text3,marginTop:16}}>
              {authMode==="login" ? (
                <>¿No tienes cuenta? <button style={s.linkBtn} onClick={()=>{setAuthMode("registro");setAuthError("")}}>Regístrate gratis</button></>
              ) : (
                <>¿Ya tienes cuenta? <button style={s.linkBtn} onClick={()=>{setAuthMode("login");setAuthError("")}}>Inicia sesión</button></>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
