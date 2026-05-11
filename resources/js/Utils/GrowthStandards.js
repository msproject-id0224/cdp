// Growth Standards Utility based on WHO and Asian Standards (approximate)

// Calculate age in months
export const calculateAgeInMonths = (birthDate, checkDate) => {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const check = checkDate ? new Date(checkDate) : new Date();
    
    let months = (check.getFullYear() - birth.getFullYear()) * 12;
    months -= birth.getMonth();
    months += check.getMonth();
    
    // Adjust if day of month is earlier
    if (check.getDate() < birth.getDate()) {
        months--;
    }
    
    return months < 0 ? 0 : months;
};

// Calculate age in years
export const calculateAgeInYears = (birthDate, checkDate) => {
    return calculateAgeInMonths(birthDate, checkDate) / 12;
};

/**
 * Check Status
 * Returns: { status: 'normal'|'warning'|'danger', message: string, color: 'green'|'yellow'|'red' }
 */

// 1. Weight for Age (WHO - Simplified Z-Scores for 0-5 years, CDC/Others for >5)
// This is a simplified lookup table for demonstration. In production, use full Z-Score tables.
export const checkWeightForAge = (ageMonths, gender, weight) => {
    if (!weight) return null;
    const isBoy = gender === 'male';
    
    // Simplified Logic (This should be replaced with full WHO data tables)
    // Rule of thumb: 
    // Birth: 3.3kg
    // 5 mo: 2x birth (6.6)
    // 1 yr: 3x birth (10)
    // 2 yr: 4x birth (13)
    
    // Simple estimation formula for > 1 year: Weight = 2 x (age_years + 4)
    // For infants < 1 year: Weight = (age_months + 9) / 2
    
    let idealWeight;
    if (ageMonths <= 12) {
        idealWeight = (ageMonths + 9) / 2;
    } else {
        const ageYears = ageMonths / 12;
        idealWeight = 2 * (ageYears + 4);
    }
    
    // Adjust slightly for gender
    if (isBoy) idealWeight *= 1.05;
    
    const diff = Math.abs(weight - idealWeight);
    const percentDiff = (diff / idealWeight) * 100;
    
    if (percentDiff <= 15) return { status: 'normal', message: 'Berat Badan Ideal', color: 'text-green-600' };
    if (percentDiff <= 30) return { status: 'warning', message: weight < idealWeight ? 'Berat Badan Kurang' : 'Berat Badan Berlebih', color: 'text-yellow-600' };
    return { status: 'danger', message: weight < idealWeight ? 'Berat Badan Sangat Kurang' : 'Obesitas', color: 'text-red-600' };
};

// 2. Height for Age
export const checkHeightForAge = (ageMonths, gender, height) => {
    if (!height) return null;
    const isBoy = gender === 'male';
    
    // Estimation:
    // Birth: 50cm
    // 1 yr: 75cm
    // 2-12 yr: Age * 6 + 77
    
    let idealHeight;
    if (ageMonths <= 12) {
        idealHeight = 50 + (25 * (ageMonths / 12));
    } else {
        const ageYears = ageMonths / 12;
        idealHeight = (ageYears * 6) + 77;
    }
    
    if (isBoy) idealHeight *= 1.02;
    
    const diff = Math.abs(height - idealHeight);
    const percentDiff = (diff / idealHeight) * 100;

    if (percentDiff <= 10) return { status: 'normal', message: 'Tinggi Badan Ideal', color: 'text-green-600' };
    if (percentDiff <= 20) return { status: 'warning', message: height < idealHeight ? 'Perawakan Pendek (Stunted)' : 'Tinggi Diatas Rata-rata', color: 'text-yellow-600' };
    return { status: 'danger', message: height < idealHeight ? 'Sangat Pendek (Severely Stunted)' : 'Sangat Tinggi', color: 'text-red-600' };
};

// 3. Pulse (Heart Rate) - Resting
export const checkPulse = (ageYears, pulse) => {
    if (!pulse) return null;
    
    let min, max;
    if (ageYears < 1) { min = 100; max = 160; }
    else if (ageYears < 3) { min = 90; max = 150; }
    else if (ageYears < 6) { min = 80; max = 140; }
    else if (ageYears < 12) { min = 70; max = 120; }
    else { min = 60; max = 100; } // 12+ (Adult range)
    
    if (pulse >= min && pulse <= max) return { status: 'normal', message: 'Nadi Normal', color: 'text-green-600' };
    
    // Warning buffer 10%
    if (pulse >= min * 0.9 && pulse <= max * 1.1) return { status: 'warning', message: pulse < min ? 'Nadi Agak Lambat' : 'Nadi Agak Cepat', color: 'text-yellow-600' };
    
    return { status: 'danger', message: pulse < min ? 'Bradycardia (Lambat)' : 'Tachycardia (Cepat)', color: 'text-red-600' };
};

