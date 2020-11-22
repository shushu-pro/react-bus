export default function textCopy (value, success) {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.value = value;
  input.select();
  document.execCommand('Copy'); // 执行浏览器复制命令

  console.info(input.value);
  document.body.removeChild(input);
  success && success();
}
