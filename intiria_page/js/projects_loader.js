/**
 * projects_loader.js
 * Dynamically fetches project folders and images from the GitHub repo
 * and renders them as project cards with carousels on projects.html
 */

// Local cache file replacing GitHub API to avoid rate limits
const LOCAL_DATA_FILE = 'projects_data.json';

// Mapping folder names → project metadata
// Add or edit entries here to control how each folder appears on the page
const PROJECT_META = {
  'M3M Solitude, sector -89, gurugram': {
    title: 'M3M Solitude',
    location: 'Sector-89, Gurugram',
    type: 'Residential',
    icon: 'fa-home',
    desc: 'Premium interior execution featuring high-end master bedroom concepts, customised study lounges, dining areas, and modern modular kitchen setups.'
  },
  'Govindpuram': {
    title: 'Govindpuram Residence',
    location: 'Govindpuram, Ghaziabad',
    type: 'Residential',
    icon: 'fa-home',
    desc: 'Complete home interiors with a focus on space optimisation, vibrant living areas, and a custom modular kitchen with premium finishes.'
  },
  'Jasola': {
    title: 'Jasola Apartment',
    location: 'Jasola, New Delhi',
    type: 'Residential',
    icon: 'fa-home',
    desc: 'Contemporary flat interiors blending minimalist aesthetics with functional storage solutions and warm, layered lighting throughout.'
  },
  'ramprastha green Ghaziabad': {
    title: 'Ramprastha Green',
    location: 'Ghaziabad',
    type: 'Residential',
    icon: 'fa-home',
    desc: 'Thoughtfully designed apartment interior with an open-plan living concept, custom millwork, and curated material palette.'
  },
  'Zirakpur': {
    title: 'Zirakpur Villa',
    location: 'Zirakpur, Punjab',
    type: 'Residential',
    icon: 'fa-home',
    desc: 'Luxury villa interiors featuring high-ceiling living rooms, bespoke wooden panelling, and premium bathroom fittings.'
  },
  'Sonu Yadav': {
    title: 'Sonu Yadav Residence',
    location: 'Delhi NCR',
    type: 'Residential',
    icon: 'fa-home',
    desc: 'Full home interior execution with attention to detail in every room — from the foyer to the master bedroom and kitchen.'
  },
  'aashish bhola': {
    title: 'Aashish Bhola Residence',
    location: 'Delhi NCR',
    type: 'Residential',
    icon: 'fa-home',
    desc: 'Stylish 3BHK interiors combining natural textures, ambient lighting, and functional layouts designed for a modern family.'
  },
  'Sec 91 faridabad': {
    title: 'Sector 91 Faridabad',
    location: 'Faridabad, Haryana',
    type: 'Residential',
    icon: 'fa-home',
    desc: 'Vibrant residential interiors in a gated community — featuring bold accent walls, modular furniture, and designer fixtures.'
  },
  'Tronica city( Green city)': {
    title: 'Tronica City — Green City',
    location: 'Tronica City, Ghaziabad',
    type: 'Residential',
    icon: 'fa-home',
    desc: 'Earthy green-themed interiors for a nature-inspired home — wooden elements, textured walls, and organic décor throughout.'
  },
  'Dr. Surmayee dental Clinic': {
    title: 'Dr. Surmayee Dental Clinic',
    location: 'Delhi NCR',
    type: 'Commercial',
    icon: 'fa-clinic-medical',
    desc: 'Modern dental clinic interior with calming whites, hygienic finishes, well-lit treatment bays, and a welcoming reception area.'
  },
  'Hospital in Loni Design': {
    title: 'Hospital — Loni',
    location: 'Loni, Ghaziabad',
    type: 'Commercial',
    icon: 'fa-hospital',
    desc: 'Full interior design for a multi-room hospital facility — including OPDs, waiting areas, nurse stations, and administrative zones.'
  },
  'commercial': {
    title: 'Commercial Projects',
    location: 'Delhi NCR',
    type: 'Commercial',
    icon: 'fa-building',
    desc: 'A curated portfolio of office, retail, and corporate interiors delivered across Delhi NCR.'
  },
  'ingress Office 3D': {
    title: 'Ingress Office',
    location: 'Delhi NCR',
    type: 'Commercial',
    icon: 'fa-briefcase',
    desc: '3D-designed contemporary office space featuring collaborative work zones, executive cabins, and a bold brand-driven reception.'
  },
  'interior of cafe': {
    title: 'Café Interior',
    location: 'Delhi NCR',
    type: 'Commercial',
    icon: 'fa-coffee',
    desc: 'Warm café interior with rustic wooden accents, curated lighting, and a layout that encourages both socialising and focused work.'
  },
  'Afzalpur resort 3D': {
    title: 'Afzalpur Resort',
    location: 'Afzalpur',
    type: 'Hospitality',
    icon: 'fa-hotel',
    desc: '3D-conceptualised resort design featuring natural materials, open-air pavilions, luxury rooms, and a resort-style swimming pool area.'
  },
  'industrial': {
    title: 'Industrial Projects',
    location: 'Delhi NCR',
    type: 'Industrial',
    icon: 'fa-industry',
    desc: 'Functional and efficient industrial space designs — warehouses, factories, and production facilities with ergonomic planning.'
  },
  'residential': {
    title: 'Residential Portfolio',
    location: 'Pan India',
    type: 'Residential',
    icon: 'fa-home',
    desc: 'A comprehensive portfolio of residential projects delivered across India, from compact apartments to sprawling villas.'
  }
};

