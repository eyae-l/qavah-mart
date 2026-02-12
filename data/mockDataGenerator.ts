/**
 * Mock Data Generator for Qavah-mart
 * 
 * Generates realistic sample data for products, users, sellers, and reviews
 * across all seven categories and 16 supported brands.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.4, 3.1, 7.1
 */

import {
  Product,
  User,
  Seller,
  Review,
  Location,
  ProductCondition,
  ProductStatus,
  SupportedBrand,
  SUPPORTED_BRANDS,
  CATEGORY_STRUCTURE,
  CategorySlug,
  ProductSpecifications,
} from '../types';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Seeded random number generator for consistent data generation
 * This ensures server and client generate the same "random" data
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number = 12345) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  reset(seed: number = 12345): void {
    this.seed = seed;
  }
}

// Global seeded random instance
const seededRandom = new SeededRandom(12345);

/**
 * Generate a random ID
 */
function generateId(): string {
  return seededRandom.next().toString(36).substring(2, 15) + seededRandom.next().toString(36).substring(2, 15);
}

/**
 * Get random element from array
 */
function randomElement<T>(array: T[]): T {
  return array[Math.floor(seededRandom.next() * array.length)];
}

/**
 * Get random number between min and max
 */
function randomNumber(min: number, max: number): number {
  return Math.floor(seededRandom.next() * (max - min + 1)) + min;
}

/**
 * Get random date within the past year
 */
function randomDate(daysAgo: number = 365): Date {
  const now = new Date();
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const randomTime = past.getTime() + seededRandom.next() * (now.getTime() - past.getTime());
  return new Date(randomTime);
}

// ============================================================================
// Location Data
// ============================================================================

const ETHIOPIAN_LOCATIONS: Location[] = [
  { city: 'Addis Ababa', region: 'Addis Ababa', country: 'Ethiopia' },
  { city: 'Dire Dawa', region: 'Dire Dawa', country: 'Ethiopia' },
  { city: 'Mekelle', region: 'Tigray', country: 'Ethiopia' },
  { city: 'Gondar', region: 'Amhara', country: 'Ethiopia' },
  { city: 'Bahir Dar', region: 'Amhara', country: 'Ethiopia' },
  { city: 'Hawassa', region: 'Sidama', country: 'Ethiopia' },
  { city: 'Adama', region: 'Oromia', country: 'Ethiopia' },
  { city: 'Jimma', region: 'Oromia', country: 'Ethiopia' },
  { city: 'Dessie', region: 'Amhara', country: 'Ethiopia' },
  { city: 'Harar', region: 'Harari', country: 'Ethiopia' },
];

// ============================================================================
// Product Specifications by Category
// ============================================================================

const LAPTOP_SPECS = {
  processors: [
    'Intel Core i3-1115G4',
    'Intel Core i5-1135G7',
    'Intel Core i5-12450H',
    'Intel Core i7-1165G7',
    'Intel Core i7-12700H',
    'Intel Core i9-12900H',
    'AMD Ryzen 5 5500U',
    'AMD Ryzen 5 5600H',
    'AMD Ryzen 7 5800H',
    'AMD Ryzen 9 5900HX',
    'Apple M1',
    'Apple M2',
    'Apple M2 Pro',
  ],
  memory: ['4GB DDR4', '8GB DDR4', '16GB DDR4', '32GB DDR4', '16GB DDR5', '32GB DDR5', '64GB DDR5'],
  storage: ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD', '512GB NVMe', '1TB NVMe', '2TB NVMe'],
  graphics: [
    'Intel UHD Graphics',
    'Intel Iris Xe Graphics',
    'NVIDIA GeForce GTX 1650',
    'NVIDIA GeForce RTX 3050',
    'NVIDIA GeForce RTX 3060',
    'NVIDIA GeForce RTX 3070',
    'NVIDIA GeForce RTX 4060',
    'NVIDIA GeForce RTX 4070',
    'AMD Radeon RX 6600M',
    'AMD Radeon RX 6700M',
  ],
  screenSizes: ['13.3"', '14"', '15.6"', '16"', '17.3"'],
  operatingSystems: ['Windows 11 Home', 'Windows 11 Pro', 'macOS Ventura', 'macOS Sonoma', 'Ubuntu 22.04'],
};

