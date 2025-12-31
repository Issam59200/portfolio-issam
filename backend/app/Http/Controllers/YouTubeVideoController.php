<?php

namespace App\Http\Controllers;

use App\Models\YouTubeVideo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class YouTubeVideoController extends Controller
{
    public function index(Request $request)
    {
        $query = YouTubeVideo::query();

        if ($request->has('featured')) {
            $query->featured();
        }

        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        $query->ordered();

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video_id' => 'required|string',
            'video_url' => 'required|url',
            'thumbnail' => 'nullable|string',
            'category' => 'nullable|string',
            'published_at' => 'nullable|date',
            'views' => 'nullable|integer',
            'likes' => 'nullable|integer',
            'featured' => 'nullable|boolean',
            'order' => 'nullable|integer',
            'tags' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $video = YouTubeVideo::create($request->all());
        return response()->json($video, 201);
    }

    public function show($id)
    {
        $video = YouTubeVideo::findOrFail($id);
        return response()->json($video);
    }

    public function update(Request $request, $id)
    {
        $video = YouTubeVideo::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'video_id' => 'sometimes|required|string',
            'video_url' => 'sometimes|required|url',
            'thumbnail' => 'nullable|string',
            'category' => 'nullable|string',
            'published_at' => 'nullable|date',
            'views' => 'nullable|integer',
            'likes' => 'nullable|integer',
            'featured' => 'nullable|boolean',
            'order' => 'nullable|integer',
            'tags' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $video->update($request->all());
        return response()->json($video);
    }

    public function destroy($id)
    {
        $video = YouTubeVideo::findOrFail($id);
        $video->delete();
        return response()->json(['message' => 'Video deleted successfully']);
    }
}
