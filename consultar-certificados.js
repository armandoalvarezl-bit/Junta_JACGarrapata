const API_URL = "https://script.google.com/macros/s/AKfycbzi3IGrfQ7OvaWFyz3mZ8wTRZlapjG2k6lxZF0AdPD0EgNTGqlONbSvWlcT0jUJwYhC/exec";
const SIGNER_NAME = "Jorge Pelferto Hernandez";
const SIGNER_ID = "CC:98651838";
const SIGNER_ROLE = "Presidente Junta";
    const statusEl = document.getElementById("status");
    const resultadoEl = document.getElementById("resultado");
    const historialBody = document.getElementById("historialBody");
    const codigoInputEl = document.getElementById("codigoInput");
    const resultActionsEl = document.getElementById("resultActions");
    const descargarBtn = document.getElementById("descargarBtn");
    const toastWrapEl = document.getElementById("toastWrap");
    const confirmOverlayEl = document.getElementById("confirmOverlay");
    const confirmTitleEl = document.getElementById("confirmTitle");
    const confirmMessageEl = document.getElementById("confirmMessage");
    const confirmCancelBtn = document.getElementById("confirmCancelBtn");
    const confirmAcceptBtn = document.getElementById("confirmAcceptBtn");
    let certificados = [];
    let certificadoActual = null;
    let confirmResolver = null;

    init();
    document.getElementById("yearLabel").textContent = "Actualizado " + new Date().getFullYear();

    document.getElementById("buscarBtn").addEventListener("click", buscarCertificado);
    descargarBtn.addEventListener("click", descargarCertificadoActual);
    codigoInputEl.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        buscarCertificado();
      }
    });
    document.getElementById("limpiarBtn").addEventListener("click", async function () {
      if (!codigoInputEl.value.trim() && !certificadoActual) {
        codigoInputEl.value = "";
        certificadoActual = null;
        setStatus("");
        resetResult();
        return;
      }
      const accepted = await askConfirmation(
        "Limpiar consulta",
        "Se borrara la busqueda actual. ¿Deseas continuar?",
        "Limpiar"
      );
      if (!accepted) {
        showToast("Limpieza cancelada.", "info");
        return;
      }
      codigoInputEl.value = "";
      certificadoActual = null;
      setStatus("");
      resetResult();
      showToast("Consulta limpia.", "success");
    });
    confirmCancelBtn.addEventListener("click", function () {
      resolveConfirmation(false);
    });
    confirmAcceptBtn.addEventListener("click", function () {
      resolveConfirmation(true);
    });
    confirmOverlayEl.addEventListener("click", function (event) {
      if (event.target === confirmOverlayEl) {
        resolveConfirmation(false);
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && confirmResolver) {
        resolveConfirmation(false);
      }
    });

    async function init() {
      renderHistory();
      if (!isApiConfigured()) {
        setStatus("Configura API_URL con tu Web App de Apps Script.", true);
        return;
      }

      setStatus("Cargando historial en linea...");
      try {
        certificados = await apiList(30);
        renderHistory();
        setStatus("");
      } catch (error) {
        setStatus(error.message || "No se pudo cargar el historial en linea.", true);
      }
    }

    async function buscarCertificado() {
      const raw = codigoInputEl.value.trim();
      const code = raw.toUpperCase();
      const documento = normalizeDoc(raw);
      const query = code.startsWith("GAR-") ? { codigo: code } : { documento: documento };

      if (!raw) {
        setStatus("Ingresa un codigo o cedula para consultar.", true);
        return;
      }
      if (!code.startsWith("GAR-") && !documento) {
        setStatus("Ingresa un dato valido para consultar.", true);
        return;
      }
      if (!isApiConfigured()) {
        setStatus("Configura API_URL para consultar en linea.", true);
        return;
      }

      setStatus("Consultando base en linea...");
      try {
        const found = await apiFind(query);
        if (!found) {
          setStatus("No se encontro certificado para ese dato.", true);
          certificadoActual = null;
          resetResult();
          return;
        }

        certificadoActual = found;
        renderResult(found);
        setStatus("Certificado valido y encontrado.");
        showToast("Certificado encontrado.", "success");
      } catch (error) {
        certificadoActual = null;
        resetResult();
        setStatus(error.message || "No se pudo completar la consulta.", true);
        showToast(error.message || "No se pudo completar la consulta.", "error");
      }
    }

    function renderResult(cert) {
      const fecha = formatDate(cert.fechaISO);
      const estado = String(cert.estado || "ACTIVO").toUpperCase();
      const valido = estado === "ACTIVO";
      const tituloEstado = valido
        ? "VALIDO"
        : (estado === "VALIDACION" ? "BORRADOR EN VALIDACION" : estado);
      const mensajeEstado = valido
        ? "El certificado consultado se encuentra registrado en la base oficial de la organizacion."
        : (estado === "VALIDACION"
          ? "El certificado esta en validacion y solo puede verse como borrador."
          : "El certificado consultado se encuentra " + escapeHtml(estado) + " y no es valido para tramites.");
      const observacionesEstado = String(cert.observacionesEstado || "").trim();
      resultadoEl.innerHTML =
        "<h3>ESTADO DEL CERTIFICADO: " + escapeHtml(tituloEstado) + "</h3>" +
        "<p>" + mensajeEstado + "</p>" +
        "<p>" + (valido ? "Para obtener el documento, usa el boton de descarga." : "Si tienes dudas, consulta con la Junta.") + "</p>" +
        (observacionesEstado ? "<p><strong>Observaciones:</strong> " + escapeHtml(observacionesEstado) + "</p>" : "") +
        "<div class='result-meta'>" +
        "<span>Consecutivo: " + escapeHtml(cert.consecutivo) + "</span>" +
        "<span>Codigo: " + escapeHtml(cert.codigo) + "</span>" +
        "<span>Fecha: " + escapeHtml(fecha) + "</span>" +
        "<span>Estado: " + escapeHtml(estado) + "</span>" +
        "</div>";
      resultActionsEl.hidden = !valido;
    }

    function resetResult() {
      resultadoEl.innerHTML =
        "<h3>ESTADO DEL CERTIFICADO</h3>" +
        "<p>Ingresa un codigo o cedula para consultar.</p>" +
        "<div class='result-meta'>" +
        "<span>Consecutivo: -</span>" +
        "<span>Codigo: -</span>" +
        "<span>Fecha: -</span>" +
        "<span>Estado: -</span>" +
        "</div>";
      resultActionsEl.hidden = true;
    }

    function renderHistory() {
      if (!certificados.length) {
        historialBody.innerHTML = "<tr><td colspan='4'>No hay certificados en la base en linea.</td></tr>";
        return;
      }

      historialBody.innerHTML = certificados.map(function (cert) {
        const estado = String(cert.estado || "ACTIVO").toUpperCase();
        return (
          "<tr>" +
          "<td>" + escapeHtml(cert.consecutivo) + "</td>" +
          "<td>" + escapeHtml(cert.codigo) + "</td>" +
          "<td>" + escapeHtml(formatDate(cert.fechaISO)) + "</td>" +
          "<td>" + escapeHtml(estado) + "</td>" +
          "</tr>"
        );
      }).join("");
    }

    async function apiList(limit) {
      const json = await apiRequest("GET", { action: "list", limit: String(limit || 30) });
      return Array.isArray(json.data) ? json.data : [];
    }

    async function apiFind(params) {
      const query = { action: "find" };
      if (params.codigo) query.codigo = params.codigo;
      if (params.documento) query.documento = params.documento;
      const json = await apiRequest("GET", query);
      return json.data || null;
    }

    async function descargarCertificadoActual() {
      if (!certificadoActual) {
        setStatus("Primero consulta un certificado para descargar.", true);
        showToast("Primero consulta un certificado para descargar.", "error");
        return;
      }
      const estado = String(certificadoActual.estado || "ACTIVO").toUpperCase();
      if (estado !== "ACTIVO") {
        setStatus("El certificado esta " + estado + " y no se puede descargar.", true);
        await showAlert(
          "No se puede descargar",
          "El certificado esta en " + estado + " y solo podra descargarse cuando sea aprobado.",
          "Entendido"
        );
        return;
      }
      const password = normalizeDoc(certificadoActual.documento);
      if (!password) {
        setStatus("No se pudo determinar la cedula para proteger el PDF.", true);
        showToast("No se pudo determinar la cedula para proteger el PDF.", "error");
        return;
      }
      const accepted = await askConfirmation(
        "Descargar PDF protegido",
        "Se descargara un PDF protegido. La contrasena sera la cedula consultada.",
        "Descargar PDF"
      );
      if (!accepted) {
        showToast("Descarga cancelada.", "info");
        return;
      }
      try {
        downloadCertificatePdf(certificadoActual, password);
        setStatus("PDF descargado. Contrasena: " + password);
        showToast("PDF descargado con exito.", "success");
      } catch (error) {
        setStatus(error.message || "No se pudo generar el PDF.", true);
        showToast(error.message || "No se pudo generar el PDF.", "error");
      }
    }

    function downloadCertificatePdf(cert, password) {
      const JsPDF = window.jspdf && window.jspdf.jsPDF ? window.jspdf.jsPDF : null;
      if (!JsPDF) {
        throw new Error("No se cargo la libreria PDF. Recarga la pagina.");
      }

      const doc = new JsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter",
        encryption: {
          userPassword: password,
          ownerPassword: password + "-owner",
          userPermissions: ["print"]
        }
      });

      const certDate = toValidDate(cert.fechaISO);
      const day = certDate.toLocaleDateString("es-CO", { day: "2-digit" });
      const month = capitalizeFirst(certDate.toLocaleDateString("es-CO", { month: "long" }));
      const year = certDate.toLocaleDateString("es-CO", { year: "numeric" });
      const fecha = capitalizeFirst(formatDate(cert.fechaISO));
      const nivelEducativo = cert.nivelEducativo || "";
      const email = cert.email || "";
      const observaciones = cert.observaciones || "";

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const left = 18;
      const right = 18;
      const maxWidth = pageWidth - left - right;
      const centerX = pageWidth / 2;
      let y = 24;

      doc.setFont("times", "bold");
      doc.setFontSize(13);
      doc.text("JUNTA DE ACCION COMUNAL VEREDA LA GARRAPATA", centerX, y, { align: "center" });
      y += 6;
      doc.setFont("times", "normal");
      doc.text("ID: 1682 NIT: 800243416-5 CAUCASIA - ANTIOQUIA", centerX, y, { align: "center" });
      y += 5;
      doc.text("DEPARTAMENTO ADMINISTRATIVO - SECRETARIADO", centerX, y, { align: "center" });
      y += 5;
      doc.text("RUC: 1-4884-40638", centerX, y, { align: "center" });
      y += 16;

      y = writeJustifiedParagraph(
        doc,
        "Que mediante Resolucion numero 255 del 26/11/1991 expedida por GOBERNACION DE ANTIOQUIA se reconocio personeria juridica a: JUNTA DE ACCION COMUNAL VEREDA LA GARRAPATA del Municipio de CAUCASIA (ANT.), la cual se encuentra VIGENTE a la fecha.",
        left,
        y,
        maxWidth
      );
      y += 6;
      doc.setFont("times", "bold");
      doc.text("Certifica que:", centerX, y, { align: "center" });
      doc.setFont("times", "normal");
      y += 8;
      const personaBase =
        "El Senor(a) " + String(cert.nombre || "") +
        ", con " + String(cert.tipoDoc || "") + " " + String(cert.documento || "") +
        ", actualmente reside en " + String(cert.direccion || "") +
        ", municipio de Caucasia Antioquia. Reside actualmente hace mas de " +
        String(cert.anios || "") +
        " anos, conocido como un ciudadano ejemplar y activo en la Junta.";
      let personaExtra = "";
      if (nivelEducativo) personaExtra += " Nivel educativo: " + nivelEducativo + ".";
      if (email) personaExtra += " Correo: " + email + ".";
      y = writeJustifiedParagraph(
        doc,
        personaBase + personaExtra,
        left,
        y,
        maxWidth
      );
      y += 8;
      y = writeJustifiedParagraph(
        doc,
        "Este certificado se emite bajo los lineamientos y cumplimiento de los estatutos y reglamentos internos de esta organizacion, la validez y registro en el RUC lo pueden validar con el codigo de la organizacion.",
        left,
        y,
        maxWidth
      );

      if (observaciones) {
        y += 1;
        y = writeJustifiedParagraph(
          doc,
          "Observaciones: " + observaciones + ".",
          left,
          y,
          maxWidth
        );
      }

      y += 8;
      y = writeJustifiedParagraph(
        doc,
        "Se expide a solicitud del interesado a los " + day + " dias del mes de " + month + " del " + year + ", en la ciudad de Caucasia, Vereda La Garrapata.",
        left,
        y,
        maxWidth
      );

      const signatureY = Math.max(y + 24, pageHeight - 45);
      doc.line(left, signatureY, left + 70, signatureY);
      doc.setFont("times", "bold");
      doc.text(SIGNER_NAME, left, signatureY + 5);
      doc.setFont("times", "normal");
      doc.text(SIGNER_ID, left, signatureY + 10);
      doc.text(SIGNER_ROLE, left, signatureY + 15);

      const metaY = pageHeight - 24;
      doc.setFontSize(13);
      doc.text("Consecutivo: " + String(cert.consecutivo || ""), left, metaY);
      doc.text("Codigo de verificacion: " + String(cert.codigo || ""), left, metaY + 6);
      doc.text("Fecha: " + fecha, left, metaY + 12);

      const fileName = buildDownloadFileName(cert);
      doc.save(fileName);
    }

    function writeJustifiedParagraph(doc, text, x, y, maxWidth) {
      const safeText = String(text || "").trim();
      if (!safeText) return y;
      const lines = doc.splitTextToSize(safeText, maxWidth);
      const lineHeight = 6.2;

      for (let i = 0; i < lines.length; i += 1) {
        const line = String(lines[i] || "");
        const isLast = i === lines.length - 1;
        const words = line.trim().split(/\s+/).filter(Boolean);

        if (!isLast && words.length > 1) {
          const wordsWidth = words.reduce(function (acc, word) {
            return acc + doc.getTextWidth(word);
          }, 0);
          const extraGap = (maxWidth - wordsWidth) / (words.length - 1);
          let cursorX = x;
          for (let j = 0; j < words.length; j += 1) {
            const word = words[j];
            doc.text(word, cursorX, y);
            cursorX += doc.getTextWidth(word);
            if (j < words.length - 1) {
              cursorX += extraGap;
            }
          }
        } else {
          doc.text(line, x, y);
        }
        y += lineHeight;
      }
      return y;
    }

    function buildDownloadFileName(cert) {
      const codigo = String(cert.codigo || "sin-codigo").replace(/[^A-Za-z0-9-]/g, "");
      const documento = String(cert.documento || "sin-documento").replace(/[^A-Za-z0-9-]/g, "");
      return "certificado-" + documento + "-" + codigo + ".pdf";
    }

    async function apiRequest(method, params) {
      if (!isApiConfigured()) {
        throw new Error("Falta configurar API_URL.");
      }

      let response;
      if (method === "GET") {
        const url = new URL(API_URL);
        Object.keys(params || {}).forEach(function (key) {
          const value = params[key];
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, value);
          }
        });
        response = await fetch(url.toString(), { method: "GET" });
      } else {
        response = await fetch(API_URL, { method: "POST", body: params });
      }

      let json;
      try {
        json = await response.json();
      } catch (_error) {
        throw new Error("Respuesta invalida del servidor de Apps Script.");
      }

      if (!json.ok) {
        throw new Error(json.error || "Error al consultar la API.");
      }
      return json;
    }

    function isApiConfigured() {
      return API_URL && API_URL.indexOf("https://script.google.com/") === 0;
    }

    function setStatus(message, isError) {
      statusEl.textContent = message || "";
      statusEl.className = isError ? "status error" : "status";
    }

    function askConfirmation(title, message, confirmLabel) {
      return new Promise(function (resolve) {
        confirmResolver = resolve;
        confirmTitleEl.textContent = title || "Confirmar acción";
        confirmMessageEl.textContent = message || "¿Deseas continuar?";
        confirmAcceptBtn.textContent = confirmLabel || "Confirmar";
        confirmCancelBtn.hidden = false;
        confirmOverlayEl.hidden = false;
        confirmAcceptBtn.focus();
      });
    }

    function showAlert(title, message, acceptLabel) {
      return new Promise(function (resolve) {
        confirmResolver = resolve;
        confirmTitleEl.textContent = title || "Atencion";
        confirmMessageEl.textContent = message || "";
        confirmAcceptBtn.textContent = acceptLabel || "Aceptar";
        confirmCancelBtn.hidden = true;
        confirmOverlayEl.hidden = false;
        confirmAcceptBtn.focus();
      });
    }

    function resolveConfirmation(accepted) {
      if (!confirmResolver) return;
      const resolver = confirmResolver;
      confirmResolver = null;
      confirmCancelBtn.hidden = false;
      confirmOverlayEl.hidden = true;
      resolver(Boolean(accepted));
    }

    function showToast(message, type) {
      const text = String(message || "").trim();
      if (!text) return;
      const toast = document.createElement("div");
      const tone = type === "error" || type === "success" ? type : "info";
      toast.className = "toast " + tone;
      toast.textContent = text;
      toastWrapEl.appendChild(toast);
      requestAnimationFrame(function () {
        toast.classList.add("show");
      });
      setTimeout(function () {
        toast.classList.remove("show");
        setTimeout(function () {
          toast.remove();
        }, 220);
      }, 3400);
    }

    function formatDate(iso) {
      return new Date(iso).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }

    function toValidDate(value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) return new Date();
      return date;
    }

    function capitalizeFirst(value) {
      const text = String(value || "");
      if (!text) return "";
      return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function normalizeDoc(value) {
      return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    }

    function escapeHtml(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }
