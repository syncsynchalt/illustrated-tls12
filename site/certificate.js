ill = {
	toggleAnnotate: function(el) {
		el.classList.toggle("annotate");
	},

	cancel: function(event) {
		if (event) { event.stopPropagation(); }
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
	[].forEach.call(document.querySelectorAll(".record"), function(el) {
		ill.addToggleAnnotations(el);
	});
	[].forEach.call(document.querySelectorAll("codesample"), function(el) {
		ill.addShowCode(el);
	});
	ill.injectLabels();
};

window.onkeyup = function(e) {
	if (e.keyCode === 27) {
		ill.unselectAllStrings();
	}
};
