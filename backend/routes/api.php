Route::get('/ping', fn() => response()->json(['message' => 'Backend Ready 🚀']));

use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json(['message' => 'Backend Ready 🚀']);
});
