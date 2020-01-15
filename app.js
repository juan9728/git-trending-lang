import cheerio from 'cheerio';
import fetch from 'node-fetch';

const sortObject = (obj) => {
    let arr = [];
    Object.keys(obj).forEach(prop => obj[prop] && (arr = [...arr, {'key': prop, 'value': obj[prop]}]));
    return arr.sort((a,b) => b.value - a.value).reduce((obj, item) => {
        obj[item.key] = item.value;
        return obj;
    }, {});
}

const getData = async (since) => {
    const response = await fetch(`https://github.com/trending?since=${since}`);
    const data = await response.text();
    return data;
}

const countOfLangs = ($) => {
    const counts = {};
    $('[itemProp="programmingLanguage"]').each((_, e) => counts[$(e).text()] = (counts[$(e).text()] || 0) + 1);
    return sortObject(counts);
}

const all = async (time) => {
    const res = await getData(time);
    console.table(countOfLangs(cheerio.load(res)));
}

const executeAll = () => {
    const since = process.argv[2];
    if(since != "daily" && since != "monthly" && since != "weekly"){
        console.log("\x1b[31m", "Values: daily, weekly, monthly");
    } else {
        all(since);
    }
}

executeAll();