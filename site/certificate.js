ill = {
	unselectAllStrings: function() {
		[].forEach.call(document.querySelectorAll(".string.selected, .decryption.selected"), function(el) {
			el.classList.remove("selected");
		});
	},

	toggleString: function(element, event) {
		var selected = element.classList.contains("selected");
		ill.unselectAllStrings();
		if (!selected) {
			element.classList.add("selected");
		}
		if (event) { event.stopPropagation(); }
	},

	cancel: function(event) {
		if (event) { event.stopPropagation(); }
	},

	addExplanationCloseButton: function(el) {
		el.innerHTML = document.getElementById('closeBtnTmpl').innerHTML + el.innerHTML;
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
	[].forEach.call(document.querySelectorAll(".string .bytes, .string .label, .decryption .label"), function(el) {
		el.onclick = function(event) {
			ill.toggleString(el.parentNode, event);
		};
	});
	[].forEach.call(document.querySelectorAll(".string > .explanation, .decryption > .explanation"), function(el) {
		ill.addExplanationCloseButton(el);
	});
	[].forEach.call(document.querySelectorAll(".record"), function(el) {
		ill.calculateStringPositions(el);
	});
};

window.onkeyup = function(e) {
	if (e.keyCode === 27) {
		ill.unselectAllStrings();
	}
};
