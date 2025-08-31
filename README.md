# UOF Wiki Viewer

A simple, client-side wiki viewer for browsing MediaWiki content offline. This viewer is specifically designed to display wiki content from JSON files exported from MediaWiki.

## Features

- Display wiki pages from MediaWiki JSON exports
- Render wiki syntax including:
  - Headings
  - Links
  - Images with captions
  - Basic text formatting
  - Lists
- Wikipedia-style formatting and layout
- Mobile-responsive design
- Search functionality
- Navigation sidebar

## Setup

1. Clone this repository
2. Place your wiki content in the following structure:
   ```
   root/
   ??? WIKIPAGES/
   ?   ??? all_pages.csv        # Index of all pages
   ?   ??? *.json              # Wiki page content files
   ??? WIKIIMAGES/
   ?   ??? *                   # Image files referenced in wiki pages
   ??? index.html
   ??? styles/
   ?   ??? mediawiki.css
   ??? scripts/
       ??? wikiparser.js
       ??? main.js
   ```
3. Serve the files using any web server (e.g., Apache, Nginx, or Python's SimpleHTTPServer)

### Quick Start with Python

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

### Quick Start with PHP

```bash
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## File Format

### Page JSON Format
Wiki pages should be in MediaWiki API JSON format:
```json
{
  "query": {
    "pages": {
      "pageId": {
        "pageid": number,
        "ns": number,
        "title": "Page Title",
        "revisions": [
          {
            "contentformat": "text/x-wiki",
            "contentmodel": "wikitext",
            "*": "Wiki content here"
          }
        ]
      }
    }
  }
}
```

### all_pages.csv Format
```csv
pageid,ns,title
1,0,Main Page
2,0,Another Page
```

## Usage

- Click on any page title in the sidebar to load that page
- Use the search box to filter pages
- Click on images to view them full size
- Navigation links within pages will load the corresponding pages

## Browser Support

Works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

MIT License

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request

## Acknowledgments

- Styling based on MediaWiki/Wikipedia CSS
- Designed for offline wiki content viewing