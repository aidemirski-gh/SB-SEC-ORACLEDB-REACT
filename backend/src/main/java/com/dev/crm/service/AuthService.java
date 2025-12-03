package com.dev.crm.service;

import com.dev.crm.dto.AuthResponseDTO;
import com.dev.crm.dto.LoginRequestDTO;
import com.dev.crm.dto.RegisterRequestDTO;
import com.dev.crm.entity.User;
import com.dev.crm.exception.ResourceConflictException;
import com.dev.crm.exception.ResourceNotFoundException;
import com.dev.crm.repository.UserRepository;
import com.dev.crm.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final MessageSource messageSource;

    public AuthResponseDTO register(RegisterRequestDTO registerRequest) {
        Locale locale = LocaleContextHolder.getLocale();

        // Check if username already exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            String message = messageSource.getMessage("error.username.taken", null, locale);
            throw new ResourceConflictException(message);
        }

        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            String message = messageSource.getMessage("error.email.inuse", null, locale);
            throw new ResourceConflictException(message);
        }

        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setRole("ROLE_USER");
        user.setEnabled(true);
        user.setLanguagePreference(
            registerRequest.getLanguagePreference() != null ?
            registerRequest.getLanguagePreference() : "en"
        );

        User savedUser = userRepository.save(user);

        // Authenticate user and generate token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getUsername(),
                        registerRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        return new AuthResponseDTO(
                token,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getRole(),
                savedUser.getLanguagePreference()
        );
    }

    public AuthResponseDTO login(LoginRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        Locale locale = LocaleContextHolder.getLocale();
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> {
                    String message = messageSource.getMessage("error.user.notfound", null, locale);
                    return new ResourceNotFoundException(message);
                });

        return new AuthResponseDTO(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getLanguagePreference()
        );
    }
}
