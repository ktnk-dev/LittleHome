const search_focus = {
    id: null,
    paused: false,
    enable: () => {
        search_focus.paused = false
        if (search_focus.id) return
        search_focus.id = setInterval(() => {
            if (search_focus.paused) return
            if (!search_focus.id) return
            document.querySelector('#search_ddd').focus()
            console.log(search_focus.id)
            // proceed(document.querySelector('#search_ddd').value.trim())
        }, 100)
    },
    disable: () => {
        search_focus.paused = true
    }
}

const settings = {
    views: [],
    current: null,

    back: async () => {
        settings.current = settings.views.pop()
        if (!settings.current) {
            selectAll('#settings > *').map(e => e.element.classList.add('ov'))
            await sleep(.2)
            settings.stop()
        } else {
            settings._open(settings.current())
        }
    },
    _open: async elements => {
        selectAll('#settings > *').map(e => e.element.classList.add('ov'))
        await sleep(.2)
        select('#settings').overwrite(...elements)
        selectAll('#settings > *').map(e => e.element.classList.add('ov'))
        requestAnimationFrame(() => selectAll('#settings > *').map(e => e.element.classList.remove('ov')))
    },
    
    next: async fn => {
        settings.views.push(settings.current)
        settings.current = fn
        settings._open(fn())
    },

    back_button: (title, icon = Icons.arrow_back) => $.div(
        {onclick: settings.back, class: 'back'},
        icon(),
        $.h2(title),
    ),
    start: () => {
        settings.views = []
        settings.current = null
        select('body').append(
            $.div({id: 'settings'})
        )
        search_focus.disable()
        settings.next(settings.main)
    },
    stop: () => {
        select('#settings').remove()
        search_focus.enable()
    },
    main: () => [
        settings.back_button('Settings', Icons.close),
        $.div(
            {class: 'surface'},
            $.div(
                {class: 'setting_entry', onclick: () => settings.next(settings.basic)},
                $.span('Basic settings'),
                Icons.arrow_right()
            ),
            $.div(
                {class: 'setting_entry', onclick: () => settings.next(settings.bangs)},
                $.span('Bangs editor'),
                Icons.arrow_right()
            ),
            $.div(
                {class: 'setting_entry', onclick: () => settings.next(settings.customization)},
                $.span('Customization'),
                Icons.arrow_right()
            ),
        )
    ],
    basic: () => [
        settings.back_button('Basic Settings'),
    ],
    bangs: () => [
        settings.back_button('Bangs editor'),
        $.p('Here are your custom bangs, that will override default one from DuckDuckGo'),
        $.div(
            {class: 'list'},
            $.div(
                {class: 'action', onclick: () => settings.next(() => settings.edit_bang(false))},
                Icons.add_2(),
            ),
        ),
        $.div(
            {class: 'surface'},
            ...bangs_override.toReversed().map(b => $.div(
                {class: 'setting_entry', onclick: () => settings.next(() => settings.edit_bang(b))},
                $.span(b.name),
                Icons.arrow_right()
            ))
            
        )
    ],
    edit_bang: bang_data => {
        const index = bangs_override.findIndex(b => b === bang_data)
        /** @type {Bang} */
        state.bang = bang_data || {
            name: '',
            keyword: '',
            url: ''
        }
        return [
            settings.back_button('Edit Bang'),
            $.h3('Name'),
            $.input({value: state.bang.name, placeholder: 'Bang name', onchange: (e) => state.bang.name = e.target.value.trim()}),
            $.div({style: 'height: 10px'}),
            $.h3('Keyword'),
            $.p('Add a short keyword for your bang, e.g. ', $.code('google')),
            $.input({value: state.bang.keyword, placeholder: 'Bang keyword', onchange: (e) => state.bang.keyword = e.target.value.trim()}),
            $.div({style: 'height: 10px'}),
            $.h3('URL'),
            $.p('Add a url for your bang with ', $.code('{{{s}}}'), ' string, that will be replaced with the search query'),
            $.textarea({value: state.bang.url, placeholder: 'Bang URL', onchange: (e) => state.bang.url = e.target.value.trim()}, state.bang.url),
            $.div(
                {class: 'list'},
                $.div(
                    {class: 'action', onclick: () => {
                        if (state.bang.name.length && state.bang.keyword.length && state.bang.url.length) {
                            index != -1 ? bangs_override[index] = state.bang : bangs_override.push(state.bang)
                            storage.set('_bangs', bangs_override)
                            settings.back()
                        } else {
                            alert('Please fill in all fields')
                        }
                    }},
                    $.span('Save'),
                ),
                bang_data ? $.div(
                    {class: 'action', onclick: () => {
                        if (confirm('Are you sure you want to delete this bang?')) {
                            bangs_override.splice(index, 1)
                            storage.set('_bangs', bangs_override)
                            settings.back()
                        }
                    }},
                    $.span('Delete'),
                ) : null
            ),
        ]
    }
}

const state = {
    /** @type {Bang} */
    bang: null,
    /** @type {string} */
    search_url: null,
}

// debug
sleep(.3).then(() => settings.start())