// Type color map
const TYPE_COLORS = {
  Residential: '#a13d2d',
  Commercial:  '#2d6aa1',
  Hospitality: '#7a5c2d',
  Industrial:  '#4a4a4a'
};

// ─────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────

// GitHub API fetching was removed to prevent 403 Rate Limit errors.
// All image data is now pre-generated in projects_data.json.

// ─────────────────────────────────────────────
// Render a single project card
// ─────────────────────────────────────────────

function renderProjectCard(folderName, meta, images, index) {
  const trackId = `track-gh-${index}`;
  const dotsId  = `dots-gh-${index}`;
  const typeColor = TYPE_COLORS[meta.type] || '#a13d2d';

  // Build slides HTML
  const slidesHtml = images.length > 0
    ? images.map((img, i) => `
        <div class="carousel-slide" data-index="${i}">
          <img
            src="${img.url}"
            alt="${meta.title} — image ${i + 1}"
            loading="lazy"
            onerror="this.parentElement.style.display='none'"
          >
          ${i === 0 ? `<div class="view-details-overlay"><span>View details <i class="fas fa-external-link-alt"></i></span></div>` : ''}
        </div>`).join('')
    : `<div class="carousel-slide no-image" style="background:#f4ede5;display:flex;align-items:center;justify-content:center;height:200px;border-radius:16px;color:#a13d2d;font-size:0.9rem;">No images available yet</div>`;

  // Dot count (max 5 dots regardless of image count)
  const dotCount = Math.min(images.length, 5);
  const dotsHtml = Array.from({ length: dotCount }, (_, i) =>
    `<div class="progress-dot ${i === 0 ? 'active' : ''}" data-track="${trackId}" data-dot="${i}"></div>`
  ).join('');

  return `
    <div class="project-card" data-project="${folderName}">
      <div class="project-card-header">
        <div>
          <div class="project-type" style="color:${typeColor}">
            <i class="fas ${meta.icon}"></i> ${meta.type}
          </div>
          <h2>${meta.title}</h2>
          <div class="project-location">
            <i class="fas fa-map-marker-alt"></i> ${meta.location}
          </div>
        </div>
        <p class="project-desc">${meta.desc}</p>
      </div>
      <div class="project-carousel" style="position:relative">
        <div class="carousel-track-wrap">
          <div class="carousel-track" id="${trackId}">
            ${slidesHtml}
          </div>
        </div>
        ${images.length > 4 ? `
        <button class="carousel-btn prev" onclick="ghScrollCarousel('${trackId}', -1)" aria-label="Previous">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="carousel-btn next" onclick="ghScrollCarousel('${trackId}', 1)" aria-label="Next">
          <i class="fas fa-chevron-right"></i>
        </button>` : ''}
        ${dotCount > 1 ? `<div class="carousel-progress" id="${dotsId}">${dotsHtml}</div>` : ''}
      </div>
    </div>`;
}

