function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    
    window.addEventListener('DOMContentLoaded', () => {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      document.getElementById("start").value = formatDate(firstDayOfMonth);
      document.getElementById("end").value = formatDate(now);
    });
/*
    window.addEventListener('DOMContentLoaded', () => {
      // 2025년 5월 1일 ~ 2025년 5월 10일로 기본값 설정
      const startDate = new Date(2025, 4, 1);  // 월은 0부터 시작(4=5월)
      const endDate = new Date(2025, 4, 10);

      document.getElementById("start").value = formatDate(startDate);
      document.getElementById("end").value = formatDate(endDate);
    });
*/
    const urlParams = new URLSearchParams(window.location.search);
    const buttonValue = urlParams.get('buttonValue');
    const reportTypeMap = {
      '10': '종합소득세',
      '14': '원천세',
      '22': '양도세',
      '31': '법인세',
      '33': '증여세',
      '41': '부가세',
      '43': '주세',
      '간이': '간이명세서',
      '지급': '지급명세서',
      '45': '증권거래',
      '46': '인지세',
      '47': '개별소비세',
      '57': '종합부동산세',
      '59': '교통|에너지|환경세',
      '65': '교육세(금융)',
      '66': '교육세(보험)'
    };
    const label = reportTypeMap[buttonValue];
    document.title = label + " 내역 날짜 선택";

    document.getElementById("submit").addEventListener("click", async() => {
      const start = document.getElementById("start").value.replace(/-/g, '');
      const end = document.getElementById("end").value.replace(/-/g, '');

      // 필수값 유효성 검사
      if (!start || !end /* || !type */) {
        alert("모든 값을 입력해주세요.");
      }
      //로그인 구현 시 ID 값을 로그인에서 가져온 ID 값으로 지정
      const userInfo = await window.electronAPI.getUser();     
      let jsonData = {
        HT_ID: userInfo.id,
        bgnDate: start,
        endDate: end,
        itrfCd: buttonValue,
      };
      let jsonString = JSON.stringify(jsonData);
      window.electronAPI.sendFormData(jsonString); // 메인 프로세스로 데이터 전송
      window.close(); // 팝업 창 닫기
    });