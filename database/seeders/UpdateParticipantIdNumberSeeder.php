<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UpdateParticipantIdNumberSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'participant')->get();
        $count = 0;
        foreach ($users as $user) {
            if ($user->id_number && is_numeric($user->id_number)) {
                $len = strlen($user->id_number);
                $prefix = null;

                if ($len === 5) {
                    $prefix = 'ID-0224';
                } elseif ($len === 4) {
                    $prefix = 'ID-02240';
                } elseif ($len === 3) {
                    $prefix = 'ID-022400';
                }

                if ($prefix) {
                    $user->id_number = $prefix . $user->id_number;
                    $user->save();
                    $count++;
                }
            }
        }
        $this->command->info("Updated $count participant ID numbers.");
    }
}
