declare module 'html2canvas' {
    const html2canvas: any;
    export default html2canvas;
}

declare module 'jspdf' {
    export class jsPDF {
        constructor(orientation?: string, unit?: string, format?: string | number[], compressPdf?: boolean);
        internal: any;
        addImage(imageData: string | HTMLCanvasElement | HTMLImageElement | Uint8Array, format: string, x: number, y: number, w: number, h: number, alias?: string, compression?: string, rotation?: number): jsPDF;
        save(filename?: string, options?: { returnPromise: boolean }): jsPDF | Promise<any>;
        pageSize: any;
    }
    const jspdf: {
        jsPDF: typeof jsPDF;
    };
    export default jsPDF;
}
