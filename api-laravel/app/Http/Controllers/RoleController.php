<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function lihat(Request $request)
    {
        $query = Role::query();
        $query->where("status","AKTIF");
        if ($request->has('search')) {
            $query->where('nama', 'like', '%'.$request->search.'%');
        }

        // ✅ Urutan data (sorting)
        if ($request->has('sort_by') && $request->has('sort_dir')) {
            $query->orderBy($request->sort_by, $request->sort_dir);
        } else {
            $query->latest(); // default: urut dari yang terbaru
        }
        $query->with(['menu']); // default: urut dari yang terbaru
        
        // ✅ Pagination (misal 10 per halaman)
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);
        $data = $query->paginate($perPage, ['*'], 'page', $page);

        // ✅ Response JSON
        return response()->json(
            $data
        ,200);
    }

    public function tambah(Request $request){
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'menu' => 'required|array|min:1',
            'menu.*.nama' => 'required|string|max:100',
            'menu.*.path' => 'required|string|max:100',
            'menu.*.akses' => 'required|string|max:100'
        ]);
        $role = Role::create([
            'nama' => $validated['nama'],
            'status' => "AKTIF"
        ]);
        foreach ($validated['menu'] as $item) {
            $role->menu()->create([
                'nama' => $item['nama'],
                'path' => $item['path'],
                'akses' => $item['akses']
            ]);
        }

        return response()->json([
            'pesan' => 'Role berhasil dibuat',
            'data' => $role->load('menu')
        ], 200);
    }

    public function edit(Request $request, $id)
    {
        // ✅ Validasi input
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'menu' => 'required|array|min:1',
            'menu.*.nama' => 'required|string|max:100',
            'menu.*.path' => 'required|string|max:100',
            'menu.*.akses' => 'required|string|max:100'
        ]);

        // ✅ Cari Role berdasarkan ID
        $role = Role::find($id);
        if (!$role) {
            return response()->json([
                'status' => 'error',
                'pesan' => 'Role tidak ditemukan'
            ], 404);
        }

        // ✅ Update nama atau field lain
        $role->update([
            'nama' => $validated['nama']
        ]);

        // ✅ Hapus menu lama dan ganti dengan yang baru
        $role->menu()->delete();

        foreach ($validated['menu'] as $item) {
            $role->menu()->create([
                'nama' => $item['nama'],
                'path' => $item['path'],
                'akses' => $item['akses']
            ]);
        }

        // ✅ Return data baru
        return response()->json([
            'status' => 'success',
            'pesan' => 'Role berhasil diperbarui',
            'data' => $role->load('menu')
        ], 200);
    }

    public function hapus($id)
    {
        // ✅ Cari Role berdasarkan ID
        $role = Role::find($id);
        if (!$role) {
            return response()->json([
                'status' => 'error',
                'pesan' => 'Role tidak ditemukan'
            ], 404);
        }

        // ✅ Hapus role-nya
        $role->update(["status","NONAKTIF"]);

        return response()->json([
            'status' => 'success',
            'pesan' => 'Role dan menu terkait berhasil dihapus'
        ], 200);
    }
}
