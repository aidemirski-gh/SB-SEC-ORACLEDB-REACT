package com.dev.crm.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HealthController {

    private final MessageSource messageSource;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Locale locale = LocaleContextHolder.getLocale();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", messageSource.getMessage("health.status.running", null, locale));
        response.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, String>> info() {
        Locale locale = LocaleContextHolder.getLocale();
        Map<String, String> response = new HashMap<>();
        response.put("application", messageSource.getMessage("health.application.name", null, locale));
        response.put("version", "1.0.0");
        response.put("description", messageSource.getMessage("health.application.description", null, locale));
        return ResponseEntity.ok(response);
    }
}
