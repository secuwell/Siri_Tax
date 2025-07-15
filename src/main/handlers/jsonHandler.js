const { ipcMain } = require('electron');
const axios = require('axios'); 
const { loadToken } = require('../../config/secuerStore');

// 내역 json 전송 핸들러
ipcMain.handle('send-json', async (event, jsonString) => {
  try {
    const token = await loadToken();
    const response = await axios.post('https://www.siri-erp.co.kr:8083/get/Hometax_Tax_Excel', jsonString, {
      headers: { 'Content-Type': 'application/json',
                  'jwtToken' : token
       }
    });
    // 서버 응답이 객체면 JSON 문자열로 변환해서 반환
    if (typeof response.data === 'object') {
      return JSON.stringify(response.data);
    }
    return response.data || '전송 성공';
  } catch (error) {
    console.error('JSON 전송 실패:', error);
    return '전송 오류: ' + error.message;
  }
});
// 원천세 신고 json 전송 핸들러
ipcMain.handle('send-json-WTX', async (event, jsonString) => {
  try {
    const token = await loadToken();
    const response = await axios.post('https://www.siri-erp.co.kr:8083/get/Hometax_TaxReturn_PAY', jsonString, {
      headers: { 'Content-Type': 'application/json',
                  'jwtToken': token
       }
    });
    // 서버 응답이 객체면 JSON 문자열로 변환해서 반환
    if (typeof response.data === 'object') {
      return JSON.stringify(response.data);
    }
    return response.data || '전송 성공';
  } catch (error) {
    console.error('JSON 전송 실패:', error.message);
    return '전송 오류: ' + error.message;
  }
});
// 부가세 신고 json 전송 핸들러
ipcMain.handle('send-json-VAT', async (event, jsonString) => {
  try {
    const token = await loadToken();

    const response = await axios.post('https://www.siri-erp.co.kr:8083/get/Hometax_TaxReturn_PAY', jsonString, {
      headers: { 'Content-Type': 'application/json',
        'jwtToken': token 
       }
    });
    // 서버 응답이 객체면 JSON 문자열로 변환해서 반환
    if (typeof response.data === 'object') {
      return JSON.stringify(response.data);
    }
    return response.data || '전송 성공';
  } catch (error) {
    console.error('JSON 전송 실패:', error.message);
    return '전송 오류: ' + error.message;
  }
});
// 법인세 신고 json 전송 핸들러
ipcMain.handle('send-json-CORP', async (event, jsonString) => {
  try {
    const token = await loadToken();
    const response = await axios.post('https://www.siri-erp.co.kr:8083/get/Hometax_TaxReturn_PAY', jsonString, {
      headers: { 'Content-Type': 'application/json',
        'jwtToken': token
       }
    });
    // 서버 응답이 객체면 JSON 문자열로 변환해서 반환
    if (typeof response.data === 'object') {
      return JSON.stringify(response.data);
    }
    return response.data || '전송 성공';
  } catch (error) {
    console.error('JSON 전송 실패:', error.message);
    return '전송 오류: ' + error.message;
  }
});
// 소득세 신고 json 전송 핸들러
ipcMain.handle('send-json-GLOBAL', async (event, jsonString) => {
  try {
    const token = await loadToken();

    const response = await axios.post('https://www.siri-erp.co.kr:8083/get/Hometax_TaxReturn_PAY', jsonString, {
      headers: { 'Content-Type': 'application/json',
                'jwtToken' : token
       }
    });
    // 서버 응답이 객체면 JSON 문자열로 변환해서 반환
    if (typeof response.data === 'object') {
      return JSON.stringify(response.data);
    }
    return response.data || '전송 성공';
  } catch (error) {     
    console.error('JSON 전송 실패:', error.message);
    return '전송 오류: ' + error.message;
  }
});
// 지급명세서 신고 json 전송 핸들러
ipcMain.handle('send-json-TaxReturn', async (event, jsonString) => {
  try {
    const token = await loadToken();

    const response = await axios.post('https://www.siri-erp.co.kr:8083/get/Hometax_TaxReturn_PAY', jsonString, {
      headers: { 'Content-Type': 'application/json',
                  'jwtToken' : token
       }
    });
    // 서버 응답이 객체면 JSON 문자열로 변환해서 반환
    if (typeof response.data === 'object') {
      return JSON.stringify(response.data);
    }
    return response.data || '전송 성공';
  } catch (error) {
    console.error('JSON 전송 실패:', error.message);
    return '전송 오류: ' + error.message;
  }
});
// 간이지급명세서 신고 json 전송 핸들러
ipcMain.handle('send-json-TaxReturnTmp', async (event, jsonString) => {
  try {
    const token = await loadToken();

    const response = await axios.post('https://www.siri-erp.co.kr:8083/get/Hometax_TaxReturn_PAY', jsonString, {
      headers: { 'Content-Type': 'application/json',
                  'jwtToken' : token
       }
    });
    // 서버 응답이 객체면 JSON 문자열로 변환해서 반환
    if (typeof response.data === 'object') {
      return JSON.stringify(response.data);
    }
    return response.data || '전송 성공';
  } catch (error) {
    console.error('JSON 전송 실패:', error.message);
    return '전송 오류: ' + error.message;
  }
});
ipcMain.handle('send-json-CGT', async (event, jsonString) => {
  try {
    const token = await loadToken();
    const response = await axios.post('https://www.siri-erp.co.kr:8083/get/Hometax_TaxReturn_CGT', jsonString, {
      headers: { 'Content-Type': 'application/json',
                  'jwtToken' : token
       }
    });
    if (typeof response.data === 'object') {
      return JSON.stringify(response.data);
    } 
    return response.data || '전송 성공';
    } catch(error) {
      console.error('JSON 전송 실패:', error);
      return '전송 오류: ' + error.message;
    }
});
ipcMain.handle('send-json-GIFT', async (event, jsonString) => {
  try {
    const token = await loadToken();

    const response = await axios.post('https://www.siri-erp.co.kr:8083/get/Hometax_TaxReturn_GIFT', jsonString, {
      headers: { 'Content-Type': 'application/json',
                  'jwtToken' : token
       }
    });
    if (typeof response.data === 'object') {
      return JSON.stringify(response.data);
    } 
    return response.data || '전송 성공';
    } catch(error) {
      console.error('JSON 전송 실패:', error);
      return '전송 오류: ' + error.message;
    }
});
ipcMain.handle('send-json-STT', async (event, jsonString) => {
  try {
    const token = await loadToken();

    const response = await axios.post('https://www.siri-erp.co.kr:8083/get/Hometax_TaxReturn_STT', jsonString, {
      headers: { 'Content-Type': 'application/json',
                  'jwtToken' : token
       }
    });
    if (typeof response.data === 'object') {
      return JSON.stringify(response.data);
    } 
    return response.data || '전송 성공';
    } catch(error) {
      console.error('JSON 전송 실패:', error);
      return '전송 오류: ' + error.message;
    }
});

// 증명서 발급 json 데이터 전송 핸들러
ipcMain.handle('submit-certificate', async (event, jsonData) => {
  try {
    const token = await loadToken();

    const response = await axios.post('https://www.siri-erp.co.kr:8083/get/Hometax_Minwon', jsonData, {
      headers: { 'Content-Type': 'application/json', 
                  'jwtToken' : token
       }
    });
    
    if (typeof response.data === 'object') {
      return JSON.stringify(response.data);
    }
    return response.data || '전송 성공';
  } catch (error) {
    console.error('JSON 전송 실패:', error.message);
    return '전송 오류: ' + error.message;
  }
});

//첨부서류 제출
ipcMain.handle('send-docu', async (event, jsonData)=>{
  try {
    const token = await loadToken();
    const response = await axios.post('https://www.siri-erp.co.kr:8083/get/Hometax_UploadReport', jsonData, {
      headers: {'content-Type': 'application/json',
                'jwtToken' : token
       }
    });
    return true; 
  } catch (error) {
    return false;
  }
});