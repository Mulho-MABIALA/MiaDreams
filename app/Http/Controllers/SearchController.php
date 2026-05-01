<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Post;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $q = trim($request->get('q', ''));

        if (strlen($q) < 2) {
            return Inertia::render('Search', [
                'query'   => $q,
                'posts'   => [],
                'brands'  => [],
                'products'=> [],
            ]);
        }

        $posts = Post::published()
            ->where(fn($query) => $query
                ->where('title', 'like', "%{$q}%")
                ->orWhere('excerpt', 'like', "%{$q}%")
                ->orWhere('category', 'like', "%{$q}%")
            )
            ->take(6)
            ->get(['id', 'title', 'slug', 'category', 'excerpt', 'cover_image', 'published_at']);

        $brands = Brand::where('is_active', true)
            ->where(fn($query) => $query
                ->where('name', 'like', "%{$q}%")
                ->orWhere('description', 'like', "%{$q}%")
            )
            ->take(4)
            ->get(['id', 'name', 'slug', 'logo']);

        $products = Product::where('is_active', true)
            ->where(fn($query) => $query
                ->where('name', 'like', "%{$q}%")
                ->orWhere('description', 'like', "%{$q}%")
            )
            ->take(6)
            ->get(['id', 'name', 'slug', 'image', 'price']);

        return Inertia::render('Search', compact('q', 'posts', 'brands', 'products'));
    }
}
