const elements= {
  bizNum: document.getElementById('bizNum'),
  paymentSubmitBtn: document.getElementById('paymentSubmitBtn'),
}

window.addEventListener('DOMContentLoaded', () => {
      const yearSelect = document.getElementById('year');
      const thisYear = new Date().getFullYear();
      for (let y = thisYear; y >= 2000; y--) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        yearSelect.appendChild(opt);
      }
    });
    let isSubmitting = false;  // 중복 클릭 방지용 플래그

  async function submitForm() {
    if (isSubmitting) return;  // 이미 처리 중이면 무시
    isSubmitting = true;
    const bizNum = document.getElementById('bizNum').value.trim();
    const year = document.getElementById('year').value;
    const usage = document.getElementById('usage').value;
    const email = document.getElementById('email').value;
    const userInfo = await window.electronAPI.getUser();

    // === 유효성 검사 ===
    if (!year || year.length !== 4 || isNaN(Number(year))) {
      alert("연도를 4자리 숫자로 입력해주세요.");
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
    const date = `${year}`;
    // === JSON 생성 ===
    const jsonData = {
      idNumber: bizNum,
      Document: '납세사실증명',
      bgnDate: date,
      endDate: date,
      HT_ID: userInfo.id,
      usage: usage,
      Email: userInfo.email || email || ""
    };

  try {
      const result = await window.electronAPI.submitCertificate(jsonData);
      const downloadResult = await window.electronAPI.downloadFile(result);
      window.electronAPI.showResult("납부내역증명서가 바탕화면에 저장되었습니다.", downloadResult.success);
      window.close();
    } catch (err) {
      console.error("오류 발생:", err);
      window.electronAPI.showResult("오류 발생", false);
    } finally {
      isSubmitting = false; // 처리 완료 후 다시 클릭 가능
    }
  }
elements.bizNum.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

elements.paymentSubmitBtn.addEventListener('click', async ()=> submitForm());