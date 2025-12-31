<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExperienceController extends Controller
{
    public function index(Request $request)
    {
        $query = Experience::query();

        if ($request->has('current')) {
            $query->current();
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $query->ordered();

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'location' => 'nullable|string',
            'type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'current' => 'nullable|boolean',
            'description' => 'required|string',
            'technologies' => 'nullable|array',
            'achievements' => 'nullable|array',
            'logo' => 'nullable|string',
            'website' => 'nullable|url',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $experience = Experience::create($request->all());
        return response()->json($experience, 201);
    }

    public function show($id)
    {
        $experience = Experience::findOrFail($id);
        return response()->json($experience);
    }

    public function update(Request $request, $id)
    {
        $experience = Experience::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'company' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|required|string|max:255',
            'location' => 'nullable|string',
            'type' => 'sometimes|required|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after:start_date',
            'current' => 'nullable|boolean',
            'description' => 'sometimes|required|string',
            'technologies' => 'nullable|array',
            'achievements' => 'nullable|array',
            'logo' => 'nullable|string',
            'website' => 'nullable|url',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $experience->update($request->all());
        return response()->json($experience);
    }

    public function destroy($id)
    {
        $experience = Experience::findOrFail($id);
        $experience->delete();
        return response()->json(['message' => 'Experience deleted successfully']);
    }
}
