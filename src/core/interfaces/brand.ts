import { UUID } from "crypto";

interface BrandB1 {
    Code?: string;
    Name?: string;
    U_descr?: string;
}

interface BrandGCV {
    ID?: UUID;
    code?: string;
    name?: string;
    descr?: string;
    active?: boolean;
}

export { BrandB1, BrandGCV };