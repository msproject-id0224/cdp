<?php

namespace App\Exceptions;

use Exception;

/**
 * Dilempar ChatService::send() saat pesan tidak punya teks maupun lampiran
 * -- baik ChatMessageController (web) maupun Api\V1\ChatController
 * menangkap ini untuk membentuk respons masing-masing (format pesan error
 * di sisi web dipertahankan persis seperti sebelum diekstrak).
 */
class EmptyChatMessageException extends Exception
{
    //
}
