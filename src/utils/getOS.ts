export function getOS() {
  const { userAgent } = window.navigator,
    { platform } = window.navigator,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }
  return os;
}
export function getIsWxClient() {
  return /MicroMessenger/i.test(window.navigator.userAgent)
}
export function getIsPC() {
  if (['Android', 'iOS'].includes(getOS()!)) {
    return false;
  }
  return true;
}
export function getIsMobileModel(){
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
export function getTypes() {
  const u = navigator.userAgent;
  // const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  return isiOS;
}
// 是否微信小程序
export function isAppletsWx() {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.indexOf('micromessenger') !== -1 && ua.indexOf('miniprogram') !== -1) {
    return true;
  }
  return false;
}
// 是否支付宝小程序
export function isAppletsZfb() {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.indexOf('micromessenger') === -1) {
    if (ua.indexOf('miniprogram') !== -1) {
      return true;
    }
    return false;
  }
  return false;
}
// 是否小程序
export function isApplets() {
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf('miniprogram') !== -1 ? true : false;
}
