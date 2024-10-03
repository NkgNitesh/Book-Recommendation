// Your performSearch function definition
let currentPage = 1;
let booksPerPage = 12;  // Change this if you want more books per page

function performSearch() {
    let query = document.getElementById('bookSearch').value;
  
    const loading = document.getElementById('loading');
    const bookResults = document.getElementById('bookResults');
  
    loading.style.display = 'block';
    bookResults.innerHTML = '';
  
    if (query.trim() === '') {
      alert('Please enter a book title or author');
      loading.style.display = 'none';
      return;
    }
  
    fetch(`https://openlibrary.org/search.json?q=${query}`)
      .then(response => response.json())
      .then(data => {
        let books = data.docs;
        let output = '';
  
        if (books.length === 0) {
          output = '<p>No books found. Try a different search.</p>';
        } else {
          books.forEach(book => {
            let coverImage = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : 'default-image.jpg';
            output += `
              <div class="book">
                <img src="${coverImage}" alt="Book Cover" loading="lazy">
                <h2>${book.title}</h2>
                <p>Author: ${book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
                <p>First Published: ${book.first_publish_year ? book.first_publish_year : 'N/A'}</p>
              </div>
            `;
          });
        }
  
        loading.style.display = 'none';
        bookResults.innerHTML = output;
      })
      .catch(error => {
        console.error('Error fetching book data:', error);
        loading.style.display = 'none';
        bookResults.innerHTML = '<p>Error fetching data. Please try again later.</p>';
      });
  }
  
  // Event listener for Enter key in the search input
  document.getElementById('bookSearch').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();  // Prevent default form submission
      performSearch();  // Call the search function
    }
  });
  
  // Event listener for search button click
  document.getElementById('searchBtn').addEventListener('click', function() {
    performSearch();
  });
// Function to perform search by genre, prioritizing newer books
function fetchBooksByGenre(genre) {
    const loading = document.getElementById('loading');
    const bookResults = document.getElementById('bookResults');
  
    // Show loading indicator
    loading.style.display = 'block';
    bookResults.innerHTML = '';
    const offset = (page - 1) * booksPerPage;

    // Fetch books by genre, limit results, and prioritize newer ones
    fetch(`https://openlibrary.org/subjects/${genre}.json?limit=${booksPerPage}&offset=${offset}`)
      .then(response => response.json())
      .then(data => {
        let books = data.works;
        let output = '';
  
        // Sort books by publication year, descending (newest first)
        books.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
  
        if (books.length === 0) {
          output = '<p>No books found. Try a different genre.</p>';
        } else {
          books.forEach(book => {
            let coverImage = book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` : 'default-image.jpg';
            output += `
              <div class="book">
                <img src="${coverImage}" alt="Book Cover" loading="lazy">
                <h2>${book.title}</h2>
                <p>Author: ${book.authors ? book.authors.map(author => author.name).join(', ') : 'Unknown'}</p>
                <p>First Published: ${book.first_publish_year ? book.first_publish_year : 'N/A'}</p>
              </div>
            `;
          });
        }
  
        // Hide loading and display results
        loading.style.display = 'none';
        bookResults.innerHTML = output;
      })
      .catch(error => {
        console.error('Error fetching book data:', error);
        loading.style.display = 'none';
        bookResults.innerHTML = '<p>There was an error fetching the data. Please try again later.</p>';
      });
  }
  
  // Event listener for genre buttons
  document.querySelectorAll('.genre-btn').forEach(button => {
    button.addEventListener('click', function() {
      const genre = this.getAttribute('data-genre');
      fetchBooksByGenre(genre);
    });
  });
  