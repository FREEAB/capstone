// Start of Gronemeier's Code
function duplicateSelect(event) {
    const select = event.target;
    if (select.selectedIndex === 0) return;
    const newSelect = select.cloneNode(true);

    // Disable selected option in the new select (YB)
    const selectedIndex = select.selectedIndex;
    newSelect.options[selectedIndex].disabled = true;

    const container = document.querySelector('#selection-form');
    container.appendChild(newSelect);
    newSelect.addEventListener('change', duplicateSelect);
}


async function submitChanges() {

}

document.querySelectorAll('.form-select').forEach((select) => {
    select.addEventListener('change', duplicateSelect);
});
// End of Gronemeier's Code