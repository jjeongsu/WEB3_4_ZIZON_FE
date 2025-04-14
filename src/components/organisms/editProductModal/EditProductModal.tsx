import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { categories } from '@/types/product';
import updateProduct, { UpdateProductRequest } from '@/apis/store/updateProduct';
import { toast } from 'sonner';
import StandardButton from '@/components/atoms/buttons/standardButton/StandardButton';
import ModalContainer from '@/components/molecules/modal/ModalContainer';
import { putImageUpload } from '@/apis/imageUpload/putImageUpload';
import Image from 'next/image';
import { validateImageUrl } from '@/utils/imageUrlValidator';
import ProductTypeSelector, {
  ProductTypeValue,
} from '@/components/molecules/productTypeSelector/ProductTypeSelector';
import LabeledInput from '@/components/molecules/labeledInput/LabeledInput';
import TextareaInput from '@/components/atoms/inputs/textareaInput/TextareaInput';
import InputLabel from '@/components/atoms/texts/inputLabel/InputLabel';
import DigitalContentUploadField from '@/components/molecules/digitalContentUploadField/DigitalContentUploadField';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSuccess: () => void;
}

export default function EditProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: EditProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [productType, setProductType] = useState<ProductTypeValue>(
    product.productType === 'DIGITAL' ? 'digital' : 'living',
  );
  const [formData, setFormData] = useState<UpdateProductRequest>({
    categoryId:
      categories.find(category => category.name === product.categoryName)?.category_id || 0,
    title: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    productType: product.productType,
    thumbnailImage: product.thumbnailUrl || '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        categoryId:
          categories.find(category => category.name === product.categoryName)?.category_id || 0,
        title: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        productType: product.productType,
        thumbnailImage: product.thumbnailUrl || '',
      });
      setProductType(product.productType === 'DIGITAL' ? 'digital' : 'living');
      setImageError(false);
    }
  }, [isOpen, product]);

  // LabeledInput과 TextareaInput을 위한 핸들러
  const handleLabeledInputChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleProductTypeChange = (type: ProductTypeValue) => {
    setProductType(type);
    setFormData(prev => ({
      ...prev,
      productType: type === 'digital' ? 'DIGITAL' : 'PHYSICAL',
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      categoryId: Number(e.target.value),
    }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsLoading(true);
      const accessUrl = await putImageUpload({
        tableUnionType: 'products',
        file,
      });

      if (accessUrl) {
        setFormData(prev => ({
          ...prev,
          thumbnailImage: accessUrl,
        }));
        setImageError(false);
        toast.success('이미지가 업로드되었습니다.');
      } else {
        throw new Error('이미지 업로드 실패');
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      toast.error('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await updateProduct(product.id, formData);
      toast.success(response.message);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('상품 수정에 실패했습니다. 다시 시도해주세요.');
      console.error('상품 수정 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 상품 타입에 맞는 카테고리 목록 가져오기
  const filteredCategories = categories.filter(
    category => category.type === (productType === 'digital' ? 'DIGITAL' : 'PHYSICAL'),
  );

  return (
    <ModalContainer open={isOpen}>
      <div className="flex flex-col gap-24 py-32 px-44 w-680 max-h-[90vh] overflow-y-auto bg-black1 rounded-xl">
        <h2 className="text-24 font-bold text-black12">상품 정보 수정</h2>

        <div className="flex flex-col gap-32">
          <ProductTypeSelector selectedType={productType} onChange={handleProductTypeChange} />

          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-8">
              <label htmlFor="categoryId" className="text-14 font-medium">
                카테고리
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleCategoryChange}
                className="p-12 border border-black3 rounded-8"
                disabled={isLoading}
              >
                {filteredCategories.map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <LabeledInput
              id="title"
              label="상품명"
              placeholder="상품명을 입력하세요"
              type="text"
              value={formData.title}
              onChange={handleLabeledInputChange('title')}
              disabled={isLoading}
            />

            <div className="flex flex-col gap-8">
              <InputLabel label="상품 설명" htmlFor="description" />
              <TextareaInput
                id="description"
                placeholder="상품 설명을 입력하세요"
                value={formData.description}
                onChange={handleLabeledInputChange('description')}
                rows={6}
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-16">
              <div className="flex-1">
                <LabeledInput
                  id="price"
                  label="가격"
                  placeholder="가격을 입력하세요"
                  type="number"
                  value={formData.price.toString()}
                  onChange={handleLabeledInputChange('price')}
                  disabled={isLoading}
                />
              </div>
              <div className="flex-1">
                <LabeledInput
                  id="stock"
                  label="재고"
                  placeholder="재고를 입력하세요"
                  type="number"
                  value={formData.stock.toString()}
                  onChange={handleLabeledInputChange('stock')}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <label className="text-14 font-medium">썸네일 이미지</label>
              <div className="flex items-center gap-16">
                <div className="relative w-100 h-100 border border-black3 rounded-lg overflow-hidden">
                  <Image
                    src={
                      imageError
                        ? '/images/DefaultImage.png'
                        : validateImageUrl(formData.thumbnailImage)
                    }
                    alt="썸네일"
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                </div>
                <div className="flex flex-col gap-8">
                  <input
                    id="thumbnailImage"
                    name="thumbnailImage"
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="thumbnailImage"
                    className="px-16 py-8 bg-black2 text-black10 rounded-lg cursor-pointer text-center"
                  >
                    이미지 업로드
                  </label>
                </div>
              </div>
            </div>

            {productType === 'digital' && (
              <>
                <hr />
                <div className="flex flex-col gap-8">
                  <DigitalContentUploadField
                    label="디지털 상품 파일"
                    onFileUpload={() => {
                      // 디지털 콘텐츠 업로드 처리
                      toast.info('디지털 콘텐츠 업로드 기능은 준비 중입니다.');
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-8 mt-16">
          <StandardButton text="취소" onClick={onClose} disabled={isLoading} state="gray" />
          <StandardButton
            text={isLoading ? '처리 중...' : '수정하기'}
            onClick={handleSubmit}
            disabled={isLoading}
            state="blue"
          />
        </div>
      </div>
    </ModalContainer>
  );
}
