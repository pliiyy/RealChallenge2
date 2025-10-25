<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', fn() => response()->json(['message' => 'API Ready']));

// Auth Route
Route::post('/login', [AuthenticationController::class,'login']);
Route::middleware(['auth:sanctum'])->post("/logout",[AuthenticationController::class,'logout']);

// User My Self Route
Route::middleware('auth:sanctum')->get('/biodata', [UserController::class,'biodata']);

// Role Route
// Route::middleware(['auth:sanctum', 'check.access:/role,read'])->get('/role',[RoleController::class,'lihat']);
// Route::middleware(['auth:sanctum', 'check.access:/role,create'])->post('/role',[RoleController::class,'tambah']);
// Route::middleware(['auth:sanctum', 'check.access:/role,update'])->put('/role/{id}',[RoleController::class,'edit']);
// Route::middleware(['auth:sanctum', 'check.access:/role,delete'])->delete('/role/{id}',[RoleController::class,'hapus']);
Route::prefix('role')->middleware(['auth:sanctum'])->group(function () {
    Route::middleware('check.access:/role,lihat')->get('/', [RoleController::class, 'lihat']);
    Route::middleware('check.access:/role,tambah')->post('/', [RoleController::class, 'tambah']);
    Route::middleware('check.access:/role,edit')->put('/{id}', [RoleController::class, 'edit']);
    Route::middleware('check.access:/role,hapus')->delete('/{id}', [RoleController::class, 'hapus']);
});