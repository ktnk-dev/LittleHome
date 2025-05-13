/**
 * @typedef {Object} $
 * @property {function(object=, ...HTMLElement): HTMLElement} DOCS - creates element with this tagname
*/

/**
 * ### Create element 
 * 
 * @type {$}
 */
const $ = new Proxy(
    class {
        /**
         * ### Creates `$` element
         * @param {string} type element type
         * @param {object} props element properties (onclick, class, ...)
         * @param  {...HTMLElement} children 
         * @returns {HTMLElement}
         */
        static createElement(type, props, ...children) {
            const element = document.createElement(type)
            
            if (props) {
                try {
                    if (
                            props instanceof Node 
                        ||  typeof props === 'string'
                        ||  typeof props === 'number'
                    ) children = [props, ...children]
                    else {throw Error()}
                } catch {
                    for (const [key, value] of Object.entries(props)) {
                        if (key.startsWith('on') && typeof value === 'function') {
                            element.addEventListener(key.slice(2).toLowerCase(), value)
                        } else if (key === 'className') {
                            element.className = value
                        } else {
                            element.setAttribute(key, value)
                        }
                    }
                }
            }
            children.flat().forEach(child => {
                if (typeof child === 'string' || typeof child === 'number') {
                    element.innerHTML += child
                } else if (child instanceof Node) {
                    element.appendChild(child)
                }
            });

            element[Symbol.toPrimitive] = function(hint) {
                if (hint === 'string') return this.outerHTML
                return this
            };
          
            return element
        }
    }, 
    {
        get(target, element) {
            return function(props, ...children) {
                return target.createElement(element, props, ...children)
            }
        }
    }
);

