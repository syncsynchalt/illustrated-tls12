ill = {
	unselectAllRecords: function() {
		var el = document.getElementsByClassName("selected-record"),
			i;
		for (i = 0; i < el.length; i++) {
			el[i].classList.remove("selected-record");
		}
	},

	unselectAllStrings: function() {
		var el = document.getElementsByClassName("selected-string"),
			i;
		for (i = 0; i < el.length; i++) {
			el[i].classList.remove("selected-string");
		}
	},

	selectRecord: function(element, event) {
		ill.unselectAllRecords();
		ill.unselectAllStrings();
		element.classList.add("selected-record");
	},

	selectString: function(element, event) {
		var selected = element.classList.contains("selected-string");
		ill.unselectAllStrings();
		if (!selected) {
			element.classList.add("selected-string");
		}
		event && event.stopPropagation();
	},

	mouseString: function(element, event) {
		ill.unmouseAllStrings();
		element.classList.add("mouseover");
		event && event.stopPropagation();
	},

	unmouseString: function(element, event) {
		ill.unmouseAllStrings();
	},

	unmouseAllStrings() {
		[].forEach.call(document.getElementsByClassName("mouseover"), function(el) {
			el.classList.contains("string") && el.classList.remove("mouseover");
		});
	},

	cancel: function(event) {
		event && event.stopPropagation();
	}
};

window.onload = function() {
	[].forEach.call(document.getElementsByClassName("record"), function(el) {
		el.onclick = function(event) {
			ill.selectRecord(this, event);
		};
	});
	[].forEach.call(document.getElementsByClassName("string"), function(el) {
		el.onclick = function(event) {
			ill.selectString(this, event);
		};
		el.onmouseover = function(event) {
			ill.mouseString(this, event);
		};
		el.onmouseout = function(event) {
			ill.unmouseString(this, event);
		};
	});
	[].forEach.call(document.getElementsByClassName("explanation"), function(el) {
		el.onclick = function(event) {
			ill.cancel(event);
		};
	});
}
