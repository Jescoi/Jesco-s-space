/**
 *  All works data — single source of truth.
 *  Add a new object to WORKS to have it show up everywhere automatically.
 *
 *  Fields:
 *    id          – unique number
 *    title       – work title
 *    subtitle    – secondary title / tagline
 *    category    – use an existing category or invent a new one
 *    year        – "2024" etc.
 *    tags        – tech / skill tags
 *    description – 1–2 sentence summary
 *    color       – accent color for project card glow
 *    image       – optional: "images/your-file.jpg" (leave null for placeholder)
 *    featured    – true = shows in "Selected Projects" section
 *    link        – optional external URL
 */

export const WORKS = [
  {
    id: 1,
    title: "Reading the City: Xiaoyan's Time-travel Adventure",
    subtitle: 'Creative Web Design',
    category: 'Web Design',
    year: '2024',
    tags: ['HTML', 'CSS', 'Interactive', '360° Model'],
    description:
      'This creation combines physical postcards with digital Quanzhou World Heritage guided tours. Centered on a time-travel kids\' story, it features real-scene illustrations and 360° interactive 3D building models. It breaks traditional static postcard limits, enabling paper-code scanning for immersive virtual city exploration. Featuring landmark sites like Liusheng Pagoda and Qingjing Temple, it vividly presents Quanzhou\'s ancient overseas trade culture and open heritage spirit with rich interactivity.',
    color: '#4fc3f7',
    image: 'images/works/work1_cover.png',
    photos: ['images/works/work1_1.jpg', 'images/works/work1_2.jpg', 'images/works/work1_3.png'],
    featured: true,
    link: 'https://jescoi.github.io/quanzhou_memory/',
  },
  {
    id: 2,
    title: 'From Unity of Nature and Humanity to Modern Development: The Outstanding Achievement of Qi\'ao Island',
    subtitle: 'Documentary',
    category: 'Video Production',
    year: '2024',
    tags: ['Documentary', 'Filmmaking', 'Ecology', 'Taoist Culture'],
    description:
      'This documentary explores the harmonious coexistence of humans and nature on Qi\'ao Island and delves into its inherent Taoist thoughts. Split into three parts, it traces the island\'s evolution from ancient times to the present, showing its prosperous development under the concept of man-nature harmony. We interviewed reserve rangers, conservation base staff, former residence workers and local residents to learn about its ecological protection and economic development, and interpret local Taoist culture. From the unity of nature and humanity to modern development, Qi\'ao Island has set a fine example.',
    color: '#9b6dff',
    image: 'images/works/work2_cover.jpg',
    photos: ['images/works/work2_1.png', 'images/works/work2_2.png', 'images/works/work2_3.png', 'images/works/work2_4.png', 'images/works/work2_5.png', 'images/works/work2_6.png'],
    featured: true,
    link: 'https://pan.baidu.com/share/init?surl=99oAr5jh6tgSgfYi12Z_rQ&pwd=1234',
  },
  {
    id: 3,
    title: 'Final Fantasy VII-style Game Opening Intro',
    subtitle: 'Adobe After Effects Motion Work',
    category: 'Motion Design',
    year: '2024',
    tags: ['After Effects', 'VFX', 'Motion Graphics'],
    description:
      'This work is a Final Fantasy VII style game opening intro. I drew characters, backgrounds and UI elements with Adobe Illustrator, and completed video editing and animation production via Adobe After Effects.',
    color: '#f472b6',
    image: 'images/works/work3_cover.png',
    photos: ['images/works/work3_1.png', 'images/works/work3_2.png', 'images/works/work3_3.png'],
    featured: true,
    link: 'https://github.com/Jescoi/my_portfolio/blob/main/Videos/FinalFantasy_finalproject_jesco_2530031157.mp4',
  },
  {
    id: 4,
    title: 'Photoshop Animation: SpiderJump',
    subtitle: 'Frame-by-Frame Animation',
    category: 'Animation',
    year: '2024',
    tags: ['Photoshop', 'Frame Animation', 'Character Design'],
    description:
      'This frame-by-frame animation was created in PhotoShop, using in-game footage as reference and visual material, demonstrating timing and motion principles.',
    color: '#34d399',
    image: 'images/works/work4_cover.png',
    photos: ['images/works/work4_1.png', 'images/works/work4_2.png', 'images/works/work4_3.png'],
    featured: false,
    link: 'https://github.com/Jescoi/my_portfolio/tree/main/Animation',
  },
  {
    id: 5,
    title: 'X-Pan Format Photography Collection',
    subtitle: 'Panoramic Visual Storytelling',
    category: 'Photography',
    year: '2024',
    tags: ['Photography', 'Post-Processing', 'X-Pan Format'],
    description:
      'Inspired by the unique 65:24 panoramic format of the Hasselblad X-Pan, this work is perfect for capturing Xinjiang\'s magnificent scenery. To mimic the distinctive look of film, I specially color-graded the photos and added grain for more texture.',
    color: '#fbbf24',
    image: 'images/works/work5_cover.jpg',
    photos: ['images/works/work5_1.jpg', 'images/works/work5_2.jpg', 'images/works/work5_3.jpg'],
    featured: false,
    link: 'https://github.com/Jescoi/my_portfolio/tree/main/Photograhpy/X-pan%20portfolio',
  },
  {
    id: 6,
    title: 'Unity Engine Practice Projects',
    subtitle: 'Personal Practical Skill Development',
    category: 'Game Dev',
    year: '2024',
    tags: ['Unity', 'C#', 'Game Development'],
    description:
      'A series of personal Unity projects built to develop core game development skills, including scripting, physics, and scene design.',
    color: '#818cf8',
    image: 'images/works/work6_cover.jpg',
    photos: ['images/works/work6_1.png', 'images/works/work6_2.png', 'images/works/work6_3.png'],
    featured: false,
    link: 'https://github.com/Jescoi/my_portfolio/tree/main/Unity%20initial%20game%20demo',
  },
];

/* ── Convenience helpers ── */

/** All unique categories sorted alphabetically (for filter bar) */
export const CATEGORIES = ['All', ...Array.from(new Set(WORKS.map((w) => w.category)))];

/** Only featured works (for "Selected Projects" section) */
export const FEATURED = WORKS.filter((w) => w.featured);

/** Works for the detailed showcase (all, after the grid) */
export const ALL = WORKS;
