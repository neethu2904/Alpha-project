<?php

namespace App\Support\Campus;

final class CampusPermission
{
    public const DASHBOARD_VIEW = 'dashboard.view';
    public const STUDENTS_VIEW = 'students.view';
    public const STUDENTS_CREATE = 'students.create';
    public const DEPARTMENTS_VIEW = 'departments.view';
    public const DEPARTMENTS_CREATE = 'departments.create';
    public const PLACEMENT_VIEW = 'placement.view';
    public const PLACEMENT_CREATE = 'placement.create';
    public const PLACEMENT_APPLY = 'placement.apply';
    public const ANNOUNCEMENTS_VIEW = 'announcements.view';
    public const ANNOUNCEMENTS_CREATE = 'announcements.create';
    public const REPORTS_VIEW = 'reports.view';
    public const PROFILE_VIEW = 'profile.view';
    public const DEMO_RESET = 'demo.reset';

    public static function all(): array
    {
        return [
            self::DASHBOARD_VIEW,
            self::STUDENTS_VIEW,
            self::STUDENTS_CREATE,
            self::DEPARTMENTS_VIEW,
            self::DEPARTMENTS_CREATE,
            self::PLACEMENT_VIEW,
            self::PLACEMENT_CREATE,
            self::PLACEMENT_APPLY,
            self::ANNOUNCEMENTS_VIEW,
            self::ANNOUNCEMENTS_CREATE,
            self::REPORTS_VIEW,
            self::PROFILE_VIEW,
            self::DEMO_RESET,
        ];
    }

    public static function byRole(): array
    {
        return [
            'admin' => self::all(),
            'staff' => [
                self::DASHBOARD_VIEW,
                self::STUDENTS_VIEW,
                self::STUDENTS_CREATE,
                self::PLACEMENT_VIEW,
                self::PLACEMENT_CREATE,
                self::ANNOUNCEMENTS_VIEW,
                self::ANNOUNCEMENTS_CREATE,
                self::REPORTS_VIEW,
                self::PROFILE_VIEW,
            ],
            'student' => [
                self::DASHBOARD_VIEW,
                self::PLACEMENT_VIEW,
                self::PLACEMENT_APPLY,
                self::ANNOUNCEMENTS_VIEW,
                self::PROFILE_VIEW,
            ],
        ];
    }
}
