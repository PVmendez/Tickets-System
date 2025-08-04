export async function ocrMock(imagePath) {
  if (!imagePath) {
    throw new Error('Image path is required');
  }
  
  return generateMockTicketData();
}

function generateMockTicketData() {
  const stores = [
    'Tata',
    'Disco',
    'Geant',
    'Devoto',
  ];
  
  const products = [
    { name: 'Leche Entera 1L', minPrice: 25, maxPrice: 35 },
    { name: 'Pan Integral', minPrice: 15, maxPrice: 25 },
    { name: 'Manzanas Rojas (kg)', minPrice: 40, maxPrice: 60 },
    { name: 'Yogurt', minPrice: 20, maxPrice: 30 },
    { name: 'Aceite Girasol 900ml', minPrice: 80, maxPrice: 120 },
    { name: 'Arroz Blanco 1kg', minPrice: 30, maxPrice: 50 },
    { name: 'Tomates (kg)', minPrice: 35, maxPrice: 55 }
  ];

  const itemCount = Math.floor(Math.random() * 5) + 1;
  const selectedProducts = getRandomProducts(products, itemCount);
  
  const items = selectedProducts.map(product => ({
    product: product.name,
    quantity: Math.floor(Math.random() * 3) + 1,
    price: Math.floor(Math.random() * (product.maxPrice - product.minPrice)) + product.minPrice
  }));

  return {
    serie: generateSerie(),
    ticketNumber: generateTicketNumber(),
    date: new Date().toISOString(),
    address: generateAddress(),
    store: stores[Math.floor(Math.random() * stores.length)],
    items
  };
}

function getRandomProducts(products, count) {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateSerie() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const serie = Array(3).fill(0).map(() => letters[Math.floor(Math.random() * letters.length)]).join('');
  const numbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${serie}-${numbers}`;
}

function generateTicketNumber() {
  return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

function generateAddress() {
  const streets = ['Av. Libertador', 'Calle San Martín', 'Av. Corrientes', 'Calle Florida', 'Av. Santa Fe'];
  const numbers = Math.floor(Math.random() * 9999) + 1;
  return `${streets[Math.floor(Math.random() * streets.length)]} ${numbers}`;
}
