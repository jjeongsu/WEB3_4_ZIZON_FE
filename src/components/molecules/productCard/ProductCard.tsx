import { useState } from 'react';
import { Product } from '@/types/product';
import Image from 'next/image';
import StandardButton from '@/components/atoms/buttons/standardButton/StandardButton';
import ConfirmModal from '@/components/organisms/confirmModal/ConfirmModal';
import deleteProduct from '@/apis/store/deleteProduct';
import { toast } from 'sonner';
import EditProductModal from '@/components/organisms/editProductModal/EditProductModal';
import { validateImageUrl } from '@/utils/imageUrlValidator';
import SelectedOption from '@/components/atoms/texts/selectedOption/SelectedOption';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  onDelete?: () => void;
  onUpdate?: () => void;
}

export default function ProductCard({ product, onDelete, onUpdate }: ProductCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteProduct(product.id);
      toast.success(response.message);
      setIsDeleteModalOpen(false);
      router.refresh();
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      toast.error('제품 삭제에 실패했습니다. 다시 시도해주세요.');
      console.error('제품 삭제 실패:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSuccess = () => {
    if (onUpdate) {
      onUpdate();
    }
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-20 px-24 py-20 bg-black1 border border-black3 rounded-xl">
      <div className="relative w-150 h-150 border border-black3 rounded-lg overflow-hidden">
        <Image
          src={imageError ? '/images/DefaultImage.png' : validateImageUrl(product.thumbnailUrl)}
          alt={product.name}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="flex flex-col gap-20">
        <div className="flex flex-col gap-8">
          <h3 className="text-20 font-semibold">{product.name}</h3>
          <p className="text-16 text-black6">{product.description}</p>
        </div>
        <div className="flex flex-col gap-4">
          <SelectedOption
            type="price-small"
            leftText="가격"
            rightText={`${product.price.toLocaleString()}원`}
          />
          <SelectedOption type="price-small" leftText="재고" rightText={`${product.stock}개`} />
          <SelectedOption type="price-small" leftText="카테고리" rightText={product.categoryName} />
          <SelectedOption
            type="price-small"
            leftText="상품 유형"
            rightText={product.productType === 'DIGITAL' ? '디지털' : '실물'}
          />
        </div>
        <div className="flex justify-end gap-8">
          <StandardButton text="수정" onClick={handleEditClick} disabled={false} state="gray" />
          <StandardButton text="삭제" onClick={handleDeleteClick} disabled={false} state="red" />
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="제품 삭제"
        message={`정말로 이 제품을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`}
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        onCancel={handleDeleteModalClose}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        product={product}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
