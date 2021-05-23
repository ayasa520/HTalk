import { b, thr, su, wr, inf } from './notyf'
import getCode from './getcode'
const love = function (c, i) {
    this.c = c
    this.i = i
}

love.prototype.add = async function () {
    inf(this.c, `正在进行人机验证`)

    if (this.c.love) {
        if (this.c.recaptcha) {
            getCode(this.c.recaptcha, async (token) => {
                inf(this.c, `正在点赞id为${this.i}的说说`)
                await addlove(this, token)
            })
        }
    }

}

const addlove = async (that, token) => {
    console.log(token)
    const rep = await (await (fetch(
        `https://${that.c.domain}/hpp/api/talk/htalk`,
        {
            method: "POST",
            body: JSON.stringify({
                action: "love",
                id: that.i
            })
        }
    ))).json()
}

export default love