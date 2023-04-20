import MarkUpCode from  "./markUpCode.mjs"		// keep this file html/css free


class Element extends HTMLElement {

	#_callback		// function; from an attribute
	#_maxSelections	// from an attribute
	#_isLocked		// if true, user can't influece selection and no callback will be invoked

	#$(elementId) { return this.getElementById(elementId)	}

	constructor() {
		super()
		this.#_isLocked = false
		this.#_maxSelections = 10
	}

	#_registerEvents() {
		const argl = this.nextElementSibling.querySelectorAll("div [class='ecl-checkbox']")
		argl.forEach(e=>e.addEventListener("click", e=>this.#invokeCallback("","")))		//TODO
	}

	connectedCallback() {
		this.#_maxSelections = this.hasAttribute('maxSelections') ? this.getAttribute('maxSelections') : 10
	}

	disconnectedCallback() {
		console.debug("dropdownBox: disconnected")
	}
bla
	set data(val) {
		this.appendChild( MarkUpCode.getHtmlTemplate(MarkUpCode.getHtml(val)).cloneNode(true) )
		setTimeout(()=> {
			this.bla = new ECL.Select(this.firstElementChild)
			this.bla.init()
			this.#_registerEvents()
		}, 100)
	}

	set callback(val) {
		this.#_callback = val
	}

	set maxSelections(val) {
		this.setAttribute('maxSelections', val)
	}

	get selected() {
		const retVal = new Map()
		this.querySelectorAll("select option[selected]").forEach( e=> {
			retVal.set(e.getAttribute("value"), e.textContent)
		})
		return retVal
	}

	setLocked(isLocked) {
		this.#_isLocked = isLocked
	}

	setSelectedByKey(key) {
	}

	static get observedAttributes() {
		return ['data', 'callback', 'maxselections']
	}

	attributeChangedCallback(name, oldVal, newVal) {
		if (name === 'data' || name === 'callback') {
			console.warn("dropdownBox: setting "+name+" via html attribute is being ignored. please use js property instead.")
		}
		if(name === 'maxselections') {
			if(newVal) {
				this.#_maxSelections = parseInt(newVal)
			}
		}			
	}

	#invokeCallback(key,val) {
		if(this.#_callback !== undefined) {
			this.#_callback(key, val)
		} else {
			console.debug("dropdownBox: No callback")
		}
	}
}

window.customElements.define('ecl-like-select', Element)
