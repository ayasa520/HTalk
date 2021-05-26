import { b, thr, su, wr, inf } from './notyf'
import { lang } from './../i18n/lang'
import ls from './ls'
import getCode from './getcode'
import hfilllove from 'raw-loader!./../html/love/fill_love.html'
const love = function (c, i) {
    this.c = c
    this.i = i
}

love.prototype.add = async function () {
    if (JSON.parse(ls.get(`htalk_${this.c.id}_cache`)).loved.indexOf(this.i) === -1) {
        if (this.c.love) {
            if (this.c.recaptcha) {
                inf(this.c, lang.RECAPING)
                try {
                    getCode(this.c.recaptcha, async (token) => {
                        inf(this.c, lang.LOVING.replace('{1}', this.i))
                        await addlove(this, token)
                    })
                } catch (n) {
                    thr(this.c, lang.RECAP_ERROR)
                }
            } else {


                inf(this.c, lang.LOVING.replace('{1}', this.i))
                await addlove(this)
            }
        }

    } else {
        thr(this.c, lang.LOVED)
    }
}

const addlove = async (that, token) => {
    if (!token) { token = '' }
    console.log(token)
    const rep = await (await (fetch(
        `https://${that.c.domain}/hpp/api/talk/htalk`,
        {
            method: "POST",
            body: JSON.stringify({
                action: "love",
                id: that.i,
                recaptcha: token
            })
        }
    ))).json()
    if (rep.code == 0) {
        su(that.c, lang.LOVE_SUCCESS.replace('{1}', that.i))
        document.getElementById(`${that.c.id}_talk_${that.i}_loved`).innerHTML = Number(document.getElementById(`${that.c.id}_talk_${that.i}_loved`).innerHTML) + 1;
        document.getElementById(`${that.c.id}_talk_${that.i}_loveicon`).innerHTML = hfilllove
        const m = JSON.parse(ls.get(`htalk_${that.c.id}_cache`))
        m.loved.push(that.i)
        ls.put(`htalk_${that.c.id}_cache`,JSON.stringify(m))
        } else {
        thr(that.c, lang.LOVE_ERROR.replace('{1}', that.i))
    }
}

export default love