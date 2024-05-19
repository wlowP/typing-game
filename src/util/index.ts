// 获取font-size为指定值的等宽字符的实际宽度
export const getMonospaceWidth = (fontSize: number) => {
  // 创建一个span元素
  const span = document.createElement('span');

  // 设置span的字体和大小
  span.style.fontFamily = 'Consolas, "Courier New", Courier, monospace';
  span.style.fontSize = fontSize + 'px';

  // 设置span的内容为一个字符
  span.textContent = 'm';

  // 将span添加到body中（设置为隐藏）
  span.style.position = 'absolute';
  span.style.left = '-10000px';
  document.body.appendChild(span);

  // 获取并返回span的宽度
  const width = span.getBoundingClientRect().width;

  // 从body中移除span
  document.body.removeChild(span);

  return width;
}
