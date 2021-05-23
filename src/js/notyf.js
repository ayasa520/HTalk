import { Notyf } from 'notyf';
import {lang } from './../i18n/lang'
export var b = new Notyf({
    types: [
        {
            type: 'warning',
            background: 'orange',
            icon: false
        },
        {
            type: 'info',
            background: 'blue',
            icon: false
        }

    ]
});


export const thr = (c, n) => {
    if (c.lgn > 0) {
        b.error(`${lang.HTALK_ERROR}${n}`);
    }
    throw `${lang.HTALK_ERROR}${n}`
}
export const su = (c, n) => {
    if (c.lgn > 3) {
        b.success(n);
    }
    console.log(n)
}

export const inf = (c, n) => {
    if (c.lgn > 2) {
        b.open({
            type: 'info',
            message: n
        })
    }
    console.log(n)
}

export const wr = (c, n) => {
    if (c.lgn > 1) {
        b.open({
            type: 'warning',
            message: lang.HTALK_WARN.replace('${1}', n)
        })
    }

    console.warn(lang.HTALK_WARN.replace('${1}', n))
}