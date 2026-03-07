function showTab(tabId, el) {
    // Hide all tabs
    document.querySelectorAll('.tab-panel').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabId).classList.add('active');

    // Update sidebar active state for main tabs
    if (el) {
        document.querySelectorAll('.sidebar-link.active').forEach(link => {
            link.classList.remove('active');
        });
        el.classList.add('active');
    }

    // Toggle sub-navigation sections based on active tab
    document.getElementById('api-nav').style.display = tabId === 'api' ? 'block' : 'none';
    document.getElementById('user-nav').style.display = tabId === 'user' ? 'block' : 'none';
    document.getElementById('dev-nav').style.display = tabId === 'dev' ? 'block' : 'none';
    document.getElementById('report-nav').style.display = tabId === 'report' ? 'block' : 'none';

    window.scrollTo({ top: 0, behavior: 'instant' });
}

function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function toggle(headerEl) {
    const bodyEl = headerEl.nextElementSibling;
    bodyEl.classList.toggle('open');
}

function filterSidebar(query) {
    const lowered = query.toLowerCase();
    const activeNavId =
        document.getElementById('api-nav').style.display === 'block' ? 'api-nav' :
            document.getElementById('user-nav').style.display === 'block' ? 'user-nav' :
                document.getElementById('dev-nav').style.display === 'block' ? 'dev-nav' :
                    document.getElementById('report-nav').style.display === 'block' ? 'report-nav' : null;

    if (!activeNavId) return;

    const links = document.getElementById(activeNavId).querySelectorAll('.sidebar-link');

    links.forEach(link => {
        const text = link.textContent.toLowerCase();
        if (text.includes(lowered)) {
            link.style.display = 'flex';
        } else {
            link.style.display = 'none';
        }
    });
}
