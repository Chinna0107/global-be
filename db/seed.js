require('dotenv').config();
const sql = require('./index');
const bcrypt = require('bcryptjs');

async function seed() {
  // Create tables
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id         SERIAL PRIMARY KEY,
      username   VARCHAR(100) UNIQUE NOT NULL,
      password   TEXT NOT NULL,
      role       VARCHAR(20) NOT NULL DEFAULT 'admin',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(200) UNIQUE NOT NULL,
      category    VARCHAR(50) NOT NULL,
      description TEXT,
      image       TEXT,
      price       NUMERIC(10,2),
      unit        VARCHAR(50) DEFAULT 'kg',
      stock       INTEGER DEFAULT 0,
      features    JSONB DEFAULT '[]',
      quantities  JSONB DEFAULT '[]',
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Seed admin user
  const hash = await bcrypt.hash('admin123', 10);
  await sql`
    INSERT INTO users (username, password, role)
    VALUES ('admin', ${hash}, 'admin')
    ON CONFLICT (username) DO NOTHING
  `;

  // Seed products
  // const products = [
  //   {
  //     name: 'Sona Masoori Rice', category: 'rice', price: 350, unit: 'kg', stock: 100,
  //     image: 'https://placehold.co/400x300?text=Sona+Masoori',
  //     description: 'Light and aromatic medium-grain rice, ideal for everyday cooking.',
  //     features: ['Low Starch', 'Easy to Digest', 'Naturally Aged'],
  //     quantities: [{ weight: '5 kg', price: '₹350' }, { weight: '10 kg', price: '₹680' }, { weight: '25 kg', price: '₹1600' }],
  //   },
  //   {
  //     name: 'Basmati Rice', category: 'rice', price: 550, unit: 'kg', stock: 80,
  //     image: 'https://placehold.co/400x300?text=Basmati',
  //     description: 'Long-grain premium basmati with rich aroma and fluffy texture.',
  //     features: ['Extra Long Grain', 'Rich Aroma', 'Non-Sticky'],
  //     quantities: [{ weight: '5 kg', price: '₹550' }, { weight: '10 kg', price: '₹1050' }, { weight: '25 kg', price: '₹2500' }],
  //   },
  //   {
  //     name: 'Foxtail Millet', category: 'millets', price: 120, unit: 'kg', stock: 60,
  //     image: 'https://placehold.co/400x300?text=Foxtail+Millet',
  //     description: 'Nutrient-rich ancient grain, high in protein and dietary fibre.',
  //     features: ['High Protein', 'Gluten Free', 'Rich in Iron'],
  //     quantities: [{ weight: '1 kg', price: '₹120' }, { weight: '5 kg', price: '₹550' }],
  //   },
  //   {
  //     name: 'Pearl Millet (Bajra)', category: 'millets', price: 90, unit: 'kg', stock: 75,
  //     image: 'https://placehold.co/400x300?text=Pearl+Millet',
  //     description: 'Energy-dense millet packed with minerals and antioxidants.',
  //     features: ['High Energy', 'Calcium Rich', 'Gluten Free'],
  //     quantities: [{ weight: '1 kg', price: '₹90' }, { weight: '5 kg', price: '₹420' }],
  //   },
  //   {
  //     name: 'Turmeric Powder', category: 'spices', price: 80, unit: 'g', stock: 200,
  //     image: 'https://placehold.co/400x300?text=Turmeric',
  //     description: 'Pure sun-dried turmeric with high curcumin content.',
  //     features: ['High Curcumin', 'No Additives', 'Natural Color'],
  //     quantities: [{ weight: '250 g', price: '₹80' }, { weight: '500 g', price: '₹150' }, { weight: '1 kg', price: '₹280' }],
  //   },
  //   {
  //     name: 'Red Chilli Powder', category: 'spices', price: 70, unit: 'g', stock: 150,
  //     image: 'https://placehold.co/400x300?text=Red+Chilli',
  //     description: 'Bold and fiery red chilli powder sourced from Guntur farms.',
  //     features: ['Extra Hot', 'Natural Color', 'No Preservatives'],
  //     quantities: [{ weight: '250 g', price: '₹70' }, { weight: '500 g', price: '₹130' }, { weight: '1 kg', price: '₹240' }],
  //   },
  // ];

  // for (const p of products) {
  //   await sql`
  //     INSERT INTO products (name, category, description, image, price, unit, stock, features, quantities)
  //     VALUES (${p.name}, ${p.category}, ${p.description}, ${p.image}, ${p.price}, ${p.unit}, ${p.stock}, ${JSON.stringify(p.features)}, ${JSON.stringify(p.quantities)})
  //     ON CONFLICT (name) DO NOTHING
  //   `;
  // }

  console.log('✅ Seed complete');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
