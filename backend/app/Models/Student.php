<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'registration_number',
        'department_code',
        'year',
        'status',
        'cgpa',
        'attendance',
        'phone',
        'mentor',
        'fee_status',
        'placed_company',
        'skills',
    ];

    protected function casts(): array
    {
        return [
            'cgpa' => 'float',
            'attendance' => 'integer',
            'skills' => 'array',
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
