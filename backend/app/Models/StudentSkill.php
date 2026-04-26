<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentSkill extends Model
{
    protected $table = 'student_skills';

    protected $fillable = [
        'student_id',
        'skill',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
