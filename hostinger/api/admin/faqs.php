<?php
require __DIR__ . '/../bootstrap.php';
require_once dirname(__DIR__, 2) . '/lib/crud.php';
$cols = ['question', 'answer', 'sort_order'];
crud_handle('faqs', $cols, function($b) {
  return [
    'question' => v_str($b['question'] ?? '', 1, 500),
    'answer' => v_str($b['answer'] ?? '', 1, 5000),
    'sort_order' => v_int($b['sort_order'] ?? 0, -10000, 10000),
  ];
});
