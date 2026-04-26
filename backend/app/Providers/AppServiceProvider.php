<?php

namespace App\Providers;

use App\Models\Designation;
use App\Models\User;
use App\Observers\DesignationObserver;
use App\Observers\UserObserver;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::before(function ($user, string $ability): ?bool {
            if (($user->role ?? null) === 'admin' || $user->hasRole('super_admin')) {
                return true;
            }

            return null;
        });

        // Register model observers for automatic permission syncing
        User::observe(UserObserver::class);
        Designation::observe(DesignationObserver::class);
    }
}
