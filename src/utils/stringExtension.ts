export function stringFormat(template: string, ...args: any[]): string {
    return template.replace(/{(\d+)}/g, (match, index) => {
        const value = args[index];
        if (value === undefined || value === null) return 'NULL';

        // // Escapa strings com aspas simples
        // if (typeof value === 'string') {
        //     return `'${value.replace(/'/g, "''")}'`;
        // }

        return value.toString();
    });
}