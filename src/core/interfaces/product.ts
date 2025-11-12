import { UUID } from "crypto";

interface ProductB1 {
    Code?: string;
    Name?: string;
    U_title?: string;
    U_description?: string;
    U_visible?: string;
    U_active?: string;
    U_brand_code?: string;
    U_collection_code?: string;
    U_category_code_1?: string;
    U_category_code_2?: string;
    U_category_code_3?: string;
    U_category_code_4?: string;
    U_category_code_5?: string;
    U_grid_code?: string;
    U_salePrice?: number;
    U_unitCost?: number;
    U_markup?: number;
    U_itemGroup_code?: number;
    U_material_code?: number;
    U_source_code?: number;
    U_vendor_code?: string;
    U_vendorReference?: string;
    U_imageUrl?: string;
    GCV_PROD_SPECIFCollection?: ProductSpecifB1[];
    GCV_VARIANTSCollection?: ProductVariantB1[];
}

interface ProductVariantB1 {
    LineId?: number,
    U_variant_code?: string;
    U_variant_name?: string;
    U_color_code?: string;
}

interface ProductSpecifB1 {
    LineId?: number,
    U_specification_code?: string;
    U_value_code?: string;
}

interface ProductGCV {
    ID: UUID;
    code: string;
    name: string;
    title: string;
    description: string;
    visible: boolean;
    active: boolean;
    brand_code: string;
    collection_code: string;
    category_code_1: string;
    category_code_2: string;
    category_code_3: string;
    category_code_4: string;
    category_code_5: string;
    grid_code: string;
    salePrice: string;
    unitCost: string;
    markup: string;
    itemGroup_code: number;
    material_code: number;
    source_code: number;
    vendor_code: string;
    vendorReference: string;
    imageUrl: string;
    _variants?: ProductVariantGCV[];
    _specifications?: ProductSpecifGCV[];
}

interface ProductVariantGCV {
    variant_code?: string;
    variant_name?: string;
    color_code?: string;
}

interface ProductSpecifGCV {
    lineItem?: number;
    specification_code?: string;
    value_code?: string;
}

export { ProductB1, ProductVariantB1, ProductSpecifB1, ProductGCV, ProductVariantGCV, ProductSpecifGCV };