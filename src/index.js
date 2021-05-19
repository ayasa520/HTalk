/*
id
domain
limit
*/
import init from 'raw-loader!./html/init.html'
import { lang } from './i18n/lang'
require('./../dist/htalk.css')
window.htalk = function (config) {
    new fac(config)
}

const fac = function (c) {
    if (!c.id) { thr(lang.NONE_ELEID) }
    if (!document.getElementById(c.id)) { thr(lang.NONE_ELE.replace("${1}", c.id)) }
    if (!c.domain) { thr(lang.NONE_DOMAIN) }
    if (!c.limit) { wr(lang.NONE_LIMIT); c.limit = 10 }
    c.start = 0
    document.getElementById(c.id).innerHTML = init
        .replace(/<!--init-->/g, `${c.id}_init`)
        .replace(/<!--next-->/g, `${c.id}_next`)
        .replace(/<!--lang.NEXT-->/g, lang.NEXT)
    document.getElementById(`${c.id}_next`).addEventListener('click',()=>{
        console.log(c)
    })
}


const thr = (n) => {
    throw `${lang.HTALK_ERROR}${n}`
}
const wr = (n) => {
    console.warn(lang.HTALK_WARN.replace('${1}', n))
}

const ls = {
    put:(key,value)=>{
        return localStorage.setItem(key,value); 
    },
    get:(key)=>{
        return localStorage.getItem(key)
    },
    del:(key)=>{
        return localStorage.removeItem(key)
    }
}