const DESKTOP_SPECS = {
  processors: [
    'Intel Core i3-12100',
    'Intel Core i5-12400',
    'Intel Core i5-13600K',
    'Intel Core i7-12700K',
    'Intel Core i7-13700K',
    'Intel Core i9-13900K',
    'AMD Ryzen 5 5600X',
    'AMD Ryzen 5 7600X',
    'AMD Ryzen 7 5800X3D',
    'AMD Ryzen 9 5950X',
    'AMD Ryzen 9 7950X',
  ],
  memory: ['8GB DDR4', '16GB DDR4', '32GB DDR4', '64GB DDR4', '32GB DDR5', '64GB DDR5', '128GB DDR5'],
  storage: ['512GB SSD', '1TB SSD', '2TB SSD', '4TB SSD', '1TB NVMe + 2TB HDD', '2TB NVMe + 4TB HDD'],
  graphics: [
    'Intel UHD Graphics 730',
    'NVIDIA GeForce GTX 1660 Super',
    'NVIDIA GeForce RTX 3060',
    'NVIDIA GeForce RTX 3070',
    'NVIDIA GeForce RTX 3080',
    'NVIDIA GeForce RTX 4070',
    'NVIDIA GeForce RTX 4080',
    'NVIDIA GeForce RTX 4090',
    'AMD Radeon RX 6700 XT',
    'AMD Radeon RX 7900 XTX',
  ],
  operatingSystems: ['Windows 11 Home', 'Windows 11 Pro', 'Ubuntu 22.04', 'No OS'],
};

const COMPONENT_SPECS = {
  cpuSockets: ['LGA 1700', 'LGA 1200', 'AM4', 'AM5'],
  cpuCores: ['4 cores / 8 threads', '6 cores / 12 threads', '8 cores / 16 threads', '12 cores / 24 threads', '16 cores / 32 threads'],
  gpuMemory: ['4GB GDDR6', '6GB GDDR6', '8GB GDDR6', '12GB GDDR6', '16GB GDDR6', '24GB GDDR6X'],
  ramSpeed: ['2666MHz', '3200MHz', '3600MHz', '4800MHz', '5200MHz', '6000MHz'],
  storageCapacity: ['256GB', '512GB', '1TB', '2TB', '4TB', '8TB'],
  storageInterface: ['SATA III', 'NVMe PCIe 3.0', 'NVMe PCIe 4.0', 'NVMe PCIe 5.0'],
  motherboardFormFactor: ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX'],
  motherboardChipset: ['Intel Z790', 'Intel B760', 'AMD X670E', 'AMD B650'],
};

const PERIPHERAL_SPECS = {
  monitorResolution: ['1920x1080 (Full HD)', '2560x1440 (QHD)', '3840x2160 (4K)', '3440x1440 (Ultrawide)'],
  monitorRefreshRate: ['60Hz', '75Hz', '144Hz', '165Hz', '240Hz', '360Hz'],
  monitorPanelType: ['IPS', 'VA', 'TN', 'OLED'],
  monitorSize: ['24"', '27"', '32"', '34"', '49"'],
  keyboardType: ['Membrane', 'Mechanical (Blue)', 'Mechanical (Brown)', 'Mechanical (Red)', 'Optical'],
  mouseType: ['Wired', 'Wireless', '2.4GHz Wireless', 'Bluetooth'],
  mouseDPI: ['800-3200 DPI', '1600-6400 DPI', '100-16000 DPI', '100-25600 DPI'],
  speakerPower: ['10W', '20W', '40W', '60W', '100W'],
  webcamResolution: ['720p', '1080p', '1440p', '4K'],
};

const NETWORKING_SPECS = {
  routerSpeed: ['AC1200', 'AC1750', 'AC3200', 'AX1800', 'AX3000', 'AX6000'],
  routerBands: ['Single Band (2.4GHz)', 'Dual Band (2.4GHz + 5GHz)', 'Tri Band (2.4GHz + 5GHz + 6GHz)'],
  switchPorts: ['5-port', '8-port', '16-port', '24-port', '48-port'],
  switchSpeed: ['10/100 Mbps', 'Gigabit (10/100/1000)', '2.5 Gigabit', '10 Gigabit'],
  modemType: ['Cable', 'DSL', 'Fiber', 'LTE'],
  networkCardSpeed: ['Gigabit Ethernet', '2.5 Gigabit Ethernet', '10 Gigabit Ethernet', 'Wi-Fi 6 (AX)', 'Wi-Fi 6E'],
};

// ============================================================================
// Product Title Templates
// ============================================================================

