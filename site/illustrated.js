ill = {
	unselectAllRecords: function() {
		[].forEach.call(document.querySelectorAll(".record.selected, .calculation.selected"), function(el) {
			el.classList.remove("selected");
		});
	},

	unselectAllStrings: function() {
		[].forEach.call(document.querySelectorAll(".string.selected, .decryption.selected"), function(el) {
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
		ill.calculateStringPositions(element);
		if (event) { event.stopPropagation(); }
	},

	selectRecord: function(element, event) {
		ill.unselectAllRecords();
		element.classList.add("selected");
		ill.calculateStringPositions(element);
		if (event) { event.stopPropagation(); }
	},

	toggleString: function(element, event) {
		var selected = element.classList.contains("selected");
		ill.unselectAllStrings();
		if (!selected) {
			element.classList.add("selected");
		}
		if (event) { event.stopPropagation(); }
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

	cancel: function(event) {
		if (event) { event.stopPropagation(); }
	},

	addExplanationCloseButton: function(el) {
		el.innerHTML = document.getElementById('closeBtnTmpl').innerHTML + el.innerHTML;
	},

	addShowCode: function(el) {
		el.innerHTML = document.getElementById('showCodeTmpl').innerHTML + el.innerHTML;
	},

	calculateStringPositions: function(record) {
		[].forEach.call(record.querySelectorAll(".string > .explanation"), function(el) {
			var recordData = el.parentElement.parentElement;
			if (el.parentElement.offsetHeight < 60) {
				el.style.top = (el.parentElement.offsetHeight+5) + "px";
			} else {
				el.style.top = "60px";
			}
			el.style.width = (recordData.offsetWidth-30) + "px";
		});
	}
};

window.onload = function() {
	[].forEach.call(document.querySelectorAll(".record, .calculation"), function(el) {
		el.onclick = function(event) {
			ill.selectRecord(el, event);
		};
	});
	[].forEach.call(document.querySelectorAll(".record > .label, .calculation > .label"), function(el) {
		el.onclick = function(event) {
			ill.toggleRecord(el.parentNode, event);
		};
	});
	[].forEach.call(document.querySelectorAll(".string .bytes, .string .label, .decryption .label"), function(el) {
		el.onclick = function(event) {
			ill.toggleString(el.parentNode, event);
		};
	});
	[].forEach.call(document.querySelectorAll(".record > .explanation"), function(el) {
		el.onclick = function(event) {
			ill.cancel(event);
		};
	});
	[].forEach.call(document.querySelectorAll(".string > .explanation, .decryption > .explanation"), function(el) {
		ill.addExplanationCloseButton(el);
	});
	[].forEach.call(document.querySelectorAll("codesample"), function(el) {
		ill.addShowCode(el);
	});
};

window.onkeyup = function(e) {
	if (e.keyCode === 27) {
		ill.unselectAllStrings();
	}
};
