const elements ={
    homTaxID: document.getElementById('homTaxID'),
    homTaxPW: document.getElementById('homTaxPW'),
    mail: document.getElementById('mail'),
    expire: document.getElementById('expire'),
}

window.addEventListener('DOMContentLoaded', async () => {
  const userInfo = await window.electronAPI.getUser();
  elements.homTaxID.value += userInfo.id;
  elements.expire.textContent = userInfo.expire;
});