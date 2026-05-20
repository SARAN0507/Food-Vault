const API_URL = 'https://food-vault-lp8m.onrender.com';


const imageCache = {};

async function getFoodImageURL(foodName) {
  const key = foodName.toLowerCase().trim();

  if (imageCache[key]) return imageCache[key];

const foodAliases = {
  /* TAMIL NADU / SOUTH INDIAN */
      idli: "idli",
      idly: "idli",
      dosa: "masala dosa",
      dosai: "masala dosa",
      ghee_dosa: "ghee dosa",
      paper_dosa: "paper dosa",
      onion_dosa: "onion dosa",
      rava_dosa: "rava dosa",
      set_dosa: "set dosa",
      kal_dosa: "kal dosa",

      uttapam: "uttapam",
      uthappam: "uttapam",

      pongal: "ven pongal",
      sakkarai_pongal: "sweet pongal",

      upma: "upma",
      kichadi: "kichadi",
      kichdi: "khichdi",

      poori: "poori",
      puri: "poori",
      chapati: "chapati",
      roti: "roti",
      parotta: "parotta",
      kothu_parotta: "kothu parotta",

      appam: "appam",
      idiappam: "idiyappam",
      puttu: "puttu",

      vada: "medu vada",
      medu_vada: "medu vada",
      bonda: "potato bonda",
      bajji: "chilli bajji",
      pakoda: "pakora",

      sambar: "sambar",
      rasam: "rasam",
      kurma: "vegetable kurma",
      chutney: "coconut chutney",

      lemon_rice: "lemon rice",
      curd_rice: "curd rice",
      tamarind_rice: "tamarind rice",
      tomato_rice: "tomato rice",
      coconut_rice: "coconut rice",
      veg_rice: "vegetable rice",

      biryani: "chicken biryani",
      veg_biryani: "veg biryani",
      mutton_biryani: "mutton biryani",
      chicken_biryani: "chicken biryani",

      fried_rice: "fried rice",
      noodles: "hakka noodles",

      /* NORTH INDIAN */
      paneer: "paneer butter masala",
      butter_chicken: "butter chicken",
      naan: "butter naan",
      kulcha: "kulcha",
      tandoori: "tandoori chicken",
      chole: "chole bhature",
      rajma: "rajma curry",
      dal: "dal tadka",
      aloo_paratha: "aloo paratha",

      /* STREET FOOD */
      pani_puri: "pani puri",
      golgappa: "golgappa",
      bhel_puri: "bhel puri",
      samosa: "samosa",
      pav_bhaji: "pav bhaji",
      vada_pav: "vada pav",
      frankie: "veg frankie",

      /* CHINESE / FAST FOOD */
      burger: "burger",
      pizza: "pizza",
      pasta: "pasta",
      sandwich: "sandwich",
      momos: "momos",
      spring_roll: "spring rolls",

      /* SWEETS */
      gulab_jamun: "gulab jamun",
      laddu: "laddu",
      jalebi: "jalebi",
      mysore_pak: "mysore pak",
      halwa: "halwa",
      kesari: "kesari",
      payasam: "payasam",
      rasgulla: "rasgulla",
      cake: "cake",
      brownie: "brownie",
      donut: "donut",
      icecream: "ice cream",

      /* DRINKS */
      tea: "tea",
      chai: "tea",
      coffee: "filter coffee",
      juice: "fruit juice",
      mango_juice: "mango juice",
      watermelon_juice: "watermelon juice",
      lassi: "lassi",
      milkshake: "milkshake",
      badam_milk: "badam milk",

      /* NON VEG */
      chicken: "chicken curry",
      mutton: "mutton curry",
      fish: "fish fry",
      prawn: "prawn fry",
      crab: "crab curry",
      egg: "egg curry"
};

  const searchTerm = foodAliases[key] || key;

  /* LAYER 1 — WIKIPEDIA */
  try {
    const wikiRes = await fetch(
      `https://en.wikipedia.org/w/api.php?origin=*&action=query&generator=search&gsrsearch=${encodeURIComponent(searchTerm)} food&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=500&format=json`
    );

    const wikiData = await wikiRes.json();

    if (wikiData.query && wikiData.query.pages) {
      const pages = Object.values(wikiData.query.pages);

      if (pages.length && pages[0].thumbnail) {
        const url = pages[0].thumbnail.source;
        imageCache[key] = url;
        return url;
      }
    }
  } catch {}

  /* LAYER 2 — THEMEALDB */
  try {
    const mealRes = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`
    );

    const mealData = await mealRes.json();

    if (mealData.meals && mealData.meals[0]?.strMealThumb) {
      const url = mealData.meals[0].strMealThumb;
      imageCache[key] = url;
      return url;
    }
  } catch {}

  /* LAYER 3 — WIKIMEDIA COMMONS */
  try {
    const mediaRes = await fetch(
      `https://commons.wikimedia.org/w/api.php?origin=*&action=query&generator=search&gsrsearch=${encodeURIComponent(searchTerm)}&gsrlimit=1&prop=imageinfo&iiprop=url&format=json`
    );

    const mediaData = await mediaRes.json();

    if (mediaData.query && mediaData.query.pages) {
      const pages = Object.values(mediaData.query.pages);

      if (pages.length && pages[0].imageinfo) {
        const url = pages[0].imageinfo[0].url;
        imageCache[key] = url;
        return url;
      }
    }
  } catch {}

  return null;
}
// ══════════════════════════════════════════════
//  THEME TOGGLE
// ══════════════════════════════════════════════

