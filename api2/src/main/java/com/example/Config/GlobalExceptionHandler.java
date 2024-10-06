package com.example.Config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handleHttpException(ResponseStatusException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("code", ex.getStatusCode().value());  
        response.put("message", getCustomMessage(ex.getStatusCode().value()));  
        return new ResponseEntity<>(response, ex.getStatusCode());
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Object> handleNotFoundException(NoHandlerFoundException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("code", HttpStatus.NOT_FOUND.value());
        response.put("message", "Resource not found");
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("code", HttpStatus.UNPROCESSABLE_ENTITY.value());
        response.put("message", "Unprocessable");
        return new ResponseEntity<>(response, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGenericException(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put("message", "Internal server error");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private String getCustomMessage(int statusCode) {
        Map<Integer, String> customMessages = new HashMap<>();
        customMessages.put(401, "Unauthorized");
        customMessages.put(403, "Forbidden");
        customMessages.put(404, "Resource not found");
        customMessages.put(406, "Not accepted");
        customMessages.put(408, "Timeout, try again later");
        customMessages.put(422, "Unprocessable");
        customMessages.put(500, "Internal server error");

        return customMessages.getOrDefault(statusCode, "Error");
    }
}
