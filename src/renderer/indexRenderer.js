// === 전역 요소 참조 ===
const elements = {
  // 윗단
  userIdSpan: document.getElementById('userIdSpan'),
  logoutbtn: document.getElementById('logoutbtn'),
  userinfobtn: document.getElementById('userinfo'),
  expireDateSpan: document.getElementById('expireDateSpan'),

  // 일반 신고 관련
  WTX_REPORT: document.getElementById('WTX_REPORT'),
  VAT_REPORT: document.getElementById('VAT_REPORT'),
  CORPTAX_REPORT: document.getElementById('CORP_REPORT'),
  INCOMETAX_REPORT: document.getElementById('GLOBAL_REPORT'),
  PAYMENT_STATEMENT: document.getElementById('TaxReturn_REPORT'),
  SIMPLE_PAYMENT: document.getElementById('TaxReturnTmp_REPORT'),

  //재산세 신고 관련
  CGT_REPORT: document.getElementById('CGT_REPORT'),
  GIFT_REPORT: document.getElementById('GIFT_REPORT'),
  STT_REPORT: document.getElementById('STT_REPORT'),

  // 일반 신고 내역 다운로드
  WTX_HISTORY: document.getElementById('WTX_HISTORY'),
  GLOBAL_HISTORY: document.getElementById('GLOBAL_HISTORY'),
  CORP_HISTORY: document.getElementById('CORP_HISTORY'),
  VAT_HISTORY: document.getElementById('VAT_HISTORY'),
  TaxReturn_HISTORY: document.getElementById('TaxReturn_HISTORY'),
  TaxReturnTmp_HISTORY: document.getElementById('TaxReturnTmp_HISTORY'),

  //재산세 신고 내역 다운로드
  CGT_HISTORY: document.getElementById('CGT_HISTORY'),
  GIFT_HISTORY: document.getElementById('GIFT_HISTORY'),
  STT_HISTORY: document.getElementById('STT_HISTORY'),

  // 증명서 발급
  boxButton51: document.getElementById('boxButton51'),
  boxButton52: document.getElementById('boxButton52'),
  boxButton53: document.getElementById('boxButton53'),
  boxButton54: document.getElementById('boxButton54'),
  boxButton55: document.getElementById('boxButton55'),
  boxButton56: document.getElementById('boxButton56'),

  //첨부서류제출
  sendDocu: document.getElementById('sendDocu'),
  uploadArea: document.getElementById('uploadArea'),
  browseBtn: document.getElementById('browseBtn'),
  bgnDate: document.getElementById('bgnDate'),
  endDate: document.getElementById('endDate'),
  itrfCd: document.getElementById('itrfCd'),
  idNumber: document.getElementById('idNumber'),
  submitReportBtn: document.getElementById('submitReportBtn'),
  fileName: document.getElementById('fileName'),

  // 결과 메시지 박스 처리
  resultSpan: document.getElementById('resultSpan'),
};

window.addEventListener('DOMContentLoaded', async () => {
  const userInfo = await window.electronAPI.getUser();
  elements.userIdSpan.textContent += userInfo.id;
  elements.expireDateSpan.textContent = userInfo.expire;

  // === 시작 날짜를 오늘 날짜로 설정 ===
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  elements.bgnDate.value = todayStr;
  elements.endDate.value = todayStr;

  autoSelectTaxType();
});
// === indexUI 유틸 ===
const indexUI = {
  setLoadingCursor: () => document.body.style.cursor = 'wait',  //로딩 중 커서 설정
  setDefaultCursor: () => document.body.style.cursor = 'default', //기본 커서 설정
  disableAllButtons: () => {
    document.querySelectorAll('button, input, select, textarea').forEach(el => el.disabled = true);
  },
  enableAllButtons: () => {
    document.querySelectorAll('button, input, select, textarea').forEach(el => el.disabled = false);
  },
  showLoadingMessage: (message) => {    // 로딩 메시지 표시
    elements.resultSpan.className = 'loading';
    elements.resultSpan.textContent = message;
  },
  resultTimeoutId: null,
  showResult: (message, isSuccess) => {   // 결과 메시지 표시
    const span = elements.resultSpan;
    span.className = isSuccess ? 'success' : 'error';
    span.textContent = typeof message === 'string' ? message : JSON.stringify(message);
    if (indexUI.resultTimeoutId) clearTimeout(indexUI.resultTimeoutId); //이전 타이머 제거
    indexUI.resultTimeoutId = setTimeout(() => {     //indexUI 결과 메시지 표시 후 7초 후에 자동으로 사라지도록 설정
      span.textContent = '';
      span.className = '';
    }, 7000);
  },
};

