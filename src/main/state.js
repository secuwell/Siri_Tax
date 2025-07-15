// 로그인한 사용자 정보를 저장하는 객체
let userInfo = {
  id: null,
  email: null,
  expire: null
};

function setUserInfo({ id,  email, expire }) {
  userInfo = { id, email, expire };
}
function getUserInfo() {
  return userInfo;
}
function isLoggedIn() {
  return !!userInfo.id;
}
function clearUserInfo() {
  userInfo = { id: null, email: null, expire: null };
}

module.exports = {
  setUserInfo,
  getUserInfo,
  isLoggedIn,
  clearUserInfo
};