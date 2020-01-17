import cheerio from 'cheerio';
import fetch from 'node-fetch';

const purgeAndFormatArr = (unpurgedArray) => {
    let arr = []
    unpurgedArray.forEach((value) => value != '' && (arr = [...arr, value]));
    return arr;
}

const getData = async (repo) => {
    const response = await fetch(repo);
    const data = await response.text();
    return data;
}

const getSpanTag = (res) => {
    const $ = cheerio.load(res);
    const obtainChildrens = (ol, acc, $) => acc != 3 ? obtainChildrens($(ol).children(), acc+1, $) : $(ol);
    let arr = [];
    $(obtainChildrens($('ol[class="repository-lang-stats-numbers"]'), 0 , $)).each((_, e) => arr = [...arr, $(e).text()]);
    return arr;
};

const all = async () => {
    const res = await getData(process.argv[2]);
    const langs = purgeAndFormatArr(getSpanTag(res)); 
    if(langs == false){
        console.error("\x1b[31m", "Repository doesn't exist");
    } else {
        console.log(langs)
    }
}

all();