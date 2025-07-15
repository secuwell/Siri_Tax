const Store = require('electron-store').default;
const { app } = require('electron');
const path = require('path');

const SERVICE_NAME = 'Siri Tax';
const ACCOUNT = 'jwtToken';
const USER = 'user';

const store = new Store({
  encryptionKey: process.env.ELECTRON_STORE_SECRET || 'fallback_secret_123!',
  cwd: path.join(app.getPath('userData'), 'Config'),
  name: 'Siri Tax'
});

/** JWT 토큰 저장 */
async function saveToken(token) {
  store.set(`${SERVICE_NAME}.${ACCOUNT}`, token);
}

/** JWT 토큰 로드 */
async function loadToken() {
  return store.get(`${SERVICE_NAME}.${ACCOUNT}`, null);
}

/** JWT 토큰 삭제 */
async function clearToken() {
  store.delete(`${SERVICE_NAME}.${ACCOUNT}`);
}

/** 사용자 정보 저장 */
function setUser(user) {
  store.set(`${SERVICE_NAME}.${USER}`, user); // 예: { email, name, expire }
}

/** 사용자 정보 조회 */
function getUser() {
  return store.get(`${SERVICE_NAME}.${USER}`, null);
}

/** 사용자 정보 삭제 */
function clearUserData() {
  store.delete(`${SERVICE_NAME}.${USER}`);
}

module.exports = {
  // 토큰 관련
  saveToken,
  loadToken,
  clearToken,
  // 사용자 관련
  setUser,
  getUser,
  clearUserData,
  // 직접 확인용 (선택)
  getStorePath: () => store.path
};
