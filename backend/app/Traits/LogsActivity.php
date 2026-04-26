<?php

namespace App\Traits;

use App\Models\ActivityLog;

trait LogsActivity
{
    protected static function bootLogsActivity()
    {
        static::created(function ($model) {
            ActivityLog::log(
                'created',
                class_basename($model),
                $model->id,
                ['new_values' => $model->toArray()]
            );
        });

        static::updated(function ($model) {
            $changes = [];
            foreach ($model->getChanges() as $key => $newValue) {
                $changes[$key] = [
                    'old' => $model->getOriginal($key),
                    'new' => $newValue,
                ];
            }

            if (!empty($changes)) {
                ActivityLog::log(
                    'updated',
                    class_basename($model),
                    $model->id,
                    $changes
                );
            }
        });

        static::deleted(function ($model) {
            ActivityLog::log(
                'deleted',
                class_basename($model),
                $model->id,
                ['deleted_values' => $model->toArray()]
            );
        });
    }
}
