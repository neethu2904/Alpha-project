<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\LogsActivity;

class ResultPublishingLog extends Model
{
    use SoftDeletes, LogsActivity;

    protected $fillable = [
        'semester_id',
        'published_by',
        'total_students',
        'students_published',
        'action',
        'details',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function publishedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'published_by');
    }
}
