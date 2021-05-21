import hinit from 'raw-loader!./html/init.html'
import hctx from 'raw-loader!./html/ctx.html'
import marked from 'marked'
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

    let p = ''
    for (var i in res.ctx) {
        if (!res.ctx[i]) {
            const n = JSON.parse(ls.get(`htalk_${c.id}_cache`))
            n.next = false
            ls.put(`htalk_${c.id}_cache`, JSON.stringify(n))
            nomore()
            break;
        }else{
            inittalk(c,res.ctx[i])
        }
    }
    p = res.nid
    const n = JSON.parse(ls.get(`htalk_${c.id}_cache`))
    n.nid = Number(p)
    ls.put(`htalk_${c.id}_cache`, JSON.stringify(n))
}
const nomore = () => {
  
}

const inittalk = (c,i) => {
  document.getElementById(`${c.id}_init`).innerHTML+=hctx
  .replace(/<!--init-->/g,marked(i.content))
  .replace(/<!--avatar-->/g,i.avatar)
  .replace(/<!--name-->/g,i.name)
  .replace(/<!--mood-->/g,i.time)
}

const rearr = (arr) => {
    let t = {}
    for (var i in arr) {
        t.unshift(arr[i])
    }
    return t
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
