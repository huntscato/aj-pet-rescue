let currentPage = 1;
const resultsPerPage = 7;

document.addEventListener('DOMContentLoaded', async () => {
    await populateBreedFilter();
    await fetchAndDisplayDogs();
});

const populateBreedFilter = async () => {
    const breedSelect = document.getElementById('breed');
    try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
            credentials: 'include'
        });
        if (response.ok) {
            const breeds = await response.json();
            breeds.forEach(breed => {
                const option = document.createElement('option');
                option.value = breed;
                option.textContent = breed;
                breedSelect.appendChild(option);
            });
        } else {
            console.error('Failed to fetch breeds');
        }
    } catch (error) {
        console.error('Error fetching breeds:', error);
    }
};

const fetchAndDisplayDogs = async (breed = '', page = 1, size = resultsPerPage, sortField = 'name', sortOrder = 'asc') => {
    const dogList = document.getElementById('dog-list');
    dogList.innerHTML = 'Loading...';

    const query = new URLSearchParams({
        breeds: breed,
        size,
        from: (page - 1) * size,
        sort: 'name:asc'
    });

    try {
        const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?${query.toString()}`, {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            const dogDetails = await fetchDogDetails(data.resultIds); // Fetch dog details for each result
            displayDogs(dogDetails);
            updatePaginationControls(data.total);
        } else {
            console.error('Failed to fetch dogs');
            dogList.innerHTML = 'Failed to load dogs.';
        }
    } catch (error) {
        console.error('Error fetching dogs:', error);
        dogList.innerHTML = 'Error loading dogs.';
    }
};

const fetchDogDetails = async (dogIds) => {
    try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dogIds),
            credentials: 'include'
        });

        if (response.ok) {
            const dogs = await response.json();
            return dogs;
        } else {
            console.error('Failed to fetch dog details');
            return [];
        }
    } catch (error) {
        console.error('Error fetching dog details:', error);
        return [];
    }
};

const displayDogs = (dogs) => {
    const dogList = document.getElementById('dog-list');
    dogList.innerHTML = '';

    dogs.forEach(dog => {
        const dogCard = document.createElement('div');
        dogCard.classList.add('dog-card');
        dogCard.innerHTML = `
            <img src="${dog.img}" alt="${dog.name}">
            <h3>${dog.name}</h3>
            <p>Breed: ${dog.breed}</p>
            <p>Age: ${dog.age}</p>
            <p>Location: ${dog.zip_code}</p>
            <button onclick="favoriteDog('${dog.id}')">Add to Favorites</button>
        `;
        dogList.appendChild(dogCard);
    });
};

const favoriteDogs = JSON.parse(localStorage.getItem('favoriteDogs')) || [];

const favoriteDog = (id) => {
    if (!favoriteDogs.includes(id)) {
        favoriteDogs.push(id);
        localStorage.setItem('favoriteDogs', JSON.stringify(favoriteDogs));
        console.log(`Dog with ID ${id} added to favorites`);
    }
};

const generateMatch = async () => {
    try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(favoriteDogs),
            credentials: 'include'
        });

        if (response.ok) {
            const match = await response.json();
            displayMatch(match.match);
        } else {
            console.error('Failed to generate match');
        }
    } catch (error) {
        console.error('Error generating match:', error);
    }
};

const displayMatch = async (matchId) => {
    try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([matchId]),
            credentials: 'include'
        });

        if (response.ok) {
            const matchedDog = await response.json();
            console.log('Matched Dog:', matchedDog);
            // Display the matched dog details
            // Add your display code here
        } else {
            console.error('Failed to fetch matched dog details');
        }
    } catch (error) {
        console.error('Error fetching matched dog details:', error);
    }
};

const updatePaginationControls = (totalResults) => {
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    prevButton.addEventListener('click', () => changePage(currentPage - 1));
    nextButton.addEventListener('click', () => changePage(currentPage + 1));
};

const changePage = async (page) => {
    if (page >= 1) {
        currentPage = page;
        await fetchAndDisplayDogs(document.getElementById('breed').value, currentPage, resultsPerPage);
    }
};

document.getElementById('search-btn').addEventListener('click', async () => {
    const breed = document.getElementById('breed').value;
    await fetchAndDisplayDogs(breed);
});