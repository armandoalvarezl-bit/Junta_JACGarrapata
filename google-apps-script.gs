const SPREADSHEET_ID = "PEGA_AQUI_ID_DE_TU_GOOGLE_SHEET";
const SHEET_NAME = "Certificados";
const RESIDENTS_SHEET_NAME = "Residentes";
const TIMEZONE = "America/Bogota";
const DEFAULT_SIGNER_NAME = "Jorge Pelferto Hernandez";
const DEFAULT_SIGNER_ROLE = "Presidente Junta";

const HEADERS = [
  "fechaISO",
  "consecutivo",
  "codigo",
  "nombre",
  "tipoDoc",
  "documento",
  "anios",
  "direccion",
  "nivelEducativo",
  "grupoPoblacional",
  "email",
  "motivo",
  "firmante",
  "cargoFirmante",
  "observaciones",
  "estado"
];

function doGet(e) {
  return handleRequest_(e);
}

function doPost(e) {
  return handleRequest_(e);
}

function handleRequest_(e) {
  try {
    const action = String((e && e.parameter && e.parameter.action) || "").toLowerCase();

    if (!action || action === "health") {
      return jsonResponse_({
        ok: true,
        message: "API de certificados activa"
      });
    }

    if (action === "list") {
      const limit = sanitizeLimit_((e.parameter && e.parameter.limit) || "30");
      return jsonResponse_({
        ok: true,
        data: listCertificates_(limit)
      });
    }

    if (action === "find") {
      const code = normalizeCode_((e.parameter && e.parameter.codigo) || "");
      const documento = normalizeDoc_((e.parameter && e.parameter.documento) || "");
      const found = findCertificate_(code, documento);
      return jsonResponse_({
        ok: true,
        data: found
      });
    }

    if (action === "find_person") {
      const documento = normalizeText_((e.parameter && e.parameter.documento) || "");
      const found = findPersonByDocument_(documento);
      return jsonResponse_({
        ok: true,
        data: found
      });
    }

    if (action === "residents_list") {
      const limit = sanitizeLimit_((e.parameter && e.parameter.limit) || "100");
      const query = normalizeText_((e.parameter && e.parameter.q) || "");
      return jsonResponse_({
        ok: true,
        data: listResidents_(limit, query)
      });
    }

    if (action === "create") {
      const payload = readPayload_(e);
      const created = createCertificate_(payload);
      return jsonResponse_({
        ok: true,
        data: created
      });
    }

    return jsonResponse_({
      ok: false,
      error: "Accion no soportada: " + action
    });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: String((error && error.message) || error || "Error interno")
    });
  }
}

function listCertificates_(limit) {
  const rows = readRows_();
  const data = rows.map(rowToCertificate_).reverse();
  return data.slice(0, limit);
}

function findCertificate_(code, documento) {
  if (!code && !documento) {
    throw new Error("Debes enviar codigo o documento.");
  }

  const rows = readRows_();
  for (let i = rows.length - 1; i >= 0; i -= 1) {
    const cert = rowToCertificate_(rows[i]);
    const byCode = code ? normalizeCode_(cert.codigo) === code : false;
    const byDoc = documento ? normalizeDoc_(cert.documento) === normalizeDoc_(documento) : false;
    if (byCode || byDoc) {
      return cert;
    }
  }
  return null;
}

function findPersonByDocument_(documento) {
  if (!documento) {
    throw new Error("Debes enviar documento.");
  }

  const normalizedDoc = normalizeDoc_(documento);
  const resident = findInResidentsSheet_(normalizedDoc);
  return resident || null;
}

