<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\LogsActivity;

class Student extends Model
{
    use SoftDeletes, LogsActivity;
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'registration_number',
        'department_code',
        'college_id',
        'year',
        'gender',
        'status',
        'cgpa',
        'attendance',
        'phone',
        'mentor',
        'fee_status',
        'placed_company',
        'placement_score',
        'risk_level',
        'resume_profile',
    ];

    protected function casts(): array
    {
        return [
            'cgpa' => 'float',
            'attendance' => 'integer',
            'skills' => 'array',
            'resume_profile' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(CompanyApplication::class);
    }
}
