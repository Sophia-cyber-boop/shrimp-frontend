// 后端接口地址（稍后再改）
const API_URL = 'https://shrimp-backend.vercel.app/api/run';

// 新开页登录 Battle.net
function openLogin() {
  window.open(
    'https://account.battle.net/login/en/?ref=localhost',
    '_blank'
  );
}

// 主流程
async function start() {
  const url = document.getElementById('url').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!password) {
    alert('请输入访问密码 / Please input password');
    return;
  }

  if (!url) {
    alert('请粘贴 URL / Please paste URL');
    return;
  }

  const ssoToken = url.split('=')[1]?.split('&')[0];
  if (!ssoToken) {
    alert('URL 无法解析 / Invalid URL');
    return;
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ssoToken, password })
  });

  if (!res.ok) {
    alert('请求失败 / Request failed');
    return;
  }

  const d = await res.json();
  serial.value = d.serial || '';
  restoreCode.value = d.restoreCode || '';
  deviceSecret.value = d.deviceSecret || '';
}

// 复制文本
function copyText(id) {
  const el = document.getElementById(id);
  navigator.clipboard.writeText(el.value);
  showToast('复制成功 / Copied!');
}

// 显示 / 隐藏 Device Secret
function toggleSecret() {
  deviceSecret.type =
    deviceSecret.type === 'password' ? 'text' : 'password';
}

// 导出 TXT
function exportTxt() {
  if (!serial.value) {
    alert('没有可导出的数据 / No data to export');
    return;
  }

  const text =
`Serial: ${serial.value}
RestoreCode: ${restoreCode.value}
DeviceSecret: ${deviceSecret.value}`;

  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'authenticator.txt';
  a.click();
}

// 提示动画
function showToast(msg) {
  const t = document.getElementById('toast');
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1500);
}
