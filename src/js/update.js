check_update = async () => {
    if (!getFromStorage('update')) setToStorage('update', {
        required_update: false,
        installed: '-1',
        remote: '-1',
        last: 0
    })
    const stored = getFromStorage('update')
    const installed = await fetch('/.git/ORIG_HEAD').then(e => e.text())
    if (installed != stored.installed) {
        stored.installed = installed
        stored.required_update = false
    }
    if (((new Date() - stored.last) > 1000*60 *60 *5) && (stored.remote == stored.installed || stored.remote == '-1') ) {
        const remote = (await fetch('https://api.github.com/repos/ktnk-dev/LittleHome/commits').then(e => e.json()))[0].sha + '\n'
        stored.remote = remote
        stored.last = (new Date() - 0)
    }
    setToStorage('update', stored)
    if (stored.remote != stored.installed) document.querySelector('#update').classList = ''
}