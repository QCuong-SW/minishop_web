<?php
namespace App\Shared\Utils;

class Validator {
    public static function validate(array $data, array $rules): array {
        $errors = [];
        foreach ($rules as $field => $ruleList) {
            $rulesArray = explode('|', $ruleList);
            foreach ($rulesArray as $rule) {
                if ($rule === 'required' && (!isset($data[$field]) || trim($data[$field]) === '')) {
                    $errors[$field][] = "Trường {$field} là bắt buộc.";
                }
                if ($rule === 'email' && isset($data[$field]) && !filter_var($data[$field], FILTER_VALIDATE_EMAIL)) {
                    $errors[$field][] = "Trường {$field} phải là email hợp lệ.";
                }
                if ($rule === 'numeric' && isset($data[$field]) && !is_numeric($data[$field])) {
                    $errors[$field][] = "Trường {$field} phải là số.";
                }
            }
        }
        return $errors;
    }
}
