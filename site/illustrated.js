(function () {
	"use strict";

	let ill = {};

	// viewports etc

	ill.elementIsVisible = function(el) {
		let rect = el.getBoundingClientRect(),
			viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
		return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
	};

	ill.ensureElementInView = function(el) {
		if (!ill.elementIsVisible(el)) {
			el.scrollIntoView({behavior: "smooth"});
		}
	};

	// events

	ill.unselectAllRecords = function() {
		[].forEach.call(document.querySelectorAll(".illustrated .record.selected, .illustrated .calculation.selected"),
		function(el) {
			el.classList.remove("selected");
		});
	};

	ill.toggleRecord = function(element, event) {
		let selected = element.classList.contains("selected");
		ill.unselectAllRecords();
		if (!selected) {
			element.classList.add("selected");
		} else {
			ill.closeAllCode();
		}
		ill.cancel(event);
		ill.ensureElementInView(element);
	};

	ill.selectRecord = function(element, event) {
		ill.unselectAllRecords();
		element.classList.add("selected");
		ill.cancel(event);
		ill.ensureElementInView(element);
	};

	ill.showCode = function(element, event) {
		element.parentNode.classList.add("show");
		ill.cancel(event);
	};

	ill.closeAllCode = function() {
		[].forEach.call(document.querySelectorAll("codesample.show"), function(el) {
			el.classList.remove("show");
		});
	};

	ill.toggleAnnotate = function(el) {
		el.classList.toggle("annotate");
	};

	ill.cancel = function(event) {
		if (event) { event.stopPropagation(); }
	};

	// injections

	ill.addShowCode = function(el) {
		el.innerHTML = document.getElementById("showCodeTmpl").innerHTML + el.innerHTML;
	};

	ill.addToggleAnnotations = function(record) {
		let expl = record.querySelector(".rec-explanation"),
			copy = document.getElementById("annotateTmpl").cloneNode(true);
		expl.insertAdjacentElement("afterend", copy);
	};

	ill.injectLabels = function() {
		let els = document.querySelectorAll(".string > .explanation, .decryption > .explanation");
		[].forEach.call(els, function(expl) {
			let label = expl.parentNode.querySelector(".label"),
				h4 = document.createElement("h4");
			h4.appendChild(document.createTextNode(label.textContent));
			expl.insertAdjacentElement("afterbegin", h4);
		});
	};

	ill.printMode = function() {
		// add printmode css
		let inject = document.createElement("link");
		inject.setAttribute("rel", "stylesheet");
		inject.setAttribute("href", "printmode.css");
		document.head.appendChild(inject);
		// open everything up
		[].forEach.call(document.querySelectorAll(".record, .calculation"), function(el){
			el.classList.add("selected");
			el.classList.add("annotate");
		});
		[].forEach.call(document.querySelectorAll("codesample"), function(el){
			el.classList.add("show");
		});
		[].forEach.call(document.querySelectorAll("*"), function(el) {
			el.onclick = null;
		});
	};


	window.onload = function() {
		[].forEach.call(document.querySelectorAll(".record, .calculation"), function(el) {
			el.onclick = function(event) {
				if (el === event.target && event.offsetY < 60) {
					ill.toggleRecord(el, event);
				} else {
					ill.selectRecord(el, event);
				}
			};
		});
		[].forEach.call(document.querySelectorAll(".rec-label"), function(el) {
			el.onclick = function(event) {
				ill.toggleRecord(el.parentNode, event);
			};
		});
		[].forEach.call(document.querySelectorAll(".record"), function(el) {
			ill.addToggleAnnotations(el);
		});
		[].forEach.call(document.querySelectorAll("codesample"), function(el) {
			ill.addShowCode(el);
		});
		ill.injectLabels();
	};

	window.onkeyup = function(e) {
		let els;
		if (e.keyCode === 27) {
			els = document.querySelectorAll(".record.annotate");
			if (els.length) {
				[].forEach.call(els, function(rec) { rec.classList.remove("annotate"); });
			} else {
				ill.unselectAllRecords();
			}
		}
	};

	window.ill = ill;
})();
