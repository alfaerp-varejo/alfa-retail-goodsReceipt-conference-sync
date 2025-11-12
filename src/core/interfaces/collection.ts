import { UUID } from "crypto";

interface CollectionB1 {
    Code?: string;
    Name?: string;
    U_descr?: string;
    U_initialDate?: Date;
    U_finalDate?: Date;
}

interface CollectionGCV {
    ID?: UUID;
    code?: string;
    name?: string;
    descr?: string;
    initialDate?: Date;
    finalDate?: Date;
    active?: boolean;
}

export { CollectionB1, CollectionGCV };