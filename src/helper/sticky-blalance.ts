export default function stickyWorker(ip: any) {
  let s = '';
  for (let i = 0; i < ip.length; i++) {
    if (!isNaN(ip[i])) s += ip[i];
  }
  return Number(s);
};