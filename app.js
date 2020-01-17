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

const getData = async (since) => {
    const response = await fetch(`https://github.com/trending?since=${since}`);
    const data = await response.text();
    return data;
}

const countLangs = ($) => {
    const counts = {};
    const toText = a => $(a).text(); 
    $('[itemProp="programmingLanguage"]').each((_, e) => counts[toText(e)] = (counts[toText(e)] || 0) + 1);
    return sortObject(counts);
}

const all = async (time) => {
    const res = await getData(time);
    console.table(countLangs(cheerio.load(res)));
}

const checkArg = arg => arg == "daily" || arg == "monthly" || since == "weekly";

const executeAll = (since) => {
    const arg = checkArg(since);
    arg ? all(since) : console.error("\x1b[31m", "Values: daily, weekly, monthly");
}

executeAll(process.argv[2]);