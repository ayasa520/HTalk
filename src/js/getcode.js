const getcode = (n,callback) => {
    let y = ""
    grecaptcha.ready(() => {
        grecaptcha.execute(n, { action: 'love' }).then((token) => {
            callback(token)
        });
    });
}

export default getcode