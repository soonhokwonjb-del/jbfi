/**
 * KBBF 본사 배치안 의견 수집용 Apps Script
 * 1) 새 Google 스프레드시트를 만들고 [확장 프로그램 > Apps Script]를 엽니다.
 * 2) 이 코드를 그대로 붙여 넣고 저장합니다.
 * 3) [배포 > 새 배포 > 유형: 웹 앱] 실행 사용자: 나, 액세스 권한: 모든 사용자 로 배포합니다.
 * 4) 발급된 웹 앱 URL(…/exec)을 index.html 의 SCRIPT_URL 에 넣습니다.
 * 시트의 '처리 결과' 열에 답변을 적으면 배치안 페이지의 의견 아래에 함께 표시됩니다.
 */
const SHEET_NAME = '의견';

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['접수시각', '층', '이름', '부서', '의견', '처리 결과']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(v, n) {
  return String(v == null ? '' : v).replace(/^[=+\-@]/, "'$&").slice(0, n);
}

function doPost(e) {
  let d = {};
  try { d = JSON.parse((e.postData && e.postData.contents) || '{}'); } catch (err) { return out_({ ok: false }); }
  const text = clean_(d.text, 2000).trim();
  if (!text) return out_({ ok: false });
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    sheet_().appendRow([new Date(), clean_(d.floor || '전체', 20), clean_(d.name, 50), clean_(d.dept, 50), text, '']);
  } finally { lock.releaseLock(); }
  return out_({ ok: true });
}

function doGet() {
  const values = sheet_().getDataRange().getValues();
  values.shift();
  const rows = values.filter(r => r[4]).map(r => ({
    ts: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
    floor: String(r[1]), name: String(r[2]), dept: String(r[3]), text: String(r[4]), reply: String(r[5] || '')
  }));
  return out_({ ok: true, rows: rows });
}
