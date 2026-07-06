// Devuelve los partidos del Mundial 2026 desde football-data.org
// con estado en vivo. Cachea 60s para no agotar el rate limit del plan gratis.
let cache = { data: null, ts: 0 }

const CODIGO_PAIS = {
  "Mexico":"mx","South Africa":"za","South Korea":"kr","Korea Republic":"kr","Czech Republic":"cz","Czechia":"cz",
  "Canada":"ca","Bosnia and Herzegovina":"ba","United States":"us","USA":"us","Paraguay":"py",
  "Qatar":"qa","Switzerland":"ch","Brazil":"br","Morocco":"ma","Haiti":"ht","Scotland":"gb-sct",
  "Australia":"au","Turkey":"tr","Türkiye":"tr","Germany":"de","Curacao":"cw","Curaçao":"cw",
  "Netherlands":"nl","Japan":"jp","Ivory Coast":"ci","Côte d'Ivoire":"ci","Ecuador":"ec","Sweden":"se","Tunisia":"tn",
  "Spain":"es","Cape Verde":"cv","Cabo Verde":"cv","Belgium":"be","Egypt":"eg","Saudi Arabia":"sa","Uruguay":"uy",
  "Iran":"ir","New Zealand":"nz","France":"fr","Senegal":"sn","Iraq":"iq","Norway":"no",
  "Argentina":"ar","Algeria":"dz","Austria":"at","Jordan":"jo","Portugal":"pt","DR Congo":"cd","Congo DR":"cd",
  "England":"gb-eng","Croatia":"hr","Ghana":"gh","Panama":"pa","Uzbekistan":"uz","Colombia":"co",
}

// Traducción de nombres de equipos al español
const NOMBRE_ES = {
  "Mexico":"México","South Africa":"Sudáfrica","South Korea":"Corea del Sur","Korea Republic":"Corea del Sur",
  "Czech Republic":"Rep. Checa","Czechia":"Rep. Checa","Canada":"Canadá","Bosnia and Herzegovina":"Bosnia",
  "United States":"Estados Unidos","USA":"Estados Unidos","Paraguay":"Paraguay","Qatar":"Qatar","Switzerland":"Suiza",
  "Brazil":"Brasil","Morocco":"Marruecos","Haiti":"Haití","Scotland":"Escocia","Australia":"Australia",
  "Turkey":"Turquía","Türkiye":"Turquía","Germany":"Alemania","Curacao":"Curazao","Curaçao":"Curazao",
  "Netherlands":"Países Bajos","Japan":"Japón","Ivory Coast":"Costa de Marfil","Côte d'Ivoire":"Costa de Marfil",
  "Ecuador":"Ecuador","Sweden":"Suecia","Tunisia":"Túnez","Spain":"España","Cape Verde":"Cabo Verde","Cabo Verde":"Cabo Verde",
  "Belgium":"Bélgica","Egypt":"Egipto","Saudi Arabia":"Arabia Saudita","Uruguay":"Uruguay","Iran":"Irán",
  "New Zealand":"Nueva Zelanda","France":"Francia","Senegal":"Senegal","Iraq":"Irak","Norway":"Noruega",
  "Argentina":"Argentina","Algeria":"Argelia","Austria":"Austria","Jordan":"Jordania","Portugal":"Portugal",
  "DR Congo":"RD Congo","Congo DR":"RD Congo","England":"Inglaterra","Croatia":"Croacia","Ghana":"Ghana",
  "Panama":"Panamá","Uzbekistan":"Uzbekistán","Colombia":"Colombia",
}

const MESES_ES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(204).end()

  try {
    // Cache de 60 segundos
    if (cache.data && Date.now() - cache.ts < 60000) {
      return res.status(200).json(cache.data)
    }

    const TOKEN = process.env.FOOTBALL_DATA_TOKEN
    if (!TOKEN) return res.status(500).json({ error: 'FOOTBALL_DATA_TOKEN no configurado' })

    // Competición World Cup = WC
    const r = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
      headers: { 'X-Auth-Token': TOKEN },
    })
    const text = await r.text()
    let data
    try { data = JSON.parse(text) }
    catch(e) { return res.status(500).json({ error: 'Respuesta inválida de football-data', detalle: text.slice(0,200) }) }

    if (!r.ok) return res.status(500).json({ error: data.message || 'Error football-data', matches: [] })

    const partidos = (data.matches || []).map(m => {
      const home = m.homeTeam?.name || 'Por definir'
      const away = m.awayTeam?.name || 'Por definir'
      const fecha = new Date(m.utcDate)
      // Hora de México (UTC-6)
      const mx = new Date(fecha.getTime() - 6 * 60 * 60 * 1000)
      const f = `${mx.getUTCDate()} ${MESES_ES[mx.getUTCMonth()]}`
      const h = `${String(mx.getUTCHours()).padStart(2,'0')}:${String(mx.getUTCMinutes()).padStart(2,'0')}`
      // status: SCHEDULED, TIMED, IN_PLAY, PAUSED, FINISHED
      const terminado = m.status === 'FINISHED'
      const enVivo = m.status === 'IN_PLAY' || m.status === 'PAUSED'
      return {
        id: m.id,
        e1: NOMBRE_ES[home] || home,
        e2: NOMBRE_ES[away] || away,
        c1: CODIGO_PAIS[home] || 'un',
        c2: CODIGO_PAIS[away] || 'un',
        f, h,
        etapa: m.stage,  // GROUP_STAGE, LAST_32, LAST_16, QUARTER_FINALS, SEMI_FINALS, FINAL
        sede: m.venue || '',
        status: m.status,
        terminado,
        enVivo,
        marcador: (terminado || enVivo) ? `${m.score?.fullTime?.home ?? '-'}-${m.score?.fullTime?.away ?? '-'}` : null,
      }
    })

    const resultado = { partidos, actualizado: new Date().toISOString() }
    cache = { data: resultado, ts: Date.now() }
    return res.status(200).json(resultado)
  } catch (err) {
    return res.status(500).json({ error: err.message, partidos: [] })
  }
}
