/**
 * @typedef {Object} IconOptions
 * @prop {100|200|300|400|500|600|700} weight Symbol weight
 * @prop {bool} fill
 * @prop {'low' | 'default' | 'high'} grade Symbol thickness
 * @prop {20|48} optical_size (from 20 to 48) For the image to look the same at different sizes in dp
 * @prop {number} size Icon size in px
 * @prop {string} color Any css-supported color variant (names, rgb, hex)
 */

var DEFAULT_ICON_COLOR = '#000'
var DEFAULT_ICON_SIZE = 24
/** @type {IconOptions} */
var DEFAULT_ICON_OPTIONS = {}

/** @type {Record<string, (options: IconOptions) => HTMLSpanElement} */
const Icons = new Proxy(
    class {
        /**
         * @param {string} name 
         * @param {IconOptions} options 
         * @returns {HTMLSpanElement}
         */
        static getIcon(name, {fill, weight, grade, optical_size, size, color}) {
            const gr = ({
                'low': -25,
                'default': 0,
                'high': 200
            })[grade]
            const data = `
            'FILL' ${fill !== undefined ? fill?1:0 : 1}, 
            'wdth' ${weight || 400}, 
            'GRAD' ${gr || 0}, 
            'opsz' ${optical_size || 20}`
            const fz = size ? typeof size != Number  ? `${size}px`:size  : (DEFAULT_ICON_SIZE+'px')
            return $.span(
                {class: 'material-symbols-rounded icon', style: `font-size: ${fz}; width: ${fz}; height: ${fz}; ${color ? `color: ${color};` : ''}font-variation-settings: ${data}`},
                name
            )
        }
    },
    {
        get(target, name) {
            /**
             * @argument {IconOptions} options
             */
            return function(options) {
                return target.getIcon(name, options || DEFAULT_ICON_OPTIONS)
            }
        }
    }
)

const gIconsInit = () => document.head.innerHTML += `
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200">
`