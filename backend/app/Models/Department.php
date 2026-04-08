<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $fillable = [
        'name',
        'code',
        'hod',
        'staff_count',
        'intake',
        'accent',
    ];

    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'department_code', 'code');
    }
}
