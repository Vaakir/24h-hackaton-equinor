function populateShopPanel() {
    if (!config.cells) {
        // Hacky way to wait for config to load just do a long while loop
        let i = 100000;
        console.log("Waiting for config to load");
        while(i > 0){
            i--;
        }
    }

    let buildableStructures = Object.keys(config.cells).filter(cellType => config.cells[cellType].buildCost);
    let shopDiv = document.getElementById("shop");


    // TODO, move all styling to css
    shopDiv.style.display = 'grid';
    // shopDiv.style.gridTemplateColumns = 'repeat(3, 1fr)';
    shopDiv.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';

    shopDiv.style.gap = '8px';
    shopDiv.style.padding = '8px';
    shopDiv.style.textAlign = 'center';

    const pixelRatio = window.devicePixelRatio || 1;
    const shopWidth = shopDiv.clientWidth;
    const displaySize = Math.floor((shopWidth - (8 + 8)) / 3);

    buildableStructures.forEach(cellType => {
        let container = document.createElement("div");
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.padding = "6px";
        container.style.border = "2px solid #ccc";
        container.style.borderRadius = "6px";
        container.style.backgroundColor = "#f8f8f8";
        container.style.transition = "all 0.2s ease";
        container.style.cursor = "pointer";

        container.addEventListener("mouseover", () => {
            container.style.border = "2px solid #666";
            container.style.backgroundColor = "#eaeaea";
        });

        container.addEventListener("mouseout", () => {
            container.style.border = "2px solid #ccc";
            container.style.backgroundColor = "#f8f8f8";
        });

        container.addEventListener("click", () => clickBuildStructure(cellType));

        let img = new Image();
        img.src = "../assets/tileset.png";
        let canvas = document.createElement("canvas");

        img.onload = function () {
            canvas.width = displaySize * pixelRatio;
            canvas.height = displaySize * pixelRatio;

            let ctx = canvas.getContext("2d", {
                alpha: true,
                antialias: false
            });
            ctx.imageSmoothingEnabled = false;

            const bounds = config.cells[cellType].tiles.default.bounds;
            ctx.drawImage(
                img,
                bounds[0] * 16,
                bounds[1] * 16,
                32,
                32,
                0,
                0,
                displaySize,
                displaySize
            );

        };
        container.appendChild(canvas);

        let label = document.createElement("span");
        label.textContent = `${cellType}`;
        label.style.fontSize = "12px";
        label.style.marginTop = "4px";
        label.style.color = "#333";
        label.style.fontWeight = "bold";

        // Build Cost Label
        let costLabel = document.createElement("span");
        costLabel.textContent = `Cost: ${config.cells[cellType].buildCost}`;
        costLabel.style.fontSize = "11px";
        costLabel.style.color = "#555";


        container.appendChild(label);
        container.appendChild(costLabel);
        shopDiv.appendChild(container);
    });
}



let clickBuildStructure = (type) => {
    console.log("Selected:", type);
};