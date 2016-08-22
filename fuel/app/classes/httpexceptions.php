<?php

namespace Fuel\Core;

class HttpBadRequestException extends \HttpException {
    public function response() {
        return new \Response(null, 400);
    }
}

class HttpUnauthorizedException extends \HttpException {
    public function response() {
        return new \Response(null, 401);
    }
}

class HttpForbiddenException extends \HttpException {
    public function response() {
        return new \Response(null, 403);
    }
}

class HttpNotFoundException extends \HttpException {
    public function response() {
        return new \Response(null, 404);
    }
}

class HttpRequestTimeoutException extends \HttpException {
    public function response() {
        return new \Response(null, 408);
    }
}

class HttpUpgradeRequiredException extends \HttpException {
    public function response() {
        return new \Response(null, 426);
    }
}

class HttpServiceUnavailableException extends \HttpException {
    public function response() {
        return new \Response(null, 503);
    }
}
