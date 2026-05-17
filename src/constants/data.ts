import type { Category, Product, Sale } from '@/types'

export const SEED_CATEGORIES: Category[] = [
  { id: 'cat-mobiles', name: 'Mobiles', icon: '◰', color: '#F97316' },
  { id: 'cat-cases', name: 'Cases & Covers', icon: '◳', color: '#7C3AED' },
  { id: 'cat-glasses', name: 'Screen Guards', icon: '◱', color: '#0EA5E9' },
  { id: 'cat-earphones', name: 'Earphones', icon: '◲', color: '#10B981' },
  { id: 'cat-chargers', name: 'Chargers & Cables', icon: '◧', color: '#EAB308' },
  { id: 'cat-speakers', name: 'Speakers', icon: '◨', color: '#EC4899' },
  { id: 'cat-watches', name: 'Smart Watches', icon: '◩', color: '#06B6D4' },
  { id: 'cat-powerbanks', name: 'Power Banks', icon: '◪', color: '#84CC16' },
]

function p(
  id: string, name: string, category: string, brand: string,
  stock: number, cost: number, price: number,
  opts: Partial<Omit<Product, 'id'|'name'|'category'|'brand'|'stock'|'cost'|'price'>> = {}
): Product {
  return {
    id, name, category, brand, stock, cost, price,
    compatibleWith: opts.compatibleWith ?? [],
    color: opts.color ?? null,
    sku: opts.sku ?? `ARI-${id.toUpperCase()}`,
    sold30d: opts.sold30d ?? Math.floor(Math.random() * 40 + 5),
    rating: opts.rating ?? (3.5 + Math.random() * 1.5),
    addedDate: opts.addedDate ?? '2026-01-15',
    lowStockThreshold: opts.lowStockThreshold ?? 5,
    image: opts.image ?? null,
  }
}