const PRODUCT_TITLES = {
  laptops: {
    Gaming: [
      '{brand} Gaming Laptop {processor} {graphics} {memory} {storage}',
      '{brand} {screenSize} Gaming Notebook {processor} {graphics}',
      '{brand} High Performance Gaming Laptop {graphics} {memory}',
    ],
    Business: [
      '{brand} Business Laptop {processor} {memory} {storage}',
      '{brand} Professional {screenSize} Laptop {processor}',
      '{brand} Enterprise Notebook {processor} {memory}',
    ],
    Ultrabooks: [
      '{brand} Ultrabook {processor} {memory} {storage}',
      '{brand} Slim {screenSize} Laptop {processor}',
      '{brand} Ultra-Portable Notebook {processor}',
    ],
    Budget: [
      '{brand} Budget Laptop {processor} {memory}',
      '{brand} Affordable {screenSize} Notebook',
      '{brand} Entry-Level Laptop {processor}',
    ],
  },
  'desktop-computers': {
    'Gaming PCs': [
      '{brand} Gaming Desktop {processor} {graphics} {memory}',
      '{brand} High-End Gaming PC {graphics} {storage}',
      '{brand} Gaming Tower {processor} {graphics}',
    ],
    Workstations: [
      '{brand} Professional Workstation {processor} {memory}',
      '{brand} Content Creation PC {processor} {graphics}',
      '{brand} Engineering Workstation {processor}',
    ],
    'All-in-One': [
      '{brand} All-in-One Desktop {processor} {memory}',
      '{brand} AIO Computer {screenSize} {processor}',
      '{brand} Space-Saving Desktop {processor}',
    ],
  },
  'computer-components': {
    CPUs: ['{brand} {processor} Processor', '{brand} CPU {cores}', '{brand} {processor} Desktop Processor'],
    GPUs: ['{brand} Graphics Card {gpuMemory}', '{brand} GPU {gpuMemory}', '{brand} Video Card {gpuMemory}'],
    RAM: ['{brand} {memory} RAM {ramSpeed}', '{brand} Memory Kit {memory}', '{brand} {memory} {ramSpeed}'],
    Storage: ['{brand} {storageCapacity} SSD {storageInterface}', '{brand} {storageCapacity} {storageInterface}'],
    Motherboards: ['{brand} {motherboardChipset} Motherboard {motherboardFormFactor}', '{brand} {motherboardFormFactor} Motherboard'],
  },
  peripherals: {
    Monitors: ['{brand} {monitorSize} Monitor {monitorResolution} {monitorRefreshRate}', '{brand} {monitorPanelType} Monitor {monitorSize}'],
    Keyboards: ['{brand} {keyboardType} Keyboard', '{brand} Gaming Keyboard {keyboardType}', '{brand} Mechanical Keyboard'],
    Mice: ['{brand} {mouseType} Mouse {mouseDPI}', '{brand} Gaming Mouse {mouseDPI}', '{brand} Wireless Mouse'],
    Speakers: ['{brand} {speakerPower} Speakers', '{brand} Desktop Speakers {speakerPower}', '{brand} Computer Speakers'],
    Webcams: ['{brand} {webcamResolution} Webcam', '{brand} HD Webcam {webcamResolution}', '{brand} Streaming Webcam'],
  },
  'networking-equipment': {
    Routers: ['{brand} {routerSpeed} Router {routerBands}', '{brand} Wi-Fi Router {routerSpeed}'],
    Switches: ['{brand} {switchPorts} Network Switch {switchSpeed}', '{brand} Ethernet Switch {switchPorts}'],
    Modems: ['{brand} {modemType} Modem', '{brand} High-Speed Modem {modemType}'],
    'Network Cards': ['{brand} Network Card {networkCardSpeed}', '{brand} Ethernet Adapter {networkCardSpeed}'],
    Cables: ['{brand} Ethernet Cable Cat6', '{brand} Network Cable Cat7', '{brand} HDMI Cable 2.1'],
  },
  'software-licenses': {
    'Operating Systems': ['Windows 11 {edition} License', 'Windows 10 {edition} License', 'Microsoft Office 365 Subscription'],
    'Productivity Software': ['Microsoft Office 2021 {edition}', 'Adobe Creative Cloud Subscription', 'Autodesk AutoCAD License'],
    'Security Software': ['Norton 360 Antivirus', 'McAfee Total Protection', 'Kaspersky Internet Security'],
    'Development Tools': ['Visual Studio Professional', 'JetBrains IntelliJ IDEA', 'GitHub Copilot Subscription'],
  },
  'computer-accessories': {
    'Bags & Cases': ['{brand} Laptop Bag {screenSize}', '{brand} Backpack for Laptops', '{brand} Laptop Sleeve'],
    'Cables & Adapters': ['{brand} USB-C Hub', '{brand} HDMI to DisplayPort Adapter', '{brand} USB 3.0 Cable'],
    Cooling: ['{brand} Laptop Cooling Pad', '{brand} CPU Cooler', '{brand} Case Fans RGB'],
    'Power Supplies': ['{brand} {wattage}W Power Supply', '{brand} Modular PSU {wattage}W'],
    'Other Accessories': ['{brand} Laptop Stand', '{brand} Monitor Arm', '{brand} Cable Management Kit'],
  },
};