// 4. Respiration Rate
export const checkRespiration = (ageYears, resp) => {
    if (!resp) return null;
    
    let min, max;
    if (ageYears < 1) { min = 30; max = 60; }
    else if (ageYears < 3) { min = 24; max = 40; }
    else if (ageYears < 6) { min = 22; max = 34; }
    else if (ageYears < 12) { min = 18; max = 30; }
    else { min = 12; max = 20; }
    
    if (resp >= min && resp <= max) return { status: 'normal', message: 'Pernapasan Normal', color: 'text-green-600' };
    if (resp >= min * 0.8 && resp <= max * 1.2) return { status: 'warning', message: resp < min ? 'Pernapasan Lambat' : 'Pernapasan Cepat', color: 'text-yellow-600' };
    return { status: 'danger', message: resp < min ? 'Bradypnea (Sangat Lambat)' : 'Tachypnea (Sangat Cepat)', color: 'text-red-600' };
};

// 5. Head Circumference (Using simplified WHO-like references)
export const checkHeadCircumference = (ageMonths, gender, hc) => {
    if (!hc) return null;
    const isBoy = gender === 'male';

    // Simplified WHO Standards (Median in cm)
    // Age (Mo):  0   3   6   12  24  36  48  60
    // Boys:      34.5 40.5 43.3 46.1 48.3 49.5 50.5 51.2
    // Girls:     33.9 39.5 42.2 44.9 47.2 48.5 49.5 50.4
    
    // We can use a polynomial approximation or simple lookup interpolation
    // For this context, let's use a log-based approximation which fits growth curves well
    // HC ≈ A + B * ln(age_months + 1)
    
    let ideal;
    if (isBoy) {
        // Boys approx: 34.5 + 4.1 * ln(months + 1)
        ideal = 34.5 + (4.1 * Math.log(ageMonths + 1));
    } else {
        // Girls approx: 33.9 + 4.05 * ln(months + 1)
        ideal = 33.9 + (4.05 * Math.log(ageMonths + 1));
    }
    
    // SD (Standard Deviation) is roughly 1.2 cm across ages
    const sd = 1.2;
    
    // Calculate Z-Score: (Value - Median) / SD
    const zScore = (hc - ideal) / sd;

    if (Math.abs(zScore) <= 2) {
        return { status: 'normal', message: 'Lingkar Kepala Normal', color: 'text-green-600' };
    } else if (Math.abs(zScore) <= 3) {
        return { 
            status: 'warning', 
            message: zScore < 0 ? 'Microcephaly Risk (Kecil)' : 'Macrocephaly Risk (Besar)', 
            color: 'text-yellow-600' 
        };
    } else {
        return { 
            status: 'danger', 
            message: zScore < 0 ? 'Microcephaly (Sangat Kecil)' : 'Macrocephaly (Sangat Besar)', 
            color: 'text-red-600' 
        };
    }
};

// 6. Blood Pressure (Systolic/Diastolic) - Screening Guide
export const checkBloodPressure = (ageYears, bpString) => {
    if (!bpString) return null;
    
    // Parse format "120/80"
    const parts = bpString.split('/');
    if (parts.length !== 2) return null;
    
    const sys = parseInt(parts[0]);
    const dia = parseInt(parts[1]);
    
    if (isNaN(sys) || isNaN(dia)) return null;
    
    // Rule of thumb thresholds (90th percentile approx)
    // Age      Sys     Dia
    // 1-3      105     65
    // 4-6      110     70
    // 7-12     120     80
    // 13+      130     85
    
    let maxSys, maxDia;
    if (ageYears < 1) { maxSys = 100; maxDia = 65; }
    else if (ageYears <= 3) { maxSys = 105; maxDia = 70; }
    else if (ageYears <= 6) { maxSys = 110; maxDia = 75; }
    else if (ageYears <= 12) { maxSys = 120; maxDia = 80; }
    else { maxSys = 130; maxDia = 85; } // Adolescent/Adult
    
    const minSys = 70 + (2 * ageYears); // Hypotension lower limit approx
    
    let status = 'normal';
    let message = 'Tensi Normal';
    let color = 'text-green-600';
    
    if (sys > maxSys || dia > maxDia) {
        if (sys > maxSys + 15 || dia > maxDia + 10) {
            status = 'danger';
            message = 'Hipertensi (Tinggi)';
            color = 'text-red-600';
        } else {
            status = 'warning';
            message = 'Pre-Hipertensi (Agak Tinggi)';
            color = 'text-yellow-600';
        }
    } else if (sys < minSys) {
        status = 'warning';
        message = 'Hipotensi (Rendah)';
        color = 'text-yellow-600';
    }
    
    return { status, message, color };
};

