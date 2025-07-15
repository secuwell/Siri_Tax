const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  //User정보
  getToken: () => ipcRenderer.invoke('get-token'),
  getUser: () => ipcRenderer.invoke('get-user'),
  logout: () => ipcRenderer.invoke('logout'),   //로그아웃
  openUserInfoPopup: () => ipcRenderer.invoke('open-user-info-popup'),  //회원정보 팝업 열기

  //내역
  selectFile: () => ipcRenderer.invoke('select-file'),  //파일 선택
  openHistoryPopup: (value) => ipcRenderer.invoke('open-history-popup', value),  //date 팝업 열기
  uploadFile: (filepath) => ipcRenderer.invoke('upload-file', filepath),  //파일 업로드
  downloadFile: (filename) => ipcRenderer.invoke('download-file', filename),  //파일 다운로드 
  sendjson: (jsonData) => ipcRenderer.invoke('send-json', jsonData),  // 내역 다운로드
  
  // 증명서 발급
  openNewLayout: () => ipcRenderer.invoke('open-new-layout'),  // 증명서 발급 새로운 레이아웃 열기
  openDateSelector: (certType) => ipcRenderer.invoke('open-date-selector', certType),  // 증명서 발급 date 팝업 열기
  submitCertificate: (jsonData) => ipcRenderer.invoke('submit-certificate', jsonData),  // 증명서 발급 json 데이터 전송 처리
  
  //일반 신고
  ReportWTX: (jsonString) => ipcRenderer.invoke('send-json-WTX', jsonString),  // 원천세 신고 Json 데이터 전송 처리
  ReportVAT: (jsonString) => ipcRenderer.invoke('send-json-VAT', jsonString),  // 부가세 신고 Json 데이터 전송 처리
  ReportCORP: (jsonString) => ipcRenderer.invoke('send-json-CORP', jsonString),  // 법인세 신고 Json 데이터 전송 처리
  ReportGLOBAL: (jsonString) => ipcRenderer.invoke('send-json-GLOBAL', jsonString),  // 소득세 신고 Json 데이터 전송 처리
  ReportTaxReturn: (jsonString) => ipcRenderer.invoke('send-json-TaxReturn', jsonString),  // 지급명세서 신고 Json 데이터 전송 처리
  ReportTaxReturnTmp: (jsonString) => ipcRenderer.invoke('send-json-TaxReturnTmp', jsonString),  // 간이지급명세서 신고 Json 데이터 전송 처리

  //재산세 신고
  ReportCGT: (jsonString) => ipcRenderer.invoke('send-json-CGT', jsonString),  // 양도세 신고 Json 데이터 전송 처리
  ReportGIFT: (jsonString) => ipcRenderer.invoke('send-json-GIFT', jsonString),  // 증여세 신고 Json 데이터 전송 처리
  ReportSTT: (jsonString) => ipcRenderer.invoke('send-json-STT', jsonString),  // 증권거래 신고 Json 데이터 전송 처리

  //첨부서류제출
  sendDocu: (jsonData) => ipcRenderer.invoke('send-docu', jsonData), //첨부서류제출

  sendFormData: (jsonString) => ipcRenderer.send('form-submitted', jsonString),   // 팝업에서 JSON 데이터 전송 처리
  showResult: (message, isSuccess) => ipcRenderer.send('show-result', { message, isSuccess }),  // 결과를 Main으로 전달
});
 