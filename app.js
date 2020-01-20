import { performance, PerformanceObserver } from 'perf_hooks'; 
import cheerio from 'cheerio';
import fetch from 'node-fetch';

const sortObject = (obj) => {
  let arr = [];
  Object.keys(obj).forEach(key => obj[key] && (arr = [...arr, {'key': key, 'value': obj[key]}]));
  return arr.sort((a,b) => b.value - a.value).reduce((obj, item) => {
      obj[item.key] = item.value;
      return obj;
  }, {});
}

const getData = async (since) => (await fetch(`https://github.com/trending?since=${since}`)).text();

const countLangs = ($) => {
  const counts = {};
  const toText = a => $(a).text(); 
  $('[itemProp="programmingLanguage"]').each((_, e) => counts[toText(e)] = (counts[toText(e)] || 0) + 1);
  return sortObject(counts);
}

const all = async (time) => {
  time == "daily" || time == "monthly" || time == "weekly" ? 
  console.table(countLangs(cheerio.load(await getData(time)))) 
  : console.error("\x1b[31m", "Values: daily, weekly, monthly");
}
 
const wrapped = performance.timerify(() => all(process.argv[2]));

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });
wrapped();