
export const getMonthName = (monthIndex: number): string => {
    const monthNames = [
        "Januari", "Februari", "Mars", "April", "Maj", "Juni", 
        "Juli", "Augusti", "September", "Oktober", "November", "December"
    ];
    return monthNames[monthIndex - 1];
};