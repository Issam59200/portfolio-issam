<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects
     */
    public function index()
    {
        $projects = Project::orderBy('order')->orderBy('created_at', 'desc')->get();
        return response()->json($projects);
    }

    /**
     * Store a newly created project
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'stack' => 'nullable|array',
            'link' => 'nullable|url',
            'github' => 'nullable|url',
            'image' => 'nullable|string',
            'featured' => 'boolean',
            'order' => 'integer',
        ]);

        $project = Project::create($validated);

        return response()->json($project, 201);
    }

    /**
     * Display the specified project
     */
    public function show(Project $project)
    {
        return response()->json($project);
    }

    /**
     * Update the specified project
     */
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'stack' => 'nullable|array',
            'link' => 'nullable|url',
            'github' => 'nullable|url',
            'image' => 'nullable|string',
            'featured' => 'boolean',
            'order' => 'integer',
        ]);

        $project->update($validated);

        return response()->json($project);
    }

    /**
     * Remove the specified project
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return response()->json([
            'message' => 'Projet supprimé avec succès',
        ]);
    }

    /**
     * Get featured projects
     */
    public function featured()
    {
        $projects = Project::where('featured', true)
            ->orderBy('order')
            ->get();

        return response()->json($projects);
    }
}
