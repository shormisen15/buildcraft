<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        return response()->json(Booking::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'service_id' => 'required|exists:services,id',
        ]);

        $service = Service::find($validated['service_id']);

        $booking = Booking::create([
            ...$validated,
            'service_title' => $service->title ?? null,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Booking created successfully!',
            'data' => $booking,
        ], 201);
    }

    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json([
            'message' => 'Booking deleted successfully!'
        ]);
    }
}
