<?php

namespace App\Http\Controllers;

use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class TempImageController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors('image')
            ]);
        }

        $image = $request->image;

        $ext = $image->getClientOriginalExtension();
        $imageName = strtotime('now') . '.' . $ext;

        $model = new TempImage();
        $model->name = $imageName;
        $model->save();
        $image->move(public_path('uploads/temp'), $imageName);

        $srcPath = public_path('uploads/temp/'.$imageName);
        $destPath = public_path('uploads/temp/thumb/'.$imageName);
        $manager = new ImageManager(Driver::class);
        $image = $manager->read($srcPath);
        $image->coverDown(300,300);
        $image->save($destPath);

        return response()->json([
            'status' => true,
            'data' => $model,
            'errors' => 'Image uploaded Successfully.'
        ]);
    }
}
