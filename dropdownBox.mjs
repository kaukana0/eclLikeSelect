import MarkUpCode from  "./markUpCode.mjs"		// keep this file html/css free

/*
TODO:
- get selected elements
- pre-select
- single-select
- disable search
- close
- clearall button,
- have min. 1 selected
- max selection
- locking
- when moving in DOM, move also ECL-generated HTML
- on click, give just now clicked key/vaue to onselect callback
- implement setSelectedByKey

All the above implement the API of the IPCT dropdownBox, 
so that this can be used (almost) as a drop-in replacement.
Plus, some ECL select specific functionality.
*/



// please note comments of "get selected" and "set data".
class Element extends HTMLElement {

	#_cfg

	#$(elementId) { return this.getElementById(elementId)	}

	constructor() {	super(); this.#_cfg={} }

	connectedCallback() {	}
	disconnectedCallback() {console.debug("dropdownBox: disconnected") }

	// in this component, props are reflected to attributes, so that 
	// these things can be set from markup as well as from JS.
	// this makes sense only for values which are naturally of type string.
	set onSelect(val) { this.#_cfg.onSelectCallback = val }
	set selected(val) { this.#_cfg.selected = val }
	set maxSelections(val) { this.setAttribute('maxselections', val) }
	set minSelections(val) { this.setAttribute('minselections', val) }
	set multiselect(val) { this.setAttribute('ismultiselect', val) }
	set searchenabled(val) { this.setAttribute('searchenabled', val) }
	set closeenabled(val) { this.setAttribute('closeenabled', val) }
	set clearallenabled(val) { this.setAttribute('clearallenabled', val) }
	set locked(val) { this.setAttribute('locked', val) }

	// there's HTML which you wrote (<ecl-like-select> which creates a <select> as a child),
	// and after calling init(),
	// another HTML content (a <div>) is being generated (by ECL js code) as the next sibling.
	// your HTML is being hidden while the other is shown.
	// the selection information however is in your HTML content, not in the generated one.
	get selected() {
		const retVal = new Map()
		this.querySelectorAll("select option[selected]").forEach( e=> {
			retVal.set(e.getAttribute("value"), e.textContent)
		})
		return retVal
	}

	// use this last, because after this no changes
	// can be made anymore to content, pre-selection etc.
	// this is because of the way the ECL-Select works - once the
	// additional HTML is created there's no (regular) way to change it anymore.
	// note also: ECL doesn't work inside shadow DOM.
	set data(val) {
		this.appendChild( MarkUpCode.getHtmlTemplate(MarkUpCode.getHtml(this.#_cfg, val)).cloneNode(true) )
		setTimeout(()=> {
			new ECL.Select(this.firstElementChild).init()
			this.#_registerEvents()
		}, 100)
	}

	static get observedAttributes() {
		return ['maxselections', 'minselections', 'locked',
			'multiselect', 'searchenabled', 'closeenabled', 'clearallenabled' ]
	}

	attributeChangedCallback(name, oldVal, newVal) {
		switch(name) {
			case 'maxselections':
				this.#_cfg.maxSelections = parseInt(newVal)
				break;
			case 'minselections':
				this.#_cfg.minSelections = parseInt(newVal)
				break;
			case 'multiselect':
				this.#_cfg.ismultiselect = newVal
				break;
			case 'searchenabled':
				this.#_cfg.searchenabled = newVal
				break;
			case 'closeenabled':
				this.#_cfg.closeenabled = newVal
				break;
			case 'clearallenabled':
				this.#_cfg.clearallenabled = newVal
				break;
			case 'locked':
				this.#_cfg.isLocked = newVal
				break;
			default:
				console.warn("dropdownBox: unknown attribute '"+name+"'.")
		}
	}

	#_registerEvents() {
		const argl = this.nextElementSibling.querySelectorAll("div [class='ecl-checkbox']")
		argl.forEach(e=>e.addEventListener("click", e=>this.#invokeOnSelectCallback("","")))		//TODO
	}

	#invokeOnSelectCallback(key,val) {
		if(this.#_cfg.onSelectCallback !== undefined) {
			this.#_cfg.onSelectCallback(key, val)
		} else {
			console.debug("eclLikeDropdown: No onSelect callback")
		}
	}
}

window.customElements.define('ecl-like-select', Element)