// ============================================================================
// Brand-Category Mapping
// ============================================================================

const BRAND_CATEGORIES: Record<SupportedBrand, CategorySlug[]> = {
  Dell: ['laptops', 'desktop-computers', 'peripherals', 'software-licenses'],
  HP: ['laptops', 'desktop-computers', 'peripherals', 'software-licenses'],
  Lenovo: ['laptops', 'desktop-computers', 'peripherals', 'software-licenses'],
  ASUS: ['laptops', 'desktop-computers', 'computer-components', 'peripherals', 'networking-equipment', 'software-licenses'],
  Acer: ['laptops', 'desktop-computers', 'peripherals', 'software-licenses'],
  MSI: ['laptops', 'desktop-computers', 'computer-components', 'peripherals', 'software-licenses'],
  Apple: ['laptops', 'desktop-computers', 'software-licenses'],
  Intel: ['computer-components', 'software-licenses'],
  AMD: ['computer-components', 'software-licenses'],
  NVIDIA: ['computer-components', 'software-licenses'],
  Corsair: ['computer-components', 'peripherals', 'computer-accessories', 'software-licenses'],
  Kingston: ['computer-components', 'software-licenses'],
  Samsung: ['computer-components', 'peripherals', 'software-licenses'],
  Logitech: ['peripherals', 'computer-accessories', 'software-licenses'],
  Razer: ['peripherals', 'computer-accessories', 'software-licenses'],
  SteelSeries: ['peripherals', 'computer-accessories', 'software-licenses'],
};

// ============================================================================
// Product Generation Functions
// ============================================================================

/**
 * Generate specifications for a laptop
 */
function generateLaptopSpecs(): ProductSpecifications {
  return {
    processor: randomElement(LAPTOP_SPECS.processors),
    memory: randomElement(LAPTOP_SPECS.memory),
    storage: randomElement(LAPTOP_SPECS.storage),
    graphics: randomElement(LAPTOP_SPECS.graphics),
    screenSize: randomElement(LAPTOP_SPECS.screenSizes),
    operatingSystem: randomElement(LAPTOP_SPECS.operatingSystems),
    warranty: randomElement(['1 year', '2 years', '3 years']),
  };
}

/**
 * Generate specifications for a desktop
 */
function generateDesktopSpecs(): ProductSpecifications {
  return {
    processor: randomElement(DESKTOP_SPECS.processors),
    memory: randomElement(DESKTOP_SPECS.memory),
    storage: randomElement(DESKTOP_SPECS.storage),
    graphics: randomElement(DESKTOP_SPECS.graphics),
    operatingSystem: randomElement(DESKTOP_SPECS.operatingSystems),
    warranty: randomElement(['1 year', '2 years', '3 years']),
  };
}

/**
 * Generate specifications for computer components
 */
function generateComponentSpecs(subcategory: string): ProductSpecifications {
  switch (subcategory) {
    case 'CPUs':
      return {
        socket: randomElement(COMPONENT_SPECS.cpuSockets),
        cores: randomElement(COMPONENT_SPECS.cpuCores),
        warranty: randomElement(['1 year', '3 years']),
      };
    case 'GPUs':
      return {
        memory: randomElement(COMPONENT_SPECS.gpuMemory),
        warranty: randomElement(['2 years', '3 years']),
      };
    case 'RAM':
      return {
        speed: randomElement(COMPONENT_SPECS.ramSpeed),
        warranty: 'Lifetime',
      };
    case 'Storage':
      return {
        capacity: randomElement(COMPONENT_SPECS.storageCapacity),
        interface: randomElement(COMPONENT_SPECS.storageInterface),
        warranty: randomElement(['3 years', '5 years']),
      };
    case 'Motherboards':
      return {
        formFactor: randomElement(COMPONENT_SPECS.motherboardFormFactor),
        chipset: randomElement(COMPONENT_SPECS.motherboardChipset),
        warranty: randomElement(['1 year', '3 years']),
      };
    default:
      return {};
  }
}

/**
 * Generate specifications for peripherals
 */
