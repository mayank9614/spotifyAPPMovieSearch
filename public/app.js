// Enhanced app.js with additional functionality
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const movieNameInput = document.getElementById('movieName');
    const searchBtn = document.getElementById('searchBtn');
    const resultsContainer = document.getElementById('results');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsHeader = document.getElementById('resultsHeader');
    const searchTermSpan = document.getElementById('searchTerm');
    const noResults = document.getElementById('noResults');
    
    // Add error message element
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
        <h3>Connection Error</h3>
        <p>Unable to connect to Spotify. Please check your connection and try again.</p>
    `;
    document.querySelector('.results-container').appendChild(errorMessage);
    
    // Add recent searches section
    const recentSearchesSection = document.createElement('div');
    recentSearchesSection.className = 'recent-searches';
    recentSearchesSection.innerHTML = `
        <h3>Recent Searches</h3>
        <div class="search-tags" id="recentSearchTags"></div>
    `;
    document.querySelector('.search-container').appendChild(recentSearchesSection);
    
    // Recent searches functionality
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const recentSearchTags = document.getElementById('recentSearchTags');
    
    // Update recent searches display
    function updateRecentSearches() {
        recentSearchTags.innerHTML = '';
        
        recentSearches.forEach(search => {
            const tag = document.createElement('div');
            tag.className = 'search-tag';
            tag.innerHTML = `<i class="fas fa-history"></i>${search}`;
            tag.addEventListener('click', () => {
                movieNameInput.value = search;
                searchMovie();
            });
            recentSearchTags.appendChild(tag);
        });
        
        // Show/hide recent searches section
        recentSearchesSection.style.display = recentSearches.length > 0 ? 'block' : 'none';
    }
    
    // Initialize recent searches
    updateRecentSearches();

    // Event Listeners
    searchBtn.addEventListener('click', searchMovie);
    movieNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchMovie();
        }
    });

    // Search Function
    async function searchMovie() {
        const movieName = movieNameInput.value.trim();
        
        if (!movieName) {
            showToast('Please enter a movie name');
            return;
        }

        // Show loading indicator
        loadingIndicator.style.display = 'flex';
        resultsHeader.style.display = 'none';
        resultsContainer.innerHTML = '';
        noResults.style.display = 'none';
        errorMessage.style.display = 'none';

        try {
            const response = await fetch(`/search?movie=${encodeURIComponent(movieName)}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch data from Spotify');
            }
            
            const data = await response.json();
            
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Update search term display
            searchTermSpan.textContent = movieName;
            
            // Add to recent searches
            if (!recentSearches.includes(movieName)) {
                recentSearches.unshift(movieName);
                // Keep only the 5 most recent searches
                if (recentSearches.length > 5) {
                    recentSearches.pop();
                }
                localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
                updateRecentSearches();
            }
            
            // Display results
            if (data.playlists && data.playlists.items && data.playlists.items.length > 0) {
                resultsHeader.style.display = 'block';
                
                // Add count badge
                const countBadge = document.createElement('span');
                countBadge.className = 'results-count';
                countBadge.textContent = data.playlists.items.length;
                
                // Check if badge already exists
                const existingBadge = resultsHeader.querySelector('.results-count');
                if (existingBadge) {
                    existingBadge.textContent = data.playlists.items.length;
                } else {
                    resultsHeader.querySelector('h2').appendChild(countBadge);
                }
                
                displayResults(data.playlists.items);
            } else {
                noResults.style.display = 'flex';
            }
        } catch (error) {
            console.error('Error:', error);
            loadingIndicator.style.display = 'none';
            errorMessage.style.display = 'block';
        }
    }

    // Display Results Function
    function displayResults(playlists) {
        resultsContainer.innerHTML = '';
        
        playlists.forEach(playlist => {
            const playlistCard = document.createElement('div');
            playlistCard.className = 'playlist-card';
            
            // Get playlist image or use default icon
            let imageHtml = '';
            if (playlist.images && playlist.images.length > 0) {
                imageHtml = `<img src="${playlist.images[0].url}" alt="${playlist.name}">`;
            } else {
                imageHtml = '<i class="fas fa-music"></i>';
            }
            
            // Create playlist description or use default text
            const description = playlist.description || 'Spotify playlist';
            
            // Get follower count if available
            const followers = playlist.followers && playlist.followers.total 
                ? `${formatNumber(playlist.followers.total)} followers` 
                : '';
            
            // Create tooltip text
            const tooltipText = 'Click to open in Spotify';
            
            playlistCard.innerHTML = `
                <div class="playlist-image">
                    ${imageHtml}
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="playlist-name">${playlist.name}</div>
                <div class="playlist-description">${description}</div>
                ${followers ? `<div class="playlist-followers">${followers}</div>` : ''}
                <div class="tooltip">${tooltipText}</div>
            `;
            
            // Add click event to open playlist in Spotify
            playlistCard.addEventListener('click', () => {
                window.open(playlist.external_urls.spotify, '_blank');
            });
            
            resultsContainer.appendChild(playlistCard);
        });
    }

    // Format number function (e.g., 1000 -> 1K)
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num;
    }

    // Toast notification function
    function showToast(message) {
        // Create toast element if it doesn't exist
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
            
            // Add toast styles
            const style = document.createElement('style');
            style.textContent = `
                .toast {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: var(--spotify-black);
                    color: var(--spotify-white);
                    padding: 12px 24px;
                    border-radius: 4px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s, visibility 0.3s;
                }
                .toast.show {
                    opacity: 1;
                    visibility: visible;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Set message and show toast
        toast.textContent = message;
        toast.classList.add('show');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Add animation for sidebar items
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
            
            // Show appropriate content based on nav item
            if (link.textContent.includes('Home')) {
                document.querySelector('.search-container').style.display = 'block';
                document.querySelector('.results-container').style.display = 'block';
            }
        });
    });
});
