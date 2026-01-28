/**
 * Google Apps Script for Portal MZS
 * Versão: 2.0 (Suporte para CRUD completo)
 */

function doGet(e) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const data = {
        announcements: getSheetData(ss.getSheetByName("announcements")),
        resources: getSheetData(ss.getSheetByName("resources")),
        documents: getSheetData(ss.getSheetByName("documents"))
    };

    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
    const request = JSON.parse(e.postData.contents);
    const action = request.action;
    const data = request.data;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    let result = { result: 'error', message: 'Ação não encontrada' };

    try {
        if (action === 'createAnnouncement') result = createRow(ss.getSheetByName("announcements"), data);
        if (action === 'updateAnnouncement') result = updateRow(ss.getSheetByName("announcements"), data);
        if (action === 'deleteAnnouncement') result = deleteRow(ss.getSheetByName("announcements"), data.id);

        if (action === 'createResource') result = createRow(ss.getSheetByName("resources"), data);
        if (action === 'updateResource') result = updateRow(ss.getSheetByName("resources"), data);
        if (action === 'deleteResource') result = deleteRow(ss.getSheetByName("resources"), data.id);

        if (action === 'createDocument') result = createRow(ss.getSheetByName("documents"), data);
        if (action === 'updateDocument') result = updateRow(ss.getSheetByName("documents"), data);
        if (action === 'deleteDocument') result = deleteRow(ss.getSheetByName("documents"), data.id);

    } catch (err) {
        result = { result: 'error', message: err.toString() };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
}

function getSheetData(sheet) {
    if (!sheet) return [];
    const rows = sheet.getDataRange().getValues();
    const headers = rows.shift();
    return rows.map(row => {
        let obj = {};
        headers.forEach((h, i) => {
            let val = row[i];
            // Especial handling for tags (comma separated string -> array)
            if (h === 'tags' && typeof val === 'string') {
                val = val.split(',').map(t => t.trim()).filter(Boolean);
            }
            obj[h] = val;
        });
        return obj;
    });
}

function createRow(sheet, data) {
    if (!sheet) return { result: 'error', message: 'Sheet não encontrada' };
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const newRow = headers.map(h => {
        let val = data[h];
        if (h === 'tags' && Array.isArray(val)) val = val.join(', ');
        return val === undefined ? '' : val;
    });
    sheet.appendRow(newRow);
    return { result: 'success' };
}

function updateRow(sheet, data) {
    if (!sheet) return { result: 'error', message: 'Sheet não encontrada' };
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const idIndex = headers.indexOf('id');

    for (let i = 1; i < values.length; i++) {
        if (String(values[i][idIndex]) === String(data.id)) {
            const rowRange = sheet.getRange(i + 1, 1, 1, headers.length);
            const updatedValues = headers.map(h => {
                let val = data[h];
                if (h === 'tags' && Array.isArray(val)) val = val.join(', ');
                return val === undefined ? values[i][headers.indexOf(h)] : val;
            });
            rowRange.setValues([updatedValues]);
            return { result: 'success' };
        }
    }
    return { result: 'error', message: 'ID não encontrado' };
}

function deleteRow(sheet, id) {
    if (!sheet) return { result: 'error', message: 'Sheet não encontrada' };
    const values = sheet.getDataRange().getValues();
    const idIndex = values[0].indexOf('id');

    for (let i = 1; i < values.length; i++) {
        if (String(values[i][idIndex]) === String(id)) {
            sheet.deleteRow(i + 1);
            return { result: 'success' };
        }
    }
    return { result: 'error', message: 'ID não encontrado' };
}
