<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RmdAnalyticsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        $headers = [
            'ID',
            'Nama Partisipan',
            'Nomor Identitas',
            'Usia',
            'Kategori Usia',
            'Jumlah Modul Terisi',
            'Kategori Progress',
        ];

        // Add module headers dynamically based on known structure
        $modules = [
            'Profil RMD', 'Refleksi Alkitab', 'Sukses Sejati', 'The Only One',
            'Kecerdasan Majemuk', 'Sosial Emosional', 'Eksplorasi Karir',
            'Eksplorasi Karir P2', 'Persiapan Pulau Impian'
        ];

        foreach ($modules as $module) {
            $headers[] = $module . ' - Status';
            $headers[] = $module . ' - Progress (%)';
            $headers[] = $module . ' - Update Terakhir';
        }

        return $headers;
    }

    public function map($row): array
    {
        $mapped = [
            $row->id,
            $row->name,
            $row->id_number,
            $row->age,
            $row->age_category,
            $row->filled_modules_count,
            $row->progress_category,
        ];

        // Mapping must match the order in headings
        $moduleKeys = [
            'rmdProfile', 'rmdBibleReflection', 'rmdTrueSuccess', 'rmdTheOnlyOne',
            'rmdMultipleIntelligence', 'rmdSocioEmotional', 'rmdCareerExploration',
            'rmdCareerExplorationP2', 'rmdPreparationDreamIsland'
        ];

        foreach ($moduleKeys as $key) {
            $details = $row->modules[$key] ?? [
                'status' => 'Belum Mengisi',
                'percentage' => 0,
                'last_updated' => '-'
            ];

            $mapped[] = $details['status'];
            $mapped[] = $details['percentage'];
            $mapped[] = $details['last_updated'];
        }

        return $mapped;
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
