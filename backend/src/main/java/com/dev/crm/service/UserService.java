package com.dev.crm.service;

import com.dev.crm.dto.UserDTO;
import com.dev.crm.dto.UserPreferencesUpdateDTO;
import com.dev.crm.entity.Role;
import com.dev.crm.entity.User;
import com.dev.crm.exception.ResourceNotFoundException;
import com.dev.crm.exception.RoleOperationException;
import com.dev.crm.mapper.UserMapper;
import com.dev.crm.repository.RoleRepository;
import com.dev.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final MessageSource messageSource;

    /**
     * Update user language preference
     */
    public void updateLanguagePreference(Long userId, UserPreferencesUpdateDTO preferencesDTO) {
        Locale locale = LocaleContextHolder.getLocale();
        User user = userRepository.findById(userId)
            .orElseThrow(() -> {
                String message = messageSource.getMessage("error.user.notfound", null, locale);
                return new ResourceNotFoundException(message);
            });

        user.setLanguagePreference(preferencesDTO.getLanguagePreference());
        userRepository.save(user);
    }

    /**
     * Get all users (Admin only)
     */
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return userMapper.toDTOList(users);
    }

    /**
     * Get user by ID (Admin only)
     */
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        Locale locale = LocaleContextHolder.getLocale();
        User user = userRepository.findById(id)
            .orElseThrow(() -> {
                String message = messageSource.getMessage("error.user.notfound", null, locale);
                return new ResourceNotFoundException(message);
            });
        return userMapper.toDTO(user);
    }

    /**
     * Update user role (Admin only)
     * Prevents admin from changing their own role (privilege escalation prevention)
     */
    public UserDTO updateUserRole(Long userId, Long roleId, String adminUsername) {
        Locale locale = LocaleContextHolder.getLocale();

        // Load user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> {
                String message = messageSource.getMessage("error.user.notfound", null, locale);
                return new ResourceNotFoundException(message);
            });

        // Check if admin is trying to change their own role
        if (user.getUsername().equals(adminUsername)) {
            String message = messageSource.getMessage("error.user.cannotchangeownrole", null, locale);
            throw new RoleOperationException(message);
        }

        // Load role
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> {
                String message = messageSource.getMessage("error.role.notfound", new Object[]{roleId}, locale);
                return new ResourceNotFoundException(message);
            });

        // Update role - replace all roles with the new one
        user.getRoles().clear();
        user.getRoles().add(role);
        User updatedUser = userRepository.save(user);

        return userMapper.toDTO(updatedUser);
    }
}
