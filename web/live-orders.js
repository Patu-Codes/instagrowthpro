// Live Orders Widget - Frontend Only
// Generates random orders every 6 seconds for social proof

class LiveOrdersWidget {
    constructor() {
        this.orders = [];
        this.maxOrders = 8;
        this.updateInterval = 6000; // 6 seconds
        this.isVisible = true;

        // Sample data for random generation
        this.packages = [
            { name: 'Demo', followers: 50, icon: '🎯' },
            { name: 'Starter', followers: 100, icon: '🚀' },
            { name: 'Growth', followers: 200, icon: '📈' },
            { name: 'Pro', followers: 500, icon: '💎' },
            { name: 'Elite', followers: 1000, icon: '👑' }
        ];

        this.usernames = [
            'fashionista', 'travelbug', 'foodie_life', 'tech_guru', 'fitness_pro',
            'art_lover', 'music_vibes', 'photo_graphy', 'gamer_zone', 'pet_lover',
            'beauty_tips', 'lifestyle_hub', 'sports_fan', 'book_worm', 'movie_buff',
            'nature_soul', 'cafe_hopper', 'yoga_life', 'dance_star', 'creative_mind',
            'adventure_seeker', 'ocean_dreamer', 'mountain_climber', 'city_explorer', 'beach_lover'
        ];

        this.init();
    }

    init() {
        this.createWidget();
        this.generateInitialOrders();
        this.startAutoGeneration();
        this.setupEventListeners();
    }

    createWidget() {
        const widgetHTML = `
            <div id="liveOrdersWidget" class="live-orders-widget">
                <div class="live-orders-header">
                    <div class="live-orders-title">
                        <span class="live-indicator"></span>
                        <span>Live Orders</span>
                    </div>
                    <button class="close-orders-btn" onclick="liveOrders.toggleWidget()">×</button>
                </div>
                <div class="live-orders-list" id="liveOrdersList">
                    <!-- Orders will be inserted here -->
                </div>
                <div class="live-orders-footer">
                    ⓘ Order numbers shown are for activity display purposes only.
                </div>
            </div>
            
            <button id="liveOrdersToggle" class="live-orders-toggle" onclick="liveOrders.toggleWidget()" style="display: none;">
                🛍️
                <span class="notification-badge">0</span>
            </button>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    generateOrderId() {
        // Generate 13-digit random number
        const randomNum = Math.floor(Math.random() * 9000000000000) + 1000000000000;
        return `#ORD_${randomNum}`;
    }

    generateRandomOrder() {
        const randomPackage = this.packages[Math.floor(Math.random() * this.packages.length)];
        const randomUsername = this.usernames[Math.floor(Math.random() * this.usernames.length)];
        const randomSuffix = Math.floor(Math.random() * 999);

        return {
            id: this.generateOrderId(),
            username: `@${randomUsername}${randomSuffix}`,
            package: randomPackage,
            time: 'Just now'
        };
    }

    generateInitialOrders() {
        // Generate 5 initial orders with different times
        const times = ['Just now', '1 min ago', '2 mins ago', '4 mins ago', '7 mins ago'];

        for (let i = 0; i < 5; i++) {
            const order = this.generateRandomOrder();
            order.time = times[i];
            this.orders.push(order);
        }

        this.renderOrders();
    }

    addNewOrder() {
        const newOrder = this.generateRandomOrder();

        // Add to beginning of array
        this.orders.unshift(newOrder);

        // Keep only last maxOrders
        if (this.orders.length > this.maxOrders) {
            this.orders = this.orders.slice(0, this.maxOrders);
        }

        this.renderOrders();
        this.updateNotificationBadge();
    }

    renderOrders() {
        const ordersList = document.getElementById('liveOrdersList');
        if (!ordersList) return;

        ordersList.innerHTML = this.orders.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <span class="order-id">${order.id}</span>
                    <span class="order-time">${order.time}</span>
                </div>
                <div class="order-details">
                    <div class="order-icon">${order.package.icon}</div>
                    <div class="order-info">
                        <div class="order-package">
                            <span class="package-name">${order.package.name}</span> Package
                            <br>
                            <span style="color: rgba(255,255,255,0.5); font-size: 0.7rem;">
                                ${order.package.followers} followers
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    startAutoGeneration() {
        setInterval(() => {
            this.addNewOrder();
        }, this.updateInterval);
    }

    toggleWidget() {
        const widget = document.getElementById('liveOrdersWidget');
        const toggle = document.getElementById('liveOrdersToggle');

        this.isVisible = !this.isVisible;

        if (this.isVisible) {
            widget.style.display = 'block';
            toggle.style.display = 'none';
        } else {
            widget.style.display = 'none';
            toggle.style.display = 'flex';
        }
    }

    updateNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            const count = this.orders.length;
            badge.textContent = count > 9 ? '9+' : count;
        }
    }

    setupEventListeners() {
        // Close widget if user clicks outside on mobile
        document.addEventListener('click', (e) => {
            const widget = document.getElementById('liveOrdersWidget');
            const toggle = document.getElementById('liveOrdersToggle');

            if (widget && toggle &&
                !widget.contains(e.target) &&
                !toggle.contains(e.target) &&
                e.target.className !== 'close-orders-btn') {
                // Optional: Auto-minimize on mobile when clicking outside
                if (window.innerWidth <= 768 && this.isVisible) {
                    // Uncomment to enable auto-minimize
                    // this.toggleWidget();
                }
            }
        });
    }
}

// Initialize Live Orders Widget when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.liveOrders = new LiveOrdersWidget();
    console.log('✅ Live Orders Widget initialized');
});
