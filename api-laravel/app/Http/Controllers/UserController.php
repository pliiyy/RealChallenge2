<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function biodata(Request $request){
        $data = $request->user()->load(['biodata','role','menu']);
        return response()->json([
            "pesan" => "OK",
            "user" => $data,
            "menu" => $data->menu
        ]);
    }
}
