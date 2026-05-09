import type { Category, Product } from '@/types'

interface ProductThumbProps {
  product: Pick<Product, 'name' | 'category'>
  categories: Category[]
  size?: number
}

export function ProductThumb({ product, categories, size = 56 }: ProductThumbProps) {
  const cat = categories.find(c => c.id === product.category)
  const initials = product.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl border"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, ${cat?.color ?? '#888'}22, ${cat?.color ?? '#888'}08)`,
        borderColor: `${cat?.color ?? '#888'}33`,
      }}>
      <span style={{ color: cat?.color ?? '#888', fontSize: size * 0.32, fontWeight: 700 }}>{initials}</span>
    </div>
  )
}
