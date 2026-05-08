window.addEventListener('DOMContentLoaded', async () => {
    select('.settings_visual_help').overwrite(
        $.div(
            {onclick: () => settings.open()},
            $.span('Open settings'),
            Icons.settings({fill: true, size: 15}),
        )
    )
    if (getFromStorage('active')?.hide_clock == true) clock()
    searcher()
})
