import { UUID } from "crypto";

interface GridB1 {
    Code?: string;
    Name?: string;
    GCV_GRIDS_ITEMSCollection?: GridItemB1[];
}

interface GridItemB1 {
    LineId?: number,
    U_prefix?: string;
    U_name?: string;
}

interface GridGCV {
    ID?: UUID;
    code?: string;
    name?: string;
    active?: boolean;
    _items?: GridItemGCV[];
}

interface GridItemGCV {
    orderItem?: number;
    prefix?: string;
    name?: string;
}

export { GridB1, GridItemB1, GridGCV, GridItemGCV };