// 탭 관련 기능
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    button.classList.add('active');
    const target = document.getElementById(button.dataset.tab);
    if (target) target.classList.add('active');

     // 파일명 초기화 (첨부서류제출 탭이 아닐 때만)
    if (button.dataset.tab !== 'documents') {
      documentFileName = '';
      documentFilePath = '';
      if (elements.fileName) elements.fileName.value = '';
      if (elements.fileInput) elements.fileInput.value = '';
      if (elements.idNumber) elements.idNumber.value = '';
    }

    if (elements.uploadArea && elements.sendDocu) {
      uploadArea.style.display = 'none';
      sendDocu.style.display = 'inline-block';
    }

    if (button.dataset.tab === 'documents') {
      elements.resultSpan.style.display = 'none';
    } else {
      elements.resultSpan.style.display = 'inline';  
    }
  });
});
// 회원정보, 로그아웃
elements.userinfobtn.addEventListener('click', async () => window.electronAPI.openUserInfoPopup());
elements.logoutbtn.addEventListener('click', async () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    await window.electronAPI.logout();
  }
});

// === 공통 신고 처리 ===
async function handleReport(reportMethod, loadingText) {
  try { 
    indexUI.showLoadingMessage(loadingText);
    indexUI.setLoadingCursor();
    indexUI.disableAllButtons();
    const fileInfo = await window.electronAPI.selectFile();
    if (!fileInfo) return indexUI.showResult('파일 선택이 취소되었습니다.');

    const { filepath, filename } = fileInfo;
    indexUI.showLoadingMessage(loadingText);
    const upfilename = await window.electronAPI.uploadFile(filepath);
    indexUI.showLoadingMessage(loadingText);
    const userInfo = await window.electronAPI.getUser();
    
    if (upfilename === '성공') {
      const JsonData = { fileName: filename, HT_ID: userInfo.id };
      const filenames = await window.electronAPI[reportMethod](JsonData);

      indexUI.showLoadingMessage(loadingText);
      const fileList = filenames.replace(/[\[\]" ]/g, '').split(',').map(f => f.trim());
      for (const file of fileList) {
        const downloadResult = await window.electronAPI.downloadFile(file);
        if(downloadResult.success === true){
          indexUI.showResult(`${loadingText} 파일이 바탕화면에 저장되었습니다.`, downloadResult.success);
        } else {
          indexUI.showResult(`${loadingText} 파일 다운로드 실패`, downloadResult.success);
        }
      }
    }
  } catch (e) {
    indexUI.showResult(`${loadingText} 중 오류 발생`);
  } finally {
    indexUI.setDefaultCursor();
    indexUI.enableAllButtons();
  }
}

// === 내역 다운로드 버튼 처리 ===
function handleDetail(button, label) {
  button.addEventListener('click', async (event) => {
    try {
      button.disabled = true;
      indexUI.setLoadingCursor();
      indexUI.showLoadingMessage(`${label} 다운로드 중...`);
      const jsonData = await window.electronAPI.openHistoryPopup(event.target.value);
      indexUI.showLoadingMessage(`${label} 다운로드 중...`);
      const result = await window.electronAPI.sendjson(jsonData);
      indexUI.showLoadingMessage(`${label} 다운로드 중...`);
      const downloadResult = await window.electronAPI.downloadFile(result);
      indexUI.showLoadingMessage(`${label} 다운로드 중...`);
      indexUI.showResult(downloadResult.message, downloadResult.success);
    } catch (e) {
      indexUI.showResult(`${label} 다운로드 종료`);
    } finally {
      indexUI.setDefaultCursor();
      button.disabled = false;
    }
  });
}
// === 증명서 발급 관련 ===
function openCert(button, certType, buttonLabel) {
  button.addEventListener('click', async () => {
    try{
      indexUI.disableAllButtons();
      indexUI.showLoadingMessage(`${buttonLabel} 다운로드 중...`);
      await window.electronAPI.openDateSelector(certType);
      indexUI.showLoadingMessage(`${buttonLabel} 다운로드 중...`);
    } catch(error){
      indexUI.showResult(`${buttonLabel} 다운로드 종료`);
    } finally {
      indexUI.setDefaultCursor();
      indexUI.enableAllButtons();
    }
  });
}

//일반 신고
elements.WTX_REPORT.addEventListener('click', () => handleReport('ReportWTX', '원천세 신고'));
elements.VAT_REPORT.addEventListener('click', () => handleReport('ReportVAT', '부가세 신고'));
elements.CORPTAX_REPORT.addEventListener('click', () => handleReport('ReportCORP', '법인세 신고'));
elements.INCOMETAX_REPORT.addEventListener('click', () => handleReport('ReportGLOBAL', '소득세 신고'));
elements.PAYMENT_STATEMENT.addEventListener('click', () => handleReport('ReportTaxReturn', '지급명세서 신고'));
elements.SIMPLE_PAYMENT.addEventListener('click', () => handleReport('ReportTaxReturnTmp', '간이지급명세서 신고'));

//재산세 신고
elements.CGT_REPORT.addEventListener('click', () => handleReport('ReportCGT', '양도세 신고'));
elements.GIFT_REPORT.addEventListener('click', () => handleReport('ReportGIFT', '증여세 신고'));
elements.STT_REPORT.addEventListener('click', () => handleReport('ReportSTT', '증권거래 신고'));

//일반 신고 내역
handleDetail(elements.WTX_HISTORY, '원천세내역');
handleDetail(elements.VAT_HISTORY, '부가세내역');
handleDetail(elements.CORP_HISTORY, '법인세내역');
handleDetail(elements.GLOBAL_HISTORY, '소득세내역');
handleDetail(elements.TaxReturn_HISTORY, '지급명세내역');
handleDetail(elements.TaxReturnTmp_HISTORY, '간이지급내역');

//재산세 신고 내역
handleDetail(elements.CGT_HISTORY, '양도세내역');
handleDetail(elements.GIFT_HISTORY, '증여세내역');
handleDetail(elements.STT_HISTORY, '증권거래내역');

//증명서 발급
openCert(elements.boxButton51, 'tax-payment', '납세증명서');
openCert(elements.boxButton52, 'biz-reg', '사업자등록증명서');
openCert(elements.boxButton53, 'income', '소득금액증명서');
openCert(elements.boxButton54, 'vat-standard', '부가세과세표준증명서');
openCert(elements.boxButton55, 'financial', '표준재무제표');
openCert(elements.boxButton56, 'payment-history', '납부내역증명서');

// === 첨부서류제출 관련 ===
elements.bgnDate.addEventListener('change', autoSelectTaxType);
elements.endDate.addEventListener('change', autoSelectTaxType);

function  autoSelectTaxType() {
  const dateStr = elements.bgnDate.value || elements.endDate.value;
  if (!dateStr) return;

  const month = new Date(dateStr).getMonth() + 1; // 월(1~12)

  let code = '';
  if ([1, 4, 7, 10].includes(month)) {
    code = '41'; // 부가세
  } else if (month === 3) {
    code = '31'; // 법인세
  } else if ([5, 6].includes(month)) {
    code = '10'; // 소득세
  }

  if (code) {
    elements.itrfCd.value = code; // 조건에 해당하면 자동 선택
  } else {
    elements.itrfCd.value = '';   // 아니면 기본값 ("-- 선택하세요 --")
  }
}
const docuUI = {
  showMessage: (msg, isSuccess = true) => {
    const el = document.getElementById('docuResult');
    el.textContent = msg;
    el.className = isSuccess ? 'docu-result-message' : 'docu-result-message error';
    clearTimeout(docuUI.timeout);
    docuUI.timeout = setTimeout(() => {
      el.textContent = '';
      el.className = '';
    }, 6000);
  },
  timeout: null
};
let documentFilePath = '';
let documentFileName = '';
//파일 선택 함수
async function handleFileBrowse() {
  try {
    indexUI.disableAllButtons();
    const fileInfo = await window.electronAPI.selectFile();
    if (!fileInfo) return;

    documentFilePath = fileInfo.filepath;
    documentFileName = fileInfo.filename;
    elements.fileName.value = documentFileName;
  } catch (e) {
    docuUI.showMessage('파일 선택 중 오류 발생', false);
  } finally {
    indexUI.enableAllButtons();
  }
}
//json 생성 함수
function getDocumentJson(userInfo) {
  return {
    HT_ID: userInfo.id,
    itrfCd: elements.itrfCd.value,
    bgnDate: elements.bgnDate.value.replace(/-/g, ''),
    endDate: elements.endDate.value.replace(/-/g, ''),
    idNumber: elements.idNumber.value,
    fileName: documentFileName,
  };
}

async function handleDocumentSubmit() {
  try {
    indexUI.disableAllButtons();
    indexUI.setLoadingCursor();

    if (!elements.itrfCd.value) {
      docuUI.showMessage('세목코드를 선택해주세요.', false);
      return;
    }
    if (!elements.idNumber.value) {
      docuUI.showMessage('주민/사업자번호를 입력해주세요.', false);
      return;
    }
    if (!elements.bgnDate.value) {
      docuUI.showMessage('시작일자를 입력해주세요.', false);
      return;
    }
    if (!elements.endDate.value) {
      docuUI.showMessage('종료일자를 입력해주세요.', false);
      return;
    }
    if (!documentFilePath || !documentFileName) {
      docuUI.showMessage('파일을 선택해주세요.', false);
      return;
    }

    const userInfo = await window.electronAPI.getUser();
    const jsonData = getDocumentJson(userInfo);

    docuUI.showMessage('첨부서류 제출중...');
    const sendDocu = await window.electronAPI.sendDocu(jsonData);
    if(!sendDocu) {
      docuUI.showMessage('첨부서류제출 실패 관리자에게 문의하세요', false);
      return;
    } else {
      docuUI.showMessage('첨부서류 제출 성공', true);
      return;
    }
  } catch (err) {
    docuUI.showMessage('처리 중 오류가 발생했습니다.', false);
  } finally {
    indexUI.setDefaultCursor();
    indexUI.enableAllButtons();
  }
}
elements.browseBtn.addEventListener('click', handleFileBrowse);
elements.submitReportBtn.addEventListener('click', handleDocumentSubmit);
