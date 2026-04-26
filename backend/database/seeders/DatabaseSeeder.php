<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * 
     * Uses ONLY Spatie permissions system (unified from old "custom system").
     * CampusDemoSeeder handles all data: designations, users, departments, companies, etc.
     */
    public function run(): void
    {
        $this->call([
            SpatiePermissionsSeeder::class,  // Create 96 Spatie permissions + roles
            CampusDemoSeeder::class,         // Create demo data (users, designations, departments, etc)
        ]);
    }
}
