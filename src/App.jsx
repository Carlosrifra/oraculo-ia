import { useState, useEffect } from "react"
import { auth } from "./firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"

// ⚙️ CONFIGURA AQUÍ TU LINK DE SUSCRIPCIÓN DE MERCADOPAGO
const MP_LINK = "https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=84e865c0e6894b5a95d8db4151cd353e" // ← Reemplaza con tu link real
const WHATSAPP = "5219931598038"
const PRECIO = "49"

const C = {
  bg:"#0A0814",
  glass:"rgba(28,22,52,0.55)",
  glassBorder:"rgba(157,123,255,0.18)",
  violet:"#9D7BFF", violetD:"#6D4DD4", violetL:"#C4ADFF",
  gold:"#E8C36A", goldL:"#F5DBA0", goldD:"#B8923F",
  text:"#F4F1FC", text2:"#B9B2D4", text3:"#766F96",
  ok:"#7BE3A0",
}

const FH = "'Playfair Display', Georgia, serif"
const FB = "'Inter', system-ui, sans-serif"

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
  wrap:{minHeight:"100vh",background:`radial-gradient(900px 500px at 50% -8%, rgba(109,77,212,0.28), transparent 60%), radial-gradient(700px 400px at 85% 20%, rgba(232,195,106,0.07), transparent 55%), ${C.bg}`,color:C.text,fontFamily:FB,paddingBottom:80},
  center:{maxWidth:700,margin:"0 auto",padding:"0 1.25rem"},
  hero:{textAlign:"center",padding:"3.5rem 1rem 1.25rem"},
  logo:{fontSize:50,marginBottom:10,filter:"drop-shadow(0 0 24px rgba(157,123,255,0.5))"},
  h1:{fontSize:38,fontWeight:700,fontFamily:FH,background:`linear-gradient(120deg, ${C.goldL}, ${C.gold} 45%, ${C.goldD})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:"0 0 10px",letterSpacing:3},
  tagline:{fontSize:15,color:C.text2,fontStyle:"italic",fontFamily:FH,margin:0,letterSpacing:.3},
  userBar:{display:"flex",justifyContent:"center",alignItems:"center",gap:14,fontSize:13,color:C.text2,marginTop:18,flexWrap:"wrap"},
  linkBtn:{background:"none",border:"none",color:C.violetL,cursor:"pointer",fontSize:13,textDecoration:"underline",fontFamily:FB},
  nav:{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",margin:"1.75rem 0"},
  navBtn:{padding:"11px 22px",background:C.glass,backdropFilter:"blur(12px)",border:`1px solid ${C.glassBorder}`,borderRadius:30,color:C.text2,fontSize:13.5,fontWeight:500,cursor:"pointer"},
  navSel:{border:`1px solid ${C.gold}`,background:"rgba(232,195,106,0.1)",color:C.gold,boxShadow:"0 0 24px rgba(232,195,106,0.15)"},
  card:{background:C.glass,backdropFilter:"blur(16px)",border:`1px solid ${C.glassBorder}`,borderRadius:22,padding:"2rem",marginBottom:18,boxShadow:"0 18px 50px rgba(0,0,0,0.45)"},
  cardTitle:{fontFamily:FH,fontSize:21,fontWeight:600,color:C.gold,textAlign:"center",margin:"0 0 6px"},
  cardSub:{textAlign:"center",color:C.text2,fontSize:14,margin:"0 0 1.4rem",lineHeight:1.6},
  signGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(104px,1fr))",gap:10},
  signBtn:{padding:"15px 8px",background:"rgba(10,8,20,0.5)",border:`1px solid ${C.glassBorder}`,borderRadius:14,color:C.text2,cursor:"pointer",textAlign:"center"},
  signSel:{border:`1px solid ${C.gold}`,background:"rgba(232,195,106,0.1)",color:C.gold,boxShadow:"0 0 18px rgba(232,195,106,0.12)"},
  signEmoji:{fontSize:27,display:"block",marginBottom:5},
  signName:{fontSize:13,fontWeight:600},
  signDate:{fontSize:10,color:C.text3,display:"block",marginTop:3},
  btnGold:{padding:"15px 38px",background:`linear-gradient(135deg, ${C.goldL}, ${C.gold} 50%, ${C.goldD})`,color:"#1a1230",border:"none",borderRadius:30,fontWeight:700,fontSize:15,cursor:"pointer",letterSpacing:.4,display:"block",margin:"1.6rem auto 0",boxShadow:"0 10px 30px rgba(232,195,106,0.3)"},
  btnViolet:{padding:"15px 38px",background:`linear-gradient(135deg, ${C.violet}, ${C.violetD})`,color:"#fff",border:"none",borderRadius:30,fontWeight:700,fontSize:15,cursor:"pointer",letterSpacing:.4,display:"block",margin:"1.6rem auto 0",boxShadow:"0 10px 30px rgba(109,77,212,0.4)"},
  lectura:{background:"rgba(10,8,20,0.6)",border:`1px solid rgba(232,195,106,0.3)`,borderRadius:16,padding:"1.6rem",marginTop:22,fontSize:15,lineHeight:1.95,whiteSpace:"pre-wrap",color:C.text},
  input:{width:"100%",padding:"13px 15px",background:"rgba(10,8,20,0.6)",border:`1px solid ${C.glassBorder}`,borderRadius:12,color:C.text,fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:10},
  cartaWrap:{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",margin:"1.6rem 0"},
  carta:{width:92,height:144,background:`linear-gradient(150deg, #2a1f4d, #150f2e)`,border:`2px solid ${C.violet}`,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,cursor:"pointer",transition:"transform .3s, box-shadow .3s",color:C.violetL,boxShadow:"0 8px 22px rgba(0,0,0,0.45)"},
  cartaSel:{border:`2px solid ${C.gold}`,background:`linear-gradient(150deg, #3a2c12, #251a08)`,transform:"translateY(-10px)",color:C.gold,boxShadow:"0 16px 32px rgba(232,195,106,0.25)"},
  premium:{display:"inline-block",background:`linear-gradient(135deg, ${C.goldL}, ${C.goldD})`,color:"#1a1230",fontSize:10,fontWeight:700,padding:"3px 11px",borderRadius:11,letterSpacing:1.2,verticalAlign:"middle",marginLeft:8},
  gratis:{display:"inline-block",background:"rgba(123,227,160,0.15)",border:"1px solid rgba(123,227,160,0.4)",color:C.ok,fontSize:10,fontWeight:700,padding:"3px 11px",borderRadius:11,letterSpacing:1.2,verticalAlign:"middle",marginLeft:8},
  precio:{textAlign:"center",padding:"1.6rem 0 1rem"},
  precioNum:{fontSize:54,fontWeight:700,fontFamily:FH,background:`linear-gradient(120deg, ${C.goldL}, ${C.gold})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  feature:{display:"flex",gap:12,alignItems:"flex-start",padding:"8px 0",fontSize:14,color:C.text2,lineHeight:1.55},
  loading:{textAlign:"center",padding:"2rem",fontSize:15,color:C.violetL,fontFamily:FH,fontStyle:"italic"},
  error:{background:"rgba(239,83,80,0.1)",border:"1px solid rgba(239,83,80,0.3)",borderRadius:12,padding:"13px 17px",color:"#ef9a9a",fontSize:14,marginTop:16},
  aviso:{background:"rgba(232,195,106,0.08)",border:`1px solid rgba(232,195,106,0.35)`,borderRadius:12,padding:"14px 18px",color:C.goldL,fontSize:13.5,marginTop:16,lineHeight:1.7},
  contador:{textAlign:"center",fontSize:13,color:C.ok,marginTop:12},
  footer:{textAlign:"center",fontSize:12,color:C.text3,marginTop:48,lineHeight:1.9},
  modal:{position:"fixed",inset:0,background:"rgba(5,3,12,0.82)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:"1rem"},
  modalCard:{background:"#171231",border:`1px solid ${C.glassBorder}`,borderRadius:22,padding:"2.2rem",maxWidth:410,width:"100%",boxShadow:"0 30px 80px rgba(0,0,0,0.6)"},
  partidoRow:{display:"flex",alignItems:"center",gap:10,padding:"11px 15px",cursor:"pointer",borderBottom:`1px solid rgba(157,123,255,0.1)`},
  flag:{width:32,height:21,borderRadius:4,objectFit:"cover",boxShadow:"0 2px 6px rgba(0,0,0,0.4)"},
}

export default function App() {
  const [tab, setTab] = useState("mundial")
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState("registro")
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
  const [agotadas, setAgotadas] = useState(false)
  const [partido, setPartido] = useState(null)
  const [fechaNac, setFechaNac] = useState("")
  const [colorFav, setColorFav] = useState("")
  const [prediccion, setPrediccion] = useState(null)
  const [restantes, setRestantes] = useState(null)

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
    setCargando(true); setError(""); setLectura(""); setSinSub(false); setAgotadas(false)
    try {
      const idToken = user ? await user.getIdToken() : null
      const r = await fetch("/api/oraculo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, idToken }),
      })
      const d = await r.json()
      if (d.error === "LOGIN_REQUERIDO") {
        setShowAuth(true); setAuthMode("registro")
        setError("Crea tu cuenta gratis para continuar")
      } else if (d.error === "SIN_SUSCRIPCION") {
        setSinSub(true)
      } else if (d.error === "PREDICCIONES_AGOTADAS") {
        setAgotadas(true)
      } else if (d.error) {
        setError(d.error)
      } else {
        return d
      }
    } catch (e) {
      setError("El oráculo no responde, intenta de nuevo")
    } finally {
      setCargando(false)
    }
    return null
  }

  const consultarLectura = async (payload) => {
    const d = await consultar(payload)
    if (d) setLectura(d.lectura)
  }

  const predecirMundial = async () => {
    if (!partido) return
    if (!user) { setShowAuth(true); setAuthMode("registro"); return }
    setPrediccion(null)
    const d = await consultar({ tipo:"mundial", equipo1:partido.e1, equipo2:partido.e2, nombreUsuario:nombre, fechaNac, colorFav })
    if (d) {
      const m = d.lectura.match(/MARCADOR:\s*(\d+)\s*-\s*(\d+)/)
      setPrediccion({ texto: d.lectura, g1: m?.[1]||"?", g2: m?.[2]||"?" })
      setRestantes(d.restantes)
    }
  }

  const descargarTarjeta = async () => {
    if (!prediccion || !partido) return
    const canvas = document.createElement("canvas")
    canvas.width = 1080; canvas.height = 1350
    const ctx = canvas.getContext("2d")

    const grad = ctx.createLinearGradient(0,0,0,1350)
    grad.addColorStop(0,"#1c1340"); grad.addColorStop(0.5,"#0f0a24"); grad.addColorStop(1,"#0A0814")
    ctx.fillStyle = grad; ctx.fillRect(0,0,1080,1350)

    for(let i=0;i<60;i++){
      ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.5+0.1})`
      ctx.beginPath(); ctx.arc(Math.random()*1080, Math.random()*1350, Math.random()*1.8+0.4, 0, Math.PI*2); ctx.fill()
    }

    ctx.fillStyle = "#E8C36A"; ctx.font = "bold 58px Georgia"; ctx.textAlign = "center"
    ctx.fillText("🔮 ORÁCULO IA", 540, 115)
    ctx.fillStyle = "#B9B2D4"; ctx.font = "italic 32px Georgia"
    ctx.fillText("Predicción Mística · Mundial 2026", 540, 170)

    const cargarImg = (url) => new Promise((res) => {
      const img = new Image(); img.crossOrigin = "anonymous"
      img.onload = () => res(img); img.onerror = () => res(null)
      img.src = url
    })
    const [img1, img2] = await Promise.all([cargarImg(bandera(partido.c1)), cargarImg(bandera(partido.c2))])

    ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 24
    if (img1) ctx.drawImage(img1, 110, 290, 290, 193)
    if (img2) ctx.drawImage(img2, 680, 290, 290, 193)
    ctx.shadowBlur = 0
    ctx.strokeStyle = "#E8C36A"; ctx.lineWidth = 4
    ctx.strokeRect(110, 290, 290, 193); ctx.strokeRect(680, 290, 290, 193)

    ctx.fillStyle = "#F4F1FC"; ctx.font = "bold 40px Georgia"
    ctx.fillText(partido.e1, 255, 545); ctx.fillText(partido.e2, 825, 545)

    ctx.fillStyle = "#E8C36A"; ctx.font = "bold 150px Georgia"
    ctx.fillText(`${prediccion.g1} - ${prediccion.g2}`, 540, 440)

    ctx.fillStyle = "#766F96"; ctx.font = "28px Georgia"
    ctx.fillText(`${partido.f} · ${partido.h} (MX) · ${partido.sede}`, 540, 615)

    const frase = prediccion.texto.match(/FRASE DEL ORÁCULO:\s*([\s\S]+?)$/)?.[1]?.trim() || ""
    const señal = prediccion.texto.match(/LA SEÑAL:\s*([\s\S]+?)(?=MINUTO CLAVE:|$)/)?.[1]?.trim() || ""
    ctx.fillStyle = "#B9B2D4"; ctx.font = "30px Georgia"
    const wrap = (txt, y, maxW) => {
      const palabras = txt.split(" "); let linea = ""; let yy = y
      for (const p of palabras) {
        if (ctx.measureText(linea + p).width > maxW) { ctx.fillText(linea, 540, yy); linea = p + " "; yy += 46 }
        else linea += p + " "
      }
      ctx.fillText(linea, 540, yy); return yy
    }
    let y = wrap(señal.slice(0,220), 715, 880)
    ctx.fillStyle = "#E8C36A"; ctx.font = "italic bold 35px Georgia"
    wrap('"' + frase.slice(0,150) + '"', y + 95, 880)

    ctx.fillStyle = "#766F96"; ctx.font = "26px Georgia"
    ctx.fillText("Haz tu predicción gratis en", 540, 1245)
    ctx.fillStyle = "#C4ADFF"; ctx.font = "bold 34px Georgia"
    ctx.fillText(window.location.host, 540, 1292)

    const link = document.createElement("a")
    link.download = `prediccion-${partido.e1}-vs-${partido.e2}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const toggleCarta = (c) => {
    if (cartasSel.includes(c)) setCartasSel(cartasSel.filter(x => x !== c))
    else if (cartasSel.length < 3) setCartasSel([...cartasSel, c])
  }

  const cambiarTab = (t) => { setTab(t); setLectura(""); setError(""); setCartasSel([]); setSinSub(false); setAgotadas(false); setPrediccion(null) }

  const SuscripcionCTA = ({titulo}) => (
    <div style={s.aviso}>
      <strong>⭐ {titulo}</strong><br/>
      Desbloquea predicciones ilimitadas, tarot y compatibilidad por solo <strong>${PRECIO} pesos al mes</strong> — menos que dos cafés.<br/>
      <a href={MP_LINK} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
        <button style={{...s.btnGold,margin:"14px auto 4px",padding:"12px 30px",fontSize:14}}>⭐ Suscribirme por ${PRECIO}/mes</button>
      </a>
      <span style={{display:"block",textAlign:"center",fontSize:11.5,color:C.text3,marginTop:8}}>
        Paga con el mismo correo de tu cuenta: <strong style={{color:C.goldL}}>{user?.email}</strong>
      </span>
    </div>
  )

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
              <button style={s.linkBtn} onClick={()=>{setShowAuth(true);setAuthMode("registro")}}>Crear cuenta gratis · 2 predicciones de regalo</button>
            )}
          </div>
        </div>

        <div style={s.nav}>
          <button style={{...s.navBtn,...(tab==="mundial"?s.navSel:{})}} onClick={()=>cambiarTab("mundial")}>⚽ Predice el Mundial</button>
          <button style={{...s.navBtn,...(tab==="horoscopo"?s.navSel:{})}} onClick={()=>cambiarTab("horoscopo")}>✨ Horóscopo HOY</button>
          <button style={{...s.navBtn,...(tab==="tarot"?s.navSel:{})}} onClick={()=>cambiarTab("tarot")}>🃏 Tarot</button>
          <button style={{...s.navBtn,...(tab==="compatibilidad"?s.navSel:{})}} onClick={()=>cambiarTab("compatibilidad")}>💕 Compatibilidad</button>
        </div>

        {/* ─── MUNDIAL ─── */}
        {tab==="mundial" && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>El Oráculo del Mundial <span style={s.gratis}>2 GRATIS</span></h2>
            <p style={s.cardSub}>El cosmos lee TU energía personal para revelar el marcador.<br/>Elige un partido del calendario oficial:</p>
            <div style={{maxHeight:310,overflowY:"auto",border:`1px solid ${C.glassBorder}`,borderRadius:14}}>
              {PARTIDOS.map((p,i)=>(
                <div key={i} onClick={()=>setPartido(p)} style={{...s.partidoRow,background:partido===p?"rgba(232,195,106,0.1)":"transparent"}}>
                  <span style={{fontSize:11,color:C.text3,width:54,flexShrink:0,lineHeight:1.5}}>{p.f}<br/>{p.h}</span>
                  <img src={bandera(p.c1)} alt="" style={s.flag}/>
                  <span style={{fontSize:13.5,flex:1,textAlign:"right",fontWeight:partido===p?600:400,color:partido===p?C.gold:C.text}}>{p.e1}</span>
                  <span style={{fontSize:11,color:C.text3}}>vs</span>
                  <span style={{fontSize:13.5,flex:1,fontWeight:partido===p?600:400,color:partido===p?C.gold:C.text}}>{p.e2}</span>
                  <img src={bandera(p.c2)} alt="" style={s.flag}/>
                </div>
              ))}
            </div>
            {partido && !user && (
              <div style={{textAlign:"center",marginTop:20}}>
                <p style={{fontSize:14,color:C.text2}}>Crea tu cuenta gratis y recibe <strong style={{color:C.ok}}>2 predicciones de regalo</strong></p>
                <button style={{...s.btnGold,marginTop:8}} onClick={()=>{setShowAuth(true);setAuthMode("registro")}}>
                  ✨ Crear cuenta gratis
                </button>
              </div>
            )}
            {partido && user && (
              <>
                <p style={{textAlign:"center",fontSize:13.5,color:C.violetL,marginTop:20}}>Comparte tu energía con el oráculo:</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <input style={s.input} placeholder="Tu nombre" value={nombre} onChange={e=>setNombre(e.target.value)}/>
                  <input style={s.input} type="date" value={fechaNac} onChange={e=>setFechaNac(e.target.value)}/>
                </div>
                <input style={s.input} placeholder="Tu color favorito" value={colorFav} onChange={e=>setColorFav(e.target.value)}/>
                <button style={s.btnGold} onClick={predecirMundial} disabled={cargando}>
                  {cargando ? "El cosmos calcula..." : `⚽ Predecir ${partido.e1} vs ${partido.e2}`}
                </button>
              </>
            )}
            {prediccion && (
              <>
                <div style={{...s.lectura,textAlign:"center"}}>
                  <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:22,marginBottom:18}}>
                    <img src={bandera(partido.c1)} alt="" style={{width:68,height:45,borderRadius:6,objectFit:"cover",boxShadow:"0 4px 14px rgba(0,0,0,0.5)"}}/>
                    <span style={{fontSize:46,fontWeight:700,fontFamily:FH,color:C.gold}}>{prediccion.g1} - {prediccion.g2}</span>
                    <img src={bandera(partido.c2)} alt="" style={{width:68,height:45,borderRadius:6,objectFit:"cover",boxShadow:"0 4px 14px rgba(0,0,0,0.5)"}}/>
                  </div>
                  <div style={{textAlign:"left",whiteSpace:"pre-wrap"}}>{prediccion.texto}</div>
                </div>
                {restantes !== null && restantes >= 0 && (
                  <p style={s.contador}>✨ Te queda{restantes===1?"":"n"} {restantes} predicción{restantes===1?"":"es"} gratis</p>
                )}
                <button style={s.btnViolet} onClick={descargarTarjeta}>
                  📲 Descargar tarjeta para compartir
                </button>
              </>
            )}
            {agotadas && <SuscripcionCTA titulo="Tus 2 predicciones gratis se agotaron"/>}
          </div>
        )}

        {/* ─── HORÓSCOPO ─── */}
        {tab==="horoscopo" && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>Horóscopo del Día <span style={s.gratis}>GRATIS</span></h2>
            <p style={s.cardSub}>Elige tu signo y descubre lo que los astros tienen para ti hoy</p>
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
              <button style={s.btnGold} onClick={()=>consultarLectura({tipo:"horoscopo",signo})} disabled={cargando}>
                {cargando ? "Consultando los astros..." : `✨ Revelar mi horóscopo de hoy`}
              </button>
            )}
          </div>
        )}

        {/* ─── TAROT ─── */}
        {tab==="tarot" && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>Lectura de Tarot <span style={s.premium}>PREMIUM</span></h2>
            <p style={s.cardSub}>Concéntrate en tu pregunta y deja que las cartas te elijan</p>
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
              <button style={s.btnViolet} onClick={()=>consultarLectura({tipo:"tarot",cartas:cartasSel,pregunta})} disabled={cargando}>
                {cargando ? "Las cartas hablan..." : "🃏 Revelar mi lectura"}
              </button>
            )}
          </div>
        )}

        {/* ─── COMPATIBILIDAD ─── */}
        {tab==="compatibilidad" && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>Compatibilidad de Pareja <span style={s.premium}>PREMIUM</span></h2>
            <p style={s.cardSub}>Descubre la química real entre dos almas</p>
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
              <button style={s.btnViolet} onClick={()=>consultarLectura({tipo:"compatibilidad",signo,signo2,nombre,nombre2})} disabled={cargando}>
                {cargando ? "Leyendo sus estrellas..." : "💕 Revelar compatibilidad"}
              </button>
            )}
          </div>
        )}

        {cargando && <div style={s.loading}>🔮 El oráculo está consultando el cosmos...</div>}
        {error && <div style={s.error}>{error}</div>}
        {sinSub && <SuscripcionCTA titulo="Esta función es exclusiva para suscriptores"/>}
        {lectura && <div style={s.lectura}>{lectura}</div>}

        {/* ─── PLAN ─── */}
        <div style={{...s.card,marginTop:40,border:`1px solid rgba(232,195,106,0.4)`,boxShadow:"0 18px 50px rgba(0,0,0,0.45), 0 0 60px rgba(232,195,106,0.06)"}}>
          <div style={s.precio}>
            <div style={{fontSize:12,color:C.text3,letterSpacing:3,marginBottom:8,fontWeight:600}}>ACCESO PREMIUM</div>
            <span style={s.precioNum}>${PRECIO}</span>
            <span style={{fontSize:17,color:C.text2}}> MXN/mes</span>
            <div style={{fontSize:13,color:C.text3,marginTop:6,fontStyle:"italic"}}>menos que dos cafés ☕</div>
          </div>
          <div style={s.feature}><span>⚽</span><span><strong style={{color:C.text}}>Predicciones ilimitadas del Mundial 2026</strong> con tarjetas para compartir</span></div>
          <div style={s.feature}><span>🃏</span><span>Lecturas de tarot ilimitadas con interpretación personalizada</span></div>
          <div style={s.feature}><span>💕</span><span>Análisis de compatibilidad con quien tú quieras</span></div>
          <div style={s.feature}><span>⚡</span><span>Respuestas al instante, 24/7, sin citas ni esperas</span></div>
          <div style={s.feature}><span>🔐</span><span>100% privado — nadie más ve tus consultas</span></div>
          <a href={MP_LINK} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
            <button style={s.btnGold}>⭐ Comenzar por ${PRECIO}/mes</button>
          </a>
          <p style={{textAlign:"center",fontSize:12,color:C.text3,marginTop:16,lineHeight:1.7}}>
            ⚠️ Paga en MercadoPago con el <strong style={{color:C.goldL}}>mismo correo</strong> de tu cuenta del Oráculo.<br/>
            Tu acceso se activa automáticamente al confirmarse el pago. Cancela cuando quieras.
          </p>
        </div>

        <div style={s.footer}>
          🔮 Oráculo IA · Entretenimiento y orientación espiritual<br/>
          Las lecturas son generadas con inteligencia artificial y no sustituyen consejo profesional.<br/>
          ¿Necesitas ayuda? <a href={`https://wa.me/${WHATSAPP}`} style={{color:C.violetL}}>Escríbenos por WhatsApp</a>
        </div>

      </div>

      {/* ─── MODAL AUTH ─── */}
      {showAuth && (
        <div style={s.modal} onClick={()=>setShowAuth(false)}>
          <div style={s.modalCard} onClick={e=>e.stopPropagation()}>
            <h2 style={{color:C.gold,marginTop:0,fontSize:23,textAlign:"center",fontFamily:FH}}>
              {authMode==="login" ? "🌙 Iniciar sesión" : "✨ Crear cuenta gratis"}
            </h2>
            {authMode==="registro" && (
              <p style={{textAlign:"center",fontSize:13,color:C.ok,marginTop:-6}}>Incluye 2 predicciones del Mundial de regalo 🎁</p>
            )}
            <input style={s.input} type="email" placeholder="Correo electrónico" value={email} onChange={e=>setEmail(e.target.value)}/>
            <input style={s.input} type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&autenticar()}/>
            {authError && <div style={{...s.error,marginTop:4,marginBottom:10}}>{authError}</div>}
            <button style={{...s.btnViolet,margin:"10px auto 0",width:"100%"}} onClick={autenticar}>
              {authMode==="login" ? "Entrar" : "Crear mi cuenta"}
            </button>
            <p style={{textAlign:"center",fontSize:13,color:C.text3,marginTop:18}}>
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
