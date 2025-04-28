/**
 * Main JavaScript for Alzheimer's Cognitive Training App Prototype
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page based on its type
    initPage();
});

/**
 * Initialize the page based on its type and URL
 */
function initPage() {
    // Set up tab navigation
    setupTabNavigation();
    
    // Initialize segmented controls
    initSegmentedControls();
    
    // Initialize any switches
    initSwitches();
    
    // Set up search functionality
    setupSearch();
    
    // Initialize any page-specific functions based on the current page
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'home.html':
            initHomePage();
            break;
        case 'memory.html':
            initMemoryPage();
            break;
        case 'results.html':
            initResultsPage();
            break;
        case 'profile.html':
            initProfilePage();
            break;
        default:
            // If it's the index page or another page, no specific initialization needed
            break;
    }
}

/**
 * Set up tab navigation to switch between pages
 */
function setupTabNavigation() {
    const tabItems = document.querySelectorAll('.tab-item');
    
    tabItems.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            if (target) {
                window.location.href = target;
            }
        });
    });
}

/**
 * Initialize iOS-style segmented controls
 */
function initSegmentedControls() {
    const segmentControls = document.querySelectorAll('.segmented-control');
    
    segmentControls.forEach(control => {
        const segments = control.querySelectorAll('.segment');
        
        segments.forEach(segment => {
            segment.addEventListener('click', function() {
                // Remove active class from all segments
                segments.forEach(s => s.classList.remove('active'));
                
                // Add active class to the clicked segment
                this.classList.add('active');
                
                // Get the data-content attribute to show/hide content
                const contentId = this.getAttribute('data-content');
                if (contentId) {
                    const allContent = document.querySelectorAll('[data-segment-content]');
                    allContent.forEach(content => {
                        content.style.display = 'none';
                    });
                    
                    const targetContent = document.querySelector(`[data-segment-content="${contentId}"]`);
                    if (targetContent) {
                        targetContent.style.display = 'block';
                    }
                }
            });
        });
    });
}

/**
 * Initialize any iOS-style switches
 */
function initSwitches() {
    const switches = document.querySelectorAll('.switch input');
    
    switches.forEach(switchInput => {
        switchInput.addEventListener('change', function() {
            // Get any data attributes to perform actions when switch changes
            const action = this.getAttribute('data-action');
            if (action) {
                // Perform any specific actions based on the switch
                console.log(`Switch action: ${action}, value: ${this.checked}`);
            }
        });
    });
}

/**
 * Set up search functionality
 */
function setupSearch() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const searchTarget = this.getAttribute('data-search-target');
            
            if (searchTarget) {
                const items = document.querySelectorAll(`[data-searchable="${searchTarget}"]`);
                
                items.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    });
}

/**
 * Initialize home page specific functionality
 */
function initHomePage() {
    console.log('Home page initialized');
    
    // Set up training module click events
    const trainingModules = document.querySelectorAll('.training-module');
    trainingModules.forEach(module => {
        module.addEventListener('click', function() {
            const moduleType = this.getAttribute('data-module-type');
            if (moduleType) {
                // In a real app, this would navigate to the specific training module
                alert(`启动训练模块: ${moduleType}`);
            }
        });
    });
    
    // Setup avatar chat button
    const chatButton = document.querySelector('.avatar-chat-btn');
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            window.location.href = 'chat.html';
        });
    }
}

/**
 * Initialize memory page specific functionality
 */
function initMemoryPage() {
    console.log('Memory page initialized');
    
    // Set up category pills filter
    const categoryPills = document.querySelectorAll('.pill');
    categoryPills.forEach(pill => {
        pill.addEventListener('click', function() {
            // Remove active class from all pills
            categoryPills.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked pill
            this.classList.add('active');
            
            // Filter memory cards based on category
            const category = this.getAttribute('data-category');
            const memoryCards = document.querySelectorAll('.memory-card');
            
            memoryCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Set up add memory button
    const addMemoryBtn = document.querySelector('.add-memory-btn');
    if (addMemoryBtn) {
        addMemoryBtn.addEventListener('click', function() {
            alert('添加新记忆功能将在实际应用中实现');
        });
    }
}

/**
 * Initialize results page specific functionality
 */
function initResultsPage() {
    console.log('Results page initialized');
    
    // Set up share button
    const shareButton = document.querySelector('.share-btn');
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            alert('分享功能将在实际应用中实现');
        });
    }
}

/**
 * Initialize profile page specific functionality
 */
function initProfilePage() {
    console.log('Profile page initialized');
    
    // Set up chat button
    const startChatBtn = document.querySelector('.start-chat-btn');
    if (startChatBtn) {
        startChatBtn.addEventListener('click', function() {
            window.location.href = 'chat.html';
        });
    }
    
    // Set up continue chat button
    const continueChatBtn = document.querySelector('.continue-chat-btn');
    if (continueChatBtn) {
        continueChatBtn.addEventListener('click', function() {
            window.location.href = 'chat.html';
        });
    }
}

/**
 * Change tab programmatically
 * @param {string} tabName - The name of the tab to activate
 */
function changeTab(tabName) {
    const targetPage = `${tabName}.html`;
    window.location.href = targetPage;
}

/**
 * Open the chat interface with a specific topic
 * @param {string} topic - The topic to start chatting about
 */
function openChat(topic) {
    window.location.href = `chat.html?topic=${encodeURIComponent(topic)}`;
}

/**
 * Navigate to a specific memory detail
 * @param {string} memoryId - The ID of the memory to view
 */
function viewMemory(memoryId) {
    window.location.href = `memory-detail.html?id=${encodeURIComponent(memoryId)}`;
}

/**
 * Get current date and time in a formatted string
 * @returns {string} Formatted date string
 */
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
}

// Update the time in the status bar
function updateStatusBarTime() {
    const timeElement = document.querySelector('.status-bar .time');
    if (timeElement) {
        timeElement.textContent = getCurrentDateTime();
    }
}

// Update time every minute
setInterval(updateStatusBarTime, 60000);

// Initial time update
updateStatusBarTime(); 