<?php
namespace Core;

class Router {
    public function dispatch($uri) {
        $path = trim(parse_url($uri, PHP_URL_PATH), '/');

        if (preg_match('#^courses/(.+)$#', $path, $matches)) {
            return ['controller' => 'Courses', 'action' => 'view', 'params' => $matches[1]];
        }
        if ($path === 'login') {
            return ['controller' => 'Auth', 'action' => 'login'];
        }
        return ['controller' => 'Error', 'action' => 'notFound'];
    }
}
