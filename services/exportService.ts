import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { DrawResult, DrawType } from '../types';

const getTitle = (key: string): string => {
    const titles: Record<string, string> = {
        min: 'Mínimo',
        max: 'Máximo',
        quantity: 'Quantidade',
        allowRepeats: 'Repetir números',
        removeDrawn: 'Remover sorteado',
        initialCount: 'Total de nomes',
        groupSize: 'Tamanho do grupo',
        participantsCount: 'Total de participantes'
    };
    return titles[key] || key;
}

export const exportAsPdf = (result: DrawResult) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.setTextColor('#6d28d9'); // primary color
    doc.text('SorteioMaster - Resultado do Sorteio', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Tipo: ${result.type}`, 14, 32);
    doc.text(`Data: ${new Date(result.timestamp).toLocaleString('pt-BR')}`, 14, 38);
    
    const configEntries = Object.entries(result.config).map(([key, value]) => `${getTitle(key)}: ${value === true ? 'Sim' : value === false ? 'Não' : value}`);
    doc.text(`Configuração: ${configEntries.join(' | ')}`, 14, 44);

    const startY = 55;

    if (result.type === DrawType.GROUPS) {
        const head = [['Grupo', 'Membros']];
        const body = (result.results as string[][]).map((group, index) => [
            `Grupo ${index + 1}`,
            group.join(', ')
        ]);
        autoTable(doc, { head, body, startY, headStyles: { fillColor: '#6d28d9' } });
    } else {
        autoTable(doc, {
            head: [['Resultados']],
            body: (result.results as string[]).map(r => [r]),
            startY,
            headStyles: { fillColor: '#6d28d9' }
        });
    }

    doc.save(`sorteio-${result.id}.pdf`);
};

export const exportAsXlsx = (result: DrawResult) => {
    const wb = XLSX.utils.book_new();
    
    const configEntries = Object.entries(result.config).map(([key, value]) => `${getTitle(key)}: ${value === true ? 'Sim' : value === false ? 'Não' : value}`).join(' | ');

    let ws_data: any[][] = [
        ['SorteioMaster - Resultado do Sorteio'],
        [],
        ['Tipo', result.type],
        ['Data', new Date(result.timestamp).toLocaleString('pt-BR')],
        ['Configuração', configEntries],
        []
    ];

    if (result.type === DrawType.GROUPS) {
        ws_data.push(['Grupo', 'Membros']);
        (result.results as string[][]).forEach((group, index) => {
            ws_data.push([`Grupo ${index + 1}`, group.join(', ')]);
        });
    } else {
        ws_data.push(['Resultados']);
        (result.results as string[]).forEach(res => {
            ws_data.push([res]);
        });
    }

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    ws['!cols'] = [{ wch: 30 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Resultado');
    XLSX.writeFile(wb, `sorteio-${result.id}.xlsx`);
};

export const exportAsImage = async (element: HTMLElement, filename: string) => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const bgColor = isDarkMode ? '#0f172a' : '#ffffff';

    try {
        const canvas = await html2canvas(element, {
             useCORS: true,
             backgroundColor: bgColor,
             onclone: (document) => {
                const dropdowns = document.querySelectorAll('.origin-top-right');
                dropdowns.forEach(dd => ((dd as HTMLElement).style.display = 'none'));
             }
        });
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error exporting as image:", error);
        alert("Ocorreu um erro ao exportar como imagem.");
    }
};