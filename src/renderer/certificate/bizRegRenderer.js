const elements= {
  bizNum: document.getElementById('bizNum'),
  bizSubmitBtn: document.getElementById('bizSubmitBtn'),
}

window.addEventListener('DOMContentLoaded', async () => {
    const now = new Date();
    document.getElementById("bizDate").value = now.toISOString().split('T')[0];
  });

  let isSubmitting = false;  // 중복 클릭 방지용 플래그

  async function submitForm() {
    if (isSubmitting) return;  // 이미 처리 중이면 무시
    isSubmitting = true;
    const bizNum = document.getElementById('bizNum').value.trim();
    let  bizDate = document.getElementById('bizDate').value;
    const usage = document.getElementById('usage').value.trim();
    const email = document.getElementById('email').value.trim();
    const userInfo = await window.electronAPI.getUser();

    // === 유효성 검사 시작 ===
    if (!bizNum || !bizDate || !usage) {
      alert("사업자등록번호, 기준일자, 사용 용도는 필수 입력 항목입니다.");
      isSubmitting = false;
      return;
    }

    if (!/^\d{8}$/.test(bizDate.replace(/-/g, ''))) {
      alert("기준일자의 형식이 잘못되었습니다.");
      isSubmitting = false;
      return;
    }

    if (usage.length === 0) {
      alert("사용 용도를 입력해주세요.");
      isSubmitting = false;
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("이메일 형식이 올바르지 않습니다.");
      isSubmitting = false;
      return;
    }

    if (!userInfo || !userInfo.id) {
      alert("로그인 정보가 없습니다. 프로그램을 종료 후 다시 로그인해주세요.");
      isSubmitting = false;
      return;
    }

    // === 날짜 포맷 정리 ===
    bizDate = bizDate.replace(/-/g, '');

    // === JSON 생성 ===
    const jsonData = {
      idNumber: bizNum,
      Document: '사업자등록증명',
      bgnDate: bizDate,
      endDate: bizDate,
      HT_ID: userInfo.id,
      Usage: usage,
      Email: userInfo.email || email || ""
    };

    try {
      const result = await window.electronAPI.submitCertificate(jsonData);
      const downloadResult = await window.electronAPI.downloadFile(result);
      window.electronAPI.showResult("사업자등록증명서가 바탕화면에 저장되었습니다.", downloadResult.success);
      window.close();
    } catch (err) {
      window.electronAPI.showResult("오류 발생", false);
    } finally {
      isSubmitting = false; // 처리 완료 후 다시 클릭 가능
    }
  }
elements.bizNum.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

elements.bizSubmitBtn.addEventListener('click', async ()=> submitForm());