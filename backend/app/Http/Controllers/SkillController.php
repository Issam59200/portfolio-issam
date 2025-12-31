<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SkillController extends Controller
{
    public function index(Request $request)
    {
        $query = Skill::query();

        // Filtre par catégorie
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Filtre featured
        if ($request->has('featured')) {
            $query->featured();
        }

        // Tri
        $query->ordered();

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'level' => 'nullable|integer|min:1|max:100',
            'icon' => 'nullable|string',
            'description' => 'nullable|string',
            'years_experience' => 'nullable|integer|min:0',
            'featured' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $skill = Skill::create($request->all());
        return response()->json($skill, 201);
    }

    public function show($id)
    {
        $skill = Skill::findOrFail($id);
        return response()->json($skill);
    }

    public function update(Request $request, $id)
    {
        $skill = Skill::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'level' => 'nullable|integer|min:1|max:100',
            'icon' => 'nullable|string',
            'description' => 'nullable|string',
            'years_experience' => 'nullable|integer|min:0',
            'featured' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $skill->update($request->all());
        return response()->json($skill);
    }

    public function destroy($id)
    {
        $skill = Skill::findOrFail($id);
        $skill->delete();
        return response()->json(['message' => 'Skill deleted successfully']);
    }

    // Obtenir les compétences par catégorie
    public function byCategory($category)
    {
        $skills = Skill::byCategory($category)->ordered()->get();
        return response()->json($skills);
    }

    // Obtenir toutes les catégories
    public function categories()
    {
        $categories = Skill::select('category')->distinct()->pluck('category');
        return response()->json($categories);
    }
}
