// Store ALL banjos here so search can access them
let allBanjos = [];

// Load and display all banjos
fetch('banjos.json')
    .then(response => response.json())
    .then(banjos => {
        allBanjos = banjos;
        renderBanjos(banjos);
    });

// Draw banjo cards on the page
function renderBanjos(banjos) {
    const grid = document.getElementById('banjo-grid');
    grid.innerHTML = '';

    banjos.forEach(banjo => {
        const card = document.createElement('div');
        card.className = 'banjo-card';

        // Build image gallery if photos exist
        let imageSection = '';
        if (banjo.images && banjo.images.length > 0) {
            imageSection = `
                <div class="banjo-image-main">
                    <img src="${banjo.images[0]}" alt="${banjo.name}" class="main-photo">
                </div>
                <div class="thumbnail-row">
                    ${banjo.images.map((img, index) => `
                        <img src="${img}" class="thumbnail" onclick="changePhoto('${img}')" alt="Photo ${index+1}">
                    `).join('')}
                </div>
            `;
        } else {
            imageSection = `<div class="banjo-image">🎵</div>`;
        }

        card.innerHTML = `
            ${imageSection}
            <div class="banjo-info">
                <div class="banjo-name">${banjo.name}</div>
                <div class="banjo-year">Made: ${banjo.year}</div>
                <div class="banjo-desc">${banjo.description}</div>
                ${banjo.forSale 
                    ? `<div class="price-tag">£${banjo.price}</div>`
                    : `<div class="not-for-sale">📖 Permanent Collection</div>`
                }
            </div>
        `;

        grid.appendChild(card);
    });
}

// Search function — filters as you type!
document.addEventListener('input', function(e) {
    if (e.target.id === 'search-bar') {
        const query = e.target.value.toLowerCase().trim();

        const filtered = allBanjos.filter(banjo => {
            return (
                banjo.name.toLowerCase().includes(query) ||
                String(banjo.year).includes(query) ||
                banjo.description.toLowerCase().includes(query)
            );
        });

        renderBanjos(filtered);
    }
});

// Swap main photo when clicking thumbnail
function changePhoto(src) {
    document.querySelectorAll('.main-photo').forEach(mainImg => {
        mainImg.src = src;
    });
}