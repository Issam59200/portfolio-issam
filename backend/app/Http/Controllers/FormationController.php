<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FormationController extends Controller
{
    public function index(Request $request)
    {
        $query = Formation::query();

        if ($request->has('current')) {
            $query->current();
        }

        $query->ordered();

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'field' => 'required|string|max:255',
            'location' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'current' => 'nullable|boolean',
            'description' => 'nullable|string',
            'skills_acquired' => 'nullable|array',
            'logo' => 'nullable|string',
            'grade' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $formation = Formation::create($request->all());
        return response()->json($formation, 201);
    }

    public function show($id)
    {
        $formation = Formation::findOrFail($id);
        return response()->json($formation);
    }

    public function update(Request $request, $id)
    {
        $formation = Formation::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'school' => 'sometimes|required|string|max:255',
            'degree' => 'sometimes|required|string|max:255',
            'field' => 'sometimes|required|string|max:255',
            'location' => 'nullable|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after:start_date',
            'current' => 'nullable|boolean',
            'description' => 'nullable|string',
            'skills_acquired' => 'nullable|array',
            'logo' => 'nullable|string',
            'grade' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $formation->update($request->all());
        return response()->json($formation);
    }

    public function destroy($id)
    {
        $formation = Formation::findOrFail($id);
        $formation->delete();
        return response()->json(['message' => 'Formation deleted successfully']);
    }
}
