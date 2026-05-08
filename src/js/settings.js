const settings = {
    icons: {
        open: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M422.46-81.87q-23.2 0-40.29-15.35-17.08-15.35-20.08-38.04l-10-73.74q-11.09-4.78-22.79-11.08-11.69-6.29-21.26-13.09l-68.26 28q-21.45 9.24-43.15 1.87t-33.67-27.57l-58.05-100.87q-11.98-19.96-7.11-42.53 4.87-22.58 23.33-37.06l59.76-45.5q-.76-5.54-.76-10.58V-480q0-5.04.25-11.09.25-6.04 1.01-14.08l-59.26-43.76q-18.7-14.48-23.7-36.81-5-22.33 6.98-43.02l57.55-100.13q11.97-19.96 33.8-27.45 21.83-7.49 43.28 1.75l69.98 29q8.57-6.8 18.9-12.73 10.34-5.92 23.17-11.2l10-75.98q3-22.93 20.33-38.28 17.34-15.35 40.54-15.35h114.58q23.2 0 40.29 15.35 17.08 15.35 20.08 38.28l10 74.48q12.09 4.78 22.29 10.95 10.19 6.18 19.76 14.48l70.26-29q21.45-9.24 43.15-1.75t33.67 27.45l57.55 100.13q11.98 20.19 6.98 42.77-5 22.58-23.7 37.06l-62 45.76q.76 6.04.76 10.83V-480q0 7.54-.12 12.84-.12 5.29-1.14 10.83l61 44.76q18.7 14.48 23.7 37.06 5 22.58-6.98 42.77l-58.05 100.87q-11.97 19.96-33.8 27.45-21.83 7.49-43.28-1.75l-68.48-29q-8.07 6.3-17.4 11.84-9.34 5.55-24.17 12.83l-10 74.24q-3 22.69-20.08 38.04-17.09 15.35-40.29 15.35H422.46ZM478.78-345q56 0 95.5-39.5t39.5-95.5q0-56-39.5-95.5t-95.5-39.5q-56.26 0-95.63 39.5T343.78-480q0 56 39.37 95.5t95.63 39.5Z"/></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-419.35 289.33-228.67Q276.65-216 259-216.25t-30.33-12.92q-12.17-12.68-11.92-30.08t12.42-29.58L419.35-480 229.17-671.17Q217-683.35 217-700.75t12.17-30.08q12.18-12.67 29.83-12.92t30.33 12.42L480-540.65l190.67-190.68Q683.35-744 701-743.75t30.33 12.92q12.17 12.68 11.92 30.08t-12.42 29.58L540.65-480l190.18 191.17Q743-276.65 743-259.25t-12.17 30.08Q718.65-216.5 701-216.25t-30.33-12.42L480-419.35Z"/></svg>`
    },
    styles: {
        'base_bg_color': [0, 360, 'Color', ''],
        'base_bg_saturation': [0, 100, 'Saturation', '%'],
        'base_bg_color_range': [0, 180, 'Range', ''],
    },
    set_style: (name, value) => {
        setToStorage(`theme_${name}`, value)
        const bg = document.querySelector('#background')
        bg.style.setProperty(`--${name}`, value)
        bg.style.display = 'none'
        setTimeout(async () => {
            bg.style.display = 'block'
        },)
    },
    init: async () => {
        document.querySelector('#settingsbutton').innerHTML = settings.icons.open
        document.querySelector('#settingsbutton').onclick = () => settings.open()

        Object.keys(settings.styles).map(
            key => {
                const v = getFromStorage(`theme_${key}`)
                if (!v) settings.set_style(key, `11${settings.styles[key][3]}`)
                else settings.set_style(key, v)
            }
        )
    },
    open: async () => {
        const ret = name => parseInt(document.querySelector('#background').style.getPropertyValue(`--${name}`).trim().replace('%', ''))
        const setter = (name, trail = '') => (e) => settings.set_style(name, `${e.target.value}${trail}`)
        const state = (name, trail = '') => {return {value: ret(name), oninput: setter(name, trail)}}
        document.body.appendChild($.div(
            {id: 'settingsui'},
            $.h2('Settings'),
            ...Object.keys(settings.styles).map(key => {
                const d = settings.styles[key]
                return $.div(
                    $.h4(d[2]),
                    $.input({type: 'range', min: d[0], max: d[1], ...state(key, d[3])})
                )
            })
        ))
        document.querySelector('#settingsbutton').innerHTML = settings.icons.close
        document.querySelector('#settingsbutton').onclick = () => {
            document.querySelector('#settingsui').remove()
            settings.init()
        }
    }

    
}