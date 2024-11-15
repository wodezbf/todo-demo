<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HelloController;

Route::get('/test', function() {
    return response()->json(['message' => 'test']);
});

Route::get('/hello', [HelloController::class, 'hello']);
