// Contenedores del DOM
const contenedor = document.getElementById('contenedor-luchadores');
const vistaFicha = document.getElementById('vista-ficha');
const pantalla = document.getElementById('pantalla-combate');
const log = document.getElementById('log-combate');
const visor1 = document.getElementById('visor-p1');
const visor2 = document.getElementById('visor-p2');

let seleccionados = [];
let pelea = null;

// =========================
// ROUTER & NAVEGACIÓN
// =========================
// Maneja el filtrado de vistas (Home, Ficha, Combate) sin recargar la página
window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);

function handleRoute() {
  const hash = window.location.hash;

  // Ocultar todo
  contenedor.style.display = 'none';
  vistaFicha.style.display = 'none';
  pantalla.style.display = 'none';

  if (hash.startsWith('#ficha/')) {
    const nombre = decodeURIComponent(hash.split('/')[1]);
    mostrarFicha(nombre);
  } else if (hash === '#combate') {
    if (seleccionados.length === 2) {
      pantalla.style.display = 'block';
    } else {
      window.location.hash = '';
    }
  } else {
    // Ruta por defecto (home)
    contenedor.style.display = 'flex';
    if (contenedor.innerHTML === '') {
      cargarLuchadores();
    }
  }
}

// =========================
// CARGAR LUCHADORES
// =========================
async function cargarLuchadores() {
  contenedor.innerHTML = '';
  try {
    const res = await fetch('participantes.txt?v=' + Date.now());
    const txt = await res.text();

    const nombresLuchadores = txt
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line.toLowerCase() !== 'index');

    for (const nombreArchivo of nombresLuchadores) {
      try {
        const resHtml = await fetch(`${nombreArchivo}.html?v=` + Date.now());
        const htmlText = await resHtml.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const nombre = doc.getElementById('nombre-luchador')?.innerText.trim() || 'Sin Nombre';
        const hp = parseInt(doc.getElementById('puntos-vida')?.innerText.trim()) || 0;
        const atk = parseInt(doc.getElementById('puntos-ataque')?.innerText.trim()) || 0;
        const spd = parseInt(doc.getElementById('puntos-velocidad')?.innerText.trim()) || 0;

        let img = doc.getElementById('imagen-luchador')?.getAttribute('src') || '';

        // CORRECCIÓN DE RUTAS: Redirige a los assets optimizados (respetando extensiones específicas)
        const originalFileName = img.split('/').pop();
        let fileName = originalFileName;

        if (fileName.toLowerCase().endsWith('.png')) {
          const base = fileName.split('.')[0].toLowerCase();
          if (base !== 'arbol' && base !== 'huston') {
            fileName = fileName.replace(/\.png$/i, '.jpg');
          }
        }
        img = fileName;

        // GENERACIÓN DE TARJETAS: Layout responsivo y centrado
        const fichaHTML = `
          <div class="tarjeta-luchador" style="background:rgba(0, 0, 0, 0.5); border:1px solid #444; padding:10px; text-align:center; border-radius:10px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <img src="${img}" alt="${nombre}" style="width: 100%; height: 120px; object-fit: cover; border-radius:8px; cursor:pointer;" onclick="verFicha('${nombreArchivo}')">
              <strong style="display:block; margin-top:8px; font-size: 1.1em;">${nombre}</strong>
              <div style="font-size: 0.85em; margin: 5px 0;">HP:${hp} ATK:${atk} SPD:${spd}</div>
            </div>
            <div>
              <button class="btn-arcade btn-small" onclick="seleccionar('${nombre}', ${hp}, ${atk}, ${spd}, '${img}', this)" style="width: 100%;">Seleccionar</button>
              <button class="btn-arcade btn-secondary btn-small" onclick="verFicha('${nombreArchivo}')" style="margin-top:5px; width: 100%;">Ficha</button>
            </div>
          </div>
        `;

        contenedor.innerHTML += fichaHTML;

      } catch (err) {
        console.error(`Error cargando ${nombreArchivo}.html:`, err);
      }
    }
  } catch (err) {
    console.error('No se pudo cargar participantes.txt', err);
  }
}

