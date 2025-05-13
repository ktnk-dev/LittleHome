const clock = async () => {
    const render = async () => {
        const baseOffset = 109.12
        const tsp = number => (number < 10 ? `0${number}` : `${number}`).split('').map(e => parseInt(e)*baseOffset)
        const time = new Date()
        var ft = [tsp(time.getHours()), tsp(time.getMinutes()), tsp(time.getSeconds())].flat()
        var fe = [
            document.querySelectorAll('.digit.h')[0],
            document.querySelectorAll('.digit.h')[1],
            document.querySelectorAll('.digit.m')[0],
            document.querySelectorAll('.digit.m')[1],
            document.querySelectorAll('.digit.s')[0],
            document.querySelectorAll('.digit.s')[1]
        ]
        var _ = [...Array(6).keys()].map(i => {
            const value = ft[i]
            const element = fe[i]
            element.style = `transform: translateY(-${value}px)`
        })
    }

    document.querySelector('body').appendChild(
        $.div(
            {id: 'clock'},
            $.div({class: 'digit h'}, [...Array(3).keys()].map(_ => $.span(_.toString()))),
            $.div({class: 'digit h'}, [...Array(11).keys()].map(_ => $.span(_ < 10 ? _.toString() : '0'))),
            $.div({class: 'digit l'}, $.span(':')),
            $.div({class: 'digit m'}, [...Array(7).keys()].map(_ => $.span(_ < 10 ? _.toString() : '0'))),
            $.div({class: 'digit m'}, [...Array(11).keys()].map(_ => $.span(_ < 10 ? _.toString() : '0'))),
            $.div({class: 'digit l'}, $.span(':')),
            $.div({class: 'digit s'}, [...Array(7).keys()].map(_ => $.span(_ < 10 ? _.toString() : '0'))),
            $.div({class: 'digit s'}, [...Array(11).keys()].map(_ => $.span(_ < 10 ? _.toString() : '0'))),
        )
    )
    render()
    setInterval(() => render(), 500);
}


searcher = () => {
    const findbang = query => {
        if (query.indexOf('!') == -1) return {found: false, valid: false}
        const inputed = query.split('!')[1]
        for (const bang of bangs) {
            if (bang.t == inputed) return {found: true, valid: true, inputed: inputed, data: bang}
        }
        return {found: true, valid: false, inputed: inputed}

    }
    var lastquery = ''
    const proceed = query => {
        if (query == lastquery) return
        lastquery = query
        document.querySelector('#clock').style.opacity = query == '' ? 1 : 0
        document.querySelector('#searcher').style.opacity = query == '' ? 0 : 1
        const fb = findbang(query)
        if (fb.found) query = query.replace('!'+fb.inputed, `<span class="${fb.valid? '' : 'error'}">!${fb.inputed}</span>`)
        console.log(query)
        document.querySelector('#searcher > h1').innerHTML = query
        document.querySelector('#searcher > p').innerHTML = `Search via ${fb.valid? fb.data.s : 'Google'}`

    }
    const find = element => {
        const query = element.target.value.trim()
        const fb = findbang(query)
        const url = fb.valid ? fb.data.u : 'https://www.google.com/search?q={{{s}}}'
        window.location.href = url.replace('{{{s}}}', encodeURI(fb.found ? query.replace('!'+fb.inputed, '').trim() : query.trim()))
    }
    document.querySelector('#search_ddd').addEventListener('change', find)
    document.querySelector('#search_ddd').addEventListener('input', (e) => {proceed(e.target.value.trim())})
    setInterval(() => {
        document.querySelector('#search_ddd').focus()
        proceed(document.querySelector('#search_ddd').value.trim())
    }, 100);
}