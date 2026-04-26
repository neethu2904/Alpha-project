<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\LogsActivity;

class RevaluationRequest extends Model
{
    use SoftDeletes, LogsActivity;

    protected $fillable = [
        'mark_entry_id',
        'student_id',
        'reason',
        'status',
        'updated_marks',
        'revaluation_remarks',
        'revalued_by',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    public function markEntry(): BelongsTo
    {
        return $this->belongsTo(MarkEntry::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function revaluedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'revalued_by');
    }
}