function findInResidentsSheet_(normalizedDoc) {
  const spreadsheet = openSpreadsheet_();
  const sheet = getResidentsSheet_(spreadsheet);
  if (!sheet) {
    return null;
  }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) {
    return null;
  }

  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
    return normalizeHeader_(h);
  });
  const values = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  const iDoc = findHeaderIndex_(headers, [
    "documento",
    "numerodocumento",
    "cedula",
    "identificacion",
    "id"
  ]);
  if (iDoc === -1) {
    return null;
  }

  const iNombre = findHeaderIndex_(headers, [
    "nombre",
    "nombrecompleto",
    "nombresyapellidos",
    "nombres",
    "residente"
  ]);
  const iTipoDoc = findHeaderIndex_(headers, ["tipodoc", "tipodocumento", "tipo"]);
  const iAnios = findHeaderIndex_(headers, [
    "anios",
    "anos",
    "tiemporesidencia",
    "aniosresidencia",
    "residenciaanios"
  ]);
  const iDireccion = findHeaderIndex_(headers, ["direccion", "sector", "barrio", "vereda"]);
  const iNivelEducativo = findHeaderIndex_(headers, [
    "nivelacademico",
    "niveleducativo",
    "escolaridad",
    "niveldeescolaridad"
  ]);
  const iGrupoPoblacional = findHeaderIndex_(headers, [
    "grupopoblacional",
    "grupopoblacion"
  ]);
  const iEmail = findHeaderIndex_(headers, [
    "email",
    "correo",
    "correoelectronico",
    "e-mail"
  ]);
  const iMotivo = findHeaderIndex_(headers, ["motivo"]);
  const iFirmante = findHeaderIndex_(headers, ["firmante"]);
  const iCargo = findHeaderIndex_(headers, ["cargofirmante", "cargo"]);
  const iObs = findHeaderIndex_(headers, ["observaciones", "observacion"]);

  for (let i = values.length - 1; i >= 0; i -= 1) {
    const row = values[i];
    if (normalizeDoc_(row[iDoc]) !== normalizedDoc) {
      continue;
    }

    const foundNombre = valueByIndex_(row, iNombre);
    const foundAnios = valueByIndex_(row, iAnios);
    return {
      documento: valueByIndex_(row, iDoc),
      nombre: foundNombre,
      tipoDoc: valueByIndex_(row, iTipoDoc) || "CC",
      // If residents sheet has no years-of-residence field, use "0" to keep issuance flow working.
      anios: foundAnios || "0",
      direccion: valueByIndex_(row, iDireccion),
      nivelEducativo: valueByIndex_(row, iNivelEducativo),
      grupoPoblacional: valueByIndex_(row, iGrupoPoblacional),
      email: valueByIndex_(row, iEmail),
      motivo: valueByIndex_(row, iMotivo),
      firmante: valueByIndex_(row, iFirmante),
      cargoFirmante: valueByIndex_(row, iCargo),
      observaciones: valueByIndex_(row, iObs),
      source: sheet.getName()
    };
  }
  return null;
}

function listResidents_(limit, query) {
  const spreadsheet = openSpreadsheet_();
  const sheet = getResidentsSheet_(spreadsheet);
  if (!sheet) {
    return [];
  }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) {
    return [];
  }

  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
    return normalizeHeader_(h);
  });
  const values = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  const iDoc = findHeaderIndex_(headers, [
    "documento",
    "numerodocumento",
    "cedula",
    "identificacion",
    "id"
  ]);
  const iNombre = findHeaderIndex_(headers, [
    "nombre",
    "nombrecompleto",
    "nombresyapellidos",
    "nombres",
    "residente"
  ]);

  if (iDoc === -1 && iNombre === -1) {
    return [];
  }

  const iTipoDoc = findHeaderIndex_(headers, ["tipodoc", "tipodocumento", "tipo"]);
  const iAnios = findHeaderIndex_(headers, [
    "anios",
    "anos",
    "tiemporesidencia",
    "aniosresidencia",
    "residenciaanios"
  ]);
  const iDireccion = findHeaderIndex_(headers, ["direccion", "sector", "barrio", "vereda"]);
  const iNivelEducativo = findHeaderIndex_(headers, [
    "nivelacademico",
    "niveleducativo",
    "escolaridad",
    "niveldeescolaridad"
  ]);
  const iGrupoPoblacional = findHeaderIndex_(headers, [
    "grupopoblacional",
    "grupopoblacion"
  ]);
  const iEmail = findHeaderIndex_(headers, [
    "email",
    "correo",
    "correoelectronico",
    "e-mail"
  ]);

  const normalizedQuery = normalizeHeader_(query || "");
  const data = [];

  for (let i = values.length - 1; i >= 0; i -= 1) {
    const row = values[i];
    const item = {
      documento: valueByIndex_(row, iDoc),
      nombre: valueByIndex_(row, iNombre),
      tipoDoc: valueByIndex_(row, iTipoDoc) || "CC",
      anios: valueByIndex_(row, iAnios),
      direccion: valueByIndex_(row, iDireccion),
      nivelEducativo: valueByIndex_(row, iNivelEducativo),
      grupoPoblacional: valueByIndex_(row, iGrupoPoblacional),
      email: valueByIndex_(row, iEmail),
      source: sheet.getName()
    };

    if (!item.documento && !item.nombre) {
      continue;
    }

    if (normalizedQuery) {
      const haystack = normalizeHeader_(
        item.nombre + " " +
        item.documento + " " +
        item.direccion + " " +
        item.nivelEducativo + " " +
        item.grupoPoblacional + " " +
        item.email
      );
      if (haystack.indexOf(normalizedQuery) === -1) {
        continue;
      }
    }

    data.push(item);
    if (data.length >= limit) {
      break;
    }
  }

  return data;
}

