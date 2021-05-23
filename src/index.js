import hinit from 'raw-loader!./html/init.html'
import hctx from 'raw-loader!./html/ctx.html'
import { loadJS, addCSS } from './js/loadS'
import hlove from 'raw-loader!./html/love.html'
import hfilllove from 'raw-loader!./html/fill_love.html'

import love from './js/love'

import marked from 'marked'
import { lang } from './i18n/lang'

import { b, thr, su, wr, inf } from './js/notyf'
require('./../dist/htalk.css')
const info = {
    allow: "HexoPlusPlus@2.0.0β4",
    ver: "HTalk · 2.0.0"
}
export const init = function (c) {

    c.lgn = (() => {
        switch (c.lg) {
            case "error":
                return 1
            case "warning":
                return 2
            case "info":
                return 3
            case "success":
                return 4
            default:
                return 4
        }
    })()
    if (!c.id) { thr(c, lang.NONE_ELEID) }
    if (!document.getElementById(c.id)) { thr(c, lang.NONE_ELE.replace("${1}", c.id)) }
    if (!c.domain) { thr(c, lang.NONE_DOMAIN) }
    if (!c.limit) { wr(c, lang.NONE_LIMIT); c.limit = 10 }

    if (c.love && !c.recaptcha) { wr(c, lang.NONE_RECAP); }
    if (!c.love) { c.love = false }
    if (!c.recaptcha) { c.recaptcha = '' }
    if (!c.recaptchajs) { c.recaptchajs = 'https://recaptcha.net/recaptcha/api.js' }
    if (c.love && c.recaptcha) {
        loadJS(`${c.recaptchajs}?render=${c.recaptcha}`, () => {
            addCSS(`.grecaptcha-badge { 
                display: none!important; 
            } `)
            su(c, lang.LOAD_RECAP_SUCCESS)
        })
    }
    if (!c.color) {
        wr(c, lang.NONE_COLOR); c.color = {
            "from-blue-400": "to-green-300",
            "from-yellow-500": "to-yellow-400",
            "from-purple-500": "to-blue-400",
            "from-red-400": "to-pink-400"
        }
    }


    ls.put(`htalk_${c.id}_cache`, JSON.stringify({
        nid: 0,
        next: true
    }))
    document.getElementById(c.id).innerHTML = hinit
        .replace(/<!--init-->/g, `${c.id}_init`)
        .replace(/<!--next-->/g, `${c.id}_next`)
        .replace(/<!--loading-->/g, `${c.id}_loading`)
        .replace(/<!--lang.NEXT-->/g, lang.NEXT)
        .replace(/<!--lang.LOADING-->/g, lang.LOADING)
        .replace(/<!--ver-->/g, info.ver);

    const startload = (c) => {
        loadtalk(c).then((t) => {
            for (var i of t) {
                const n = new love(c, i)
                document.getElementById(`${c.id}_talk_${i}_love`).addEventListener('click', () => {
                    n.add()
                })
            }
        })
    }

    startload(c)
    document.getElementById(`${c.id}_next`).addEventListener('click', () => {
        startload(c)
    })

}




const loadtalk = async (c) => {
    try {
        const k = JSON.parse(ls.get(`htalk_${c.id}_cache`))
        if (k.next) {
            document.getElementById(`${c.id}_next`).style = "display:none"
            document.getElementById(`${c.id}_loading`).style = "display:unset"
            const start = k.nid
            const rep = await (await fetch(`https://${c.domain}/hpp/api/talk/htalk`, {
                method: "POST",
                body: JSON.stringify({
                    action: "get",
                    start: start,
                    limit: c.limit
                })
            })).json()
            const res = JSON.parse((rep).content)
            if (rep.code !== 0) {
                thr(c, `${lang.UNKNOW_BACK_ERROR}${rep.msg}`)
            }
            if (res.allow !== info.ver) {
                wr(c, lang.WARN_VER)
            }
            let p = ''
            let v = []
            for (var i in res.ctx) {
                if (!res.ctx[i]) {
                    const n = JSON.parse(ls.get(`htalk_${c.id}_cache`))
                    n.next = false
                    ls.put(`htalk_${c.id}_cache`, JSON.stringify(n))
                    nomore()
                    break;
                } else {
                    inittalk(c, res.ctx[i])
                    v.push(res.ctx[i].id)
                    //v.push(`${c.id}_talk_${}_love`)
                }
            }
            p = res.nid
            const n = JSON.parse(ls.get(`htalk_${c.id}_cache`))
            n.nid = Number(p)
            if (n.nid == 0) {
                n.next = false
                nomore(c)
            }

            ls.put(`htalk_${c.id}_cache`, JSON.stringify(n))
            document.getElementById(`${c.id}_next`).style = "display:unset"
            document.getElementById(`${c.id}_loading`).style = "display:none"
            su(c, rep.msg)

            return v;
        } else { return [] }
    }
    catch (o) {
        thr(c, o)
    }
}
const nomore = (c) => {
    document.getElementById(`${c.id}_next`).innerHTML = lang.NOMORE
}

const inittalk = async (c, i) => {
    const ran = ranjson(c.color);

    document.getElementById(`${c.id}_init`).innerHTML += hctx
        .replace(/<!--init-->/g, marked(i.content))
        .replace(/<!--avatar-->/g, i.avatar)
        .replace(/<!--name-->/g, i.name)
        .replace(/<!--id-->/g, `${c.id}_talk_${i.id}`)
        .replace(/<!--info-->/g, (() => {
            if (!!i.info) {
                return `${i.time} · ${i.info}`
            } else {
                return `${i.time} · 来自HexoPlusPlus后端`
            }
        })())
        .replace(/<!--from_color-->/g, ran[0])
        .replace(/<!--to_color-->/g, ran[1])
        .replace(/<!--love-->/g, hfilllove)
        .replace(/<!--loved-->/g, (() => {
            if (!i.love) {
                return 0
            } else {
                return i.love
            }
        })());








}

const loveinit = (id) => {

}

const rearr = (arr) => {
    let t = {}
    for (var i in arr) {
        t.unshift(arr[i])
    }
    return t
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
const ranarr = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

const ranjson = (json) => {
    const hc = (() => {
        let y = []
        for (var i in json) {
            y.push(i)
        }
        return y
    })()
    const ran = ranarr(hc)
    return [ran, json[ran]]
}
