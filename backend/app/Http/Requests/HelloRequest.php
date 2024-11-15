<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HelloRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:0|max:150',
            'email' => 'required|email'
        ];
    }

    public function messages()
    {
        return [
            'name.required' => '名字不能为空',
            'age.required' => '年龄不能为空',
            'age.integer' => '年龄必须是整数',
            'age.min' => '年龄不能小于0',
            'age.max' => '年龄不能大于150',
            'email.required' => '邮箱不能为空',
            'email.email' => '邮箱格式不正确'
        ];
    }
} 