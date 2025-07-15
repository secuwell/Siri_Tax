const elements = {
  idInput : document.getElementById('id'),
  pwInput : document.getElementById('pw'),
  loginBtn : document.getElementById('loginBtn'),
  signupBtn : document.getElementById('signupBtn'),
  clearId : document.getElementById('clearId'),
  clearPw : document.getElementById('clearPw'),
  loginMessage : document.getElementById('loginMessage'),
  loadingOverlay : document.getElementById('loadingOverlay'),
}

// === loginUI 유틸 ===
const loginUI = {
  setLoadingCursor: () => document.body.style.cursor = 'wait',  //로딩 중 커서 설정
  setDefaultCursor: () => document.body.style.cursor = 'default', //기본 커서 설정
  disableAllButtons: () => {
    document.querySelectorAll('button, input, select, textarea').forEach(el => el.disabled = true);
  },
  enableAllButtons: () => {
    document.querySelectorAll('button, input, select, textarea').forEach(el => el.disabled = false);
  },
  resultTimeoutId: null,
  loginMessage: (message) => {
    const span = elements.loginMessage;
    span.textContent = message;
    if (loginUI.resultTimeoutId) clearTimeout(loginUI.resultTimeoutId); //이전 타이머 제거
    loginUI.resultTimeoutId = setTimeout(() => {     //loginUI 결과 메시지 표시 후 7초 후에 자동으로 사라지도록 설정
      span.textContent = '';
    }, 7000);
  }
};
// === 로그인 관련 ===
  [elements.idInput, elements.pwInput].forEach(input => {
      input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
              elements.loginBtn.click();
          }
      });
  });
  elements.loginBtn.addEventListener('click', async () => {
      const id = elements.idInput.value;
      const pw = elements.pwInput.value;

      // const hashedPw = window.electronAPI.hashPassword(pw);
      if (!id && !pw) {
        loginUI.loginMessage('아이디와 비밀번호를 입력해주세요.');
        elements.idInput.focus();
        return;
      } else if (!id) {
        loginUI.loginMessage('아이디를 입력해주세요.');
        elements.idInput.focus();
        return;
      } else if (!pw) {
        loginUI.loginMessage('비밀번호를 입력해주세요.');
        elements.pwInput.focus();
        return;
      }
      elements.loadingOverlay.style.display = 'flex';
      try{
        //아이디 비번 암호화 기능을 만들어서 api 호출
        const user = { ID: id, PW: pw }
        const result = await window.electronAPI.login(user);
        if (result.success) {
          //성공시 main으로 넘어감
        } else {
          loginUI.loginMessage(result.message);
        }
      } catch(error) {
        loginUI.loginMessage('로그인 중 오류가 발생했습니다. 관리자에게 문의하세요.');
      } finally{
        elements.loadingOverlay.style.display = 'none';
      }
    });
    clearId.addEventListener('click', () => {
      document.getElementById('id').value = '';
    });
    clearPw.addEventListener('click', () => {
      document.getElementById('pw').value = '';
    });

elements.signupBtn.addEventListener('click', async (event) => {
  try {
    loginUI.disableAllButtons();
    await window.electronAPI.openSignup();
  } catch (error) {

  } finally {
    loginUI.enableAllButtons();
  }
});
