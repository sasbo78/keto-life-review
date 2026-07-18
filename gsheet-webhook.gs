const SHEET_ID = '1z5vBFtVyqNRffKlWqViLudMcbrQ7_UPQW56wF2dLWlQ'

function getSheet() {
  return SpreadsheetApp.openById(SHEET_ID).getActiveSheet()
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const sheet = getSheet()
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Email', 'Source', 'Date', 'Status'])
    }
    const emails = sheet.getRange(2, 1, sheet.getLastRow(), 1).getValues().flat()
    if (emails.includes(data.email)) {
      return ContentService.createTextOutput(JSON.stringify({ message: 'Already subscribed' }))
        .setMimeType(ContentService.MimeType.JSON)
    }
    sheet.appendRow([data.email, data.source || 'unknown', data.date || new Date().toISOString(), 'active'])
    return ContentService.createTextOutput(JSON.stringify({ message: 'Subscribed successfully' }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ status: 'alive' }))
      .setMimeType(ContentService.MimeType.JSON)
}
