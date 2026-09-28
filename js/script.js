 const users = [
     { name: "Cliente Demo", email: "cliente@hym.com", phone: "3000000000", password: "1234", role: "cliente" },
     { name: "Técnico Demo", email: "tecnico@hym.com", phone: "3111111111", password: "1234", role: "tecnico", specialty: "Plomería", experience: 5 },
     { name: "Admin Demo", email: "admin@hym.com", phone: "3222222222", password: "1234", role: "admin" }
  ];

  const serviceRequests = [
     {
       id: 1,
       title: "Reparación de tubería en cocina",
       category: "Plomería",
       description: "Se requiere reparar una fuga en la tubería de la cocina.",
       location: "Bogotá",
       budget: 250000,
       date: "2026-06-25",
       client: "Cliente Demo"
     },
     {
       id: 2,
       title: "Pintura de sala y comedor",
       category: "Pintura",
       description: "Se necesita pintar paredes internas en apartamento.",
       location: "Soacha",
       budget: 600000,
       date: "2026-06-28",
       client: "Cliente Demo"
     }
  ];

  const quotes = [
     {
       id: 1,
       serviceId: 1,
       technician: "Técnico Demo",
       labor: 180000,
       materials: 50000,
       days: 2,
       commissionPercent: 10
     }
  ];

  const messages = [
     { from: "Cliente Demo", to: "Técnico Demo", text: "Buenos días, quisiera confirmar disponibilidad para la reparación." },
     { from: "Técnico Demo", to: "Cliente Demo", text: "Claro, puedo revisar el daño mañana en la mañana." }
  ];

  const ratings = [
     { client: "Cliente Demo", technician: "Técnico Demo", score: 5, comment: "Excelente trabajo, muy cumplido." }
  ];

  let currentUser = null;

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
    const target = document.getElementById(id);
    if (target) target.classList.add("active");
  }

  function toggleTechFields() {
    const role = document.getElementById("regRole").value;
    const techFields = document.getElementById("techFields");
    if (role === "tecnico") {
      techFields.classList.remove("hidden");
    } else {
      techFields.classList.add("hidden");
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(value);
  }

  function logout() {
    currentUser = null;
    showScreen("home");
  }

  document.getElementById("registerForm").addEventListener("submit", function(e) {
   e.preventDefault();

   const name = document.getElementById("regName").value.trim();
   const email = document.getElementById("regEmail").value.trim();
   const phone = document.getElementById("regPhone").value.trim();
   const password = document.getElementById("regPassword").value.trim();
   const role = document.getElementById("regRole").value;
   const specialty = document.getElementById("regSpecialty").value.trim();
   const experience = document.getElementById("regExperience").value.trim();
   const msg = document.getElementById("registerMsg");

   if (!name || !email || !phone || !password || !role) {
     msg.style.color = "red";
     msg.textContent = "Por favor complete todos los campos obligatorios.";
     return;
   }

   const exists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
   if (exists) {
     msg.style.color = "red";
     msg.textContent = "Ya existe un usuario registrado con ese correo.";
     return;
   }

   const newUser = { name, email, phone, password, role };

   if (role === "tecnico") {
     newUser.specialty = specialty || "No especificada";
     newUser.experience = experience || 0;
   }

   users.push(newUser);

    msg.style.color = "green";
    msg.textContent = "Usuario registrado correctamente. Ya puede iniciar sesión.";
    this.reset();
    toggleTechFields();
  });

  document.getElementById("loginForm").addEventListener("submit", function(e) {
   e.preventDefault();

   const email = document.getElementById("loginEmail").value.trim();
   const password = document.getElementById("loginPassword").value.trim();
   const msg = document.getElementById("loginMsg");

   const user = users.find(u => u.email === email && u.password === password);

   if (!user) {
     msg.style.color = "red";
     msg.textContent = "Credenciales incorrectas.";
     return;
   }

   currentUser = user;
   msg.style.color = "green";
   msg.textContent = "Ingreso exitoso.";

    if (user.role === "cliente") {
      showScreen("clientePanel");
      renderClientSection("inicio");
    } else if (user.role === "tecnico") {
      showScreen("tecnicoPanel");
      renderTechSection("inicio");
    } else if (user.role === "admin") {
      showScreen("adminPanel");
      renderAdminSection("inicio");
    }
  });

  function renderClientSection(section) {
   const container = document.getElementById("clientContent");

   if (section === "inicio") {
     container.innerHTML = `
       <h3 style="color:#0f3d75; margin-bottom:16px;">Bienvenido, ${currentUser ? currentUser.name : "Cliente"}</h3>
       <div class="stats">
        <div class="stat"><h4>Solicitudes</h4><p>${serviceRequests.length} registradas</p></div>
        <div class="stat"><h4>Cotizaciones</h4><p>${quotes.length} recibidas</p></div>
        <div class="stat"><h4>Calificaciones</h4><p>${ratings.length} registradas</p></div>
       </div>
       <div class="card">
        <h3>Resumen del módulo cliente</h3>
        <p>Desde este panel el cliente puede solicitar un servicio, revisar cotizaciones, comunicarse con el técnico, realizar pagos y calificar el trabajo ejecutado.</p>
          </div>
        `;
    }

    if (section === "solicitar") {
      container.innerHTML = `
        <h3 style="color:#0f3d75; margin-bottom:16px;">Solicitud de servicio</h3>
        <form id="serviceForm">
         <div><label>Título del servicio</label><input type="text" id="serviceTitle" required /></div>
         <div>
           <label>Categoría</label>
           <select id="serviceCategory" required>
            <option value="">Seleccione</option>
            <option>Plomería</option>
            <option>Electricidad</option>
            <option>Pintura</option>
            <option>Obra gris</option>
            <option>Acabados</option>
            <option>Carpintería</option>
           </select>
         </div>
         <div><label>Descripción</label><textarea id="serviceDescription" required></textarea></div>
         <div><label>Ubicación</label><input type="text" id="serviceLocation" required /></div>
         <div><label>Presupuesto estimado</label><input type="number" id="serviceBudget" required /></div>
         <div><label>Fecha estimada</label><input type="date" id="serviceDate" required /></div>
         <button class="btn success" type="submit">Enviar solicitud</button>
        </form>
        <p id="serviceMsg" style="margin-top: 12px; font-weight:bold;"></p>
      `;

        document.getElementById("serviceForm").addEventListener("submit", function(e) {
         e.preventDefault();

         const title = document.getElementById("serviceTitle").value.trim();
         const category = document.getElementById("serviceCategory").value;
         const description = document.getElementById("serviceDescription").value.trim();
         const location = document.getElementById("serviceLocation").value.trim();
         const budget = Number(document.getElementById("serviceBudget").value);
         const date = document.getElementById("serviceDate").value;

         const newService = {
           id: serviceRequests.length + 1,
           title, category, description, location, budget, date,
           client: currentUser ? currentUser.name : "Cliente"
         };

         serviceRequests.push(newService);

          const msg = document.getElementById("serviceMsg");
          msg.style.color = "green";
          msg.textContent = "Solicitud registrada correctamente.";
          this.reset();
        });
    }

    if (section === "cotizaciones") {
      let rows = "";
      if (quotes.length === 0) {
        rows = `<tr><td colspan="7">No hay cotizaciones registradas.</td></tr>`;
      } else {
        quotes.forEach(q => {
          const total = q.labor + q.materials;
          const commission = total * (q.commissionPercent / 100);
          const finalTotal = total + commission;
          rows += `
            <tr>
             <td>${q.id}</td>
             <td>${q.technician}</td>
             <td>${formatCurrency(q.labor)}</td>
             <td>${formatCurrency(q.materials)}</td>
             <td>${q.commissionPercent}%</td>
             <td>${formatCurrency(finalTotal)}</td>
             <td>
               <button class="btn success" onclick="alert('Cotización aceptada correctamente')">Aceptar</button>
               <button class="btn danger" onclick="alert('Cotización rechazada')">Rechazar</button>
             </td>
            </tr>
          `;
        });
      }

        container.innerHTML = `
          <h3 style="color:#0f3d75; margin-bottom:16px;">Cotizaciones recibidas</h3>
          <table>
           <thead>
             <tr>
              <th>ID</th>
              <th>Técnico</th>
              <th>Mano de obra</th>
              <th>Materiales</th>
              <th>Comisión</th>
              <th>Total final</th>
              <th>Acción</th>
             </tr>
           </thead>
           <tbody>${rows}</tbody>
          </table>
        `;
    }

    if (section === "mensajes") {
      let html = `<h3 style="color:#0f3d75; margin-bottom:16px;">Mensajes</h3>`;
      messages.forEach(m => {
        html += `
          <div class="message-box">
           <strong>${m.from}</strong> → <strong>${m.to}</strong>
           <p style="margin-top:8px;">${m.text}</p>
          </div>
        `;
      });
      html += `
        <div class="card">
          <h3>Nuevo mensaje</h3>
          <textarea id="newClientMsg" placeholder="Escribe un mensaje..."></textarea>
          <button class="btn" style="margin-top:12px;" onclick="sendClientMessage()">Enviar</button>
        </div>
      `;
      container.innerHTML = html;
    }

    if (section === "pagos") {
      const agreedValue = 230000;
      const commissionPercent = 10;
      const commission = agreedValue * (commissionPercent / 100);
      const total = agreedValue + commission;

        container.innerHTML = `
          <h3 style="color:#0f3d75; margin-bottom:16px;">Pagos y comisión</h3>
          <div class="grid-3">
           <div class="card"><h3>Valor del servicio</h3><p>${formatCurrency(agreedValue)}</p></div>
           <div class="card"><h3>Comisión HYM (${commissionPercent}%)</h3><p>${formatCurrency(commission)}</p></div>
           <div class="card"><h3>Total a pagar</h3><p>${formatCurrency(total)}</p></div>
          </div>
          <button class="btn success" style="margin-top:16px;" onclick="alert('Pago registrado correctamente')">Pagar servicio</button>
        `;
    }

    if (section === "calificaciones") {
      let html = `<h3 style="color:#0f3d75; margin-bottom:16px;">Calificaciones</h3>`;
      ratings.forEach(r => {
        html += `
          <div class="card" style="margin-bottom:12px;">
           <h3>${r.technician}</h3>
           <p><strong>Puntaje:</strong> ${r.score}/5</p>
           <p><strong>Comentario:</strong> ${r.comment}</p>
          </div>
        `;
      });

        html += `
          <div class="card">
           <h3>Registrar nueva calificación</h3>
           <div style="margin-bottom:12px;"><label>Técnico</label><input type="text" id="ratingTech" placeholder="Nombre del técnico" /></div>
           <div style="margin-bottom:12px;"><label>Puntaje (1 a 5)</label><input type="number" id="ratingScore" min="1" max="5" /></div>
           <div style="margin-bottom:12px;"><label>Comentario</label><textarea id="ratingComment"></textarea></div>
           <button class="btn success" onclick="saveRating()">Guardar calificación</button>
          </div>
        `;

        container.innerHTML = html;
    }
}

function sendClientMessage() {
 const textarea = document.getElementById("newClientMsg");
 if (!textarea || !textarea.value.trim()) {
   alert("Escribe un mensaje antes de enviarlo.");
   return;
 }

    messages.push({
      from: currentUser ? currentUser.name : "Cliente",
      to: "Técnico Demo",
      text: textarea.value.trim()
    });

    alert("Mensaje enviado correctamente.");
    renderClientSection("mensajes");
}

function saveRating() {
 const technician = document.getElementById("ratingTech").value.trim();
 const score = Number(document.getElementById("ratingScore").value);
 const comment = document.getElementById("ratingComment").value.trim();

    if (!technician || !score || !comment) {
      alert("Complete todos los campos de la calificación.");
      return;
    }

    ratings.push({
      client: currentUser ? currentUser.name : "Cliente",
      technician, score, comment
    });

    alert("Calificación registrada correctamente.");
    renderClientSection("calificaciones");
}

function renderTechSection(section) {
 const container = document.getElementById("techContent");

    if (section === "inicio") {
      container.innerHTML = `
        <h3 style="color:#0f3d75; margin-bottom:16px;">Bienvenido, ${currentUser ? currentUser.name : "Técnico"}</h3>
        <div class="stats">
         <div class="stat"><h4>Solicitudes disponibles</h4><p>${serviceRequests.length}</p></div>
         <div class="stat"><h4>Cotizaciones enviadas</h4><p>${quotes.length}</p></div>
         <div class="stat"><h4>Calificación promedio</h4><p>5/5</p></div>
        </div>
        <div class="card">
         <h3>Resumen del módulo técnico</h3>
         <p>El técnico puede revisar solicitudes, enviar cotizaciones, administrar su reputación y consultar el valor neto a recibir después de la comisión de HYM.</p>
        </div>
      `;
    }

    if (section === "solicitudes") {
      let rows = "";
      serviceRequests.forEach(s => {
        rows += `
          <tr>
           <td>${s.id}</td>
           <td>${s.title}</td>
           <td>${s.category}</td>
           <td>${s.location}</td>
           <td>${formatCurrency(s.budget)}</td>
           <td>${s.date}</td>
          </tr>
        `;
      });

        container.innerHTML = `
         <h3 style="color:#0f3d75; margin-bottom:16px;">Solicitudes disponibles</h3>
          <table>
           <thead>
             <tr>
              <th>ID</th>
              <th>Servicio</th>
              <th>Categoría</th>
              <th>Ubicación</th>
              <th>Presupuesto</th>
              <th>Fecha</th>
             </tr>
           </thead>
           <tbody>${rows}</tbody>
          </table>
        `;
    }

    if (section === "cotizar") {
      container.innerHTML = `
        <h3 style="color:#0f3d75; margin-bottom:16px;">Enviar cotización</h3>
        <form id="quoteForm">
         <div><label>ID del servicio</label><input type="number" id="quoteServiceId" required /></div>
         <div><label>Valor mano de obra</label><input type="number" id="quoteLabor" required /></div>
         <div><label>Valor materiales</label><input type="number" id="quoteMaterials" required /></div>
         <div><label>Días estimados</label><input type="number" id="quoteDays" required /></div>
         <button class="btn success" type="submit">Registrar cotización</button>
        </form>
        <p id="quoteMsg" style="margin-top:12px; font-weight:bold;"></p>
      `;

        document.getElementById("quoteForm").addEventListener("submit", function(e) {
         e.preventDefault();

         const serviceId = Number(document.getElementById("quoteServiceId").value);
         const labor = Number(document.getElementById("quoteLabor").value);
         const materials = Number(document.getElementById("quoteMaterials").value);
         const days = Number(document.getElementById("quoteDays").value);

         if (!serviceId || !labor || !materials || !days) {
           document.getElementById("quoteMsg").style.color = "red";
           document.getElementById("quoteMsg").textContent = "Complete todos los campos.";
           return;
         }

         quotes.push({
           id: quotes.length + 1,
           serviceId,
           technician: currentUser ? currentUser.name : "Técnico",
           labor, materials, days,
           commissionPercent: 10
         });

          document.getElementById("quoteMsg").style.color = "green";
          document.getElementById("quoteMsg").textContent = "Cotización registrada correctamente.";
          this.reset();
        });
    }

    if (section === "mensajes") {
      let html = `<h3 style="color:#0f3d75; margin-bottom:16px;">Mensajes</h3>`;
      messages.forEach(m => {
        html += `
          <div class="message-box">
           <strong>${m.from}</strong> → <strong>${m.to}</strong>
           <p style="margin-top:8px;">${m.text}</p>
          </div>
        `;
      });

        html += `
          <div class="card">
           <h3>Responder mensaje</h3>
           <textarea id="newTechMsg" placeholder="Escribe tu respuesta..."></textarea>
           <button class="btn" style="margin-top:12px;" onclick="sendTechMessage()">Enviar</button>
          </div>
        `;
        container.innerHTML = html;
    }

    if (section === "pagos") {
      const gross = 230000;
      const commissionPercent = 10;
      const commission = gross * commissionPercent / 100;
      const net = gross - commission;

        container.innerHTML = `
          <h3 style="color:#0f3d75; margin-bottom:16px;">Pagos y comisión</h3>
          <div class="grid-3">
           <div class="card"><h3>Valor acordado</h3><p>${formatCurrency(gross)}</p></div>
           <div class="card"><h3>Comisión HYM (${commissionPercent}%)</h3><p>${formatCurrency(commission)}</p></div>
           <div class="card"><h3>Valor neto a recibir</h3><p>${formatCurrency(net)}</p></div>
          </div>
        `;
    }

    if (section === "reputacion") {
      let techRatings = ratings.filter(r => r.technician === (currentUser ? currentUser.name : "Técnico Demo"));
      if (techRatings.length === 0) techRatings = ratings;

        let html = `<h3 style="color:#0f3d75; margin-bottom:16px;">Reputación del técnico</h3>`;
        techRatings.forEach(r => {
          html += `
            <div class="card" style="margin-bottom:12px;">
             <h3>Calificación: ${r.score}/5</h3>
             <p><strong>Cliente:</strong> ${r.client}</p>
             <p><strong>Comentario:</strong> ${r.comment}</p>
            </div>
          `;
        });

        container.innerHTML = html;
    }
}

function sendTechMessage() {
 const textarea = document.getElementById("newTechMsg");
 if (!textarea || !textarea.value.trim()) {
   alert("Escribe un mensaje antes de enviarlo.");
   return;
 }

    messages.push({
      from: currentUser ? currentUser.name : "Técnico",
      to: "Cliente Demo",
      text: textarea.value.trim()
    });

    alert("Mensaje enviado correctamente.");
    renderTechSection("mensajes");
}

function renderAdminSection(section) {
 const container = document.getElementById("adminContent");

    if (section === "inicio") {
      container.innerHTML = `
        <h3 style="color:#0f3d75; margin-bottom:16px;">Bienvenido, ${currentUser ? currentUser.name : "Administrador"}</h3>
        <div class="stats">
         <div class="stat"><h4>Usuarios registrados</h4><p>${users.length}</p></div>
         <div class="stat"><h4>Solicitudes</h4><p>${serviceRequests.length}</p></div>
         <div class="stat"><h4>Cotizaciones</h4><p>${quotes.length}</p></div>
        </div>
        <div class="card">
         <h3>Resumen administrativo</h3>
         <p>Desde este módulo el administrador puede visualizar usuarios, servicios, cotizaciones y la trazabilidad del sistema HYM.</p>
        </div>
      `;
    }

    if (section === "usuarios") {
      let rows = "";
      users.forEach(u => {
        rows += `
          <tr>
           <td>${u.name}</td>
           <td>${u.email}</td>
           <td>${u.phone}</td>
           <td>${u.role}</td>
          </tr>
        `;
      });

        container.innerHTML = `
          <h3 style="color:#0f3d75; margin-bottom:16px;">Usuarios registrados</h3>
          <table>
           <thead>
             <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Rol</th>
             </tr>
           </thead>
           <tbody>${rows}</tbody>
          </table>
        `;
    }

    if (section === "servicios") {
      let rows = "";
      serviceRequests.forEach(s => {
        rows += `
          <tr>
           <td>${s.id}</td>
           <td>${s.title}</td>
           <td>${s.category}</td>
           <td>${s.client}</td>
           <td>${formatCurrency(s.budget)}</td>
          </tr>
        `;
      });

        container.innerHTML = `
          <h3 style="color:#0f3d75; margin-bottom:16px;">Servicios registrados</h3>
          <table>
           <thead>
             <tr>
              <th>ID</th>
              <th>Servicio</th>
              <th>Categoría</th>
              <th>Cliente</th>
              <th>Presupuesto</th>
             </tr>
           </thead>
           <tbody>${rows}</tbody>
          </table>
        `;
    }

    if (section === "pagos") {
      let totalCommission = 0;
      quotes.forEach(q => {
        totalCommission += (q.labor + q.materials) * (q.commissionPercent / 100);
      });

        container.innerHTML = `
          <h3 style="color:#0f3d75; margin-bottom:16px;">Pagos y comisiones</h3>
          <div class="grid-3">
           <div class="card"><h3>Cotizaciones registradas</h3><p>${quotes.length}</p></div>
           <div class="card"><h3>Comisión total estimada</h3><p>${formatCurrency(totalCommission)}</p></div>
           <div class="card"><h3>Estado</h3><p>Control administrativo activo</p></div>
          </div>
        `;
    }

    if (section === "reportes") {
      container.innerHTML = `
        <h3 style="color:#0f3d75; margin-bottom:16px;">Reportes del sistema</h3>
        <div class="card">
         <h3>Indicadores de HYM</h3>
         <p><strong>Total usuarios:</strong> ${users.length}</p>
         <p><strong>Total solicitudes:</strong> ${serviceRequests.length}</p>
         <p><strong>Total cotizaciones:</strong> ${quotes.length}</p>
         <p><strong>Total calificaciones:</strong> ${ratings.length}</p>
        </div>
        `;
      }
    }
    function calcular() {
  const subtotal = parseFloat(
    document.getElementById("subtotal").value
  ) || 0;
  const costos = parseFloat(
    document.getElementById("costos").value
  ) || 0;

  // IVA Colombia = 19%
  const iva = subtotal * 0.19;
  const total = subtotal + iva;
  const gananciaNeta = subtotal - costos;

  outSubtotal.textContent = formatCOP(subtotal);
  outIVA.textContent = formatCOP(iva);
  outTotal.textContent = formatCOP(total);
  outCostos.textContent = formatCOP(costos);
  outNeta.textContent = formatCOP(gananciaNeta);
}

// Recalcula en tiempo real al cambiar
// el valor del servicio o los costos
subtotal.oninput = calcular;
costos.oninput = calcular;
calcular();

// 1. Primero seleccionamos los elementos del HTML
const inputSubtotal = document.getElementById("subtotal");
const inputCostos = document.getElementById("costos");

const outSubtotal = document.getElementById("outSubtotal");
const outIVA = document.getElementById("outIVA");
const outTotal = document.getElementById("outTotal");
const outCostos = document.getElementById("outCostos");
const outNeta = document.getElementById("outNeta");

// Función auxiliar para dar formato de dinero (Pesos Colombianos)
function formatCOP(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor);
}

// 2. Tu función con la lógica matemática
function calcular() {
  // Simulando el ejemplo: subtotal = 500000, costos = 150000
  const subtotal = parseFloat(inputSubtotal.value) || 0;
  const costos = parseFloat(inputCostos.value) || 0;

  // IVA Colombia = 19%
  const iva = subtotal * 0.19;          // 500,000 * 0.19 = 95,000
  const total = subtotal + iva;          // 500,000 + 95,000 = 595,000
  const gananciaNeta = subtotal - costos; // 500,000 - 150,000 = 350,000

  // 3. Pintamos los resultados reales en la pantalla
  outSubtotal.textContent = formatCOP(subtotal); // $ 500.000
  outIVA.textContent = formatCOP(iva);           // $ 95.000
  outTotal.textContent = formatCOP(total);       // $ 595.000
  outCostos.textContent = formatCOP(costos);     // $ 150.000
  outNeta.textContent = formatCOP(gananciaNeta); // $ 350.000
}

// Recalcula en tiempo real al cambiar los inputs
inputSubtotal.oninput = calcular;
inputCostos.oninput = calcular;

// Ejecución inicial
calcular();