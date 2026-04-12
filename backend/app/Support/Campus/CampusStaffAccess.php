<?php

namespace App\Support\Campus;

final class CampusStaffAccess
{
    public static function basePermissions(): array
    {
        return [
            CampusPermission::DASHBOARD_VIEW,
            CampusPermission::PROFILE_VIEW,
        ];
    }

    public static function assignablePermissions(): array
    {
        return [
            CampusPermission::STUDENTS_VIEW,
            CampusPermission::STUDENTS_CREATE,
            CampusPermission::DEPARTMENTS_VIEW,
            CampusPermission::DEPARTMENTS_CREATE,
            CampusPermission::PLACEMENT_VIEW,
            CampusPermission::PLACEMENT_CREATE,
            CampusPermission::ANNOUNCEMENTS_VIEW,
            CampusPermission::ANNOUNCEMENTS_CREATE,
            CampusPermission::REPORTS_VIEW,
        ];
    }

    public static function presets(): array
    {
        return [
            'department_coordinator' => [
                'title' => 'Department Coordinator',
                'description' => 'Students, placement, announcements, and reports for a department-facing staff member.',
                'permissions' => [
                    CampusPermission::STUDENTS_VIEW,
                    CampusPermission::STUDENTS_CREATE,
                    CampusPermission::PLACEMENT_VIEW,
                    CampusPermission::PLACEMENT_CREATE,
                    CampusPermission::ANNOUNCEMENTS_VIEW,
                    CampusPermission::ANNOUNCEMENTS_CREATE,
                    CampusPermission::REPORTS_VIEW,
                ],
            ],
            'hr' => [
                'title' => 'HR',
                'description' => 'Placement-heavy access for interview planning, company updates, and student tracking.',
                'permissions' => [
                    CampusPermission::STUDENTS_VIEW,
                    CampusPermission::PLACEMENT_VIEW,
                    CampusPermission::PLACEMENT_CREATE,
                    CampusPermission::ANNOUNCEMENTS_VIEW,
                    CampusPermission::ANNOUNCEMENTS_CREATE,
                    CampusPermission::REPORTS_VIEW,
                ],
            ],
            'exam_coordinator' => [
                'title' => 'Exam Coordinator',
                'description' => 'Academic coordination with department visibility, student records, and announcements.',
                'permissions' => [
                    CampusPermission::STUDENTS_VIEW,
                    CampusPermission::DEPARTMENTS_VIEW,
                    CampusPermission::ANNOUNCEMENTS_VIEW,
                    CampusPermission::ANNOUNCEMENTS_CREATE,
                    CampusPermission::REPORTS_VIEW,
                ],
            ],
            'efc' => [
                'title' => 'EFC',
                'description' => 'Fee and compliance follow-up through student records, departments, and reports.',
                'permissions' => [
                    CampusPermission::STUDENTS_VIEW,
                    CampusPermission::DEPARTMENTS_VIEW,
                    CampusPermission::REPORTS_VIEW,
                    CampusPermission::ANNOUNCEMENTS_VIEW,
                ],
            ],
        ];
    }

    public static function designationSeeds(): array
    {
        return collect(self::presets())
            ->map(fn (array $preset, string $slug) => [
                'slug' => $slug,
                'name' => $preset['title'],
                'description' => $preset['description'] ?? null,
                'permissions' => self::normalize($preset['permissions'] ?? []),
            ])
            ->values()
            ->all();
    }

    public static function normalize(array $permissions): array
    {
        $impliedPermissions = [];

        if (in_array(CampusPermission::STUDENTS_CREATE, $permissions, true)) {
            $impliedPermissions[] = CampusPermission::STUDENTS_VIEW;
        }
        if (in_array(CampusPermission::DEPARTMENTS_CREATE, $permissions, true)) {
            $impliedPermissions[] = CampusPermission::DEPARTMENTS_VIEW;
        }
        if (in_array(CampusPermission::PLACEMENT_CREATE, $permissions, true)) {
            $impliedPermissions[] = CampusPermission::PLACEMENT_VIEW;
        }
        if (in_array(CampusPermission::ANNOUNCEMENTS_CREATE, $permissions, true)) {
            $impliedPermissions[] = CampusPermission::ANNOUNCEMENTS_VIEW;
        }

        return collect([
            ...self::basePermissions(),
            ...$permissions,
            ...$impliedPermissions,
        ])
            ->filter(fn (mixed $permission) => in_array($permission, CampusPermission::all(), true))
            ->unique()
            ->values()
            ->all();
    }

    public static function defaultPermissions(): array
    {
        return self::normalize(self::presets()['department_coordinator']['permissions']);
    }
}
