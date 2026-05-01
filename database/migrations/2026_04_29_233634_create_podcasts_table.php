<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('podcasts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->integer('episode_number');
            $table->string('season')->nullable();
            $table->text('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('duration')->nullable()->comment('ex: 45:30');
            $table->string('audio_url')->nullable();
            $table->string('spotify_url')->nullable();
            $table->string('apple_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('guest')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('podcasts');
    }
};
