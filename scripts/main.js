const wikiParser = new WikiParser();
let currentPage = 'Main Page';

async function loadPage(pageName) {
    const loadingDiv = document.getElementById('loading');
    const contentDiv = document.getElementById('wikiContent');
    
    loadingDiv.style.display = 'block';
    contentDiv.style.display = 'none';

    try {
        const { title, content } = await wikiParser.loadPage(pageName);
        document.title = `${title} - UOF Wiki Viewer`;
        contentDiv.innerHTML = `<h1>${title}</h1>${content}`;
        currentPage = pageName;
        
        // Update URL without reloading
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('page', encodeURIComponent(pageName));
        window.history.pushState({}, '', newUrl);
    } catch (error) {
        console.error('Error loading page:', error);
        contentDiv.innerHTML = `
            <h1>Error</h1>
            <p>Error loading page: ${pageName}</p>
            <p>Details: ${error.message}</p>
        `;
    }

    loadingDiv.style.display = 'none';
    contentDiv.style.display = 'block';
}

async function initializeWiki() {
    // Load page list
    const pageListDiv = document.getElementById('pageList');
    pageListDiv.innerHTML = 'Loading page list...';

    try {
        const pages = await wikiParser.loadAllPages();
        
        // Create alphabetically sorted list of pages
        const pageLinks = pages
            .sort((a, b) => a.title.localeCompare(b.title))
            .map(page => `<div><a href="#" onclick="loadPage('${encodeURIComponent(page.title)}'); return false;">${page.title}</a></div>`)
            .join('');
        
        pageListDiv.innerHTML = pageLinks;

        // Check if there's a page parameter in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const pageToLoad = urlParams.get('page') || 'Main Page';

        // Load the specified page
        await loadPage(decodeURIComponent(pageToLoad));
    } catch (error) {
        console.error('Error initializing wiki:', error);
        pageListDiv.innerHTML = '<p>Error loading page list. Please refresh the page.</p>';
    }
}

// Handle browser back/forward buttons
window.onpopstate = function(event) {
    const urlParams = new URLSearchParams(window.location.search);
    const pageToLoad = urlParams.get('page') || 'Main Page';
    loadPage(decodeURIComponent(pageToLoad));
};

// Initialize when the page loads
window.addEventListener('load', initializeWiki);