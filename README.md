# UO Replaced Artwork Gallery

A simple, elegant gallery website to showcase custom Ultima Online artwork replacements.

## ?? Features

- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Image Lightbox** - Click on any image to view it in full size
- **Organized by Folders** - Artwork is grouped by type/ID
- **Modern UI** - Clean and professional interface
- **GitHub Pages Ready** - Deployable directly to GitHub Pages

## ?? Project Structure

```
meesajarjar.github.io/
??? index.html              # Main HTML file
??? styles.css              # Styling
??? script.js               # JavaScript for gallery functionality
??? package.json            # Project metadata
??? README.md               # This file
??? UOReplacedArtwork/      # Artwork folders
    ??? 0x0D97/             # Example folder with PNG files
        ??? MeesaJarJar_Trees_Type_0x0D97_LOWRES_00001_.png
        ??? MeesaJarJar_Trees_Type_0x0D97_LOWRES_00002_.png
        ??? ...
```

## ?? Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/MeesaJarJar/meesajarjar.github.io.git
   cd meesajarjar.github.io
   ```

2. **Serve locally**
   
   Option A - Using Node.js:
   ```bash
   npm start
   ```
   
   Option B - Using Python:
   ```bash
   python -m http.server 8080
   ```
   
   Option C - Using PHP (if you have XAMPP):
   Just navigate to `http://localhost/meesajarjar.github.io/` in your browser

3. **Open in browser**
   Navigate to `http://localhost:8080`

### Adding More Artwork Folders

To add more artwork folders to the gallery, edit `script.js` and add entries to the `galleryData.folders` array:

```javascript
const galleryData = {
    folders: [
        {
            id: '0x0D97',
            name: 'Trees Type 0x0D97',
            path: '0x0D97'
        },
        {
            id: '0xABCD',           // New folder ID
            name: 'New Artwork Type', // Display name
            path: '0xABCD'           // Folder path in UOReplacedArtwork/
        }
    ]
};
```

## ?? GitHub Pages Deployment

The site is automatically deployed to GitHub Pages when you push to the `main` branch.

Visit: **https://meesajarjar.github.io**

## ?? Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --background-color: #ecf0f1;
    /* ... */
}
```

### Modifying the Layout

- **Grid columns**: Adjust `grid-template-columns` in `.image-grid` class
- **Image height**: Change `height` in `.image-item img` class
- **Spacing**: Modify `gap` properties in grid layouts

## ??? Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with Grid and Flexbox
- **Vanilla JavaScript** - Gallery functionality
- **No frameworks** - Lightweight and fast

## ?? License

MIT License - Feel free to use this for your own projects!

## ?? Author

**MeesaJarJar**
- GitHub: [@MeesaJarJar](https://github.com/MeesaJarJar)

## ?? About Ultima Online Artwork

This gallery showcases custom artwork replacements for Ultima Online, enhancing the visual experience of this classic MMORPG.
