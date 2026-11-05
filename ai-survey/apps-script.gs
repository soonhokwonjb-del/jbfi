/**
 * JBFI 임직원 업무환경·AI 활용 실태 설문 — 응답 저장용 Apps Script
 *
 * 설치
 * 1) 응답을 보관할 Google 스프레드시트에서 [확장 프로그램 > Apps Script]를 엽니다.
 * 2) 기본 코드를 지우고 이 코드를 그대로 붙여 넣은 뒤 저장합니다.
 * 3) [배포 > 새 배포 > 유형: 웹 앱] 실행 사용자: 나, 액세스 권한: 모든 사용자 로 배포합니다.
 * 4) 발급된 웹 앱 URL(…/exec)을 설문 페이지(index.html)의 SCRIPT_URL 에 넣습니다.
 * 코드를 고친 뒤에는 [배포 > 배포 관리 > 수정(연필) > 버전: 새 버전 > 배포]로 다시 배포하면 URL이 유지됩니다.
 *
 * 시트
 * - '응답'     : 응답 1건 = 1행. 열은 아래 KEYS 순서로 고정. 모든 칸은 텍스트로 저장(전화번호·분수 등 자동 변환 방지)
 * - '점검응답' : 점검 모드(?test=1&save=1)로 들어온 응답
 * - 같은 응답 ID(resp_id)가 다시 들어오면 새 행을 만들지 않고 저장 완료로 회신(재시도 중복 방지)
 * - 정해진 열 외의 값은 저장하지 않음. 접수 시각은 남기지 않고 설문 페이지가 보낸 날짜만 저장
 */
var SHEET_RESP = '응답';
var SHEET_TEST = '점검응답';
var KEYS = [
  'resp_id', 'version', 'test', 'submitted_on', 'duration_sec', 'Q1', 'Q1_oth', 'Q2', 'Q2_oth', 'Q3',
  'Q3_oth', 'Q4', 'Q5_a', 'Q5_b', 'Q5_c', 'Q5_d', 'Q5_e', 'Q5_f', 'Q5_g', 'Q5_h', 'Q5_i', 'Q6_1_task',
  'Q6_1_task_oth', 'Q6_1_ai', 'Q6_1_time', 'Q6_1_reason', 'Q6_1_reason_cls', 'Q6_1_reason_oth', 'Q6_2_task',
  'Q6_2_task_oth', 'Q6_2_ai', 'Q6_2_time', 'Q6_2_reason', 'Q6_2_reason_cls', 'Q6_2_reason_oth', 'Q6_3_task',
  'Q6_3_task_oth', 'Q6_3_ai', 'Q6_3_time', 'Q6_3_reason', 'Q6_3_reason_cls', 'Q6_3_reason_oth', 'Q7_M01',
  'Q7_M02', 'Q7_M03', 'Q7_M04', 'Q7_M05', 'Q7_M06', 'Q7_M07', 'Q7_M08', 'Q7_M09', 'Q7_M10', 'Q7_M99',
  'Q7_oth', 'Q8', 'Q9_a', 'Q9_b', 'Q9_c', 'Q9_d', 'Q10_B1', 'Q10_B2', 'Q10_B3', 'Q10_B4', 'Q10_B5', 'Q10_B6',
  'Q10_B99', 'Q10_oth', 'Q11', 'Q12_tool_T1', 'Q12_tool_T2', 'Q12_tool_T3', 'Q12_tool_T4', 'Q12_tool_T5',
  'Q12_tool_T6', 'Q12_tool_T99', 'Q12_tool_oth', 'Q12_pay_C1', 'Q12_pay_C2', 'Q12_pay_C3', 'Q12_pay_C99',
  'Q12_pay_oth', 'Q13_A01', 'Q13_A02', 'Q13_A03', 'Q13_A04', 'Q13_A06', 'Q13_A07', 'Q13_A09', 'Q13_A10',
  'Q13_A11', 'Q13_A13', 'Q13_A99', 'Q13_oth', 'Q14', 'Q15_r1', 'Q15_r2', 'Q15_r3', 'Q15_oth', 'Q16',
  'Q17_K1', 'Q17_K2', 'Q17_K3', 'Q17_K5', 'Q17_K6', 'Q17_K7', 'Q17_K8', 'Q17_K10', 'Q17_K11', 'Q17_K9',
  'Q17_K99', 'Q17_oth', 'Q18_dev', 'Q18_dev_oth', 'Q18_mail', 'Q19'
];

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// 수식 주입 방지 + 길이 제한 (모든 값을 문자열로 저장)
function clean_(v) {
  if (v === null || v === undefined) return '';
  return String(v).replace(/^[=+\-@]/, "'$&").slice(0, 2000);
}

function sheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, KEYS.length).setValues([KEYS]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function exists_(sh, rid) {
  if (sh.getLastRow() < 2) return false;
  return !!sh.getRange(2, 1, sh.getLastRow() - 1, 1).createTextFinder(rid).matchEntireCell(true).findNext();
}

function doPost(e) {
  var d;
  try { d = JSON.parse((e.postData && e.postData.contents) || '{}'); } catch (err) { return out_({ ok: false, err: 'json' }); }
  if (!d || d.type !== 'resp' || !d.row || !/^[0-9a-f]{16}$/.test(String(d.row.resp_id || ''))) return out_({ ok: false, err: 'format' });
  var row = d.row;
  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (err) { return out_({ ok: false, err: 'busy' }); }
  try {
    var sh = sheet_(String(row.test) === '1' ? SHEET_TEST : SHEET_RESP);
    if (exists_(sh, String(row.resp_id))) return out_({ ok: true, dup: true });
    var vals = KEYS.map(function (k) { return clean_(row[k]); });
    var r = sh.getLastRow() + 1;
    sh.getRange(r, 1, 1, KEYS.length).setNumberFormat('@').setValues([vals]);
    return out_({ ok: true });
  } finally { lock.releaseLock(); }
}

// 응답 내용은 외부에 공개하지 않음
function doGet() { return out_({ ok: true }); }
