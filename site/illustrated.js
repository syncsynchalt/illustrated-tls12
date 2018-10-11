ill = {
	// viewports etc

	elementIsVisible: function(el) {
		var rect = el.getBoundingClientRect(),
			viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
		return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
	},

	ensureElementInView: function(el) {
		if (!ill.elementIsVisible(el)) {
			el.scrollIntoView({behavior: 'smooth'});
		}
	},

	// events

	unselectAllRecords: function() {
		[].forEach.call(document.querySelectorAll(".record.selected, .calculation.selected"), function(el) {
			el.classList.remove("selected");
		});
	},

	toggleRecord: function(element, event) {
		var selected = element.classList.contains("selected");
		ill.unselectAllRecords();
		if (!selected) {
			element.classList.add("selected");
		} else {
			ill.closeAllCode();
		}
		if (event) { event.stopPropagation(); }
		ill.ensureElementInView(element);
	},

	selectRecord: function(element, event) {
		ill.unselectAllRecords();
		element.classList.add("selected");
		if (event) { event.stopPropagation(); }
		ill.ensureElementInView(element);
	},

	showCode: function(element, event) {
		element.parentNode.classList.add("show");
		if (event) { event.stopPropagation(); }
	},

	closeAllCode: function() {
		[].forEach.call(document.querySelectorAll("codesample.show"), function(el) {
			el.classList.remove("show");
		});
	},

	toggleAnnotate: function(el) {
		el.classList.toggle("annotate");
	},

	cancel: function(event) {
		if (event) { event.stopPropagation(); }
	},

	// injections

	addShowCode: function(el) {
		el.innerHTML = document.getElementById('showCodeTmpl').innerHTML + el.innerHTML;
	},

	addToggleAnnotations: function(record) {
		var expl = record.querySelector(".explanation"),
			copy = document.getElementById("annotateTmpl").cloneNode(true);
		expl.insertAdjacentElement("afterend", copy);
	},

	injectLabels: function() {
		var els = document.querySelectorAll(".string > .explanation, .decryption > .explanation");
		[].forEach.call(els, function(expl) {
			var label = expl.parentNode.querySelector(".label"),
				h4 = document.createElement("h4");
			h4.appendChild(document.createTextNode(label.textContent));
			expl.insertAdjacentElement("afterbegin", h4);
		});
	}
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
	[].forEach.call(document.querySelectorAll(".record > .label, .calculation > .label"), function(el) {
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
	var els;
	if (e.keyCode === 27) {
		els = document.querySelectorAll(".record.annotate");
		if (els.length) {
			[].forEach.call(els, function(rec) { rec.classList.remove("annotate"); });
		} else {
			ill.unselectAllRecords();
		}
	}
};