function generatePeripheralSpecs(subcategory: string): ProductSpecifications {
  switch (subcategory) {
    case 'Monitors':
      return {
        size: randomElement(PERIPHERAL_SPECS.monitorSize),
        resolution: randomElement(PERIPHERAL_SPECS.monitorResolution),
        refreshRate: randomElement(PERIPHERAL_SPECS.monitorRefreshRate),
        panelType: randomElement(PERIPHERAL_SPECS.monitorPanelType),
        warranty: randomElement(['1 year', '3 years']),
      };
    case 'Keyboards':
      return {
        type: randomElement(PERIPHERAL_SPECS.keyboardType),
        warranty: randomElement(['1 year', '2 years']),
      };
    case 'Mice':
      return {
        type: randomElement(PERIPHERAL_SPECS.mouseType),
        dpi: randomElement(PERIPHERAL_SPECS.mouseDPI),
        warranty: randomElement(['1 year', '2 years']),
      };
    case 'Speakers':
      return {
        power: randomElement(PERIPHERAL_SPECS.speakerPower),
        warranty: '1 year',
      };
    case 'Webcams':
      return {
        resolution: randomElement(PERIPHERAL_SPECS.webcamResolution),
        warranty: '1 year',
      };
    default:
      return {};
  }
}

/**
 * Generate specifications for networking equipment
 */
function generateNetworkingSpecs(subcategory: string): ProductSpecifications {
  switch (subcategory) {
    case 'Routers':
      return {
        speed: randomElement(NETWORKING_SPECS.routerSpeed),
        bands: randomElement(NETWORKING_SPECS.routerBands),
        warranty: randomElement(['1 year', '2 years']),
      };
    case 'Switches':
      return {
        ports: randomElement(NETWORKING_SPECS.switchPorts),
        speed: randomElement(NETWORKING_SPECS.switchSpeed),
        warranty: randomElement(['1 year', '3 years']),
      };
    case 'Modems':
      return {
        type: randomElement(NETWORKING_SPECS.modemType),
        warranty: '1 year',
      };
    case 'Network Cards':
      return {
        speed: randomElement(NETWORKING_SPECS.networkCardSpeed),
        warranty: randomElement(['1 year', '2 years']),
      };
    case 'Cables':
      return {
        length: randomElement(['1m', '2m', '3m', '5m', '10m']),
        warranty: '6 months',
      };
    default:
      return {};
  }
}

/**
 * Generate specifications for software licenses
 */
function generateSoftwareSpecs(subcategory: string): ProductSpecifications {
  return {
    licenseType: randomElement(['Perpetual', '1 Year Subscription', '3 Year Subscription']),
    devices: randomElement(['1 device', '3 devices', '5 devices']),
    delivery: 'Digital Download',
  };
}

/**
 * Generate specifications for accessories
 */
function generateAccessorySpecs(subcategory: string): ProductSpecifications {
  const baseSpecs: ProductSpecifications = {
    warranty: randomElement(['6 months', '1 year', '2 years']),
  };

  if (subcategory === 'Power Supplies') {
    baseSpecs.wattage = randomElement(['450W', '550W', '650W', '750W', '850W', '1000W']);
    baseSpecs.efficiency = randomElement(['80+ Bronze', '80+ Gold', '80+ Platinum', '80+ Titanium']);
  }

  return baseSpecs;
}

/**
 * Generate product title from template
 */
function generateProductTitle(
  category: CategorySlug,
  subcategory: string,
  brand: SupportedBrand,
  specs: ProductSpecifications
): string {
  const categoryTitles = PRODUCT_TITLES[category];
  if (!categoryTitles) {
    return `${brand} ${subcategory} Product`;
  }
  
  const templates = categoryTitles[subcategory as keyof typeof categoryTitles] as string[] | undefined;
  if (!templates || !Array.isArray(templates) || templates.length === 0) {
    return `${brand} ${subcategory} Product`;
  }

  const template = randomElement(templates);
  let title = template.replace('{brand}', brand);

  // Replace placeholders with actual specs
  Object.keys(specs).forEach((key) => {
    const value = specs[key];
    if (typeof value === 'string') {
      title = title.replace(`{${key}}`, value);
    }
  });

  // Remove any remaining placeholders
  title = title.replace(/\{[^}]+\}/g, '').replace(/\s+/g, ' ').trim();

  return title;
}

/**
 * Generate product description
 */
