<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RmdReportExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
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
        return [
            'Nama Partisipan',
            'Nomor Identitas',
            'Status',
            'Persentase (%)',
            'Modul Terisi',
            'Total Modul',
            'Terakhir Diperbarui',
        ];
    }

    public function map($row): array
    {
        return [
            $row->user_name,
            $row->user_id_number,
            $row->status,
            $row->percentage . '%',
            $row->filled_modules_count,
            $row->total_modules,
            $row->last_updated,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
