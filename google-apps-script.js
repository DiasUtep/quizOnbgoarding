// ============================================
// Google Apps Script для записи результатов рулетки
// ============================================
// Инструкция:
// 1. Открой Google Sheets таблицу
// 2. Расширения → Apps Script
// 3. Вставь этот код и нажми "Сохранить"
// 4. Нажми "Развернуть" → "Новое развертывание"
// 5. Тип: "Веб-приложение"
// 6. Выполнение от: "Я"
// 7. Доступ: "Все"
// 8. Нажми "Развернуть" и скопируй URL
// 9. Установи URL в переменную окружения ROULETTE_SHEET_WEBHOOK на бэкенде
// ============================================

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Если лист пустой — добавляем заголовки
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Телефон",
        "Приз ID",
        "Приз",
        "Дата розыгрыша",
      ]);
      // Форматируем заголовки жирным
      sheet.getRange(1, 1, 1, 4).setFontWeight("bold");
    }

    // Конвертируем UTC в Алматы (UTC+5)
    var spunAt = new Date(data.spunAt);
    var almatyTime = new Date(spunAt.getTime() + 5 * 60 * 60 * 1000);
    var dateStr = Utilities.formatDate(
      almatyTime,
      "GMT",
      "yyyy-MM-dd HH:mm:ss"
    );

    sheet.appendRow([
      data.phoneNumber,
      data.prizeId,
      data.prizeName,
      dateStr,
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "ok" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// GET для проверки работоспособности
function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok", message: "Roulette webhook is active" })
  ).setMimeType(ContentService.MimeType.JSON);
}
