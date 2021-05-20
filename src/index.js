import hinit from 'raw-loader!./html/init.html'
import { lang } from './i18n/lang'
require('./../dist/htalk.css')


export const init = function (c) {
    if (!c.id) { thr(lang.NONE_ELEID) }
    if (!document.getElementById(c.id)) { thr(lang.NONE_ELE.replace("${1}", c.id)) }
    if (!c.domain) { thr(lang.NONE_DOMAIN) }
    if (!c.limit) { wr(lang.NONE_LIMIT); c.limit = 10 }
    ls.put(`htalk_${c.id}_cache`, JSON.stringify({
        nid: 0,
        next: true
    }))
    document.getElementById(c.id).innerHTML = hinit
        .replace(/<!--init-->/g, `${c.id}_init`)
        .replace(/<!--next-->/g, `${c.id}_next`)
        .replace(/<!--lang.NEXT-->/g, lang.NEXT)
    loadtalk(c)
    document.getElementById(`${c.id}_next`).addEventListener('click', () => {
        const n = JSON.parse(ls.get(`htalk_${c.id}_cache`))
        n.nid += c.limit
        ls.put(`htalk_${c.id}_cache`, JSON.stringify(n))
        loadtalk(c)
    })
}

const loadtalk = async (c) => {
    const start = JSON.parse(ls.get(`htalk_${c.id}_cache`)).nid
    const res = JSON.parse((await (await fetch(`https://${c.domain}/hpp/api/talk/htalk`, {
        method: "POST",
        body: JSON.stringify({
            action: "get",
            start: start,
            limit: c.limit
        })
    })).json()).content)
    for (var i in res) {
        if (!res[i]) {
            const n = JSON.parse(ls.get(`htalk_${c.id}_cache`))
            n.next = false
            ls.put(`htalk_${c.id}_cache`, JSON.stringify(n))
            nomore(c)
            break;
        }
        console.log(res[i])
    }
}
const nomore = (c) => {

}

const thr = (n) => {
    throw `${lang.HTALK_ERROR}${n}`
}
const wr = (n) => {
    console.warn(lang.HTALK_WARN.replace('${1}', n))
}

const ls = {
    put: (key, value) => {
        return localStorage.setItem(key, value);
    },
    get: (key) => {
        return localStorage.getItem(key)
    },
    del: (key) => {
        return localStorage.removeItem(key)
    }
}
