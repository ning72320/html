// Update date and time in the status bar
function updateDateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    
    // Format time as HH:MM
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;
    
    // Update date in the header
    const dateElement = document.querySelector('.date');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('zh-CN', options);
    
    // Update every minute
    setTimeout(updateDateTime, 60000);
}

// Update progress bar animation
function updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    // Get current progress from data attribute or default to 0
    let currentProgress = parseInt(progressFill.getAttribute('data-progress') || '0');
    const targetProgress = 65; // This would normally come from user data
    
    // Animate progress bar
    let animationInterval = setInterval(() => {
        if (currentProgress < targetProgress) {
            currentProgress += 1;
            progressFill.style.width = `${currentProgress}%`;
            progressText.textContent = `${currentProgress}% 完成`;
            progressFill.setAttribute('data-progress', currentProgress);
        } else {
            clearInterval(animationInterval);
        }
    }, 20);
}

// Handle module card clicks
function setupModuleCards() {
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent default if clicking on the card but not on the start button
            if (!e.target.closest('.start-btn')) {
                e.preventDefault();
                
                // Get the start button within this card and simulate click
                const startBtn = card.querySelector('.start-btn');
                if (startBtn) {
                    const moduleName = card.querySelector('h4').textContent;
                    console.log(`Opening ${moduleName} training module`);
                    
                    // Animation effect
                    card.classList.add('clicked');
                    setTimeout(() => {
                        card.classList.remove('clicked');
                        // Here you would navigate to the module page
                        // window.location.href = startBtn.getAttribute('href');
                    }, 300);
                }
            }
        });
    });
}

// Initialize the page
function initHomePage() {
    updateDateTime();
    updateProgressBar();
    setupModuleCards();
    
    // Highlight active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // This would typically change pages, but for the prototype just change active state
            navItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
            
            // If not the home item, prevent default to stay on this page
            if (!item.classList.contains('home-nav')) {
                e.preventDefault();
                console.log(`Navigating to: ${item.getAttribute('href')}`);
            }
        });
    });
    
    // Setup recommendation actions
    const actionBtn = document.querySelector('.ai-action-btn');
    if (actionBtn) {
        actionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Starting recommended activity');
            actionBtn.textContent = '正在加载...';
            
            // Simulate loading
            setTimeout(() => {
                actionBtn.textContent = '开始训练';
                // Here you would navigate to the recommended activity
            }, 1500);
        });
    }
    
    console.log('Home page initialized');
}

// When the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initHomePage);

// Add additional style for card click effect
const style = document.createElement('style');
style.textContent = `
    .module-card.clicked {
        transform: scale(0.98);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.1s ease, box-shadow 0.1s ease;
    }
`;
document.head.appendChild(style); 