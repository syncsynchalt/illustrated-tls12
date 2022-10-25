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
    };

    ill.toggleRecord = (element, event) => {
        let selected = element.classList.contains("selected");
        ill.unselectAllRecords();
        if (!selected) {
            element.classList.add("selected");
            if (event) { ill.changeHash(element.dataset.anchor); }
        } else {
            ill.closeAllCode();
            if (event) { ill.changeHash(""); }
        }
        ill.cancel(event);
        ill.ensureElementInView(element);
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

    ill.printMode = () => {
        // add printmode css
        let inject = document.createElement("link");
        inject.setAttribute("rel", "stylesheet");
        inject.setAttribute("href", "printmode.css");
        document.head.appendChild(inject);
        // open everything up
        [].forEach.call(document.querySelectorAll(".record, .calculation"), (el) => {
            el.classList.add("selected");
            el.classList.add("annotate");
        });
        [].forEach.call(document.querySelectorAll("codesample"), (el) => {
            el.classList.add("show");
        });
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
                if (el === event.target && event.offsetY < 60) {
                    ill.toggleRecord(el, event);
                } else {
                    ill.selectRecord(el, event);
                }
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