function toggleTheme() {
  const html   = document.documentElement;
  const icon   = document.getElementById('theme-icon');
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  icon.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('fv-theme', isDark ? 'light' : 'dark');
}

// Apply saved theme immediately on page load
(function () {
  const saved = localStorage.getItem('fv-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = saved === 'light' ? '☀️' : '🌙';
  }
})();

// ══════════════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════════════

function showPage(page) {
  const homeEl    = document.getElementById('home-page');
  const manageEl  = document.getElementById('manage-page');
  const navHome   = document.getElementById('nav-home');
  const navManage = document.getElementById('nav-manage');

  if (page === 'home') {
    homeEl.style.display   = 'block';
    manageEl.style.display = 'none';
    navHome.classList.add('active');
    navManage.classList.remove('active');
    loadHomeCards();
  } else {
    homeEl.style.display   = 'none';
    manageEl.style.display = 'block';
    navHome.classList.remove('active');
    navManage.classList.add('active');
    getFoods();
  }
}


async function injectTableImage(foodName, wrapperId) {
  const url = await getFoodImageURL(foodName);
  const wrap = document.getElementById(wrapperId);
  if (!wrap) return;
  if (url) {
    const img = document.createElement('img');
    img.className = 'table-img';
    img.alt = foodName;
    img.onload = () => img.classList.add('loaded');
    img.onerror = () => img.remove();
    img.src = url;
    wrap.appendChild(img);
  }
}

// Returns the placeholder HTML for a table row (image injected after)
function makeTableImgHTML(foodName, wrapperId) {
  return `
    <div class="table-img-wrap" id="${wrapperId}">
      <span class="table-emoji">🍽</span>
    </div>`;
}

// Injects image into an already-rendered card wrapper div
async function injectCardImage(foodName, wrapperId) {
  const url = await getFoodImageURL(foodName);
  const wrap = document.getElementById(wrapperId);
  if (!wrap) return;
  if (url) {
    const img = document.createElement('img');
    img.className = 'food-card-img';
    img.alt = foodName;
    img.onload = () => img.classList.add('loaded');
    img.onerror = () => img.remove();
    img.src = url;
    wrap.appendChild(img);
  }
}

// Returns placeholder card HTML (image injected after)
function makeFoodCardHTML(item, imgWrapperId) {
  return `
    <div class="food-card">
      <div class="food-card-img-wrap" id="${imgWrapperId}">
        <span class="food-card-emoji">🍽</span>
      </div>
      <div class="food-card-body">
        <div class="food-card-name">${escapeHTML(item.foodName)}</div>
        <div class="food-card-desc">${escapeHTML(item.foodDescription)}</div>
      </div>
    </div>`;
}

// ══════════════════════════════════════════════
//  HOME DASHBOARD
// ══════════════════════════════════════════════

async function loadHomeCards() {
  const grid = document.getElementById('home-food-cards');
  try {
    const res   = await fetch(API_URL);
    const foods = await res.json();

    // Stats
    document.getElementById('stat-total').textContent  = foods.length;
    document.getElementById('stat-latest').textContent =
      foods.length > 0 ? foods[0].foodName : '—';

    // Cards (latest 6)
    if (foods.length === 0) {
      grid.innerHTML = '<div class="empty-hint">No items yet — go to Manage Menu to add some!</div>';
      return;
    }
    const latestFoods = foods.slice(0, 6);

    grid.innerHTML = latestFoods.map((item, i) =>
      makeFoodCardHTML(item, `card-img-${i}`)
    ).join('');

    latestFoods.forEach((item, i) => {
      injectCardImage(item.foodName, `card-img-${i}`);
    });

  } catch {
    grid.innerHTML = '<div class="empty-hint">⚠️ Could not load items. Is the server running?</div>';
  }
}

// ══════════════════════════════════════════════
//  GET ALL FOODS → render table
// ══════════════════════════════════════════════

