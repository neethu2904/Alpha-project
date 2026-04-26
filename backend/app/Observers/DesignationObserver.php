<?php

namespace App\Observers;

use App\Models\Designation;
use App\Support\Campus\CampusPermission;
use App\Support\Campus\CampusStaffAccess;

class DesignationObserver
{
    /**
     * Handle the Designation "updated" event.
     * When a designation's permissions change, sync all users with that designation.
     */
    public function updated(Designation $designation): void
    {
        $this->syncUsersForDesignation($designation);
    }

    /**
     * Sync all users with this designation to the new permission set.
     */
    private function syncUsersForDesignation(Designation $designation): void
    {
        $designationPermissions = CampusStaffAccess::normalize($designation->resolvedPermissions());

        // Get all users with this designation
        $designation->users()->each(function ($user) use ($designationPermissions): void {
            $rolePermissions = CampusPermission::byRole()[$user->role] ?? [];
            $userPermissions = array_unique(array_merge($rolePermissions, $designationPermissions));
            $user->syncPermissions($userPermissions);
        });
    }
}
