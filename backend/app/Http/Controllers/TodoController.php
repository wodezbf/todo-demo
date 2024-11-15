<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function index(Request $request)
    {
        $query = Todo::query();
        
        // 添加搜索功能
        if ($request->has('search')) {
            $searchTerm = $request->get('search');
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // 优先级排序（high > medium > low）
        $query->orderByRaw("CASE 
            WHEN priority = 'high' THEN 1 
            WHEN priority = 'medium' THEN 2 
            WHEN priority = 'low' THEN 3 
            END");
        
        // 然后按更新时间倒序
        $query->orderBy('updated_at', 'desc');

        return response()->json(
            $query->get(),
            200,
            ['Content-Type' => 'application/json']
        );
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'priority' => 'required|in:low,medium,high'
            ]);
            
            $todo = Todo::create($validated);
            return response()->json($todo, 201);
        } catch (\Exception $e) {
            \Log::error('Error creating todo: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating todo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Todo $todo)
    {
        return response()->json($todo);
    }

    public function update(Request $request, Todo $todo)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'sometimes|boolean',
            'priority' => 'sometimes|required|in:low,medium,high'
        ]);

        $todo->update($validated);
        return response()->json($todo);
    }

    public function destroy(Todo $todo)
    {
        $todo->delete();
        return response()->json(null, 204);
    }
} 