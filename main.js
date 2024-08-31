const $ = (el) => document.querySelector(el);
const $$ = (el) => document.querySelectorAll(el);

const imageInput = $("#image-input");
const itemsSection = $("#selector-items");
const resetButton = $("#reset-tier-button");
const saveButton = $("#save-tier-button");
const eraseButton = $("#erase-button");

function createItem(src) {
    const imgElement = document.createElement("img");
    imgElement.draggable = true;
    imgElement.src = src;
    imgElement.className = "item-image";

    imgElement.addEventListener("dragstart", handleDragStart);
    imgElement.addEventListener("dragend", handleDragEnd);

    itemsSection.appendChild(imgElement);
    return imgElement;
}

function useFilesToCreateItems(files) {
    if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
            const reader = new FileReader();

            reader.onload = (eventReader) => {
                createItem(eventReader.target.result);
            };

            reader.readAsDataURL(file);
        });
    }
}

imageInput.addEventListener("change", (event) => {
    const { files } = event.target;
    useFilesToCreateItems(files);
});

let draggedElement = null;
let sourceContainer = null;

const rows = $$(".tier .row");

rows.forEach((row) => {
    row.addEventListener("dragover", handleDragOver);
    row.addEventListener("drop", handleDrop);
    row.addEventListener("dragleave", handleDragLeave);
});

itemsSection.addEventListener("dragover", handleDragOver);
itemsSection.addEventListener("drop", handleDrop);
itemsSection.addEventListener("dragleave", handleDragLeave);

function handleDrop(event) {
    event.preventDefault();

    const { currentTarget } = event;

    if (draggedElement && sourceContainer) {
        // Eliminar la clase `drag-files` de la sección si está presente
        itemsSection.classList.remove("drag-files");

        // Verificar si el elemento ya está en el contenedor de destino
        if (!currentTarget.contains(draggedElement)) {
            // Mover el elemento arrastrado al nuevo contenedor
            currentTarget.appendChild(draggedElement);
        }

        // Limpiar el estado de arrastrado
        currentTarget.classList.remove("drag-over");
        currentTarget.querySelector(".drag-preview")?.remove();
    }
}

function handleDragOver(event) {
    event.preventDefault();

    const { currentTarget } = event;
    if (sourceContainer === currentTarget) return;

    currentTarget.classList.add("drag-over");

    const dragPreview = document.querySelector(".drag-preview");

    if (draggedElement && !dragPreview) {
        // Crear una vista previa del elemento arrastrado
        const previewElement = draggedElement.cloneNode(true);
        previewElement.classList.add("drag-preview");
        currentTarget.appendChild(previewElement);
    }
}

function handleDragLeave(event) {
    event.preventDefault();

    const { currentTarget } = event;
    currentTarget.classList.remove("drag-over");
    currentTarget.querySelector(".drag-preview")?.remove();
}

function handleDragStart(event) {
    draggedElement = event.target;
    sourceContainer = draggedElement.parentNode;
    event.dataTransfer.setData("text/plain", draggedElement.src);
}

function handleDragEnd(event) {
    draggedElement = null;
    sourceContainer = null;
}

resetButton.addEventListener("click", () => {
    const items = $$(".tier .item-image");
    items.forEach((item) => {
        item.remove();
        itemsSection.appendChild(item);
    });
});

eraseButton.addEventListener("click", () => {
    itemsSection.querySelectorAll("img").forEach(function (img) {
        img.remove();
    });
});

saveButton.addEventListener("click", () => {
    const tierContainer = $(".tier");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    import(
        "https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.8/+esm"
    ).then(({ default: html2canvas }) => {
        html2canvas(tierContainer).then((canvas) => {
            ctx.drawImage(canvas, 0, 0);
            const imgURL = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.download = "tier.png";
            downloadLink.href = imgURL;
            downloadLink.click();
        });
    });
});

// Asignar los eventos `dragstart` y `dragend` a las imágenes existentes
const existingImages = $$(".item-image");
existingImages.forEach((img) => {
    img.addEventListener("dragstart", handleDragStart);
    img.addEventListener("dragend", handleDragEnd);
});