// ─────────────────────────────────────────────
// Main: fetch repo root → build all project cards
// ─────────────────────────────────────────────

async function loadProjectsFromGitHub() {
  const gallery = document.getElementById('projects-gallery');
  const container = gallery ? gallery.querySelector('.container') : null;
  if (!container) {
    console.warn('[projects_loader] Could not find #projects-gallery .container');
    return;
  }

  // Show loading state
  container.innerHTML = `
    <div style="text-align:center;padding:80px 0;color:#a13d2d;">
      <i class="fas fa-spinner fa-spin" style="font-size:2rem;margin-bottom:16px;display:block;"></i>
      <p style="font-size:1rem;color:#665f59;">Loading projects from GitHub…</p>
    </div>`;

  try {
    // Fetch cached projects data
    const res = await fetch(LOCAL_DATA_FILE);
    if (!res.ok) throw new Error(`Local data fetch error: ${res.status}`);
    const staticData = await res.json();

    if (staticData.length === 0) {
      container.innerHTML = '<p style="text-align:center;padding:40px;color:#665f59;">No projects found.</p>';
      return;
    }

    // Sort: Residential first, then Commercial, etc.
    const order = ['Residential', 'Commercial', 'Hospitality', 'Industrial'];
    staticData.sort((a, b) => {
      const ai = order.indexOf(PROJECT_META[a.folderName]?.type || '');
      const bi = order.indexOf(PROJECT_META[b.folderName]?.type || '');
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    // Map to expected format
    const projectsData = staticData.map((folder, idx) => ({
      folderName: folder.folderName,
      meta: PROJECT_META[folder.folderName],
      images: folder.images,
      idx: idx
    }));

    // Render all cards
    container.innerHTML = projectsData
      .map(p => renderProjectCard(p.folderName, p.meta, p.images, p.idx))
      .join('');

    console.log(`[projects_loader] Rendered ${projectsData.length} project cards.`);

  } catch (err) {
    console.error('[projects_loader] Failed to load projects:', err);
    container.innerHTML = `
      <div style="text-align:center;padding:60px 0;color:#a13d2d;">
        <i class="fas fa-exclamation-triangle" style="font-size:2rem;margin-bottom:12px;display:block;"></i>
        <p>Unable to load projects right now. Please try again later.</p>
      </div>`;
  }
}

// ─────────────────────────────────────────────
// Carousel scroll logic (global, called from onclick)
// ─────────────────────────────────────────────

const _ghCarouselState = {};

window.ghScrollCarousel = function(trackId, dir) {
  const track = document.getElementById(trackId);
  if (!track) return;
  const slides = track.querySelectorAll('.carousel-slide');
  if (!slides.length) return;

  const slideWidth = slides[0].offsetWidth + 16; // gap = 16px
  const visibleCount = 4;
  const maxIndex = Math.max(0, slides.length - visibleCount);

  if (!_ghCarouselState[trackId]) _ghCarouselState[trackId] = 0;
  _ghCarouselState[trackId] = Math.max(0, Math.min(maxIndex, _ghCarouselState[trackId] + dir));
  track.style.transform = `translateX(-${_ghCarouselState[trackId] * slideWidth}px)`;

  // Update dots
  const dotsContainer = document.querySelector(`[id^="dots-"]`);
  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll(`.progress-dot[data-track="${trackId}"]`);
    if (dots.length) {
      const dotIndex = Math.round((_ghCarouselState[trackId] / maxIndex) * (dots.length - 1));
      dots.forEach((d, i) => d.classList.toggle('active', i === dotIndex));
    }
  }
};

// ─────────────────────────────────────────────
// Auto-init when DOM is ready
// ─────────────────────────────────────────────

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadProjectsFromGitHub);
} else {
  loadProjectsFromGitHub();
}
