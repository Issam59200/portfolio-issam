<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GameController extends Controller
{
    public function index(Request $request)
    {
        $query = Game::query();

        if ($request->has('featured')) {
            $query->featured();
        }

        if ($request->has('game_type')) {
            $query->where('game_type', $request->game_type);
        }

        $query->ordered();

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'game_type' => 'required|string',
            'technology' => 'required|string',
            'thumbnail' => 'nullable|string',
            'screenshots' => 'nullable|array',
            'video_url' => 'nullable|url',
            'play_url' => 'nullable|url',
            'repository_url' => 'nullable|url',
            'release_date' => 'nullable|date',
            'featured' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $game = Game::create($request->all());
        return response()->json($game, 201);
    }

    public function show($id)
    {
        $game = Game::findOrFail($id);
        return response()->json($game);
    }

    public function update(Request $request, $id)
    {
        $game = Game::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'game_type' => 'sometimes|required|string',
            'technology' => 'sometimes|required|string',
            'thumbnail' => 'nullable|string',
            'screenshots' => 'nullable|array',
            'video_url' => 'nullable|url',
            'play_url' => 'nullable|url',
            'repository_url' => 'nullable|url',
            'release_date' => 'nullable|date',
            'featured' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $game->update($request->all());
        return response()->json($game);
    }

    public function destroy($id)
    {
        $game = Game::findOrFail($id);
        $game->delete();
        return response()->json(['message' => 'Game deleted successfully']);
    }
}
