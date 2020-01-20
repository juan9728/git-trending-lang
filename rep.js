import { performance, PerformanceObserver } from 'perf_hooks';
import cheerio from 'cheerio';
import fetch from 'node-fetch';

const purgeAndFormatArr = (unpurgedArray) => {
    let arr = [];
    unpurgedArray.forEach((value) => value != '' && (arr = [...arr, value]));
    return arr;
}

const getData = async (repo) => (await fetch(repo)).text();

const getSpanTag = (res) => {
    const $ = cheerio.load(res);
    const obtainChildrens = (ol, acc, $) => acc != 3 ? obtainChildrens($(ol).children(), acc+1, $) : $(ol);
    let arr = [];
    $(obtainChildrens($('ol[class="repository-lang-stats-numbers"]'), 0 , $)).each((_, e) => arr = [...arr, $(e).text()]);
    return arr;
};

const all = async (repo) => {
    const langs = purgeAndFormatArr(getSpanTag(await getData(repo))); 
    langs == false ? console.error("\x1b[31m", "Repository doesn't exist")
    : console.log(langs);
}

const wrapped = performance.timerify(() => all(process.argv[2]));

const obs = new PerformanceObserver((list) => {
    console.log(list.getEntries()[0].duration);
    obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });
wrapped();