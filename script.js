'use strict';
const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menú'); }
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('click', e => { if (!e.target.closest('header')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);
const plans = {
  ahorro: ['Mira el costo completo.', 'Una tarifa baja puede cambiar al añadir maletas, asientos o traslados.', ['Compara fechas cercanas si tienes flexibilidad.', 'Suma equipaje y transporte desde el aeropuerto.', 'Revisa condiciones de cambios antes de pagar.']],
  tiempo: ['El tiempo también cuenta.', 'Compara el trayecto completo, desde que sales de casa hasta que llegas a tu alojamiento.', ['Considera vuelos directos y duración total.', 'Revisa las distancias entre aeropuerto y ciudad.', 'Evita conexiones que no te den margen suficiente.']],
  calma: ['Dale espacio a los imprevistos.', 'Un itinerario sencillo puede hacer tu primer viaje mucho más llevadero.', ['Prioriza horarios que puedas cumplir sin correr.', 'Comprueba si todas las conexiones están en una reserva.', 'Ten tus documentos y artículos esenciales a mano.']]
};
function showPlan(key) { const [title, intro, list] = plans[key]; const box = document.getElementById('plan-result'); box.replaceChildren(); const h = document.createElement('h3'); h.textContent = title; const p = document.createElement('p'); p.textContent = intro; const ul = document.createElement('ul'); list.forEach(text => { const li = document.createElement('li'); li.textContent = text; ul.append(li); }); box.append(h, p, ul); }
document.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-plan]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); showPlan(button.dataset.plan); }));
showPlan('ahorro');
const destinations = {
  tokio: {country:'JAPÓN / CIUDAD Y CULTURA', title:'Tokio, a tu ritmo.', intro:'Luces, pequeños callejones y jardines tranquilos. Una ciudad para explorar por barrios.', sections:[['Para imaginar tu viaje','Combina la energía de Shibuya con un paseo por Asakusa y un descanso en un jardín. No intentes recorrer toda la ciudad en un día.'],['Antes de elegir el vuelo','Compara Haneda y Narita: el aeropuerto de llegada influye en tu traslado. Revisa también los países de tránsito si tienes escalas.'],['Consejo de preparación','Guarda la dirección de tu alojamiento y descarga un mapa para consultarlo sin conexión.']]},
  roma: {country:'ITALIA / HISTORIA Y PASEOS', title:'Roma, sin correr.', intro:'Plazas, ruinas y calles que invitan a perder la noción del tiempo.', sections:[['Para imaginar tu viaje','Organiza los paseos por zonas: el entorno del Coliseo, el centro histórico y Trastevere pueden formar jornadas diferentes.'],['Antes de elegir el vuelo','Comprueba si llegas a Fiumicino o Ciampino y cómo conectar con tu alojamiento. Un aeropuerto distinto puede cambiar el costo final.'],['Consejo de preparación','Consulta directamente las condiciones de acceso y reserva de los lugares que quieras visitar.']]},
  lisboa: {country:'PORTUGAL / COLINAS Y RÍO', title:'Lisboa, con pausa.', intro:'Miradores, fachadas de azulejos y luz sobre el Tajo.', sections:[['Para imaginar tu viaje','Alterna las calles de Alfama con paseos por el centro y una visita a Belém. Deja tiempo libre para los miradores.'],['Antes de elegir el vuelo','Piensa en el horario de llegada y en las opciones de traslado a tu alojamiento. Si continúas a otra ciudad, calcula margen.'],['Consejo de preparación','Lleva calzado cómodo y planea recorridos realistas: las cuestas también cuentan.']]},
  bangkok: {country:'TAILANDIA / SABORES Y TEMPLOS', title:'Bangkok, despierta.', intro:'Mercados, templos y una vida urbana que cambia a cada paso.', sections:[['Para imaginar tu viaje','Combina una visita cultural con tiempo junto al río y un recorrido gastronómico. Evita llenar cada hora del itinerario.'],['Antes de elegir el vuelo','Comprueba si tu vuelo utiliza Suvarnabhumi o Don Mueang. Si una conexión requiere cambiar de aeropuerto, cuenta con el traslado.'],['Consejo de preparación','Revisa el clima esperado y las normas de vestimenta de los templos que quieras visitar.']]}
};
const dialog = document.getElementById('destination-dialog');
let opener;
document.querySelectorAll('[data-destination]').forEach(button => button.addEventListener('click', () => { const data = destinations[button.dataset.destination]; opener = button; document.getElementById('dialog-country').textContent = data.country; document.getElementById('dialog-title').textContent = data.title; document.getElementById('dialog-intro').textContent = data.intro; const body = document.getElementById('dialog-body'); body.replaceChildren(); data.sections.forEach(([title, text]) => { const h = document.createElement('h3'); h.textContent = title; const p = document.createElement('p'); p.textContent = text; body.append(h, p); }); dialog.showModal(); dialog.scrollTop = 0; document.body.classList.add('modal-open'); }));
document.querySelectorAll('.close, .close-bottom').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); if(opener) opener.focus(); });
const checks = [...document.querySelectorAll('.checklist input')];
const storageKey = 'rumbo-checklist-v1';
try { const saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); if(Array.isArray(saved)) checks.forEach(c => { c.checked = saved.includes(c.value); }); } catch (_) { /* La lista funciona también sin almacenamiento. */ }
function updateChecklist(save = true) { const ready = checks.filter(c => c.checked); document.getElementById('progress-label').textContent = `${ready.length} de ${checks.length} preparados${ready.length === checks.length ? ' · ¡Todo listo para revisar tu viaje!' : ''}`; document.getElementById('progress').value = ready.length; document.getElementById('progress').textContent = `${ready.length} de ${checks.length}`; if(save) try { localStorage.setItem(storageKey, JSON.stringify(ready.map(c => c.value))); } catch (_) {} }
checks.forEach(c => c.addEventListener('change', () => updateChecklist()));
document.getElementById('reset').addEventListener('click', () => { checks.forEach(c => { c.checked = false; }); updateChecklist(); });
updateChecklist(false);
document.getElementById('year').textContent = new Date().getFullYear();
