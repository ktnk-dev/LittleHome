window.addEventListener('DOMContentLoaded', async () => {
    search_focus.enable()
    select('.settings_visual_help').overwrite(
        $.div(
            {onclick: () => settings.start()},
            $.span('Open settings'),
            Icons.settings({fill: true, size: 15}),
        )
    )
    if (storage.get('active')?.hide_clock == true) clock()
    preset.load(storage.get('_active') || 'Default')
    searcher()
})
