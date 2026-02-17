// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">Introduction</a></li><li class="chapter-item expanded "><a href="getting-started/index.html"><strong aria-hidden="true">1.</strong> Getting Started</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="getting-started/installation.html"><strong aria-hidden="true">1.1.</strong> Installation</a></li><li class="chapter-item expanded "><a href="getting-started/first-steps.html"><strong aria-hidden="true">1.2.</strong> First Steps with Cargo</a></li></ol></li><li class="chapter-item expanded "><a href="guide/index.html"><strong aria-hidden="true">2.</strong> Cargo Guide</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="guide/why-cargo-exists.html"><strong aria-hidden="true">2.1.</strong> Why Cargo Exists</a></li><li class="chapter-item expanded "><a href="guide/creating-a-new-project.html"><strong aria-hidden="true">2.2.</strong> Creating a New Package</a></li><li class="chapter-item expanded "><a href="guide/working-on-an-existing-project.html"><strong aria-hidden="true">2.3.</strong> Working on an Existing Package</a></li><li class="chapter-item expanded "><a href="guide/dependencies.html"><strong aria-hidden="true">2.4.</strong> Dependencies</a></li><li class="chapter-item expanded "><a href="guide/project-layout.html"><strong aria-hidden="true">2.5.</strong> Package Layout</a></li><li class="chapter-item expanded "><a href="guide/cargo-toml-vs-cargo-lock.html"><strong aria-hidden="true">2.6.</strong> Cargo.toml vs Cargo.lock</a></li><li class="chapter-item expanded "><a href="guide/tests.html"><strong aria-hidden="true">2.7.</strong> Tests</a></li><li class="chapter-item expanded "><a href="guide/continuous-integration.html"><strong aria-hidden="true">2.8.</strong> Continuous Integration</a></li><li class="chapter-item expanded "><a href="guide/build-cache.html"><strong aria-hidden="true">2.9.</strong> Build Cache</a></li></ol></li><li class="chapter-item expanded "><a href="reference/index.html"><strong aria-hidden="true">3.</strong> Cargo Reference</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="reference/specifying-dependencies.html"><strong aria-hidden="true">3.1.</strong> Specifying Dependencies</a></li><li class="chapter-item expanded "><a href="reference/manifest.html"><strong aria-hidden="true">3.2.</strong> The Manifest Format</a></li><li class="chapter-item expanded "><a href="reference/config.html"><strong aria-hidden="true">3.3.</strong> Configuration</a></li><li class="chapter-item expanded "><a href="reference/environment-variables.html"><strong aria-hidden="true">3.4.</strong> Environment Variables</a></li><li class="chapter-item expanded "><a href="reference/build-scripts.html"><strong aria-hidden="true">3.5.</strong> Build Scripts</a></li><li class="chapter-item expanded "><a href="reference/publishing.html"><strong aria-hidden="true">3.6.</strong> Publishing on crates.io</a></li><li class="chapter-item expanded "><a href="reference/pkgid-spec.html"><strong aria-hidden="true">3.7.</strong> Package ID Specifications</a></li><li class="chapter-item expanded "><a href="reference/source-replacement.html"><strong aria-hidden="true">3.8.</strong> Source Replacement</a></li><li class="chapter-item expanded "><a href="reference/external-tools.html"><strong aria-hidden="true">3.9.</strong> External Tools</a></li><li class="chapter-item expanded "><a href="reference/unstable.html"><strong aria-hidden="true">3.10.</strong> Unstable Features</a></li></ol></li><li class="chapter-item expanded "><a href="faq.html"><strong aria-hidden="true">4.</strong> FAQ</a></li><li class="chapter-item expanded "><a href="appendix/glossary.html"><strong aria-hidden="true">5.</strong> Appendix: Glossary</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