export const SEED_PRODUCTS: Product[] = [
  p('p1','Samsung Galaxy A13 (4GB/64GB)','cat-mobiles','Samsung',12,11200,13499,{color:'Black',sold30d:28}),
  p('p2','Samsung Galaxy A14 5G (6GB/128GB)','cat-mobiles','Samsung',8,14800,17999,{color:'Blue',sold30d:22}),
  p('p3','Redmi Note 13 (8GB/128GB)','cat-mobiles','Redmi',15,15500,18499,{color:'Black',sold30d:35}),
  p('p4','Redmi 12C (4GB/64GB)','cat-mobiles','Redmi',4,7200,8999,{color:'Green',sold30d:18,lowStockThreshold:5}),
  p('p5','iPhone 13 (128GB)','cat-mobiles','Apple',3,48000,54999,{color:'Black',sold30d:6,lowStockThreshold:4}),
  p('p6','Realme Narzo 60 (8GB/128GB)','cat-mobiles','Realme',9,13800,16499,{color:'Green',sold30d:14}),
  p('p7','Vivo Y27 (6GB/128GB)','cat-mobiles','Vivo',7,14200,16999,{color:'Blue',sold30d:11}),
  p('p8','Poco X5 (8GB/256GB)','cat-mobiles','Poco',6,17500,20999,{color:'Black',sold30d:13}),
  p('c1','Soft Silicone Back Cover','cat-cases','Spigen',45,80,249,{color:'Black',compatibleWith:['Samsung A13'],sold30d:62}),
  p('c2','Soft Silicone Back Cover','cat-cases','Ringke',38,75,229,{color:'Blue',compatibleWith:['Samsung A13'],sold30d:41}),
  p('c3','Transparent Hard Case','cat-cases','Spigen',52,60,199,{color:'Transparent',compatibleWith:['Samsung A13','Samsung A14'],sold30d:78}),
  p('c4','Leather Flip Cover','cat-cases','Ringke',12,220,549,{color:'Black',compatibleWith:['Samsung A13'],sold30d:19}),
  p('c5','Magsafe Case Pro','cat-cases','Spigen',22,320,799,{color:'Black',compatibleWith:['iPhone 14','iPhone 15'],sold30d:24}),
  p('c6','Camera Protection Case','cat-cases','Spigen',30,110,299,{color:'Pink',compatibleWith:['Redmi Note 13'],sold30d:35}),
  p('c7','Marble Pattern Back Cover','cat-cases','Ringke',18,95,279,{color:'White',compatibleWith:['Samsung A14'],sold30d:22}),
  p('c8','Rugged Armor Case','cat-cases','Spigen',14,280,699,{color:'Black',compatibleWith:['iPhone 13','iPhone 14'],sold30d:17}),
  p('c9','Soft Silicone Back Cover','cat-cases','Spigen',2,80,249,{color:'Red',compatibleWith:['Samsung A13'],sold30d:28,lowStockThreshold:5}),
  p('c10','Glitter Case','cat-cases','Ringke',25,100,299,{color:'Pink',compatibleWith:['Redmi Note 13','Redmi 12C'],sold30d:31}),
  p('g1','Tempered Glass 9H','cat-glasses','Spigen',88,30,149,{compatibleWith:['Samsung A13'],sold30d:95}),
  p('g2','Privacy Tempered Glass','cat-glasses','Ringke',24,80,249,{compatibleWith:['iPhone 13','iPhone 14'],sold30d:18}),
  p('g3','Edge to Edge Curved Glass','cat-glasses','Spigen',41,60,199,{compatibleWith:['Samsung A14','Samsung S23'],sold30d:47}),
  p('g4','Matte Finish Screen Guard','cat-glasses','Ringke',1,45,169,{compatibleWith:['Redmi Note 13'],sold30d:28,lowStockThreshold:5}),
  p('g5','Anti-Blue Light Protector','cat-glasses','Spigen',33,70,219,{compatibleWith:['iPhone 15'],sold30d:22}),
  p('e1','Boat Rockerz 235v2','cat-earphones','Boat',42,580,999,{color:'Black',sold30d:88}),
  p('e2','Boat Airdopes 141','cat-earphones','Boat',35,950,1299,{color:'White',sold30d:72}),
  p('e3','JBL Tune 130NC','cat-earphones','JBL',11,3200,3999,{color:'Black',sold30d:14}),
  p('e4','Noise Buds VS104','cat-earphones','Noise',28,980,1499,{color:'Blue',sold30d:51}),
  p('e5','Mivi Duopods A25','cat-earphones','Mivi',17,750,1199,{color:'White',sold30d:38}),
  p('e6','Boat Bassheads 100','cat-earphones','Boat',60,280,499,{color:'Black',sold30d:102}),
  p('ch1','25W Type-C Charger','cat-chargers','Samsung',25,380,699,{sold30d:58}),
  p('ch2','20W USB-C Charger','cat-chargers','Apple',14,1200,1799,{sold30d:22}),
  p('ch3','USB-C to Lightning Cable 1m','cat-chargers','Apple',18,480,899,{sold30d:31}),
  p('ch4','65W Fast Charger SuperVooc','cat-chargers','Realme',8,950,1499,{sold30d:19}),
  p('ch5','Micro USB Cable Braided','cat-chargers','Ambrane',65,60,149,{sold30d:81}),
  p('s1','Boat Stone 190 Pro','cat-speakers','Boat',9,1100,1599,{color:'Black',sold30d:21}),
  p('s2','JBL Go 3','cat-speakers','JBL',14,2200,2999,{color:'Red',sold30d:18}),
  p('s3','Mivi Roam 2','cat-speakers','Mivi',7,1300,1899,{color:'Black',sold30d:12}),
  p('w1','Noise Colorfit Pro 4','cat-watches','Noise',16,2400,3499,{color:'Black',sold30d:27}),
  p('w2','Boat Wave Lite','cat-watches','Boat',22,1100,1599,{color:'Silver',sold30d:41}),
  p('w3','Fire-Boltt Ninja Call Pro','cat-watches','Boat',11,1500,2199,{color:'Black',sold30d:19}),
  p('pb1','Ambrane 20000mAh PowerLit','cat-powerbanks','Ambrane',18,1100,1699,{color:'Black',sold30d:24}),
  p('pb2','Mi 10000mAh Pro','cat-powerbanks','Redmi',26,850,1299,{color:'Black',sold30d:38}),
  p('pb3','Portronics Power Plate 10','cat-powerbanks','Portronics',3,980,1499,{color:'White',sold30d:14,lowStockThreshold:5}),
]

export const SEED_SALES: Sale[] = (() => {
  const sales: Sale[] = []
  const todayDate = new Date('2026-04-26')
  const customers = ['Walk-in', 'Rajesh K.', 'Priya S.', 'Amit P.', 'Neha T.', 'Vikram R.']
  const methods = ['UPI', 'Cash', 'Card', 'UPI', 'UPI'] as const
  for (let d = 29; d >= 0; d--) {
    const date = new Date(todayDate)
    date.setDate(todayDate.getDate() - d)
    const dateStr = date.toISOString().slice(0, 10)
    const numOrders = Math.floor(Math.random() * 8 + 3)
    for (let i = 0; i < numOrders; i++) {
      const product = SEED_PRODUCTS[Math.floor(Math.random() * SEED_PRODUCTS.length)]
      const qty = Math.floor(Math.random() * 3 + 1)
      sales.push({
        id: `sale-${d}-${i}`,
        date: dateStr,
        productId: product.id,
        productName: product.name,
        category: product.category,
        qty,
        revenue: product.price * qty,
        cost: product.cost * qty,
        profit: (product.price - product.cost) * qty,
        customer: customers[Math.floor(Math.random() * customers.length)],
      })
    }
  }
  return sales.reverse()
})()
