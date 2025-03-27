document.addEventListener("DOMContentLoaded", (event) => {
    var ProgressBar = {
        init: function () {
            this.progressLabel = document.getElementById("progress-label");
            this.progressPercentage = document.getElementById("progress-percentage");
            this.progressBar = document.getElementById("progress-bar");
            this.progressContainer = document.querySelector(".progress-container");
            this.pixelContainer = document.getElementById("pixel-bar");
            this.cancelButton = document.getElementById("cancel-button");
            this.animationFrameRequest = null;
            this.setupListeners();
            this.setupPixelBar(10); // Number of pixel segments
        },

        setupListeners: function () {
            window.addEventListener("message", (event) => {
                if (event.data.action === "progress") {
                    this.update(event.data);
                } else if (event.data.action === "cancel") {
                    this.cancel();
                }
            });

            // Optional cancel button listener
            if (this.cancelButton) {
                this.cancelButton.addEventListener("click", () => {
                    this.cancel();
                    this.postAction("cancel");
                });
            }
        },

        setupPixelBar: function (segments) {
            this.pixelContainer.innerHTML = "";
            for (let i = 0; i < segments; i++) {
                const pixel = document.createElement("div");
                pixel.className = "pixel-item";
                this.pixelContainer.appendChild(pixel);
            }
        },

        update: function (data) {
            if (this.animationFrameRequest) {
                cancelAnimationFrame(this.animationFrameRequest);
            }
            clearTimeout(this.cancelledTimer);

            this.progressContainer.style.opacity = "1";
            this.progressContainer.style.display = "block";
            this.progressLabel.textContent = data.label;
            this.progressPercentage.textContent = "0%";

            const duration = parseInt(data.duration, 10);
            const startTime = Date.now();
            const pixels = this.pixelContainer.children;
            const pixelCount = pixels.length;
            const pixelInterval = duration / pixelCount;

            let pixelIndex = 0;
            const updatePixels = setInterval(() => {
                if (pixelIndex < pixelCount) {
                    pixels[pixelIndex].classList.add("filled");
                    pixelIndex++;
                } else {
                    clearInterval(updatePixels);
                }
            }, pixelInterval);

            const animateProgress = () => {
                const timeElapsed = Date.now() - startTime;
                let progress = timeElapsed / duration;
                if (progress > 1) progress = 1;
                const percentage = Math.round(progress * 100);
                this.progressBar.style.width = percentage + "%";
                this.progressPercentage.textContent = percentage + "%";
                if (progress < 1) {
                    this.animationFrameRequest = requestAnimationFrame(animateProgress);
                } else {
                    this.onComplete();
                }
            };
            this.animationFrameRequest = requestAnimationFrame(animateProgress);

            // Show cancel button if action can be canceled (optional)
            if (this.cancelButton && data.canCancel !== false) {
                this.cancelButton.style.display = "block";
            }
        },

        cancel: function () {
            if (this.animationFrameRequest) {
                cancelAnimationFrame(this.animationFrameRequest);
                this.animationFrameRequest = null;
            }
            clearTimeout(this.cancelledTimer);

            this.progressLabel.textContent = "CANCELLED";
            this.progressPercentage.textContent = "";
            this.progressBar.style.width = "100%";
            this.progressContainer.style.opacity = "0";
            this.cancelledTimer = setTimeout(this.onCancel.bind(this), 1000);

            const pixels = this.pixelContainer.children;
            for (let pixel of pixels) {
                pixel.classList.remove("filled");
            }
            if (this.cancelButton) this.cancelButton.style.display = "none";
        },

        onComplete: function () {
            setTimeout(() => {
                this.progressBar.style.width = "0";
                this.progressContainer.style.opacity = "0";
                this.postAction("FinishAction");
                const pixels = this.pixelContainer.children;
                for (let pixel of pixels) {
                    pixel.classList.remove("filled");
                }
                if (this.cancelButton) this.cancelButton.style.display = "none";
            }, 100);
        },

        onCancel: function () {
            this.progressContainer.style.display = "none";
            this.progressBar.style.width = "0";
            this.progressPercentage.textContent = "";
        },

        postAction: function (action) {
            fetch(`https://progressbar/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });
        },
    };

    ProgressBar.init();
});