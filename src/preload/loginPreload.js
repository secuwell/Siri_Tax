const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getToken: () => ipcRenderer.invoke('get-token'),
    getUser: () => ipcRenderer.invoke('get-user'),
    openSignup: () => ipcRenderer.invoke('open-signup'),  //회원가입 창 띄우기
    openLogin: () => ipcRenderer.invoke('open-login'),   //로그인 창 띄우기
    login: (user) => ipcRenderer.invoke('login', user),   //로그인
});