let allFoods = [];

async function getFoods() {
  try {
    const res = await fetch(API_URL);
    allFoods  = await res.json();
    renderTable(allFoods);
  } catch {
    showToast('❌ Cannot reach server. Is it running?', 'error');
  }
}

// ══════════════════════════════════════════════
//  RENDER TABLE
// ══════════════════════════════════════════════

function renderTable(foods) {
  const tbody = document.getElementById('foodTableBody');
  const countEl = document.getElementById('item-count');

  countEl.textContent = `${foods.length} item${foods.length !== 1 ? 's' : ''}`;

  if (foods.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-row">No items found.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = foods.map((item, i) => `
    <tr>
      <td class="row-num">${String(i + 1).padStart(2, '0')}</td>
      <td>${makeTableImgHTML(item.foodName, `img-${i}`)}</td>
      <td class="food-name-cell">${escapeHTML(item.foodName)}</td>
      <td class="food-desc-cell">${escapeHTML(item.foodDescription)}</td>
      <td>
        <div class="action-wrap">
          <button class="btn-edit"
            onclick="startEdit(
              '${item._id}',
              '${escapeAttr(item.foodName)}',
              '${escapeAttr(item.foodDescription)}'
            )">
            ✏️ Edit
          </button>

          <button class="btn-del" onclick="deleteFood('${item._id}')">
            🗑 Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  // IMPORTANT: inject images AFTER rendering
  foods.forEach((item, i) => {
    injectTableImage(item.foodName, `img-${i}`);
  });
}

// ══════════════════════════════════════════════
//  SEARCH / FILTER (client-side, instant)
// ══════════════════════════════════════════════

function filterTable() {
  const q        = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allFoods.filter(f =>
    f.foodName.toLowerCase().includes(q) ||
    f.foodDescription.toLowerCase().includes(q)
  );
  renderTable(filtered);
}

// ══════════════════════════════════════════════
//  UNIFIED SUBMIT  (Add OR Edit)
// ══════════════════════════════════════════════

async function handleSubmit() {
  const name = document.getElementById('foodName').value.trim();
  const desc = document.getElementById('foodDescription').value.trim();
  const id   = document.getElementById('editId').value;

  if (!name || !desc) {
    showToast('⚠️ Please fill in both fields.', 'error');
    return;
  }

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = id ? 'Saving…' : 'Adding…';

  try {
    const url    = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodName: name, foodDescription: desc })
    });

    if (!res.ok) throw new Error('Request failed');

    showToast(id ? '✅ Item updated!' : '✅ Item added!', 'success');
    clearForm();
    getFoods();
  } catch {
    showToast('❌ Something went wrong. Try again.', 'error');
  } finally {
    btn.disabled = false;
  }
}

// ══════════════════════════════════════════════
//  EDIT — fill form from table row
// ══════════════════════════════════════════════

function startEdit(id, name, desc) {
  document.getElementById('editId').value           = id;
  document.getElementById('foodName').value         = name;
  document.getElementById('foodDescription').value  = desc;
  document.getElementById('submit-btn').textContent = '💾 Save Changes';
  document.getElementById('cancel-btn').style.display = 'inline-block';
  document.getElementById('form-title-label').textContent = '✏️ Edit Food Item';
  document.getElementById('foodName').focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
  clearForm();
  showToast('Edit cancelled.', '');
}

// ══════════════════════════════════════════════
//  DELETE
// ══════════════════════════════════════════════

async function deleteFood(id) {
  if (!confirm('Delete this item? This cannot be undone.')) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    showToast('🗑 Item deleted.', 'success');
    getFoods();
  } catch {
    showToast('❌ Delete failed. Try again.', 'error');
  }
}

// ══════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════

function clearForm() {
  document.getElementById('editId').value           = '';
  document.getElementById('foodName').value         = '';
  document.getElementById('foodDescription').value  = '';
  document.getElementById('submit-btn').textContent = 'Add Food';
  document.getElementById('submit-btn').disabled    = false;
  document.getElementById('cancel-btn').style.display = 'none';
  document.getElementById('form-title-label').textContent = '➕ Add New Food Item';
}

// Prevents XSS when injecting user text into innerHTML
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Safe for inline onclick="..." attribute strings
function escapeAttr(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

// ══════════════════════════════════════════════
//  TOAST NOTIFICATION
// ══════════════════════════════════════════════

let toastTimer = null;

function showToast(message, type) {
  const toast     = document.getElementById('toast');
  toast.textContent = message;
  toast.className   = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = 'toast'; }, 3000);
}

// ══════════════════════════════════════════════
//  INIT — load dashboard on first open
// ══════════════════════════════════════════════
loadHomeCards();