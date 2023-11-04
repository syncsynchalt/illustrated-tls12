(() => {
    "use strict";

    let ill = {
        anchors: {}
    };

    // viewports etc

    ill.elementIsVisible = (el) => {
        let rect = el.getBoundingClientRect(),
            viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    };

    ill.ensureElementInView = (el) => {
        if (!ill.elementIsVisible(el)) {
            el.scrollIntoView({behavior: "smooth"});
        }
    };

    // events

    ill.unselectAllRecords = () => {
        [].forEach.call(document.querySelectorAll(".illustrated .record.selected, .illustrated .calculation.selected"),
        (el) => {
            el.classList.remove("selected");
        });
        ill.normalizeOpenCloseAll();
    };

    ill.toggleRecord = (element, event) => {
        ill.cancel(event);
        if (!element.classList.contains('selected')) {
            element.classList.add("selected");
            if (event) { ill.changeHash(element.dataset.anchor); }
            ill.ensureElementInView(element);
        } else {
            element.classList.remove("selected");
            ill.closeAllCode();
            if (event) { ill.changeHash(""); }
        }
        ill.normalizeOpenCloseAll();
    };

    ill.selectRecord = (element, event) => {
        ill.unselectAllRecords();
        element.classList.add("selected");
        if (event) { ill.changeHash(element.dataset.anchor); }
        ill.cancel(event);
        ill.ensureElementInView(element);
    };

    ill.showCode = (element, event) => {
        element.parentNode.classList.add("show");
        ill.cancel(event);
    };

    ill.closeAllCode = () => {
        [].forEach.call(document.querySelectorAll("codesample.show"), (el) => {
            el.classList.remove("show");
        });
    };

    ill.getAncestorAnchor = (el) => {
        while (el && !el.dataset.anchor) {
            el = el.parentElement;
        }
        return el?.dataset?.anchor;
    };

    ill.toggleAnnotate = (el, event) => {
        let anchor = ill.getAncestorAnchor(el);
        if (el.classList.toggle("annotate")) {
            anchor = `${anchor}/annotated`;
        }
        if (event) { ill.changeHash(anchor); }
        ill.cancel(event);
    };

    ill.cancel = (event) => {
        if (event) { event.stopPropagation(); }
    };

    // injections

    ill.addShowCode = (el) => {
        el.innerHTML = document.getElementById("showCodeTmpl").innerHTML + el.innerHTML;
    };

    function htmlToElement(html) {
        let outer = document.createElement("template");
        outer.innerHTML = html.trim();
        return outer.content.firstChild;
    }

    ill.addAnchors = (record) => {
        let label = record.getElementsByClassName("rec-label");
        label = label && label[0].textContent;
        let count = 1;
        if (label) {
            label = label.toLowerCase().replaceAll(/[^a-z\d]/g, "-");
            while (ill.anchors[label]) {
                label = label.replaceAll(/-\d+$/g, "");
                label = `${label}-${++count}`;
            }
            record.dataset.anchor = label;
            ill.anchors[label] = record;
            ill.anchors[`${label}/annotated`] = record;
            record.insertBefore(
                htmlToElement(`<a class="no-show" href="#${label}/annotated"></a>`), record.firstChild);
            record.insertBefore(
                htmlToElement(`<a class="no-show" href="#${label}"></a>`), record.firstChild);
        }
    };

    ill.resolveHash = () => {
        let hash = window.location.hash.replace(/^#/, "");
        if (hash === 'open-all') {
            let btn = document.getElementById('openCloseAll');
            if (btn) btn.click();
        }
        const rec = ill.anchors[hash];
        if (!rec) {
            return;
        }
        ill.selectRecord(rec, null);
        if (hash.endsWith("/annotated")) {
            const b = rec.getElementsByClassName("annotate-toggle");
            if (b && b.length) {
                ill.toggleAnnotate(b[0].parentElement);
            }
        }
    };

    ill.addToggleAnnotations = (record) => {
        let expl = record.querySelector(".rec-explanation"),
            copy = document.getElementById("annotateTmpl").cloneNode(true);
        // noinspection JSCheckFunctionSignatures
        expl.insertAdjacentElement("afterend", copy);
    };

    ill.injectLabels = () => {
        let els = document.querySelectorAll(".string > .explanation, .decryption > .explanation");
        [].forEach.call(els, (expl) => {
            let label = expl.parentNode.querySelector(".label"),
                h4 = document.createElement("h4");
            h4.appendChild(document.createTextNode(label.textContent));
            expl.insertAdjacentElement("afterbegin", h4);
        });
    };

    /**
     * Open or close all elements on the page
     * @param {string} openOrClose - "open" or "close"
     */
    let actionAll = (openOrClose) => {
        let classOperation = openOrClose === 'open' ? document.body.classList.add : document.body.classList.remove;
        [].forEach.call(document.querySelectorAll(".record, .calculation"), (el) => {
            classOperation.call(el.classList, "selected", "annotate");
        });
        [].forEach.call(document.querySelectorAll("codesample"), (el) => {
            classOperation.call(el.classList, "show");
        });
        if (openOrClose !== 'open') {
            ill.closeAllCode();
        };
    };

    ill.openCloseAll = (btn, event) => {
        ill.cancel(event);
        btn = btn || document.getElementById('openCloseAll');
        if (!btn) return;

        let action = btn.dataset['lblState'];
        actionAll(action);
        let nextState = action === 'open' ? 'close' : 'open';
        ill.changeHash(action === 'open' ? 'open-all' : '');
        ill.normalizeOpenCloseAll();
    };

    ill.normalizeOpenCloseAll = () => {
        let allCount = document.querySelectorAll('.record, .calculation').length;
        let openCount = document.querySelectorAll('.record.selected, .calculation.selected').length;
        let closedCount = allCount - openCount;

        let newButtonState = 'open';
        if (closedCount === 0) {
            newButtonState = 'close';
        }

        let btn = document.getElementById('openCloseAll');
        if (btn && btn.dataset['lblState'] !== newButtonState) {
            // swap text w/ lbl-toggle, then swap state
            let tmp = btn.textContent;
            btn.textContent = btn.dataset['lblToggle'];
            btn.dataset['lblToggle'] = tmp;
            btn.dataset['lblState'] = newButtonState;
        }
    };

    ill.printMode = () => {
        // add printmode css
        let inject = document.createElement("link");
        inject.setAttribute("rel", "stylesheet");
        inject.setAttribute("href", "printmode.css");
        document.head.appendChild(inject);
        actionAll('open');
        [].forEach.call(document.querySelectorAll("*"), (el) => {
            el.onclick = null;
        });
    };

    ill.changeHash = (hash) => {
        let href = window.location.href.replace(/#.*/, "");
        if (hash) {
            window.history.replaceState({}, "", `${href}#${hash}`);
        } else {
            window.history.replaceState({}, "", `${href}`);
        }
    };

    window.onload = () => {
        [].forEach.call(document.querySelectorAll(".record, .calculation"), (el) => {
            ill.addAnchors(el);
            el.onclick = (event) => {
                ill.toggleRecord(el, event);
            };
        });
        [].forEach.call(document.querySelectorAll(".rec-label"), (el) => {
            el.onclick = (event) => {
                ill.toggleRecord(el.parentNode, event);
            };
        });
        [].forEach.call(document.querySelectorAll(".record"), (el) => {
            ill.addToggleAnnotations(el);
        });
        [].forEach.call(document.querySelectorAll("codesample"), (el) => {
            ill.addShowCode(el);
        });
        ill.injectLabels();
        ill.resolveHash();
    };

    window.onkeyup = (e) => {
        let els;
        if (e.keyCode === 27) {
            els = document.querySelectorAll(".record.annotate");
            if (els.length) {
                [].forEach.call(els, (rec) => { rec.classList.remove("annotate"); });
            } else {
                ill.unselectAllRecords();
            }
        }
    };

    window.ill = ill;
})();
