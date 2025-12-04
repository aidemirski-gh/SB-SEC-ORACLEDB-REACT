package com.dev.crm.service;

import com.dev.crm.dto.PrivilegeCreateDTO;
import com.dev.crm.dto.PrivilegeDTO;
import com.dev.crm.dto.PrivilegeUpdateDTO;
import com.dev.crm.entity.Privilege;
import com.dev.crm.exception.ResourceConflictException;
import com.dev.crm.exception.ResourceNotFoundException;
import com.dev.crm.mapper.PrivilegeMapper;
import com.dev.crm.repository.PrivilegeRepository;
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
public class PrivilegeService {

    private final PrivilegeRepository privilegeRepository;
    private final PrivilegeMapper privilegeMapper;
    private final MessageSource messageSource;

    /**
     * Get all privileges
     */
    @Transactional(readOnly = true)
    public List<PrivilegeDTO> getAllPrivileges() {
        List<Privilege> privileges = privilegeRepository.findAll();
        List<PrivilegeDTO> dtos = privilegeMapper.toDTOList(privileges);

        // Set role counts
        for (PrivilegeDTO dto : dtos) {
            long count = privilegeRepository.countRolesByPrivilege(dto.getId());
            dto.setRoleCount(count);
        }

        return dtos;
    }

    /**
     * Get privilege by ID
     */
    @Transactional(readOnly = true)
    public PrivilegeDTO getPrivilegeById(Long id) {
        Locale locale = LocaleContextHolder.getLocale();
        Privilege privilege = privilegeRepository.findById(id)
            .orElseThrow(() -> {
                String message = messageSource.getMessage("error.privilege.notfound",
                    new Object[]{id}, locale);
                return new ResourceNotFoundException(message);
            });

        PrivilegeDTO dto = privilegeMapper.toDTO(privilege);
        dto.setRoleCount(privilegeRepository.countRolesByPrivilege(id));
        return dto;
    }

    /**
     * Get privileges by category
     */
    @Transactional(readOnly = true)
    public List<PrivilegeDTO> getPrivilegesByCategory(String category) {
        List<Privilege> privileges = privilegeRepository.findByCategory(category);
        List<PrivilegeDTO> dtos = privilegeMapper.toDTOList(privileges);

        for (PrivilegeDTO dto : dtos) {
            long count = privilegeRepository.countRolesByPrivilege(dto.getId());
            dto.setRoleCount(count);
        }

        return dtos;
    }

    /**
     * Get all privilege categories
     */
    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        return privilegeRepository.findAllCategories();
    }

    /**
     * Create new privilege
     */
    public PrivilegeDTO createPrivilege(PrivilegeCreateDTO createDTO) {
        Locale locale = LocaleContextHolder.getLocale();

        // Check if privilege name already exists
        if (privilegeRepository.existsByName(createDTO.getName())) {
            String message = messageSource.getMessage("error.privilege.exists",
                new Object[]{createDTO.getName()}, locale);
            throw new ResourceConflictException(message);
        }

        Privilege privilege = privilegeMapper.toEntity(createDTO);
        Privilege savedPrivilege = privilegeRepository.save(privilege);

        PrivilegeDTO dto = privilegeMapper.toDTO(savedPrivilege);
        dto.setRoleCount(0);
        return dto;
    }

    /**
     * Update privilege
     */
    public PrivilegeDTO updatePrivilege(Long id, PrivilegeUpdateDTO updateDTO) {
        Locale locale = LocaleContextHolder.getLocale();

        Privilege privilege = privilegeRepository.findById(id)
            .orElseThrow(() -> {
                String message = messageSource.getMessage("error.privilege.notfound",
                    new Object[]{id}, locale);
                return new ResourceNotFoundException(message);
            });

        privilegeMapper.updateEntityFromDTO(updateDTO, privilege);
        Privilege updatedPrivilege = privilegeRepository.save(privilege);

        PrivilegeDTO dto = privilegeMapper.toDTO(updatedPrivilege);
        dto.setRoleCount(privilegeRepository.countRolesByPrivilege(id));
        return dto;
    }

    /**
     * Delete privilege
     */
    public void deletePrivilege(Long id) {
        Locale locale = LocaleContextHolder.getLocale();

        Privilege privilege = privilegeRepository.findById(id)
            .orElseThrow(() -> {
                String message = messageSource.getMessage("error.privilege.notfound",
                    new Object[]{id}, locale);
                return new ResourceNotFoundException(message);
            });

        // Check if privilege is assigned to any roles
        long roleCount = privilegeRepository.countRolesByPrivilege(id);
        if (roleCount > 0) {
            String message = messageSource.getMessage("error.privilege.hasroles.nodelete",
                new Object[]{privilege.getName(), roleCount}, locale);
            throw new ResourceConflictException(message);
        }

        privilegeRepository.delete(privilege);
    }

    /**
     * Get privilege by name (internal use)
     */
    @Transactional(readOnly = true)
    public Privilege getPrivilegeByName(String name) {
        Locale locale = LocaleContextHolder.getLocale();
        return privilegeRepository.findByName(name)
            .orElseThrow(() -> {
                String message = messageSource.getMessage("error.privilege.notfound",
                    new Object[]{name}, locale);
                return new ResourceNotFoundException(message);
            });
    }
}
