import { UUID } from "crypto";

interface SpecifB1 {
    Code?: string;
    Name?: string;
    U_descr?: string;
    GCV_SPECIF_VALUECollection?: SpecifValueB1[];
}

interface SpecifValueB1 {
    LineId: number,
    U_value?: string;
    U_name?: string;
    U_descr?: string;
}

interface SpecifGCV {
    ID?: UUID;
    code?: string;
    name?: string;
    descr?: string;
    _values?: SpecifValueGCV[];
}

interface SpecifValueGCV {
    code?: string;
    name?: string;
    descr?: string;
}

export { SpecifB1, SpecifValueB1, SpecifGCV, SpecifValueGCV };