// Configuration
const ARTWORK_BASE_PATH = './UOReplacedArtwork/';

// Gallery data structure
const galleryData = {
    folders: [
        {
            id: '0x0D97',
            name: 'Trees Type 0x0D97',
            path: '0x0D97'
        }
        // Add more folders here as needed
    ]
};

// Initialize the gallery
document.addEventListener('DOMContentLoaded', async () => {
    const galleryElement = document.getElementById('gallery');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    try {
        // Load artwork for each folder
        for (const folder of galleryData.folders) {
            await loadFolderArtwork(folder, galleryElement);
        }
        
        loadingElement.style.display = 'none';
        
        if (galleryElement.children.length === 0) {
            errorElement.textContent = 'No artwork found. Please check the folder structure.';
            errorElement.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
        loadingElement.style.display = 'none';
        errorElement.textContent = 'Error loading artwork. Please refresh the page.';
        errorElement.style.display = 'block';
    }

    // Setup lightbox
    setupLightbox();
});

// Load artwork from a specific folder
async function loadFolderArtwork(folder, galleryElement) {
    const folderPath = `${ARTWORK_BASE_PATH}${folder.path}/`;
    
    // Try to get images from the folder
    const images = await discoverImages(folderPath);
    
    if (images.length === 0) {
        console.warn(`No images found in ${folderPath}`);
        return;
    }

    // Create folder section
    const folderSection = document.createElement('div');
    folderSection.className = 'folder-section';
    folderSection.setAttribute('data-folder-id', folder.id);

    // Folder header
    const folderHeader = document.createElement('div');
    folderHeader.className = 'folder-header';
    folderHeader.innerHTML = `
        <h2 class="folder-name">${folder.name}</h2>
        <p class="image-count">${images.length} image${images.length !== 1 ? 's' : ''}</p>
    `;
    folderSection.appendChild(folderHeader);

    // Image grid
    const imageGrid = document.createElement('div');
    imageGrid.className = 'image-grid';

    images.forEach(imageName => {
        const imageItem = createImageItem(folderPath, imageName);
        imageGrid.appendChild(imageItem);
    });

    folderSection.appendChild(imageGrid);
    galleryElement.appendChild(folderSection);
}

// Create an image item element
function createImageItem(folderPath, imageName) {
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';

    const img = document.createElement('img');
    img.src = `${folderPath}${imageName}`;
    img.alt = imageName;
    img.loading = 'lazy';
    
    // Handle image load errors
    img.onerror = function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImage not found%3C/text%3E%3C/svg%3E';
    };

    const imageName_div = document.createElement('div');
    imageName_div.className = 'image-name';
    imageName_div.textContent = imageName;
    imageName_div.title = imageName;

    imageItem.appendChild(img);
    imageItem.appendChild(imageName_div);

    // Add click event for lightbox
    imageItem.addEventListener('click', () => {
        openLightbox(`${folderPath}${imageName}`, imageName);
    });

    return imageItem;
}

// Discover images in a folder (for GitHub Pages, we need to know the filenames)
async function discoverImages(folderPath) {
    // Since we're on GitHub Pages, we can't dynamically list directory contents
    // We'll try to load known images or you can manually list them here
    
    // For 0x0D97 folder, let's try common patterns
    const images = [];
    
    // Try to load up to 100 images with common naming pattern
    for (let i = 1; i <= 100; i++) {
        const paddedNum = String(i).padStart(5, '0');
        const imageName = `MeesaJarJar_Trees_Type_0x0D97_LOWRES_${paddedNum}_.png`;
        
        // Check if image exists
        const exists = await checkImageExists(`${folderPath}${imageName}`);
        if (exists) {
            images.push(imageName);
        }
    }
    
    return images;
}

// Check if an image exists
function checkImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// Lightbox functionality
function setupLightbox() {
    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <div class="lightbox-content">
            <img id="lightbox-img" src="" alt="">
            <div class="lightbox-caption" id="lightbox-caption"></div>
        </div>
    `;
    document.body.appendChild(lightbox);

    // Close lightbox events
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

function openLightbox(imageSrc, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}
