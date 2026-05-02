<?php

namespace App\Http\Controllers;

use App\Models\Podcast;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    /** Page principale : liste articles + podcasts */
    public function index(Request $request)
    {
        $category = $request->query('category');
        $search   = trim($request->query('search', ''));

        $postsQuery = Post::published();
        if ($category) {
            $postsQuery->where('category', $category);
        }
        if ($search) {
            $postsQuery->where(fn($q) => $q
                ->where('title', 'like', "%{$search}%")
                ->orWhere('excerpt', 'like', "%{$search}%")
                ->orWhere('content', 'like', "%{$search}%")
            );
        }

        $featured      = $search ? null : Post::published()->featured()->first();
        $posts         = $postsQuery->paginate(9)->withQueryString();
        $podcasts      = $search ? collect() : Podcast::published()->take(6)->get();
        $latestPodcast = $search ? null : Podcast::published()->first();

        $categories = Post::where('is_published', true)
            ->whereNotNull('published_at')
            ->select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');

        return Inertia::render('Blog/Index', compact(
            'featured', 'posts', 'podcasts', 'latestPodcast', 'categories', 'category', 'search'
        ));
    }

    /** Page détail d'un article */
    public function show(string $slug)
    {
        $post    = Post::published()->where('slug', $slug)->firstOrFail();
        $related = Post::published()
            ->where('category', $post->category)
            ->where('id', '!=', $post->id)
            ->take(3)
            ->get();

        return Inertia::render('Blog/Show', compact('post', 'related'));
    }
}
