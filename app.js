// --- Basic UI behaviors (bio toggle, copy email, follow, share) ---
const bio = document.getElementById('bio');
const toggleBio = document.getElementById('toggleBio');
const fadeEl = bio.querySelector('.fade');

function setBioClamp(expanded) {
  bio.classList.toggle('expanded', expanded);
  fadeEl.style.display = expanded ? 'none' : 'inline';
  toggleBio.textContent = expanded ? 'Read less…' : 'Read more…';
}

setBioClamp(false);
toggleBio.addEventListener('click', () => {
  const isExpanded = bio.classList.contains('expanded');
  setBioClamp(!isExpanded);
});

const emailText = document.getElementById('email').textContent.trim();

document.getElementById('copyEmail').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(emailText);
    toast('Email copied!');
  } catch {
    toast("Can't access clipboard.");
  }
});

const btnFollow = document.getElementById('btnFollow');
let following = false;
btnFollow.addEventListener('click', () => {
  following = !following;
  btnFollow.classList.toggle('primary', following);
  btnFollow.textContent = following ? 'Following' : 'Follow';
  toast(following ? 'Followed' : 'Unfollowed');
});

document.getElementById('share').addEventListener('click', async () => {
  const shareData = {
    title: document.getElementById('name').textContent,
    text: 'Check out this profile card!',
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.warn('Web Share API failed:', err);
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareData.url);
      toast('Link copied!');
    } catch (err) {
      toast("Can't access clipboard.");
    }
  }
});

// --- Avatar: load from local file path
const avatarImg = document.getElementById('avatarImg');
const avatarInitials = document.getElementById('avatarInitials');
const avatarPath = './IMG_4208.JPG';

(function setInitials() {
  const name = document.getElementById('name').textContent.trim();
  const initials = name.split(/\s+/).slice(0, 2).map(s => s[0] || '').join('').toUpperCase();
  avatarInitials.textContent = initials || 'AA';
})();

avatarImg.src = avatarPath;
avatarImg.onload = () => {
  avatarImg.style.display = 'block';
  avatarInitials.style.display = 'none';
};
avatarImg.onerror = () => {
  avatarImg.style.display = 'none';
  avatarInitials.style.display = 'block';
  console.warn('Avatar image not found or failed to load:', avatarPath);
};

// --- Theme Toggle (Light/Dark Mode) ---
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function updateTheme(isLight) {
  body.classList.toggle('light-mode', isLight);
  themeToggle.textContent = isLight ? 'Dark' : 'Light';
}

themeToggle.addEventListener('click', () => {
  const isLightMode = body.classList.contains('light-mode');
  updateTheme(!isLightMode);
  toast(isLightMode ? 'Switched to Dark Mode' : 'Switched to Light Mode');
});

// Set initial theme based on system preference
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
updateTheme(prefersLight);

// --- Tiny toast helper ---
function toast(msg) {
  const el = Object.assign(document.createElement('div'), {
    textContent: msg
  });
  el.style.cssText =
    `position:fixed;inset-inline:0;bottom:22px;margin:auto;max-width:320px;` +
    `background:rgba(25,25,46,.9);color:#fff;padding:10px 14px;border-radius:12px;` +
    `backdrop-filter:saturate(1.2) blur(6px);box-shadow:0 10px 24px rgba(0,0,0,.25);` +
    `font-weight:600;text-align:center;z-index:9999;`;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .45s, transform .45s';
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.addEventListener('transitionend', () => el.remove());
  }, 1400);
}