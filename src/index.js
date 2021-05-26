import hinit from 'raw-loader!./html/init.html'
import hctx from 'raw-loader!./html/ctx.html'
import { loadJS } from './js/loadS'
import hlove from 'raw-loader!./html/love/love.html'
import hfilllove from 'raw-loader!./html/love/fill_love.html'
import ls from './js/ls'
import love from './js/love'

import marked from 'marked'
import { lang } from './i18n/lang'

import { b, thr, su, wr, inf } from './js/notyf'

import pack from './../package.json' 

require('./../dist/htalk.css')
require('./css/custom.css')
const info = {
    allow: pack.accept,
    ver: `Htalk · ${pack.version}`
}
export const init = function (c) {

    c.lgn = (() => {
        switch (c.lg) {
            case "error":
                return 1

            case "info":
                return 2
            case "success":
                return 3
            case "warning":
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


    (() => {
        const cache = ls.get(`htalk_${c.id}_cache`)
        if (!!cache && ((() => { try { const y = JSON.parse(cache); if (!!y.loved) { return true } else { return false } } catch (p) { return false } })())) {
            const jsonc = JSON.parse(cache)
            jsonc.nid = 0
            jsonc.next = true
            jsonc.added = []
            ls.put(`htalk_${c.id}_cache`, JSON.stringify(jsonc))
        } else {
            ls.put(`htalk_${c.id}_cache`, JSON.stringify({
                nid: 0,
                next: true,
                loved: [],
                added: []
            }))
        }
    })()

    document.getElementById(c.id).innerHTML = hinit
        .replace(/<!--init-->/g, `${c.id}_init`)
        .replace(/<!--next-->/g, `${c.id}_next`)
        .replace(/<!--loading-->/g, `${c.id}_loading`)
        .replace(/<!--lang.NEXT-->/g, lang.NEXT)
        .replace(/<!--lang.LOADING-->/g, lang.LOADING)
        .replace(/<!--ver-->/g, info.ver);

    const startload = () => {
        loadtalk(c).then((t) => {
            let cache = JSON.parse(ls.get(`htalk_${c.id}_cache`))
            for (var i of t) {
                cache.added.push(i)
            }
            for (var i of cache.added) {
                const n = new love(c, i)
                document.getElementById(`${c.id}_talk_${i}_love`).addEventListener('click', () => {
                    n.add()
                })
            }
            ls.put(`htalk_${c.id}_cache`, JSON.stringify(cache))

        })
    }

    startload()
    document.getElementById(`${c.id}_next`).addEventListener('click', () => {
        startload()
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
        .replace(/<!--love-->/g, (() => {

            if (JSON.parse(ls.get(`htalk_${c.id}_cache`)).loved.indexOf(i.id) !== -1) {
                return hfilllove
            } else {
                return hlove
            }
        })())
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
