package com.dev.crm.service;

import com.dev.crm.dto.PrivilegeDTO;
import com.dev.crm.dto.RoleCreateDTO;
import com.dev.crm.dto.RoleDTO;
import com.dev.crm.dto.RolePrivilegesUpdateDTO;
import com.dev.crm.dto.RoleUpdateDTO;
import com.dev.crm.entity.Privilege;
import com.dev.crm.entity.Role;
import com.dev.crm.exception.ResourceConflictException;
import com.dev.crm.exception.ResourceNotFoundException;
import com.dev.crm.exception.RoleOperationException;
import com.dev.crm.mapper.PrivilegeMapper;
import com.dev.crm.mapper.RoleMapper;
import com.dev.crm.repository.PrivilegeRepository;
import com.dev.crm.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final PrivilegeRepository privilegeRepository;
    private final RoleMapper roleMapper;
    private final PrivilegeMapper privilegeMapper;
    private final MessageSource messageSource;

    @Transactional(readOnly = true)
    public List<RoleDTO> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        List<RoleDTO> roleDTOs = roleMapper.toDTOList(roles);

        // Set user count for each role
        for (RoleDTO roleDTO : roleDTOs) {
            long userCount = roleRepository.countUsersByRole(roleDTO.getId());
            roleDTO.setUserCount(userCount);
        }

        return roleDTOs;
    }

    @Transactional(readOnly = true)
    public RoleDTO getRoleById(Long id) {
        Locale locale = LocaleContextHolder.getLocale();
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> {
                String message = messageSource.getMessage(
                    "error.role.notfound",
                    new Object[]{id},
                    locale
                );
                return new ResourceNotFoundException(message);
            });

        RoleDTO roleDTO = roleMapper.toDTO(role);
        roleDTO.setUserCount(roleRepository.countUsersByRole(id));
        return roleDTO;
    }

    @Transactional
    public RoleDTO createRole(RoleCreateDTO createDTO) {
        Locale locale = LocaleContextHolder.getLocale();

        // Check if role name already exists
        if (roleRepository.existsByName(createDTO.getName())) {
            String message = messageSource.getMessage(
                "error.role.exists",
                new Object[]{createDTO.getName()},
                locale
            );
            throw new ResourceConflictException(message);
        }

        Role role = roleMapper.toEntity(createDTO);
        role.setSystemRole(false); // Custom roles are never system roles
        Role savedRole = roleRepository.save(role);

        RoleDTO roleDTO = roleMapper.toDTO(savedRole);
        roleDTO.setUserCount(0); // New role has no users
        return roleDTO;
    }

    @Transactional
    public RoleDTO updateRole(Long id, RoleUpdateDTO updateDTO) {
        Locale locale = LocaleContextHolder.getLocale();

        Role role = roleRepository.findById(id)
            .orElseThrow(() -> {
                String message = messageSource.getMessage(
                    "error.role.notfound",
                    new Object[]{id},
                    locale
                );
                return new ResourceNotFoundException(message);
            });

        // Update only description (name and systemRole are immutable)
        roleMapper.updateEntityFromDTO(updateDTO, role);
        Role updatedRole = roleRepository.save(role);

        RoleDTO roleDTO = roleMapper.toDTO(updatedRole);
        roleDTO.setUserCount(roleRepository.countUsersByRole(id));
        return roleDTO;
    }

    @Transactional
    public void deleteRole(Long id) {
        Locale locale = LocaleContextHolder.getLocale();

        Role role = roleRepository.findById(id)
            .orElseThrow(() -> {
                String message = messageSource.getMessage(
                    "error.role.notfound",
                    new Object[]{id},
                    locale
                );
                return new ResourceNotFoundException(message);
            });

        // Check if it's a system role
        if (role.isSystemRole()) {
            String message = messageSource.getMessage(
                "error.role.systemrole.nodelete",
                null,
                locale
            );
            throw new RoleOperationException(message);
        }

        // Check if role has users assigned
        long userCount = roleRepository.countUsersByRole(id);
        if (userCount > 0) {
            String message = messageSource.getMessage(
                "error.role.harusers.nodelete",
                new Object[]{role.getName(), userCount},
                locale
            );
            throw new RoleOperationException(message);
        }

        roleRepository.delete(role);
    }

    @Transactional(readOnly = true)
    public Role getRoleByName(String name) {
        Locale locale = LocaleContextHolder.getLocale();
        return roleRepository.findByName(name)
            .orElseThrow(() -> {
                String message = messageSource.getMessage(
                    "error.role.notfound",
                    new Object[]{name},
                    locale
                );
                return new ResourceNotFoundException(message);
            });
    }

    /**
     * Get privileges assigned to a role
     */
    @Transactional(readOnly = true)
    public Set<PrivilegeDTO> getRolePrivileges(Long roleId) {
        Locale locale = LocaleContextHolder.getLocale();
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> {
                String message = messageSource.getMessage(
                    "error.role.notfound",
                    new Object[]{roleId},
                    locale
                );
                return new ResourceNotFoundException(message);
            });

        return privilegeMapper.toDTOSet(role.getPrivileges());
    }

    /**
     * Update privileges for a role
     */
    @Transactional
    public RoleDTO updateRolePrivileges(Long roleId, RolePrivilegesUpdateDTO privilegesDTO) {
        Locale locale = LocaleContextHolder.getLocale();

        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> {
                String message = messageSource.getMessage(
                    "error.role.notfound",
                    new Object[]{roleId},
                    locale
                );
                return new ResourceNotFoundException(message);
            });

        // Load all requested privileges
        Set<Privilege> privileges = new HashSet<>();
        for (Long privilegeId : privilegesDTO.getPrivilegeIds()) {
            Privilege privilege = privilegeRepository.findById(privilegeId)
                .orElseThrow(() -> {
                    String message = messageSource.getMessage(
                        "error.privilege.notfound",
                        new Object[]{privilegeId},
                        locale
                    );
                    return new ResourceNotFoundException(message);
                });
            privileges.add(privilege);
        }

        // Update role privileges
        role.getPrivileges().clear();
        role.getPrivileges().addAll(privileges);
        Role updatedRole = roleRepository.save(role);

        RoleDTO roleDTO = roleMapper.toDTO(updatedRole);
        roleDTO.setUserCount(roleRepository.countUsersByRole(roleId));
        return roleDTO;
    }

    /**
     * Add privilege to role
     */
    @Transactional
    public RoleDTO addPrivilegeToRole(Long roleId, Long privilegeId) {
        Locale locale = LocaleContextHolder.getLocale();

        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> {
                String message = messageSource.getMessage(
                    "error.role.notfound",
                    new Object[]{roleId},
                    locale
                );
                return new ResourceNotFoundException(message);
            });

        Privilege privilege = privilegeRepository.findById(privilegeId)
            .orElseThrow(() -> {
                String message = messageSource.getMessage(
                    "error.privilege.notfound",
                    new Object[]{privilegeId},
                    locale
                );
                return new ResourceNotFoundException(message);
            });

        role.getPrivileges().add(privilege);
        Role updatedRole = roleRepository.save(role);

        RoleDTO roleDTO = roleMapper.toDTO(updatedRole);
        roleDTO.setUserCount(roleRepository.countUsersByRole(roleId));
        return roleDTO;
    }

    /**
     * Remove privilege from role
     */
    @Transactional
    public RoleDTO removePrivilegeFromRole(Long roleId, Long privilegeId) {
        Locale locale = LocaleContextHolder.getLocale();

        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> {
                String message = messageSource.getMessage(
                    "error.role.notfound",
                    new Object[]{roleId},
                    locale
                );
                return new ResourceNotFoundException(message);
            });

        Privilege privilege = privilegeRepository.findById(privilegeId)
            .orElseThrow(() -> {
                String message = messageSource.getMessage(
                    "error.privilege.notfound",
                    new Object[]{privilegeId},
                    locale
                );
                return new ResourceNotFoundException(message);
            });

        role.getPrivileges().remove(privilege);
        Role updatedRole = roleRepository.save(role);

        RoleDTO roleDTO = roleMapper.toDTO(updatedRole);
        roleDTO.setUserCount(roleRepository.countUsersByRole(roleId));
        return roleDTO;
    }
}
