const CookieManager = {
    get: (cname) => {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    set: (cname, cvalue) => {
        const d = new Date();
        d.setTime(d.getTime() + (999*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
}


function getFromStorage(variable_name) {
    const c = CookieManager.get(variable_name)
    return c === '' ? null : JSON.parse(c).data
}

function setToStorage(variable_name, value) {
    CookieManager.set(variable_name, JSON.stringify({data: value}))
}