function getResidentsSheet_(spreadsheet) {
  const byExactName = spreadsheet.getSheetByName(RESIDENTS_SHEET_NAME);
  if (byExactName) {
    return byExactName;
  }

  const normalizedResidentsName = normalizeHeader_(RESIDENTS_SHEET_NAME);
  const normalizedCertificatesName = normalizeHeader_(SHEET_NAME);
  const sheets = spreadsheet.getSheets();

  for (let i = 0; i < sheets.length; i += 1) {
    const sheet = sheets[i];
    if (normalizeHeader_(sheet.getName()) === normalizedResidentsName) {
      return sheet;
    }
  }

  // Fallback: locate a sheet that looks like a residents base by its headers.
  for (let i = 0; i < sheets.length; i += 1) {
    const sheet = sheets[i];
    const normalizedSheetName = normalizeHeader_(sheet.getName());
    if (normalizedSheetName === normalizedCertificatesName) {
      continue;
    }

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow < 1 || lastCol < 1) {
      continue;
    }

    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
      return normalizeHeader_(h);
    });

    const iDoc = findHeaderIndex_(headers, [
      "documento",
      "numerodocumento",
      "cedula",
      "identificacion",
      "id"
    ]);
    const iNombre = findHeaderIndex_(headers, [
      "nombre",
      "nombrecompleto",
      "nombresyapellidos",
      "nombres",
      "residente"
    ]);

    if (iDoc !== -1 && iNombre !== -1) {
      return sheet;
    }
  }

  return null;
}

function createCertificate_(payload) {
  const clean = sanitizePayload_(payload);
  validatePayload_(clean);

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const sheet = getSheet_();
    const rows = readRows_(sheet);

    const cert = {
      fechaISO: new Date().toISOString(),
      consecutivo: buildNextConsecutive_(rows),
      codigo: buildUniqueCode_(rows),
      nombre: clean.nombre,
      tipoDoc: clean.tipoDoc || "CC",
      documento: clean.documento,
      anios: clean.anios,
      direccion: clean.direccion,
      nivelEducativo: clean.nivelEducativo,
      grupoPoblacional: clean.grupoPoblacional,
      email: clean.email,
      motivo: clean.motivo,
      firmante: DEFAULT_SIGNER_NAME,
      cargoFirmante: DEFAULT_SIGNER_ROLE,
      observaciones: clean.observaciones || "",
      estado: "ACTIVO"
    };

    sheet.appendRow([
      cert.fechaISO,
      cert.consecutivo,
      cert.codigo,
      cert.nombre,
      cert.tipoDoc,
      cert.documento,
      cert.anios,
      cert.direccion,
      cert.nivelEducativo,
      cert.grupoPoblacional,
      cert.email,
      cert.motivo,
      cert.firmante,
      cert.cargoFirmante,
      cert.observaciones,
      cert.estado
    ]);

    return cert;
  } finally {
    lock.releaseLock();
  }
}

function readPayload_(e) {
  const payloadFromParam = (e.parameter && e.parameter.payload) || "";
  if (payloadFromParam) {
    return JSON.parse(payloadFromParam);
  }

  const rawBody = e.postData && e.postData.contents ? e.postData.contents : "";
  if (!rawBody) {
    throw new Error("No se recibio payload.");
  }

  try {
    return JSON.parse(rawBody);
  } catch (_error) {
    throw new Error("Payload invalido.");
  }
}

