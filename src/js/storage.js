const storage = {
    get: (variable_name) => {
        const worker = (cname) => {
            let name = cname + "=";
            let decodedCookie = document.cookie;
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
        }
        const c = worker(variable_name)
        return c === '' ? null : JSON.parse(c).data
    },
    set: (variable_name, value) => {
        const worker = (cname, cvalue) => {
            const d = new Date();
            d.setTime(d.getTime() + (999*24*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }
        worker(variable_name, JSON.stringify({data: value}))
    }
}


/**
 * @typedef {Object} Preset
 * @prop {number} version
 * @prop {string} name
 * @prop {"default" | "url" | "color" | "gradient"} background_type // TODO: gradient
 * @prop {number} base_bg_color
 * @prop {number} base_bg_saturation
 * @prop {number} base_bg_color_range
 * @prop {string} font_sans
//  * @prop {string} font_sans_size
 * @prop {string} font_serif
//  * @prop {string} font_serif_size
 * @prop {string} font_monospace
//  * @prop {string} font_monospace_size
 * @prop {string} color_text_white
 * @prop {string} color_text_gray
 * @prop {string} s000
 * @prop {string} s100
 * @prop {string} s200
 * @prop {string} s300
 * @prop {bool} m
 */

const preset = {
    /** @type {Preset} */
    active: {},
    current_version: 1,
    migration: () => ([
        ['version', preset.current_version, 1],
        ['m', true, 1],
    ]).forEach(q => preset.active[q[0]] = q.length>2 ? q[1] : (preset.active[q[0]] || q[1])),

    save: () => {
        preset.migration()
        storage.set(preset.active.name, preset.active)
        storage.set('_active', preset.active.name)
        var list = storage.get('_presets') ? storage.get('_presets') : [] 
        if (!list.includes(preset.active.name)) {
            list.push(preset.active.name)
            storage.set('_presets', list)
        }
        preset.render()
    },
    delete: () => {
        /**@type {string[]} */
        var list = storage.get('_presets') ? storage.get('_presets') : [] 

        list[list.indexOf(preset.active.name)] = false
        list = list.filter(q => q != null)
        storage.set('_presets', list)
        preset.load(list.length > 0 ? list[0] : 'Default')
    },
    load: preset_name => {
        if (!preset_name) preset_name = storage.get('_active') ? storage.get('_active') : 'Default'
        
        var list = storage.get('_presets') ? storage.get('_presets') : [] 
        if (!list.includes(preset_name)) {
            preset.active = preset.default()
            preset.active.name = preset_name
            preset.save()
        } else {
            preset.active = storage.get(preset_name)
            preset.save()
        }
    },

    render: () => {
        const force_redraw = (element) => {
            if (!element) return 
            element.classList.toggle('twt')
            var n = document.createTextNode(' ')
            var disp = element.style.display || 'block'
            element.appendChild(n)
            element.style.display = 'none'
            requestAnimationFrame(
                () => {
                    element.style.display = disp
                    n.parentNode.removeChild(n)
                }
            )
        }
        const style_override = {
            // s000: 'surface-000',
            // s100: 'surface-100',
            // s200: 'surface-200',
            // s300: 'surface-300',
            font_sans: 'sans',
            font_serif: 'serif',
            font_monospace: 'monospace',
        }

        const set_style = (element, s) => {
            s = s.replaceAll('-', '_')
            const prop_name = Object.keys(style_override).includes(s) ? style_override[s] : s
            element.style.setProperty('--'+prop_name, ['base_bg_saturation','base_bg_brightness'].includes(s) ? (preset.active[s]+'%') : preset.active[s])
        }
        
        select('#background').element.setAttribute('class', preset.active.background_type);

        (['s000', 's100', 's200', 's300', 'font_sans', 'font_serif', 'font_monospace', 'color_text_white', 'color_text_gray',])
        .forEach(s => set_style(select('body').element, s));

        (['base_bg_color', 'base_bg_saturation', 'base_bg_color_range', 'base_bg_brightness'])
        .forEach(s => set_style(select('#background').element, s));
        force_redraw(select('#background').element)
    },

    /**
     * @returns {Preset}
     */
    default: () => { return {
        name: 'Defualt',
        version: preset.current_version,
        // disable_clock: false,
        // disable_animations: false,
        background_type: 'default',
        base_bg_color: 10,
        base_bg_saturation: 10,
        base_bg_brightness: 10,
        base_bg_color_range: 10,
        // search_url: 'https://www.google.com/search?q={{{s}}}',
        // display_suggestions: false,
        // display_history: false,
        font_sans: 'Nunito',
        font_serif: 'Playfair Display',
        font_monospace: 'monospace',
        color_text_white: '#fff',
        color_text_gray: '#999',
        s000: '#000',
        s100: '#fff',
        s200: '#fff',
        s300: '#fff',
    }}
}

const defaults = {
    bangs: [
        {name: 'Test bang', keyword: 'test_bang', url: 'https://www.google.com/search?q={{{s}}}'},
        {name: 'Google Search AI', keyword: 'ai', url: 'https://www.google.com/search?q={{{s}}}&sourceid=chrome&ie=UTF-8&amc=1&oq={{{s}}}&udm=50&aep=109&cud='}
    ],
    search_engine: 'https://www.google.com/search?q={{{s}}}'
}

/**
 * @typedef {Object} Bang
 * @prop {string} keyword
 * @prop {string} name
 * @prop {string} url
 */
/** @type {Bang[]} */
var bangs_override = storage.get('_bangs')  || defaults.bangs

/** @type {string} */
var search_engine  = storage.get('_search') || defaults.search_engine