async function verFicha(nombreArchivo) {
  window.location.hash = `#ficha/${nombreArchivo}`;
}

async function mostrarFicha(nombreArchivo) {
  vistaFicha.innerHTML = 'Cargando...';
  vistaFicha.style.display = 'block';

  try {
    const res = await fetch(`${nombreArchivo}.html?v=` + Date.now());
    let htmlText = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    let fichaContent = doc.querySelector('.contenedor-ficha');

    if (!fichaContent) {
      // Fallback: Si no hay contenedor, creamos uno con el contenido del body
      fichaContent = document.createElement('div');
      fichaContent.className = 'contenedor-ficha';
      fichaContent.innerHTML = doc.body.innerHTML;
    } else {
      // Clonamos para evitar problemas de adopción en algunos navegadores
      fichaContent = fichaContent.cloneNode(true);
    }

    // Corregir rutas de imagen
    const imgs = fichaContent.querySelectorAll('img');
    imgs.forEach(img => {
      const src = img.getAttribute('src');
      if (!src) return;
      const originalFileName = src.split('/').pop();
      let fileName = originalFileName;

      if (fileName.toLowerCase().endsWith('.png')) {
        const base = fileName.split('.')[0].toLowerCase();
        if (base !== 'arbol' && base !== 'huston') {
          fileName = fileName.replace(/\.png$/i, '.jpg');
        }
      }
      img.src = fileName;
    });

    vistaFicha.innerHTML = '';
    const btnVolver = document.createElement('button');
    btnVolver.classList.add('btn-arcade', 'btn-secondary');
    btnVolver.innerText = '⬅ Volver al Ring';
    btnVolver.onclick = () => window.location.hash = '';
    btnVolver.style.marginBottom = '20px';
    btnVolver.style.display = 'block';

    vistaFicha.appendChild(btnVolver);
    vistaFicha.appendChild(fichaContent);

  } catch (err) {
    vistaFicha.innerHTML = '<p>Error cargando la ficha.</p><button onclick="window.location.hash=\'\'">Volver</button>';
    console.error(err);
  }
}

function seleccionar(nombre, hp, atk, spd, img, btn) {
  if (seleccionados.length >= 2) return;

  // FEEDBACK DE SELECCIÓN: Cambia color y texto del botón al instante
  if (btn) {
    btn.classList.add('btn-selected');
    btn.innerText = 'Seleccionado';
  }

  seleccionados.push({ nombre, hp, atk, spd, img, maxHp: hp });

  if (seleccionados.length === 2) {
    // Retraso para que el usuario aprecie la selección antes del cambio de pantalla
    setTimeout(() => iniciarCombate(), 300);
  }
}

function iniciarCombate() {
  window.location.hash = '#combate';
  log.innerHTML = '';

  // Ordenar por velocidad
  seleccionados.sort((a, b) => b.spd - a.spd);

  const [p1, p2] = seleccionados;

  visor1.innerHTML = crearVisor(p1, 1);
  visor2.innerHTML = crearVisor(p2, 2);

  actualizarBarra(p1, 1);
  actualizarBarra(p2, 2);

  if (pelea) clearInterval(pelea);

  pelea = setInterval(() => {
    // Si alguien ya murió, detener el intervalo
    if (p1.hp <= 0 || p2.hp <= 0) {
      clearInterval(pelea);
      return;
    }

    // Turno del primero
    atacar(p1, p2, 2);

    // El segundo solo ataca si sigue vivo
    setTimeout(() => {
      if (p2.hp > 0 && p1.hp > 0) {
        atacar(p2, p1, 1);
      }
    }, 600);

  }, 1500); // Intervalo un poco más largo para permitir dobles golpes
}

function crearVisor(p, n) {
  return `
      <h3 style="margin-top:0; color:#ffcc00; font-size: 1.2em;">${p.nombre}</h3>
      <img id="img-luchador-${n}" src="${p.img}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 10px; border: 2px solid #555; margin: 10px auto;">
      <div class="barra" style="width: 120px;">
        <div id="vida${n}" class="vida"></div>
      </div>
      <p style="margin: 10px 0 0 0; font-weight:bold; font-size: 1.1em;">HP: <span id="hp${n}">${p.hp}</span></p>
  `;
}

