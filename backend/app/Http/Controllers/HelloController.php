<?php

namespace App\Http\Controllers;

use App\Http\Requests\HelloRequest;

class HelloController extends Controller
{
    public function hello(HelloRequest $request){
        return response()->json([
            'message' => 'hello ' . $request->name,
            'status' => 200,
            'data' => [
                'timestamp' => now(),
                'version' => '1.0',
                'api' => 'test',
                'user_info' => [
                    'name' => $request->name,
                    'age' => $request->age,
                    'email' => $request->email
                ]
            ]
        ]);
    }
}
