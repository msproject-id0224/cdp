<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Carbon\Carbon;

class ParticipantsImport implements ToCollection, WithHeadingRow
{
    public $successCount = 0;
    public $failCount = 0;
    public $skipCount = 0;
    public $errors = [];

    public function collection(Collection $rows)
    {
        Log::info('Starting Participants Import process...');

        foreach ($rows as $index => $row) {
            $rowNum = $index + 2; // +2 because header is row 1 and index is 0-based
            
            try {
                // 1. Validation
                $validator = Validator::make($row->toArray(), [
                    'akun_seseorang_nama_depan' => 'required',
                    'nomor_lokal_penmanfaat' => 'required', // Assuming this is the slug for "Nomor Lokal Pen.Manfaat"
                ]);

                if ($validator->fails()) {
                    $this->failCount++;
                    $this->errors[] = "Row {$rowNum}: Validation failed. " . implode(', ', $validator->errors()->all());
                    Log::warning("Row {$rowNum}: Validation failed", $validator->errors()->toArray());
                    continue;
                }

                $idNumber = $row['nomor_lokal_penmanfaat'];
                
                // Ensure id_number is string and padded if necessary (though user data seems to have leading zeros)
                // If excel returns int 163, we might need to pad it if the convention is 4 digits.
                // Looking at sample: "0163".
                
                // 2. Check Duplication
                if (User::where('id_number', $idNumber)->exists()) {
                    $this->skipCount++;
                    $this->errors[] = "Row {$rowNum}: Skipped. ID Number {$idNumber} already exists.";
                    Log::info("Row {$rowNum}: Skipped duplicate ID {$idNumber}");
                    continue;
                }

                // 3. Prepare Data
                $dob = null;
                if (!empty($row['akun_seseorang_tanggal_lahir'])) {
                    try {
                        if (is_numeric($row['akun_seseorang_tanggal_lahir'])) {
                            $dob = Date::excelToDateTimeObject($row['akun_seseorang_tanggal_lahir']);
                        } else {
                            $dob = Carbon::parse($row['akun_seseorang_tanggal_lahir']);
                        }
                    } catch (\Exception $e) {
                        Log::warning("Row {$rowNum}: Invalid date format for DOB: " . $row['akun_seseorang_tanggal_lahir']);
                    }
                }

                $email = "participant_{$idNumber}@program.com";
                // Ensure email uniqueness too
                if (User::where('email', $email)->exists()) {
                    $email = "participant_{$idNumber}_" . uniqid() . "@program.com";
                }

                // 4. Create User
                User::create([
                    'first_name' => $row['akun_seseorang_nama_depan'],
                    'last_name' => $row['akun_seseorang_nama_belakang'] ?? '',
                    'nickname' => $row['akun_seseorang_nama_panggilan'] ?? null,
                    'id_number' => $idNumber,
                    'email' => $email,
                    'role' => User::ROLE_PARTICIPANT,
                    'date_of_birth' => $dob,
                    'gender' => $row['jenis_kelamin'] ?? null,
                    'education' => $row['pendidikan'] ?? null,
                    'age_group' => $row['kelompok_usia'] ?? null,
                    'is_active' => true,
                ]);

                $this->successCount++;
                Log::info("Row {$rowNum}: Imported user {$idNumber}");

            } catch (\Exception $e) {
                $this->failCount++;
                $this->errors[] = "Row {$rowNum}: Exception. " . $e->getMessage();
                Log::error("Row {$rowNum}: Exception", ['error' => $e->getMessage()]);
            }
        }
        
        Log::info("Import completed. Success: {$this->successCount}, Failed: {$this->failCount}, Skipped: {$this->skipCount}");
    }
}
