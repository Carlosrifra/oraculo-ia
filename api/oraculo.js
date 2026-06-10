export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  try {
    const { tipo, signo, signo2, nombre, nombre2, cartas, pregunta, codigo } = req.body

    const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
    if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'Servicio no configurado' })

    // Validar código premium para funciones de pago
    const esPremium = ['tarot', 'compatibilidad'].includes(tipo)
    if (esPremium) {
      const codigosValidos = (process.env.PREMIUM_CODES || '').split(',').map(c => c.trim()).filter(Boolean)
      if (!codigo || !codigosValidos.includes(codigo.trim().toUpperCase())) {
        return res.status(403).json({ error: 'CODIGO_INVALIDO' })
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
