import { Product } from '@/types/product';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="flex flex-col gap-12 p-16 border border-black3 rounded-8">
      <div className="relative w-124 h-124 border border-black3 rounded-lg">
        <Image
          src={product.thumbnailUrl || '/images/DeafultImage.png'}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-8">
        <h3 className="text-18 font-semibold">{product.name}</h3>
        <p className="text-14 text-black6">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-16 font-semibold">{product.price.toLocaleString()}원</span>
          <span className="text-14 text-black6">재고: {product.stock}개</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-14 text-black6">{product.categoryName}</span>
          <span className="text-14 text-black6">
            {product.productType === 'DIGITAL' ? '디지털' : '실물'}
          </span>
        </div>
      </div>
    </div>
  );
}
