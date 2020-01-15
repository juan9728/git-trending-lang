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

const getAllData = async (since) => {
    const response = await fetch(`https://github.com/trending?since=${since}`);
    const data = await response.text();
    return data;
}

const all = async (time) => {
    const data = await getAllData(time);
    const $ = cheerio.load(data);
    const span = $('[itemProp="programmingLanguage"]');
    const counts = {}; 
    const text = span.each((_, e) => {
        const x = $(e).text();
        counts[x] = ((counts[x] || 0) + 1);
    });
    console.table(sortObject(counts));
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