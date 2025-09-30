import { WinnerType } from "./definitions";
import * as XLSX from "xlsx";

export function generateUniqueRandomNumbers(count: number, min: number, max: number): number[] {
    const uniqueNumbers = new Set<number>();

    while (uniqueNumbers.size < count) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        uniqueNumbers.add(randomNumber);
    }

    const uniqueNumbersArray: number[] = [];

    uniqueNumbers.forEach(value => uniqueNumbersArray.push(value));

    return uniqueNumbersArray;
}

export function csvToJson(csvString: string): WinnerType[] {
    const lines = csvString.trim().split('\n');
    const result: any[] = [];

    lines.forEach(line => {
        const [name, email, accountNumber, phoneNumber, branchName] = line.split(',');
        result.push({ name, email, accountNumber, phoneNumber, branchName });
    });

    return result;
}

export function maskAccountNumber(accountNumber: string) {
    if (!accountNumber) return '';
    const value = accountNumber.toString();
    if (value.length <= 6) return '***';
    return value.slice(0, 3) + 'xxxx' + value.slice(-3);
}

export const maskPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const trimmed = phone.replace(/\s|-/g, '');
    const ccMatch = trimmed.startsWith('+') ? trimmed.slice(0, 4) : (trimmed.startsWith('234') ? '234' : '');
    const digits = ccMatch ? trimmed.slice(ccMatch.length) : trimmed;
    const last4 = digits.slice(-4);
    return `${ccMatch}${ccMatch ? ' ' : ''}***-***-${last4}`;
};

export const maskEmailAddress = (email: string) => {
    if (!email || !email.includes('@')) return '';
    const [local, domain] = email.split('@');
    const first = local[0] ?? '';
    return `${first}***@${domain}`;
};

// Header normalization and mapping for CSV/XLSX
const normalizeKey = (key: string) => key.trim().toLowerCase().replace(/\s+|_/g, '');

const headerMap: Record<string, keyof WinnerType | 'division' | 'region'> = {
    // normalized header -> internal field
    cust_ac_no: 'accountNumber',
    custacno: 'accountNumber',
    ac_desc: 'name',
    acdesc: 'name',
    branch_name: 'branchName',
    branchname: 'branchName',
    region: 'region',
    division: 'division',
    telephone: 'phoneNumber',
    phone: 'phoneNumber',
    email: 'email',
};

export type ParsedRow = Partial<WinnerType> & { [k: string]: any };

export const parseFileToRecords = async (file: File): Promise<WinnerType[]> => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    const records: WinnerType[] = [];
    for (const row of rows) {
        const mapped: ParsedRow = {};
        Object.keys(row).forEach((key) => {
            const norm = normalizeKey(key);
            const target = headerMap[norm as keyof typeof headerMap];
            if (target && ['name','email','accountNumber','phoneNumber','branchName','division','region'].includes(target)) {
                (mapped as any)[target] = String(row[key]).trim();
            }
        });
        if (mapped.name && mapped.accountNumber && mapped.phoneNumber && mapped.branchName) {
            records.push({
                name: mapped.name!,
                email: mapped.email ?? '',
                accountNumber: mapped.accountNumber!,
                phoneNumber: mapped.phoneNumber!,
                branchName: mapped.branchName!,
                division: mapped.division,
                region: mapped.region,
            });
        }
    }
    return records;
};

export const sampleDistinct = <T,>(arr: T[], n: number): T[] => {
    const copy = arr.slice();
    // Fisher–Yates
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(n, copy.length));
};

export const groupBy = <T, K extends string | number | symbol>(
    items: T[],
    keyFn: (item: T) => K
) => {
    return items.reduce((acc, item) => {
        const k = keyFn(item);
        (acc[k] ||= []).push(item);
        return acc;
    }, {} as Record<K, T[]>);
};

// Select N winners per division
export const selectPerDivision = (records: WinnerType[], countPerDivision: number) => {
    const byDivision = groupBy(records, (r) => (r.division ?? 'UNKNOWN'));
    const winners: WinnerType[] = [];
    Object.values(byDivision).forEach((list) => {
        winners.push(...sampleDistinct(list, countPerDivision));
    });
    return winners;
};

export const selectWinnersByCategory = (
    category: string,
    subCategory: string,
    records: WinnerType[],
): WinnerType[] => {
    if (!Array.isArray(records) || records.length === 0) return [];

    const pickPerDivision = (n: number) => selectPerDivision(records, n);
    const pickBankWide = (n: number) => sampleDistinct(records, n);

    if (category === 'Monthly Draw') {
        switch (subCategory) {
            case 'Individual: New-to-Bank & Reactivation':
            case 'Individual: Bonus Reward':
            case 'Business: New-to-Bank & Reactivation':
            case 'Business: Bonus Reward':
                return pickPerDivision(10);
            case 'Individual: Super Reward':
            case 'Business: Business Expansion':
                return pickPerDivision(1);
            case 'Individual: Youth Category':
                return pickBankWide(10);
            default:
                return pickBankWide(10);
        }
    }

    if (category === 'Grand Prize') {
        switch (subCategory) {
            case 'Business Expansion (Finale)':
            case 'Millionaire Geng (Finale)':
                return pickPerDivision(1);
            case 'Scholarship Grant (Finale)':
                return pickBankWide(1);
            default:
                return pickBankWide(1);
        }
    }

    return pickBankWide(10);
};

export type AuditMeta = {
    category: string;
    timestamp: string;
    totalCandidates: number;
    selectionMode: 'per-division' | 'bank-wide';
    countRequested: number;
};

export const buildAuditLog = (winners: WinnerType[], meta: AuditMeta) => {
    return {
        meta,
        winners: winners.map((w) => ({
            name: w.name,
            branchName: w.branchName,
            accountNumberHash: btoa((w.accountNumber ?? '').slice(-6)),
            phoneMasked: maskPhoneNumber(w.phoneNumber),
            emailMasked: maskEmailAddress(w.email),
        })),
    };
};

export const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};