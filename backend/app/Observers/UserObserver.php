<?php

namespace App\Observers;

use App\Models\User;
use App\Support\Campus\CampusPermission;
use App\Support\Campus\CampusStaffAccess;

class UserObserver
{
    /**
     * Handle the User "created" event.
     * When a user is created with a designation, sync their permissions.
     */
    public function created(User $user): void
    {
        $this->syncUserPermissions($user);
    }

    /**
     * Handle the User "updated" event.
     * If designation or role changes, re-sync permissions.
     */
    public function updated(User $user): void
    {
        // Re-sync when role or designation changes.
        if ($user->isDirty('designation_id') || $user->isDirty('role')) {
            $this->syncUserPermissions($user);
        }
    }

    /**
     * Sync user permissions based on their role and designation.
     */
    private function syncUserPermissions(User $user): void
    {
        $permissions = [];

        // Admin users always receive full module access.
        if (in_array($user->role, ['admin', 'super_admin'], true)) {
            $user->syncPermissions(CampusPermission::all());
            return;
        }

        // Base permissions by role
        if ($user->role) {
            $rolePermissions = CampusPermission::byRole()[$user->role] ?? [];
            $permissions = array_merge($permissions, $rolePermissions);
        }

        // Additional permissions from designation (if staff)
        if ($user->role === 'staff' && $user->designation_id && $user->designation) {
            $designationPermissions = $user->designation->resolvedPermissions();
            if (!empty($designationPermissions)) {
                $normalized = CampusStaffAccess::normalize($designationPermissions);
                $permissions = array_merge($permissions, $normalized);
            }
        }

        // Sync to Spatie
        if (!empty($permissions)) {
            $unique = array_unique($permissions);
            $user->syncPermissions($unique);
        }
    }
}
