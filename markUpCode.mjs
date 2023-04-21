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
    console.log(cfg, cfg.hasOwnProperty("ismultiselect"))
    return `
    <select
    class="ecl-select"
    ${typeof cfg.ismultiselect!=="undefined"?"multiple data-ecl-select-multiple":""}
    data-ecl-select-default="Select&#x20;an&#x20;item" 
    data-ecl-select-search="Enter&#x20;keyword" 
    data-ecl-select-no-results="No&#x20;results&#x20;found" 
    data-ecl-select-all="Select&#x20;all" 
    data-ecl-select-clear-all="Clear&#x20;all" 
    data-ecl-select-close="Close">`
  }

  static getOutro() {
    return `</select>`
  }

}