function handleUserClick() {
  if (auth.isLoggedIn()) {
    // Create a simple dropdown menu for logged-in users
    const existingMenu = document.getElementById('user-dropdown');
    if (existingMenu) {
      existingMenu.remove();
      return;
    }

    const dropdown = document.createElement('div');
    dropdown.id = 'user-dropdown';
    dropdown.style.cssText = `
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      min-width: 120px;
    `;
    
    // Use correct path for orders link
    const currentPath = window.location.pathname;
    const ordersPath = (currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.endsWith('/frontend/')) ? './orders/' : '../orders/';
    
    dropdown.innerHTML = `
      <a href="${ordersPath}" style="display: block; padding: 8px 12px; text-decoration: none; color: #333; border-bottom: 1px solid #eee;">My Orders</a>
      <button onclick="handleLogout()" style="display: block; width: 100%; padding: 8px 12px; text-align: left; border: none; background: none; color: #333; cursor: pointer;">Logout</button>
    `;
    
    const userAvatar = document.getElementById('user-avatar');
    userAvatar.style.position = 'relative';
    userAvatar.appendChild(dropdown);
    
    // Close dropdown when clicking outside
    setTimeout(() => {
      document.addEventListener('click', function closeDropdown(e) {
        if (!userAvatar.contains(e.target)) {
          dropdown.remove();
          document.removeEventListener('click', closeDropdown);
        }
      });
    }, 0);
  } else {
    document.getElementById('auth-modal').classList.remove('hidden');
  }
}

function handleLogout() {
  auth.logout();
  updateUserAvatar();
  updateNavigation();
  // Remove dropdown if it exists
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) dropdown.remove();
  // Redirect to home if on orders page
  if (window.location.pathname.includes('/orders/')) {
    window.location.href = '../';
  }
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
}

function switchAuthTab(tab) {
  const tabs = document.querySelectorAll('.auth-tab');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  
  tabs.forEach(t => t.classList.remove('active'));
  
  if (tab === 'login') {
    tabs[0].classList.add('active');
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
  } else {
    tabs[1].classList.add('active');
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
  }
}

function updateUserAvatar() {
  const avatar = document.getElementById('user-avatar');
  const user = auth.getUser();
  if (avatar) {
    if (user && user.name) {
      avatar.textContent = user.name.charAt(0).toUpperCase();
    } else {
      avatar.textContent = 'Login';
    }
  }
  updateNavigation();
}

function updateNavigation() {
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const ordersLink = navLinks[3]; // Fourth link should be Orders
  
  if (ordersLink) {
    if (auth.isLoggedIn()) {
      ordersLink.textContent = 'Orders';
      // Use the correct relative path based on current location
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.endsWith('/frontend/')) {
        ordersLink.href = './orders/';
      } else {
        ordersLink.href = '../orders/';
      }
      ordersLink.style.display = 'inline-block';
      ordersLink.style.visibility = 'visible';
    } else {
      ordersLink.style.display = 'none';
      ordersLink.style.visibility = 'hidden';
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize navigation and avatar immediately
  updateNavigation();
  updateUserAvatar();

  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.querySelector('input[type="email"]').value;
      const password = e.target.querySelector('input[type="password"]').value;
      
      try {
        await auth.login(email, password);
        closeAuthModal();
        updateUserAvatar();
        updateNavigation(); // Ensure navigation updates after login
      } catch (error) {
        document.getElementById('login-error').textContent = error.message;
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const inputs = e.target.querySelectorAll('input');
      const [name, email, password, city, country] = Array.from(inputs).map(i => i.value);
      
      try {
        await auth.signup(name, email, password, city, country);
        closeAuthModal();
        updateUserAvatar();
        updateNavigation(); // Ensure navigation updates after signup
      } catch (error) {
        document.getElementById('signup-error').textContent = error.message;
      }
    });
  }
});