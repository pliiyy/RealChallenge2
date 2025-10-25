<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $menuPath, string $requiredAccess): Response
    {
        $user = $request->user()?->load('role.menu');

        if (!$user) {
            return response()->json(['pesan' => 'Login telah kadaluarsa. Mohon login ulang!'], 401);
        }
        foreach ($user->role as $role) {
            foreach ($role->menu as $menu) {
                $aksesList = explode(',', $menu->akses);
                if ($menu->path === $menuPath && in_array($requiredAccess, $aksesList)) {
                    return $next($request);
                }
            }
        }

        return response()->json(['pesan' => 'Anda tidak diizinkan untuk mengakses halaman ini'], 403);
    }
}