function sanitizePayload_(payload) {
  return {
    nombre: normalizeText_(payload.nombre),
    tipoDoc: normalizeText_(payload.tipoDoc),
    documento: normalizeText_(payload.documento),
    anios: normalizeText_(payload.anios),
    direccion: normalizeText_(payload.direccion),
    nivelEducativo: normalizeText_(payload.nivelEducativo),
    grupoPoblacional: normalizeText_(payload.grupoPoblacional),
    email: normalizeText_(payload.email),
    motivo: normalizeText_(payload.motivo),
    firmante: normalizeText_(payload.firmante),
    cargoFirmante: normalizeText_(payload.cargoFirmante),
    observaciones: normalizeText_(payload.observaciones)
  };
}

function validatePayload_(payload) {
  if (!payload.nombre || !payload.documento || !payload.anios || !payload.direccion || !payload.motivo) {
    throw new Error("Faltan campos obligatorios.");
  }
}

function buildNextConsecutive_(rows) {
  const year = Utilities.formatDate(new Date(), TIMEZONE, "yyyy");
  const regex = new RegExp("^GAR-" + year + "-(\\d+)$");
  let max = 0;

  rows.forEach(function (row) {
    const match = String(row[1] || "").match(regex);
    if (match) {
      const number = Number(match[1]);
      if (number > max) {
        max = number;
      }
    }
  });

  return "GAR-" + year + "-" + String(max + 1).padStart(4, "0");
}

function buildUniqueCode_(rows) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const existing = {};
  rows.forEach(function (row) {
    existing[normalizeCode_(row[2])] = true;
  });

  for (let i = 0; i < 500; i += 1) {
    let code = "GAR-";
    for (let j = 0; j < 6; j += 1) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (!existing[code]) {
      return code;
    }
  }
  throw new Error("No fue posible generar un codigo unico.");
}

function readRows_(sheet) {
  const target = sheet || getSheet_();
  const lastRow = target.getLastRow();
  if (lastRow < 2) {
    return [];
  }
  return target.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
}

function rowToCertificate_(row) {
  return {
    fechaISO: String(row[0] || ""),
    consecutivo: String(row[1] || ""),
    codigo: String(row[2] || ""),
    nombre: String(row[3] || ""),
    tipoDoc: String(row[4] || ""),
    documento: String(row[5] || ""),
    anios: String(row[6] || ""),
    direccion: String(row[7] || ""),
    nivelEducativo: String(row[8] || ""),
    grupoPoblacional: String(row[9] || ""),
    email: String(row[10] || ""),
    motivo: String(row[11] || ""),
    firmante: String(row[12] || ""),
    cargoFirmante: String(row[13] || ""),
    observaciones: String(row[14] || ""),
    estado: String(row[15] || "")
  };
}

function getSheet_() {
  const spreadsheet = openSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  } else {
    const currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    const hasHeaders = HEADERS.every(function (name, index) {
      return String(currentHeaders[index] || "") === name;
    });
    if (!hasHeaders) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

function openSpreadsheet_() {
  if (SPREADSHEET_ID && SPREADSHEET_ID !== "PEGA_AQUI_ID_DE_TU_GOOGLE_SHEET") {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) {
    throw new Error("No hay spreadsheet activo. Configura SPREADSHEET_ID.");
  }
  return active;
}

function sanitizeLimit_(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 30;
  return Math.max(1, Math.min(200, Math.floor(parsed)));
}

function normalizeText_(value) {
  return String(value || "").trim();
}

function normalizeHeader_(value) {
  return normalizeText_(value)
    .toLowerCase()
    .replace(/\s+/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeDoc_(value) {
  return normalizeText_(value).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function valueByIndex_(row, index) {
  if (index < 0) return "";
  return normalizeText_(row[index]);
}

function findHeaderIndex_(headers, candidates) {
  for (var i = 0; i < candidates.length; i += 1) {
    var idx = headers.indexOf(candidates[i]);
    if (idx !== -1) return idx;
  }
  return -1;
}

function normalizeCode_(value) {
  return normalizeText_(value).toUpperCase();
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
