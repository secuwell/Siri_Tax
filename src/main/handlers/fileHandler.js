const { ipcMain,dialog,app } = require('electron');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const path = require('path');
const { loadToken } = require('../../config/secuerStore');

//파일 선택 핸들러
ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile']
  });
  if (result.canceled || !result.filePaths[0]) return null;
  const filepath = result.filePaths[0];
  const filename = path.basename(filepath); 
  return { filepath, filename };
});
// 파일 업로드 핸들러
ipcMain.handle('upload-file', async (event, filepath) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filepath));
  try {
    const token = await loadToken();

    const res = await axios.post('https://www.siri-erp.co.kr:8083/get/upload', formData, {
      headers:{
        ...formData.getHeaders(),
        'jwtToken' : token
      }
    });
    return res.data || '업로드 결과 없음';
  } catch(e) {
    
  }
});

// 파일 다운로드 핸들러
ipcMain.handle('download-file', async (event, filename) => {
  try {
      const token = await loadToken();

      const response = await axios.get(
      `https://www.siri-erp.co.kr:8083/get/FILE?str_FileName=${encodeURIComponent(filename)}`,
      {
        headers: {
          'Content-Type': 'application/octet-stream',
          'jwtToken': token
        },
        responseType: 'arraybuffer'
      }
    );

    //바탕화면 경로
    const desktopPath = app.getPath('desktop');
    // 2. 바탕화면 경로 + 파일명 만들기
    const filePath = path.join(desktopPath, filename);
    if (!filePath) return { success: false, message: '저장 취소됨' };
    // 3. 파일 저장
    fs.writeFileSync(filePath, Buffer.from(response.data));
    return { success: true, message: `${filename} 파일이 바탕화면에 저장되었습니다.` };  
  } catch (error) {
    return { success: false, message: '다운로드 오류: ' + error.message };
  }
});
