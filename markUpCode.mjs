/*
all HTML and CSS as JS string
*/

export default class MarkUpCode {

	// helper
	static getHtmlTemplate(source) {
		const t = document.createElement('template')
		t.innerHTML = source
		return t.content
	}

  static getHtml(cfg, data) {
    let retVal = this.getIntro(cfg)
    for (let [key, val] of data[0]) {
      retVal += `<option value="${key}">${val}</option>`
    }
    return retVal+this.getOutro()
  }

  static getIntro(cfg) {
    let m = ""
    if(cfg.hasOwnProperty("ismultiselect")) {
      m += "multiple data-ecl-select-multiple "
      m += "data-ecl-select-all='Select&#x20;all' "
    }

    return `
    <div class="ecl-select__container ecl-select__container--m">
    <select
    class="ecl-select"
    ${m}
    data-ecl-select-default="Select&#x20;an&#x20;item "
    ${cfg.hasOwnProperty("closeenabled")?"data-ecl-select-close='Close' ":""}
    ${cfg.hasOwnProperty("clearallenabled")?"data-ecl-select-clear-all='Clear&#x20;all' ":""}
    >`
   
   /*
   data-ecl-select-search="Enter&#x20;keyword" 
   data-ecl-select-no-results="No&#x20;results&#x20;found" 
   */

  }

  static getOutro() {
    return `</select>
    <div class="ecl-select__icon"><svg class="ecl-icon ecl-icon--s ecl-icon--rotate-180 ecl-select__icon-shape"
    focusable="false" aria-hidden="true">
    <use xlink:href="/redist/ecl/icons.svg#corner-arrow"></use>
    </svg></div></div>
    `
  }

}