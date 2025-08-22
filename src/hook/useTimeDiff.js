export function useTimeDiff(time) {
  // 转换为日期对象
  const target = time instanceof Date ? time : new Date(time);

  // 验证日期有效性
  if (isNaN(target.getTime())) {
    console.error('Invalid date:', time);
    return '无效时间';
  }

  const now = new Date();
  const diffMs = now - target; // 毫秒时间差

  // 计算日期差异（忽略时间部分）
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const targetDayStart = new Date(target);
  targetDayStart.setHours(0, 0, 0, 0);

  const dayDiff = Math.floor((todayStart - targetDayStart) / 86400000);

  // 时间差处理逻辑
  if (diffMs < 60000) { // 1分钟内
    return "刚刚";
  } else if (diffMs < 3600000) { // 1小时内
    const minutes = Math.floor(diffMs / 60000);
    return `${minutes}分钟前`;
  } else if (dayDiff === 0) { // 今天内
    const hours = Math.floor(diffMs / 3600000);
    return `${hours}小时前`;
  } else if (dayDiff === 1) { // 昨天
    return "昨天";
  } else if (dayDiff === 2) { // 前天
    return "前天";
  } else if (now.getFullYear() === target.getFullYear()) { // 今年内
    return `${target.getMonth() + 1}月${target.getDate()}日`;
  } else { // 跨年
    return `${target.getFullYear()}/${target.getMonth() + 1}/${target.getDate()}`;
  }
}
