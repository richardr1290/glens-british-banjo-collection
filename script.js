document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".banjo-card").forEach(function (card) {

        const mainImage = card.querySelector(".main-photo");
        const thumbnails = Array.from(card.querySelectorAll(".thumbnail"));

        if (!mainImage || thumbnails.length === 0) return;

        let currentIndex = 0;

        // Thumbnail → main image
        thumbnails.forEach(function (thumbnail, index) {

            thumbnail.addEventListener("click", function () {
                currentIndex = index;
                mainImage.src = thumbnail.src;
            });

        });

        // Main image → lightbox
        mainImage.addEventListener("click", function () {

            const lightbox = document.createElement("div");
            lightbox.className = "image-lightbox";

            const largeImage = document.createElement("img");
            largeImage.src = thumbnails[currentIndex].src;
            largeImage.alt = mainImage.alt;

            // Close button
const closeButton = document.createElement("button");
closeButton.className = "lightbox-close";
closeButton.innerHTML = "&times;";
closeButton.setAttribute("aria-label", "Close image");

            // Previous button
            const previousButton = document.createElement("button");
            previousButton.className = "lightbox-button previous";
            previousButton.innerHTML = "&#10094;";

            // Next button
            const nextButton = document.createElement("button");
            nextButton.className = "lightbox-button next";
            nextButton.innerHTML = "&#10095;";

            closeButton.addEventListener("click", function (event) {
    event.stopPropagation();
    lightbox.remove();
    document.removeEventListener("keydown", keyboardControl);
});

            lightbox.appendChild(largeImage);
lightbox.appendChild(closeButton);
lightbox.appendChild(previousButton);
lightbox.appendChild(nextButton);

            document.body.appendChild(lightbox);

            function showImage(index) {
                currentIndex =
                    (index + thumbnails.length) % thumbnails.length;

                largeImage.src = thumbnails[currentIndex].src;
            }

            previousButton.addEventListener("click", function (event) {
                event.stopPropagation();
                showImage(currentIndex - 1);
            });

            nextButton.addEventListener("click", function (event) {
                event.stopPropagation();
                showImage(currentIndex + 1);
            });

            // Keyboard controls
            function keyboardControl(event) {

                if (event.key === "ArrowLeft") {
                    showImage(currentIndex - 1);
                }

                if (event.key === "ArrowRight") {
                    showImage(currentIndex + 1);
                }

                if (event.key === "Escape") {
                    lightbox.remove();
                    document.removeEventListener(
                        "keydown",
                        keyboardControl
                    );
                }
            }

            document.addEventListener("keydown", keyboardControl);

            // Clicking the dark background closes the lightbox
            lightbox.addEventListener("click", function (event) {

                if (event.target === lightbox) {
                    lightbox.remove();

                    document.removeEventListener(
                        "keydown",
                        keyboardControl
                    );
                }

            });

        });

    });

});
