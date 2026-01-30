function handleUserClick() {
  if (auth.isLoggedIn()) {
    window.location.href = '/frontend/orders/';
  } else {
    document.getElementById('auth-modal').classList.remove('hidden');
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
  const fourthLink = navLinks[3]; 
  
  if (fourthLink) {
    if (auth.isLoggedIn()) {
      fourthLink.textContent = 'Orders';
      fourthLink.href = '/frontend/orders/';
      fourthLink.style.display = '';
    } else {
      fourthLink.style.display = 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  updateNavigation();
  updateUserAvatar(); // Always call this to set initial state

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
      } catch (error) {
        document.getElementById('signup-error').textContent = error.message;
      }
    });
  }
});