import { UUID } from "crypto";

interface CategoryB1 {
    Code?: string;
    Name?: string;
    U_descr?: string;
    U_level?: number;
    U_parent?: string;
}

interface CategoryGCV {
    ID?: UUID;
    code?: string;
    name?: string;
    descr?: string;
    active?: boolean;
    level_code?: string;
    parent_code?: string;
}

export { CategoryB1, CategoryGCV };