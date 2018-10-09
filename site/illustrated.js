ill = {
	unselectAllRecords: function() {
		[].forEach.call(document.querySelectorAll(".record.selected, .calculation.selected"), function(el) {
			el.classList.remove("selected");
		});
	},

	unselectAllStrings: function() {
		[].forEach.call(document.querySelectorAll(".string.selected"), function(el) {
			el.classList.remove("selected");
		});
	},

	toggleRecord: function(element, event) {
		var selected = element.classList.contains("selected");
		ill.unselectAllRecords();
		if (!selected) {
			element.classList.add("selected");
		}
		ill.calculateStringPositions(element);
		event && event.stopPropagation();
	},

	selectRecord: function(element, event) {
		ill.unselectAllRecords();
		element.classList.add("selected");
		ill.calculateStringPositions(element);
		event && event.stopPropagation();
	},

	toggleString: function(element, event) {
		var selected = element.classList.contains("selected");
		ill.unselectAllStrings();
		if (!selected) {
			element.classList.add("selected");
		}
		event && event.stopPropagation();
	},

	cancel: function(event) {
		event && event.stopPropagation();
	},

	addCloseButton: function(el) {
		el.innerHTML = '<span class="close" onclick="ill.unselectAllStrings()">&times;</span>' + el.innerHTML;
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
	[].forEach.call(document.querySelectorAll(".string .bytes, .string .label"), function(el) {
		el.onclick = function(event) {
			ill.toggleString(el.parentNode, event);
		};
	});
	[].forEach.call(document.querySelectorAll(".record > .explanation"), function(el) {
		el.onclick = function(event) {
			ill.cancel(event);
		};
	});
	[].forEach.call(document.querySelectorAll(".string > .explanation"), function(el) {
		ill.addCloseButton(el);
	});
};

window.onkeyup = function(e) {
	if (e.keyCode === 27) {
		ill.unselectAllStrings();
	}
};
