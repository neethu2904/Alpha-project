<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\LogsActivity;

class College extends Model
{
    use SoftDeletes, LogsActivity;

    protected $fillable = [
        'name',
        'code',
        'location',
        'principal_name',
        'principal_email',
        'phone',
        'description',
        'status',
    ];

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function announcements(): HasMany
    {
        return $this->hasMany(Announcement::class);
    }

    public function companies(): HasMany
    {
        return $this->hasMany(Company::class);
    }
}