function atacar(a, d, n, esSegundoGolpe = false) {
  if (a.hp <= 0 || d.hp <= 0) return;

  // 1. SISTEMA DE ESQUIVA: 15% de probabilidad
  const esquiva = Math.random() < 0.15;
  if (esquiva) {
    log.innerHTML += `<span style="color: #aaa;">💨 ${a.nombre} falló el golpe (${d.nombre} esquivó).</span><br>`;
    log.scrollTop = log.scrollHeight;
    return;
  }

  // 2. DAÑO VARIABLE: +/- 25%
  const baseDmg = a.atk - Math.floor(d.spd / 4);
  const factorAleatorio = 0.75 + Math.random() * 0.5; // Multiplicador entre 0.75 y 1.25
  let dmg = Math.floor(Math.max(5, baseDmg * factorAleatorio));

  // 3. CRÍTICOS: 10% de probabilidad (x1.5)
  const esCritico = Math.random() < 0.10;
  if (esCritico) {
    dmg = Math.floor(dmg * 1.5);
  }

  ejecutarDano(a, d, n, dmg, esCritico);

  // 4. DOBLE GOLPE: 10% de probabilidad (solo si no es ya un segundo golpe)
  if (!esSegundoGolpe && d.hp > 0) {
    const dobleGolpe = Math.random() < 0.10;
    if (dobleGolpe) {
      setTimeout(() => {
        if (a.hp > 0 && d.hp > 0) {
          log.innerHTML += `<span style="color: #ffcc00;">⚡ ¡${a.nombre} se enfurece y golpea OTRA VEZ!</span><br>`;
          atacar(a, d, n, true);
        }
      }, 450);
    }
  }
}

function ejecutarDano(a, d, n, dmg, esCritico) {
  d.hp -= dmg;
  if (d.hp <= 0) d.hp = 0;

  const el = document.getElementById(`hp${n}`);
  if (el) el.innerText = d.hp;

  // Animaciones
  const idAtacante = (n === 1) ? 2 : 1;
  const imgAtacante = document.getElementById(`img-luchador-${idAtacante}`);
  const imgDefensor = document.getElementById(`img-luchador-${n}`);

  if (imgAtacante) {
    imgAtacante.classList.add(`animacion-ataque-p${idAtacante}`);
    setTimeout(() => imgAtacante.classList.remove(`animacion-ataque-p${idAtacante}`), 800);
  }
  if (imgDefensor) {
    imgDefensor.classList.add('animacion-golpe');
    setTimeout(() => imgDefensor.classList.remove('animacion-golpe'), 800);
  }

  actualizarBarra(d, n);
  const textoCritico = esCritico ? ' <strong style="color: #ff0000; font-size: 1.2em;">¡CRÍTICO!</strong>' : '';
  log.innerHTML += `${a.nombre} golpea por ${dmg}${textoCritico}<br>`;
  log.scrollTop = log.scrollHeight;

  if (d.hp <= 0) {
    fin(a);
  }
}

function actualizarBarra(p, n) {
  const pct = Math.max(0, (p.hp / p.maxHp) * 100);
  const b = document.getElementById(`vida${n}`);
  if (b) {
    b.style.width = pct + '%';
    b.style.background = pct < 30 ? 'red' : pct < 60 ? 'orange' : 'limegreen';
  }
}

function fin(ganador) {
  clearInterval(pelea);
  log.innerHTML += `<strong>🏆 GANA ${ganador.nombre}</strong><br><br>`;
}

function reiniciarCombate() {
  if (pelea) clearInterval(pelea);
  // Resetear vida de los luchadores seleccionados
  seleccionados.forEach(p => {
    p.hp = p.maxHp;
  });
  iniciarCombate();
}

function volverAlMenu() {
  if (pelea) clearInterval(pelea);
  seleccionados = [];
  window.location.hash = '';
  // Recargar luchadores para resetear estados visuales (botones de selección)
  cargarLuchadores();
}