function generateProductDescription(
  category: CategorySlug,
  subcategory: string,
  brand: SupportedBrand,
  condition: ProductCondition,
  specs: ProductSpecifications
): string {
  const conditionText = condition === 'new' ? 'Brand new' : condition === 'refurbished' ? 'Professionally refurbished' : 'Used';
  
  const descriptions = [
    `${conditionText} ${brand} ${subcategory.toLowerCase()} in excellent condition. `,
    `High-quality ${brand} product perfect for your computing needs. `,
    `Reliable ${brand} ${subcategory.toLowerCase()} with great performance. `,
  ];

  let description = randomElement(descriptions);

  // Add spec highlights
  const specHighlights: string[] = [];
  if (specs.processor) specHighlights.push(`Powered by ${specs.processor}`);
  if (specs.memory) specHighlights.push(`${specs.memory} RAM`);
  if (specs.storage) specHighlights.push(`${specs.storage} storage`);
  if (specs.graphics) specHighlights.push(`${specs.graphics} graphics`);
  if (specs.screenSize) specHighlights.push(`${specs.screenSize} display`);
  if (specs.resolution) specHighlights.push(`${specs.resolution} resolution`);
  if (specs.refreshRate) specHighlights.push(`${specs.refreshRate} refresh rate`);

  if (specHighlights.length > 0) {
    description += specHighlights.join(', ') + '. ';
  }

  // Add warranty info
  if (specs.warranty) {
    description += `Comes with ${specs.warranty} warranty. `;
  }

  // Add condition-specific text
  if (condition === 'new') {
    description += 'Factory sealed with original packaging. ';
  } else if (condition === 'refurbished') {
    description += 'Tested and certified to work like new. ';
  } else {
    description += 'Well maintained and fully functional. ';
  }

  description += 'Contact seller for more details and to arrange viewing.';

  return description;
}

/**
 * Generate price based on category, condition, and brand
 */
function generatePrice(
  category: CategorySlug,
  subcategory: string,
  brand: SupportedBrand,
  condition: ProductCondition
): number {
  // Base price ranges by category (in ETB)
  const priceRanges: Record<CategorySlug, { min: number; max: number }> = {
    laptops: { min: 15000, max: 150000 },
    'desktop-computers': { min: 20000, max: 200000 },
    'computer-components': { min: 2000, max: 80000 },
    peripherals: { min: 500, max: 50000 },
    'networking-equipment': { min: 1000, max: 30000 },
    'software-licenses': { min: 500, max: 15000 },
    'computer-accessories': { min: 200, max: 10000 },
  };

  const range = priceRanges[category];
  let basePrice = randomNumber(range.min, range.max);

  // Adjust for premium brands
  const premiumBrands: SupportedBrand[] = ['Apple', 'ASUS', 'MSI', 'Razer', 'Corsair'];
  if (premiumBrands.includes(brand)) {
    basePrice *= 1.2;
  }

  // Adjust for condition
  if (condition === 'used') {
    basePrice *= 0.6;
  } else if (condition === 'refurbished') {
    basePrice *= 0.75;
  }

  // Round to nearest 100
  return Math.round(basePrice / 100) * 100;
}

/**
 * Generate a single product
 */
export function generateProduct(
  category: CategorySlug,
  subcategory: string,
  brand: SupportedBrand,
  sellerId: string
): Product {
  const condition: ProductCondition = randomElement(['new', 'used', 'refurbished']);
  
  let specs: ProductSpecifications = {};
  
  // Generate category-specific specs
  if (category === 'laptops') {
    specs = generateLaptopSpecs();
  } else if (category === 'desktop-computers') {
    specs = generateDesktopSpecs();
  } else if (category === 'computer-components') {
    specs = generateComponentSpecs(subcategory);
  } else if (category === 'peripherals') {
    specs = generatePeripheralSpecs(subcategory);
  } else if (category === 'networking-equipment') {
    specs = generateNetworkingSpecs(subcategory);
  } else if (category === 'software-licenses') {
    specs = generateSoftwareSpecs(subcategory);
  } else if (category === 'computer-accessories') {
    specs = generateAccessorySpecs(subcategory);
  }

  const title = generateProductTitle(category, subcategory, brand, specs);
  const description = generateProductDescription(category, subcategory, brand, condition, specs);
  const price = generatePrice(category, subcategory, brand, condition);
  const location = randomElement(ETHIOPIAN_LOCATIONS);
  const createdAt = randomDate(180);
  const status: ProductStatus = Math.random() > 0.1 ? 'active' : randomElement(['sold', 'inactive']);

  return {
    id: generateId(),
    title,
    description,
    price,
    condition,
    category,
    subcategory,
    brand,
    specifications: specs,
    images: [], // Will be populated with placeholder images
    location,
    sellerId,
    createdAt,
    updatedAt: createdAt,
    status,
    views: randomNumber(0, 500),
    favorites: randomNumber(0, 50),
  };
}

// ============================================================================
// User and Seller Generation Functions
// ============================================================================

const FIRST_NAMES = [
  'Abebe', 'Almaz', 'Bekele', 'Chaltu', 'Daniel', 'Eleni', 'Fikadu', 'Genet',
  'Haile', 'Iyasu', 'Kebede', 'Lemlem', 'Mekdes', 'Negash', 'Rahel', 'Samuel',
  'Tadesse', 'Tigist', 'Yohannes', 'Zenebe', 'Amanuel', 'Bethlehem', 'Dawit',
  'Eyerusalem', 'Fasil', 'Hanna', 'Kaleb', 'Marta', 'Natnael', 'Sara',
];