// 7. Body Temperature (Axillary/Armpit)
export const checkTemperature = (temp) => {
    if (!temp) return null;
    
    // Normal range: 36.5 - 37.5
    // Low fever: 37.6 - 38.5
    // High fever: > 38.5
    // Hypothermia: < 36.0
    
    if (temp >= 36.5 && temp <= 37.5) {
        return { status: 'normal', message: 'Suhu Normal', color: 'text-green-600' };
    } else if (temp > 37.5 && temp <= 38.5) {
        return { status: 'warning', message: 'Demam Ringan (Febris)', color: 'text-yellow-600' };
    } else if (temp > 38.5) {
        return { status: 'danger', message: 'Demam Tinggi (Hyperpyrexia)', color: 'text-red-600' };
    } else if (temp < 36.0) {
        return { status: 'danger', message: 'Hipotermia (Sangat Dingin)', color: 'text-red-600' };
    } else {
        return { status: 'warning', message: 'Suhu Rendah', color: 'text-yellow-600' };
    }
};

// 8. Immunization Completeness Check (Based on IDAI 2023 / Kemenkes RI)
export const checkImmunizationCompleteness = (ageMonths, givenVaccines) => {
    // givenVaccines: Array of vaccine codes that are checked/true
    if (ageMonths === undefined || !givenVaccines) return null;

    // Define mandatory vaccines by age threshold (cumulative)
    // Using IDAI 2023 & Kemenkes Guidelines
    const schedule = [
        { age: 0, vaccines: ['HEB'] }, // Hep B0
        { age: 1, vaccines: ['BCG', 'POL'] }, // BCG, Polio 1
        { age: 2, vaccines: ['DPT', 'HEB', 'HIB', 'POL', 'PCV', 'ROT'] }, // Pentabio 1, Polio 2, PCV 1, Rota 1
        { age: 3, vaccines: ['DPT', 'HEB', 'HIB', 'POL', 'PCV', 'ROT'] }, // Pentabio 2, Polio 3, PCV 2, Rota 2
        { age: 4, vaccines: ['DPT', 'HEB', 'HIB', 'POL', 'PCV', 'ROT'] }, // Pentabio 3, Polio 4, PCV 3, Rota 3 (IPV dianggap bagian dari POL)
        { age: 9, vaccines: ['MEA', 'JAP'] }, // Campak/MR, JE (JAP)
        { age: 12, vaccines: ['PCV'] }, // PCV Booster
        { age: 18, vaccines: ['DPT', 'HEB', 'HIB', 'MEA'] }, // Pentabio Booster, MR Booster
    ];

    // Collect all required vaccines up to current age
    let required = new Set();
    let recommended = new Set(); // For "Sangat Lengkap"

    schedule.forEach(milestone => {
        if (ageMonths >= milestone.age) {
            milestone.vaccines.forEach(v => required.add(v));
        }
    });

    // Special case for 'fully_complete': Add advanced/optional vaccines
    if (ageMonths >= 6) recommended.add('FLU');
    if (ageMonths >= 12) recommended.add('VAR'); // Varicella
    if (ageMonths >= 12) recommended.add('HEA'); // Hep A
    if (ageMonths >= 24) recommended.add('TYP'); // Tifoid

    // Count matches
    let missingMandatory = [];
    required.forEach(v => {
        // Check if vaccine code is present in givenVaccines list
        // Note: Our VACCINES constant has codes like 'DPT', 'HEB', etc.
        // We need to check if AT LEAST ONE dose of that type is recorded if multiple doses exist in reality
        // But here we simplify: check if the code exists in the 'checked' list.
        // Since the UI checkboxes are unique per code (e.g. one 'DPT' checkbox for all doses?), 
        // WAIT: The UI has ONE checkbox per vaccine type (e.g. 'DPT') and a dose selector.
        // If the checkbox is checked, we assume at least one dose is given.
        // For accurate checking, we should check dose count vs age, but for this requirement:
        // "Berdasarkan centang pada imunisasi-imuniasi yang dicentang user" -> imply checking existence.
        
        if (!givenVaccines.includes(v)) {
            missingMandatory.push(v);
        }
    });

    const isBasicComplete = missingMandatory.length === 0;
    
    // Check extra recommended
    let extraCount = 0;
    recommended.forEach(v => {
        if (givenVaccines.includes(v)) extraCount++;
    });
    
    const isFullyComplete = isBasicComplete && extraCount >= 1; // Arbitrary logic: Basic + at least 1 advanced

    if (isFullyComplete) return 'fully_complete';
    if (isBasicComplete) return 'complete';
    return 'incomplete';
};
