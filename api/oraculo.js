// Verifica el idToken de Firebase y devuelve el email del usuario
async function verificarUsuario(idToken) {
  const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY
  const r = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    }
  )
  const d = await r.json()
  if (!r.ok || !d.users?.[0]) return null
  return d.users[0].email
}

// Consulta MercadoPago si el email tiene una suscripción activa (authorized)
async function suscripcionActiva(email) {
  const MP_TOKEN = process.env.MP_ACCESS_TOKEN
  if (!MP_TOKEN) return false
  const r = await fetch(
    `https://api.mercadopago.com/preapproval/search?payer_email=${encodeURIComponent(email)}&status=authorized`,
    { headers: { Authorization: `Bearer ${MP_TOKEN}` } }
  )
  const d = await r.json()
  return (d.results || []).some(s => s.status === 'authorized')
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  try {
    const { tipo, signo, signo2, nombre, nombre2, cartas, pregunta, idToken } = req.body

    const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
    if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'Servicio no configurado' })

    // ── Funciones premium: verificar usuario + suscripción activa en MercadoPago ──
    const esPremium = ['tarot', 'compatibilidad'].includes(tipo)
    if (esPremium) {
      if (!idToken) return res.status(401).json({ error: 'LOGIN_REQUERIDO' })

      const email = await verificarUsuario(idToken)
      if (!email) return res.status(401).json({ error: 'LOGIN_REQUERIDO' })

      // Códigos VIP manuales (cortesías, influencers) — opcional
      const vips = (process.env.VIP_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
      const esVip = vips.includes(email.toLowerCase())

      if (!esVip) {
        const activa = await suscripcionActiva(email)
        if (!activa) return res.status(403).json({ error: 'SIN_SUSCRIPCION', email })
      }
    }

    let prompt = ''
    const hoy = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

    if (tipo === 'horoscopo') {
      if (!signo) return res.status(400).json({ error: 'Falta el signo' })
      prompt = `Eres un astrólogo místico y cálido. Escribe el horóscopo de HOY (${hoy}) para ${signo}. Estructura: AMOR: [2 frases] DINERO: [2 frases] SALUD: [2 frases] CONSEJO DEL DÍA: [1 frase poderosa] NÚMERO DE LA SUERTE: [número] COLOR: [color]. Tono: místico pero esperanzador, español mexicano natural. NO uses markdown ni asteriscos.`
    } else if (tipo === 'tarot') {
      if (!cartas || cartas.length !== 3) return res.status(400).json({ error: 'Se requieren 3 cartas' })
      prompt = `Eres una tarotista experta y empática. El consultante preguntó: "${pregunta || 'orientación general sobre mi vida'}". Sacó estas 3 cartas: PASADO: ${cartas[0]}, PRESENTE: ${cartas[1]}, FUTURO: ${cartas[2]}. Da una lectura profunda conectando las 3 cartas con su pregunta. Estructura: EL PASADO: [interpretación] EL PRESENTE: [interpretación] EL FUTURO: [interpretación] MENSAJE DEL ORÁCULO: [síntesis poderosa y esperanzadora, 2-3 frases]. Español mexicano cálido, místico. NO uses markdown ni asteriscos.`
    } else if (tipo === 'mundial') {
      const { equipo1, equipo2, fechaNac, telefono, nombreUsuario, colorFav } = req.body
      if (!equipo1 || !equipo2) return res.status(400).json({ error: 'Falta el partido' })
      prompt = `Eres un oráculo místico futbolero, divertido y carismático. Predice el resultado de ${equipo1} vs ${equipo2} del Mundial 2026 usando EXCLUSIVAMENTE la numerología y energía mística de quien consulta: Nombre: ${nombreUsuario || 'el consultante'}, Fecha de nacimiento: ${fechaNac || 'desconocida'}, Teléfono: ${telefono ? telefono.slice(-4) : 'desconocido'} (últimos dígitos), Color favorito: ${colorFav || 'desconocido'}. Suma dígitos, conecta vibras, inventa conexiones místicas divertidas pero convincentes. Formato EXACTO: GANADOR: [equipo o Empate] MARCADOR: [X-Y] LA SEÑAL: [cómo sus datos místicos revelan este resultado, 2-3 frases divertidas] MINUTO CLAVE: [minuto] AMULETO DEL PARTIDO: [objeto cotidiano gracioso] FRASE DEL ORÁCULO: [1 frase épica para compartir]. Español mexicano festivo. NO uses markdown ni asteriscos.`
    } else if (tipo === 'compatibilidad') {
      if (!signo || !signo2) return res.status(400).json({ error: 'Faltan los signos' })
      prompt = `Eres un astrólogo experto en relaciones. Analiza la compatibilidad entre ${nombre || 'Persona 1'} (${signo}) y ${nombre2 || 'Persona 2'} (${signo2}). Estructura: QUÍMICA: [porcentaje]% — [2 frases] FORTALEZAS: [2-3 puntos] DESAFÍOS: [2 puntos] CONSEJO PARA LA PAREJA: [2 frases] VEREDICTO DEL ORÁCULO: [1 frase memorable]. Español mexicano, tono divertido pero con sustancia. NO uses markdown ni asteriscos.`
    } else {
      return res.status(400).json({ error: 'Tipo inválido' })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 700,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const text = await response.text()
    let data
    try { data = JSON.parse(text) }
    catch(e) { return res.status(500).json({ error: 'Error del oráculo, intenta de nuevo' }) }

    if (!response.ok) return res.status(500).json({ error: data.error?.message || 'El oráculo está descansando, intenta en un momento' })

    const lectura = data.content?.filter(c => c.type === 'text').map(c => c.text).join('') || ''
    return res.status(200).json({ lectura })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
