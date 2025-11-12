import { UUID } from "crypto";

interface ColorB1 {
    Code?: string;
    Name?: string;
}

interface ColorGCV {
    ID?: UUID;
    code?: string;
    name?: string;
}

export { ColorB1, ColorGCV };