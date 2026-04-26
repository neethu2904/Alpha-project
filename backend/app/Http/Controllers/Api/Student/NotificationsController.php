<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $student = auth()->user();
        $typeFilter = $request->query('type', 'all');
        $unreadOnly = $request->query('unread_only', false);
        $searchTerm = $request->query('search', '');

        // Sample notifications data
        $notifications = [
            [
                'id' => 1,
                'title' => 'Assignment Submitted Successfully',
                'message' => 'Your assignment "Array Operations" has been submitted successfully for CS201.',
                'type' => 'assignment',
                'read' => false,
                'timestamp' => '2025-03-22T14:30:00',
            ],
            [
                'id' => 2,
                'title' => 'Grade Published',
                'message' => 'Your grade for "Linked List Implementation" assignment is now available: 85/100',
                'type' => 'grade',
                'read' => false,
                'timestamp' => '2025-03-21T10:15:00',
            ],
            [
                'id' => 3,
                'title' => 'Attendance Alert',
                'message' => 'Your attendance in CS201 is 72%. Please ensure regular attendance to avoid any penalties.',
                'type' => 'attendance',
                'read' => true,
                'timestamp' => '2025-03-20T09:00:00',
            ],
            [
                'id' => 4,
                'title' => 'Class Cancelled',
                'message' => 'The class scheduled for 2:00 PM on March 23 (Database Management) is cancelled.',
                'type' => 'announcement',
                'read' => true,
                'timestamp' => '2025-03-19T15:45:00',
            ],
            [
                'id' => 5,
                'title' => 'New Assignment Posted',
                'message' => 'Prof. Rajesh Kumar has posted a new assignment "Binary Tree Traversal" in CS201.',
                'type' => 'assignment',
                'read' => true,
                'timestamp' => '2025-03-18T11:20:00',
            ],
            [
                'id' => 6,
                'title' => 'Upcoming Exam Reminder',
                'message' => 'Your exam "Data Structures" is scheduled for April 10, 2025 at 9:00 AM. Study well!',
                'type' => 'event',
                'read' => true,
                'timestamp' => '2025-03-17T08:30:00',
            ],
            [
                'id' => 7,
                'title' => 'System Maintenance',
                'message' => 'The portal will be under maintenance on March 25 from 2:00 AM to 4:00 AM IST.',
                'type' => 'system',
                'read' => true,
                'timestamp' => '2025-03-16T14:00:00',
            ],
            [
                'id' => 8,
                'title' => 'Placement Drive',
                'message' => 'TCS is conducting a placement drive. Register by March 30 if interested.',
                'type' => 'event',
                'read' => true,
                'timestamp' => '2025-03-15T10:00:00',
            ],
        ];

        // Apply filters
        if ($typeFilter !== 'all') {
            $notifications = array_filter($notifications, function ($n) use ($typeFilter) {
                return $n['type'] === $typeFilter;
            });
        }

        if ($unreadOnly && $unreadOnly === 'true') {
            $notifications = array_filter($notifications, function ($n) {
                return !$n['read'];
            });
        }

        if ($searchTerm) {
            $searchTerm = strtolower($searchTerm);
            $notifications = array_filter($notifications, function ($n) use ($searchTerm) {
                return stripos($n['title'], $searchTerm) !== false || stripos($n['message'], $searchTerm) !== false;
            });
        }

        // Sort by most recent first
        usort($notifications, function ($a, $b) {
            return strtotime($b['timestamp']) - strtotime($a['timestamp']);
        });

        $unreadCount = count(array_filter($notifications, fn($n) => !$n['read']));

        return response()->json([
            'success' => true,
            'data' => array_values($notifications),
            'statistics' => [
                'total_notifications' => count($notifications),
                'unread_count' => $unreadCount,
            ],
            'message' => 'Notifications retrieved successfully',
        ]);
    }

    public function markAsRead(Request $request)
    {
        $request->validate([
            'notification_id' => 'required|integer',
        ]);

        // In production, update notification read status in DB
        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read',
        ]);
    }

    public function markAllAsRead(Request $request)
    {
        $student = auth()->user();

        // In production, update all notifications for student
        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read',
        ]);
    }

    public function delete(Request $request)
    {
        $request->validate([
            'notification_id' => 'required|integer',
        ]);

        // In production, delete notification
        return response()->json([
            'success' => true,
            'message' => 'Notification deleted successfully',
        ]);
    }

    public function deleteAll(Request $request)
    {
        $student = auth()->user();

        // In production, delete all notifications for student
        return response()->json([
            'success' => true,
            'message' => 'All notifications deleted successfully',
        ]);
    }

    public function getPreferences(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'announcements' => true,
                'assignments' => true,
                'grades' => true,
                'attendance' => true,
                'events' => true,
            ],
            'message' => 'Notification preferences retrieved',
        ]);
    }

    public function updatePreferences(Request $request)
    {
        $request->validate([
            'announcements' => 'boolean',
            'assignments' => 'boolean',
            'grades' => 'boolean',
            'attendance' => 'boolean',
            'events' => 'boolean',
        ]);

        // In production, save preferences to DB
        return response()->json([
            'success' => true,
            'message' => 'Notification preferences updated',
        ]);
    }
}
