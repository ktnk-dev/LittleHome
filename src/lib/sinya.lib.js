/**
 * @typedef {Object} $
 * @property {function(object=, ...HTMLElement): HTMLElement} div - creates div element
 * @property {function(object=, ...HTMLElement): HTMLElement} p - creates p element
 * @property {function(object=, ...HTMLElement): HTMLElement} span - creates span element
 * @property {function(object=, ...HTMLElement): HTMLElement} button - creates button element
 * @property {function(object=, ...HTMLElement): HTMLElement} input - creates input element
 * @property {function(object=, ...HTMLElement): HTMLElement} a - creates a element
 * @property {function(object=, ...HTMLElement): HTMLElement} img - creates img element
 * @property {function(object=, ...HTMLElement): HTMLElement} h1 - creates h1 element
 * @property {function(object=, ...HTMLElement): HTMLElement} h2 - creates h2 element
 * @property {function(object=, ...HTMLElement): HTMLElement} h3 - creates h3 element
 * @property {function(object=, ...HTMLElement): HTMLElement} h4 - creates h4 element
 * @property {function(object=, ...HTMLElement): HTMLElement} h5 - creates h5 element
 * @property {function(object=, ...HTMLElement): HTMLElement} h6 - creates h6 element
 * @property {function(object=, ...HTMLElement): HTMLElement} ul - creates ul element
 * @property {function(object=, ...HTMLElement): HTMLElement} li - creates li element
 * @property {function(object=, ...HTMLElement): HTMLElement} form - creates form element
 * @property {function(object=, ...HTMLElement): HTMLElement} table - creates table element
 * @property {function(object=, ...HTMLElement): HTMLElement} tr - creates tr element
 * @property {function(object=, ...HTMLElement): HTMLElement} td - creates td element
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


/**
 * Select single DOM element and wrap them
 * @param {string} selector 
 * @returns {WrappedElement}
 */
const select = (selector, _target = document) => wrap(_target.querySelector(selector))

/**
 * Select multiple DOM element and wrap them
 * @param {string} selector 
 * @returns {Array.<WrappedElement>}
 */
const selectAll = (selector, _target = document) => [..._target.querySelectorAll(selector)].map(_ => wrap(_))

/**
 * Wrap existing DOM element
 * @param {HTMLElement} element 
 * @returns {WrappedElement}
 */
const wrap = element => new WrappedElement(element)

const sleep = s => new Promise(r => setTimeout(r, s*1000))


class WrappedElement {
    /**
     * @type {HTMLElement}
     */
    element    

    /**
     * Create element wrapper
     * @param {HTMLElement} element 
     */
    constructor(element) {
        this.element = element
    }

    /**
     * Override element classes
     * @param  {...string} list 
     * @returns {WrappedElement} this element for chaining
     */
    classes(...list) {
        this.element.classList = list.join(' ')
        return this
    } 
    
    /**
     * Get elements styles to edit them
     * @returns {CSSStyleDeclaration}
     */
    styles () {
        return this.element.style
    }

    /**
     * Get element nodes
     * @returns {Array.<WrappedElement>}
     */
    nodes () {
        return [...this.element.childNodes].map(e => wrap(e))
    }

    /**
     * Apply animation to element (async)
     * @param {string} animation_name 
     * @param {number} animation_duration 
     * @param {string} animation_function_name 
     * @returns {WrappedElement} this element for chaining
     */    
    async animate (animation_name, animation_duration, animation_function_name = '') {
        this.styles().animation = `${animation_name} ${animation_duration}s ${animation_function_name}`
        await sleep(animation_duration - (animation_duration / 20))
        this.styles().animation = ``
        return this
    }

    /**
     * Clear element content (async)
     * @returns {WrappedElement} this element for chaining
     */
    async clear () {
        this.element.innerHTML = ''
        return this
    }

    /**
     * Overwrite element content (async)
     * @param {...HTMLElement} children 
     * @returns {WrappedElement} this element for chaining
     */
    async overwrite (...children) {
        this.clear()
        this.append(...children)
        return this
    }
    /**
     * Add content to element (async)
     * @param {...HTMLElement} children 
     * @returns {WrappedElement} this element for chaining
     */
    async append (...children) {
        children.forEach(child => {
            if (typeof child === 'string' || typeof child === 'number') {
                this.element.innerHTML += child
            } else if (child instanceof Node) {
                this.element.appendChild(child)
            } else if (child instanceof WrappedElement) {
                this.element.appendChild(child.element)
            }
        })
        return this
    }
    /**
     * Removes element (async)
     */
    async remove() {
        this.element.remove()
    }

    /**
     * Return element node by selector
     * @param {string} selector 
     * @returns {WrappedElement}
     */
    select (selector) {
        return select(selector, this.element)
    }
    /**
     * Return element nodes by selector
     * @param {string} selector 
     * @returns {Array.<WrappedElement>}
     */
    selectAll (selector) {
        return selectAll(selector, this.element)
    }
}

const Body = select('body')