const LAST_NAMES = [
  'Tesfaye', 'Alemayehu', 'Bekele', 'Gebre', 'Haile', 'Kebede', 'Mengistu',
  'Tadesse', 'Wolde', 'Yohannes', 'Abera', 'Desta', 'Girma', 'Kassahun',
  'Mulugeta', 'Negash', 'Shiferaw', 'Tekle', 'Worku', 'Zenebe',
];

const BUSINESS_NAMES = [
  'Tech Solutions Ethiopia',
  'Digital Hub Addis',
  'Computer World ET',
  'Smart Tech Store',
  'IT Pro Ethiopia',
  'Cyber Zone',
  'Tech Market',
  'Digital Plaza',
  'Computer Center',
  'Tech Valley',
  'IT Solutions Hub',
  'Digital Store ET',
  'Tech Paradise',
  'Computer Gallery',
  'Smart IT Store',
];

/**
 * Generate a user
 */
export function generateUser(isSeller: boolean = false): User {
  const firstName = randomElement(FIRST_NAMES);
  const lastName = randomElement(LAST_NAMES);
  const location = randomElement(ETHIOPIAN_LOCATIONS);
  const createdAt = randomDate(730); // Up to 2 years ago

  return {
    id: generateId(),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    firstName,
    lastName,
    phone: `+251${randomNumber(900000000, 999999999)}`,
    location,
    avatar: undefined,
    createdAt,
    isVerified: Math.random() > 0.3,
    isSeller,
  };
}

/**
 * Generate a seller
 */
export function generateSeller(): Seller {
  const user = generateUser(true);
  const businessType = randomElement(['individual', 'business'] as const);
  const joinedDate = user.createdAt;

  return {
    ...user,
    businessName: businessType === 'business' ? randomElement(BUSINESS_NAMES) : undefined,
    businessType,
    verificationStatus: randomElement(['verified', 'pending'] as const),
    rating: Math.round((3 + Math.random() * 2) * 10) / 10, // 3.0 to 5.0
    totalSales: randomNumber(0, 200),
    responseTime: randomNumber(1, 48), // hours
    joinedDate,
  };
}

// ============================================================================
// Review Generation Functions
// ============================================================================

const REVIEW_TITLES = {
  5: [
    'Excellent product!',
    'Highly recommended',
    'Perfect condition',
    'Great value for money',
    'Outstanding quality',
    'Exceeded expectations',
    'Best purchase ever',
  ],
  4: [
    'Very good product',
    'Good quality',
    'Satisfied with purchase',
    'Works well',
    'Good value',
    'Recommended',
  ],
  3: [
    'Decent product',
    'Average quality',
    'Okay for the price',
    'Works as expected',
    'Fair deal',
  ],
  2: [
    'Below expectations',
    'Some issues',
    'Not as described',
    'Could be better',
    'Disappointed',
  ],
  1: [
    'Very disappointed',
    'Poor quality',
    'Not recommended',
    'Waste of money',
    'Major issues',
  ],
};

const REVIEW_COMMENTS = {
  5: [
    'This product exceeded all my expectations. The quality is outstanding and it works perfectly. The seller was very professional and responsive. Highly recommend!',
    'Excellent purchase! The item arrived in perfect condition and exactly as described. Very happy with this transaction.',
    'Amazing product and great seller. Everything went smoothly from start to finish. Will definitely buy from this seller again.',
    'Top quality product! Works flawlessly and the price was very reasonable. The seller provided excellent customer service.',
  ],
  4: [
    'Good product overall. Minor cosmetic issues but nothing that affects functionality. Seller was helpful and responsive.',
    'Very satisfied with this purchase. The product works well and the price was fair. Would recommend.',
    'Solid product that does what it\'s supposed to do. Delivery was quick and seller communication was good.',
    'Happy with the purchase. The product is in good condition and works as expected. Good value for money.',
  ],
  3: [
    'The product is okay. It works but has some minor issues. For the price, it\'s acceptable.',
    'Average product. Does the job but nothing special. Seller was responsive to questions.',
    'Decent purchase. The product is functional but shows some signs of wear. Fair price.',
    'It\'s alright. Works as described but I expected slightly better quality. Still usable.',
  ],
  2: [
    'Disappointed with this purchase. The product has several issues and doesn\'t match the description completely.',
    'Below my expectations. The condition was worse than advertised. Seller could have been more transparent.',
    'Not very satisfied. The product works but has problems that weren\'t mentioned in the listing.',
    'Expected better quality. The product is functional but has noticeable defects.',
  ],
  1: [
    'Very disappointed. The product is not as described and has major issues. Would not recommend.',
    'Poor quality product. Multiple problems and seller was not helpful in resolving issues.',
    'Waste of money. The product barely works and is in much worse condition than advertised.',
    'Extremely unsatisfied. The product is defective and seller refused to address the problems.',
  ],
};

