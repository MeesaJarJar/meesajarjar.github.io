class WikiParser {
    constructor() {
        this.imageBasePath = '/WIKIIMAGES/';
        this.wikiBasePath = '/WIKIPAGES/';
    }

    sanitizePageName(pageName) {
        // First, handle special characters that need to be preserved in the filename
        return pageName.replace(/[&]/g, 'and')
                      .replace(/[?]/g, '')
                      .replace(/[#]/g, '')
                      .replace(/[+]/g, 'plus')
                      .replace(/[/]/g, '-')
                      .replace(/[:]/g, '-')
                      .replace(/[%]/g, '')
                      .replace(/\s+/g, ' '); // normalize spaces
    }

    sanitizeFileName(pageName) {
        // This is for actual file lookups
        return encodeURIComponent(this.sanitizePageName(pageName));
    }

    parseImageParams(paramsString) {
        const params = {
            filename: '',
            caption: '',
            options: []
        };

        const parts = paramsString.split('|');
        params.filename = parts[0].trim();

        // Process remaining parameters
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i].trim();
            
            // Known image options
            if (['thumb', 'frame', 'frameless', 'border', 'center', 'right', 'left'].includes(part.toLowerCase())) {
                params.options.push(part.toLowerCase());
            } else if (part.match(/^[0-9]+px$/)) {
                params.options.push(part); // Width specification
            } else {
                // If it's not a known option, treat it as part of the caption
                params.caption += (params.caption ? ' ' : '') + part;
            }
        }

        return params;
    }

    parseWikiText(wikiText) {
        if (!wikiText) return '';
        
        // Replace headings
        wikiText = wikiText.replace(/={6}(.*?)={6}/g, '<h6>$1</h6>');
        wikiText = wikiText.replace(/={5}(.*?)={5}/g, '<h5>$1</h5>');
        wikiText = wikiText.replace(/={4}(.*?)={4}/g, '<h4>$1</h4>');
        wikiText = wikiText.replace(/={3}(.*?)={3}/g, '<h3>$1</h3>');
        wikiText = wikiText.replace(/={2}(.*?)={2}/g, '<h2>$1</h2>');

        // Replace basic formatting
        wikiText = wikiText.replace(/'''(.*?)'''/g, '<strong>$1</strong>');
        wikiText = wikiText.replace(/''(.*?)''/g, '<em>$1</em>');

        // Handle lists
        wikiText = wikiText.replace(/^\*(.*?)$/gm, '<li>$1</li>');
        wikiText = wikiText.replace(/(<li>.*?<\/li>)\n(?!<li>)/g, '$1</ul>');
        wikiText = wikiText.replace(/(?<!<\/ul>)\n<li>/g, '<ul><li>');

        // Replace links and images
        wikiText = wikiText.replace(/\[\[File:(.*?)\]\]/g, (match, content) => {
            const params = this.parseImageParams(content);
            const imageClasses = ['wiki-image'];
            let style = '';

            // Apply options
            if (params.options.includes('thumb') || params.options.includes('frame')) {
                imageClasses.push('thumb');
            }
            if (params.options.includes('center')) {
                imageClasses.push('center');
            } else if (params.options.includes('right')) {
                imageClasses.push('right');
            } else if (params.options.includes('left')) {
                imageClasses.push('left');
            }

            // Handle width
            const widthMatch = params.options.find(opt => opt.match(/^[0-9]+px$/));
            if (widthMatch) {
                style = `style="max-width: ${widthMatch};"}`;
            }

            return `<figure class="${imageClasses.join(' ')}" ${style}>
                <a href="${this.imageBasePath}${this.sanitizeFileName(params.filename)}" target="_blank">
                    <img src="${this.imageBasePath}${this.sanitizeFileName(params.filename)}" 
                         alt="${params.caption}">
                </a>
                ${params.caption ? `<figcaption>${params.caption}</figcaption>` : ''}
            </figure>`;
        });

        // Replace internal links
        wikiText = wikiText.replace(/\[\[(.*?)\]\]/g, (match, link) => {
            const parts = link.split('|');
            const target = parts[0].trim();
            const text = parts.length > 1 ? parts[1] : target;
            
            // Remove any category links
            if (target.startsWith('Category:')) {
                return '';
            }

            // Handle section links
            const [pageName, section] = target.split('#');
            const displayText = text.replace(/'''(.*?)'''/g, '<strong>$1</strong>')
                                  .replace(/''(.*?)''/g, '<em>$1</em>');

            return `<a href="#" onclick="loadPage('${this.sanitizePageName(pageName)}'); return false;">${displayText}</a>`;
        });

        // Replace line breaks
        wikiText = wikiText.replace(/\n\n/g, '</p><p>');

        // Clean up any remaining newlines
        wikiText = wikiText.replace(/\n/g, ' ');

        // Wrap in paragraphs if not already wrapped
        if (!wikiText.startsWith('<')) {
            wikiText = '<p>' + wikiText + '</p>';
        }

        return wikiText;
    }

    async loadPage(pageName) {
        try {
            // Remove any URL encoding from the incoming page name
            const decodedName = decodeURIComponent(pageName);
            // Sanitize for file lookup
            const sanitizedName = this.sanitizePageName(decodedName);
            
            console.log('Loading page:', sanitizedName);
            
            const response = await fetch(`${this.wikiBasePath}${this.sanitizeFileName(sanitizedName)}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Extract the actual wiki text from the MediaWiki API format
            const page = Object.values(data.query.pages)[0];
            const wikiText = page.revisions[0]['*'];
            
            return {
                title: page.title,
                content: this.parseWikiText(wikiText)
            };
        } catch (error) {
            console.error('Error loading page:', error);
            const errorMessage = error.message || 'Unknown error';
            return {
                title: 'Error',
                content: `<p>Error loading page: ${pageName}</p>
                         <p>Details: ${errorMessage}</p>
                         <p>Try checking if the page name matches exactly with the file name in the WIKIPAGES directory.</p>`
            };
        }
    }

    async loadAllPages() {
        try {
            const response = await fetch('/WIKIPAGES/all_pages.csv');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csv = await response.text();
            
            // Parse CSV (skip header)
            const lines = csv.split('\n').slice(1);
            return lines
                .map(line => {
                    if (!line.trim()) return null;
                    const [id, ns, title] = line.split(',');
                    return { 
                        id, 
                        title: title ? title.trim() : null,
                        sanitizedTitle: title ? this.sanitizePageName(title.trim()) : null
                    };
                })
                .filter(page => page && page.title); // Remove empty entries
        } catch (error) {
            console.error('Error loading page list:', error);
            return [];
        }
    }
}