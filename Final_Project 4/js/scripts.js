function handleSearchInput() {
    clearFilters('searchInput');
    searchMeals();
}

function handleCategoryChange() {
    clearFilters('categoryFilter');
    searchMeals();
}

function handleAreaChange() {
    clearFilters('areaFilter');
    searchMeals();
}

function handleIngredientChange() {
    clearFilters('ingredientFilter');
    searchMeals();
}

function clearFilters(excludeField) {
    const fields = ['searchInput', 'categoryFilter', 'areaFilter', 'ingredientFilter'];
    fields.forEach(fieldId => {
        if (fieldId !== excludeField) {
            document.getElementById(fieldId).value = '';
        }
    });
}

function populateFilterDropdown(dropdownId, items, itemKey) {
    let dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = `<option value="">All ${itemKey.charAt(0).toUpperCase() + itemKey.slice(1)}s</option>`; // Clear existing content and add default option
    items.forEach(item => {
        let option = document.createElement('option');
        option.value = item[itemKey];
        option.innerText = item[itemKey];
        dropdown.appendChild(option);
    });
}

function fetchAreas() {
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
        .then(response => response.json())
        .then(data => {
            populateFilterDropdown('areaFilter', data.meals, 'strArea');
        })
        .catch(error => {
            showError('Error fetching areas. Please check your internet connection and try again.');
            console.error('Error fetching areas:', error);
        });
}

function fetchIngredients() {
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
        .then(response => response.json())
        .then(data => {
            populateFilterDropdown('ingredientFilter', data.meals, 'strIngredient');
        })
        .catch(error => {
            showError('Error fetching ingredients. Please check your internet connection and try again.');
            console.error('Error fetching ingredients:', error);
        });
}

function fetchCategories() {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => {
            populateCategoriesDropdown(data.categories);
            populateFilterDropdown('categoryFilter', data.categories, 'strCategory');
            if (document.getElementById('content')) {
                displayCategories(data.categories); // Only display categories on the index page
            }
        })
        .catch(error => {
            showError('Error fetching categories. Please check your internet connection and try again.');
            console.error('Error fetching categories:', error);
        });
}

function fetchMealsByLetter(letter) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                displayMeals(data.meals);
            } else {
                showError('No meals found for the selected letter.');
            }
        })
        .catch(error => {
            showError('Error fetching meals. Please check your internet connection and try again.');
            console.error('Error fetching meals:', error);
        });
}

function displayCategories(categories) {
    let content = '<h2 class="my-4">Meal Categories</h2><div class="row">';
    categories.forEach(category => {
        content += `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${category.strCategoryThumb}" class="card-img-top" alt="${category.strCategory}">
                    <div class="card-body">
                        <h5 class="card-title">${category.strCategory}</h5>
                        <p class="card-text">${category.strCategoryDescription.substring(0, 100)}...</p>
                        <a href="index.html?category=${category.strCategory}" class="btn btn-primary">View Meals</a>
                    </div>
                </div>
            </div>`;
    });
    content += '</div>';
    document.getElementById('content').innerHTML += content;
}

function populateCategoriesDropdown(categories) {
    let dropdown = document.getElementById('categoriesDropdown');
    dropdown.innerHTML = ''; // Clear existing content
    categories.forEach(category => {
        let item = document.createElement('a');
        item.className = 'dropdown-item';
        item.href = `index.html?category=${category.strCategory}`;
        item.innerText = category.strCategory;
        dropdown.appendChild(item);
    });
}

function fetchMealsByCategory(category) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                document.getElementById('content').innerHTML = ''; // Clear previous content
                displayMeals(data.meals);
            } else {
                showError('No meals found for the selected category.');
            }
        })
        .catch(error => {
            showError('Error fetching meals by category. Please check your internet connection and try again.');
            console.error('Error fetching meals by category:', error);
        });
}

function searchMeals() {
    const searchInput = document.getElementById('searchInput').value.trim();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const areaFilter = document.getElementById('areaFilter').value;
    const ingredientFilter = document.getElementById('ingredientFilter').value;

    let url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + searchInput;

    if (ingredientFilter) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientFilter}`;
    } else if (categoryFilter) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryFilter}`;
    } else if (areaFilter) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaFilter}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                document.getElementById('content').innerHTML = ''; // Clear previous content
                displayMeals(data.meals);
            } else {
                showError('No meals found for the search criteria.');
            }
        })
        .catch(error => {
            showError('Error searching meals. Please check your internet connection and try again.');
            console.error('Error searching meals:', error);
        });
}

function displayMeals(meals) {
    let content = '<h2 class="my-4">Meals</h2><div class="row">';
    meals.forEach(meal => {
        content += `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                    <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                        <a href="detail.html?id=${meal.idMeal}" class="btn btn-primary">View Recipe</a>
                    </div>
                </div>
            </div>`;
    });
    content += '</div>';
    document.getElementById('content').innerHTML += content;
}

function showError(message) {
    document.getElementById('content').innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
}

// Initial fetches when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    fetchCategories();
    fetchAreas();
    fetchIngredients();
    if (document.getElementById('content')) {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            fetchMealsByCategory(category);
        } else {
            fetchMealsByLetter('a'); // Only fetch meals by letter on the index page if no category is specified
        }
    }
});