/**
 * Generate a review
 */
export function generateReview(productId: string, userId: string, sellerId: string): Review {
  const rating = Math.random() < 0.7 ? (Math.random() < 0.6 ? 5 : 4) : randomNumber(1, 3);
  const title = randomElement(REVIEW_TITLES[rating as keyof typeof REVIEW_TITLES]);
  const comment = randomElement(REVIEW_COMMENTS[rating as keyof typeof REVIEW_COMMENTS]);
  const createdAt = randomDate(90);

  return {
    id: generateId(),
    productId,
    userId,
    sellerId,
    rating,
    title,
    comment,
    createdAt,
    helpful: randomNumber(0, 20),
    verified: Math.random() > 0.2, // 80% verified purchases
  };
}

// ============================================================================
// Dataset Generation Functions
// ============================================================================

/**
 * Generate a complete dataset of products across all categories and brands
 */
export function generateProductDataset(productsPerSubcategory: number = 5, sellers?: Seller[]): Product[] {
  const products: Product[] = [];
  
  // Use provided sellers or generate new ones
  const productSellers = sellers || Array.from({ length: 30 }, () => generateSeller());
  
  // Iterate through all categories
  Object.entries(CATEGORY_STRUCTURE).forEach(([categorySlug, categoryData]) => {
    const category = categorySlug as CategorySlug;
    
    // Iterate through all subcategories
    categoryData.subcategories.forEach((subcategory) => {
      // Get brands that support this category
      const availableBrands = SUPPORTED_BRANDS.filter((brand) =>
        BRAND_CATEGORIES[brand].includes(category)
      );
      
      // Generate products for each brand in this subcategory
      availableBrands.forEach((brand) => {
        const numProducts = Math.floor(productsPerSubcategory / availableBrands.length) + 1;
        
        for (let i = 0; i < numProducts; i++) {
          const seller = randomElement(productSellers);
          const product = generateProduct(category, subcategory, brand, seller.id);
          products.push(product);
        }
      });
    });
  });
  
  return products;
}

/**
 * Generate a dataset of users
 */
export function generateUserDataset(count: number = 50): User[] {
  return Array.from({ length: count }, () => generateUser(Math.random() > 0.5));
}

/**
 * Generate a dataset of sellers
 */
export function generateSellerDataset(count: number = 30): Seller[] {
  return Array.from({ length: count }, () => generateSeller());
}

/**
 * Generate reviews for products
 */
export function generateReviewDataset(products: Product[], users: User[], reviewsPerProduct: number = 3): Review[] {
  const reviews: Review[] = [];
  
  // Only generate reviews for active products
  const activeProducts = products.filter((p) => p.status === 'active');
  
  activeProducts.forEach((product) => {
    const numReviews = randomNumber(0, reviewsPerProduct * 2);
    
    for (let i = 0; i < numReviews; i++) {
      const user = randomElement(users);
      const review = generateReview(product.id, user.id, product.sellerId);
      reviews.push(review);
    }
  });
  
  return reviews;
}

/**
 * Generate a complete mock dataset
 */
export function generateCompleteDataset() {
  // Reset the seeded random to ensure consistent data generation
  // This prevents hydration errors by ensuring server and client generate identical data
  seededRandom.reset(12345);
  
  console.log('Generating mock data for Qavah-mart...');
  
  const sellers = generateSellerDataset(30);
  console.log(`Generated ${sellers.length} sellers`);
  
  const users = generateUserDataset(50);
  console.log(`Generated ${users.length} users`);
  
  const products = generateProductDataset(5, sellers);
  console.log(`Generated ${products.length} products across all categories`);
  
  const reviews = generateReviewDataset(products, users, 3);
  console.log(`Generated ${reviews.length} reviews`);
  
  // Log category distribution
  const categoryCount: Record<string, number> = {};
  products.forEach((product) => {
    categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
  });
  
  console.log('\nProducts by category:');
  Object.entries(categoryCount).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} products`);
  });
  
  // Log brand distribution
  const brandCount: Record<string, number> = {};
  products.forEach((product) => {
    brandCount[product.brand] = (brandCount[product.brand] || 0) + 1;
  });
  
  console.log('\nProducts by brand:');
  Object.entries(brandCount).forEach(([brand, count]) => {
    console.log(`  ${brand}: ${count} products`);
  });
  
  return {
    sellers,
    users,
    products,
    reviews,
    locations: ETHIOPIAN_LOCATIONS,
  };
}
