<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ParticipantsImport;

class ImportParticipants extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-participants';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import participants from Excel file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting import...');
        
        try {
            Excel::import(new ParticipantsImport, base_path('list_partisipant.xlsx'));
            $this->info('Import completed successfully.');
        } catch (\Exception $e) {
            $this->error('Error importing file: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
