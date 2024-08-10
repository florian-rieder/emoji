let currentSearch = '';
let isConfirmationActive = false;
let confirmationTimeout;
let dataset;

const searchbar = document.getElementById('search');
// searchbar.addEventListener('keyup', search);

document.getElementById('submit').addEventListener('click', search)

const currentSearchText = document.getElementById('current-search');

d3.csv('assets/data/emoji_list.csv').then(data => {
    data.forEach((d, i) => {
        // Split the keywords and add an index to identify rows
        d.description = capitalizeFirstLetter(d.description);
        d.keywords = d.keywords.split('|').map(k => k.toLowerCase());
        d.index = i;
    })

    dataset = data;

    console.log(dataset);

    draw(dataset);
});

function draw(data) {
    let containers = d3.select('#emoji-container')
        .selectAll('div')
        .data(data, d => d.index)

    let enteringContainers = containers.enter()
        .append('div')
        .attr('class', 'tile')
        .style('opacity', 0)
        .on('click', e => {
            let emoji = e.target.__data__.emoji;
            // Show confirmation toast
            setConfirmation(emoji);
            // Copy the emoji to clipboard
            writeToClipBoard(emoji)
        })

    // Add image of the icon
    enteringContainers.append('img')
        .attr('src', d => `data:image/png;base64,${d.base64}`)

    // Add description
    enteringContainers.append('span')
        .attr('class', 'description')
        .html(d => d.description)

    enteringContainers.transition()
        .duration(200)
        .style('opacity', 1)

    let exitingContainers = containers.exit()
        .transition()
        .duration(200)
        .style('opacity', 0)
        .remove();
}

function search() {
    currentSearch = searchbar.value.toLowerCase();
    currentSearchText.innerHTML = currentSearch;

    draw(dataset.filter(d => isEmojiSelected(d)));
}

function isEmojiSelected(d) {
    if (currentSearch == '') return true;

    return d.keywords.some(k => k.includes(currentSearch)) || d.description.toLowerCase().includes(currentSearch)
}

async function writeToClipBoard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        console.error(error.message);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function setConfirmation(emoji) {
    const confirmationEmoji = document.getElementById('confirmation-emoji')
    confirmationEmoji.innerHTML = emoji;

    // If there is a timer active, cancel it (extend its duration basically)
    if (confirmationTimeout != null) {
        clearTimeout(confirmationTimeout);
    }

    const toast = document.getElementById('confirmation-toast');
    toast.classList.add('active');
    confirmationTimeout = setTimeout(() => toast.classList.remove('active'), 2000)
}